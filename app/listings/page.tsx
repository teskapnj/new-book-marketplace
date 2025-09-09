"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, orderBy, getDocs, DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import DOMPurify from 'isomorphic-dompurify'; // Bu satırı ekleyin

// SVG Icons
interface IconProps {
  size?: number;
  className?: string;
}
const FilterIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);
const GridIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);
const ListIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);
const ArrowLeftIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const SearchIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);
const PackageIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const XIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m18 6-12 12"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);
const ChevronDownIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6"></path>
  </svg>
);
// Shopping Cart Icon
const ShoppingCartIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);
// TypeScript Interfaces
interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  image?: string;
  condition: string;
  seller?: string;
  sellerName?: string;
  category?: string;
  totalItems?: number;
  vendorId?: string;
  isbn?: string;
  quantity?: number;
  amazonData?: {
    title?: string;
    asin?: string;
    price?: number;
    sales_rank?: number;
    category?: string;
    image?: string;
  };
  ourPrice?: number;
  originalPrice?: number;
  createdAt?: Date;
  bundleItems?: any[];
  description?: string;
  distinctCategories?: string[];
  status?: string;
  updatedAt?: Date | null;
  location?: string | null;
  tags?: string[];
  highlights?: string[];
}
interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}
interface FilterContentProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  router: ReturnType<typeof useRouter>;
}
export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cartItems } = useCart();
  
  const rawCategory = searchParams.get('category');
  const categoryFromUrl = rawCategory && ['all', 'book', 'cd', 'dvd', 'game', 'mix'].includes(rawCategory)
    ? DOMPurify.sanitize(rawCategory)
    : 'all';

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);

  // Calculate total items in cart
  const totalCartItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  // Kullanıcı yetkilendirme kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      if (!authLoading) {
        if (!user) {
          // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
          router.push("/login");
          return;
        }
        // Kullanıcının rolünü kontrol et
        const role = localStorage.getItem("userRole");

        if (role) {
          setUserRole(role);

          // Firestore'dan rolü doğrula
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const firestoreRole = userData.role || "seller";

              // localStorage'i güncelle (eğer rol değiştiyse)
              if (firestoreRole !== role) {
                localStorage.setItem("userRole", firestoreRole);
                setUserRole(firestoreRole);
              }

              // Kullanıcının uygun role sahip olup olmadığını kontrol et
              if (firestoreRole !== "buyer" && firestoreRole !== "admin") {
                // Kullanıcı uygun role sahip değil, doğru sayfaya yönlendir
                if (firestoreRole === "seller") {
                  router.push("/create-listing");
                } else {
                  router.push("/");
                }
                return;
              }
            } else {
              // Kullanıcı dokümanı bulunamadı, login sayfasına yönlendir
              router.push("/login");
              return;
            }
          } catch (error) {
            console.error("Error verifying user role:", error);
            router.push("/login");
            return;
          }
        } else {
          // localStorage'da rol yok, Firestore'dan almayı dene
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const firestoreRole = userData.role || "seller";

              localStorage.setItem("userRole", firestoreRole);
              setUserRole(firestoreRole);

              // Kullanıcının uygun role sahip olup olmadığını kontrol et
              if (firestoreRole !== "buyer" && firestoreRole !== "admin") {
                // Kullanıcı uygun role sahip değil, doğru sayfaya yönlendir
                if (firestoreRole === "seller") {
                  router.push("/create-listing");
                } else {
                  router.push("/");
                }
                return;
              }
            } else {
              // Kullanıcı dokümanı bulunamadı, login sayfasına yönlendir
              router.push("/login");
              return;
            }
          } catch (error) {
            console.error("Error verifying user role:", error);
            router.push("/login");
            return;
          }
        }
      }
    };
    checkAuth();
  }, [user, authLoading, router]);
  // URL'den kategoriyi güncelleme
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams, selectedCategory]);

  // Firebase'den veri çekme - sadece doğru roldeki kullanıcılar için
  useEffect(() => {
    // Kullanıcı doğrulandıktan ve doğru role sahipse verileri çek
    if (userRole === "buyer" || userRole === "admin") {
      setLoading(true);

      const fetchListings = async () => {
        try {
          const q = query(
            collection(db, "listings"),
            where("status", "==", "approved"),
            orderBy("createdAt", "desc")
          );

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const listingsData: Product[] = [];

            querySnapshot.forEach((doc) => {
              const data = doc.data() as DocumentData;

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

              // İlk ürün fotoğrafını bulma
              let firstItemImage: string | undefined;
              for (const item of data.bundleItems) {
                if (item.image) {
                  firstItemImage = item.image;
                  break;
                }
                if (item.imageUrl) {
                  firstItemImage = item.imageUrl;
                  break;
                }
                if (item.amazonData?.image) {
                  firstItemImage = item.amazonData.image;
                  break;
                }
              }

              
              listingsData.push({
                id: doc.id,
                title: DOMPurify.sanitize(data.title || "Untitled Bundle").substring(0, 200),
                price: Math.max(0, data.totalValue || 0),
                category: dominantCategory,
                condition: dominantCondition,
                imageUrl: firstItemImage,
                image: firstItemImage,
                sellerName: DOMPurify.sanitize(data.vendorName || data.vendorId || "Anonymous Seller").substring(0, 100),
                seller: DOMPurify.sanitize(data.vendorName || data.vendorId || "Anonymous Seller").substring(0, 100),
                createdAt: data.createdAt?.toDate() || new Date(),
                bundleItems: data.bundleItems,
                description: DOMPurify.sanitize(`Bundle of ${data.totalItems || data.bundleItems.length} items including various ${dominantCategory === "mix" ? "categories" : dominantCategory + "s"} in ${dominantCondition === "like-new" ? "Like New" : "Good"} condition.`).substring(0, 500),
                totalItems: Math.max(0, data.totalItems || data.bundleItems.length),
                vendorId: DOMPurify.sanitize(data.vendorId || '').substring(0, 50),
                distinctCategories: Array.from(distinctCategories),
                status: data.status,
                updatedAt: data.updatedAt?.toDate() || null,
                location: data.location ? DOMPurify.sanitize(data.location).substring(0, 200) : null,
                tags: data.tags ? data.tags.map((tag: string) => DOMPurify.sanitize(tag).substring(0, 50)) : [],
                highlights: data.highlights ? data.highlights.map((highlight: string) => DOMPurify.sanitize(highlight).substring(0, 200)) : []
              });
            });

            setProducts(listingsData);
            setLoading(false);
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
              setLoading(false);
            }
          });

          return unsubscribe;
        } catch (error) {
          console.error("Query setup error:", error);
          setLoading(false);
        }
      };

      const fetchWithoutIndex = async () => {
        try {
          const q = query(
            collection(db, "listings"),
            where("status", "==", "approved")
          );

          const querySnapshot = await getDocs(q);
          const listingsData: Product[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;

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

            let firstItemImage: string | undefined;
            for (const item of data.bundleItems) {
              if (item.image) {
                firstItemImage = item.image;
                break;
              }
              if (item.imageUrl) {
                firstItemImage = item.imageUrl;
                break;
              }
              if (item.amazonData?.image) {
                firstItemImage = item.amazonData.image;
                break;
              }
            }

            listingsData.push({
              id: doc.id,
              title: data.title || "Untitled Bundle",
              price: data.totalValue || 0,
              category: dominantCategory,
              condition: dominantCondition,
              imageUrl: firstItemImage,
              image: firstItemImage,
              sellerName: data.vendorName || data.vendorId || "Anonymous Seller",
              seller: data.vendorName || data.vendorId || "Anonymous Seller",
              createdAt: data.createdAt?.toDate() || new Date(),
              bundleItems: data.bundleItems,
              description: `Bundle of ${data.totalItems || data.bundleItems.length} items including various ${dominantCategory === "mix" ? "categories" : dominantCategory + "s"} in ${dominantCondition === "like-new" ? "Like New" : "Good"} condition.`,
              totalItems: data.totalItems || data.bundleItems.length,
              vendorId: data.vendorId,
              distinctCategories: Array.from(distinctCategories),
              status: data.status,
              updatedAt: data.updatedAt?.toDate() || null,
              location: data.location || null,
              tags: data.tags || [],
              highlights: data.highlights || []
            });
          });

          listingsData.sort((a, b) => {
            return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
          });

          setProducts(listingsData);
          setLoading(false);
        } catch (error) {
          console.error("Fallback fetch error:", error);
          setLoading(false);
        }
      };

      fetchListings();
    }
  }, [userRole]); // userRole değiştiğinde verileri yeniden çek

  // Yüklenme durumu veya yetkilendirme kontrolü yapılıyorsa
  if (authLoading || (user && !userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Erişim reddedildi mesajı
  if (user && userRole && userRole !== "buyer" && userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view this page. Only buyers and administrators can access the listings page.
          </p>
          <button
            onClick={() => {
              if (userRole === "seller") {
                router.push("/create-listing");
              } else {
                router.push("/");
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to {userRole === "seller" ? "Create Listing" : "Home"}
          </button>
        </div>
      </div>
    );
  }

  // Filtreleme ve sıralama
  const filteredProducts = products
    .filter(product => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (product.price! < priceRange[0] || product.price! > priceRange[1]) return false;
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price! - b.price!;
        case "price-high": return b.price! - a.price!;
        case "newest": return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        case "oldest": return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
        default: return 0;
      }
    });

  const categories: Category[] = [
    { id: "all", name: "All Categories", count: products.length, icon: "🏪" },
    { id: "mix", name: "Mix Bundles", count: products.filter(p => p.category === "mix").length, icon: "🎁" },
    { id: "book", name: "Books", count: products.filter(p => p.category === "book").length, icon: "📚" },
    { id: "cd", name: "CDs", count: products.filter(p => p.category === "cd").length, icon: "💿" },
    { id: "dvd", name: "DVDs/Blu-rays", count: products.filter(p => p.category === "dvd").length, icon: "📀" },
    { id: "game", name: "Games", count: products.filter(p => p.category === "game").length, icon: "🎮" },
  ];

  // Yardımcı fonksiyonlar
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      book: "📚",
      cd: "💿",
      dvd: "📀",
      game: "🎮",
      mix: "📦"
    };
    return icons[category] || "📦";
  };

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      book: "Book",
      cd: "CD",
      dvd: "DVD",
      game: "Game",
      mix: "Mix Bundle"
    };
    return names[category] || category;
  };

  const getCategoryDisplayName = (category: string): string => {
    const names: Record<string, string> = {
      all: "All Categories",
      book: "Books",
      cd: "CDs",
      dvd: "DVDs/Blu-rays",
      game: "Games",
      mix: "Mix Bundles"
    };
    return names[category] || "Browse Items";
  };

  const getConditionColor = (condition: string): string => {
    return condition === 'like-new'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : 'bg-amber-50 text-amber-700 border border-amber-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors group">
                <ArrowLeftIcon size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {getCategoryDisplayName(selectedCategory)}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              {/* Shopping Cart Icon */}
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                <ShoppingCartIcon size={20} />
                {totalCartItems > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalCartItems > 99 ? '99+' : totalCartItems}
                  </span>
                )}
              </Link>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex border border-gray-200 rounded-xl p-1 bg-gray-50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
                >
                  <GridIcon size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
                >
                  <ListIcon size={18} />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
              >
                <FilterIcon size={20} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-4">
            <div className="relative max-w-md">
              <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              
              <input
                type="text"
                placeholder="Search bundles..."
                value={searchTerm}
                onChange={(e) => {
                  const sanitizedQuery = DOMPurify.sanitize(e.target.value).substring(0, 100); // Search query limit
                  setSearchTerm(sanitizedQuery);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Index Error Message */}
        {indexError && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Database Index Required</h3>
                <p className="text-yellow-700 mb-4">
                  {fallbackMode
                    ? "Currently running in fallback mode. Some features may be limited."
                    : "We're building a database index to improve performance. This may take a few minutes."}
                </p>
                {typeof indexError === 'string' && indexError.startsWith('http') && (
                  <a
                    href={indexError}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm font-medium rounded-xl transition-colors"
                  >
                    Create Index Now
                    <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 text-gray-400 hover:text-gray-600">
                      <XIcon size={20} />
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto h-full pb-20">
                  <MobileFilterContent
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    router={router}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar Filters */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-28">
              <DesktopFilterContent
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
                router={router}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <p className="text-gray-700 font-medium">
                  <span className="text-2xl font-bold text-gray-900">{filteredProducts.length}</span>
                  <span className="text-gray-600 ml-2">of {products.length} bundles</span>
                </p>
                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getCategoryIcon(selectedCategory)} {getCategoryName(selectedCategory)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                  <PackageIcon size={24} className="absolute inset-0 m-auto text-blue-600" />
                </div>
                <p className="mt-6 text-gray-600 font-medium">Loading amazing bundles...</p>
              </div>
            ) : (
              <>
                {/* Products */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map(product => (
                      <ProductListItem key={product.id} product={product} onSelect={setSelectedProduct} />
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-6xl">📦</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No bundles found</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {products.length === 0
                        ? "There are no listings yet. Be the first to create one!"
                        : "No bundles match your current filters. Try adjusting your search criteria."}
                    </p>
                    {products.length === 0 ? (
                      <Link href="/create-listing" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                        <PackageIcon size={20} className="mr-2" />
                        Create First Bundle
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setPriceRange([0, 1000]);
                          setSearchTerm("");
                        }}
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-2xl hover:bg-gray-200 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
// Filter Components
function DesktopFilterContent({ categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, sortBy, setSortBy, router }: FilterContentProps) {
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (categoryId !== 'all') {
      params.set('category', categoryId);
    }
    router.push(`/listings${params.toString() ? '?' + params.toString() : ''}`);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={() => {
            setSelectedCategory("all");
            setPriceRange([0, 1000]);
          }}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category.id} className="group flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </span>
              </div>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
              className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </>
  );
}
function MobileFilterContent({ categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, sortBy, setSortBy, router }: FilterContentProps) {
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (categoryId !== 'all') {
      params.set('category', categoryId);
    }
    router.push(`/listings${params.toString() ? '?' + params.toString() : ''}`);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Reset Filters</h3>
        <button
          onClick={() => {
            setSelectedCategory("all");
            setPriceRange([0, 1000]);
          }}
          className="text-blue-600 text-sm font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
        <div className="grid grid-cols-1 gap-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700">
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </span>
              </div>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="p-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
              className="p-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </>
  );
}
// ProductListItem
interface ProductListItemProps {
  product: Product;
  onSelect: (product: Product) => void;
}
function ProductListItem({ product, onSelect }: ProductListItemProps) {
  const [imageError, setImageError] = useState<boolean>(false);

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = { book: "📚", cd: "💿", dvd: "📀", game: "🎮", mix: "📦" };
    return icons[category] || "📦";
  };

  const getConditionColor = (condition: string): string => {
    return condition === 'like-new'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : 'bg-amber-50 text-amber-700 border border-amber-200';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const productImage = product.imageUrl || product.image;
  const isAmazonImage = productImage && (
    productImage.includes('amazon.com') ||
    productImage.includes('ssl-images-amazon.com') ||
    productImage.includes('m.media-amazon.com') ||
    productImage.includes('images-na.ssl-images-amazon.com')
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-6">
        <div className="relative h-24 w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
          {productImage && !imageError ? (
            <>
              {isAmazonImage ? (
                <img
                  src={productImage}
                  alt="Product image"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <Image
                  src={productImage}
                  alt="Product image"
                  fill
                  className="object-cover"
                  onError={handleImageError}
                  sizes="96px"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl">{getCategoryIcon(product.category || 'mix')}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
        
          <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">{DOMPurify.sanitize(product.title)}</h3>
          <p className="text-gray-600 text-sm mb-2">by {DOMPurify.sanitize(product.sellerName || product.seller)}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{getCategoryIcon(product.category || 'mix')} {product.category === "mix" ? `${product.distinctCategories?.length || 0} categories` : product.category}</span>
            <span>•</span>
            <span>{product.totalItems || 0} items</span>
            <span>•</span>
            <span>{product.createdAt?.toLocaleDateString()}</span>
            {isAmazonImage && (
              <>
                <span>•</span>
                <span className="text-orange-600 font-medium">📦 Amazon</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${product.price?.toFixed(2)}</div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getConditionColor(product.condition)}`}>
              {product.condition === "like-new" ? "Like New" : "Good"}
            </span>
          </div>

          <button
            onClick={() => onSelect(product)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
// ProductModal
interface ProductModalProps {
  product: Product;
  onClose: () => void;
}
function ProductModal({ product, onClose }: ProductModalProps) {
  const [imageError, setImageError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = { book: "📚", cd: "💿", dvd: "📀", game: "🎮", mix: "📦" };
    return icons[category] || "📦";
  };

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = { book: "Book", cd: "CD", dvd: "DVD", game: "Game", mix: "Mix Bundle" };
    return names[category] || category;
  };

  const getConditionColor = (condition: string): string => {
    return condition === 'like-new'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : 'bg-amber-50 text-amber-700 border border-amber-200';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const productImage = product.imageUrl || product.image;
  const isAmazonImage = productImage && (
    productImage.includes('amazon.com') ||
    productImage.includes('ssl-images-amazon.com') ||
    productImage.includes('m.media-amazon.com') ||
    productImage.includes('images-na.ssl-images-amazon.com')
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{DOMPurify.sanitize(product.title)}</h3>
              <div className="flex flex-wrap items-center gap-3 text-blue-100">
                <span>Listed on {product.createdAt?.toLocaleDateString()}</span>
                <span>•</span>
                <span>{product.totalItems || 0} items</span>
                <span>•</span>
                <span className="inline-flex items-center">
                  {getCategoryIcon(product.category || 'mix')} {getCategoryName(product.category || 'mix')}
                </span>
                {isAmazonImage && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center text-orange-200">
                      📦 Amazon Images
                    </span>
                  </>
                )}
                {product.updatedAt && (
                  <>
                    <span>•</span>
                    <span>Updated on {product.updatedAt.toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XIcon size={24} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 font-medium text-sm ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("contents")}
            className={`px-6 py-3 font-medium text-sm ${activeTab === "contents" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Bundle Contents ({product.bundleItems?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("seller")}
            className={`px-6 py-3 font-medium text-sm ${activeTab === "seller" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Seller Info
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Image */}
                <div className="lg:col-span-1">
                  <div className="relative h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4">
                    {productImage && !imageError ? (
                      <>
                        {isAmazonImage ? (
                          <img
                            src={productImage}
                            alt="Product image"
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        ) : (
                          <Image
                            src={productImage}
                            alt="Product image"
                            fill
                            className="object-cover"
                            onError={handleImageError}
                          />
                        )}

                        {isAmazonImage && (
                          <div className="absolute bottom-2 left-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                              📦 Amazon
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-8xl">{getCategoryIcon(product.category || 'mix')}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
                      <div className="text-xl font-bold text-blue-600">${product.price?.toFixed(2)}</div>
                      <div className="text-xs text-blue-700">Total Value</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
                      <div className="text-xl font-bold text-purple-600">{product.totalItems || 0}</div>
                      <div className="text-xs text-purple-700">Items</div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Categories */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Categories</h4>
                    {product.category === "mix" ? (
                      <div className="flex flex-wrap gap-2">
                        {product.distinctCategories?.map((cat, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {getCategoryIcon(cat)} {getCategoryName(cat)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {getCategoryIcon(product.category || 'mix')} {getCategoryName(product.category || 'mix')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700 text-sm">
                      {DOMPurify.sanitize(product.description || "No description available for this bundle.")}
                    </p>
                  </div>

                  {/* Condition and Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Condition</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getConditionColor(product.condition)}`}>
                        {product.condition === "like-new" ? "Like New" : "Good"}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <p className="font-bold text-gray-900 capitalize">{product.status || "Approved"}</p>
                    </div>
                  </div>

                  {/* Image Source Info */}
                  {isAmazonImage && (
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-2">📦 Amazon Product</h4>
                      <p className="text-orange-800 text-sm">
                        This product features Amazon product images, indicating verified product information.
                      </p>
                    </div>
                  )}

                  {/* Location */}
                  {product.location && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                      <p className="text-gray-700 text-sm">{product.location}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  {product.highlights && product.highlights.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Highlights</h4>
                      <ul className="space-y-1">
                        {product.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700 text-sm">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "contents" && (
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bundle Contents ({product.bundleItems?.length || 0} items)</h3>

              {product.bundleItems && product.bundleItems.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="max-h-[60vh] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {product.bundleItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">Item #{index + 1}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{getCategoryName(item.category)}</div>
                              {item.isbn && (
                                <div className="text-sm text-gray-500 font-mono">ISBN: {item.isbn}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.condition === 'like-new' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {item.condition === "like-new" ? "Like New" : "Good"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${item.price?.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <PackageIcon size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
                  <p className="mt-1 text-sm text-gray-500">This bundle doesn't contain any items.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "seller" && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4">
                      <span className="text-3xl">👤</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{DOMPurify.sanitize(product.sellerName || product.seller)}</h3>

                    <div className="mt-2 text-sm text-gray-500">Bundle Seller</div>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="-ml-1 mr-1.5 h-2 w-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Verified Seller
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Contact Seller</h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                        Send Message
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Seller Information</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                        <dd className="mt-1 text-sm text-gray-900">January 2023</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Response Rate</dt>
                        <dd className="mt-1 text-sm text-gray-900">98%</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Response Time</dt>
                        <dd className="mt-1 text-sm text-gray-900">Within 1 hour</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Total Listings</dt>
                        <dd className="mt-1 text-sm text-gray-900">24</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Seller Ratings</h4>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <svg
                            key={rating}
                            className={`h-5 w-5 flex-shrink-0 ${rating < 4.5 ? 'text-yellow-400' : 'text-gray-300'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="ml-2 text-sm text-gray-900">4.5 out of 5</p>
                      <span className="mx-2 text-gray-400">•</span>
                      <p className="text-sm text-gray-500">128 reviews</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="w-24 text-gray-500">5 stars</span>
                        <div className="ml-2 flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="ml-2 text-gray-500 w-8">75%</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-24 text-gray-500">4 stars</span>
                        <div className="ml-2 flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="ml-2 text-gray-500 w-8">15%</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-24 text-gray-500">3 stars</span>
                        <div className="ml-2 flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '7%' }}></div>
                        </div>
                        <span className="ml-2 text-gray-500 w-8">7%</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-24 text-gray-500">2 stars</span>
                        <div className="ml-2 flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '2%' }}></div>
                        </div>
                        <span className="ml-2 text-gray-500 w-8">2%</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="w-24 text-gray-500">1 star</span>
                        <div className="ml-2 flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: '1%' }}></div>
                        </div>
                        <span className="ml-2 text-gray-500 w-8">1%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Recent Reviews</h4>
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <svg
                                key={rating}
                                className={`h-4 w-4 flex-shrink-0 ${rating < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="ml-2 text-sm text-gray-900">Great seller!</p>
                          <span className="mx-2 text-gray-400">•</span>
                          <p className="text-sm text-gray-500">2 days ago</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">The bundle was exactly as described. Fast shipping and great communication.</p>
                      </div>

                      <div>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <svg
                                key={rating}
                                className={`h-4 w-4 flex-shrink-0 ${rating < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="ml-2 text-sm text-gray-900">Good bundle</p>
                          <span className="mx-2 text-gray-400">•</span>
                          <p className="text-sm text-gray-500">1 week ago</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">Items were in good condition as described. Would buy from again.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-gray-900">${product.price?.toFixed(2)}</div>
              <div className="text-sm text-gray-600">{product.totalItems || 0} items total</div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <Link
                href={`/products/${product.id}`}
                className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-center"
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}