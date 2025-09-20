// app/create-listing/shipping/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiHome, FiPackage, FiAlertCircle, FiTruck, FiFileText, FiArrowLeft, FiArrowRight, FiMail, FiLogIn } from "react-icons/fi";
import Link from "next/link";
import Head from "next/head";
import DOMPurify from 'isomorphic-dompurify';

interface ImageStats {
  width: number;
  height: number;
  size: number;
  format: string;
}

interface AmazonData {
  title: string;
  asin: string;
  price: number;
  sales_rank: number;
  category: string;
  image: string | null;
}
// Gerekli arayüz tanımlamaları
interface BundleItem {
  id: string;
  isbn: string;
  condition: "very-good";
  quantity: number;
  price: number;
  image: string | null;
  imageBlob: Blob | null;
  imageStats?: ImageStats; // any yerine ImageStats
  category: "book" | "cd" | "dvd" | "game" | "mix";
  amazonData?: AmazonData; // any yerine AmazonData
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

export default function ShippingInfoPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  
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
  
  const [shippingError, setShippingError] = useState<string>('');
  const [dimensionErrors, setDimensionErrors] = useState({
    length: '',
    width: '',
    height: '',
    weight: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const totalOurPrice = bundleItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const totalAmazonValue = bundleItems.reduce((total, item) => {
    return total + ((item.originalPrice || 0) * item.quantity);
  }, 0);

  // localStorage'dan verileri yükle
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
    if (!isMounted || isPrivateMode || isInitializing) return;
    
    try {
      const storageKey = user ? `bundleListingDraft_${user.uid}` : 'bundleListingDraft_guest';
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Sadece gönderim yapılmamışsa verileri yükle
        if (!success) {
          if (parsed.bundleItems && Array.isArray(parsed.bundleItems)) {
            setBundleItems(parsed.bundleItems);
          }
          
          if (parsed.description) {
            setDescription(parsed.description);
          }
          
          if (parsed.shippingInfo) {
            setShippingInfo(parsed.shippingInfo);
          }
        } else {
          // Gönderim başarılı olduysa localStorage'ı temizle
          localStorage.removeItem(storageKey);
        }
      }
    } catch (e) {
      console.error("Error loading saved data", e);
    }
  }, [isMounted, isPrivateMode, isInitializing, user, success]);

  const validateShippingInfo = (): boolean => {
    setDimensionErrors({
      length: '',
      width: '',
      height: '',
      weight: ''
    });
    
    if (!shippingInfo.firstName.trim() || !shippingInfo.lastName.trim()) {
      setShippingError("Please enter your first and last name");
      return false;
    }
    
    if (!shippingInfo.paypalAccount.trim()) {
      setShippingError("Please enter your PayPal account email");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.paypalAccount)) {
      setShippingError("Please enter a valid PayPal email address");
      return false;
    }
    
    if (!shippingInfo.address.street || !shippingInfo.address.city ||
      !shippingInfo.address.state || !shippingInfo.address.zip) {
      setShippingError("Please fill in all address fields");
      return false;
    }
    
    if (shippingInfo.packageDimensions.length <= 0 || shippingInfo.packageDimensions.width <= 0 ||
      shippingInfo.packageDimensions.height <= 0 || shippingInfo.packageDimensions.weight <= 0) {
      setShippingError("Please enter valid package dimensions and weight");
      return false;
    }
    
    if (shippingInfo.packageDimensions.weight > 50) {
      setDimensionErrors(prev => ({ ...prev, weight: "Weight cannot exceed 50 pounds" }));
      setShippingError("Package weight cannot exceed 50 pounds");
      return false;
    }
    
    if (shippingInfo.packageDimensions.length > 18) {
      setDimensionErrors(prev => ({ ...prev, length: "Length cannot exceed 18 inches" }));
    }
    
    if (shippingInfo.packageDimensions.width > 16) {
      setDimensionErrors(prev => ({ ...prev, width: "Width cannot exceed 16 inches" }));
    }
    
    if (shippingInfo.packageDimensions.height > 16) {
      setDimensionErrors(prev => ({ ...prev, height: "Height cannot exceed 16 inches" }));
    }
    
    if (shippingInfo.packageDimensions.length > 18 || shippingInfo.packageDimensions.width > 16 || shippingInfo.packageDimensions.height > 16) {
      setShippingError("Package dimensions cannot exceed 18x16x16 inches");
      return false;
    }
    
    setShippingError("");
    return true;
  };

  const handleNameChange = (field: keyof Pick<ShippingInfo, 'firstName' | 'lastName'>, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaypalAccountChange = (value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      paypalAccount: value
    }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handlePackageDimensionsChange = (field: keyof PackageDimensions, value: number) => {
    const numValue = isNaN(value) ? 0 : value;
    setShippingInfo(prev => ({
      ...prev,
      packageDimensions: {
        ...prev.packageDimensions,
        [field]: numValue
      }
    }));
    
    const newErrors = { ...dimensionErrors };
    switch (field) {
      case 'weight':
        if (numValue > 50) {
          newErrors.weight = "Weight cannot exceed 50 pounds";
        } else {
          newErrors.weight = '';
        }
        break;
      case 'length':
        if (numValue > 18) {
          newErrors.length = "Length cannot exceed 18 inches";
        } else {
          newErrors.length = '';
        }
        break;
      case 'width':
        if (numValue > 16) {
          newErrors.width = "Width cannot exceed 16 inches";
        } else {
          newErrors.width = '';
        }
        break;
      case 'height':
        if (numValue > 16) {
          newErrors.height = "Height cannot exceed 16 inches";
        } else {
          newErrors.height = '';
        }
        break;
    }
    
    setDimensionErrors(newErrors);
    
    if (newErrors.length || newErrors.width || newErrors.height || newErrors.weight) {
      setShippingError("Package exceeds size or weight limits");
    } else if (shippingError === "Package exceeds size or weight limits") {
      setShippingError("");
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please login to submit your listing");
      return;
    }
    
    if (!validateShippingInfo()) {
      return;
    }
    
    if (bundleItems.length < 5) {
      setError("Please add at least 5 items to create a bundle listing");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const title = generateTitle();      
      const uploadedItems = await Promise.all(
        bundleItems.map(async (item) => {
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
      
      // Admin notification email
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
      
      // Seller confirmation email
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
      
      setSuccess(true);
      setIsSubmitting(false);
      
      // localStorage'dan verileri temizle
      if (!isPrivateMode) {
        try {
          const storageKey = user ? `bundleListingDraft_${user.uid}` : 'bundleListingDraft_guest';
          localStorage.removeItem(storageKey);
          console.log("✅ Draft cleared from localStorage");
          
          // Ekstra kontrol: temizlendiğini doğrula
          const remainingData = localStorage.getItem(storageKey);
          if (remainingData) {
            console.warn("⚠️ Draft may not have been cleared properly");
          } else {
            console.log("✅ Draft successfully cleared from localStorage");
          }
        } catch (error) {
          console.error("Error clearing localStorage:", error);
        }
      }
      
      // Popup'ı create-listing sayfasında göstermek için localStorage'a flag koy
      try {
        localStorage.setItem('showSuccessPopup', 'true');
        console.log("✅ Success popup flag set in localStorage");
      } catch (error) {
        console.error("Error setting success popup flag:", error);
      }
      
      // Hemen create-listing sayfasına yönlendir
      router.push('/create-listing');
      
    } catch (err) {
      console.error("Error creating listing:", err);
      setError("Failed to create listing. Please try again.");
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    // Sadece gönderim yapılmadıysa verileri kaydet
    if (!success) {
      if (!isPrivateMode) {
        const storageKey = user ? `bundleListingDraft_${user.uid}` : 'bundleListingDraft_guest';
        const dataToSave = {
          bundleItems: bundleItems.map(item => ({
            ...item,
            image: null,
            imageBlob: null,
            imageStats: null
          })),
          description: description,
          shippingInfo: shippingInfo,
          timestamp: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      }
    }
    
    // Önceki sayfaya geri dön
    router.back();
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page</p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <FiLogIn className="mr-2 h-5 w-5" />
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <title>Shipping Information | SecondLife Media</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <main className="font-sans antialiased">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={goBack}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Items
              </button>
              <Link
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FiHome className="mr-2 h-5 w-5" />
                Home
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Shipping Information</h2>
                  <p className="mt-1 text-blue-100 max-w-2xl">
                    Please provide your shipping details to complete your listing.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-blue-500 bg-opacity-30 rounded-full flex items-center justify-center">
                    <FiTruck className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
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
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <FiFileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={description || ''}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={500}
                      placeholder="Describe your items... Mention any special features, condition details, or other relevant information."
                      className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                      {description.length}/500
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <FiTruck className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
                </div>
                
                {shippingError && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{shippingError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={shippingInfo.firstName || ''}
                          onChange={(e) => handleNameChange('firstName', e.target.value)}
                          placeholder="John"
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={shippingInfo.lastName || ''}
                          onChange={(e) => handleNameChange('lastName', e.target.value)}
                          placeholder="Doe"
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="paypalAccount" className="block text-sm font-medium text-gray-700 mb-1">
                          PayPal Account Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="paypalAccount"
                            value={shippingInfo.paypalAccount || ''}
                            onChange={(e) => handlePaypalAccountChange(e.target.value)}
                            placeholder="your-paypal-email@example.com"
                            className="block w-full pl-10 px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          We'll send your payment to this PayPal account after your items are processed
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Shipping Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="street"
                          value={shippingInfo.address.street || ''}
                          onChange={(e) => handleAddressChange('street', e.target.value)}
                          placeholder="123 Main St"
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={shippingInfo.address.city || ''}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          placeholder="New York"
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          value={shippingInfo.address.state || ''}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          placeholder="NY"
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          id="zip"
                          value={shippingInfo.address.zip || ''}
                          onChange={(e) => handleAddressChange('zip', e.target.value)}
                          placeholder="10001"
                          className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <div className="relative">
                          <select
                            id="country"
                            value={shippingInfo.address.country || 'US'}
                            onChange={(e) => handleAddressChange('country', e.target.value)}
                            className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                          >
                            <option value="US">United States</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Package Dimensions</h4>
                    <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-lg shadow-sm">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Package must not exceed 18x16x16 inches and 50 pounds in weight.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                          Length (in)
                        </label>
                        <input
                          type="number"
                          id="length"
                          value={shippingInfo.packageDimensions.length || ''}
                          onChange={(e) => handlePackageDimensionsChange('length', parseFloat(e.target.value) || 0)}
                          min="0"
                          max="18"
                          step="0.1"
                          placeholder="0.0"
                          className={`block w-full px-4 py-3 text-base border ${dimensionErrors.length ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                        />
                        {dimensionErrors.length && (
                          <p className="text-xs text-red-600 mt-1">{dimensionErrors.length}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                          Width (in)
                        </label>
                        <input
                          type="number"
                          id="width"
                          value={shippingInfo.packageDimensions.width || ''}
                          onChange={(e) => handlePackageDimensionsChange('width', parseFloat(e.target.value) || 0)}
                          min="0"
                          max="16"
                          step="0.1"
                          placeholder="0.0"
                          className={`block w-full px-4 py-3 text-base border ${dimensionErrors.width ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                        />
                        {dimensionErrors.width && (
                          <p className="text-xs text-red-600 mt-1">{dimensionErrors.width}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                          Height (in)
                        </label>
                        <input
                          type="number"
                          id="height"
                          value={shippingInfo.packageDimensions.height || ''}
                          onChange={(e) => handlePackageDimensionsChange('height', parseFloat(e.target.value) || 0)}
                          min="0"
                          max="16"
                          step="0.1"
                          placeholder="0.0"
                          className={`block w-full px-4 py-3 text-base border ${dimensionErrors.height ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                        />
                        {dimensionErrors.height && (
                          <p className="text-xs text-red-600 mt-1">{dimensionErrors.height}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (lb)
                        </label>
                        <input
                          type="number"
                          id="weight"
                          value={shippingInfo.packageDimensions.weight || ''}
                          onChange={(e) => handlePackageDimensionsChange('weight', parseFloat(e.target.value) || 0)}
                          min="0"
                          max="50"
                          step="0.1"
                          placeholder="0.0"
                          className={`block w-full px-4 py-3 text-base border ${dimensionErrors.weight ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                        />
                        {dimensionErrors.weight && (
                          <p className="text-xs text-red-600 mt-1">{dimensionErrors.weight}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <FiPackage className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 flex justify-center py-4 px-6 border border-gray-300 shadow-lg text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <FiArrowLeft className="mr-2 h-5 w-5" />
                    Back to Items
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex justify-center py-4 px-6 border border-transparent shadow-lg text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Submit Listing
                        <FiArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}