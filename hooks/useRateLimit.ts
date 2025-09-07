// hooks/useRateLimit.ts
import { useState, useEffect, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  storageKey: string;
}

interface RateLimitState {
  attempts: number;
  isBlocked: boolean;
  remainingTime: number;
  recordAttempt: () => void;
  reset: () => void;
}

export const useRateLimit = (config: RateLimitConfig): RateLimitState => {
  const { maxAttempts, windowMs, storageKey } = config;
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Güvenli localStorage işlemleri
  const updateStorage = (attempts: number) => {
    try {
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem(storageKey, JSON.stringify({
          attempts,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.warn('LocalStorage erişim hatası:', error);
    }
  };

  const removeStorage = () => {
    try {
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.warn('LocalStorage temizleme hatası:', error);
    }
  };

  // LocalStorage'dan mevcut durumu yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const { attempts: storedAttempts, timestamp } = JSON.parse(stored);
          const now = Date.now();
                     
          // Eğer süre dolmuşsa temizle
          if (now - timestamp > windowMs) {
            removeStorage();
            setAttempts(0);
            setIsBlocked(false);
          } else {
            setAttempts(storedAttempts);
            if (storedAttempts >= maxAttempts) {
              setIsBlocked(true);
              setRemainingTime(Math.ceil((windowMs - (now - timestamp)) / 1000));
            }
          }
        }
      } catch (error) {
        console.error('Rate limit verisi okunamadı:', error);
        removeStorage();
      }
    }
  }, [storageKey, windowMs, maxAttempts]);

  // Geri sayım timer'ı
  useEffect(() => {
    let timer: NodeJS.Timeout;
         
    if (isBlocked && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttempts(0);
            removeStorage();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBlocked, remainingTime, storageKey]);

  const recordAttempt = useCallback(() => {
    if (isBlocked) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // LocalStorage'a güvenli kaydet
    updateStorage(newAttempts);

    // Limit aşıldıysa blokla
    if (newAttempts >= maxAttempts) {
      setIsBlocked(true);
      setRemainingTime(Math.ceil(windowMs / 1000));
    }
  }, [attempts, isBlocked, maxAttempts, windowMs]);

  const reset = useCallback(() => {
    setAttempts(0);
    setIsBlocked(false);
    setRemainingTime(0);
    removeStorage();
  }, []);

  return {
    attempts,
    isBlocked,
    remainingTime,
    recordAttempt,
    reset
  };
};