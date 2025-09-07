// app/register/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Firestore import'u düzeltildi: db olarak import ettik
import { FiHome } from "react-icons/fi";
import SocialLogin from "@/components/SocialLogin";
import DOMPurify from 'isomorphic-dompurify'; // Bu satırı ekleyin


// PasswordInput bileşeni RegisterPage dışına taşıyoruz
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
function PasswordInput({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
          onTouchStart={() => setShowPassword(true)}
          onTouchEnd={() => setShowPassword(false)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.968 9.968 0 012.223-3.607m1.89-1.89A9.96 9.96 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.922 3.52M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
    // role alanı kaldırıldı
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  // GÜVENLİ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Input sanitization with field-specific limits
    let sanitizedValue = DOMPurify.sanitize(value);

    // Field-specific validation and limits
    switch (name) {
      case 'firstName':
      case 'lastName':
        sanitizedValue = sanitizedValue.substring(0, 50);
        break;
      case 'email':
        sanitizedValue = sanitizedValue.substring(0, 100);
        break;
      case 'password':
      case 'confirmPassword':
        sanitizedValue = sanitizedValue.substring(0, 128);
        break;
      default:
        sanitizedValue = sanitizedValue.substring(0, 100);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Anlık şifre eşleşme kontrolü
    if (
      (name === "password" && formData.confirmPassword && sanitizedValue !== formData.confirmPassword) ||
      (name === "confirmPassword" && formData.password && sanitizedValue !== formData.password)
    ) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Form validasyonu
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    try {
      // Kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("User created:", userCredential.user);

      // Firestore'a kullanıcı dokümanını ekle (UID ile)
      // GÜVENLİ
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: DOMPurify.sanitize(formData.email.toLowerCase().trim()).substring(0, 100),
        firstName: DOMPurify.sanitize(formData.firstName.trim()).substring(0, 50),
        lastName: DOMPurify.sanitize(formData.lastName.trim()).substring(0, 50),
        role: "seller",
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log("User document created in Firestore");

      // Doğrulama e-postası gönder
      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent");

      // Kullanıcıyı oturumdan çıkar (e-posta doğrulanana kadar giriş yapamaması için)
      await auth.signOut();

      setEmailSent(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("This email address is already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Minimum 6 characters");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection.");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later.");
          break;
        default:
          setError(`Registration error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLoginSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  };

  const handleSocialLoginError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      // Kullanıcıyı tekrar oluştur (e-posta doğrulanmamışsa)
      // GÜVENLİ
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        DOMPurify.sanitize(formData.email.toLowerCase().trim()),
        formData.password // Password zaten sanitize edildi handleChange'de
      );

      // Doğrulama e-postasını tekrar gönder
      await sendEmailVerification(userCredential.user);

      // Kullanıcıyı oturumdan çıkar
      await auth.signOut();

      alert("Verification email resent successfully!");
    } catch (error: any) {
      console.error("Resend email error:", error);
      setError("Failed to resend verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // E-posta gönderildi sayfası
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
        {/* Ana Sayfaya Dönüş Butonu */}
        <Link href="/" className="fixed top-6 left-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
          <FiHome className="h-5 w-5 mr-1" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{formData.email}</strong>.
            Please check your inbox and click the verification link to activate your account.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you don't see the email, check your spam folder.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Resend Email"}
            </button>
            <Link
              href="/login"
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Başarılı kayıt sayfası (sadece sosyal medya ile kayıt için)
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
        {/* Ana Sayfaya Dönüş Butonu */}
        <Link href="/" className="fixed top-6 left-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
          <FiHome className="h-5 w-5 mr-1" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. Redirecting to dashboard...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Ana Sayfaya Dönüş Butonu */}
      <Link href="/" className="fixed top-6 left-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
        <FiHome className="h-5 w-5 mr-1" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Seller Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your last name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="example@email.com"
              />
            </div>
            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="•••••••••"
              required
              autoComplete="new-password"
              label="Password"
            />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="•••••••••"
              required
              autoComplete="new-password"
              label="Confirm Password"
            />
          </div>
          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>{' '}
              I have read and agree to.
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V8a8 8 0 018-0z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <span>Create Seller Account</span>
              )}
            </button>
          </div>
        </form>

        <SocialLogin
          isLogin={false}
          onSuccess={handleSocialLoginSuccess}
          onError={handleSocialLoginError}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 MarketPlace. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}