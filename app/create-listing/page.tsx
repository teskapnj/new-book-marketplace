"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { FiHome, FiCamera, FiDollarSign, FiPackage, FiX, FiCheck, FiAlertCircle, FiSearch, FiBookOpen, FiUser, FiLogIn, FiSettings, FiMessageSquare, FiMail, FiClock, FiCheckCircle, FiList, FiArrowRight, FiMenu, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { AmazonProduct, PricingResult } from "@/lib/pricingEngine";
import DOMPurify from 'isomorphic-dompurify';
import UserListingsSection from "@/components/UserListingsSection";
import Image from 'next/image';
import { trackEvent } from "@/lib/analytics";



interface BundleItem {
  id: string;
  isbn: string;
  condition: "very-good";
  quantity: number;
  price: number;
  image: string | null;
  imageBlob: Blob | null;
  imageStats?: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
  category: "book" | "cd" | "dvd" | "game" | "mix";
  amazonData?: AmazonProduct;
  ourPrice?: number;
  originalPrice?: number;
  imageUrl?: string | null;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: Address;
  packageDimensions: PackageDimensions;
  paypalAccount: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  book: "📚",
  cd: "💿",
  dvd: "📀",
  game: "🎮",
  mix: "📦"
};

export default function CreateListingPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [currentItem, setCurrentItem] = useState<BundleItem>({
    id: "",
    isbn: "",
    condition: "very-good",
    quantity: 1,
    price: 0,
    image: null,
    imageBlob: null,
    category: "book",
    imageUrl: null
  });
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [description, setDescription] = useState<string>('');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "US"
    },
    packageDimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0
    },
    paypalAccount: ""
  });

  const [error, setError] = useState("");

  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
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
  const [scannerError, setScannerError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupTimer, setPopupTimer] = useState<NodeJS.Timeout | null>(null);
  const [prevUser, setPrevUser] = useState(user);
  const [showUserListings, setShowUserListings] = useState(false);
  const resultTimerRef = useRef<NodeJS.Timeout | null>(null);

  // YENİ: sadece mobil redesign için eklenen state'ler
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  const totalOurPrice = bundleItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const totalAmazonValue = bundleItems.reduce((total, item) => {
    return total + ((item.originalPrice || 0) * item.quantity);
  }, 0);

  const getStorageKey = useCallback(() => {
    return user ? `bundleListingDraft_${user.uid}` : 'bundleListingDraft_guest';
  }, [user]);

  const getGuestStorageKey = useCallback(() => {
    return 'bundleListingDraft_guest';
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

  const clearAmazonResults = useCallback(() => {
    setAmazonResult(null);
    setError("");
    setScannerError("");
  }, []);

  const clearAmazonCard = () => {
    setAmazonResult(null);
    setError("");
    setCurrentItem(prev => ({
      ...prev,
      isbn: "",
      image: null,
      imageUrl: null,
      amazonData: undefined
    }));
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

    // Event'leri state güncellemesinin dışında gönder (React Strict Mode'da çift tetiklenmesin)
    trackEvent('item_accepted', {
      category: newItem.category,
      price: newItem.price
    });

    if (bundleItems.length + 1 === 5) {
      trackEvent('minimum_reached');
    }

    setBundleItems(prev => [...prev, newItem]);

    setCurrentItem({
      id: "",
      isbn: "",
      condition: "very-good",
      quantity: 1,
      price: 0,
      image: null,
      imageBlob: null,
      category: "book",
      imageUrl: null
    });

    console.log(`✅ Auto-added item with Amazon image: ${product.image}`);
  };

  const handleBarcodeScanned = useCallback(async (code: string) => {
    console.log('📱 Barcode scanned:', code);

    // Kısa bip sesi (Web Audio API - dosya yüklemeye gerek yok)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log('Beep sound not supported');
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
      setIsCheckingAmazon(true);
      clearAmazonResults();
      setCurrentItem(prev => ({
        ...prev,
        isbn: code
      }));

      const response = await axios.post('/api/amazon-check', {
        isbn_upc: code
      });

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

        setCurrentItem(prev => ({
          ...prev,
          isbn: DOMPurify.sanitize(code).substring(0, 50),
          amazonData: sanitizedProduct,
          image: sanitizedProduct.image,
          imageUrl: sanitizedProduct.image,
          originalPrice: sanitizedProduct.price,
          ourPrice: sanitizedPricing.ourPrice
        }));

        const categoryMap: Record<string, "book" | "cd" | "dvd" | "game"> = {
          'books': 'book',
          'cds': 'cd',
          'dvds': 'dvd',
          'games': 'game'
        };

        if (pricing.category && categoryMap[pricing.category]) {
          setCurrentItem(prev => ({
            ...prev,
            category: categoryMap[pricing.category]
          }));
        }

        if (pricing.accepted && pricing.ourPrice) {
          autoAddAcceptedItem(code, product, pricing);

          if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
          resultTimerRef.current = setTimeout(() => {
            setAmazonResult(null);
            setError("");
            setCurrentItem(prev => ({
              ...prev,
              isbn: "",
              image: null,
              imageUrl: null,
              amazonData: undefined
            }));
          }, 6000);
        } else {
          if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
          resultTimerRef.current = setTimeout(() => {
            setAmazonResult(null);
            setError("");
            setCurrentItem(prev => ({
              ...prev,
              isbn: "",
              image: null,
              imageUrl: null,
              amazonData: undefined
            }));
          }, 6000);
        }
      } else {
        setError(response.data.error || 'Amazon check failed');
        setTimeout(() => {
          setError("");
          setAmazonResult(null);
        }, 3000);
      }
    } catch (err: unknown) {
      console.error('Amazon API error:', err);

      let errorMessage = 'Unable to check product. Please try again later.';

      if (axios.isAxiosError(err)) {
        console.log('Is axios error: YES');
        console.log('Response data:', err.response?.data);

        if (err.response?.data?.error) {
          console.log('API error message found:', err.response.data.error);
          errorMessage = err.response.data.error;
        } else {
          console.log('No error property in response data');
        }
      } else {
        console.log('Is axios error: NO');
      }

      console.log('Final error message:', errorMessage);
      setError(errorMessage);
      setTimeout(() => {
        setError("");
        setAmazonResult(null);
        setCurrentItem(prev => ({
          ...prev,
          isbn: "",
          image: null,
          imageUrl: null,
          amazonData: undefined
        }));
      }, 10000);
    } finally {
      setIsCheckingAmazon(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAddAcceptedItem, clearAmazonResults]);

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
    setBundleItems(prev => [...prev, newItem]);
    setDuplicateConfirm(null);
  };

  const handleDeclineAddDuplicate = () => {
    setDuplicateConfirm(null);
  };

  const handleScanBarcode = () => {
    if (!isMobile) {
      setError("Barcode scanning only works on mobile devices");
      return;
    }
    trackEvent('scan_started');
    setShowScanner(true);
    clearAmazonResults();
    startScanning();
  };

  const closeBarcodeScanner = () => {
    stopScanning();
    setShowScanner(false);
    setScannerError("");
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeStorage = async () => {
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
    };

    initializeStorage();
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

  const validateAndSanitizeData = (parsed: unknown) => {
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
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
        };
      });
    }

    let sanitizedDescription = '';
    if (typeof parsedData.description === 'string') {
      sanitizedDescription = DOMPurify.sanitize(parsedData.description).substring(0, 500);
    }

    let sanitizedShippingInfo: ShippingInfo = {
      firstName: '',
      lastName: '',
      paypalAccount: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      },
      packageDimensions: {
        length: 0,
        width: 0,
        height: 0,
        weight: 0
      }
    };

    if (parsedData.shippingInfo && typeof parsedData.shippingInfo === 'object') {
      const shippingData = parsedData.shippingInfo as Record<string, unknown>;
      const addressData = shippingData.address as Record<string, unknown> | undefined;
      const dimensionsData = shippingData.packageDimensions as Record<string, unknown> | undefined;

      sanitizedShippingInfo = {
        firstName: shippingData.firstName ? DOMPurify.sanitize(shippingData.firstName.toString()).substring(0, 50) : '',
        lastName: shippingData.lastName ? DOMPurify.sanitize(shippingData.lastName.toString()).substring(0, 50) : '',
        paypalAccount: shippingData.paypalAccount ? DOMPurify.sanitize(shippingData.paypalAccount.toString()).substring(0, 254) : '',
        address: {
          street: addressData?.street ? DOMPurify.sanitize(addressData.street.toString()).substring(0, 200) : '',
          city: addressData?.city ? DOMPurify.sanitize(addressData.city.toString()).substring(0, 100) : '',
          state: addressData?.state ? DOMPurify.sanitize(addressData.state.toString()).substring(0, 50) : '',
          zip: addressData?.zip ? DOMPurify.sanitize(addressData.zip.toString()).substring(0, 20) : '',
          country: addressData?.country === 'US' ? 'US' : 'US'
        },
        packageDimensions: {
          length: typeof dimensionsData?.length === 'number' ? Math.max(0, Math.min(18, dimensionsData.length)) : 0,
          width: typeof dimensionsData?.width === 'number' ? Math.max(0, Math.min(16, dimensionsData.width)) : 0,
          height: typeof dimensionsData?.height === 'number' ? Math.max(0, Math.min(16, dimensionsData.height)) : 0,
          weight: typeof dimensionsData?.weight === 'number' ? Math.max(0, Math.min(50, dimensionsData.weight)) : 0
        }
      };
    }

    return {
      bundleItems: sanitizedBundleItems,
      description: sanitizedDescription,
      shippingInfo: sanitizedShippingInfo
    };
  };

  const loadFromStorage = useCallback(() => {
    if (!isMounted || isPrivateMode || isInitializing) return;

    const userKey = getStorageKey();
    const guestKey = getGuestStorageKey();

    if (user) {
      try {
        const userData = localStorage.getItem(userKey);
        if (userData) {
          const parsed = JSON.parse(userData);
          const data = validateAndSanitizeData(parsed);
          if (data) {
            setBundleItems(data.bundleItems);
            setDescription(data.description);
            setShippingInfo(data.shippingInfo);
            console.log(`✅ Loaded and sanitized from user localStorage`);
            return;
          } else {
            localStorage.removeItem(userKey);
          }
        }

        const guestData = localStorage.getItem(guestKey);
        if (guestData) {
          const parsed = JSON.parse(guestData);
          const data = validateAndSanitizeData(parsed);
          if (data) {
            setBundleItems(data.bundleItems);
            setDescription(data.description);
            setShippingInfo(data.shippingInfo);
            localStorage.setItem(userKey, guestData);
            localStorage.removeItem(guestKey);
            console.log(`✅ Migrated data from guest to user localStorage`);
            return;
          } else {
            localStorage.removeItem(guestKey);
          }
        }
      } catch (e) {
        console.error("Error loading user data", e);
        localStorage.removeItem(userKey);
        localStorage.removeItem(guestKey);
      }
    } else {
      try {
        const guestData = localStorage.getItem(guestKey);
        if (guestData) {
          const parsed = JSON.parse(guestData);
          const data = validateAndSanitizeData(parsed);
          if (data) {
            setBundleItems(data.bundleItems);
            setDescription(data.description);
            setShippingInfo(data.shippingInfo);
            console.log(`✅ Loaded and sanitized from guest localStorage`);
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
      const dataToSave = {
        bundleItems: bundleItems.map(item => ({
          ...item,
          image: null,
          imageBlob: null,
          imageStats: null
        })),
        currentItem: {
          ...currentItem,
          image: null,
          imageBlob: null,
          imageStats: null
        },
        description: description,
        shippingInfo: shippingInfo,
        timestamp: Date.now()
      };

      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      console.log(`✅ Saved to localStorage`);
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [bundleItems, currentItem, description, shippingInfo, isMounted, isPrivateMode, isInitializing, getStorageKey]);

  useEffect(() => {
    if (prevUser && !user) {
      saveToStorage();
    }
    if (!prevUser && user) {
      loadFromStorage();
    }
    setPrevUser(user);
  }, [user, prevUser, saveToStorage, loadFromStorage]);

  useEffect(() => {
    if (isMounted && !isPrivateMode && !isInitializing) {
      loadFromStorage();
    }
  }, [isMounted, isPrivateMode, isInitializing, loadFromStorage]);

  useEffect(() => {
    if (!isMounted || isInitializing) return;
    const timeoutId = setTimeout(() => {
      saveToStorage();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [bundleItems, description, shippingInfo, saveToStorage, isMounted, isInitializing]);

  const handleCurrentItemChange = (field: keyof BundleItem, value: string | number) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const removeItem = (id: string) => {
    setBundleItems(prev => prev.filter(item => item.id !== id));
  };

  const handleContinueToShipping = () => {
    trackEvent('shipping_started', {
      item_count: bundleItems.length,
      total_value: totalOurPrice
    });
    saveToStorage();
    router.push('/create-listing/shipping');
  };


  useEffect(() => {
    return () => {
      if (popupTimer) {
        clearTimeout(popupTimer);
      }
    };
  }, [popupTimer]);

  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setBundleItems([]);
      setCurrentItem({
        id: "",
        isbn: "",
        condition: "very-good",
        quantity: 1,
        price: 0,
        image: null,
        imageBlob: null,
        category: "book",
        imageUrl: null
      });
      setDescription("");
      setShippingInfo({
        firstName: "",
        lastName: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "US"
        },
        packageDimensions: {
          length: 0,
          width: 0,
          height: 0,
          weight: 0
        },
        paypalAccount: ""
      });
      clearAmazonResults();
      if (typeof window !== 'undefined' && !isPrivateMode) {
        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
      }
    }
  };

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Sell Your Items | SecondLife Media</title>
      </Head>
      <main className="font-sans antialiased">

        <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setShowMobileMenu(prev => !prev)}
              className="p-2 -ml-2 text-gray-600"
              aria-label="Menu"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-gray-900">Sell your items</span>
            <div className="w-9" aria-hidden="true" />
          </div>

          {showMobileMenu && (
            <div className="border-t border-gray-100 bg-white px-4 py-2">
              <Link href="/" className="flex items-center py-2.5 text-sm text-gray-700">
                <FiHome className="mr-3 h-4 w-4" /> Home
              </Link>
              <Link href="/condition-guidelines" className="flex items-center py-2.5 text-sm text-gray-700">
                <FiBookOpen className="mr-3 h-4 w-4" /> Condition Guidelines
              </Link>
              <Link href="/contact" className="flex items-center py-2.5 text-sm text-gray-700">
                <FiMessageSquare className="mr-3 h-4 w-4" /> Contact Us
              </Link>
              {user && (
                <button
                  onClick={() => { setShowUserListings(!showUserListings); setShowMobileMenu(false); }}
                  className="flex items-center py-2.5 text-sm text-gray-700 w-full text-left"
                >
                  <FiList className="mr-3 h-4 w-4" /> Submissions
                </button>
              )}
              <Link
                href={user ? "/dashboard/settings" : "/login"}
                className="flex items-center py-2.5 text-sm text-gray-700"
              >
                <FiUser className="mr-3 h-4 w-4" /> Account Settings
              </Link>
              <button
                onClick={resetForm}
                className="flex items-center py-2.5 text-sm text-red-600 w-full text-left"
              >
                <FiX className="mr-3 h-4 w-4" /> Reset All
              </button>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8">

          <div className="mb-8 hidden md:block">
            <div className="max-w-4xl mx-auto">
              <div className={`grid gap-3 ${user ? 'grid-cols-6' : 'grid-cols-4'}`}>
                <Link
                  href="/"
                  className="flex items-center justify-center px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-blue-600 hover:text-blue-700 hover:shadow-md transition-all duration-200"
                >
                  <FiHome className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
                <Link
                  href="/condition-guidelines"
                  className="flex items-center justify-center px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-purple-600 hover:text-purple-700 hover:shadow-md transition-all duration-200"
                >
                  <FiBookOpen className="mr-2 h-4 w-4" />
                  Condition Guidelines
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-green-600 hover:text-green-700 hover:shadow-md transition-all duration-200"
                >
                  <FiMessageSquare className="mr-2 h-4 w-4" />
                  Contact Us
                </Link>
                {user && (
                  <>
                    <button
                      onClick={() => setShowUserListings(!showUserListings)}
                      className="flex items-center justify-center px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <FiList className="mr-2 h-4 w-4" />
                      Submissions
                    </button>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center justify-center px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-gray-600 hover:text-gray-700 hover:shadow-md transition-all duration-200"
                    >
                      <FiSettings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center justify-center px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-red-600 hover:text-red-700 hover:shadow-md transition-all duration-200"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {user && (
            <UserListingsSection
              isVisible={showUserListings}
              onClose={() => setShowUserListings(false)}
            />
          )}

          {!isMobile && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    📱 Barcode scanning feature only works on mobile devices (iPhone/Android).
                    Please open this page on a phone or tablet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showScanner && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
              <div className="flex justify-between items-center px-4 py-3 bg-black bg-opacity-80">
                <h3 className="text-lg font-semibold text-white">📱 Barcode Scanner</h3>
                <button
                  onClick={closeBarcodeScanner}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <FiX className="h-6 w-6" />
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
                  <div className="absolute bottom-0 left-0 right-0 z-20 animate-slide-up">
                    <div className="mx-3 mb-4 rounded-2xl shadow-2xl p-6 bg-yellow-50 border-2 border-yellow-400">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-200">
                          {duplicateConfirm.existingItem.imageUrl ? (
                            <Image
                              src={duplicateConfirm.existingItem.imageUrl}
                              alt="Product"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-900 line-clamp-2">
                            {duplicateConfirm.existingItem.amazonData?.title || "This item"}
                          </p>
                          {duplicateConfirm.count >= 5 ? (
                            <p className="text-sm font-bold text-red-700 mt-2">
                              Maximum 5 of this item reached
                            </p>
                          ) : (
                            <p className="text-sm text-gray-700 mt-2">
                              You already have {duplicateConfirm.count} of this item. Add another?
                            </p>
                          )}
                        </div>
                      </div>
                      {duplicateConfirm.count < 5 && (
                        <div className="flex gap-3 mt-4">
                          <button
                            type="button"
                            onClick={handleDeclineAddDuplicate}
                            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium"
                          >
                            No
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmAddDuplicate}
                            className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white font-medium"
                          >
                            Yes, Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {error && !amazonResult && !duplicateConfirm && (
                  <div className="absolute bottom-0 left-0 right-0 z-20 animate-slide-up">
                    <div className="mx-3 mb-4 rounded-2xl shadow-2xl p-6 bg-red-50 border-2 border-red-400">
                      <div className="flex items-center gap-4">
                        <FiAlertCircle className="h-10 w-10 text-red-500 flex-shrink-0" />
                        <div>
                          <p className="text-base font-semibold text-red-800">Barcode not recognized</p>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {amazonResult && !duplicateConfirm && (
                  <div
                    key={currentItem.isbn}
                    className="absolute bottom-0 left-0 right-0 z-20 animate-slide-up"
                  >
                    <div className={`mx-3 mb-4 rounded-2xl shadow-2xl p-6 ${
                      amazonResult.pricing.accepted ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-400'
                    }`}>
                      <div className="flex items-center gap-5">
                        <div className="w-28 h-28 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-200">
                          {amazonResult.product.image ? (
                            <Image
                              src={amazonResult.product.image}
                              alt={amazonResult.product.title || "Product"}
                              width={112}
                              height={112}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="h-10 w-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {amazonResult.product.title || "Product"}
                          </p>
                          <div className={`inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-base font-bold ${
                            amazonResult.pricing.accepted ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {amazonResult.pricing.accepted ? (
                              <>
                                <FiCheck className="h-3 w-3" />
                                Accepted - ${amazonResult.pricing.ourPrice?.toFixed(2)}
                              </>
                            ) : (
                              <>
                                <FiX className="h-3 w-3" />
                                Not Accepted
                              </>
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
            </div>
          )}

          {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex justify-center flex-1">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (popupTimer) clearTimeout(popupTimer);
                        setShowSuccessPopup(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                    Listing Submitted Successfully!
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Your items have been submitted for review. You will receive a free shipping label via email within 24 hours.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <FiMail className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 mb-1">What happens next?</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li className="flex items-start">
                            <FiCheck className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Our team will review your items within 24 hours</span>
                          </li>
                          <li className="flex items-start">
                            <FiCheck className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>If Aproved : You&apos;ll receive a free shipping label via email</span>
                          </li>
                          <li className="flex items-start">
                            <FiCheck className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Package your items and attach the shipping label</span>
                          </li>
                          <li className="flex items-start">
                            <FiCheck className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>Drop off the package at any authorized location</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <FiClock className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-green-800 mb-1">Important Information</h4>
                        <p className="text-sm text-green-700">
                          Please check your email (including spam/junk folder) for the shipping label.
                          If you don&apos;t receive it within 24 hours, please contact our support team.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      This message will close automatically in 15 seconds...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-1 md:mx-6 mt-4 md:mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="md:hidden mt-4 space-y-4">

            <button
              type="button"
              onClick={handleScanBarcode}
              disabled={isCheckingAmazon}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl py-10 px-4 text-center shadow-lg active:scale-95 transition-transform disabled:opacity-60"
            >
              <FiCamera className="h-14 w-14 text-white mx-auto mb-3" />
              <p className="text-2xl font-extrabold text-white">Tap to Scan Barcode</p>
              <p className="text-base text-green-50 mt-1">Point your camera at the barcode</p>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowManualEntry(prev => !prev)}
                className="text-sm text-gray-500 underline"
              >
                {showManualEntry ? "Hide manual entry" : "Enter code manually"}
              </button>
            </div>

            {showManualEntry && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="flex rounded-lg shadow-sm overflow-hidden border border-gray-300">
                  <input
                    type="text"
                    value={currentItem.isbn || ''}
                    onChange={(e) => handleCurrentItemChange('isbn', e.target.value)}
                    placeholder="Enter ISBN/UPC"
                    className="flex-1 block w-full px-4 py-3 border-0 focus:ring-0 text-base"
                    disabled={isCheckingAmazon}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && currentItem.isbn.trim()) {
                        e.preventDefault();
                        handleBarcodeScanned(currentItem.isbn);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleBarcodeScanned(currentItem.isbn)}
                    disabled={isCheckingAmazon || !currentItem.isbn.trim()}
                    className="inline-flex items-center px-4 bg-gray-50 border-l border-gray-300 text-gray-700 disabled:opacity-50"
                  >
                    {isCheckingAmazon ? (
                      <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full" />
                    ) : (
                      <FiSearch className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {amazonResult && !showScanner && (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        {amazonResult.product.image ? (
                          <Image
                            src={amazonResult.product.image}
                            alt={amazonResult.product.title || "Product"}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiPackage className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {amazonResult.product.title || "Product"}
                        </p>
                        <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                          amazonResult.pricing.accepted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {amazonResult.pricing.accepted
                            ? `Accepted - $${amazonResult.pricing.ourPrice?.toFixed(2)}`
                            : 'Not accepted'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Your items</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                    {bundleItems.length} added
                  </span>
                  {bundleItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setEditMode(prev => !prev)}
                      className="text-xs font-medium px-2.5 py-1 rounded-full border border-gray-300 text-gray-600"
                    >
                      {editMode ? "Done" : "Edit"}
                    </button>
                  )}
                </div>
              </div>

              {bundleItems.length === 0 ? (
                <div className="text-center py-6">
                  <FiCamera className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Scan barcodes to add items</p>
                </div>
              ) : (
                <>
                  <div className="space-y-0 max-h-80 overflow-y-auto">
                    {bundleItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between py-2.5 ${
                          index < bundleItems.length - 1 ? 'border-b border-dashed border-gray-200' : ''
                        }`}
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
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 p-1"
                              aria-label="Remove item"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-gray-300 mt-1 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-medium text-gray-900">Cash offer total</span>
                    <span className="font-mono text-xl font-semibold text-green-700">
                      ${totalOurPrice.toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {bundleItems.length < 5 && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700">
                <FiAlertCircle className="h-3.5 w-3.5" />
                <span>Minimum 5 items required to send ({5 - bundleItems.length} more needed)</span>
              </div>
            )}

{user ? (
              <button
                type="button"
                onClick={handleContinueToShipping}
                disabled={bundleItems.length < 5}
                className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 font-medium disabled:opacity-50"
              >
                Continue
                <FiArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : !showAuthOptions ? (
              <button
                type="button"
                onClick={() => setShowAuthOptions(true)}
                disabled={bundleItems.length < 5}
                className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 font-medium disabled:opacity-50"
              >
                Next
                <FiArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-700 mb-3">Sign up to send your items, or sign in if you already have an account</p>
                <div className="flex gap-3">
                  <Link
                    href="/register"
                    className="flex-1 flex items-center justify-center py-3 rounded-xl text-white bg-blue-600 text-sm font-medium"
                  >
                    <FiUser className="mr-2 h-4 w-4" /> Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 flex items-center justify-center py-3 rounded-xl border border-blue-300 text-blue-700 text-sm font-medium"
                  >
                    <FiLogIn className="mr-2 h-4 w-4" /> Sign in
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl mt-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Add Items to Sell</h2>
                  <p className="mt-1 text-blue-100 max-w-2xl">
                    Scan barcode to automatically check our pricing and add items for sale.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center">
                    <FiPackage className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {isCheckingAmazon && (
              <div className="mx-6 mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-sm text-blue-700">Evaluating product against our buying criteria...</p>
                </div>
              </div>
            )}

            <div className="px-6 py-6 space-y-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center mb-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <FiPackage className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
                  {isMobile && (
                    <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      📱 Scanner Ready
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISBN/UPC
                    </label>
                    <div className="flex rounded-lg shadow-sm overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => handleBarcodeScanned(currentItem.isbn)}
                        disabled={isCheckingAmazon || !currentItem.isbn.trim()}
                        className={`inline-flex items-center px-4 py-3 border-r border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200 ${!currentItem.isbn.trim() ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'
                          }`}
                        title="Check Amazon"
                      >
                        {isCheckingAmazon ? (
                          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <FiSearch className="h-5 w-5" />
                        )}
                      </button>
                      <input
                        type="text"
                        value={currentItem.isbn || ''}
                        onChange={(e) => handleCurrentItemChange('isbn', e.target.value)}
                        placeholder="Enter ISBN/UPC or scan barcode"
                        className="flex-1 block w-full px-4 py-3 border-0 focus:ring-0 text-base"
                        disabled={isCheckingAmazon}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && currentItem.isbn.trim()) {
                            e.preventDefault();
                            handleBarcodeScanned(currentItem.isbn);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleScanBarcode}
                        disabled={isCheckingAmazon || !isMobile}
                        className={`inline-flex items-center px-4 py-3 border-l border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200 ${!isMobile ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-50'
                          }`}
                        title="Scan Barcode"
                      >
                        <FiCamera className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>🔍 Press Enter or click Check button to verify</span>
                      {!isMobile && (
                        <span>📱 Barcode scanning only works on mobile devices</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-4 h-full">
                      {amazonResult ? (
                        <div className="flex flex-col h-full relative">
                          <button
                            type="button"
                            onClick={clearAmazonCard}
                            className="absolute top-1 right-1 z-10 p-1 rounded-full bg-white shadow-sm border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                              {amazonResult.product.title || "Product Title"}
                            </h4>
                            {amazonResult.pricing.accepted && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiCheck className="mr-1 h-3 w-3" />
                                Accepted
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 flex-1">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                {amazonResult.product.image ? (
                                  <Image
                                    src={amazonResult.product.image}
                                    alt={amazonResult.product.title || "Product"}
                                    width={64}
                                    height={80}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FiPackage className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 rounded p-2">
                                  <p className="text-xs text-gray-500">Category</p>
                                  <p className="text-sm font-medium text-gray-900 capitalize">
                                    {getCategoryFromPricing(amazonResult.pricing.category)}
                                  </p>
                                </div>
                                <div className="bg-gray-50 rounded p-2">
                                  <p className="text-xs text-gray-500">Our Price</p>
                                  <p className="text-lg font-bold text-green-600">
                                    ${amazonResult.pricing.ourPrice || '0.00'}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className={`text-base inline-flex items-center px-2 py-1 rounded-full font-bold ${amazonResult.pricing.accepted
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                                  }`}>
                                  {amazonResult.pricing.accepted ? (
                                    amazonResult.message
                                  ) : (
                                    amazonResult.message
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {amazonResult.pricing.accepted && (
                            <div className="mt-2 text-xs text-green-600">
                              ✅ Product added to your list! Card will disappear in 5 seconds...
                            </div>
                          )}
                          {!amazonResult.pricing.accepted && (
                            <div className="mt-2 text-xs text-red-600">
                              ❌ This result will disappear in 10 seconds...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-4">
                          <FiPackage className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            {isCheckingAmazon
                              ? "Checking Amazon..."
                              : "Enter ISBN/UPC and click Check to see product details"
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <FiPackage className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Added Items</h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {bundleItems.length} item{bundleItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {bundleItems.length < 5 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          You need to add at least 5 items to sell. ({5 - bundleItems.length} more needed)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {bundleItems.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {bundleItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 relative">
                              {item.imageUrl ? (
                                <>
                                  <Image
                                    src={item.imageUrl}
                                    alt={`Item ${item.isbn}`}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.onerror = null;
                                      target.src = '/placeholder-image.png';
                                    }}
                                  />
                                  <div className="absolute -bottom-1 -right-1">
                                    {item.amazonData?.image === item.imageUrl ? (
                                      <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full border border-white" title="Amazon Image"></span>
                                    ) : (
                                      <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full border border-white" title="Custom Image"></span>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-sm sm:text-xl">
                                    {CATEGORY_EMOJI[item.category]}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-md font-medium text-gray-900 truncate pr-2">
                                {item.amazonData?.title || `ISBN: ${item.isbn}`}
                              </h4>
                              <div className="mt-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.category}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Very Good
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    Qty: {item.quantity}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900">
                                    Our Price: ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0 p-1.5 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 self-start sm:self-center"
                          >
                            <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiCamera className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No items added yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {isMobile ? "Scan barcodes to automatically add items" : "Add items using the form above"}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <FiDollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Total Our Price</h3>
                      <p className="text-sm text-gray-600">Total value of your items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${totalOurPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bundleItems.reduce((total, item) => total + item.quantity, 0)} items
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                {!user ? (
                  <div className="space-y-4">
                    <p className="text-center text-gray-600">
                      Please login or sign up to start selling
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/login"
                        className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <FiLogIn className="mr-2 h-5 w-5" />
                        Login to Start selling
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <FiUser className="mr-2 h-5 w-5" />
                        Sign Up to Sell Items
                      </Link>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleContinueToShipping}
                    disabled={bundleItems.length < 5}
                    className="w-full flex justify-center py-4 px-6 border border-transparent shadow-lg text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center">
                      Continue to Shipping Information
                      <FiArrowRight className="ml-2 h-5 w-5" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}