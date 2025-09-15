"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, sendEmailVerification, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, DocumentData } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { FiHome } from "react-icons/fi";
import SocialLogin from "@/components/SocialLogin";
import DOMPurify from 'isomorphic-dompurify';

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

// Çift kontrollü admin kontrolü - PAYLAŞILAN FONKSİYON
// Sadece Firestore role kontrolü - GÜVENLİ
const isAdminUser = async (email: string, uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      console.log("User document not found for admin check");
      return false;
    }
    const userData = userDoc.data() as DocumentData;
    const userRole = userData.role;
    console.log("Checking admin role for user:", email);
    console.log("User role from Firestore:", userRole);
    
    // Sadece Firestore'daki role bilgisine bak
    if (userRole === "admin") {
      console.log("Admin role confirmed");
      return true;
    }
    console.log("Not an admin user");
    return false;
  } catch (error) {
    console.error("Admin kontrol hatası:", error);
    return false;
  }
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registrationAttempts, setRegistrationAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  
  const router = useRouter();
  
  // Rate limiting kontrolü
  useEffect(() => {
    const attempts = localStorage.getItem('registrationAttempts');
    const lockout = localStorage.getItem('registrationLockout');
    
    if (attempts) {
      setRegistrationAttempts(parseInt(attempts));
    }
    
    if (lockout) {
      const lockoutTimeValue = parseInt(lockout);
      if (lockoutTimeValue > Date.now()) {
        setLockoutTime(lockoutTimeValue);
      } else {
        // Lockout süresi geçti, sıfırla
        localStorage.removeItem('registrationAttempts');
        localStorage.removeItem('registrationLockout');
        setRegistrationAttempts(0);
        setLockoutTime(null);
      }
    }
  }, []);
  
  // Parola gücünü kontrol et - ÖZEL KARAKTER KONTROLÜ KALDIRILDI
  const checkPasswordStrength = (password: string): number => {
    let strength = 0;
    let feedback = "";
    
    // Uzunluk kontrolü
    if (password.length >= 8) strength += 1;
    else feedback = "Password should be at least 8 characters";
    
    // Büyük harf kontrolü
    if (/[A-Z]/.test(password)) strength += 1;
    else if (!feedback) feedback = "Include uppercase letters";
    
    // Küçük harf kontrolü
    if (/[a-z]/.test(password)) strength += 1;
    else if (!feedback) feedback = "Include lowercase letters";
    
    // Rakam kontrolü
    if (/[0-9]/.test(password)) strength += 1;
    else if (!feedback) feedback = "Include numbers";
    
    // Özel karakter kontrolü KALDIRILDI
    
    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
    
    return strength;
  };
  
  // GÜVENLİ - GELİŞTİRİLMİŞ VERSİYON
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Input sanitization with field-specific limits
    let sanitizedValue = DOMPurify.sanitize(value);
    
    // Field-specific validation and limits
    switch (name) {
      case 'firstName':
      case 'lastName':
        // Sadece harf ve boşluk karakterlerine izin ver
        sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s]/g, '').substring(0, 50);
        break;
      case 'email':
        // Email formatını doğrula
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (sanitizedValue && !emailRegex.test(sanitizedValue)) {
          setError("Please enter a valid email address");
        } else {
          setError("");
        }
        sanitizedValue = sanitizedValue.toLowerCase().trim().substring(0, 100);
        break;
      case 'password':
        // Parola gücünü kontrol et
        checkPasswordStrength(sanitizedValue);
        sanitizedValue = sanitizedValue.substring(0, 128);
        break;
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
    } else if (!error.includes("email")) {
      setError("");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Rate limiting kontrolü
    if (lockoutTime && lockoutTime > Date.now()) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 60000);
      setError(`Too many registration attempts. Please try again in ${remainingTime} minutes.`);
      return;
    }
    
    if (registrationAttempts >= 3) {
      // 3 başarısız denemeden sonra 15 dakika kilit
      const newLockoutTime = Date.now() + 15 * 60 * 1000;
      setLockoutTime(newLockoutTime);
      localStorage.setItem('registrationLockout', newLockoutTime.toString());
      setError("Too many registration attempts. Please try again later.");
      return;
    }
    
    // Form validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    // Parola gücü kontrolü - ÖZEL KARAKTER GEREKSİNİMİ KALDIRILDI
    if (passwordStrength < 3) {
      setError("Password is too weak. Please include uppercase, lowercase, and numbers.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("User created:", userCredential.user);
      
      // Başarılı kayıtta deneme sayacını sıfırla
      setRegistrationAttempts(0);
      localStorage.removeItem('registrationAttempts');
      localStorage.removeItem('registrationLockout');
      
      // Firestore'a kullanıcı dokümanını ekle (UID ile)
      // GÜVENLİ - E-posta doğrulanana kadar status "pending" olarak ayarlanıyor
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: DOMPurify.sanitize(formData.email.toLowerCase().trim()).substring(0, 100),
        firstName: DOMPurify.sanitize(formData.firstName.trim()).substring(0, 50),
        lastName: DOMPurify.sanitize(formData.lastName.trim()).substring(0, 50),
        role: "seller",
        status: "pending", // E-posta doğrulanana kadar beklemede
        emailVerified: false, // Firebase'deki emailVerified durumu
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: null,
        totalSales: 0,
        totalOrders: 0,
        totalListings: 0,
        balance: 0,
        commissionRate: 10
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
      
      // Başarısız girişte deneme sayısını artır
      const newAttempts = registrationAttempts + 1;
      setRegistrationAttempts(newAttempts);
      localStorage.setItem('registrationAttempts', newAttempts.toString());
      
      // Genel hata mesajları (bilgi sızıntısını önlemek için)
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address");
          break;
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later");
          break;
        default:
          setError("Registration failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // DÜZELTİLMİŞ SOSYAL GİRİŞ İŞLEMCİSİ
  const handleSocialLoginSuccess = async (socialUser: User) => {
    try {
      console.log("Social login successful:", socialUser.email);
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", socialUser.uid));
      let userRole = "seller"; // Default role for social login
      let userName = socialUser.displayName || "User";
      let userStatus = "active"; // Default status
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as DocumentData;
        userRole = userData.role || "seller";
        userName = userData.name || userData.displayName || socialUser.displayName || "User";
        userStatus = userData.status || "active";
        
        // Check if user account is active
        if (userStatus !== "active") {
          console.log("Social login user account is not active:", userStatus);
          setError("Your account is not active. Please contact the administrator to activate your account.");
          setLoading(false);
          return;
        }
        
        // Update last login
        await setDoc(doc(db, "users", socialUser.uid), {
          ...userData,
          lastLogin: new Date()
        }, { merge: true });
      } else {
        // Create profile for social login user
        const defaultUserData = {
          uid: socialUser.uid,
          email: socialUser.email || "",
          name: socialUser.displayName || "User",
          role: "seller",
          status: "active",
          createdAt: new Date(),
          totalSales: 0,
          totalOrders: 0,
          totalListings: 0,
          balance: 0,
          commissionRate: 10,
          lastLogin: new Date()
        };
        await setDoc(doc(db, "users", socialUser.uid), defaultUserData);
        console.log("Social login user profile created");
      }
      
      // Store only non-sensitive session data for social login
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", DOMPurify.sanitize(userName).substring(0, 50));
      
      // ÇİFT KONTROLLÜ ADMIN REDIRECT - GÜVENLİ
      if (await isAdminUser(socialUser.email || "", socialUser.uid)) {
        console.log("Social admin access granted - both Firestore role and environment email verified");
        router.push("/admin/dashboard");
      } else if (userRole === "buyer") {
        console.log("Redirecting to listing page");
        router.push("/listings");
      } else {
        console.log("Redirecting to create listing page");
        router.push("/create-listing");
      }
    } catch (error) {
      console.error("Social login role check error:", error);
      setError("Failed to complete social login. Please try again.");
      setLoading(false);
    }
  };
  
  const handleSocialLoginError = (errorMessage: string) => {
    setError(errorMessage);
  };
  
  const handleResendEmail = async () => {
    setLoading(true);
    try {
      // Kullanıcıyı tekrar oluştur (e-posta doğrulanmamışsa)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        DOMPurify.sanitize(formData.email.toLowerCase().trim()),
        formData.password
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
  
  // Parola gücü göstergesi
  const PasswordStrengthIndicator = () => {
    if (!formData.password) return null;
    
    let strengthColor = "";
    let strengthText = "";
    
    // Güç seviyeleri özel karakter olmadan güncellendi
    if (passwordStrength < 2) {
      strengthColor = "bg-red-500";
      strengthText = "Weak";
    } else if (passwordStrength < 3) {
      strengthColor = "bg-yellow-500";
      strengthText = "Medium";
    } else {
      strengthColor = "bg-green-500";
      strengthText = "Strong";
    }
    
    return (
      <div className="mt-1">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${strengthColor} h-2 rounded-full`} 
              style={{ width: `${(passwordStrength / 4) * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs font-medium text-gray-600">{strengthText}</span>
        </div>
        {passwordFeedback && (
          <p className="mt-1 text-xs text-red-600">{passwordFeedback}</p>
        )}
      </div>
    );
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
            Your account has been created successfully. Redirecting...
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
            
            <div>
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
              <PasswordStrengthIndicator />
            </div>
            
            <div>
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
              I have read and agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading || (lockoutTime !== null && lockoutTime > Date.now())}
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
              ) : lockoutTime !== null && lockoutTime > Date.now() ? (
                <span>Too many attempts. Try again later.</span>
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