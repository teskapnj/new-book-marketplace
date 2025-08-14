// app/dashboard/listings/create/page.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { FiHome, FiSave, FiCamera, FiDollarSign, FiPackage, FiPlus, FiMinus, FiX, FiCheck, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import Link from "next/link";
import Head from "next/head";

interface BundleItem {
  id: string;
  isbn: string;
  condition: "like-new" | "good";
  quantity: number;
  price: number;
  image: string | null;
  category: "book" | "cd" | "dvd" | "game" | "mix";
}

export default function CreateListingPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mevcut ürün formu için state
  const [currentItem, setCurrentItem] = useState<BundleItem>({
    id: "",
    isbn: "",
    condition: "like-new",
    quantity: 1,
    price: 0,
    image: null,
    category: "book"
  });
  
  // Eklenen ürünler listesi
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [storageStatus, setStorageStatus] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [loadStatus, setLoadStatus] = useState<string>("");
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Kullanıcıya özel depolama anahtarı - useCallback ile memoize edildi
  const getStorageKey = useCallback(() => {
    return user ? `bundleListingDraft_${user.uid}` : 'bundleListingDraft_guest';
  }, [user]);

  // localStorage testi ve özel mod kontrolü - sadece bir kez çalışacak
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let mounted = true;
    
    const initializeStorage = async () => {
      try {
        // Özel mod kontrolü
        try {
          const testKey = 'storageTest_' + Date.now();
          localStorage.setItem(testKey, 'test');
          const testValue = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          
          if (!mounted) return;
          
          if (testValue === 'test') {
            setIsPrivateMode(false);
            setStorageStatus("✅ localStorage is working");
          } else {
            throw new Error("Storage test failed");
          }
        } catch (e) {
          if (!mounted) return;
          setIsPrivateMode(true);
          setStorageStatus("❌ Private browsing mode detected");
        }
      } catch (e) {
        if (!mounted) return;
        console.error("Storage initialization failed:", e);
        setStorageStatus("❌ localStorage is not available");
        setIsPrivateMode(true);
      } finally {
        if (mounted) {
          setIsMounted(true);
          setIsInitializing(false);
        }
      }
    };

    initializeStorage();
    
    return () => {
      mounted = false;
    };
  }, []); // Boş dependency array - sadece mount time'da çalışır

  // Verileri localStorage'a kaydet - useCallback ile optimize edildi
  const saveToStorage = useCallback(async () => {
    if (!isMounted || isPrivateMode || isInitializing) return;
    
    try {
      console.log("Attempting to save data to localStorage...");
      setSaveStatus("Saving...");
      
      // Resimleri kaldırarak veriyi küçült
      const dataToSave = {
        bundleItems: bundleItems.map(item => ({
          ...item,
          image: null // Resimleri kaydetme
        })),
        currentItem: {
          ...currentItem,
          image: null // Resmi kaydetme
        },
        timestamp: Date.now() // Timestamp ekle
      };
      
      const dataString = JSON.stringify(dataToSave);
      console.log("Data to save (size):", dataString.length);
      
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, dataString);
      console.log("Data saved successfully to localStorage with key:", storageKey);
      
      setSaveStatus(`✅ Saved ${bundleItems.length} items`);
      setStorageWarning(false);
      
      // 3 saniye sonra save status'u temizle
      setTimeout(() => setSaveStatus(""), 3000);
      
    } catch (e) {
      console.error("Failed to save to localStorage", e);
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        setStorageWarning(true);
        setError("Storage limit reached. Please remove some items or reset.");
        setSaveStatus("❌ Storage limit exceeded");
      } else {
        setError("Failed to save your data. Your changes may not be preserved.");
        setSaveStatus("❌ Failed to save");
      }
      
      // 5 saniye sonra error status'u temizle
      setTimeout(() => setSaveStatus(""), 5000);
    }
  }, [bundleItems, currentItem, isMounted, isPrivateMode, isInitializing, getStorageKey]);

  // Verileri localStorage'dan yükle - useCallback ile optimize edildi
  const loadFromStorage = useCallback(async () => {
    if (!isMounted || isPrivateMode || isInitializing) return;
    
    try {
      console.log("Attempting to load data from localStorage...");
      setLoadStatus("Loading...");
      
      const storageKey = getStorageKey();
      const savedData = localStorage.getItem(storageKey);
      console.log("Saved data from localStorage with key", storageKey, ":", savedData ? "found" : "not found");
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log("Parsed data:", { bundleItemsCount: parsed.bundleItems?.length, timestamp: parsed.timestamp });
        
        // State güncellemelerini batch olarak yap
        setBundleItems(parsed.bundleItems || []);
        setCurrentItem(parsed.currentItem || {
          id: "",
          isbn: "",
          condition: "like-new",
          quantity: 1,
          price: 0,
          image: null,
          category: "book"
        });
        
        setLoadStatus(`✅ Loaded ${parsed.bundleItems?.length || 0} items`);
      } else {
        console.log("No saved data found in localStorage");
        setLoadStatus("No saved data found");
      }
      
      // 3 saniye sonra load status'u temizle
      setTimeout(() => setLoadStatus(""), 3000);
      
    } catch (e) {
      console.error("Failed to load saved data", e);
      setError("Failed to load your saved data. Please start fresh.");
      setLoadStatus("❌ Failed to load data");
      
      // 5 saniye sonra error status'u temizle
      setTimeout(() => setLoadStatus(""), 5000);
    }
  }, [isMounted, isPrivateMode, isInitializing, getStorageKey]);

  // İlk yüklemede verileri yükle
  useEffect(() => {
    if (isMounted && !isPrivateMode && !isInitializing) {
      loadFromStorage();
    }
  }, [isMounted, isPrivateMode, isInitializing, loadFromStorage]);

  // Değişiklikleri localStorage'a kaydet - debounced save
  useEffect(() => {
    if (!isMounted || isInitializing) return;
    
    const timeoutId = setTimeout(() => {
      saveToStorage();
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [bundleItems, currentItem, saveToStorage, isMounted, isInitializing]);

  // Sayfa visibility ve focus event'leri için optimize edilmiş handler
  useEffect(() => {
    if (!isMounted || isPrivateMode) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Page became visible, scheduling data reload...");
        // Kısa bir delay ile reload et
        timeoutId = setTimeout(() => {
          loadFromStorage();
        }, 100);
      }
    };

    const handleFocus = () => {
      console.log("Window focused, scheduling data reload...");
      // Kısa bir delay ile reload et
      timeoutId = setTimeout(() => {
        loadFromStorage();
      }, 100);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isMounted, isPrivateMode, loadFromStorage]);

  // User authentication kontrolü
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleScanBarcode = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const randomISBN = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
      const checkDigit = (11 - (randomISBN.split('').reduce((sum, digit, index) => {
        return sum + parseInt(digit) * (index % 2 === 0 ? 1 : 3);
      }, 0) % 11)) % 10;
      const fullISBN = `978${randomISBN}${checkDigit}`;
      
      setCurrentItem(prev => ({
        ...prev,
        isbn: fullISBN
      }));
      
      setIsScanning(false);
    }, 1500);
  };

  const handleCurrentItemChange = (field: keyof BundleItem, value: string | number) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setCurrentItem(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const addNewItem = () => {
    // Form validasyonu
    if (!currentItem.isbn || currentItem.price <= 0) {
      setError("Please fill in ISBN and price (greater than 0) for the item");
      return;
    }
    
    // Yeni ürünü listeye ekle
    const newItem = {
      ...currentItem,
      id: Date.now().toString()
    };
    
    setBundleItems(prev => [...prev, newItem]);
    
    // Formu sıfırla
    setCurrentItem({
      id: "",
      isbn: "",
      condition: "like-new",
      quantity: 1,
      price: 0,
      image: null,
      category: "book"
    });
    
    setError("");
  };

  const removeItem = (id: string) => {
    setBundleItems(prev => prev.filter(item => item.id !== id));
  };

  const generateTitle = () => {
    const categoryCounts: Record<string, number> = {};
    const conditionCounts: Record<string, number> = {};
    
    bundleItems.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      conditionCounts[item.condition] = (conditionCounts[item.condition] || 0) + 1;
    });
    
    const dominantCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];
    const dominantCondition = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0][0];
    const totalItems = bundleItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const categoryNames = {
      book: "Book",
      cd: "CD",
      dvd: "DVD",
      game: "Game",
      mix: "Mixed Media"
    };
    
    const conditionNames = {
      "like-new": "Like New",
      "good": "Good"
    };
    
    return `${totalItems} ${categoryNames[dominantCategory as keyof typeof categoryNames]} Collection in ${conditionNames[dominantCondition as keyof typeof conditionNames]} Condition`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      if (bundleItems.length < 10) {
        setError("Please add at least 10 items to create a bundle listing");
        setIsSubmitting(false);
        return;
      }
      
      const title = generateTitle();
      setGeneratedTitle(title);
      
      console.log("Listing data:", {
        title,
        items: bundleItems
      });
      
      setSuccess(true);
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // 3 saniye sonra başarı mesajını gizle
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error creating listing:", err);
      setError("Failed to create listing. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Formu tamamen sıfırla (isteğe bağlı)
  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setBundleItems([]);
      setCurrentItem({
        id: "",
        isbn: "",
        condition: "like-new",
        quantity: 1,
        price: 0,
        image: null,
        category: "book"
      });
      setError("");
      
      if (typeof window !== 'undefined' && !isPrivateMode) {
        const storageKey = getStorageKey();
        localStorage.removeItem(storageKey);
        console.log("Storage cleared for key:", storageKey);
      }
    }
  };

  // Manuel kaydetme
  const manualSave = () => {
    saveToStorage();
  };

  // Manuel yükleme
  const manualLoad = () => {
    loadFromStorage();
  };

  // Storage verisini göster
  const showStorageData = () => {
    if (typeof window !== 'undefined') {
      const storageKey = getStorageKey();
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          alert(`Storage contains ${parsed.bundleItems?.length || 0} items:\n\nTimestamp: ${new Date(parsed.timestamp || 0).toLocaleString()}\n\n${JSON.stringify(parsed, null, 2)}`);
        } catch (e) {
          alert("Failed to parse storage data");
        }
      } else {
        alert("No data found in storage");
      }
    }
  };

  // Storage anahtarını göster
  const showStorageKey = () => {
    const storageKey = getStorageKey();
    alert(`Storage key: ${storageKey}\nUser: ${user?.uid || 'guest'}\nMounted: ${isMounted}\nPrivate: ${isPrivateMode}`);
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Create New Bundle Listing | MarketPlace</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <main className="font-sans antialiased">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Storage Status */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="text-sm text-gray-600">
              Storage Status: {storageStatus}
            </div>
            <div className="text-sm text-gray-600">
              Load Status: {loadStatus}
            </div>
            <div className="text-sm text-gray-600">
              Save Status: {saveStatus}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={manualSave}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Manual Save
              </button>
              <button
                type="button"
                onClick={manualLoad}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
              >
                Manual Load
              </button>
              <button
                type="button"
                onClick={showStorageData}
                className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Show Storage
              </button>
              <button
                type="button"
                onClick={showStorageKey}
                className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                Show Key
              </button>
            </div>
          </div>
          
          {/* Private Mode Warning */}
          {isPrivateMode && (
            <div className="mb-4 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-orange-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-orange-700">
                    You are in private browsing mode. Your data will not be saved when you close the browser.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Back to Listings Link */}
          <div className="mb-8 flex justify-between items-center">
            <Link 
              href="/dashboard/listings" 
              className="inline-flex items-center px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-blue-600 hover:text-blue-700 hover:shadow-md transition-all duration-200"
            >
              <FiHome className="mr-2 h-4 w-4" />
              Back to Listings
            </Link>
            
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center px-4 py-3 bg-white rounded-xl shadow-sm text-sm font-medium text-red-600 hover:text-red-700 hover:shadow-md transition-all duration-200"
            >
              <FiX className="mr-2 h-4 w-4" />
              Reset All
            </button>
          </div>
          
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Bundle Listing</h2>
                  <p className="mt-1 text-blue-100 max-w-2xl">
                    Add at least 10 items to create your bundle. Title will be generated automatically.
                  </p>
                  <p className="mt-2 text-blue-200 text-sm">
                    Your progress is saved automatically. Data persists until you remove items or reset.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center">
                    <FiPackage className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Success Message - Toast Notification */}
            {showSuccess && (
              <div className="mx-6 mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 font-medium">
                      Bundle "{generatedTitle}" created successfully! Your data is preserved.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Storage Warning */}
            {storageWarning && (
              <div className="mx-6 mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Storage limit reached. Only text data is saved. You'll need to re-upload images when you return.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
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
              {/* Current Item Form */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center mb-5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <FiPackage className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* ISBN Input with Scanner */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISBN
                    </label>
                    <div className="flex rounded-lg shadow-sm overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                      <input
                        type="text"
                        value={currentItem.isbn}
                        onChange={(e) => handleCurrentItemChange('isbn', e.target.value)}
                        placeholder="Enter ISBN or scan barcode"
                        className="flex-1 block w-full px-4 py-3 border-0 focus:ring-0 text-base"
                      />
                      <button
                        type="button"
                        onClick={handleScanBarcode}
                        disabled={isScanning}
                        className="inline-flex items-center px-4 py-3 border-l border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                      >
                        {isScanning ? (
                          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V8a8 8 0 018-0z"></path>
                          </svg>
                        ) : (
                          <FiCamera className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={currentItem.category}
                        onChange={(e) => handleCurrentItemChange('category', e.target.value)}
                        className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                      >
                        <option value="book">Book</option>
                        <option value="cd">CD</option>
                        <option value="dvd">DVD</option>
                        <option value="game">Game</option>
                        <option value="mix">Mixed Media</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Condition Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <div className="relative">
                      <select
                        value={currentItem.condition}
                        onChange={(e) => handleCurrentItemChange('condition', e.target.value)}
                        className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                      >
                        <option value="like-new">Like New</option>
                        <option value="good">Good</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex rounded-lg shadow-sm overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                      <button
                        type="button"
                        onClick={() => handleCurrentItemChange('quantity', Math.max(1, currentItem.quantity - 1))}
                        className="px-4 py-3 bg-gray-50 text-gray-600 hover:bg-gray-100 border-r border-gray-300"
                      >
                        <FiMinus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        value={currentItem.quantity}
                        onChange={(e) => handleCurrentItemChange('quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        className="flex-1 block w-full px-4 py-3 text-center border-0 focus:ring-0 text-base"
                      />
                      <button
                        type="button"
                        onClick={() => handleCurrentItemChange('quantity', currentItem.quantity + 1)}
                        className="px-4 py-3 bg-gray-50 text-gray-600 hover:bg-gray-100 border-l border-gray-300"
                      >
                        <FiPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <div className="flex rounded-lg shadow-sm overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                      <span className="inline-flex items-center px-4 bg-gray-50 text-gray-500 border-r border-gray-300">
                        <FiDollarSign className="h-5 w-5" />
                      </span>
                      <input
                        type="number"
                        value={currentItem.price}
                        onChange={(e) => handleCurrentItemChange('price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="flex-1 block w-full px-4 py-3 border-0 focus:ring-0 text-base"
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
                          {currentItem.image ? (
                            <img src={currentItem.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <FiPackage className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <FiCamera className="mr-1 h-4 w-4" />
                          Upload
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Add Item Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={addNewItem}
                    className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Add Item
                  </button>
                </div>
              </div>
              
              {/* Added Items List */}
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
                
                {bundleItems.length < 10 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          You need to add at least 10 items to create a bundle listing. ({10 - bundleItems.length} more needed)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {bundleItems.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {bundleItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-gray-700">
                                {item.category === "book" ? "📚" : 
                                 item.category === "cd" ? "💿" : 
                                 item.category === "dvd" ? "📀" : 
                                 item.category === "game" ? "🎮" : "📦"}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-md font-medium text-gray-900">ISBN: {item.isbn}</h4>
                              <p className="text-sm text-gray-600">
                                {item.category.charAt(0).toUpperCase() + item.category.slice(1)} • {item.condition === "like-new" ? "Like New" : "Good"} • Qty: {item.quantity} • ${item.price.toFixed(2)}
                              </p>
                              {!item.image && (
                                <p className="text-xs text-orange-600 mt-1">⚠️ Image not saved</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No items added yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Add items using the form above</p>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <div className="pt-5">
                <button
                  type="submit"
                  disabled={isSubmitting || bundleItems.length < 10}
                  className="w-full flex justify-center py-4 px-6 border border-transparent shadow-lg text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V8a8 8 0 018-0z"></path>
                      </svg>
                      Creating Bundle...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiSave className="mr-2 h-5 w-5" />
                      Create Bundle Listing
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}