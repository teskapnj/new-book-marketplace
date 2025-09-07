// lib/auth-utils.ts - FINAL COMPLETE VERSION
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export enum UserRole {
  SELLER = 'seller',  // Satıcılar (eski USER yerine)
  BUYER = 'buyer',    // Alıcılar
  ADMIN = 'admin'     // Yöneticiler
}

interface RoleVerificationResponse {
  success: boolean;
  role: UserRole;
  verified: boolean;
  error?: string;
}

// Girdi sanitizasyonu
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000);
};

// Email doğrulama
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitizedEmail = sanitizeInput(email);
  return emailRegex.test(sanitizedEmail) && sanitizedEmail.length <= 254;
};

// Güvenli API çağrısı
export const secureApiCall = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

// FIRESTORE'DAN ROL OKUMA (Ana Fonksiyon) - GÜNCELLENMIŞ
export const verifyUserRoleSecurely = async (user: User): Promise<UserRole> => {
  if (!user?.uid || !user?.email) {
    throw new Error('Invalid user');
  }

  try {
    console.log('🔍 Checking role for user');

    // Önce admin email kontrolü
    // GÜVENLI - Hardcoded fallback olmadan
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (adminEmail && user.email === adminEmail) {
      console.log('✅ Admin role assigned via email');
      return UserRole.ADMIN;
    }

    // Firestore'dan kullanıcı dokümanını oku
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const firestoreRole = userData.role;

      console.log('📄 Firestore role found:', firestoreRole ? 'role_assigned' : 'no_role');

      // Rol doğrulama ve dönüştürme
      switch (firestoreRole) {
        case 'admin':
          return UserRole.ADMIN;
        case 'buyer':
          return UserRole.BUYER;
        case 'seller':
          return UserRole.SELLER;
        case 'user': // Eski "user" rolü varsa seller'a çevir
          return UserRole.SELLER;
        default:
          return UserRole.SELLER; // Varsayılan olarak seller
      }
    } else {
      console.log('📄 No Firestore document found, using default seller role');
      return UserRole.SELLER; // Varsayılan seller
    }

  } catch (error) {
    console.error('❌ Firestore role check error:', error);

    // Hata durumunda email bazlı fallback
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (adminEmail && user.email === adminEmail) {
      return UserRole.ADMIN;
    }
    return UserRole.SELLER; // Varsayılan seller
  }
};

// Güvenli logout işlemi
export const secureLogout = async (user: User): Promise<void> => {
  try {
    console.log('🚪 Logging out user:', user.uid);

    // Basit logout API çağrısı (opsiyonel)
    await secureApiCall('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ uid: user.uid })
    });
  } catch (error) {
    console.error('Logout API error:', error);
  }

  // Local storage temizle
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-rate-limit');
    localStorage.removeItem('user-role-cache');
    sessionStorage.clear();
    console.log('🧹 Local storage cleared');
  }
};

// Rol cache yönetimi
export const getCachedRole = (userId: string): UserRole | null => {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(`user-role-${userId}`);
    if (cached) {
      const { role, timestamp } = JSON.parse(cached);
      // 5 dakika cache süresi
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        console.log('📦 Using cached role:', role);
        return role as UserRole;
      }
      // Eski cache'i temizle
      localStorage.removeItem(`user-role-${userId}`);
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }

  return null;
};

export const setCachedRole = (userId: string, role: UserRole): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(`user-role-${userId}`, JSON.stringify({
      role,
      timestamp: Date.now()
    }));
    console.log('📦 Role cached:', role);
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

// Güvenlik header'ları kontrol etme
export const validateSecurityHeaders = (response: Response): boolean => {
  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ?? false;
};

// Güvenlik logları
export const logSecurityAttempt = (
  type: 'login' | 'role_check' | 'api_call' | 'logout',
  success: boolean,
  userId?: string
): void => {
  if (typeof window !== 'undefined') {
    const log = {
      type,
      success,
      userId: userId || 'anonymous',
      timestamp: Date.now(),
      userAgent: navigator.userAgent.substring(0, 100)
    };

    // GÜVENLI
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Security Log: ${JSON.stringify(log)}`);
    }
  }
};