"use client";

import { useEffect, useState } from "react";

type StorageGuardProps = {
  children: React.ReactNode;
};

export default function StorageGuard({ children }: StorageGuardProps) {
  const [checked, setChecked] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(false);

  useEffect(() => {
    try {
      const localTestKey = "__sellbookmedia_local_test__";
      const sessionTestKey = "__sellbookmedia_session_test__";
  
      window.localStorage.setItem(localTestKey, "1");
      const localValue = window.localStorage.getItem(localTestKey);
      window.localStorage.removeItem(localTestKey);
  
      window.sessionStorage.setItem(sessionTestKey, "1");
      const sessionValue = window.sessionStorage.getItem(sessionTestKey);
      window.sessionStorage.removeItem(sessionTestKey);
  
      if (localValue !== "1" || sessionValue !== "1") {
        throw new Error("Browser storage test failed");
      }
  
      setStorageAvailable(true);
    } catch (error) {
      console.error("Required browser storage is not available:", error);
      setStorageAvailable(false);
    } finally {
      setChecked(true);
    }
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!storageAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center">
          <div className="text-5xl mb-5">🌐</div>

          <h1 className="text-2xl font-bold text-gray-900">
            Browser Not Supported
          </h1>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Your current browser or privacy settings are blocking browser
            storage required by SellBookMedia.
          </p>

          <p className="mt-4 text-gray-700 font-medium">
            Please open SellBookMedia using Safari, Chrome, or Firefox.
          </p>

          <p className="mt-5 text-sm text-gray-500">
            If you are using Brave, certain privacy settings may prevent
            SellBookMedia from working correctly.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}