// contexts/AuthContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  loading: boolean;
  error?: any;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
        console.log("Auth state changed:", user?.email || "No user");
      },
      (error) => {
        setError(error);
        setLoading(false);
        console.error("Auth error:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      console.log("Logging out...");
      setLoading(true);
      
      // Firebase'den çıkış yap
      await signOut(auth);
      
      // Kullanıcı durumunu null yap
      setUser(null);
      
      // LocalStorage'ı temizle
      localStorage.clear();
      
      console.log("Logged out successfully");
      
      // Ana sayfaya yönlendir
      router.push("/");
      
      // Sayfayı yenile (tüm listener'ların temizlenmesi için)
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}