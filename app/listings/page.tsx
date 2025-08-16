// app/listings/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// SVG Icons
function FilterIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );
}

function GridIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}

function ListIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );
}

function ArrowLeftIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

function SearchIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
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

function XIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 6-12 12"></path>
      <path d="m6 6 12 12"></path>
    </svg>
  );
}

function ChevronDownIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6"></path>
    </svg>
  );
}

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get('category') || 'all';
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Update selected category when URL changes
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  // Fetch listings from Firebase
  useEffect(() => {
    setLoading(true);
    
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
        
        setProducts(listingsData);
        setLoading(false);
      } catch (error) {
        console.error("Fallback fetch error:", error);
        setLoading(false);
      }
    };
    
    fetchListings();
  }, []);

  // Filtreleme ve sıralama
  const filteredProducts = products
    .filter(product => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: return 0;
      }
    });

  const categories = [
    { id: "all", name: "All Categories", count: products.length, icon: "🏪" },
    { id: "mix", name: "Mix Bundles", count: products.filter(p => p.category === "mix").length, icon: "🎁" },
    { id: "book", name: "Books", count: products.filter(p => p.category === "book").length, icon: "📚" },
    { id: "cd", name: "CDs", count: products.filter(p => p.category === "cd").length, icon: "💿" },
    { id: "dvd", name: "DVDs/Blu-rays", count: products.filter(p => p.category === "dvd").length, icon: "📀" },
    { id: "game", name: "Games", count: products.filter(p => p.category === "game").length, icon: "🎮" },
  ];

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

  const getCategoryName = (category: string) => {
    const names = {
      book: "Book",
      cd: "CD", 
      dvd: "DVD",
      game: "Game",
      mix: "Mix Bundle"
    };
    return names[category as keyof typeof names] || category;
  };

  const getCategoryDisplayName = (category: string) => {
    const names = {
      all: "All Categories",
      book: "Books",
      cd: "CDs", 
      dvd: "DVDs/Blu-rays",
      game: "Games",
      mix: "Mix Bundles"
    };
    return names[category as keyof typeof names] || "Browse Items";
  };

  const getConditionColor = (condition: string) => {
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                      <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
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
function DesktopFilterContent({ categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, sortBy, setSortBy, router }: any) {
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Update URL when category changes
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
          {categories.map((category: any) => (
            <label key={category.id} className="group flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(category.id)}
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

function MobileFilterContent({ categories, selectedCategory, setSelectedCategory, priceRange, setPriceRange, sortBy, setSortBy, router }: any) {
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Update URL when category changes
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
          {categories.map((category: any) => (
            <label key={category.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(category.id)}
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
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="p-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Max"
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

// Product Components
function ProductCard({ product, onSelect }: any) {
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
    <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
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
            <span className="text-6xl">{getCategoryIcon(product.category)}</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
            <span className="text-sm font-medium text-gray-700">
              {getCategoryIcon(product.category)} {product.totalItems} items
            </span>
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getConditionColor(product.condition)}`}>
            {product.condition === "like-new" ? "Like New" : "Good"}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          by <span className="font-medium">{product.sellerName}</span>
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-500">
              {product.category === "mix" ? `${product.distinctCategories.length} categories` : product.category}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Listed</div>
            <div className="text-xs text-gray-400">
              {new Date(product.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => onSelect(product)}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          View Bundle Details
        </button>
      </div>
    </div>
  );
}

function ProductListItem({ product, onSelect }: any) {
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
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-6">
        <div className="relative h-24 w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
          {product.imageUrl && !imageError ? (
            <Image 
              src={product.imageUrl} 
              alt="Product image"
              fill
              className="object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl">{getCategoryIcon(product.category)}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-2">by {product.sellerName}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{getCategoryIcon(product.category)} {product.category === "mix" ? `${product.distinctCategories.length} categories` : product.category}</span>
            <span>•</span>
            <span>{product.totalItems} items</span>
            <span>•</span>
            <span>{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
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

// Product Modal
function ProductModal({ product, onClose }: any) {
  const [imageError, setImageError] = useState(false);
  
  const getCategoryIcon = (category: string) => {
    const icons = { book: "📚", cd: "💿", dvd: "📀", game: "🎮", mix: "📦" };
    return icons[category as keyof typeof icons] || "📦";
  };

  const getCategoryName = (category: string) => {
    const names = { book: "Book", cd: "CD", dvd: "DVD", game: "Game", mix: "Mix Bundle" };
    return names[category as keyof typeof names] || category;
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
              <p className="text-blue-100">
                Listed on {new Date(product.createdAt).toLocaleDateString()} • {product.totalItems} items
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <XIcon size={24} />
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-6">
              <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden">
                {product.imageUrl && !imageError ? (
                  <Image 
                    src={product.imageUrl} 
                    alt="Product image"
                    fill
                    className="object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">{getCategoryIcon(product.category)}</span>
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</div>
                  <div className="text-sm text-blue-700">Total Value</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{product.totalItems}</div>
                  <div className="text-sm text-purple-700">Items Included</div>
                </div>
              </div>
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Condition</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getConditionColor(product.condition)}`}>
                    {product.condition === "like-new" ? "Like New" : "Good"}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-bold text-gray-900">
                    {getCategoryIcon(product.category)} {getCategoryName(product.category)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Seller</p>
                  <p className="font-bold text-gray-900">{product.sellerName}</p>
                </div>
                {product.category === "mix" && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Categories</p>
                    <p className="font-bold text-gray-900">{product.distinctCategories.length} different</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Description</h4>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || "No description available for this bundle."}
                </p>
              </div>
              
              {/* Bundle Items */}
              {product.bundleItems && product.bundleItems.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Bundle Contents ({product.bundleItems.length} items)</h4>
                  <div className="max-h-60 overflow-y-auto rounded-2xl border border-gray-200">
                    {product.bundleItems.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <span className="text-lg">{getCategoryIcon(item.category)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Item #{index + 1}</div>
                            <div className="text-sm text-gray-500">
                              {item.isbn && <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-2">{item.isbn}</span>}
                              {getCategoryName(item.category)} • {item.condition === "like-new" ? "Like New" : "Good"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${item.price.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</div>
              <div className="text-sm text-gray-600">{product.totalItems} items total</div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3 border border-gray-300 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <Link
                href={`/products/${product.id}`}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl text-center"
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