// components/UserListingsSection.tsx
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { FiPackage, FiList, FiX, FiDollarSign, FiCheck, FiClock, FiTruck, FiSettings, FiEye } from "react-icons/fi";
import Link from "next/link";

interface UserListing {
  id: string;
  title: string;
  totalItems: number;
  totalValue: number;
  status: "pending" | "approved" | "shipped_to_seller" | "payment_sent" | "rejected" | "sold";
  createdAt: any;
  submissionId: string;
  // Ödeme ile ilgili yeni alanlar
  paymentSent: boolean;
  paymentAmount?: number;
  paymentSentAt?: any;
  shippingLabelSent: boolean;
  trackingNumber?: string;
  carrier?: string;
}

interface UserListingsSectionProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function UserListingsSection({ isVisible, onClose }: UserListingsSectionProps) {
  const [user] = useAuthState(auth);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);

  const fetchUserListings = async () => {
    if (!user) return;
    
    setIsLoadingListings(true);
    try {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("vendorId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      const listings: UserListing[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        listings.push({
          id: doc.id,
          title: data.title || "Untitled Listing",
          totalItems: data.totalItems || 0,
          totalValue: data.totalValue || 0,
          status: data.status || "pending",
          createdAt: data.createdAt,
          submissionId: doc.id,
          // Ödeme ile ilgili alanlar
          paymentSent: data.paymentSent || false,
          paymentAmount: data.paymentAmount || null,
          paymentSentAt: data.paymentSentAt || null,
          shippingLabelSent: !!data.shippingLabelUrl,
          trackingNumber: data.trackingNumber || null,
          carrier: data.carrier || null
        });
      });
      
      setUserListings(listings);
    } catch (error) {
      console.error("Error fetching user listings:", error);
    } finally {
      setIsLoadingListings(false);
    }
  };

  useEffect(() => {
    if (isVisible && user) {
      fetchUserListings();
    }
  }, [isVisible, user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "shipped_to_seller": return "bg-blue-100 text-blue-800";
      case "payment_sent": return "bg-purple-100 text-purple-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "sold": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "In Review";
      case "approved": return "Approved";
      case "shipped_to_seller": return "Shipped to Seller";
      case "payment_sent": return "Payment Sent";
      case "rejected": return "Rejected";
      case "sold": return "Sold";
      default: return "Unknown";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <FiClock className="h-4 w-4" />;
      case "approved": return <FiCheck className="h-4 w-4" />;
      case "shipped_to_seller": return <FiTruck className="h-4 w-4" />;
      case "payment_sent": return <FiDollarSign className="h-4 w-4" />;
      case "rejected": return <FiX className="h-4 w-4" />;
      case "sold": return <FiPackage className="h-4 w-4" />;
      default: return <FiClock className="h-4 w-4" />;
    }
  };

  const getPaymentStatus = (listing: UserListing) => {
    if (listing.paymentSent) {
      return {
        text: `Paid $${listing.paymentAmount?.toFixed(2) || '0.00'}`,
        color: "bg-green-100 text-green-800",
        icon: <FiDollarSign className="h-4 w-4" />
      };
    } else if (listing.status === "approved" || listing.status === "shipped_to_seller") {
      return {
        text: "Payment Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: <FiClock className="h-4 w-4" />
      };
    }
    return {
      text: "Not Applicable",
      color: "bg-gray-100 text-gray-800",
      icon: <FiClock className="h-4 w-4" />
    };
  };

  const getShippingStatus = (listing: UserListing) => {
    if (listing.trackingNumber) {
      return {
        text: `${listing.carrier?.toUpperCase()}: ${listing.trackingNumber}`,
        color: "bg-blue-100 text-blue-800",
        icon: <FiTruck className="h-4 w-4" />
      };
    } else if (listing.shippingLabelSent) {
      return {
        text: "Label Sent",
        color: "bg-purple-100 text-purple-800",
        icon: <FiTruck className="h-4 w-4" />
      };
    }
    return {
      text: "Not Shipped",
      color: "bg-gray-100 text-gray-800",
      icon: <FiClock className="h-4 w-4" />
    };
  };

  if (!isVisible) return null;

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">My Submissions</h2>
            <p className="mt-1 text-indigo-100 max-w-2xl">
              Track the status of your item submissions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-indigo-500 bg-opacity-30 rounded-full flex items-center justify-center">
                <FiList className="h-8 w-8 text-white" />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-indigo-500 transition-colors"
            >
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {isLoadingListings ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : userListings.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No submissions yet</h3>
            <p className="mt-1 text-gray-500">
              You haven't submitted any items for sale yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listing Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items & Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userListings.map((listing) => {
                  const paymentStatus = getPaymentStatus(listing);
                  const shippingStatus = getShippingStatus(listing);
                  
                  return (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                        <div className="text-sm text-gray-500">ID: {listing.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                          {getStatusIcon(listing.status)}
                          <span className="ml-1">{getStatusText(listing.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{listing.totalItems} items</div>
                        <div className="text-sm text-gray-500">${listing.totalValue.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${paymentStatus.color}`}>
                          {paymentStatus.icon}
                          <span className="ml-1">{paymentStatus.text}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${shippingStatus.color}`}>
                          {shippingStatus.icon}
                          <span className="ml-1">{shippingStatus.text}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Submitted: {listing.createdAt?.toDate?.() ? new Date(listing.createdAt.toDate()).toLocaleDateString() : 'Unknown'}</div>
                        {listing.paymentSentAt && (
                          <div className="mt-1">Paid: {listing.paymentSentAt.toDate ? new Date(listing.paymentSentAt.toDate()).toLocaleDateString() : 'Unknown'}</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}