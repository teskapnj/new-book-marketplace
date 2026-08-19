// app/page.tsx - HOMEPAGE WITH INTEGRATED SCANNING + SINGLE PAGE CHECKOUT
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import DOMPurify from "isomorphic-dompurify";

import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { AmazonProduct, PricingResult } from "@/lib/pricingEngine";
import { trackEvent } from "@/lib/analytics";
import CheckoutForm from "@/components/CheckoutForm";

// Security hooks
import { useRateLimit } from "@/hooks/useRateLimit";
import { RateLimitWarning } from "@/components/RateLimitWarning";
import {
  verifyUserRoleSecurely,
  UserRole,
  getCachedRole,
  setCachedRole,
  secureLogout,
  logSecurityAttempt
} from "@/lib/auth-utils";

// ---------------------------------------------------------------------------
// Tipler - create-listing ile ayni yapida olmali (ayni localStorage anahtari)
// ---------------------------------------------------------------------------
interface BundleItem {
  id: string;
  isbn: string;
  condition: "very-good";
  quantity: number;
  price: number;
  image: string | null;
  imageBlob: Blob | null;
  category: "book" | "cd" | "dvd" | "game" | "mix";
  amazonData?: AmazonProduct;
  ourPrice?: number;
  originalPrice?: number;
  imageUrl?: string | null;
}

const CATEGORY_EMOJI: Record<string, string> = {
  book: "📚",
  cd: "💿",
  dvd: "📀",
  game: "🎮",
  mix: "📦"
};

// SVG Icons
function UserIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function MenuIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  );
}

function XIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 6-12 12"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );
}

function ShoppingCartIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

function AdminIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
      <path d="M12 22v-6"></path>
      <path d="M12 12h-2"></path>
      <path d="M12 12h2"></path>
    </svg>
  );
}

function ArrowRightIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}

function SparklesIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
    </svg>
  );
}

function TrendingUpIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}

function ShieldCheckIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  );
}

function PackageIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function CameraIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  );
}

function SearchIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function HelpCircleIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}

function TrashIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}

function AlertCircleIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}

function CheckIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function CheckCircleIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function MailIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

function ClockIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

function LogInIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------
export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Auth / menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // --- Tarama state'leri (create-listing'den tasindi) ---
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [isbnInput, setIsbnInput] = useState("");
  const [isCheckingAmazon, setIsCheckingAmazon] = useState(false);
  const [amazonResult, setAmazonResult] = useState<{
    product: AmazonProduct;
    pricing: PricingResult;
    message: string;
  } | null>(null);
  const [duplicateConfirm, setDuplicateConfirm] = useState<{
    code: string;
    count: number;
    existingItem: BundleItem;
  } | null>(null);
  const [scanError, setScanError] = useState("");
  const [scannerError, setScannerError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // --- Tek sayfa checkout ---
  const [showCheckout, setShowCheckout] = useState(false);
  const checkoutFormRef = useRef<HTMLDivElement | null>(null);

  // Storage state
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [prevUser, setPrevUser] = useState(user);

  const resultTimerRef = useRef<NodeJS.Timeout | null>(null);
  const minimumReachedFiredRef = useRef(false);
  // scan_started oturumda bir kez: kamera veya manuel giris, hangisi once olursa
  const scanStartedFiredRef = useRef(false);

  const totalOurPrice = bundleItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Rate limiting
  const rateLimitConfig = {
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000,
    storageKey: 'auth-rate-limit'
  };

  const { isBlocked, remainingTime, attempts, recordAttempt } = useRateLimit(rateLimitConfig);

  // -------------------------------------------------------------------------
  // localStorage - create-listing ile AYNI anahtarlar kullanilmali
  // -------------------------------------------------------------------------
  const getStorageKey = useCallback(() => {
    return user ? `bundleListingDraft_${user.uid}` : 'bundleListingDraft_guest';
  }, [user]);

  const getGuestStorageKey = useCallback(() => {
    return 'bundleListingDraft_guest';
  }, []);

  const validateAndSanitizeData = (parsed: unknown) => {
    if (!parsed || typeof parsed !== 'object') return null;
    const parsedData = parsed as Record<string, unknown>;

    let sanitizedBundleItems: BundleItem[] = [];
    if (Array.isArray(parsedData.bundleItems)) {
      sanitizedBundleItems = (parsedData.bundleItems as unknown[]).map((item: unknown) => {
        const safeItem = item as Record<string, unknown>;
        const safeAmazonData = safeItem.amazonData as Record<string, unknown> | undefined;

        return {
          ...safeItem,
          id: safeItem.id ? DOMPurify.sanitize(safeItem.id.toString()).substring(0, 50) : '',
          isbn: safeItem.isbn ? DOMPurify.sanitize(safeItem.isbn.toString()).substring(0, 50) : '',
          condition: "very-good" as const,
          quantity: typeof safeItem.quantity === 'number' ? Math.max(1, safeItem.quantity) : 1,
          price: typeof safeItem.price === 'number' ? Math.max(0, safeItem.price) : 0,
          category: ['book', 'cd', 'dvd', 'game', 'mix'].includes(safeItem.category as string)
            ? (safeItem.category as "book" | "cd" | "dvd" | "game" | "mix")
            : 'book' as const,
          imageUrl: safeItem.imageUrl && typeof safeItem.imageUrl === 'string' ? safeItem.imageUrl : null,
          amazonData: safeAmazonData ? {
            title: safeAmazonData.title ? DOMPurify.sanitize(safeAmazonData.title.toString()).substring(0, 200) : '',
            asin: safeAmazonData.asin ? DOMPurify.sanitize(safeAmazonData.asin.toString()).substring(0, 50) : '',
            price: typeof safeAmazonData.price === 'number' ? safeAmazonData.price : 0,
            sales_rank: typeof safeAmazonData.sales_rank === 'number' ? safeAmazonData.sales_rank : 0,
            category: safeAmazonData.category ? DOMPurify.sanitize(safeAmazonData.category.toString()).substring(0, 50) : '',
            image: safeAmazonData.image && typeof safeAmazonData.image === 'string' ? safeAmazonData.image : null
          } : undefined,
          image: null,
          imageBlob: null
        } as BundleItem;
      });
    }

    return { bundleItems: sanitizedBundleItems, raw: parsedData };
  };

  const loadFromStorage = useCallback(() => {
    if (!isMounted || isPrivateMode || isInitializing) return;

    const userKey = getStorageKey();
    const guestKey = getGuestStorageKey();

    if (user) {
      try {
        let userItems: BundleItem[] = [];
        let guestItems: BundleItem[] = [];

        const userData = localStorage.getItem(userKey);
        if (userData) {
          const data = validateAndSanitizeData(JSON.parse(userData));
          if (data) userItems = data.bundleItems;
          else localStorage.removeItem(userKey);
        }

        // Misafirken (veya cikis yaptiktan sonra) taranan urunler kaybolmamali
        const guestData = localStorage.getItem(guestKey);
        if (guestData) {
          const data = validateAndSanitizeData(JSON.parse(guestData));
          if (data) guestItems = data.bundleItems;
          localStorage.removeItem(guestKey);
        }

        if (guestItems.length === 0) {
          setBundleItems(userItems);
          return;
        }

        // Iki liste birlestirilir. Ayni ISBN'den en fazla 5 adet kurali korunur,
        // id cakismasi olursa yeni id uretilir (React key hatasi olmasin).
        const merged: BundleItem[] = [...userItems];
        const isbnCount = new Map<string, number>();
        merged.forEach(i => isbnCount.set(i.isbn, (isbnCount.get(i.isbn) || 0) + 1));
        const usedIds = new Set(merged.map(i => i.id));

        guestItems.forEach(item => {
          const count = isbnCount.get(item.isbn) || 0;
          if (count >= 5) return;
          let id = item.id;
          while (usedIds.has(id)) id = `${id}-${Math.random().toString(36).slice(2, 7)}`;
          usedIds.add(id);
          isbnCount.set(item.isbn, count + 1);
          merged.push({ ...item, id });
        });

        setBundleItems(merged);
      } catch (e) {
        console.error("Error loading user data", e);
        localStorage.removeItem(userKey);
        localStorage.removeItem(guestKey);
      }
    } else {
      try {
        const guestData = localStorage.getItem(guestKey);
        if (guestData) {
          const data = validateAndSanitizeData(JSON.parse(guestData));
          if (data) {
            setBundleItems(data.bundleItems);
          } else {
            localStorage.removeItem(guestKey);
          }
        }
      } catch (e) {
        console.error("Error loading guest data", e);
        localStorage.removeItem(guestKey);
      }
    }
  }, [isMounted, isPrivateMode, isInitializing, getStorageKey, getGuestStorageKey, user]);

  const saveToStorage = useCallback(() => {
    if (!isMounted || isPrivateMode || isInitializing) return;

    try {
      const storageKey = getStorageKey();
      const existing = localStorage.getItem(storageKey);
      let base: Record<string, unknown> = {};
      if (existing) {
        try { base = JSON.parse(existing); } catch { base = {}; }
      }

      // shippingInfo / description gibi alanlar korunur, sadece urunler guncellenir
      const dataToSave = {
        ...base,
        bundleItems: bundleItems.map(item => ({
          ...item,
          image: null,
          imageBlob: null,
          imageStats: null
        })),
        timestamp: Date.now()
      };

      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [bundleItems, isMounted, isPrivateMode, isInitializing, getStorageKey]);

  // -------------------------------------------------------------------------
  // Tarama mantigi
  // -------------------------------------------------------------------------
  const clearAmazonResults = useCallback(() => {
    setAmazonResult(null);
    setScanError("");
    setScannerError("");
  }, []);

  const getCategoryFromPricing = (pricingCategory: string): "book" | "cd" | "dvd" | "game" | "mix" => {
    switch (pricingCategory) {
      case 'books': return 'book';
      case 'cds': return 'cd';
      case 'dvds': return 'dvd';
      case 'games': return 'game';
      default: return 'book';
    }
  };

  const autoAddAcceptedItem = (isbn: string, product: AmazonProduct, pricing: PricingResult) => {
    if (!pricing.accepted || !pricing.ourPrice) return;

    const newItem: BundleItem = {
      id: Date.now().toString(),
      isbn: isbn,
      condition: "very-good",
      quantity: 1,
      price: pricing.ourPrice,
      image: product.image || null,
      imageUrl: product.image || null,
      imageBlob: null,
      category: getCategoryFromPricing(pricing.category),
      amazonData: product,
      ourPrice: pricing.ourPrice,
      originalPrice: product.price
    };

    trackEvent('item_accepted', {
      category: newItem.category,
      price: newItem.price
    });

    setBundleItems(prev => [...prev, newItem]);
    setIsbnInput("");
  };

  // Kamera ve manuel girisin ortak noktasi - ikisinden hangisi once olursa
  const fireScanStarted = useCallback(() => {
    if (scanStartedFiredRef.current) return;
    scanStartedFiredRef.current = true;
    trackEvent('scan_started');
  }, []);

  const handleBarcodeScanned = useCallback(async (code: string) => {
    if (!code || !code.trim()) return;

    // Manuel giris de huninin ilk basamagi sayilir (masaustunde kamera yok)
    fireScanStarted();

    // Kisa bip sesi
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch {
      // bip desteklenmiyor, sessizce gec
    }

    const existingMatches = bundleItems.filter(item => item.isbn === code);
    if (existingMatches.length > 0) {
      setAmazonResult(null);
      setDuplicateConfirm({
        code,
        count: existingMatches.length,
        existingItem: existingMatches[0]
      });
      if (existingMatches.length >= 5) {
        setTimeout(() => setDuplicateConfirm(null), 4000);
      }
      return;
    }

    try {
      // Farkli bir barkod okundu: bekleyen duplicate uyarisi otomatik "No" sayilir
      setDuplicateConfirm(null);
      setIsCheckingAmazon(true);
      clearAmazonResults();

      const response = await axios.post('/api/amazon-check', { isbn_upc: code });

      if (response.data.success) {
        const { product, pricing, message } = response.data.data;
        const sanitizedProduct = {
          title: product?.title ? DOMPurify.sanitize(product.title).substring(0, 200) : '',
          asin: product?.asin ? DOMPurify.sanitize(product.asin).substring(0, 50) : '',
          price: typeof product?.price === 'number' ? product.price : 0,
          sales_rank: typeof product?.sales_rank === 'number' ? product.sales_rank : 0,
          category: product?.category ? DOMPurify.sanitize(product.category).substring(0, 50) : '',
          image: product?.image && typeof product.image === 'string' ? product.image : null
        };
        const sanitizedPricing = {
          ...pricing,
          category: pricing?.category ? DOMPurify.sanitize(pricing.category).substring(0, 50) : '',
          ourPrice: typeof pricing?.ourPrice === 'number' ? pricing.ourPrice : 0
        };
        const sanitizedMessage = message ? DOMPurify.sanitize(message).substring(0, 500) : '';

        setAmazonResult({
          product: sanitizedProduct,
          pricing: sanitizedPricing,
          message: sanitizedMessage
        });

        if (pricing.accepted && pricing.ourPrice) {
          autoAddAcceptedItem(code, sanitizedProduct, sanitizedPricing);
        } else {
          // Reddedilen urunler hunide gorunmuyordu - neyin neden reddedildigini
          // gormek icin kategori, rank ve amazon fiyati da gonderiliyor
          trackEvent('item_rejected', {
            category: sanitizedPricing.category || 'unknown',
            sales_rank: sanitizedProduct.sales_rank || 0,
            amazon_price: sanitizedProduct.price || 0,
            reason: sanitizedMessage ? sanitizedMessage.substring(0, 100) : 'not_accepted'
          });
          setIsbnInput("");
        }

        if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
        resultTimerRef.current = setTimeout(() => {
          setAmazonResult(null);
          setScanError("");
        }, 6000);
      } else {
        setScanError(response.data.error || 'Amazon check failed');
        setTimeout(() => {
          setScanError("");
          setAmazonResult(null);
        }, 5000);
      }
    } catch (err: unknown) {
      console.error('Amazon API error:', err);
      let errorMessage = 'Unable to check product. Please try again later.';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      setScanError(errorMessage);
      setTimeout(() => {
        setScanError("");
        setAmazonResult(null);
      }, 8000);
    } finally {
      setIsCheckingAmazon(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundleItems, clearAmazonResults, fireScanStarted]);

  const handleConfirmAddDuplicate = () => {
    if (!duplicateConfirm) return;
    const existing = duplicateConfirm.existingItem;
    const newItem: BundleItem = {
      id: Date.now().toString(),
      isbn: duplicateConfirm.code,
      condition: "very-good",
      quantity: 1,
      price: existing.price,
      image: existing.image,
      imageUrl: existing.imageUrl,
      imageBlob: null,
      category: existing.category,
      amazonData: existing.amazonData,
      ourPrice: existing.ourPrice,
      originalPrice: existing.originalPrice
    };

    trackEvent('item_accepted', {
      category: newItem.category,
      price: newItem.price
    });

    setBundleItems(prev => [...prev, newItem]);
    setDuplicateConfirm(null);
    setIsbnInput("");
  };

  const handleDeclineAddDuplicate = () => {
    setDuplicateConfirm(null);
    setIsbnInput("");
  };

  const removeItem = (id: string) => {
    setBundleItems(prev => prev.filter(item => item.id !== id));
  };

  const {
    isCameraReady,
    error: cameraError,
    startScanning,
    stopScanning,
    videoRef,
    isMobile
  } = useBarcodeScanner({
    onScan: handleBarcodeScanned,
    onError: (error) => setScannerError(error),
    continuous: true,
    timeout: 300000
  });

  const handleScanBarcode = () => {
    if (!isMobile) return;
    fireScanStarted();
    setShowScanner(true);
    clearAmazonResults();
    startScanning();
  };

  const closeBarcodeScanner = () => {
    stopScanning();
    setShowScanner(false);
    setScannerError("");
  };

  // -------------------------------------------------------------------------
  // Checkout - artik yonlendirme yok, form ayni sayfada acilir
  // -------------------------------------------------------------------------
  const handleCheckout = () => {
    if (bundleItems.length < 5) return;
    if (!user) {
      setShowAuthOptions(true);
      return;
    }
    trackEvent('shipping_started', {
      item_count: bundleItems.length,
      total_value: totalOurPrice
    });
    saveToStorage();
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setBundleItems([]);
    setShowCheckout(false);
    minimumReachedFiredRef.current = false;
  
    try {
      localStorage.removeItem('minimumReachedFired');
    } catch {
      // Private mode / storage unavailable
    }
  
    setShowSuccessPopup(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form acilinca kaydir - kullanici "bir sey olmadi" sanmasin
  useEffect(() => {
    if (!showCheckout) return;
    const t = setTimeout(() => {
      checkoutFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(t);
  }, [showCheckout]);

  // Giris sonrasi ana sayfaya donunce checkout'u kaldigi yerden ac
  useEffect(() => {
    if (!isMounted || isInitializing) return;
    if (!user || showCheckout) return;
    if (bundleItems.length < 5) return;

    let flag: string | null = null;
    try { flag = sessionStorage.getItem('resumeCheckout'); } catch { return; }
    if (flag !== 'true') return;
    try { sessionStorage.removeItem('resumeCheckout'); } catch {}

    trackEvent('shipping_started', {
      item_count: bundleItems.length,
      total_value: totalOurPrice
    });
    setShowAuthOptions(false);
    setShowCheckout(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isMounted, isInitializing, bundleItems.length, showCheckout]);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      setIsPrivateMode(false);
    } catch {
      setIsPrivateMode(true);
    } finally {
      setIsMounted(true);
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    try {
      const showPopup = localStorage.getItem('showSuccessPopup');
      if (showPopup === 'true') {
        setShowSuccessPopup(true);
        localStorage.removeItem('showSuccessPopup');
      }
    } catch (error) {
      console.error("Error checking success popup flag:", error);
    }
  }, []);

  useEffect(() => {
    if (prevUser && !user) saveToStorage();
    if (!prevUser && user) loadFromStorage();
    setPrevUser(user);
  }, [user, prevUser, saveToStorage, loadFromStorage]);

  useEffect(() => {
    if (isMounted && !isPrivateMode && !isInitializing) {
      loadFromStorage();
    }
  }, [isMounted, isPrivateMode, isInitializing, loadFromStorage]);

  useEffect(() => {
    if (!isMounted || isInitializing) return;
    const timeoutId = setTimeout(() => saveToStorage(), 1000);
    return () => clearTimeout(timeoutId);
  }, [bundleItems, saveToStorage, isMounted, isInitializing]);

  // minimum_reached: 5'e ulasinca bir kez tetiklenir, bayrak localStorage'da
  useEffect(() => {
    if (!isMounted || isInitializing) return;
    if (bundleItems.length < 5) return;
    if (minimumReachedFiredRef.current) return;

    const FLAG_KEY = 'minimumReachedFired';
    try {
      if (localStorage.getItem(FLAG_KEY) === 'true') {
        minimumReachedFiredRef.current = true;
        return;
      }
    } catch {
      // gizli mod
    }

    minimumReachedFiredRef.current = true;
    trackEvent('minimum_reached', {
      item_count: bundleItems.length,
      total_value: totalOurPrice
    });

    try {
      localStorage.setItem(FLAG_KEY, 'true');
    } catch {
      // gizli mod
    }
  }, [bundleItems.length, totalOurPrice, isMounted, isInitializing]);

  // Auth role check (background)
  useEffect(() => {
    const checkUserRoleInBackground = async () => {
      if (!user || isBlocked) {
        setUserRole(null);
        return;
      }
      const cachedRole = getCachedRole(user.uid);
      if (cachedRole) {
        setUserRole(cachedRole);
        return;
      }
      try {
        const role = await verifyUserRoleSecurely(user);
        setUserRole(role);
        setCachedRole(user.uid, role);
        logSecurityAttempt('role_check', true, user.uid);
      } catch {
        recordAttempt();
        setUserRole(UserRole.SELLER);
        logSecurityAttempt('role_check', false, user.uid);
      }
    };
    checkUserRoleInBackground();
  }, [user, isBlocked, recordAttempt]);

  const handleSecureLogout = async () => {
    if (user) {
      try {
        await secureLogout(user);
        logSecurityAttempt('logout', true, user.uid);
      } catch {
        console.error('Logout error');
      }
    }
    await logout();
  };

  if (isBlocked) {
    return (
      <RateLimitWarning
        isBlocked={isBlocked}
        remainingTime={remainingTime}
        attempts={attempts}
        maxAttempts={rateLimitConfig.maxAttempts}
      />
    );
  }

  const itemsRemaining = Math.max(0, 5 - bundleItems.length);

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* ===================== CAMERA OVERLAY (mobile) ===================== */}
      {showScanner && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col">
          <div className="flex justify-between items-center px-4 py-3 bg-black bg-opacity-80">
            <h3 className="text-lg font-semibold text-white">Barcode Scanner</h3>
            <button onClick={closeBarcodeScanner} className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full">
              <XIcon size={24} />
            </button>
          </div>

          {cameraError && (
            <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{cameraError}</p>
            </div>
          )}
          {scannerError && (
            <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{scannerError}</p>
            </div>
          )}

          <div className="relative flex-1">
            {isCheckingAmazon && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black bg-opacity-80 text-white text-base font-bold px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Checking product...
              </div>
            )}
            {!isCameraReady && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Preparing camera...</p>
              </div>
            )}
            <video
              ref={videoRef}
              className="absolute left-0 right-0 w-full object-cover"
              style={{ top: '56px', height: 'calc(100% - 112px)' }}
              playsInline
              muted
            />
            {isCameraReady && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2">
                  <div className="h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)]"></div>
                </div>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-0.5 h-10 bg-red-500"></div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-0.5 h-10 bg-red-500"></div>
              </div>
            )}

            {duplicateConfirm && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="mx-3 mb-4 rounded-2xl shadow-2xl p-6 bg-yellow-50 border-2 border-yellow-400">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-200">
                      {duplicateConfirm.existingItem.imageUrl ? (
                        <Image src={duplicateConfirm.existingItem.imageUrl} alt="Product" width={80} height={80} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageIcon size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 line-clamp-2">
                        {duplicateConfirm.existingItem.amazonData?.title || "This item"}
                      </p>
                      {duplicateConfirm.count >= 5 ? (
                        <p className="text-sm font-bold text-red-700 mt-2">Maximum 5 of this item reached</p>
                      ) : (
                        <p className="text-sm text-gray-700 mt-2">
                          You already have {duplicateConfirm.count} of this item. Add another?
                        </p>
                      )}
                    </div>
                  </div>
                  {duplicateConfirm.count < 5 && (
                    <div className="flex gap-3 mt-4">
                      <button type="button" onClick={handleDeclineAddDuplicate} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium">No</button>
                      <button type="button" onClick={handleConfirmAddDuplicate} className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white font-medium">Yes, Add</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {scanError && !amazonResult && !duplicateConfirm && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className="mx-3 mb-4 rounded-2xl shadow-2xl p-6 bg-red-50 border-2 border-red-400">
                  <div className="flex items-center gap-4">
                    <AlertCircleIcon size={40} className="text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-base font-semibold text-red-800">Barcode not recognized</p>
                      <p className="text-sm text-red-700 mt-1">{scanError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {amazonResult && !duplicateConfirm && (
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <div className={`mx-3 mb-4 rounded-2xl shadow-2xl p-6 ${amazonResult.pricing.accepted ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-400'}`}>
                  <div className="flex items-center gap-5">
                    <div className="w-28 h-28 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-200">
                      {amazonResult.product.image ? (
                        <Image src={amazonResult.product.image} alt={amazonResult.product.title || "Product"} width={112} height={112} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageIcon size={40} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {amazonResult.product.title || "Product"}
                      </p>
                      <div className={`inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-base font-bold ${amazonResult.pricing.accepted ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {amazonResult.pricing.accepted ? (
                          <><CheckIcon size={14} /> Accepted - ${amazonResult.pricing.ourPrice?.toFixed(2)}</>
                        ) : (
                          <><XIcon size={14} /> Not Accepted</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-8 left-0 right-0 text-center px-4">
              <p className="text-white text-sm bg-black bg-opacity-60 rounded-full py-2 px-4 inline-block">
                Align the barcode with the red line
              </p>
            </div>
          </div>

          {/* Alt kapatma butonu - telefonda tek elle uste uzanmak zor */}
          <div className="bg-black px-4 pt-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
            <button
              type="button"
              onClick={closeBarcodeScanner}
             className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white/15 border border-white/30 text-white text-base font-semibold active:scale-95 transition-transform"
            >
              <XIcon size={20} />
              Close Camera
            </button>
          </div>
        </div>
      )}

      {/* ===================== SUCCESS POPUP ===================== */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex justify-center flex-1">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon size={32} className="text-green-600" />
                  </div>
                </div>
                <button onClick={() => setShowSuccessPopup(false)} className="text-gray-400 hover:text-gray-600">
                  <XIcon size={24} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Listing Submitted Successfully!</h3>
              <p className="text-gray-600 text-center mb-6">
                Your items have been submitted for review. You will receive a free shipping label via email within 24 hours.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <MailIcon size={20} className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 mb-1">What happens next?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li className="flex items-start"><CheckIcon size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" /><span>Our team will review your items within 24 hours</span></li>
                      <li className="flex items-start"><CheckIcon size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" /><span>If approved: you&apos;ll receive a free shipping label via email</span></li>
                      <li className="flex items-start"><CheckIcon size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" /><span>Package your items and attach the shipping label</span></li>
                      <li className="flex items-start"><CheckIcon size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" /><span>Drop off the package at any authorized location</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start">
                  <ClockIcon size={20} className="text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-green-800 mb-1">Important Information</h4>
                    <p className="text-sm text-green-700">
                      Please check your email (including spam/junk folder) for the shipping label.
                      If you don&apos;t receive it within 24 hours, please contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between py-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SellBook Media
            </Link>
            <div className="flex items-center space-x-2">
              {userRole === UserRole.BUYER && (
                <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors relative">
                  <ShoppingCartIcon size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </Link>
              )}
              <button
                onClick={() => {
                  if (user) {
                    switch (userRole) {
                      case UserRole.ADMIN: router.push('/admin/dashboard'); break;
                      case UserRole.BUYER: router.push('/listings'); break;
                      default: router.push('/');
                    }
                  } else {
                    router.push('/login');
                  }
                }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <UserIcon size={20} />
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SellBookMedia
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : user ? (
                <>
                  {userRole === UserRole.ADMIN ? (
                    <Link href="/admin/dashboard" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center">
                      <AdminIcon size={20} className="mr-2" />
                      Admin Dashboard
                    </Link>
                  ) : userRole === UserRole.BUYER ? (
                    <Link href="/listings" className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium flex items-center">
                      <ShoppingCartIcon size={20} className="mr-2" />
                      Start Shopping
                    </Link>
                  ) : null}

                  {userRole === UserRole.BUYER && (
                    <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors relative">
                      <ShoppingCartIcon size={20} />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                    </Link>
                  )}

                  <button onClick={handleSecureLogout} className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-6 py-4 space-y-4">
              <Link href="/condition-guidelines" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
                Condition Guidelines
              </Link>
              <Link href="/seller-guide" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
                Seller Guide
              </Link>
              <Link href="/contact" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
                Contact Us
              </Link>
              {user ? (
                <>
                  {userRole === UserRole.ADMIN && (
                    <Link href="/admin/dashboard" className="font-medium text-gray-900 py-2 hover:text-purple-600 transition-colors flex items-center">
                      <AdminIcon size={20} className="mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  {userRole === UserRole.BUYER && (
                    <>
                      <Link href="/listings" className="font-medium text-gray-900 py-2 hover:text-green-600 transition-colors flex items-center">
                        <ShoppingCartIcon size={20} className="mr-2" />
                        Start Shopping
                      </Link>
                      <Link href="/cart" className="font-medium text-gray-900 py-2 hover:text-green-600 transition-colors flex items-center">
                        <ShoppingCartIcon size={20} className="mr-2" />
                        My Cart
                      </Link>
                    </>
                  )}
                  <button onClick={handleSecureLogout} className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors text-left w-full">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

   {/* ===================== HERO + SCAN ===================== */}
   <section id="quote" className="relative py-10 sm:py-12 overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
          Turn Your Books, CDs, DVDs &amp; Games Into Cash
          </h1>
          <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8">
          Scan the barcode and see our cash offer instantly. Accepted offers start at $1.50, shipping is free, and there&apos;s no app to download.
          </p>

          {/* ---------- QUOTE BOX (solid white - mordan net ayrilir) ---------- */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">

           {/* Mobil: kamera butonu - isMounted beklenir, yoksa masaustu/mobil gecisi goruluyor */}
           {isMounted && isMobile && (
              <>
                <button
                  type="button"
                  onClick={handleScanBarcode}
                  disabled={isCheckingAmazon}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl py-6 shadow-md active:scale-95 transition-transform disabled:opacity-60"
                >
                                   <CameraIcon size={40} className="text-white mx-auto mb-2" />
                  <span className="block text-xl font-extrabold text-white">Scan Barcode</span>
                  <span className="block text-sm font-medium text-white/85 mt-0.5">
                    Opens your camera
                  </span>
                </button>
                <div className="text-sm text-gray-500 my-3">or type it in</div>
              </>
            )}

            {/* Input + buton */}
            <div className="flex rounded-xl overflow-hidden border-2 border-gray-300 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={isbnInput}
                onChange={(e) => setIsbnInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isbnInput.trim()) {
                    e.preventDefault();
                    handleBarcodeScanned(isbnInput.trim());
                  }
                }}
                placeholder={isMounted && isMobile ? "ISBN / UPC" : "Enter the ISBN or UPC under the barcode"}
                disabled={isCheckingAmazon}
                className="flex-1 min-w-0 px-4 sm:px-5 py-3 sm:py-4 text-base border-0 focus:ring-0 outline-none text-gray-900 bg-white"
              />
              <button
                type="button"
                onClick={() => handleBarcodeScanned(isbnInput.trim())}
                disabled={isCheckingAmazon || !isbnInput.trim()}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-5 sm:px-8 text-base whitespace-nowrap disabled:opacity-60 flex items-center justify-center"
              >
                {isCheckingAmazon ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : isMounted && isMobile ? (
                  <SearchIcon size={20} />
                ) : (
                  "Get Quote"
                )}
              </button>
            </div>

          

<div className="mt-4 pt-4 border-t border-gray-100">
  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-600">
    <span className="flex items-center gap-1">
      <CheckIcon size={14} className="text-green-600" />
      Free Shipping
    </span>
    <span className="flex items-center gap-1">
      <CheckIcon size={14} className="text-green-600" />
      PayPal Payment
    </span>
    <span className="flex items-center gap-1">
      <CheckIcon size={14} className="text-green-600" />
      No Seller Fees
    </span>
    <span className="flex items-center gap-1">
      <CheckIcon size={14} className="text-green-600" />
      No App Required
    </span>
  </div>

  <p className="mt-3 text-xs text-gray-500">
    Minimum 5 accepted items per order.
  </p>
</div>
          </div>
        </div>
      </section>

      {/* ===================== RESULT + CART + CHECKOUT (acik zemin) ===================== */}
      {(scanError || duplicateConfirm || amazonResult || bundleItems.length > 0) && (
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-6">
          <div className={`${showCheckout ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-4 sm:px-6 lg:px-8 transition-all`}>

            {/* ---------- ERROR ---------- */}
            {scanError && !showScanner && (
              <div className="mb-4 bg-white rounded-xl border-2 border-red-400 p-4 flex items-center gap-3 shadow-sm">
                <AlertCircleIcon size={24} className="text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Barcode not recognized</p>
                  <p className="text-sm text-red-700">{scanError}</p>
                </div>
              </div>
            )}

            {/* ---------- DUPLICATE (manual entry) ---------- */}
            {duplicateConfirm && !showScanner && (
              <div className="mb-4 bg-yellow-50 rounded-xl border-2 border-yellow-400 p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {duplicateConfirm.existingItem.amazonData?.title || "This item"}
                </p>
                {duplicateConfirm.count >= 5 ? (
                  <p className="text-sm font-bold text-red-700 mt-2">Maximum 5 of this item reached</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mt-1">
                      You already have {duplicateConfirm.count}. Add another?
                    </p>
                    <div className="flex gap-3 mt-3">
                      <button type="button" onClick={handleDeclineAddDuplicate} className="flex-1 py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium">No</button>
                      <button type="button" onClick={handleConfirmAddDuplicate} className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white text-sm font-medium">Yes, Add</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ---------- RESULT CARD ---------- */}
            {amazonResult && !duplicateConfirm && !showScanner && (
              <div className={`mb-4 bg-white rounded-xl border-2 p-4 flex items-center gap-4 shadow-sm ${amazonResult.pricing.accepted ? 'border-green-400' : 'border-red-400'}`}>
                <div className="w-12 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  {amazonResult.product.image ? (
                    <Image src={amazonResult.product.image} alt={amazonResult.product.title || "Product"} width={48} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PackageIcon size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 line-clamp-2">{amazonResult.product.title || "Product"}</p>
                  <span className={`inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-sm font-bold ${amazonResult.pricing.accepted ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {amazonResult.pricing.accepted
                      ? `Accepted — $${amazonResult.pricing.ourPrice?.toFixed(2)}`
                      : 'Not accepted'}
                  </span>
                </div>
              </div>
            )}

            {/* ---------- CART + FORM GRID ----------
                showCheckout false: tek sutun, sepet tam genislik
                showCheckout true (md+): sol sepet (col-span-2, sticky) / sag form (col-span-3)
                Mobilde her zaman alt alta */}
            <div className={showCheckout ? 'grid grid-cols-1 md:grid-cols-5 gap-6 items-start' : ''}>

              {/* ===== SOL SUTUN: sepet + kutu uyarisi + (checkout kapaliyken) buton ===== */}
              <div className={showCheckout ? 'md:col-span-2 md:sticky md:top-6' : ''}>

                {/* ---------- CART ---------- */}
                {bundleItems.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">Your items</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                          {bundleItems.length} added
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditMode(prev => !prev)}
                          className="text-xs font-medium px-2.5 py-1 rounded-full border border-gray-300 text-gray-600"
                        >
                          {editMode ? "Done" : "Edit"}
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {bundleItems.map((item, index) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between py-2.5 ${index < bundleItems.length - 1 ? 'border-b border-dashed border-gray-200' : ''}`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base flex-shrink-0">{CATEGORY_EMOJI[item.category]}</span>
                            <span className="text-sm text-gray-900 truncate">
                              {item.amazonData?.title || `ISBN: ${item.isbn}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className="font-mono text-sm font-medium text-green-700">
                              ${item.price.toFixed(2)}
                            </span>
                            {editMode && (
                              <button type="button" onClick={() => removeItem(item.id)} className="text-red-500 p-1" aria-label="Remove item">
                                <TrashIcon size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-300 mt-1 pt-3 flex justify-between items-baseline">
                      <span className="text-sm font-medium text-gray-900">Cash offer total</span>
                      <span className="font-mono text-xl sm:text-2xl font-semibold text-green-700">
                        ${totalOurPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-4">
  <div className="flex justify-between items-center mb-2 text-sm">
    <span className="font-medium text-gray-700">
      {Math.min(bundleItems.length, 5)} of 5 items added
    </span>
    <span className={itemsRemaining > 0 ? "text-amber-700" : "text-green-700 font-semibold"}>
      {itemsRemaining > 0
        ? `${itemsRemaining} more needed`
        : "Ready to ship!"}
    </span>
  </div>

  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
    <div
      className={`h-2.5 rounded-full transition-all duration-300 ${
        itemsRemaining === 0 ? "bg-green-500" : "bg-blue-500"
      }`}
      style={{
        width: `${Math.min((bundleItems.length / 5) * 100, 100)}%`
      }}
    />
  </div>

  {itemsRemaining > 0 ? (
    <p className="mt-2 text-xs text-center text-gray-500">
      Add {itemsRemaining} more accepted item{itemsRemaining !== 1 ? "s" : ""} to continue.
    </p>
  ) : (
    <p className="mt-2 text-xs text-center text-green-700 font-medium">
      ✓ You&apos;ve reached the 5-item minimum.
    </p>
  )}
</div>
                  </div>
                )}

                {/* ---------- ONE BOX NOTICE ---------- */}
                {bundleItems.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-3">
                    <PackageIcon size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-800">One box per order.</span>{" "}
                      Maximum box size 18 × 16 × 16 in, maximum weight 50 lbs. If your items
                      won&apos;t fit in a single box, please submit them as separate orders.
                    </p>
                  </div>
                )}

                {/* ---------- CHECKOUT BUTONU (sadece form kapaliyken) ---------- */}
                {bundleItems.length > 0 && !showCheckout && (
                  <div className="mt-4">
                    {showAuthOptions && !user ? (
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center">
                        <p className="text-sm text-gray-700 mb-4">
                          Sign up to send your items, or sign in if you already have an account
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
  href="/register"
  onClick={() => { try { sessionStorage.setItem('resumeCheckout', 'true'); } catch {} }}
  className="flex-1 flex items-center justify-center py-3 px-6 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-base font-medium"
>
  <UserIcon size={20} className="mr-2" /> Sign up
</Link>
<Link
  href="/login"
  onClick={() => { try { sessionStorage.setItem('resumeCheckout', 'true'); } catch {} }}
  className="flex-1 flex items-center justify-center py-3 px-6 rounded-xl border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 text-base font-medium"
>
  <LogInIcon size={20} className="mr-2" /> Sign in
</Link>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={bundleItems.length < 5}
                        className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-base font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Sell My Items — ${totalOurPrice.toFixed(2)}
                        <ArrowRightIcon size={20} className="ml-2" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ===== SAG SUTUN: checkout formu ===== */}
              {showCheckout && (
                <div ref={checkoutFormRef} className="md:col-span-3 scroll-mt-24 mt-6 md:mt-0">
                  <CheckoutForm
                    bundleItems={bundleItems}
                    user={user}
                    storageKey={getStorageKey()}
                    isPrivateMode={isPrivateMode}
                    onSuccess={handleCheckoutSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================== TRUST STRIP ===================== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
        <div className="py-5 sm:py-6 text-center">
  <div className="text-xl sm:text-2xl font-bold text-gray-900">FREE</div>
  <div className="text-xs sm:text-sm text-gray-500 mt-1">Prepaid Shipping</div>
</div>
<div className="py-5 sm:py-6 text-center">
  <div className="text-xl sm:text-2xl font-bold text-gray-900">$1.50+</div>
  <div className="text-xs sm:text-sm text-gray-500 mt-1">Accepted Offers</div>
</div>
          <div className="py-5 sm:py-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">PayPal</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">Fast payment</div>
          </div>
          <div className="py-5 sm:py-6 text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">No app</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">Works in browser</div>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start selling your used media in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <SparklesIcon size={16} className="text-yellow-600 m-auto mt-1" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scan &amp; Get Your Offer</h3>
<p className="text-gray-600 leading-relaxed">
  Scan or enter the ISBN, UPC, and instantly see our cash offer.
</p>
            </div>
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <SparklesIcon size={16} className="text-yellow-600 m-auto mt-1" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ship for Free</h3>
<p className="text-gray-600 leading-relaxed">
  Submit your order and, once approved, receive a prepaid shipping label by email.
</p>
            </div>
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <SparklesIcon size={16} className="text-yellow-600 m-auto mt-1" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Paid Fast</h3>
<p className="text-gray-600 leading-relaxed">
  After your items arrive and pass inspection, your payment is processed to your PayPal account within 2 business days.
</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
  <div className="max-w-5xl mx-auto px-4 sm:px-6">
    <div className="text-center mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Sell Your Media for Cash
      </h2>
      <p className="mt-2 text-gray-600">
        Learn more about what we buy and how to sell your collection.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
    <Link
  href="/sell-books-for-cash"
  className="block rounded-2xl border border-gray-200 bg-gray-50 p-6 hover:border-blue-300 hover:shadow-md transition-all"
>
  <div className="text-3xl mb-3">📚</div>

  <h3 className="text-xl font-bold text-gray-900">
    Sell Books for Cash
  </h3>

  <p className="mt-2 text-sm text-gray-600">
    Learn how to sell your used books and textbooks for cash.
  </p>

  <span className="inline-flex items-center mt-4 font-semibold text-blue-600">
    Learn More
    <ArrowRightIcon size={18} className="ml-2" />
  </span>
</Link>
      <Link
        href="/sell-dvds-for-cash"
        className="block rounded-2xl border border-gray-200 bg-gray-50 p-6 hover:border-blue-300 hover:shadow-md transition-all"
      >
        <div className="text-3xl mb-3">📀</div>
        <h3 className="text-xl font-bold text-gray-900">
          Sell DVDs, Blu-rays &amp; 4K
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Learn how to sell your used movies for cash.
        </p>
        <span className="inline-flex items-center mt-4 font-semibold text-blue-600">
          Learn More
          <ArrowRightIcon size={18} className="ml-2" />
        </span>
      </Link>

      <Link
        href="/sell-cds-for-cash"
        className="block rounded-2xl border border-gray-200 bg-gray-50 p-6 hover:border-blue-300 hover:shadow-md transition-all"
      >
        <div className="text-3xl mb-3">💿</div>
        <h3 className="text-xl font-bold text-gray-900">
          Sell CDs for Cash
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Learn how to sell your used CDs and music collection.
        </p>
        <span className="inline-flex items-center mt-4 font-semibold text-blue-600">
          Learn More
          <ArrowRightIcon size={18} className="ml-2" />
        </span>
      </Link>
      <Link
  href="/sell-video-games-for-cash"
  className="block rounded-2xl border border-gray-200 bg-gray-50 p-6 hover:border-blue-300 hover:shadow-md transition-all"
>
  <div className="text-3xl mb-3">🎮</div>

  <h3 className="text-xl font-bold text-gray-900">
    Sell Video Games for Cash
  </h3>

  <p className="mt-2 text-sm text-gray-600">
    Learn how to sell your used video games for cash.
  </p>

  <span className="inline-flex items-center mt-4 font-semibold text-blue-600">
    Learn More
    <ArrowRightIcon size={18} className="ml-2" />
  </span>
</Link>
    </div>
  </div>
</section>

      {/* ===================== CTA ===================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"> Ready to Turn Your Old Media Into Cash?</h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          Scan your first barcode and see what your books, CDs, DVDs, and games are worth.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-blue-200">
            <div className="flex items-center">
              <ShieldCheckIcon size={20} className="mr-2" />
              <span className="text-sm sm:text-base">Free Shipping</span>
            </div>
            <div className="flex items-center">
              <PackageIcon size={20} className="mr-2" />
              <span className="text-sm sm:text-base">No Hidden Fees</span>
            </div>
            <div className="flex items-center">
              <TrendingUpIcon size={20} className="mr-2" />
              <span className="text-sm sm:text-base">Free Quotes</span>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            {userRole === UserRole.ADMIN ? (
              <Link href="/admin/dashboard" className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
                <AdminIcon size={24} className="mr-3" />
                Admin Dashboard
                <ArrowRightIcon size={24} className="ml-3" />
              </Link>
            ) : userRole === UserRole.BUYER ? (
              <Link href="/listings" className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
                <ShoppingCartIcon size={24} className="mr-3" />
                Start Shopping
                <ArrowRightIcon size={24} className="ml-3" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                Get a Quote Now
                <ArrowRightIcon size={24} className="ml-3" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 block">
                SellBookMedia
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6">
                We buy used books, CDs, DVDs, and games for cash.
                Turn your collection into money with confidence.
              </p>
            </div>
            <div>
  <h4 className="font-bold text-lg mb-6 text-white">For Sellers</h4>
  <ul className="space-y-3">
  <li>
  <Link
    href="/sell-books-for-cash"
    className="text-gray-400 hover:text-white transition-colors"
  >
    Sell Books for Cash
  </Link>
</li>

  <li>
    <Link
      href="/sell-dvds-for-cash"
      className="text-gray-400 hover:text-white transition-colors"
    >
      Sell DVDs, Blu-rays &amp; 4K
    </Link>
  </li>

  <li>
    <Link
      href="/sell-cds-for-cash"
      className="text-gray-400 hover:text-white transition-colors"
    >
      Sell CDs for Cash
    </Link>
  </li>
  <li>
  <Link
    href="/sell-video-games-for-cash"
    className="text-gray-400 hover:text-white transition-colors"
  >
    Sell Video Games for Cash
  </Link>
</li>

  <li>
    <Link
      href="/condition-guidelines"
      className="text-gray-400 hover:text-white transition-colors"
    >
      Condition Guidelines
    </Link>
  </li>

  <li>
    <Link
      href="/returns-policy"
      className="text-gray-400 hover:text-white transition-colors"
    >
      Returns Policy
    </Link>
  </li>

  <li>
    <Link
      href="/seller-guide"
      className="text-gray-400 hover:text-white transition-colors"
    >
      Seller Guide
    </Link>
  </li>
</ul>
</div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Guides</h4>
              <ul className="space-y-3">
                <li><Link href="/guides/how-much-are-used-books-worth" className="text-gray-400 hover:text-white transition-colors">What Are Books Worth?</Link></li>
                <li><Link href="/guides/how-much-are-used-dvds-worth" className="text-gray-400 hover:text-white transition-colors">What Are DVDs Worth?</Link></li>
                <li><Link href="/guides/sell-video-games-for-cash" className="text-gray-400 hover:text-white transition-colors">Sell Video Games</Link></li>
                <li><Link href="/guides/best-places-to-sell-cds-dvds-games" className="text-gray-400 hover:text-white transition-colors">Best Places to Sell</Link></li>
                <li><Link href="/guides/where-to-sell-books-and-dvds-for-cash" className="text-gray-400 hover:text-white transition-colors">Where to Sell for Cash</Link></li>
                <li><Link href="/guides/decluttr-shut-down-alternative" className="text-gray-400 hover:text-white transition-colors">Decluttr Alternative</Link></li>
                <li><Link href="/guides/what-to-do-with-old-dvds-and-cds" className="text-gray-400 hover:text-white transition-colors">What to Do With Old DVDs</Link></li>
                <li><Link href="/guides/how-much-are-used-cds-worth" className="text-gray-400 hover:text-white transition-colors">What Are CDs Worth?</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2026 SellBookMedia. All rights reserved.</p>
              <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                <span className="text-gray-400 text-sm">Made with ❤️ for collectors</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}