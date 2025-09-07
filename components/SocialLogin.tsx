// components/SocialLogin.tsx
"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import DOMPurify from 'isomorphic-dompurify'; // Bu satırı ekleyin

interface SocialLoginProps {
  isLogin?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function SocialLogin({ isLogin = true, onSuccess, onError }: SocialLoginProps) {
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    try {
      let authProvider;
      
      switch (provider) {
        case "Google":
          authProvider = new GoogleAuthProvider();
          break;
        case "Facebook":
          authProvider = new FacebookAuthProvider();
          break;
        case "Twitter":
          authProvider = new TwitterAuthProvider();
          break;
        default:
          throw new Error("Invalid provider");
      }
      
      const result = await signInWithPopup(auth, authProvider);
      if (process.env.NODE_ENV === 'development') {
        console.log(`${provider} login successful`);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`${provider} login error:`, error);
      }
      
      let errorMessage = "An error occurred during authentication";
      
      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with the same email address but different sign-in credentials";
          break;
        case "auth/auth-domain-config-required":
          errorMessage = "Authentication domain configuration is required";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "The popup was closed by the user before finalizing the sign-in";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "The corresponding provider is not enabled";
          break;
        case "auth/operation-not-supported-in-this-environment":
          errorMessage = "This operation is not supported in the environment it is running on";
          break;
        case "auth/popup-blocked":
          errorMessage = "The popup was blocked by the browser";
          break;
        case "auth/popup-closed-by-user":
          errorMessage = "The popup was closed by the user before finalizing the sign-in";
          break;
        case "auth/unauthorized-domain":
          errorMessage = "The domain is not authorized";
          break;
        default:
          errorMessage = DOMPurify.sanitize(error.message || "An unknown error occurred").substring(0, 200);
      }
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
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

      <div className="mt-6 grid grid-cols-3 gap-3">
        <button
          onClick={() => handleSocialLogin("Google")}
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <FcGoogle className="h-5 w-5" />
          <span className="sr-only">Sign in with Google</span>
        </button>
        
        <button
          onClick={() => handleSocialLogin("Facebook")}
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <FaFacebook className="h-5 w-5 text-blue-600" />
          <span className="sr-only">Sign in with Facebook</span>
        </button>
        
        <button
          onClick={() => handleSocialLogin("Twitter")}
          disabled={loading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
        >
          <FaTwitter className="h-5 w-5 text-blue-400" />
          <span className="sr-only">Sign in with Twitter</span>
        </button>
      </div>
    </div>
  );
}