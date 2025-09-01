"use client";
import { useState, useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, onSnapshot, DocumentData, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User as FirebaseUser } from "firebase/auth";
// !!! YENİ EKLENEN İMPORT: Mesajlaşma widget bileşenini sayfaya dahil ediyoruz. !!!
import SellerMessageWidget from '@/components/SellerMessageWidget';

// TypeScript interfaces
interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
interface UserData {
  uid: string;
  email: string | null;
  name: string;
  role: string;
  createdAt?: any;
  lastLogin?: any;
}
interface Listing {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  status: string;
  views: number;
  createdAt: Date;
  totalItems: number;
}
interface OrderItem {
  id: string;
  productId: string;
  sellerId: string;
  title: string;
  price: number;
  image?: string;
  shippingCost: number;
}
interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  subtotal: number;
  shippingTotal: number;
  marketplaceFee: number;
  taxTotal: number;
  status: string;
  shippingAddress: {
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  customerInfo: {
    email: string;
    fullName?: string;
    phone?: string;
  };
  items: OrderItem[];
  vendorBreakdown: any[];
  sellerIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
export default function DashboardPage() {
  const [authUser, authLoading, authError] = useAuthState(auth);
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [roleLoading, setRoleLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'orders' | 'sales'>('orders'); // Tab state for mobile
  
  // Convert Firebase user to our AppUser format with useMemo to prevent recreation
  const user = useMemo<AppUser | null>(() => {
    return authUser ? {
      uid: authUser.uid,
      email: authUser.email,
      displayName: authUser.displayName
    } : null;
  }, [authUser]);
  
  // Check user role and redirect admin to admin panel
  useEffect(() => {
    const checkUserRoleAndRedirect = async () => {
      console.log("Dashboard: Checking user role...");
      
      if (!authLoading && !user) {
        console.log("No user found, redirecting to login");
        router.push("/login");
        return;
      }
      
      if (user) {
        try {
          console.log("Checking role for user:", user.uid);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            const role = userData.role || "seller";
            const name = userData.name || user.displayName || "User";
            
            console.log("User role detected:", role);
            setUserRole(role);
            setUserName(name);
            
            // Update localStorage
            localStorage.setItem("userRole", role);
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", user.email || "");
            localStorage.setItem("userId", user.uid);
            
            // Redirect admin to admin panel
            if (role === "admin") {
              console.log("Admin detected, redirecting to admin panel...");
              setRedirecting(true);
              
              // Show message and redirect
              setTimeout(() => {
                window.location.href = "/admin/listings";
              }, 2000);
              return;
            }
            
            console.log("Regular user, staying on dashboard");
          } else {
            // User document doesn't exist yet - create default user data
            console.warn("User document not found, creating default profile...");
            
            // Set default values
            const defaultRole = "seller";
            const defaultName = user.displayName || user.email?.split('@')[0] || "User";
            
            setUserRole(defaultRole);
            setUserName(defaultName);
            
            // Update localStorage with defaults
            localStorage.setItem("userRole", defaultRole);
            localStorage.setItem("userName", defaultName);
            localStorage.setItem("userEmail", user.email || "");
            localStorage.setItem("userId", user.uid);
            
            // Create user document in Firestore
            try {
              await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                name: defaultName,
                role: defaultRole,
                createdAt: new Date(),
                lastLogin: new Date()
              });

              // >>>>>>>>>>>>>> KONUŞMAYI OTOMATİK OLUŞTURAN KOD <<<<<<<<<<<<<<
              // Yeni satıcı için admin ile bir konuşma başlat
              await setDoc(doc(db, 'conversations', user.uid), {
                participants: [user.uid, 'admin'],
                lastMessage: 'Hoş geldiniz! Sorularınızı buradan iletebilirsiniz.',
                lastUpdated: serverTimestamp()
              }, { merge: true }); // merge: true, eğer konuşma zaten varsa hata vermez
              console.log("User profile and conversation created successfully");

            } catch (error) {
              console.error("Error creating user profile or conversation:", error);
            }
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          setUserRole("seller");
          setUserName(user.displayName || "User");
        }
      }
      
      setRoleLoading(false);
    };
    
    checkUserRoleAndRedirect();
  }, [authLoading, user]); // Removed router from dependencies
  
  // Fetch user listings
  useEffect(() => {
    if (!user || userRole !== "seller") return;
    
    const fetchUserListings = async () => {
      try {
        setListingsLoading(true);
        
        // orderBy olmadan sorgu yap
        const q = query(
          collection(db, "listings"),
          where("vendorId", "==", user.uid)
        );
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const listingsData: Listing[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            
            // Get the first image from bundle items
            let firstItemImage = null;
            if (data.bundleItems && Array.isArray(data.bundleItems)) {
              for (const item of data.bundleItems) {
                // imageUrl alanını kontrol et (öncelikli)
                if (item.imageUrl) {
                  firstItemImage = item.imageUrl;
                  break;
                }
                // Eğer imageUrl yoksa, amazonData.image alanını kontrol et
                if (item.amazonData && item.amazonData.image) {
                  firstItemImage = item.amazonData.image;
                  break;
                }
                // Eğer hiçbiri yoksa, image alanını kontrol et (geriye dönük uyum)
                if (item.image) {
                  firstItemImage = item.image;
                  break;
                }
              }
            }
            
            listingsData.push({
              id: doc.id,
              title: data.title || "Untitled Bundle",
              price: data.totalValue || 0,
              imageUrl: firstItemImage,
              status: data.status || "pending",
              views: data.views || 0,
              createdAt: data.createdAt?.toDate() || new Date(),
              totalItems: data.totalItems || data.bundleItems?.length || 0
            });
          });
          
          // İstemci tarafında sırala (en yeni ilk)
          listingsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          
          console.log(`Loaded ${listingsData.length} user listings`);
          setUserListings(listingsData);
          setListingsLoading(false);
        }, (error) => {
          console.error("Error fetching user listings:", error);
          setListingsLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("Error setting up listings query:", error);
        setListingsLoading(false);
      }
    };
    
    fetchUserListings();
  }, [user, userRole]); // Fixed dependency array
  
  // Fetch user orders (both purchases and sales)
  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setDebugInfo(`Fetching orders for user ID: ${user.uid}`);
        
        // Fetch purchases (where user is buyer) - DOĞRU SORGU
        const purchasesQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        
        const unsubscribePurchases = onSnapshot(purchasesQuery, (querySnapshot) => {
          const purchasesData: Order[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            
            // Handle different date formats
            let createdAtDate = new Date();
            let updatedAtDate = new Date();
            
            if (data.createdAt) {
              if (typeof data.createdAt === 'string') {
                createdAtDate = new Date(data.createdAt);
              } else if (data.createdAt.toDate && typeof data.createdAt.toDate === 'function') {
                createdAtDate = data.createdAt.toDate();
              } else if (data.createdAt.seconds) {
                createdAtDate = new Date(data.createdAt.seconds * 1000);
              }
            }
            
            if (data.updatedAt) {
              if (typeof data.updatedAt === 'string') {
                updatedAtDate = new Date(data.updatedAt);
              } else if (data.updatedAt.toDate && typeof data.updatedAt.toDate === 'function') {
                updatedAtDate = data.updatedAt.toDate();
              } else if (data.updatedAt.seconds) {
                updatedAtDate = new Date(data.updatedAt.seconds * 1000);
              }
            }
            
            purchasesData.push({
              id: doc.id,
              userId: data.userId || '',
              orderNumber: data.orderNumber || '',
              totalAmount: data.totalAmount || 0,
              subtotal: data.subtotal || 0,
              shippingTotal: data.shippingTotal || 0,
              marketplaceFee: data.marketplaceFee || 0,
              taxTotal: data.taxTotal || 0,
              status: data.status || 'pending',
              shippingAddress: data.shippingAddress || {
                street1: '',
                city: '',
                state: '',
                zip: '',
                country: ''
              },
              customerInfo: data.customerInfo || {
                email: '',
                fullName: '',
                phone: ''
              },
              items: data.items || [],
              vendorBreakdown: data.vendorBreakdown || [],
              sellerIds: data.sellerIds || [],
              createdAt: createdAtDate,
              updatedAt: updatedAtDate
            });
          });
          
          // İstemci tarafında sırala (en yeni ilk)
          purchasesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          
          console.log(`Loaded ${purchasesData.length} purchases for user ${user.uid}`);
          setDebugInfo(prev => prev + `\nFound ${purchasesData.length} purchases`);
          setPurchases(purchasesData);
        }, (error) => {
          console.error("Error fetching purchases:", error);
          setDebugInfo(prev => prev + `\nError fetching purchases: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setOrdersLoading(false);
        });
        
        // Fetch sales (where user is seller) - BU KISIM DOĞRU
        const salesQuery = query(
          collection(db, "orders"),
          where("sellerIds", "array-contains", user.uid)
        );
        
        const unsubscribeSales = onSnapshot(salesQuery, (querySnapshot) => {
          const salesData: Order[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data() as DocumentData;
            
            // Handle different date formats
            let createdAtDate = new Date();
            let updatedAtDate = new Date();
            
            if (data.createdAt) {
              if (typeof data.createdAt === 'string') {
                createdAtDate = new Date(data.createdAt);
              } else if (data.createdAt.toDate && typeof data.createdAt.toDate === 'function') {
                createdAtDate = data.createdAt.toDate();
              } else if (data.createdAt.seconds) {
                createdAtDate = new Date(data.createdAt.seconds * 1000);
              }
            }
            
            if (data.updatedAt) {
              if (typeof data.updatedAt === 'string') {
                updatedAtDate = new Date(data.updatedAt);
              } else if (data.updatedAt.toDate && typeof data.updatedAt.toDate === 'function') {
                updatedAtDate = data.updatedAt.toDate();
              } else if (data.updatedAt.seconds) {
                updatedAtDate = new Date(data.updatedAt.seconds * 1000);
              }
            }
            
            salesData.push({
              id: doc.id,
              userId: data.userId || '',
              orderNumber: data.orderNumber || '',
              totalAmount: data.totalAmount || 0,
              subtotal: data.subtotal || 0,
              shippingTotal: data.shippingTotal || 0,
              marketplaceFee: data.marketplaceFee || 0,
              taxTotal: data.taxTotal || 0,
              status: data.status || 'pending',
              shippingAddress: data.shippingAddress || {
                street1: '',
                city: '',
                state: '',
                zip: '',
                country: ''
              },
              customerInfo: data.customerInfo || {
                email: '',
                fullName: '',
                phone: ''
              },
              items: data.items || [],
              vendorBreakdown: data.vendorBreakdown || [],
              sellerIds: data.sellerIds || [],
              createdAt: createdAtDate,
              updatedAt: updatedAtDate
            });
          });
          
          // İstemci tarafında sırala (en yeni ilk)
          salesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          
          console.log(`Loaded ${salesData.length} sales for user ${user.uid}`);
          setDebugInfo(prev => prev + `\nFound ${salesData.length} sales`);
          setSales(salesData);
          setOrdersLoading(false);
        }, (error) => {
          console.error("Error fetching sales:", error);
          setDebugInfo(prev => prev + `\nError fetching sales: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setOrdersLoading(false);
        });
        
        return () => {
          unsubscribePurchases();
          unsubscribeSales();
        };
      } catch (error) {
        console.error("Error setting up orders query:", error);
        setDebugInfo(prev => prev + `\nError setting up query: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setOrdersLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]); // Fixed dependency array - only user
  
  // Loading state
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Checking user permissions...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">
            {authError.message || "An error occurred during authentication"}
          </p>
          <Link 
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }
  
  // Admin redirect screen
  if (redirecting || userRole === "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6">🔧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Detected</h1>
          <p className="text-gray-600 mb-6">
            Welcome <strong>{userName}</strong>! You have admin privileges. 
            Redirecting you to the admin panel...
          </p>
          
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mr-3"></div>
            <span className="text-red-600 font-medium">Redirecting to Admin Panel...</span>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/admin/listings"
              className="block w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Go to Admin Panel Now
            </Link>
            <Link 
              href="/listings"
              className="block w-full bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Browse Listings Instead
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Required</h1>
          <p className="text-gray-600 mb-6">Please login to access your dashboard.</p>
          <Link 
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }
  
  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = { 
      book: "📚", 
      cd: "💿", 
      dvd: "📀", 
      game: "🎮", 
      mix: "📦" 
    };
    return icons[category] || "📦";
  };
  
  // Helper function to validate image URL
  const isValidImageUrl = (url: string | undefined) => {
    if (!url) return false;
    return (
      url.startsWith('https://firebasestorage.googleapis.com') ||
      url.startsWith('https://storage.googleapis.com') ||
      url.includes('amazon.com') ||
      url.includes('ssl-images-amazon.com') ||
      url.includes('m.media-amazon.com')
    );
  };
  
  // Helper function to safely format date
  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString();
  };
  
  // Helper function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate statistics
  const totalSalesAmount = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const pendingOrdersCount = purchases.filter(order => order.status === 'pending').length;
  const completedOrdersCount = purchases.filter(order => order.status === 'delivered').length;
  const pendingSalesCount = sales.filter(order => order.status === 'pending').length;
  const completedSalesCount = sales.filter(order => order.status === 'delivered').length;
  
  // Regular seller dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userName}!
              </h1>
              {/* Removed subtitle here */}
            </div>
            
            {/* Navigation Links - Better styled */}
            <div className="flex space-x-4">
              <Link 
                href="/"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Home Page
              </Link>
              
              {/* Account Settings Button */}
              <Link 
                href="/dashboard/settings"
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account Settings
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden">
          {/* Mobile Statistics Cards - All 8 but smaller */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-1">📊</div>
                <p className="text-sm font-bold text-blue-600">{userListings.length}</p>
                <p className="text-[9px] text-gray-600 text-center">Listings</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-1">💰</div>
                <p className="text-sm font-bold text-green-600">
                  ${userListings.reduce((sum, listing) => sum + (listing.price || 0), 0).toFixed(0)}
                </p>
                <p className="text-[9px] text-gray-600 text-center">Listings Value</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-1">👁️</div>
                <p className="text-sm font-bold text-purple-600">
                  {userListings.reduce((sum, listing) => sum + (listing.views || 0), 0)}
                </p>
                <p className="text-[9px] text-gray-600 text-center">Views</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-1">⭐</div>
                <p className="text-sm font-bold text-yellow-600">5.0</p>
                <p className="text-[9px] text-gray-600 text-center">Rating</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-1">🛒</div>
                <p className="text-sm font-bold text-orange-600">{purchases.length}</p>
                <p className="text-[9px] text-gray-600 text-center">Purchases</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-1">💰</div>
                <p className="text-sm font-bold text-teal-600">{sales.length}</p>
                <p className="text-[9px] text-gray-600 text-center">Sales</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-1">💸</div>
                <p className="text-sm font-bold text-indigo-600">${totalSalesAmount.toFixed(0)}</p>
                <p className="text-[9px] text-gray-600 text-center">Amount</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-lg mb-1">💬</div>
                <p className="text-sm font-bold text-pink-600">0</p>
                <p className="text-[9px] text-gray-600 text-center">Messages</p>
              </div>
            </div>
          </div>
          
          {/* Mobile Quick Actions - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* My Orders Card - Moved to top */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex flex-col items-center mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">🛒</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center">My Orders</h3>
              </div>
              <div className="mt-auto">
                <Link 
                  href="/dashboard/my-orders"
                  className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors text-xs font-medium text-center block"
                >
                  View
                </Link>
              </div>
            </div>
            
            {/* My Sales Card - Moved to top */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex flex-col items-center mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">💰</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center">My Sales</h3>
              </div>
              <div className="mt-auto">
                <Link 
                  href="/dashboard/my-sales"
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium text-center block"
                >
                  View
                </Link>
              </div>
            </div>
            
            {/* Create Listing Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex flex-col items-center mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">📝</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center">Create Listing</h3>
              </div>
              <div className="mt-auto">
                <Link 
                  href="/create-listing"
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium text-center block"
                >
                  Create
                </Link>
              </div>
            </div>
            
            {/* View Listings Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex flex-col items-center mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">📦</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 text-center">My Listings</h3>
              </div>
              <div className="mt-auto">
                <Link 
                  href="/my-listings"
                  className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium text-center block"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${activeTab === 'orders' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium text-sm ${activeTab === 'sales' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('sales')}
            >
              Sales
            </button>
          </div>
          
          {/* Mobile Tab Content */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold text-gray-900">🛒 Recent Orders</h3>
                <Link 
                  href="/dashboard/my-orders"
                  className="text-orange-600 hover:text-orange-800 font-medium text-xs"
                >
                  View All →
                </Link>
              </div>
              
              {ordersLoading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-2"></div>
                  <span className="text-gray-600 text-sm">Loading...</span>
                </div>
              ) : purchases.length > 0 ? (
                <div className="space-y-3">
                  {purchases.slice(0, 2).map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">Order #{order.id ? order.id.slice(-6).toUpperCase() : 'UNKNOWN'}</h4>
                          <p className="text-xs text-gray-600">
                            {formatDate(order.createdAt)} • {order.items?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm">${(order.totalAmount || 0).toFixed(2)}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status || '')}`}>
                            {order.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🛒</div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">No orders yet</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    You haven't made any purchases yet
                  </p>
                  <Link 
                    href="/listings"
                    className="inline-block bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition-colors text-xs"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'sales' && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold text-gray-900">💰 Recent Sales</h3>
                <Link 
                  href="/dashboard/my-sales"
                  className="text-purple-600 hover:text-purple-800 font-medium text-xs"
                >
                  View All →
                </Link>
              </div>
              
              {ordersLoading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-2"></div>
                  <span className="text-gray-600 text-sm">Loading...</span>
                </div>
              ) : sales.length > 0 ? (
                <div className="space-y-3">
                  {sales.slice(0, 2).map((sale) => (
                    <div key={sale.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">Sale #{sale.id ? sale.id.slice(-6).toUpperCase() : 'UNKNOWN'}</h4>
                          <p className="text-xs text-gray-600">
                            {formatDate(sale.createdAt)} • {sale.items?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm">${(sale.totalAmount || 0).toFixed(2)}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(sale.status || '')}`}>
                            {sale.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">💰</div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">No sales yet</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    You haven't made any sales yet
                  </p>
                  <Link 
                    href="/create-listing"
                    className="inline-block bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors text-xs"
                  >
                    Create Listing
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Desktop View - Unchanged */}
        <div className="hidden md:block">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Create Listing Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Create New Listing</h3>
                  <p className="text-sm text-gray-600">Add items to your marketplace</p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link 
                  href="/create-listing"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                >
                  Create Listing
                </Link>
              </div>
            </div>
            
            {/* View Listings Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
                  <p className="text-sm text-gray-600">Manage your active listings</p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link 
                  href="/my-listings"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-center block"
                >
                  View My Listings
                </Link>
              </div>
            </div>
            
            {/* My Orders Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
                  <p className="text-sm text-gray-600">Track your purchases</p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link 
                  href="/dashboard/my-orders"
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium text-center block"
                >
                  View Orders
                </Link>
              </div>
            </div>
            
            {/* My Sales Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Sales</h3>
                  <p className="text-sm text-gray-600">Manage your sales</p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link 
                  href="/dashboard/my-sales"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center block"
                >
                  View Sales
                </Link>
              </div>
            </div>
          </div>
          
          {/* Statistics Cards - Extended */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-xl font-bold text-blue-600">{userListings.length}</p>
                <p className="text-xs text-gray-600 text-center">Active Listings</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-xl font-bold text-green-600">
                  ${userListings.reduce((sum, listing) => sum + (listing.price || 0), 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 text-center">Listings Value</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">👁️</div>
                <p className="text-xl font-bold text-purple-600">
                  {userListings.reduce((sum, listing) => sum + (listing.views || 0), 0)}
                </p>
                <p className="text-xs text-gray-600 text-center">Total Views</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">⭐</div>
                <p className="text-xl font-bold text-yellow-600">5.0</p>
                <p className="text-xs text-gray-600 text-center">Seller Rating</p>
              </div>
            </div>
            
            {/* My Purchases Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">🛒</div>
                <p className="text-xl font-bold text-orange-600">{purchases.length}</p>
                <p className="text-xs text-gray-600 text-center">My Purchases</p>
              </div>
            </div>
            
            {/* My Sales Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-xl font-bold text-teal-600">{sales.length}</p>
                <p className="text-xs text-gray-600 text-center">My Sales</p>
              </div>
            </div>
            
            {/* Sales Amount Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">💸</div>
                <p className="text-xl font-bold text-indigo-600">${totalSalesAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-600 text-center">Sales Amount</p>
              </div>
            </div>
            
            {/* Messages Card */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-xl font-bold text-pink-600">0</p>
                <p className="text-xs text-gray-600 text-center">Messages</p>
              </div>
            </div>
          </div>
          
          {/* Orders and Sales Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">🛒 Recent Orders</h3>
                <Link 
                  href="/dashboard/my-orders"
                  className="text-orange-600 hover:text-orange-800 font-medium text-sm"
                >
                  View All Orders →
                </Link>
              </div>
              
              {ordersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mr-3"></div>
                  <span className="text-gray-600">Loading your orders...</span>
                </div>
              ) : purchases.length > 0 ? (
                <div className="space-y-4">
                  {purchases.slice(0, 3).map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Order #{order.id ? order.id.slice(-8).toUpperCase() : 'UNKNOWN'}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)} • {order.items?.length || 0} items
                          </p>
                          <p className="text-xs text-gray-500 mt-1">User ID: {order.userId}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${(order.totalAmount || 0).toFixed(2)}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status || '')}`}>
                            {order.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">🛒</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                  <p className="text-gray-600 mb-4">
                    You haven't made any purchases yet
                  </p>
                  <Link 
                    href="/listings"
                    className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
            
            {/* Recent Sales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">💰 Recent Sales</h3>
                <Link 
                  href="/dashboard/my-sales"
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm"
                >
                  View All Sales →
                </Link>
              </div>
              
              {ordersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                  <span className="text-gray-600">Loading your sales...</span>
                </div>
              ) : sales.length > 0 ? (
                <div className="space-y-4">
                  {sales.slice(0, 3).map((sale) => (
                    <div key={sale.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">Sale #{sale.id ? sale.id.slice(-8).toUpperCase() : 'UNKNOWN'}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(sale.createdAt)} • {sale.items?.length || 0} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${(sale.totalAmount || 0).toFixed(2)}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(sale.status || '')}`}>
                            {sale.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">💰</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No sales yet</h4>
                  <p className="text-gray-600 mb-4">
                    You haven't made any sales yet
                  </p>
                  <Link 
                    href="/create-listing"
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Create Listing
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Account Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            📧 Account: {user?.email} • 🕒 Last login: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
      {/* !!! EN SONA, ANNA DIV'İN İÇİNE EKLEDİK !!! */}
      {/* Bu bileşen, sayfanın sağ alt köşesinde sabitlenen mesajlaşma ikonunu ve widget'ını içerir. */}
      <SellerMessageWidget />
    </div>
  );
}