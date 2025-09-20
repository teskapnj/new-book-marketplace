"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  getDoc
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminListingsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  interface BundleItem {
    isbn: string;
    category: string;
    condition: string;
    price: number;
    quantity: number;
  }

  interface Listing {
    id: string;
    title: string;
    totalItems: number;
    totalValue: number;
    status: "pending" | "approved" | "rejected";
    vendorId: string;
    vendorName: string;
    bundleItems: BundleItem[];
    createdAt: Date;
    submittedDate: string;
    reviewedDate?: Timestamp | Date;
    rejectionReason?: string;
    adminNotes?: string;
    reviewedBy?: string;
    views: number;
  }

  // 📊 State management
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [loadingListings, setLoadingListings] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  // 📄 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 🔐 Admin Role Authentication Check
  useEffect(() => {
    const checkAdminRole = async () => {
      console.log("🔍 Checking admin authentication...");

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

            console.log("🔍 User role found:", role);
            setUserRole(role);
            setUserName(name);

            // Update localStorage with correct role
            localStorage.setItem("userRole", role);
            localStorage.setItem("userEmail", user.email || "");
            localStorage.setItem("userName", name);
            localStorage.setItem("userId", user.uid);

            if (role !== "admin") {
              console.log("❌ User is not admin (role: " + role + "), redirecting to dashboard");
              alert("❌ Admin access required! You will be redirected to dashboard.");
              router.push("/dashboard");
              return;
            }

            console.log("✅ Admin access confirmed for:", user.email);
          } else {
            console.log("❌ User document not found, redirecting to dashboard");
            setUserRole("seller");
            alert("❌ User profile not found! Please contact support.");
            router.push("/dashboard");
            return;
          }
        } catch (error) {
          console.error("❌ Error checking admin role:", error);
          setUserRole("seller");
          alert("❌ Error checking permissions! Please try again.");
          router.push("/dashboard");
          return;
        }
      }

      setRoleLoading(false);
    };

    checkAdminRole();
  }, [user, loading, router]);

  // 🔥 Real-time Firebase listener for listings
  useEffect(() => {
    if (!user || userRole !== "admin" || roleLoading) return;

    console.log("🔥 Setting up real-time listings listener...");
    let unsubscribe: () => void;

    const setupListener = () => {
      try {
        // Create query to get all listings ordered by creation date
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("createdAt", "desc"));

        unsubscribe = onSnapshot(q,
          (querySnapshot) => {
            const listingsData: any[] = [];

            querySnapshot.forEach((docSnapshot) => {
              const data = docSnapshot.data();

              // Process listing data
              listingsData.push({
                id: docSnapshot.id,
                title: data.title || "Untitled Bundle",
                totalItems: data.totalItems || 0,
                totalValue: data.totalValue || 0,
                status: data.status || "pending",
                vendorId: data.vendorId,
                vendorName: data.vendorName || "Unknown Seller",
                bundleItems: data.bundleItems || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                submittedDate: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
                reviewedDate: data.reviewedDate,
                rejectionReason: data.rejectionReason,
                adminNotes: data.adminNotes,
                reviewedBy: data.reviewedBy,
                views: data.views || 0
              });
            });

            setListings(listingsData);
            setLoadingListings(false);
            console.log(`✅ Loaded ${listingsData.length} listings from Firebase`);
          },
          (error) => {
            console.error("❌ Error fetching listings:", error);

            // Fallback: try without ordering
            if (error.code === 'failed-precondition') {
              console.log("⚠️ Index not found, trying fallback query...");
              const fallbackQuery = collection(db, "listings");

              unsubscribe = onSnapshot(fallbackQuery, (querySnapshot) => {
                const listingsData: any[] = [];

                querySnapshot.forEach((docSnapshot) => {
                  const data = docSnapshot.data();

                  listingsData.push({
                    id: docSnapshot.id,
                    title: data.title || "Untitled Bundle",
                    totalItems: data.totalItems || 0,
                    totalValue: data.totalValue || 0,
                    status: data.status || "pending",
                    vendorId: data.vendorId,
                    vendorName: data.vendorName || "Unknown Seller",
                    bundleItems: data.bundleItems || [],
                    createdAt: data.createdAt?.toDate() || new Date(),
                    submittedDate: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
                    reviewedDate: data.reviewedDate,
                    rejectionReason: data.rejectionReason,
                    adminNotes: data.adminNotes,
                    reviewedBy: data.reviewedBy,
                    views: data.views || 0
                  });
                });

                // Sort manually by creation date
                listingsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setListings(listingsData);
                setLoadingListings(false);
                console.log(`✅ Loaded ${listingsData.length} listings (fallback mode)`);
              });
            } else {
              setLoadingListings(false);
              alert("❌ Error loading listings. Please refresh the page.");
            }
          }
        );
      } catch (error) {
        console.error("❌ Error setting up listener:", error);
        setLoadingListings(false);
        alert("❌ Error connecting to database. Please refresh the page.");
      }
    };

    setupListener();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        console.log("🧹 Cleaning up listings listener");
        unsubscribe();
      }
    };
  }, [user, userRole, roleLoading]);

  // 📈 Computed values
  const pendingListings = listings.filter(l => l.status === "pending");
  const approvedListings = listings.filter(l => l.status === "approved");
  const rejectedListings = listings.filter(l => l.status === "rejected");

  // 🔍 Filtering and search logic
  let filteredListings = listings;

  if (filterStatus !== "all") {
    filteredListings = filteredListings.filter(listing => listing.status === filterStatus);
  }

  if (searchTerm) {
    filteredListings = filteredListings.filter(listing =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // 📄 Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredListings.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // ✅ Approve listing function - Updates Firebase
  const approveListing = async (listingId: string) => {
    if (!window.confirm("Are you sure you want to approve this listing?")) {
      return;
    }

    setIsProcessing(true);

    try {
      const listingRef = doc(db, "listings", listingId);

      await updateDoc(listingRef, {
        status: "approved",
        reviewedDate: serverTimestamp(),
        reviewedBy: user?.email || "admin",
        adminNotes: adminNotes.trim() || null
      });

      console.log(`✅ Listing ${listingId} approved by ${user?.email}`);

      // Reset modal state
      setSelectedListing(null);
      setAdminNotes("");

      // Show success message
      alert("✅ Listing approved successfully!");

    } catch (error) {
      console.error("❌ Error approving listing:", error);
      alert("❌ Error occurred while approving listing! Please try again.");
    }

    setIsProcessing(false);
  };

  // ❌ Reject listing function - Updates Firebase
  const rejectListing = async (listingId: string) => {
    if (!rejectionReason.trim()) {
      alert("⚠️ Please provide a rejection reason");
      return;
    }

    if (!window.confirm("Are you sure you want to reject this listing?")) {
      return;
    }

    setIsProcessing(true);

    try {
      const listingRef = doc(db, "listings", listingId);

      await updateDoc(listingRef, {
        status: "rejected",
        reviewedDate: serverTimestamp(),
        reviewedBy: user?.email || "admin",
        rejectionReason: rejectionReason.trim(),
        adminNotes: adminNotes.trim() || null
      });

      console.log(`❌ Listing ${listingId} rejected by ${user?.email}`);

      // Reset modal state
      setSelectedListing(null);
      setRejectionReason("");
      setAdminNotes("");

      alert("❌ Listing rejected successfully!");

    } catch (error) {
      console.error("❌ Error rejecting listing:", error);
      alert("❌ Error occurred while rejecting listing! Please try again.");
    }

    setIsProcessing(false);
  };

  // 🎨 Helper functions
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

  const getCategoryIcon = (category: string) => {
    const icons = { book: "📚", cd: "💿", dvd: "📀", game: "🎮", mix: "📦" };
    return icons[category as keyof typeof icons] || "📦";
  };

  // Loading state
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Verifying admin permissions...</p>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (!user || userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">

        {/* 🏠 Navigation Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Browse Listings
            </Link>
          </div>

          {/* 👤 Admin info display */}
          <div className="text-sm text-gray-600">
            🔧 Admin: <span className="font-medium text-red-600">{userName}</span>
            <span className="text-gray-400 ml-2">({user?.email})</span>
          </div>
        </div>

        {/* 📊 Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Admin - Listings Management</h1>
          <p className="text-gray-600">Review and manage seller listings in real-time</p>
          {loadingListings && (
            <p className="text-blue-600 text-sm mt-2">🔄 Loading listings...</p>
          )}
        </div>

        {/* 🔍 Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by title, ID, or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status ({listings.length})</option>
                <option value="pending">⏳ Pending ({pendingListings.length})</option>
                <option value="approved">✅ Approved ({approvedListings.length})</option>
                <option value="rejected">❌ Rejected ({rejectedListings.length})</option>
              </select>
            </div>
          </div>
        </div>

        {/* 📈 Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-400">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⏳</div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingListings.length}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-400">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <p className="text-2xl font-bold text-green-600">{approvedListings.length}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-400">
            <div className="flex items-center">
              <div className="text-3xl mr-4">❌</div>
              <div>
                <p className="text-2xl font-bold text-red-600">{rejectedListings.length}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📦</div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{listings.length}</p>
                <p className="text-sm text-gray-600">Total Listings</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📋 Listings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Listings ({filteredListings.length})
            </h3>
            <div className="text-sm text-gray-500">
              Showing {Math.min(indexOfFirstItem + 1, filteredListings.length)}-{Math.min(indexOfLastItem, filteredListings.length)} of {filteredListings.length}
            </div>
          </div>

          {loadingListings ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading listings...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Listing Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items & Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {listing.id}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {listing.vendorName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {listing.vendorId}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            📦 {listing.totalItems} items
                          </div>
                          <div className="text-sm text-gray-500">
                            💰 ${listing.totalValue.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {getStatusBadge(listing.status)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {listing.submittedDate}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedListing(listing)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            👁️ Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty state */}
              {filteredListings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "No listings have been submitted yet."
                    }
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredListings.length > itemsPerPage && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(pageNumbers.length, currentPage + 1))}
                      disabled={currentPage === pageNumbers.length}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, filteredListings.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredListings.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          ←
                        </button>
                        {pageNumbers.map(number => (
                          <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                            {number}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(pageNumbers.length, currentPage + 1))}
                          disabled={currentPage === pageNumbers.length}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          →
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 🔍 Review Modal */}
        {selectedListing && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  🔍 Review Listing: {selectedListing.title}
                </h3>
                <button
                  onClick={() => {
                    setSelectedListing(null);
                    setAdminNotes("");
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left column - Listing information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">📋 Listing Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p><strong>ID:</strong> {selectedListing.id}</p>
                      <p><strong>Title:</strong> {selectedListing.title}</p>
                      <p><strong>Seller:</strong> {selectedListing.vendorName}</p>
                      <p><strong>Seller ID:</strong> {selectedListing.vendorId}</p>
                      <p><strong>Total Items:</strong> {selectedListing.totalItems}</p>
                      <p><strong>Total Value:</strong> ${selectedListing.totalValue.toFixed(2)}</p>
                      <p><strong>Submitted:</strong> {selectedListing.submittedDate}</p>
                      <p><strong>Views:</strong> {selectedListing.views}</p>
                      <p><strong>Current Status:</strong> {getStatusBadge(selectedListing.status)}</p>
                      {selectedListing.reviewedBy && (
                        <p><strong>Reviewed by:</strong> {selectedListing.reviewedBy}</p>
                      )}
                    </div>
                  </div>

                  {/* Bundle items preview */}
                  {selectedListing.bundleItems && selectedListing.bundleItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        📦 Bundle Items ({selectedListing.bundleItems.length})
                      </h4>
                      <div className="max-h-80 overflow-y-auto space-y-2">
                        {selectedListing.bundleItems.map((item: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="mr-2">{getCategoryIcon(item.category)}</span>
                                <span className="font-medium">ISBN: {item.isbn}</span>
                              </div>
                              <span className="text-gray-600">${item.price}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.category} • {item.condition} • Qty: {item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column - Admin actions */}
                <div className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📝 Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add any notes about this listing..."
                      disabled={selectedListing.status !== "pending"}
                    />
                  </div>

                  {selectedListing.status === "pending" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ❌ Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Provide detailed reason for rejection..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => approveListing(selectedListing.id)}
                          disabled={isProcessing}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isProcessing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V8a8 8 0 018-0z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            "✅ Approve"
                          )}
                        </button>

                        <button
                          onClick={() => rejectListing(selectedListing.id)}
                          disabled={isProcessing || !rejectionReason.trim()}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isProcessing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V8a8 8 0 018-0z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            "❌ Reject"
                          )}
                        </button>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          ⚠️ <strong>Review Guidelines:</strong> Ensure all items meet marketplace standards.
                          Check for appropriate pricing, accurate descriptions, and policy compliance.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Show status if already reviewed */}
                  {selectedListing.status !== "pending" && (
                    <div className={`p-4 rounded-lg ${selectedListing.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                      <p className={`font-medium ${selectedListing.status === 'approved' ? 'text-green-800' : 'text-red-800'
                        }`}>
                        {selectedListing.status === 'approved' ? '✅' : '❌'} This listing has been {selectedListing.status}
                      </p>
                      {selectedListing.rejectionReason && (
                        <p className="text-red-600 text-sm mt-2">
                          <strong>Rejection Reason:</strong> {selectedListing.rejectionReason}
                        </p>
                      )}
                      {selectedListing.adminNotes && (
                        <p className="text-gray-600 text-sm mt-2">
                          <strong>Admin Notes:</strong> {selectedListing.adminNotes}
                        </p>
                      )}
                      {selectedListing.reviewedBy && (
                        <p className="text-gray-600 text-sm mt-2">
                          <strong>Reviewed by:</strong> {selectedListing.reviewedBy}
                        </p>
                      )}
                      {selectedListing.reviewedDate && (
                        <p className="text-gray-600 text-sm mt-2">
                          <strong>Reviewed on:</strong> {selectedListing.reviewedDate
                            ? (selectedListing.reviewedDate instanceof Date
                              ? selectedListing.reviewedDate.toLocaleString()
                              : (selectedListing.reviewedDate && typeof selectedListing.reviewedDate === 'object' && 'seconds' in selectedListing.reviewedDate)
                                ? new Date((selectedListing.reviewedDate as Timestamp).seconds * 1000).toLocaleString()
                                : 'Invalid date')
                            : 'Not reviewed'
                          }
                        </p>
                      )}
                    </div>
                  )}

                  {/* Real-time status indicator */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      🔄 <strong>Real-time Updates:</strong> This listing is monitored in real-time.
                      Changes are instantly reflected across all admin panels and user interfaces.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(selectedListing.createdAt).toLocaleString()}</p>
                    <p>Admin: {userName} ({user?.email})</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedListing(null);
                      setAdminNotes("");
                      setRejectionReason("");
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📊 Real-time connection indicator */}
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-green-100 border border-green-200 rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center text-sm text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              🔥 Firebase Connected
            </div>
          </div>
        </div>

        {/* 🎯 Quick Stats Footer */}
        {!loadingListings && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                📊 Dashboard Stats: {listings.length} total listings •
                {pendingListings.length} awaiting review •
                {approvedListings.length} approved •
                {rejectedListings.length} rejected
              </div>
              <div>
                🕒 Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}