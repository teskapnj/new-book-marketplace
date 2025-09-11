// components/SocialLogin.tsx
"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import DOMPurify from 'isomorphic-dompurify';

interface SocialLoginProps {
  isLogin?: boolean;
  onSuccess?: (user?: any) => void;
  onError?: (error: string) => void;
}

export default function SocialLogin({ isLogin = true, onSuccess, onError }: SocialLoginProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    console.log('Google login started');
    setLoading(true);
    
    try {
      const authProvider = new GoogleAuthProvider();
      console.log('About to call signInWithPopup...');
      
      const result = await signInWithPopup(auth, authProvider);
      console.log('Google login successful:', result);

      if (onSuccess) {
        console.log('Calling onSuccess with user:', result.user);
        onSuccess(result.user);
      }
    } catch (error: any) {
      console.error('Google login error:', error);

      let errorMessage = "An error occurred during Google authentication";

      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with the same email address but different sign-in credentials";
          break;
        case "auth/cancelled-popup-request":
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in was cancelled";
          break;
        case "auth/popup-blocked":
          errorMessage = "The popup was blocked by the browser";
          break;
        case "auth/unauthorized-domain":
          errorMessage = "The domain is not authorized";
          break;
        case "auth/internal-error":
          errorMessage = "Firebase internal error. Please check your configuration.";
          break;
        default:
          errorMessage = DOMPurify.sanitize(error.message || "An unknown error occurred").substring(0, 200);
      }

      if (onError) {
        console.log('Calling onError with message:', errorMessage);
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookClick = () => {
    // Facebook henüz aktif değil - sessizce ignore et
    console.log('Facebook login coming soon...');
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with {isLogin ? "signing in" : "signing up"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {/* Google Button - Active */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <FcGoogle className="h-5 w-5" />
          <span className="sr-only">Sign in with Google</span>
        </button>

        {/* Facebook Button - Disabled but Visible */}
        <button
          onClick={handleFacebookClick}
          disabled={true}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed opacity-50"
          title="Coming soon"
        >
          <FaFacebook className="h-5 w-5 text-blue-400" />
          <span className="sr-only">Facebook login coming soon</span>
        </button>
      </div>
    </div>
  );
}