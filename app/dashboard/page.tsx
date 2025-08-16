"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [roleLoading, setRoleLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  
  // 🔍 Check user role and redirect admin to admin panel
  useEffect(() => {
    const checkUserRoleAndRedirect = async () => {
      console.log("🔍 Dashboard: Checking user role...");
      
      if (!loading && !user) {
        console.log("❌ No user found, redirecting to login");
        router.push("/login");
        return;
      }
      
      if (user) {
        try {
          console.log("👤 Checking role for user:", user.uid);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role || "seller";
            const name = userData.name || user.displayName || "User";
            
            console.log("🔍 User role detected:", role);
            setUserRole(role);
            setUserName(name);
            
            // Update localStorage
            localStorage.setItem("userRole", role);
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", user.email || "");
            localStorage.setItem("userId", user.uid);
            
            // 🎯 Redirect admin to admin panel
            if (role === "admin") {
              console.log("🔧 Admin detected, redirecting to admin panel...");
              setRedirecting(true);
              
              // Show message and redirect
              setTimeout(() => {
                window.location.href = "/admin/listings";
              }, 2000);
              return;
            }
            
            console.log("✅ Regular user, staying on dashboard");
          } else {
            // User document doesn't exist yet - create default user data
            console.warn("⚠️ User document not found, creating default profile...");
            
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
              const { setDoc } = await import("firebase/firestore");
              await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                name: defaultName,
                role: defaultRole,
                createdAt: new Date(),
                lastLogin: new Date()
              });
              console.log("✅ User profile created successfully");
            } catch (error) {
              console.error("Error creating user profile:", error);
            }
          }
        } catch (error) {
          console.error("❌ Error checking user role:", error);
          setUserRole("seller");
          setUserName(user.displayName || "User");
        }
      }
      
      setRoleLoading(false);
    };
    
    checkUserRoleAndRedirect();
  }, [user, loading, router]);
  
  // Loading state
  if (loading || roleLoading) {
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
              🚀 Go to Admin Panel Now
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
  
  // Regular seller dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userName}! 👋
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your listings and track your sales performance
              </p>
            </div>
            
            {/* Navigation Links */}
            <div className="flex space-x-4">
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Home Page
              </Link>
              
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Create Listing Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create New Listing</h3>
                <p className="text-sm text-gray-600">Add items to your marketplace</p>
              </div>
            </div>
            <Link 
              href="/create-listing"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
            >
              Create Listing
            </Link>
          </div>
          
          {/* View Listings Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
                <p className="text-sm text-gray-600">Manage your active listings</p>
              </div>
            </div>
            <Link 
              href="/my-listings"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-center block"
            >
              View My Listings
            </Link>
          </div>
          
          {/* Browse Marketplace Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Browse Marketplace</h3>
                <p className="text-sm text-gray-600">Discover items from other sellers</p>
              </div>
            </div>
            <Link 
              href="/listings"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center block"
            >
              Browse Items
            </Link>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📊</div>
              <div>
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">Active Listings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💰</div>
              <div>
                <p className="text-2xl font-bold text-green-600">$0</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👁️</div>
              <div>
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⭐</div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">5.0</p>
                <p className="text-sm text-gray-600">Seller Rating</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Recent Activity</h3>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h4>
            <p className="text-gray-600 mb-4">
              Start by creating your first listing to see activity here
            </p>
          </div>
        </div>
        
        {/* Account Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              📧 Account: {user?.email} • 🕒 Last login: {new Date().toLocaleString()}
            </div>
            <Link 
              href="/settings"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Account Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}