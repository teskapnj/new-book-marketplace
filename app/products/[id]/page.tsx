"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

// SVG İkonlar
function ArrowLeftIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

function ShoppingCartIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

function HeartIcon({ size = 24, className = "", filled = false }: { size?: number; className?: string; filled?: boolean }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}

function ShareIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );
}

function PackageIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );
}

function ShieldCheckIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 12l2 2 4-4"></path>
      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
      <path d="M3 7h2c1 0 1 1 1 1v8c0 1-1 1-1 1H3"></path>
      <path d="M21 7h-2c-1 0-1 1-1 1v8c0 1 1 1 1 1h2"></path>
    </svg>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "listings", resolvedParams.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Calculate dominant category and condition
          const distinctCategories = new Set<string>();
          const conditionCounts: Record<string, number> = {};
          
          data.bundleItems.forEach((item: any) => {
            if (item.category) {
              distinctCategories.add(item.category);
            }
            if (item.condition) {
              conditionCounts[item.condition] = (conditionCounts[item.condition] || 0) + 1;
            }
          });
          
          const dominantCategory = distinctCategories.size > 1 ? "mix" : 
                                  (distinctCategories.values().next().value || "mix");
          
          const dominantCondition = Object.entries(conditionCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "good";
          
          // Collect all images from bundle items
          const bundleImages = data.bundleItems
            .filter((item: any) => item.image) // Only items with images
            .map((item: any) => item.image);
          
          const firstItemImage = data.bundleItems[0]?.image || null;
          const images = bundleImages.length > 0 ? bundleImages : (firstItemImage ? [firstItemImage] : []);
          
          const features = [
            `Items: ${data.totalItems || data.bundleItems.length}`,
            `Condition: ${dominantCondition === "like-new" ? "Like New" : "Good"}`,
            `Category: ${dominantCategory === "mix" ? "Mix Bundle" : dominantCategory}`,
            `Seller: ${data.vendorName || data.vendorId || "Anonymous Seller"}`
          ];
          
          setProduct({
            id: docSnap.id,
            title: data.title || "Untitled Bundle",
            price: data.totalValue || 0,
            condition: dominantCondition === "like-new" ? "Like New" : "Good",
            seller: data.vendorName || data.vendorId || "Anonymous Seller",
            sellerRating: 4.5,
            images: images,
            description: data.description || `Bundle of ${data.totalItems || data.bundleItems.length} items including various ${dominantCategory === "mix" ? "categories" : dominantCategory + "s"} in ${dominantCondition === "like-new" ? "Like New" : "Good"} condition.`,
            features: features,
            category: dominantCategory,
            bundleItems: data.bundleItems,
            totalItems: data.totalItems || data.bundleItems.length
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (resolvedParams.id) {
      fetchProduct();
    }
  }, [resolvedParams.id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <PackageIcon size={24} className="absolute inset-0 m-auto text-blue-600" />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your bundle...</p>
        </div>
      </div>
    );
  }
  
  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageIcon size={32} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bundle Not Found</h1>
          <p className="text-gray-600 mb-8">The bundle you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.back()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeftIcon size={20} className="inline mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || "/placeholder.png",
    });
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] || "/placeholder.png"
      });
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title} on MarketPlace!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  const getCategoryIcon = (category: string) => {
    const icons = {
      book: "📚",
      cd: "💿",
      dvd: "📀", 
      game: "🎮",
      mix: "📦"
    };
    return icons[category as keyof typeof icons] || "📦";
  };
  
  const getConditionColor = (condition: string) => {
    return condition === 'like-new' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-amber-50 text-amber-700 border-amber-200';
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl z-50 transform transition-all duration-300">
          <div className="flex items-center">
            <ShieldCheckIcon size={20} className="mr-3" />
            <span className="font-medium">Added to cart successfully!</span>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors group"
          >
            <ArrowLeftIcon size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to marketplace
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image with Navigation */}
            <div className="relative h-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              {product.images.length > 0 && !imageError ? (
                <Image 
                  src={product.images[selectedImageIndex]} 
                  alt="Product image"
                  fill
                  className="object-contain p-8"
                  onError={handleImageError}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-center">
                    <span className="text-8xl mb-4 block">{getCategoryIcon(product.category)}</span>
                    <p className="text-gray-500 font-medium">Bundle Preview</p>
                  </div>
                </div>
              )}
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {product.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${selectedImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              
              {/* Bundle Badge */}
              <div className="absolute top-6 left-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  <PackageIcon size={16} className="inline mr-2" />
                  {product.totalItems} Items Bundle
                </div>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12vw, 8vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-8">
            {/* Title and Rating */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center bg-yellow-50 rounded-full px-3 py-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">{product.sellerRating}</span>
                </div>
                <span className="ml-3 text-sm text-gray-500">(128 reviews)</span>
              </div>
              
              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">${(product.price * 1.3).toFixed(2)}</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  Save 23%
                </span>
              </div>
              
              {/* Product Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 font-medium">Condition</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getConditionColor(product.condition.toLowerCase().replace(' ', '-'))}`}>
                      {product.condition}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-700 font-medium">Category</span>
                    <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm font-bold border border-purple-200 capitalize">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seller Info */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{product.seller.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{product.seller}</p>
                  <p className="text-sm text-gray-500">Trusted Seller • 500+ sales</p>
                </div>
              </div>
            </div>
            
            {/* Quantity and Actions */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
              <div className="flex items-center space-x-6">
                <span className="font-bold text-gray-900">Quantity:</span>
                <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-l-2xl transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-bold text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-r-2xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingCartIcon size={20} className="mr-3" />
                  Add to Cart
                </button>
                <button 
                  onClick={handleWishlist}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
                    isInWishlist(product.id) 
                      ? 'text-red-500 border-red-500 bg-red-50' 
                      : 'text-gray-400 border-gray-200 hover:border-red-300 hover:text-red-400'
                  }`}
                >
                  <HeartIcon size={20} filled={isInWishlist(product.id)} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:text-blue-500 transition-all duration-200 hover:scale-105"
                >
                  <ShareIcon size={20} />
                </button>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
        
        {/* Bundle Items Detailed Table */}
        {product.bundleItems && product.bundleItems.length > 0 && (
          <div className="mt-16">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Complete Bundle Details</h3>
                <p className="text-blue-100">Detailed breakdown of all {product.bundleItems.length} items in this bundle</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">Condition</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">ISBN</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {product.bundleItems.map((item: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
                              {item.image ? (
                                <Image 
                                  src={item.image} 
                                  alt={`Item ${index + 1}`}
                                  width={48}
                                  height={48}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <span className="text-xl">{getCategoryIcon(item.category)}</span>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">Item #{index + 1}</div>
                              <div className="text-xs text-gray-500">Bundle item</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getConditionColor(item.condition)}`}>
                            {item.condition === 'like-new' ? 'Like New' : 'Good'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {item.isbn ? (
                              <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-xs border border-gray-200">
                                {item.isbn}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic text-xs">Not applicable</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200">
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-right text-lg font-bold text-gray-900">
                        Total Bundle Value:
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Trust and Security Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon size={24} className="text-green-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Secure Payment</h4>
            <p className="text-gray-600 text-sm">Your payment information is encrypted and secure</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageIcon size={24} className="text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Fast Shipping</h4>
            <p className="text-gray-600 text-sm">Free shipping on orders over $50</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartIcon size={24} className="text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Quality Guaranteed</h4>
            <p className="text-gray-600 text-sm">30-day return policy for your peace of mind</p>
          </div>
        </div>
      </div>
    </div>
  );
}