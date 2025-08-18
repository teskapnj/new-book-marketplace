// app/dashboard/listings/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SellerListingsPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); // Track which listing is being deleted

  // Kullanıcı durumunu takip et
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle listing deletion
  const handleDeleteListing = async (listingId: string) => {
    if (!user) return;
    
    // Show confirmation dialog
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return;
    }
    
    setDeleteLoading(listingId);
    
    try {
      // Delete the listing from Firestore
      await deleteDoc(doc(db, "listings", listingId));
      
      // Update local state
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      
      // If the deleted listing is currently selected, close the modal
      if (selectedListing && selectedListing.id === listingId) {
        setSelectedListing(null);
      }
      
      // Show success message
      alert("Listing deleted successfully!");
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete listing. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Fetch listings from Firebase for the current user
  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    
    const fetchListings = async () => {
      try {
        // Try the indexed query first
        const q = query(
          collection(db, "listings"),
          where("vendorId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const listingsData: any[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Check if bundleItems exists and is an array
            if (!data.bundleItems || !Array.isArray(data.bundleItems)) {
              console.warn(`Listing ${doc.id} has invalid bundleItems:`, data.bundleItems);
              return;
            }
            
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
            
            // Determine category: if more than one distinct category, it's a mix
            const dominantCategory = distinctCategories.size > 1 ? "mix" : 
                                    (distinctCategories.values().next().value || "mix");
            
            const dominantCondition = Object.entries(conditionCounts)
              .sort((a, b) => b[1] - a[1])[0]?.[0] || "good";
            
            listingsData.push({
              id: doc.id,
              title: data.title || "Untitled Bundle",
              price: data.totalValue || 0,
              category: dominantCategory,
              condition: dominantCondition,
              sellerName: data.vendorName || user.displayName || "Anonymous Seller",
              createdAt: data.createdAt?.toDate() || new Date(),
              bundleItems: data.bundleItems,
              description: `Bundle of ${data.totalItems || data.bundleItems.length} items including various ${dominantCategory === "mix" ? "categories" : dominantCategory + "s"} in ${dominantCondition === "like-new" ? "Like New" : "Good"} condition.`,
              status: data.status || "pending",
              totalItems: data.totalItems || data.bundleItems.length,
              vendorId: data.vendorId,
              distinctCategories: Array.from(distinctCategories),
              submittedDate: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
              reviewedDate: data.reviewedAt?.toDate().toLocaleDateString() || null,
              rejectionReason: data.rejectionReason || null,
              adminNotes: data.adminNotes || null
            });
          });
          
          setListings(listingsData);
          setLoading(false);
          setIndexError(null);
          setFallbackMode(false);
        }, (error) => {
          console.error("Firestore error:", error);
          
          // Check if it's the specific index error
          if (error.code === 'failed-precondition' && error.message.includes('index')) {
            // Extract the link from the error message
            const match = error.message.match(/https:\/\/console\.firebase\.google\.com\/[^\s]*/);
            const indexLink = match ? match[0] : null;
            
            setIndexError(indexLink || "Index required but no link provided");
            setFallbackMode(true);
            
            // Fallback: fetch without ordering
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
    
    // Fallback method: fetch without ordering and sort on client
    const fetchWithoutIndex = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("vendorId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const listingsData: any[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Check if bundleItems exists and is an array
          if (!data.bundleItems || !Array.isArray(data.bundleItems)) {
            console.warn(`Listing ${doc.id} has invalid bundleItems:`, data.bundleItems);
            return;
          }
          
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
          
          // Determine category: if more than one distinct category, it's a mix
          const dominantCategory = distinctCategories.size > 1 ? "mix" : 
                                  (distinctCategories.values().next().value || "mix");
          
          const dominantCondition = Object.entries(conditionCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "good";
          
          listingsData.push({
            id: doc.id,
            title: data.title || "Untitled Bundle",
            price: data.totalValue || 0,
            category: dominantCategory,
            condition: dominantCondition,
            sellerName: data.vendorName || user.displayName || "Anonymous Seller",
            createdAt: data.createdAt?.toDate() || new Date(),
            bundleItems: data.bundleItems,
            description: `Bundle of ${data.totalItems || data.bundleItems.length} items including various ${dominantCategory === "mix" ? "categories" : dominantCategory + "s"} in ${dominantCondition === "like-new" ? "Like New" : "Good"} condition.`,
            status: data.status || "pending",
            totalItems: data.totalItems || data.bundleItems.length,
            vendorId: data.vendorId,
            distinctCategories: Array.from(distinctCategories),
            submittedDate: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
            reviewedDate: data.reviewedAt?.toDate().toLocaleDateString() || null,
            rejectionReason: data.rejectionReason || null,
            adminNotes: data.adminNotes || null
          });
        });
        
        // Sort manually in JavaScript
        listingsData.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        setListings(listingsData);
        setLoading(false);
      } catch (error) {
        console.error("Fallback fetch error:", error);
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [user]);

  const pendingCount = listings.filter(l => l.status === "pending").length;
  const approvedCount = listings.filter(l => l.status === "approved").length;
  const rejectedCount = listings.filter(l => l.status === "rejected").length;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200", 
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    const icons = { pending: "⏳", approved: "✅", rejected: "❌" };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]} <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const getStatusMessage = (status: string) => {
    const messages = {
      pending: "Your listing is under review. We'll notify you once it's approved.",
      approved: "Your listing is live and visible to buyers!",
      rejected: "Your listing was rejected. Please review the feedback and try again."
    };
    return messages[status as keyof typeof messages] || "";
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

  // Loading state for authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not logged in, show login message
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your listings.</p>
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-1">Track your submitted listings ({listings.length} total)</p>
          </div>
          <Link 
            href="/dashboard/listings/create"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ➕ Create New Listing
          </Link>
        </div>

        {/* Index Error Message */}
        {indexError && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Database Index Required:</strong> 
                  {fallbackMode 
                    ? "Currently running in fallback mode. Some features may be limited."
                    : "We're building a database index to improve performance. This may take a few minutes."}
                </p>
                <div className="mt-2">
                  {typeof indexError === 'string' && indexError.startsWith('http') ? (
                    <a 
                      href={indexError}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Create Index Now
                      <svg className="ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-sm text-yellow-600">
                      Please check Firebase Console to create the required index.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{listings.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {listings.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-6">Create your first bundle listing to get started selling.</p>
                <Link 
                  href="/dashboard/listings/create"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Create Your First Listing
                </Link>
              </div>
            ) : (
              /* Listings */
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg border p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusBadge(listing.status)}
                        <span className="text-sm text-gray-500">ID: {listing.id}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          👁️ View Details
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          disabled={deleteLoading === listing.id}
                          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                            deleteLoading === listing.id
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {deleteLoading === listing.id ? "Deleting..." : "🗑️ Delete"}
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {listing.title}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                      <div>📦 {listing.totalItems} items</div>
                      <div>💰 ${listing.price.toFixed(2)}</div>
                      <div>📅 {listing.submittedDate}</div>
                    </div>
                    
                    <div className={`p-3 rounded-lg border-l-4 ${
                      listing.status === 'pending' ? 'bg-yellow-50 border-yellow-400' :
                      listing.status === 'approved' ? 'bg-green-50 border-green-400' :
                      'bg-red-50 border-red-400'
                    }`}>
                      <p className={`text-sm font-medium ${
                        listing.status === 'pending' ? 'text-yellow-800' :
                        listing.status === 'approved' ? 'text-green-800' :
                        'text-red-800'
                      }`}>
                        {getStatusMessage(listing.status)}
                      </p>
                      {listing.status === 'rejected' && listing.rejectionReason && (
                        <p className="text-sm text-red-700 mt-2">
                          <strong>Reason:</strong> {listing.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Enhanced Modal with Bundle Items Table */}
        {selectedListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedListing.title}</h3>
                    {getStatusBadge(selectedListing.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Listed on {selectedListing.submittedDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Basic Info */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Title:</span>
                        <span className="text-gray-900">{selectedListing.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Status:</span>
                        {getStatusBadge(selectedListing.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Category:</span>
                        <span className="text-gray-900">
                          {getCategoryIcon(selectedListing.category)} {getCategoryName(selectedListing.category)}
                        </span>
                      </div>
                      {selectedListing.category === "mix" && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Categories:</span>
                          <span className="text-gray-900">
                            {selectedListing.distinctCategories.map((cat: string, i: number) => (
                              <span key={cat}>
                                {getCategoryIcon(cat)} {getCategoryName(cat)}
                                {i < selectedListing.distinctCategories.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Total Items:</span>
                        <span className="text-gray-900">{selectedListing.totalItems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Total Value:</span>
                        <span className="text-gray-900 font-semibold">${selectedListing.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Submitted:</span>
                        <span className="text-gray-900">{selectedListing.submittedDate}</span>
                      </div>
                      {selectedListing.reviewedDate && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Reviewed:</span>
                          <span className="text-gray-900">{selectedListing.reviewedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bundle Items Table */}
                {selectedListing.bundleItems && selectedListing.bundleItems.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Bundle Items ({selectedListing.bundleItems.length})
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ISBN
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Condition
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedListing.bundleItems.map((item: any, index: number) => (
                              <tr key={item.id || index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-2">{getCategoryIcon(item.category)}</span>
                                    <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-mono">{item.isbn}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {getCategoryName(item.category)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item.condition === 'like-new' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {item.condition === 'like-new' ? 'Like New' : 'Good'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 text-center font-medium">{item.quantity}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-medium">${item.price.toFixed(2)}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan={5} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                Total:
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                {selectedListing.bundleItems.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                ${selectedListing.price.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {selectedListing.rejectionReason && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Rejection Feedback</h4>
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Reason:</strong> {selectedListing.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

                {selectedListing.adminNotes && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Admin Notes</h4>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedListing.adminNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>
                {selectedListing.status === 'rejected' && (
                  <Link
                    href="/dashboard/listings/create"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Create New Listing
                  </Link>
                )}
                <button
                  onClick={() => handleDeleteListing(selectedListing.id)}
                  disabled={deleteLoading === selectedListing.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    deleteLoading === selectedListing.id
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  }`}
                >
                  {deleteLoading === selectedListing.id ? "Deleting..." : "Delete Listing"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}