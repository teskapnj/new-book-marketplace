// app/page.tsx - FULLY OPTIMIZED VERSION
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

// SVG Icons (unchanged)
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

// ✅ MAIN COMPONENT - OPTIMIZED
export default function HomePage() {
  const { user, loading, error, logout } = useAuth();
  const router = useRouter();

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Rate limiting
  const rateLimitConfig = {
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000,
    storageKey: 'auth-rate-limit'
  };

  const { isBlocked, remainingTime, attempts, recordAttempt } = useRateLimit(rateLimitConfig);

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ BACKGROUND AUTH - NON-BLOCKING
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
      } catch (error) {
        recordAttempt();
        setUserRole(UserRole.SELLER);
        logSecurityAttempt('role_check', false, user.uid);
      }
    };

    checkUserRoleInBackground();
  }, [user, isBlocked, recordAttempt]);

  // ✅ GOOGLE ADS TRACKING - PROPER IMPLEMENTATION
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      // Page view tracking
      if ('gtag' in window) {
        (window as any).gtag('event', 'page_view', {
          page_title: 'Home - Sell Books CDs DVDs Games',
          page_location: window.location.href,
          page_path: '/'
        });
      }

      // Mark as potential customer
      if ('gtag' in window) {
        (window as any).gtag('event', 'view_item_list', {
          items: [
            { item_name: 'Books', item_category: 'Media' },
            { item_name: 'CDs', item_category: 'Media' },
            { item_name: 'DVDs', item_category: 'Media' },
            { item_name: 'Games', item_category: 'Media' }
          ]
        });
      }
    }
  }, [isClient]);

  // Secure logout
  const handleSecureLogout = async () => {
    if (user) {
      try {
        await secureLogout(user);
        logSecurityAttempt('logout', true, user.uid);
      } catch (error) {
        console.error('Logout error');
      }
    }
    await logout();
  };

  // ✅ NO MORE BLOCKING LOADING SCREEN!
  // Rate limit check only
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

  // ✅ RENDER IMMEDIATELY - NO WAITING
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                      case UserRole.ADMIN:
                        router.push('/admin/dashboard');
                        break;
                      case UserRole.BUYER:
                        router.push('/listings');
                        break;
                      default:
                        router.push('/create-listing');
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
                  ) : (
                    <Link href="/create-listing" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                      Start Selling
                    </Link>
                  )}

                  {userRole === UserRole.BUYER && (
                    <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors relative">
                      <ShoppingCartIcon size={20} />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                    </Link>
                  )}

                  <button
                    onClick={handleSecureLogout}
                    className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/create-listing" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                    Start Selling
                  </Link>
                  <Link href="/login" className="font-medium text-gray-700 hover:text-gray-900 transition-colors">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-6 py-4 space-y-4">
              {user ? (
                <>
                  {userRole === UserRole.ADMIN ? (
                    <Link href="/admin/dashboard" className="block font-medium text-gray-900 py-2 hover:text-purple-600 transition-colors flex items-center">
                      <AdminIcon size={20} className="mr-2" />
                      Admin Dashboard
                    </Link>
                  ) : userRole === UserRole.BUYER ? (
                    <Link href="/listings" className="block font-medium text-gray-900 py-2 hover:text-green-600 transition-colors flex items-center">
                      <ShoppingCartIcon size={20} className="mr-2" />
                      Start Shopping
                    </Link>
                  ) : (
                    <Link href="/create-listing" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
                      Start Selling
                    </Link>
                  )}

                  {userRole === UserRole.BUYER && (
                    <Link href="/cart" className="block font-medium text-gray-900 py-2 hover:text-green-600 transition-colors flex items-center">
                      <ShoppingCartIcon size={20} className="mr-2" />
                      My Cart
                    </Link>
                  )}

                  <button
                    onClick={handleSecureLogout}
                    className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/create-listing" className="block font-medium text-gray-900 py-2 hover:text-blue-600 transition-colors">
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
        <div className="absolute top-20 left-10 text-6xl animate-bounce opacity-20">📚</div>
        <div className="absolute top-32 right-16 text-5xl animate-pulse opacity-20">💿</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-bounce opacity-20">🎮</div>
        <div className="absolute bottom-32 right-1/3 text-5xl animate-pulse opacity-20">📀</div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Sell Your Books, CDs, DVDs & Games
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
              Turn your old Books, CDs, DVDs and games into cash. We accept a wide range of items and our prices start from $1.49 - no cents, just dollars. Get instant quotes and free shipping today!
            </p>
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1000+</div>
                <div className="text-blue-200 text-sm sm:text-base">Sold items</div>
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

            <div className="mt-12 sm:mt-16">
              {userRole === UserRole.ADMIN ? (
                <Link
                  href="/admin/dashboard"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-lg sm:text-xl rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                >
                  <AdminIcon size={24} className="mr-3" />
                  Admin Dashboard
                  <ArrowRightIcon size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ) : userRole === UserRole.BUYER ? (
                <Link
                  href="/listings"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg sm:text-xl rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                >
                  <ShoppingCartIcon size={24} className="mr-3" />
                  Start Shopping
                  <ArrowRightIcon size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ) : (
                <Link
                  href="/create-listing"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                >
                  Start Selling Your Items
                  <ArrowRightIcon size={24} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </div>
          </div>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Add Your Items</h3>
              <p className="text-gray-600 leading-relaxed">
                Quick & Easy Selling - Just scan or type the barcode from your books, CDs, DVDs, or game discs.
                Amazon ASIN codes work too. Get your quote instantly.
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
                Within 24 hours, receive your prepaid shipping label and packing instructions via email.
                Pack your items securely and safely - proper packaging protects your items during transit.
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
                We inspect each item against our condition standards. Once your items are delivered to us,
                payment is processed within 2 business days directly to your paypal account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-30">💰</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse opacity-30">🚀</div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of sellers who've already earned money from their used media collections.
            Transform unused items into real money!!
          </p>
          <div className="mt-12 flex justify-center space-x-8 text-blue-200">
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
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                <AdminIcon size={24} className="mr-3" />
                Admin Dashboard
                <ArrowRightIcon size={24} className="ml-3" />
              </Link>
            ) : userRole === UserRole.BUYER ? (
              <Link
                href="/listings"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                <ShoppingCartIcon size={24} className="mr-3" />
                Start Shopping
                <ArrowRightIcon size={24} className="ml-3" />
              </Link>
            ) : (
              <Link
                href="/create-listing"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                Start Selling Now
                <ArrowRightIcon size={24} className="ml-3" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 block">
                SellBookMedia
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6">
                The premier marketplace for buying used books, CDs, DVDs, games discs.
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
              <h4 className="font-bold text-lg mb-6 text-white">For Sellers</h4>
              <ul className="space-y-3">
                <li><Link href="/condition-guidelines" className="text-gray-400 hover:text-white transition-colors">Condition Guidelines</Link></li>
                <li><Link href="/returns-policy" className="text-gray-400 hover:text-white transition-colors">Returns Policy</Link></li>
                <li><Link href="/seller-guide" className="text-gray-400 hover:text-white transition-colors">Seller Guide</Link></li>
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
              <p className="text-gray-400 text-sm">
                © 2025 SellBookMedia. All rights reserved.
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