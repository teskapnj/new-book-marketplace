// app/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { sanitizeInput } from '@/lib/auth-utils';
import { auth, db, storage } from "@/lib/firebase";
import { useRateLimit } from '@/hooks/useRateLimit';
import { RateLimitWarning } from '@/components/RateLimitWarning';

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  getDoc,
  Timestamp,
  getDocs,
  addDoc,
  writeBatch
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

// Type definitions
interface OrderItem {
  id: string;
  productId: string;
  sellerId: string;
  title: string;
  price: number;
  image?: string;
  shippingCost: number;
}

interface VendorOrderBreakdown {
  sellerId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  itemCount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  subtotal: number;
  shippingTotal: number;
  marketplaceFee: number;
  taxTotal: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
  vendorBreakdown: VendorOrderBreakdown[];
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  orderDate: string;
  adminNotes?: string;
  // Tracking alanları eklendi
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  shippedAt?: Timestamp | Date;
  trackingStatus?: string;
  statusDetails?: string;
  trackingHistory?: any[];
  lastTracked?: Timestamp | Date;
}

// Message Notification Component
const MessageNotification = () => {
  const [user] = useAuthState(auth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkAdminStatus = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
          setError('Admin access required');
          return;
        }

        const messagesRef = collection(db, 'contact_messages');
        const q = query(messagesRef, where('status', '==', 'unread'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setUnreadCount(snapshot.size);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching unread messages:', error);
          if (error.code === 'permission-denied') {
            setError('Permission denied. Please contact administrator.');
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error checking admin status:', error);
        setError('Error verifying admin status');
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (error) {
    return (
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center">
          <span className="text-red-600 text-xs">!</span>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white text-xs rounded whitespace-nowrap">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <Link
      href="/admin/messages"
      className="relative inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      title={`${unreadCount} unread messages`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[20px]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

// Orders Navigation Component
const OrdersNavigation = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      setOrderCount(snapshot.size);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders count:', error);
      if (error.code === 'permission-denied') {
        setError('Permission denied');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (error) {
    return (
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center">
          <span className="text-red-600 text-xs">!</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <Link
      href="/admin/orders"
      className="relative inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      title={`${orderCount} orders`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 01-8 0v4M5 9h14l1 12M4 6h16M4 6h16" />
      </svg>

      {orderCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full min-w-[20px]">
          {orderCount > 99 ? '99+' : orderCount}
        </span>
      )}
    </Link>
  );
};

// Order Detail Modal Component
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string, notes: string) => Promise<void>;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState(order.adminNotes || "");
  const [isProcessing, setIsProcessing] = useState(false);

  // Yeni state'ler tracking için
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("usps");
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [trackingSuccess, setTrackingSuccess] = useState("");

  const handleUpdateStatus = async () => {
    setIsProcessing(true);
    try {
      await onUpdateStatus(order.id, status, notes);
      onClose();
    } catch (error: any) {
      console.error("Error updating order:", error);
      if (error.code === 'permission-denied') {
        alert("You don't have permission to update this order. Please contact administrator.");
      } else {
        alert("Failed to update order status: " + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Tracking ekleme fonksiyonu
  const handleAddTracking = async () => {
    if (!trackingNumber.trim()) {
      setTrackingError("Tracking number is required");
      return;
    }

    setTrackingLoading(true);
    setTrackingError("");
    setTrackingSuccess("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setTrackingError("You must be logged in to add tracking information");
        return;
      }

      console.log("Mevcut kullanıcı:", user.email);

      const token = await user.getIdToken();
      console.log("Token alındı:", token.substring(0, 20) + "...");

      const response = await fetch(`/api/orders/${order.id}/add-tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber,
          carrier: carrier
        })
      });

      console.log("İstek gönderildi. Status:", response.status);

      const data = await response.json();

      if (response.ok) {
        setTrackingSuccess(`Tracking added successfully! ${data.emailSent ? 'Email sent.' : ''}`);
        setTrackingNumber("");
        setShowTrackingForm(false);

        // Modal'ı kapat - real-time listener güncel data'yı alacak
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setTrackingError(data.error || "Failed to add tracking information");
      }
    } catch (error) {
      console.error("Takip ekleme hatası:", error);
      setTrackingError("Network error. Please try again.");
    } finally {
      setTrackingLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp | Date | undefined): string => {
    if (!timestamp) return "N/A";
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Order Details: {order.orderNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Order information */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Order Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Customer:</strong> {order.customerInfo.fullName || "N/A"}</p>
                <p><strong>Email:</strong> {order.customerInfo.email}</p>
                <p><strong>Phone:</strong> {order.customerInfo.phone || "N/A"}</p>
                <p><strong>Created:</strong> {formatDate(order.createdAt)}</p>
                <p><strong>Last Updated:</strong> {formatDate(order.updatedAt)}</p>
                <p><strong>Status:</strong> {getOrderStatusBadge(order.status)}</p>

                {/* Tracking bilgisi varsa göster */}
                {order.trackingNumber && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                    <p><strong>Carrier:</strong> {order.carrier?.toUpperCase() || "N/A"}</p>
                    {order.trackingUrl && (
                      <p>
                        <strong>Tracking URL:</strong>
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          Track Package
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.street1}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Order Items ({order.items.length})
              </h4>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {order.items.map((item: OrderItem, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">📦</span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span className="text-gray-600">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {item.productId} • Seller: {item.sellerId}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Admin actions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Order['status'])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Tracking Ekleme Bölümü */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900">Shipping Information</h4>
                {!order.trackingNumber && (
                  <button
                    onClick={() => setShowTrackingForm(!showTrackingForm)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showTrackingForm ? "Cancel" : "Add Tracking"}
                  </button>
                )}
              </div>

              {order.trackingNumber ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tracking Number:</span>
                    <span className="text-sm">{order.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Carrier:</span>
                    <span className="text-sm">{order.carrier?.toUpperCase()}</span>
                  </div>
                  {order.trackingUrl && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tracking URL:</span>
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View
                      </a>
                    </div>
                  )}
                </div>
              ) : showTrackingForm ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="Enter tracking number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Carrier
                    </label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="usps">USPS</option>
                      <option value="fedex">FedEx</option>
                      <option value="ups">UPS</option>
                      <option value="dhl">DHL</option>
                      <option value="shippo">Shippo Test</option>
                    </select>
                  </div>

                  {/* Hata ve başarı mesajları */}
                  {trackingError && (
                    <div className="text-red-600 text-xs bg-red-50 p-2 rounded">
                      {trackingError}
                    </div>
                  )}

                  {trackingSuccess && (
                    <div className="text-green-600 text-xs bg-green-50 p-2 rounded">
                      {trackingSuccess}
                    </div>
                  )}

                  <button
                    onClick={handleAddTracking}
                    disabled={trackingLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                  >
                    {trackingLoading ? "Adding..." : "Add Tracking"}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No tracking information added yet.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(sanitizeInput(e.target.value))}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about this order..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${order.shippingTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Marketplace Fee:</span>
                  <span>${order.marketplaceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Vendor Breakdown</h4>
              <div className="space-y-2 text-sm">
                {order.vendorBreakdown.map((vendor: VendorOrderBreakdown, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{vendor.sellerId} ({vendor.itemCount} items):</span>
                    <span>${(vendor.subtotal + vendor.shippingCost).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Updating..." : "Update Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for order status badge
const getOrderStatusBadge = (status: Order['status']) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200"
  };

  const icons = {
    pending: "⏳",
    confirmed: "✅",
    processing: "🔄",
    shipped: "🚚",
    delivered: "✅",
    cancelled: "❌"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
      {icons[status]} <span className="ml-1 capitalize">{status}</span>
    </span>
  );
};

// Import SellerManagement component
import SellerManagement from '@/components/SellerManagement';

export default function AdminListingsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const adminRateLimit = useRateLimit({
    maxAttempts: 15, // 15 admin aksiyonu
    windowMs: 60 * 1000, // 1 dakika içinde
    storageKey: 'admin-actions'
  });
  // Rate limit kontrolü için helper function
  const checkRateLimit = (actionName: string): boolean => {
    if (adminRateLimit.isBlocked) {
      alert(`Too many admin actions. Please wait ${Math.ceil(adminRateLimit.remainingTime / 60)} minutes before ${actionName}.`);
      return false;
    }
    return true;
  };

  // 📊 State management
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "sellers">("listings");

  // 🆕 Yeni state'ler - shipping label ve tracking için
  const [shippingLabel, setShippingLabel] = useState<File | null>(null);
  const [shippingLabelPreview, setShippingLabelPreview] = useState<string | null>(null);
  const [uploadingLabel, setUploadingLabel] = useState(false);
  const [labelUploadError, setLabelUploadError] = useState("");
  const [labelUploadSuccess, setLabelUploadSuccess] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("usps");

  // 📄 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 🆕 Yeni state'ler - toplu seçim ve silme için
  const [selectedListings, setSelectedListings] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Payment için state'ler
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentTransactionId, setPaymentTransactionId] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");

  // 🔐 Admin Authentication Check
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!loading && !user) {
        router.push("/login");
        return;
      }

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data()?.role === 'admin') {
            setIsAdmin(true);
          } else {
            setPermissionError("Admin access required. You don't have permission to access this page.");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setPermissionError("Error verifying admin permissions.");
        } finally {
          setCheckingAdmin(false);
        }
      }
    };

    checkAdminStatus();
  }, [user, loading, router]);

  // 🔥 Real-time Firebase listener for listings
  useEffect(() => {
    if (!user || !isAdmin || activeTab !== "listings") return;

    let unsubscribe: () => void;

    const setupListener = () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("createdAt", "desc"));

        unsubscribe = onSnapshot(q,
          (querySnapshot) => {
            const listingsData: any[] = [];

            querySnapshot.forEach((docSnapshot) => {
              const data = docSnapshot.data();

              listingsData.push({
                id: docSnapshot.id,
                title: data.title || "Untitled Bundle",
                totalItems: data.totalItems || 0,
                totalValue: data.totalValue || 0,
                totalAmazonValue: data.totalAmazonValue || 0, // Amazon toplam fiyatı
                shippingInfo: data.shippingInfo || null,
                status: data.status || "pending",
                vendorId: data.vendorId,
                vendorName: data.vendorName || "Unknown Seller",
                vendorEmail: data.vendorEmail || "", // Seller email
                bundleItems: data.bundleItems || [],
                description: data.description || "",
                createdAt: data.createdAt?.toDate() || new Date(),
                submittedDate: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
                reviewedDate: data.reviewedDate,
                rejectionReason: data.rejectionReason,
                adminNotes: data.adminNotes,
                views: data.views || 0,
                // Yeni alanlar eklendi
                shippingLabelUrl: data.shippingLabelUrl || null,
                trackingNumber: data.trackingNumber || null,
                carrier: data.carrier || null,
                paymentSent: data.paymentSent || false,
                paymentAmount: data.paymentAmount || null,
                paymentTransactionId: data.paymentTransactionId || null,
                paymentNotes: data.paymentNotes || null,
                paymentSentAt: data.paymentSentAt || null,
                paymentSentBy: data.paymentSentBy || null
              });
            });

            setListings(listingsData);
            setLoadingListings(false);
            console.log(`✅ Loaded ${listingsData.length} listings from Firebase`);
          },
          (error) => {
            console.error("Error fetching listings:", error);
            if (error.code === 'permission-denied') {
              setPermissionError("You don't have permission to access listings. Please contact administrator.");
            }

            if (error.code === 'failed-precondition') {
              console.log("Index not found, trying fallback query...");
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
                    totalAmazonValue: data.totalAmazonValue || 0, // Amazon toplam fiyatı
                    shippingInfo: data.shippingInfo || null,
                    status: data.status || "pending",
                    vendorId: data.vendorId,
                    vendorName: data.vendorName || "Unknown Seller",
                    vendorEmail: data.vendorEmail || "", // Seller email
                    bundleItems: data.bundleItems || [],
                    description: data.description || "",
                    createdAt: data.createdAt?.toDate() || new Date(),
                    submittedDate: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
                    reviewedDate: data.reviewedDate,
                    rejectionReason: data.rejectionReason,
                    adminNotes: data.adminNotes,
                    views: data.views || 0,
                    // Yeni alanlar eklendi
                    shippingLabelUrl: data.shippingLabelUrl || null,
                    trackingNumber: data.trackingNumber || null,
                    carrier: data.carrier || null,
                    paymentSent: data.paymentSent || false,
                    paymentAmount: data.paymentAmount || null,
                    paymentTransactionId: data.paymentTransactionId || null,
                    paymentNotes: data.paymentNotes || null,
                    paymentSentAt: data.paymentSentAt || null,
                    paymentSentBy: data.paymentSentBy || null
                  });
                });

                listingsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setListings(listingsData);
                setLoadingListings(false);
                console.log(`✅ Loaded ${listingsData.length} listings (fallback mode)`);
              });
            } else {
              setLoadingListings(false);
            }
          }
        );
      } catch (error) {
        console.error("Error setting up listener:", error);
        setLoadingListings(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, isAdmin, activeTab]);

  // 🔥 Real-time Firebase listener for orders
  useEffect(() => {
    if (!user || !isAdmin || activeTab !== "orders") return;

    let unsubscribe: () => void;

    const setupOrdersListener = () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));

        unsubscribe = onSnapshot(q,
          (querySnapshot) => {
            const ordersData: Order[] = [];

            querySnapshot.forEach((docSnapshot) => {
              const data = docSnapshot.data();

              ordersData.push({
                id: docSnapshot.id,
                orderNumber: data.orderNumber || "",
                totalAmount: data.totalAmount || 0,
                subtotal: data.subtotal || 0,
                shippingTotal: data.shippingTotal || 0,
                marketplaceFee: data.marketplaceFee || 0,
                taxTotal: data.taxTotal || 0,
                status: data.status || "pending",
                shippingAddress: data.shippingAddress || {},
                customerInfo: data.customerInfo || {},
                items: data.items || [],
                vendorBreakdown: data.vendorBreakdown || [],
                createdAt: data.createdAt || new Date(),
                updatedAt: data.updatedAt || new Date(),
                orderDate: data.createdAt?.toDate?.().toLocaleDateString() || new Date().toLocaleDateString(),
                adminNotes: data.adminNotes || "",
                // Tracking alanları eklendi
                trackingNumber: data.trackingNumber,
                carrier: data.carrier,
                trackingUrl: data.trackingUrl,
                shippedAt: data.shippedAt,
                trackingStatus: data.trackingStatus,
                statusDetails: data.statusDetails,
                trackingHistory: data.trackingHistory,
                lastTracked: data.lastTracked
              });
            });

            setOrders(ordersData);
            setLoadingOrders(false);
            console.log(`✅ Loaded ${ordersData.length} orders from Firebase`);
          },
          (error) => {
            console.error("Error fetching orders:", error);
            if (error.code === 'permission-denied') {
              setPermissionError("You don't have permission to access orders. Please contact administrator.");
            }

            if (error.code === 'failed-precondition') {
              console.log("Index not found, trying fallback query...");
              const fallbackQuery = collection(db, "orders");

              unsubscribe = onSnapshot(fallbackQuery, (querySnapshot) => {
                const ordersData: Order[] = [];

                querySnapshot.forEach((docSnapshot) => {
                  const data = docSnapshot.data();

                  ordersData.push({
                    id: docSnapshot.id,
                    orderNumber: data.orderNumber || "",
                    totalAmount: data.totalAmount || 0,
                    subtotal: data.subtotal || 0,
                    shippingTotal: data.shippingTotal || 0,
                    marketplaceFee: data.marketplaceFee || 0,
                    taxTotal: data.taxTotal || 0,
                    status: data.status || "pending",
                    shippingAddress: data.shippingAddress || {},
                    customerInfo: data.customerInfo || {},
                    items: data.items || [],
                    vendorBreakdown: data.vendorBreakdown || [],
                    createdAt: data.createdAt || new Date(),
                    updatedAt: data.updatedAt || new Date(),
                    orderDate: data.createdAt?.toDate?.().toLocaleDateString() || new Date().toLocaleDateString(),
                    adminNotes: data.adminNotes || "",
                    // Tracking alanları eklendi
                    trackingNumber: data.trackingNumber,
                    carrier: data.carrier,
                    trackingUrl: data.trackingUrl,
                    shippedAt: data.shippedAt,
                    trackingStatus: data.trackingStatus,
                    statusDetails: data.statusDetails,
                    trackingHistory: data.trackingHistory,
                    lastTracked: data.lastTracked
                  });
                });

                ordersData.sort((a, b) => {
                  const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
                  const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
                  return dateB.getTime() - dateA.getTime();
                });

                setOrders(ordersData);
                setLoadingOrders(false);
                console.log(`✅ Loaded ${ordersData.length} orders (fallback mode)`);
              });
            } else {
              setLoadingOrders(false);
            }
          }
        );
      } catch (error) {
        console.error("Error setting up orders listener:", error);
        setLoadingOrders(false);
      }
    };

    setupOrdersListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, isAdmin, activeTab]);

  // 📈 Computed values for listings
  const pendingListings = listings.filter(l => l.status === "pending");
  const approvedListings = listings.filter(l => l.status === "approved");
  const rejectedListings = listings.filter(l => l.status === "rejected");

  // 📈 Computed values for orders
  const pendingOrders = orders.filter(o => o.status === "pending");
  const confirmedOrders = orders.filter(o => o.status === "confirmed");
  const processingOrders = orders.filter(o => o.status === "processing");
  const shippedOrders = orders.filter(o => o.status === "shipped");
  const deliveredOrders = orders.filter(o => o.status === "delivered");
  const cancelledOrders = orders.filter(o => o.status === "cancelled");

  // 🔍 Filtering and search logic for listings
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

  // 🔍 Filtering and search logic for orders
  let filteredOrders = orders;

  if (orderFilterStatus !== "all") {
    filteredOrders = filteredOrders.filter(order => order.status === orderFilterStatus);
  }

  if (orderSearchTerm) {
    filteredOrders = filteredOrders.filter(order =>
      order.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (order.customerInfo.fullName && order.customerInfo.fullName.toLowerCase().includes(orderSearchTerm.toLowerCase()))
    );
  }

  // 📄 Pagination calculations for listings
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredListings.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // 📄 Pagination calculations for orders
  const indexOfLastOrder = orderCurrentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const orderPageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / itemsPerPage); i++) {
    orderPageNumbers.push(i);
  }

  // 🆕 Yeni fonksiyonlar - toplu seçim ve silme için

  // Tümünü seç / seçimi kaldır
  const toggleSelectAll = () => {
    if (selectAll) {
      // Tüm seçimleri kaldır
      setSelectedListings(new Set());
    } else {
      // Tümünü seç
      const allIds = new Set(currentItems.map(item => item.id));
      setSelectedListings(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Tekil seçim toggle
  const toggleListingSelection = (listingId: string) => {
    const newSelected = new Set(selectedListings);
    if (newSelected.has(listingId)) {
      newSelected.delete(listingId);
    } else {
      newSelected.add(listingId);
    }
    setSelectedListings(newSelected);

    // Tümü seçili mi kontrol et
    const allCurrentSelected = currentItems.every(item => newSelected.has(item.id));
    setSelectAll(allCurrentSelected && newSelected.size > 0);
  };

  // Toplu silme
  const bulkDeleteListings = async () => {
    if (selectedListings.size === 0) {
      alert("No listings selected for deletion");
      return;
    }

    // Rate limit kontrolü
    if (!checkRateLimit('bulk deleting listings')) return;

    adminRateLimit.recordAttempt();
    setIsBulkDeleting(true);

    try {
      const batch = writeBatch(db);

      selectedListings.forEach(listingId => {
        const listingRef = doc(db, "listings", listingId);
        batch.delete(listingRef);
      });

      await batch.commit();

      console.log(`🗑️ Deleted ${selectedListings.size} listings in bulk`);

      setSelectedListings(new Set());
      setSelectAll(false);
      setShowBulkDeleteConfirm(false);

      alert(`✅ Successfully deleted ${selectedListings.size} listings!`);
    } catch (error: any) {
      console.error("Error bulk deleting listings:", error);
      if (error.code === 'permission-denied') {
        alert("You don't have permission to delete listings. Please contact administrator.");
      } else {
        alert(`❌ Error occurred while deleting listings: ${error.message}`);
      }
    }

    setIsBulkDeleting(false);
  };


  // Tekil silme
  const deleteSingleListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return;
    }

    try {
      const listingRef = doc(db, "listings", listingId);
      await deleteDoc(listingRef);

      console.log(`🗑️ Listing ${listingId} deleted`);

      alert("✅ Listing deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      if (error.code === 'permission-denied') {
        alert("You don't have permission to delete listings. Please contact administrator.");
      } else {
        alert(`❌ Error occurred while deleting listing: ${error.message}`);
      }
    }
  };

  // ✅ Approve listing only - GÜNCELLENDİ
  const approveListingOnly = async (listingId: string) => {
    // Rate limit kontrolü
    if (!checkRateLimit('approving listings')) return;

    adminRateLimit.recordAttempt();
    setIsProcessing(true);

    try {
      const listingRef = doc(db, "listings", listingId);

      await updateDoc(listingRef, {
        status: "approved",
        reviewedDate: serverTimestamp(),
        reviewedBy: user?.email || "admin",
        adminNotes: sanitizeInput(adminNotes) // Sanitize eklendi
      });

      console.log(`✅ Listing ${listingId} approved by ${user?.email}`);

      setAdminNotes("");

      if (selectedListing && selectedListing.id === listingId) {
        setSelectedListing({
          ...selectedListing,
          status: "approved",
          reviewedDate: new Date(),
          reviewedBy: user?.email || "admin"
        });
      }

      alert("✅ Listing approved successfully! You can now send the shipping label and tracking information.");

    } catch (error: any) {
      console.error("Error approving listing:", error);
      if (error.code === 'permission-denied') {
        alert("You don't have permission to approve listings. Please contact administrator.");
      } else {
        alert("❌ Error occurred while approving listing: " + error.message);
      }
    }

    setIsProcessing(false);
  };
  // Payment kaydetme fonksiyonu
  const recordPaymentSent = async (listingId: string) => {
    if (!paymentAmount.trim() || parseFloat(paymentAmount) <= 0) {
      setPaymentError("Please enter a valid payment amount");
      return;
    }

    if (!paymentTransactionId.trim()) {
      setPaymentError("Please enter PayPal transaction ID");
      return;
    }

    // Rate limit kontrolü
    if (!checkRateLimit('recording payments')) return;

    adminRateLimit.recordAttempt();
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentSuccess("");

    try {
      const amount = parseFloat(paymentAmount);

      // Update listing with payment info
      const listingRef = doc(db, "listings", listingId);
      await updateDoc(listingRef, {
        paymentSent: true,
        paymentAmount: amount,
        paymentTransactionId: sanitizeInput(paymentTransactionId),
        paymentNotes: sanitizeInput(paymentNotes),
        paymentSentAt: serverTimestamp(),
        paymentSentBy: user?.email || "admin",
        paymentStatus: "sent",
        paymentMethod: "paypal_manual"
      });

      // Update selected listing state to reflect the change immediately
      setSelectedListing({
        ...selectedListing,
        paymentSent: true,
        paymentAmount: amount,
        paymentTransactionId: paymentTransactionId,
        paymentNotes: paymentNotes,
        paymentSentAt: new Date(),
        paymentSentBy: user?.email || "admin"
      });

      // Get seller info for email
      const listingDoc = await getDoc(listingRef);
      const sellerEmail = listingDoc.data()?.vendorEmail;

      if (sellerEmail) {
        // Send payment notification email
        const emailResponse = await fetch('/api/send-payment-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: sellerEmail,
            listingTitle: selectedListing.title,
            paymentAmount: amount,
            transactionId: paymentTransactionId,
            listingId: listingId,
            sellerName: selectedListing.vendorName,
            notes: paymentNotes
          }),
        });

        console.log("Email notification sent to seller");
      }

      // Clear form data
      setPaymentAmount("");
      setPaymentTransactionId("");
      setPaymentNotes("");

    } catch (error: any) {
      console.error("Error recording payment:", error);
      setPaymentError("Failed to record payment: " + error.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  // 📦 Send shipping label and tracking - YENİ FONKSİYON
  const sendShippingLabelAndTracking = async (listingId: string) => {
    // File validation
    if (!shippingLabel) {
      alert("Please upload a shipping label");
      return;
    }

    // Gelişmiş dosya güvenlik kontrolü
    const validateFile = async (file: File): Promise<boolean> => {
      // Dosya boyutu kontrolü (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Dosya boyutu çok büyük (max 10MB)');
      }

      // MIME type kontrolü
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('İzin verilmeyen dosya türü');
      }

      // Dosya imzası kontrolü (magic numbers)
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer.slice(0, 4));
      const hex = Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('');

      const validSignatures: Record<string, string> = {
        'ffd8ffe0': 'image/jpeg',
        'ffd8ffe1': 'image/jpeg',
        '89504e47': 'image/png',
        '25504446': 'application/pdf'
      };

      if (!validSignatures[hex]) {
        throw new Error('Dosya imzası geçersiz');
      }

      return true;
    };

    // Dosya kontrolü yap
    try {
      await validateFile(shippingLabel);
    } catch (error: any) {
      alert(error.message);
      return;
    }

    // File size kontrolü (max 10MB)
    if (shippingLabel.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Tracking number validation
    const sanitizedTracking = sanitizeInput(trackingNumber);
    if (!sanitizedTracking.trim() || sanitizedTracking.length < 5) {
      alert("Please provide a valid tracking number (minimum 5 characters)");
      return;
    }

    // Rate limit kontrolü
    if (!checkRateLimit('uploading shipping labels')) return;

    adminRateLimit.recordAttempt();

    setIsProcessing(true);
    setUploadingLabel(true);
    setLabelUploadError("");
    setLabelUploadSuccess("");

    try {
      // Filename sanitization
      const fileExtension = shippingLabel.name.split('.').pop();
      const sanitizedFileName = `${listingId}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `shipping-labels/${sanitizedFileName}`);

      await uploadBytes(storageRef, shippingLabel);
      const shippingLabelUrl = await getDownloadURL(storageRef);

      const listingRef = doc(db, "listings", listingId);

      await updateDoc(listingRef, {
        shippingLabelUrl: shippingLabelUrl,
        trackingNumber: sanitizedTracking,
        carrier: sanitizeInput(carrier),
        shippingLabelName: sanitizedFileName,
        shippingLabelType: shippingLabel.type
      });

      // Get seller's email
      const listingDoc = await getDoc(listingRef);
      const sellerId = listingDoc.data()?.vendorId;

      if (sellerId) {
        const sellerDoc = await getDoc(doc(db, 'users', sellerId));
        const sellerEmail = sellerDoc.data()?.email;

        if (sellerEmail) {
          // Send email with shipping label and tracking info
          const emailResponse = await fetch('/api/send-shipping-label-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: sellerEmail,
              listingTitle: selectedListing.title,
              shippingLabelUrl: shippingLabelUrl,
              trackingNumber: trackingNumber,
              carrier: carrier,
              listingId: listingId
            }),
          });

          if (emailResponse.ok) {
            console.log(`📧 Email sent to ${sellerEmail} with shipping label and tracking info`);
          } else {
            console.error("Failed to send email");
          }
        }
      }

      setLabelUploadSuccess("Shipping label and tracking sent successfully!");

      // Reset form
      setShippingLabel(null);
      setShippingLabelPreview(null);
      setTrackingNumber("");
      setCarrier("usps");

      // Close modal after a short delay
      setTimeout(() => {
        setSelectedListing(null);
      }, 2000);

    } catch (error: any) {
      console.error("Error sending shipping label and tracking:", error);
      let errorMessage = "Error occurred while sending shipping label and tracking";

      if (error.code === 'storage/unauthorized') {
        errorMessage = "You don't have permission to upload files. Please check your Firebase Storage rules.";
      } else if (error.code === 'storage/canceled') {
        errorMessage = "Upload was canceled.";
      } else if (error.code === 'storage/unknown') {
        errorMessage = "An unknown error occurred during upload.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setLabelUploadError(errorMessage);
      alert("❌ " + errorMessage);
    } finally {
      setIsProcessing(false);
      setUploadingLabel(false);
    }
  };

  // ❌ Reject listing function
  const rejectListing = async (listingId: string) => {
    if (!sanitizeInput(rejectionReason).trim()) {
      alert("⚠️ Please provide a rejection reason");
      return;
    }

    // Rate limit kontrolü
    if (!checkRateLimit('rejecting listings')) return;

    adminRateLimit.recordAttempt();
    setIsProcessing(true);

    try {
      const listingRef = doc(db, "listings", listingId);

      await updateDoc(listingRef, {
        status: "rejected",
        reviewedDate: serverTimestamp(),
        reviewedBy: user?.email || "admin",
        rejectionReason: sanitizeInput(rejectionReason), // Sanitize eklendi
        adminNotes: sanitizeInput(adminNotes) // Sanitize eklendi
      });

      console.log(`❌ Listing ${listingId} rejected by ${user?.email}`);

      setSelectedListing(null);
      setRejectionReason("");
      setAdminNotes("");

      alert("❌ Listing rejected successfully!");

    } catch (error: any) {
      console.error("Error rejecting listing:", error);
      if (error.code === 'permission-denied') {
        alert("You don't have permission to reject listings. Please contact administrator.");
      } else {
        alert("❌ Error occurred while rejecting listing: " + error.message);
      }
    }

    setIsProcessing(false);
  };
  // 🗑️ Delete listing function
  const deleteListing = async (listingId: string) => {
    // Rate limit kontrolü
    if (!checkRateLimit('deleting listings')) return;

    adminRateLimit.recordAttempt();
    setIsProcessing(true);

    try {
      const listingRef = doc(db, "listings", listingId);
      await deleteDoc(listingRef);

      console.log(`🗑️ Listing ${listingId} deleted by ${user?.email}`);

      setSelectedListing(null);
      setShowDeleteConfirm(false);

      alert("🗑️ Listing deleted successfully!");

    } catch (error: any) {
      console.error("Error deleting listing:", error);
      if (error.code === 'permission-denied') {
        alert("You don't have permission to delete listings. Please contact administrator.");
      } else {
        alert("❌ Error occurred while deleting listing: " + error.message);
      }
    }

    setIsProcessing(false);
  };


  // 🔄 Update order status function
  const updateOrderStatus = async (orderId: string, status: string, notes: string) => {
    // Rate limit kontrolü
    if (!checkRateLimit('updating orders')) return;

    adminRateLimit.recordAttempt();
    setIsProcessing(true);

    try {
      const orderRef = doc(db, "orders", orderId);

      await updateDoc(orderRef, {
        status: status,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email || "admin",
        adminNotes: sanitizeInput(notes) // Sanitize eklendi
      });

      console.log(`🔄 Order ${orderId} status updated to ${status} by ${user?.email}`);

      alert(`✅ Order status updated to ${status} successfully!`);

    } catch (error: any) {
      console.error("Error updating order status:", error);
      if (error.code === 'permission-denied') {
        alert("You don't have permission to update orders. Please contact administrator.");
      } else {
        alert("❌ Error occurred while updating order status: " + error.message);
      }
      throw error;
    }

    setIsProcessing(false);
  };

  // 🎨 Helper functions
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      sold: "bg-purple-100 text-purple-800 border-purple-200"
    };
    const icons = { pending: "⏳", approved: "✅", rejected: "❌", sold: "💰" };

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
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Permission error state
  if (permissionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{permissionError}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please login with an admin account to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Rate limit warning - BURAYA */}
      <RateLimitWarning
        isBlocked={adminRateLimit.isBlocked}
        remainingTime={adminRateLimit.remainingTime}
        attempts={adminRateLimit.attempts}
        maxAttempts={15}
      />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* 🏠 Navigation Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Admin Info & Notifications */}
          <div className="flex items-center space-x-4">
            <MessageNotification />
            <OrdersNavigation />
            <div className="text-sm text-gray-600">
              Logged in as: <span className="font-medium">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* 📊 Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage listings, orders and sellers in real-time</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("listings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "listings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Listings
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "orders"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab("sellers")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "sellers"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                Sellers
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "listings" && (
          <>
            {/* Quick Actions Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                  <Link
                    href="/admin/messages"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    💬 Manage Messages
                  </Link>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Real-time updates enabled</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
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
                    <option value="sold">💰 Sold ({listings.filter(l => l.status === "sold").length})</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 📈 Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-400">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">💰</div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{listings.filter(l => l.status === "sold").length}</p>
                    <p className="text-sm text-gray-600">Sold</p>
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

            {/* 🆕 Toplu İşlem Butonları */}
            {selectedListings.size > 0 && (
              <div className="bg-blue-50 rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-blue-800 font-medium">
                    {selectedListings.size} listing{selectedListings.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedListings(new Set());
                      setSelectAll(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={() => setShowBulkDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    🗑️ Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* 📋 Listings Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Listings ({filteredListings.length})
                </h3>
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredListings.length)} of {filteredListings.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* 🆕 Checkbox sütunu eklendi */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </th>
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
                        Shipping
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
                        {/* 🆕 Checkbox eklendi */}
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedListings.has(listing.id)}
                            onChange={() => toggleListingSelection(listing.id)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </td>

                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {listing.id}
                            </div>
                            {/* Tracking bilgisi varsa göster */}
                            {listing.trackingNumber && (
                              <div className="text-xs text-blue-600 mt-1">
                                📦 {listing.trackingNumber} ({listing.carrier})
                              </div>
                            )}
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
                          <div className="text-sm text-gray-900">
                            🚚 Shipping Info
                          </div>
                          <div className="text-sm text-gray-500">
                            {listing.shippingInfo ? "Provided" : "Not provided"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {getStatusBadge(listing.status)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {listing.submittedDate}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedListing(listing);
                                // Reset form states
                                setShippingLabel(null);
                                setShippingLabelPreview(null);
                                setTrackingNumber("");
                                setCarrier("usps");
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              👁️ Review
                            </button>
                          </div>
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
            </div>

            {/* 🆕 Toplu Silme Onay Modalı */}
            {showBulkDeleteConfirm && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Confirm Bulk Deletion</h3>
                    <button
                      onClick={() => setShowBulkDeleteConfirm(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Are you sure you want to delete <strong>{selectedListings.size}</strong> listing{selectedListings.size !== 1 ? 's' : ''}?
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-red-800 text-sm">
                        This action cannot be undone. All selected listings will be permanently deleted.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowBulkDeleteConfirm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={bulkDeleteListings}
                      disabled={isBulkDeleting}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isBulkDeleting ? "Deleting..." : "Delete Listings"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "orders" && (
          <>
            {/* Quick Actions Bar for Orders */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">Order Management</h3>
                  <Link
                    href="/admin/messages"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    💬 Manage Messages
                  </Link>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Real-time updates enabled</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 🔍 Search and Filter Controls for Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                  <input
                    type="text"
                    placeholder="Search by order number, ID, customer..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <select
                    value={orderFilterStatus}
                    onChange={(e) => {
                      setOrderFilterStatus(e.target.value);
                      setOrderCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status ({orders.length})</option>
                    <option value="pending">⏳ Pending ({pendingOrders.length})</option>
                    <option value="confirmed">✅ Confirmed ({confirmedOrders.length})</option>
                    <option value="processing">🔄 Processing ({processingOrders.length})</option>
                    <option value="shipped">🚚 Shipped ({shippedOrders.length})</option>
                    <option value="delivered">✅ Delivered ({deliveredOrders.length})</option>
                    <option value="cancelled">❌ Cancelled ({cancelledOrders.length})</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 📈 Order Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-400">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">⏳</div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">✅</div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{confirmedOrders.length}</p>
                    <p className="text-sm text-gray-600">Confirmed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-400">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🔄</div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{processingOrders.length}</p>
                    <p className="text-sm text-gray-600">Processing</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-400">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🚚</div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{shippedOrders.length}</p>
                    <p className="text-sm text-gray-600">Shipped</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-400">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">✅</div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{deliveredOrders.length}</p>
                    <p className="text-sm text-gray-600">Delivered</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-400">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">❌</div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{cancelledOrders.length}</p>
                    <p className="text-sm text-gray-600">Cancelled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 📋 Orders Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Orders ({filteredOrders.length})
                </h3>
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items & Total
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
                    {currentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {order.id}
                            </div>
                            {/* Tracking bilgisi varsa göster */}
                            {order.trackingNumber && (
                              <div className="text-xs text-blue-600 mt-1">
                                📦 {order.trackingNumber} ({order.carrier})
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.customerInfo.fullName || "Guest User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerInfo.email}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            📦 {order.items.length} items
                          </div>
                          <div className="text-sm text-gray-500">
                            💰 ${order.totalAmount.toFixed(2)}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {getOrderStatusBadge(order.status)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.orderDate}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            👁️ View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty state */}
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500">
                    {orderSearchTerm || orderFilterStatus !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "No orders have been placed yet."
                    }
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredOrders.length > itemsPerPage && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setOrderCurrentPage(Math.max(1, orderCurrentPage - 1))}
                      disabled={orderCurrentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setOrderCurrentPage(Math.min(orderPageNumbers.length, orderCurrentPage + 1))}
                      disabled={orderCurrentPage === orderPageNumbers.length}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastOrder, filteredOrders.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredOrders.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setOrderCurrentPage(Math.max(1, orderCurrentPage - 1))}
                          disabled={orderCurrentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          ←
                        </button>
                        {orderPageNumbers.map(number => (
                          <button
                            key={number}
                            onClick={() => setOrderCurrentPage(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${orderCurrentPage === number
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                            {number}
                          </button>
                        ))}
                        <button
                          onClick={() => setOrderCurrentPage(Math.min(orderPageNumbers.length, orderCurrentPage + 1))}
                          disabled={orderCurrentPage === orderPageNumbers.length}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          →
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "sellers" && (
          <SellerManagement />
        )}

        {/* 🔍 Review Modal for Listings - GÜNCELLENDİ */}
        {selectedListing && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Review Listing: {selectedListing.title}
                </h3>
                <button
                  onClick={() => {
                    setSelectedListing(null);
                    setShowDeleteConfirm(false);
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
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Listing Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p><strong>ID:</strong> {selectedListing.id}</p>
                      <p><strong>Title:</strong> {selectedListing.title}</p>
                      <p><strong>Seller:</strong> {selectedListing.vendorName}</p>
                      {/* Seller Email bilgisi eklendi */}
                      {selectedListing.vendorEmail && (
                        <p><strong>Seller Email:</strong> {selectedListing.vendorEmail}</p>
                      )}
                      <p><strong>Total Items:</strong> {selectedListing.totalItems}</p>
                      <p><strong>Total Value:</strong> ${selectedListing.totalValue.toFixed(2)}</p>
                      {/* Amazon toplam fiyatı eklendi */}
                      {selectedListing.totalAmazonValue && (
                        <p><strong>Amazon Total Value:</strong> ${selectedListing.totalAmazonValue.toFixed(2)}</p>
                      )}
                      <p><strong>Submitted:</strong> {selectedListing.submittedDate}</p>
                      <p><strong>Views:</strong> {selectedListing.views}</p>
                      <p><strong>Current Status:</strong> {getStatusBadge(selectedListing.status)}</p>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      {selectedListing.description ? (
                        <p className="text-sm text-gray-700 leading-relaxed break-words overflow-hidden">
                          {selectedListing.description}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No description provided by the seller.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping Information Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h4>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      {selectedListing.shippingInfo ? (
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-purple-800 mb-1">Return Address</h5>
                            <p className="text-sm text-gray-700">
                              {selectedListing.shippingInfo.address.street}<br />
                              {selectedListing.shippingInfo.address.city}, {selectedListing.shippingInfo.address.state} {selectedListing.shippingInfo.address.zip}<br />
                              {selectedListing.shippingInfo.address.country}
                            </p>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-purple-800 mb-1">Package Dimensions</h5>
                            <p className="text-sm text-gray-700">
                              Length: {selectedListing.shippingInfo.packageDimensions.length} in<br />
                              Width: {selectedListing.shippingInfo.packageDimensions.width} in<br />
                              Height: {selectedListing.shippingInfo.packageDimensions.height} in<br />
                              Weight: {selectedListing.shippingInfo.packageDimensions.weight} lb
                            </p>
                          </div>

                          {/* PayPal Account bilgisi eklendi */}
                          {selectedListing.shippingInfo.paypalAccount && (
                            <div>
                              <h5 className="text-sm font-medium text-purple-800 mb-1">PayPal Account</h5>
                              <p className="text-sm text-gray-700">
                                {selectedListing.shippingInfo.paypalAccount}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No shipping information provided by the seller.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bundle items preview */}
                  {selectedListing.bundleItems && selectedListing.bundleItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Bundle Items ({selectedListing.bundleItems.length})
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
                  {/* For pending listings */}
                  {selectedListing.status === "pending" && (
                    <>
                      {/* 🆕 Shipping Label & Tracking Container - Always visible but disabled initially */}
                      <div className={`bg-gray-50 p-4 rounded-lg border ${selectedListing.status === "pending" ? "border-gray-200 opacity-60" : "border-blue-200"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">Shipping Label & Tracking</h4>
                          {selectedListing.status === "pending" && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              Disabled - Approve first
                            </span>
                          )}
                        </div>

                        {/* Shipping Label Upload */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Shipping Label</h5>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {shippingLabelPreview ? (
                              <div className="space-y-3">
                                <div className="flex justify-center">
                                  <img
                                    src={shippingLabelPreview}
                                    alt="Shipping label preview"
                                    className="max-h-40 object-contain"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShippingLabel(null);
                                    setShippingLabelPreview(null);
                                  }}
                                  className="text-sm text-red-600 hover:text-red-800"
                                >
                                  Remove label
                                </button>
                              </div>
                            ) : shippingLabel ? (
                              <div className="space-y-3">
                                <div className="flex flex-col items-center justify-center">
                                  <div className="text-4xl mb-2">📄</div>
                                  <div className="text-sm font-medium text-gray-900">{shippingLabel.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {(shippingLabel.size / 1024).toFixed(2)} KB
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShippingLabel(null);
                                    setShippingLabelPreview(null);
                                  }}
                                  className="text-sm text-red-600 hover:text-red-800"
                                >
                                  Remove file
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600 justify-center">
                                  <label className={`relative cursor-pointer ${selectedListing.status === "pending" ? "pointer-events-none" : "bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"}`}>
                                    <span>Upload a shipping label</span>
                                    <input
                                      type="file"
                                      className="sr-only"
                                      accept="image/*,.pdf"
                                      disabled={selectedListing.status === "pending"}
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          const file = e.target.files[0];
                                          setShippingLabel(file);

                                          if (file.type.startsWith('image/')) {
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                              setShippingLabelPreview(e.target?.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                          } else {
                                            setShippingLabelPreview(null);
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tracking Information */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Tracking Information</h5>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tracking Number
                              </label>
                              <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-100"
                                placeholder="Enter tracking number"
                                disabled={selectedListing.status === "pending"}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Carrier
                              </label>
                              <select
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-100"
                                disabled={selectedListing.status === "pending"}
                              >
                                <option value="usps">USPS</option>
                                <option value="fedex">FedEx</option>
                                <option value="ups">UPS</option>
                                <option value="dhl">DHL</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Error and success messages */}
                        {labelUploadError && (
                          <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                            {labelUploadError}
                          </div>
                        )}

                        {labelUploadSuccess && (
                          <div className="mb-4 text-green-600 text-sm bg-green-50 p-2 rounded">
                            {labelUploadSuccess}
                          </div>
                        )}

                        {/* Send button - Disabled until approved */}
                        <button
                          onClick={() => sendShippingLabelAndTracking(selectedListing.id)}
                          disabled={selectedListing.status === "pending" || isProcessing || !shippingLabel || !trackingNumber.trim()}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? "Sending..." : "📦 Send Label & Tracking"}
                        </button>
                      </div>

                      {/* Admin Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Notes
                        </label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(sanitizeInput(e.target.value))}
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add any notes about this listing..."
                        />
                      </div>

                      {/* Rejection Reason */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(sanitizeInput(e.target.value))}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Provide reason for rejection..."
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => approveListingOnly(selectedListing.id)}
                          disabled={isProcessing}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? "Processing..." : "✅ Approve Listing"}
                        </button>

                        <button
                          onClick={() => rejectListing(selectedListing.id)}
                          disabled={isProcessing || !rejectionReason.trim()}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? "Processing..." : "❌ Reject"}
                        </button>
                      </div>
                    </>
                  )}

                  {/* For approved listings without tracking */}
                  {selectedListing.status === "approved" && !selectedListing.trackingNumber && (
                    <>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">Shipping Label & Tracking</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Ready to send
                          </span>
                        </div>

                        {/* Shipping Label Upload */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Shipping Label</h5>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {shippingLabelPreview ? (
                              <div className="space-y-3">
                                <div className="flex justify-center">
                                  <img
                                    src={shippingLabelPreview}
                                    alt="Shipping label preview"
                                    className="max-h-40 object-contain"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShippingLabel(null);
                                    setShippingLabelPreview(null);
                                  }}
                                  className="text-sm text-red-600 hover:text-red-800"
                                >
                                  Remove label
                                </button>
                              </div>
                            ) : shippingLabel ? (
                              <div className="space-y-3">
                                <div className="flex flex-col items-center justify-center">
                                  <div className="text-4xl mb-2">📄</div>
                                  <div className="text-sm font-medium text-gray-900">{shippingLabel.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {(shippingLabel.size / 1024).toFixed(2)} KB
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShippingLabel(null);
                                    setShippingLabelPreview(null);
                                  }}
                                  className="text-sm text-red-600 hover:text-red-800"
                                >
                                  Remove file
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600 justify-center">
                                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                    <span>Upload a shipping label</span>
                                    <input
                                      type="file"
                                      className="sr-only"
                                      accept="image/*,.pdf"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          const file = e.target.files[0];
                                          setShippingLabel(file);

                                          if (file.type.startsWith('image/')) {
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                              setShippingLabelPreview(e.target?.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                          } else {
                                            setShippingLabelPreview(null);
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tracking Information */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Tracking Information</h5>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tracking Number
                              </label>
                              <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                placeholder="Enter tracking number"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Carrier
                              </label>
                              <select
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                              >
                                <option value="usps">USPS</option>
                                <option value="fedex">FedEx</option>
                                <option value="ups">UPS</option>
                                <option value="dhl">DHL</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Error and success messages */}
                        {labelUploadError && (
                          <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
                            {labelUploadError}
                          </div>
                        )}

                        {labelUploadSuccess && (
                          <div className="mb-4 text-green-600 text-sm bg-green-50 p-2 rounded">
                            {labelUploadSuccess}
                          </div>
                        )}

                        {/* Send button */}
                        <button
                          onClick={() => sendShippingLabelAndTracking(selectedListing.id)}
                          disabled={isProcessing || !shippingLabel || !trackingNumber.trim()}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? "Sending..." : "📦 Send Label & Tracking"}
                        </button>
                      </div>
                    </>
                  )}

                  {/* For approved and sold listings with tracking */}
                  {(selectedListing.status === "approved" || selectedListing.status === "sold") && selectedListing.trackingNumber && (
                    <>
                      {/* Shipping Label Display */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Label</h4>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-green-800">Uploaded Label</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Sent</span>
                          </div>

                          {selectedListing.shippingLabelUrl && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center">
                                {selectedListing.shippingLabelType?.includes('pdf') ? (
                                  <div className="text-center">
                                    <div className="text-4xl mb-2">📄</div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {selectedListing.shippingLabelName || "Shipping Label.pdf"}
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={selectedListing.shippingLabelUrl}
                                    alt="Shipping label"
                                    className="max-h-40 object-contain"
                                  />
                                )}
                              </div>

                              <div className="text-center">
                                <a
                                  href={selectedListing.shippingLabelUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                >
                                  View Full Label
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tracking Information Display */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Tracking Information</h4>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-blue-800">Tracking Number:</span>
                              <span className="text-sm font-mono">{selectedListing.trackingNumber}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-blue-800">Carrier:</span>
                              <span className="text-sm">{selectedListing.carrier?.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Information */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Label & Tracking Sent</h3>
                            <div className="mt-2 text-sm text-green-700">
                              <p>The shipping label and tracking information have been sent to the seller.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {/* Payment Section - For approved listings with tracking */}
                  {/* Payment Section - For approved listings with tracking */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">Payment to Seller</h4>
                      {selectedListing.paymentSent && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Payment Sent
                        </span>
                      )}
                    </div>

                    {selectedListing.paymentSent ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-yellow-800">Amount Sent:</span>
                          <span className="text-sm font-mono">${selectedListing.paymentAmount?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-yellow-800">PayPal Email:</span>
                          <span className="text-sm font-mono">{selectedListing.shippingInfo?.paypalAccount || selectedListing.vendorEmail || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-yellow-800">Transaction ID:</span>
                          <span className="text-sm font-mono">{selectedListing.paymentTransactionId || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-yellow-800">Sent At:</span>
                          <span className="text-sm">
                            {selectedListing.paymentSentAt?.toDate?.().toLocaleDateString() || "N/A"}
                          </span>
                        </div>
                        {selectedListing.paymentNotes && (
                          <div className="pt-2 border-t border-yellow-200">
                            <span className="text-sm font-medium text-yellow-800">Notes:</span>
                            <p className="text-sm text-gray-700 mt-1">{selectedListing.paymentNotes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="Payment amount ($)"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            value={paymentTransactionId}
                            onChange={(e) => setPaymentTransactionId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="PayPal Transaction ID"
                          />
                        </div>

                        <div>
                          <textarea
                            value={paymentNotes}
                            onChange={(e) => setPaymentNotes(e.target.value)}
                            rows={2}
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            placeholder="Notes (optional)"
                          />
                        </div>

                        <button
                          onClick={() => recordPaymentSent(selectedListing.id)}
                          disabled={paymentLoading || !paymentAmount.trim() || !paymentTransactionId.trim()}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors disabled:opacity-50"
                        >
                          {paymentLoading ? "Recording..." : "Record Payment"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Delete button for all listings */}
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isProcessing}
                      className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? "Processing..." : "🗑️ Delete Listing"}
                    </button>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 font-medium mb-3">⚠️ Confirm Deletion</p>
                      <p className="text-red-700 text-sm mb-4">
                        Are you sure you want to permanently delete this listing? This action cannot be undone.
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => deleteListing(selectedListing.id)}
                          disabled={isProcessing}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? "Deleting..." : "🗑️ Confirm Delete"}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isProcessing}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show rejection info if rejected */}
                  {selectedListing.status === "rejected" && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="font-medium text-red-800">
                        This listing has been rejected
                      </p>
                      {selectedListing.rejectionReason && (
                        <p className="text-red-600 text-sm mt-1">
                          <strong>Reason:</strong> {selectedListing.rejectionReason}
                        </p>
                      )}
                      {selectedListing.adminNotes && (
                        <p className="text-gray-600 text-sm mt-1">
                          <strong>Admin Notes:</strong> {selectedListing.adminNotes}
                        </p>
                      )}
                      {selectedListing.reviewedDate && (
                        <p className="text-gray-600 text-sm mt-1">
                          <strong>Reviewed on:</strong> {new Date(selectedListing.reviewedDate.seconds * 1000).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal footer with additional actions */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(selectedListing.createdAt).toLocaleString()}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedListing(null);
                      setAdminNotes("");
                      setRejectionReason("");
                      setShowDeleteConfirm(false);
                      setShippingLabel(null);
                      setShippingLabelPreview(null);
                      setTrackingNumber("");
                      setCarrier("usps");
                      // Payment state'lerini temizle

                      setPaymentError("");
                      setPaymentSuccess("");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={updateOrderStatus}
          />
        )}

        {/* 📊 Real-time connection indicator */}
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-green-100 border border-green-200 rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center text-sm text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Connected to Firebase
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}