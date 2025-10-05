"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, User } from "firebase/auth";
import { doc, getDoc, setDoc, DocumentData } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import SocialLogin from "@/components/SocialLogin";
import { FiHome, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import DOMPurify from 'isomorphic-dompurify';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | SellBook Media',
  description: 'Sign in to your SellBook Media account to manage your listings, track payments, and view shipping details.',
  alternates: { canonical: 'https://www.sellbookmedia.com/login' },
}

// Custom Password Input Component with Hold-to-Show functionality
const PasswordInputHold = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  className
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  
  const handleMouseDown = () => {
    setIsHolding(true);
    setShowPassword(true);
  };
  
  const handleMouseUp = () => {
    setIsHolding(false);
    setShowPassword(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsHolding(true);
    setShowPassword(true);
  };
  
  const handleTouchEnd = () => {
    setIsHolding(false);
    setShowPassword(false);
  };
  
  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <FiEye className="h-5 w-5" />
          ) : (
            <FiEyeOff className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

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

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState<Record<string, number>>({});
  const [lockoutTimes, setLockoutTimes] = useState<Record<string, number>>({});
  
  // Rate limiting kontrolü - EMAIL BAZLI
  useEffect(() => {
    const attempts = localStorage.getItem('loginAttempts');
    const lockouts = localStorage.getItem('lockoutTimes');
    
    if (attempts) {
      try {
        setLoginAttempts(JSON.parse(attempts));
      } catch (e) {
        console.error("Failed to parse login attempts", e);
        setLoginAttempts({});
      }
    }
    
    if (lockouts) {
      try {
        const parsedLockouts = JSON.parse(lockouts);
        // Süresi dolan lockout'ları temizle
        const now = Date.now();
        const cleanedLockouts: Record<string, number> = {};
        let hasValidLockout = false;
        
        Object.keys(parsedLockouts).forEach(email => {
          if (parsedLockouts[email] > now) {
            cleanedLockouts[email] = parsedLockouts[email];
            hasValidLockout = true;
          }
        });
        
        if (hasValidLockout) {
          setLockoutTimes(cleanedLockouts);
          localStorage.setItem('lockoutTimes', JSON.stringify(cleanedLockouts));
        } else {
          setLockoutTimes({});
          localStorage.removeItem('lockoutTimes');
        }
      } catch (e) {
        console.error("Failed to parse lockout times", e);
        setLockoutTimes({});
      }
    }
  }, []);
  
  // Check user role and redirect - GÜVENLİ APPROACH
  const checkUserRoleAndRedirect = async (userId: string, firebaseUser: User) => {
    try {
      console.log("Checking user role for:", userId);
      const userDoc = await getDoc(doc(db, "users", userId));
      
      // GÜVENLİ - Firebase Authentication'dan e-posta doğrulama kontrolü
      if (!firebaseUser.emailVerified) {
        console.log("User email not verified in Firebase Auth");
        setError("Please verify your email before logging in. Check your inbox for the verification email.");
        setLoading(false);
        // Kullanıcıyı oturumdan çıkar
        await auth.signOut();
        return;
      }
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as DocumentData;
        const userRole = userData.role || "seller";
        const userStatus = userData.status || "active";
        
        // Check if user account is active
        if (userStatus !== "active") {
          console.log("User account is not active:", userStatus);
          setError("Your account is not active. Please contact the administrator to activate your account.");
          setLoading(false);
          return;
        }
        
        console.log("User role detected:", userRole);
        
        // Store only non-sensitive data in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", userData.name || "User");
        
        // ÇİFT KONTROLLÜ ADMIN REDIRECT - GÜVENLİ
        if (await isAdminUser(userData.email || firebaseUser.email || "", userId)) {
          console.log("Admin access granted - both Firestore role and environment email verified");
          router.push("/admin/dashboard");
        } else if (userRole === "buyer") {
          console.log("Redirecting to listing page");
          router.push("/listings");
        } else {
          console.log("Redirecting to create listing page");
          router.push("/create-listing");
        }
      } else {
        console.warn("User document not found, creating default profile");
        // Create default user profile in Firestore
        const defaultUserData = {
          uid: userId,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "User",
          role: "seller",
          status: "active",
          // Firestore'dan emailVerified kaldırıldı
          createdAt: new Date(),
          totalSales: 0,
          totalOrders: 0,
          totalListings: 0,
          balance: 0,
          commissionRate: 10,
          lastLogin: new Date()
        };
        await setDoc(doc(db, "users", userId), defaultUserData);
        console.log("Default user profile created");
        
        // Store only non-sensitive data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", firebaseUser.displayName || "User");
        
        // Redirect to create listing page
        console.log("Redirecting to create listing page");
        router.push("/create-listing");
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      setError("Failed to load user profile. Please try again.");
      setLoading(false);
    }
  };
  
  // Redirect to appropriate page if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      checkUserRoleAndRedirect(user.uid, user);
    }
  }, [user, authLoading]);
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }
  
  // GÜVENLİ - DÜZELTİLMİŞ VERSİYON
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      // Input sanitization with field-specific limits
      let sanitizedValue = DOMPurify.sanitize(value);
      
      // Field-specific validation
      switch (name) {
        case 'email':
          sanitizedValue = sanitizedValue.toLowerCase().trim().substring(0, 100);
          break;
        case 'password':
          sanitizedValue = sanitizedValue.substring(0, 128);
          break;
        default:
          sanitizedValue = sanitizedValue.substring(0, 100);
      }
      
      // HER DURUMDA formData'yı güncelle
      setFormData({
        ...formData,
        [name]: sanitizedValue
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Form doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    // EMAIL BAZLI Rate limiting kontrolü
    const currentEmail = formData.email.toLowerCase();
    const currentLockoutTime = lockoutTimes[currentEmail];
    
    if (currentLockoutTime && currentLockoutTime > Date.now()) {
      const remainingTime = Math.ceil((currentLockoutTime - Date.now()) / 60000);
      setError(`Too many failed attempts. Please try again in ${remainingTime} minutes.`);
      return;
    }
    
    const currentAttempts = loginAttempts[currentEmail] || 0;
    if (currentAttempts >= 5) {
      // 5 başarısız denemeden sonra 15 dakika kilit
      const newLockoutTime = Date.now() + 15 * 60 * 1000;
      const newLockoutTimes = {
        ...lockoutTimes,
        [currentEmail]: newLockoutTime
      };
      setLockoutTimes(newLockoutTimes);
      localStorage.setItem('lockoutTimes', JSON.stringify(newLockoutTimes));
      setError("Too many failed attempts. Please try again later.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Set Firebase persistence based on remember me checkbox
      if (formData.rememberMe) {
        await setPersistence(auth, browserLocalPersistence);
      } else {
        await setPersistence(auth, browserSessionPersistence);
      }
      
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("Firebase login successful:", userCredential.user.email);
      
      // GÜVENLİ - Firebase Authentication'dan e-posta doğrulama kontrolü
      if (!userCredential.user.emailVerified) {
        console.log("User email not verified in Firebase Auth");
        setError("Please verify your email before logging in. Check your inbox for the verification email.");
        setLoading(false);
        // Kullanıcıyı oturumdan çıkar
        await auth.signOut();
        return;
      }
      
      // Başarılı girişte deneme sayacını sıfırla
      const newLoginAttempts = { ...loginAttempts };
      delete newLoginAttempts[currentEmail];
      setLoginAttempts(newLoginAttempts);
      localStorage.setItem('loginAttempts', JSON.stringify(newLoginAttempts));
      
      // Lockout zamanını temizle
      const newLockoutTimes = { ...lockoutTimes };
      delete newLockoutTimes[currentEmail];
      setLockoutTimes(newLockoutTimes);
      localStorage.setItem('lockoutTimes', JSON.stringify(newLockoutTimes));
      
      // GÜVENLİ - Kullanıcı bilgilerini güncelle
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as DocumentData;
        
        // Update last login time
        await setDoc(doc(db, "users", userCredential.user.uid), {
          ...userData,
          lastLogin: new Date()
        }, { merge: true });
        
        // Store only non-sensitive session data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", DOMPurify.sanitize(userData.name || userData.displayName || "User").substring(0, 50));
        
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        
        // Çift kontrollü admin redirect - GÜVENLİ
        if (await isAdminUser(formData.email, userCredential.user.uid)) {
          console.log("Admin access granted - both Firestore role and environment email verified");
          router.push("/admin/dashboard");
        } else if (userData.role === "buyer") {
          console.log("Redirecting to listing page");
          router.push("/listings");
        } else {
          console.log("Redirecting to create listing page");
          router.push("/create-listing");
        }
      } else {
        // User document doesn't exist, create default profile in Firestore
        console.warn("User document not found, creating default profile");
        const defaultUserData = {
          uid: userCredential.user.uid,
          email: formData.email,
          name: userCredential.user.displayName || "User",
          role: "seller",
          status: "active",
          // Firestore'dan emailVerified kaldırıldı
          createdAt: new Date(),
          totalSales: 0,
          totalOrders: 0,
          totalListings: 0,
          balance: 0,
          commissionRate: 10,
          lastLogin: new Date()
        };
        
        // Create user profile in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), defaultUserData);
        console.log("Default user profile created in Firestore");
        
        // Store only non-sensitive data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", DOMPurify.sanitize(userCredential.user.displayName || "User").substring(0, 50));
        
        // Redirect to create listing page
        console.log("Redirecting to create listing page");
        router.push("/create-listing");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // EMAIL BAZLI Başarısız girişte deneme sayısını artır
      const newAttempts = {
        ...loginAttempts,
        [currentEmail]: (loginAttempts[currentEmail] || 0) + 1
      };
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', JSON.stringify(newAttempts));
      
      // Firebase error handling with simplified messages
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLoginSuccess = async (socialUser: User) => {
    try {
      // Check if user exists in Firestore for social login - FRESH DATA
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
          // Firestore'dan emailVerified kaldırıldı
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
  
  // Kalan kilitleme süresini hesapla - EMAIL BAZLI
  const getRemainingLockoutTime = () => {
    const currentEmail = formData.email.toLowerCase();
    const lockoutTime = lockoutTimes[currentEmail];
    
    if (!lockoutTime || lockoutTime <= Date.now()) return null;
    return Math.ceil((lockoutTime - Date.now()) / 60000);
  };
  
  const remainingTime = getRemainingLockoutTime();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Back to Home Button */}
      <Link href="/" className="fixed top-4 left-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
        <FiHome className="h-5 w-5 mr-1" />
        <span className="font-medium">Back to Home</span>
      </Link>
      
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            {/* DÜZELTİLMİŞ LOGO - Kitap ikonu */}
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 9H7a1 1 0 100-2v2.586l-2.707 2.707a1 1 0 001.414 1.414L8.586 11H10a1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <PasswordInputHold
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Hold the eye icon to reveal your password
              </p>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (remainingTime !== null && remainingTime > 0)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V8a8 8 0 018-0z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : remainingTime !== null && remainingTime > 0 ? (
                <span className="flex items-center justify-center">
                  Account Locked ({remainingTime} min)
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l-4-4m4 4h12" />
                  </svg>
                  Sign In
                </span>
              )}
            </button>
          </form>
          
          {/* Social Login Component */}
          <SocialLogin
            isLogin={true}
            onSuccess={handleSocialLoginSuccess}
            onError={handleSocialLoginError}
          />
        </div>
        
        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
        
        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 SellBook Media. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/terms" className="hover:text-gray-700">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
            <Link href="/help" className="hover:text-gray-700">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
}