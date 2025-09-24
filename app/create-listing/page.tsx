"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiHome, FiCamera, FiDollarSign, FiPackage, FiX, FiCheck, FiAlertCircle, FiSearch, FiBookOpen, FiUser, FiLogIn, FiSettings, FiMessageSquare, FiMail, FiClock, FiCheckCircle, FiList, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { AmazonProduct, PricingResult } from "@/lib/pricingEngine";
import DOMPurify from 'isomorphic-dompurify';
import UserListingsSection from "@/components/UserListingsSection";
import Image from 'next/image';

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

  const [uploadProgress, setUploadProgress] = useState("");
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
  const [scannerError, setScannerError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupTimer, setPopupTimer] = useState<NodeJS.Timeout | null>(null);
  const [prevUser, setPrevUser] = useState(user);
  const [showUserListings, setShowUserListings] = useState(false);

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

  const validateDescription = (text: string): boolean => {
    if (text.length > 500) {
      setError("Description must be 500 characters or less");
      return false;
    }
    setError("");
    return true;
  };


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
    try {
      setIsCheckingAmazon(true);
      clearAmazonResults();
      stopScanning();
      setShowScanner(false);
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

          setTimeout(() => {
            setAmazonResult(null);
            setError("");
            setCurrentItem(prev => ({
              ...prev,
              isbn: "",
              image: null,
              imageUrl: null,
              amazonData: undefined
            }));
          }, 10000);
        } else {
          setTimeout(() => {
            setAmazonResult(null);
            setError("");
            setCurrentItem(prev => ({
              ...prev,
              isbn: "",
              image: null,
              imageUrl: null,
              amazonData: undefined
            }));
          }, 10000);
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


  const handleScanBarcode = () => {
    if (!isMobile) {
      setError("Barcode scanning only works on mobile devices");
      return;
    }
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
    continuous: false,
    timeout: 30000
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
    const parsedData = parsed as Record<string, unknown>; // Bu satırı ekle

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

  const generateTitle = () => {
    const categoryCounts: Record<string, number> = {};
    bundleItems.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    const dominantCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];
    const totalItems = bundleItems.reduce((sum, item) => sum + item.quantity, 0);

    const categoryNames = {
      book: "Book",
      cd: "CD",
      dvd: "DVD",
      game: "Game",
      mix: "Mixed Media"
    };

    return `${totalItems} ${categoryNames[dominantCategory as keyof typeof categoryNames]} Collection in Used Condition`;
  };

  const uploadImageToStorage = async (item: BundleItem, userId: string): Promise<string | null> => {
    if (!item.imageBlob) return null;

    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const imagePath = `listings/${userId}/${timestamp}_${item.isbn}_${randomString}.jpg`;

      console.log(`Uploading image for ISBN ${item.isbn}`);
      const storageRef = ref(storage, imagePath);
      const snapshot = await uploadBytes(storageRef, item.imageBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log(`✅ Image uploaded successfully`);
      return downloadURL;
    } catch (error) {
      console.error(`Failed to upload image for ISBN ${item.isbn}:`, error);
      return null;
    }
  };

  const handleContinueToShipping = () => {
    saveToStorage();
    router.push('/create-listing/shipping');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Please login or sign up to create a listing");
      return;
    }

    try {
      if (!validateDescription(description)) {
        return;
      }



      if (bundleItems.length < 5) {
        setError("Please add at least 5 items to create a bundle listing");
        return;
      }

      const title = generateTitle();


      setUploadProgress("Processing images...");
      const uploadedItems = await Promise.all(
        bundleItems.map(async (item, index) => {
          setUploadProgress(`Processing image ${index + 1} of ${bundleItems.length}...`);

          let finalImageUrl = null;
          if (item.amazonData?.image) {
            finalImageUrl = item.amazonData.image;
            console.log(`✅ Using Amazon image URL for ISBN ${item.isbn}`);
          }
          else if (item.imageBlob) {
            finalImageUrl = await uploadImageToStorage(item, user!.uid);
            console.log(`✅ Uploaded manual image for ISBN ${item.isbn}`);
          }
          else {
            console.log(`⚠️ No image available for ISBN ${item.isbn}`);
          }

          return {
            id: item.id,
            isbn: item.isbn,
            condition: item.condition,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
            imageUrl: finalImageUrl,
            amazonData: item.amazonData ? {
              title: item.amazonData.title,
              asin: item.amazonData.asin,
              price: item.amazonData.price,
              sales_rank: item.amazonData.sales_rank,
              category: item.amazonData.category,
              image: item.amazonData.image
            } : null,
            ourPrice: item.ourPrice || null,
            originalPrice: item.originalPrice || null
          };
        })
      );

      setUploadProgress("Saving listing to database...");
      const totalValue = uploadedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalItems = uploadedItems.reduce((sum, item) => sum + item.quantity, 0);

      const listingData = {
        title: DOMPurify.sanitize(title).substring(0, 200),
        description: DOMPurify.sanitize(description).substring(0, 500),
        totalItems: Math.max(0, totalItems),
        totalValue: Math.max(0, totalValue),
        totalAmazonValue: Math.max(0, totalAmazonValue),
        status: "pending",
        vendorId: user?.uid || "",
        vendorName: user?.displayName ? DOMPurify.sanitize(user.displayName).substring(0, 100) :
          user?.email ? DOMPurify.sanitize(user.email.split('@')[0]).substring(0, 50) : "Anonymous",
        vendorEmail: user?.email ? DOMPurify.sanitize(user.email).substring(0, 254) : "",
        bundleItems: uploadedItems.map(item => ({
          ...item,
          isbn: DOMPurify.sanitize(item.isbn || '').substring(0, 50),
          condition: "very-good",
          quantity: Math.max(1, item.quantity || 1),
          price: Math.max(0, item.price || 0),
          category: ['book', 'cd', 'dvd', 'game', 'mix'].includes(item.category) ? item.category : 'book',
          amazonData: item.amazonData ? {
            title: DOMPurify.sanitize(item.amazonData.title || '').substring(0, 200),
            asin: DOMPurify.sanitize(item.amazonData.asin || '').substring(0, 50),
            price: Math.max(0, item.amazonData.price || 0),
            sales_rank: Math.max(0, item.amazonData.sales_rank || 0),
            category: DOMPurify.sanitize(item.amazonData.category || '').substring(0, 50),
            image: item.amazonData.image && typeof item.amazonData.image === 'string' ? item.amazonData.image : null
          } : null
        })),
        shippingInfo: {
          firstName: DOMPurify.sanitize(shippingInfo.firstName).substring(0, 50),
          lastName: DOMPurify.sanitize(shippingInfo.lastName).substring(0, 50),
          paypalAccount: DOMPurify.sanitize(shippingInfo.paypalAccount).substring(0, 254),
          address: {
            street: DOMPurify.sanitize(shippingInfo.address.street).substring(0, 200),
            city: DOMPurify.sanitize(shippingInfo.address.city).substring(0, 100),
            state: DOMPurify.sanitize(shippingInfo.address.state).substring(0, 50),
            zip: DOMPurify.sanitize(shippingInfo.address.zip).substring(0, 20),
            country: shippingInfo.address.country === 'US' ? 'US' : 'US'
          },
          packageDimensions: {
            length: Math.max(0, Math.min(18, shippingInfo.packageDimensions.length)),
            width: Math.max(0, Math.min(16, shippingInfo.packageDimensions.width)),
            height: Math.max(0, Math.min(16, shippingInfo.packageDimensions.height)),
            weight: Math.max(0, Math.min(50, shippingInfo.packageDimensions.weight))
          }
        },
        createdAt: serverTimestamp(),
        views: 0,
        hasAmazonImages: uploadedItems.some(item =>
          item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.includes('amazon.com')
        )
      };

      const docRef = await addDoc(collection(db, "listings"), listingData);
      console.log("✅ Document written with ID: ", docRef.id);

      try {
        await fetch('/api/send-seller-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sellerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
            sellerEmail: user?.email || "",
            paypalEmail: shippingInfo.paypalAccount,
            totalItems: totalItems,
            totalValue: totalValue,
            totalAmazonValue: totalAmazonValue,
            submissionId: docRef.id,
            dashboardUrl: `${window.location.origin}/admin/listings`,
            shippingInfo: shippingInfo
          })
        });
        console.log("Admin notification sent");
      } catch (error) {
        console.error("Admin email error:", error);
      }

      try {
        await fetch('/api/send-seller-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sellerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
            sellerEmail: user?.email || "",
            totalItems: totalItems,
            totalValue: totalValue,
            submissionId: docRef.id
          })
        });
        console.log("Seller confirmation sent");
      } catch (error) {
        console.error("Seller email error:", error);
      }

      setShowSuccessPopup(true);
      setUploadProgress("");

      if (!isPrivateMode) {
        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
        console.log("✅ Draft cleared from localStorage");
      }

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

      if (popupTimer) clearTimeout(popupTimer);
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 15000);
      setPopupTimer(timer);
    } catch (err) {
      console.error("Error creating listing:", err);
      setError("Failed to create listing. Please try again.");
      setUploadProgress("");
    }
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
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="block sm:hidden">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Link
                    href="/"
                    className="flex items-center justify-center px-3 py-2 bg-white rounded-lg shadow-sm text-xs font-medium text-blue-600 hover:text-blue-700 transition-all"
                  >
                    <FiHome className="mr-1 h-3 w-3" />
                    Home
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center px-3 py-2 bg-white rounded-lg shadow-sm text-xs font-medium text-green-600 hover:text-green-700 transition-all"
                  >
                    <FiMessageSquare className="mr-1 h-3 w-3" />
                    Contact
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Link
                    href="/condition-guidelines"
                    className="flex items-center justify-center px-3 py-2 bg-white rounded-lg shadow-sm text-xs font-medium text-purple-600 hover:text-purple-700 transition-all"
                  >
                    <FiBookOpen className="mr-1 h-3 w-3" />
                    Guidelines
                  </Link>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center justify-center px-3 py-2 bg-white rounded-lg shadow-sm text-xs font-medium text-red-600 hover:text-red-700 transition-all"
                  >
                    <FiX className="mr-1 h-3 w-3" />
                    Reset All
                  </button>
                </div>
                {user && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => setShowUserListings(!showUserListings)}
                      className="flex items-center justify-center px-3 py-2 bg-white rounded-lg shadow-sm text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-all"
                    >
                      <FiList className="mr-1 h-3 w-3" />
                      Submissions
                    </button>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center justify-center px-3 py-2 bg-white rounded-lg shadow-sm text-xs font-medium text-gray-600 hover:text-gray-700 transition-all"
                    >
                      <FiSettings className="mr-1 h-3 w-3" />
                      Settings
                    </Link>
                  </div>
                )}
              </div>
              <div className={`hidden sm:grid gap-3 ${user ? 'grid-cols-6' : 'grid-cols-4'}`}>
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
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">📱 Barcode Scanner</h3>
                  <button
                    onClick={closeBarcodeScanner}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                {!isCameraReady && !cameraError && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Preparing camera...</p>
                  </div>
                )}
                {cameraError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-sm">{cameraError}</p>
                  </div>
                )}
                {scannerError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 text-sm">{scannerError}</p>
                  </div>
                )}
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-64 bg-black rounded-lg object-cover"
                    playsInline
                    muted
                  />
                  {isCameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-red-500 w-48 h-32 rounded-lg"></div>
                    </div>
                  )}
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Point the camera at the barcode/QR code
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
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
                              <span>You&apos;ll receive a free shipping label via email</span>
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

            {uploadProgress && (
              <div className="mx-6 mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-sm text-blue-700">{uploadProgress}</p>
                </div>
              </div>
            )}

            {isCheckingAmazon && (
              <div className="mx-6 mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-sm text-blue-700">Evaluating product against our buying criteria...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
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

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-8">
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
                                    {item.category === "book" ? "📚" :
                                      item.category === "cd" ? "💿" :
                                        item.category === "dvd" ? "📀" :
                                          item.category === "game" ? "🎮" : "📦"}
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
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}