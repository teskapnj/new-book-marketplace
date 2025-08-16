"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// SVG Icons
function SearchIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );
}

function CartIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

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

function SparklesIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
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
      <path d="M9 12l2 2 4-4"></path>
      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
      <path d="M3 7h2c1 0 1 1 1 1v8c0 1-1 1-1 1H3"></path>
      <path d="M21 7h-2c-1 0-1 1-1 1v8c0 1 1 1 1 1h2"></path>
    </svg>
  );
}

export default function HomePage() {
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);

  // Fetch listings from Firebase
  useEffect(() => {
    setProductsLoading(true);

    const fetchListings = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const listingsData: any[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (!data.bundleItems || !Array.isArray(data.bundleItems)) {
              console.warn(`Listing ${doc.id} has invalid bundleItems:`, data.bundleItems);
              return;
            }

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

            const firstItemImage = data.bundleItems[0]?.image || null;

            listingsData.push({
              id: doc.id,
              title: data.title || "Untitled Bundle",
              price: data.totalValue || 0,
              category: dominantCategory,
              condition: dominantCondition,
              imageUrl: firstItemImage,
              sellerName: data.vendorName || data.vendorId || "Anonymous Seller",
              createdAt: data.createdAt?.toDate() || new Date(),
              bundleItems: data.bundleItems,
              description: `Bundle of ${data.totalItems || data.bundleItems.length} items including various ${dominantCategory === "mix" ? "categories" : dominantCategory + "s"} in ${dominantCondition === "like-new" ? "Like New" : "Good"} condition.`,
              totalItems: data.totalItems || data.bundleItems.length,
              vendorId: data.vendorId,
              distinctCategories: Array.from(distinctCategories)
            });
          });

          setFeaturedProducts(listingsData.slice(0, 8));
          setProductsLoading(false);
          setIndexError(null);
          setFallbackMode(false);
        }, (error) => {
          console.error("Firestore error:", error);

          if (error.code === 'failed-precondition' && error.message.includes('index')) {
            const match = error.message.match(/https:\/\/console\.firebase\.google\.com\/[^\s]*/);
            const indexLink = match ? match[0] : null;

            setIndexError(indexLink || "Index required but no link provided");
            setFallbackMode(true);
            fetchWithoutIndex();
          } else {
            setProductsLoading(false);
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Query setup error:", error);
        setProductsLoading(false);
      }
    };

    const fetchWithoutIndex = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(q);
        const listingsData: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (!data.bundleItems || !Array.isArray(data.bundleItems)) {
            console.warn(`Listing ${doc.id} has invalid bundleItems:`, data.bundleItems);
            return;
          }

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

          const firstItemImage = data.bundleItems[0]?.image || null;

          listingsData.push({
            id: doc.id,
            title: data.title || "Untitled Bundle",
            price: data.totalValue || 0,
            category: dominantCategory,
            condition: dominantCondition,
            imageUrl: firstItemImage,
            sellerName: data.vendorName || data.vendorId || "Anonymous Seller",
            createdAt: data.createdAt?.toDate() || new Date(),
            bundleItems: data.bundleItems,
            description: `Bundle of ${data.totalItems || data.bundleItems.length} items including various ${dominantCategory === "mix" ? "categories" : dominantCategory + "s"} in ${dominantCondition === "like-new" ? "Like New" : "Good"} condition.`,
            totalItems: data.totalItems || data.bundleItems.length,
            vendorId: data.vendorId,
            distinctCategories: Array.from(distinctCategories)
          });
        });

        listingsData.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setFeaturedProducts(listingsData.slice(0, 8));
        setProductsLoading(false);
      } catch (error) {
        console.error("Fallback fetch error:", error);
        setProductsLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Fixed category links to work with listings page filter
  const categories = [
    { name: "Books", icon: "📚", category: "book" },
    { name: "CDs", icon: "💿", category: "cd" },
    { name: "DVDs/Blu-rays", icon: "📀", category: "dvd" },
    { name: "Games", icon: "🎮", category: "game" },
    { name: "Mix Bundles", icon: "🎁", category: "mix" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCategoryClick = (category: string) => {
    console.log(`Navigating to category: ${category}`);
    router.push(`/listings?category=${category}`);
  };

  // Custom ProductCard component for homepage
  const HomeProductCard = ({ product }: { product: any }) => {
    const [imageError, setImageError] = useState(false);
    
    const getCategoryIcon = (category: string) => {
      const icons = { book: "📚", cd: "💿", dvd: "📀", game: "🎮", mix: "📦" };
      return icons[category as keyof typeof icons] || "📦";
    };

    const getConditionColor = (condition: string) => {
      return condition === 'like-new' 
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        : 'bg-amber-50 text-amber-700 border border-amber-200';
    };

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <Link href={`/products/${product.id}`}>
        <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
          <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
            {product.imageUrl && !imageError ? (
              <Image 
                src={product.imageUrl} 
                alt="Product image"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl">{getCategoryIcon(product.category)}</span>
              </div>
            )}
            
            {/* Clean image without badges on top-left */}
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getConditionColor(product.condition)}`}>
                {product.condition === "like-new" ? "Like New" : "Good"}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title.length > 50 ? product.title.substring(0, 50) + "..." : product.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3">
              by <span className="font-medium">{product.sellerName}</span>
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <span className="text-xs text-gray-500 capitalize">{product.category}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Index Error Message */}
      {indexError && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-yellow-800">Database Index Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {fallbackMode
                    ? "Currently running in fallback mode. Performance may be limited."
                    : "Building database index for better performance..."}
                </p>
                {typeof indexError === 'string' && indexError.startsWith('http') && (
                  <a
                    href={indexError}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 px-3 py-1 text-xs font-medium bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
                  >
                    Create Index Now
                    <ArrowRightIcon size={14} className="ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
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
              MarketPlace
            </Link>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <SearchIcon size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <CartIcon size={20} />
              </button>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MarketPlace
              </Link>
            </div>
            
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bundles, authors, ISBN..."
                  className="w-full py-3 px-4 pr-12 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : error ? (
                <span className="text-red-500 font-medium">Auth Error</span>
              ) : user ? (
                <>
                  <Link href="/dashboard" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                    Start Selling
                  </Link>
                  <Link href="/login" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    Login
                  </Link>
                </>
              )}
              
              <div className="flex items-center space-x-3 ml-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                  <UserIcon size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                  <CartIcon size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-6 py-4 space-y-4">
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              ) : error ? (
                <span className="text-red-500 font-medium">Auth Error</span>
              ) : user ? (
                <>
                  <Link href="/dashboard" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
                    Start Selling
                  </Link>
                  <Link href="/login" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-6xl animate-bounce opacity-20">📚</div>
        <div className="absolute top-32 right-16 text-5xl animate-pulse opacity-20">💿</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-bounce opacity-20">🎮</div>
        <div className="absolute bottom-32 right-1/3 text-5xl animate-pulse opacity-20">📀</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Buy & Sell Used Media
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                in Bulk
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
              Discover amazing deals on gently used books, CDs, DVDs, games, and curated mix bundles. 
              Start earning from your collection today!
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              {loading ? (
                <div className="h-14 w-40 bg-white/20 rounded-2xl animate-pulse"></div>
              ) : user ? (
                <Link href="/create-listing" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  <PackageIcon size={24} className="mr-3 group-hover:rotate-12 transition-transform" />
                  Start Selling
                </Link>
              ) : (
                <Link href="/register" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                  <SparklesIcon size={24} className="mr-3 group-hover:rotate-12 transition-transform" />
                  Start Selling
                </Link>
              )}
              
              <Link href="/listings" className="group inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                Browse Marketplace
                <ArrowRightIcon size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1000+</div>
                <div className="text-blue-200 text-sm sm:text-base">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-200 text-sm sm:text-base">Happy Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">95%</div>
                <div className="text-blue-200 text-sm sm:text-base">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for in our curated categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.category)}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer"
              >
                <div className="relative">
                  <div className="text-5xl sm:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-2">Explore collection</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                ⭐ Featured Bundles
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked deals you won't want to miss
              </p>
            </div>
            <Link 
              href="/listings" 
              className="group inline-flex items-center mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All
              <ArrowRightIcon size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <PackageIcon size={24} className="absolute inset-0 m-auto text-blue-600" />
              </div>
              <p className="mt-6 text-gray-600 font-medium">Loading amazing bundles...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <HomeProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="text-6xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No listings yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Be the first to create amazing bundles and start earning money from your collection!
              </p>
              {loading ? (
                <div className="h-12 w-48 bg-gray-200 rounded-2xl animate-pulse mx-auto"></div>
              ) : user ? (
                <Link href="/create-listing" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <PackageIcon size={24} className="mr-3" />
                  Create Your First Bundle
                </Link>
              ) : (
                <Link href="/register" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <SparklesIcon size={24} className="mr-3" />
                  Create Your Account
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">List Your Items</h3>
              <p className="text-gray-600 leading-relaxed">
                Scan ISBN codes or manually add your used books, CDs, DVDs, and games. 
                Create custom bundles for better deals.
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <TrendingUpIcon size={16} className="text-yellow-600 m-auto mt-1" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Paid</h3>
              <p className="text-gray-600 leading-relaxed">
                When your bundle sells, we handle secure payment processing and 
                transfer funds directly to your account.
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ShieldCheckIcon size={16} className="text-yellow-600 m-auto mt-1" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ship & Track</h3>
              <p className="text-gray-600 leading-relaxed">
                Ship your bundle with tracking included. Funds are securely released 
                after delivery confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-30">💰</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse opacity-30">🚀</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of sellers who've already earned money from their used media collections. 
            Turn your clutter into cash today!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {loading ? (
              <div className="h-14 w-40 bg-white/20 rounded-2xl animate-pulse mx-auto"></div>
            ) : user ? (
              <Link href="/create-listing" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <PackageIcon size={24} className="mr-3 group-hover:rotate-12 transition-transform" />
                Create Bundle Now
              </Link>
            ) : (
              <Link href="/register" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <SparklesIcon size={24} className="mr-3 group-hover:rotate-12 transition-transform" />
                Create Your Account
              </Link>
            )}
          </div>
          
          <div className="mt-12 flex justify-center space-x-8 text-blue-200">
            <div className="flex items-center">
              <ShieldCheckIcon size={20} className="mr-2" />
              <span className="text-sm sm:text-base">Secure Payments</span>
            </div>
            <div className="flex items-center">
              <PackageIcon size={20} className="mr-2" />
              <span className="text-sm sm:text-base">Free Listings</span>
            </div>
            <div className="flex items-center">
              <TrendingUpIcon size={20} className="mr-2" />
              <span className="text-sm sm:text-base">Fast Sales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 block">
                MarketPlace
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6">
                The premier marketplace for buying and selling used books, CDs, DVDs, games, and curated bundles. 
                Turn your collection into cash with confidence.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">i</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">For Buyers</h4>
              <ul className="space-y-3">
                <li><Link href="/listings" className="text-gray-400 hover:text-white transition-colors">Browse Bundles</Link></li>
                <li><Link href="/how-to-buy" className="text-gray-400 hover:text-white transition-colors">How to Buy</Link></li>
                <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">For Sellers</h4>
              <ul className="space-y-3">
                {user ? (
                  <li><Link href="/create-listing" className="text-gray-400 hover:text-white transition-colors">Create Bundle</Link></li>
                ) : (
                  <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Start Selling</Link></li>
                )}
                <li><Link href="/fees" className="text-gray-400 hover:text-white transition-colors">Seller Fees</Link></li>
                <li><Link href="/seller-protection" className="text-gray-400 hover:text-white transition-colors">Seller Protection</Link></li>
                <li><Link href="/seller-guide" className="text-gray-400 hover:text-white transition-colors">Seller Guide</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2023 MarketPlace. All rights reserved.
              </p>
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