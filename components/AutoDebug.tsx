// components/AuthDebug.tsx
"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthDebug() {
  const { user, loading, error } = useAuth();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-xs">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <p>Loading: {loading ? "Yes" : "No"}</p>
      <p>User: {user ? user.email : "None"}</p>
      {error && <p className="text-red-400">Error: {error.message}</p>}
    </div>
  );
}