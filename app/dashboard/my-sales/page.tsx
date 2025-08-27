"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// TypeScript interfaces
interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity?: number;
  imageUrl?: string;
  sellerId?: string;
}

interface CustomerInfo {
  fullName?: string;
  email: string;
  phone?: string;
}

interface ShippingAddress {
  name?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  totalAmount?: number;
  items?: OrderItem[];
  customerInfo?: CustomerInfo;
  shippingAddress?: ShippingAddress;
  shippingCost?: number;
  tax?: number;
  sellerId: string;
  buyerId: string;
  sellerIds: string[];
  userId?: string;
  guestEmail?: string;
  orderNumber?: string;
}

type OrderStatus = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Convert Firestore timestamp to Date
function convertTimestamp(timestamp: any): Date {
  if (!timestamp) return new Date();
  
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  
  return new Date();
}

export default function MySalesPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user sales with detailed debugging
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;
    
    const fetchSales = () => {
      try {
        setOrdersLoading(true);
        setError(null);
        
        console.log("🔍 Fetching sales for user:", user.uid);
        console.log("📧 User email:", user.email);
        
        // Optimized query - only fetch orders where user is seller
        const q = query(
          collection(db, "orders"),
          where("sellerIds", "array-contains", user.uid)
        );
        
        console.log("📝 Query created successfully");
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          console.log("📊 Query snapshot received, size:", querySnapshot.size);
          
          const ordersData: Order[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`📦 Processing order ${doc.id}:`, {
              sellerIds: data.sellerIds,
              status: data.status,
              totalAmount: data.totalAmount
            });
            
            ordersData.push({
              id: doc.id,
              status: data.status || 'pending',
              createdAt: convertTimestamp(data.createdAt),
              updatedAt: convertTimestamp(data.updatedAt),
              totalAmount: data.totalAmount || 0,
              items: data.items || [],
              customerInfo: data.customerInfo || {},
              shippingAddress: data.shippingAddress || {},
              shippingCost: data.shippingTotal || 0,
              tax: data.taxTotal || 0,
              sellerId: data.sellerIds?.[0] || '',
              buyerId: data.userId || data.guestEmail || '',
              sellerIds: data.sellerIds || [],
              userId: data.userId,
              guestEmail: data.guestEmail,
              orderNumber: data.orderNumber
            } as Order);
          });
          
          // Sort by newest first
          ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          
          console.log(`✅ Successfully loaded ${ordersData.length} sales`);
          setOrders(ordersData);
          setOrdersLoading(false);
        }, (error) => {
          console.error("❌ Error fetching sales:", {
            code: error.code,
            message: error.message,
            details: error
          });
          setError(`Failed to load your sales: ${error.message}`);
          setOrdersLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error("❌ Error setting up sales query:", error);
        setError("Failed to load your sales. Please try again later.");
        setOrdersLoading(false);
      }
    };
    
    const unsubscribe = fetchSales();
    
    // Cleanup on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, loading, router]);
  
  // Filter orders by status
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);
  
  // Get status color
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
  
  // Get status icon
  const getStatusIcon = (status: string): string => {
    const icons: Record<string, string> = {
      pending: "⏳",
      processing: "📦",
      shipped: "🚚",
      delivered: "✅",
      cancelled: "❌"
    };
    return icons[status] || "📋";
  };
  
  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  
  // Calculate order stats
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };
  
  // Loading state
  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sales...</p>
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
          <p className="text-gray-600 mb-6">Please login to view your sales.</p>
          <Link href="/login" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
            Login
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Sales</h1>
              <p className="mt-2 text-gray-600">Track and manage your sales</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-purple-600 hover:text-purple-800 font-medium">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-1">💰</div>
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              <p className="text-xs text-gray-600">Total Sales</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-1">⏳</div>
              <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-1">📦</div>
              <p className="text-2xl font-bold text-blue-600">{orderStats.processing}</p>
              <p className="text-xs text-gray-600">Processing</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-1">🚚</div>
              <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
              <p className="text-xs text-gray-600">Shipped</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              <p className="text-xs text-gray-600">Delivered</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-1">❌</div>
              <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
              <p className="text-xs text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-fit px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600 bg-purple-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'all' && ` (${orderStats.total})`}
              </button>
            ))}
          </div>
        </div>
        
        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Sale #{order.id.slice(-8).toUpperCase()}
                          {order.orderNumber && (
                            <span className="text-sm text-gray-500 ml-2">({order.orderNumber})</span>
                          )}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 Sold: {order.createdAt.toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                        {order.customerInfo && (
                          <p>👤 Buyer: {order.customerInfo.fullName || order.customerInfo.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${(order.totalAmount || 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                    </div>
                  </div>
                  
                  {/* Order Items Preview */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 4).map((item: OrderItem, index: number) => (
                          <div key={index} className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white overflow-hidden">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                📦
                              </div>
                            )}
                          </div>
                        ))}
                        {order.items && order.items.length > 4 && (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetails(true);
                          }}
                          className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50"
                        >
                          View Details
                        </button>
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            Mark as Processing
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                          >
                            Mark as Shipped
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Info */}
                  {order.shippingAddress && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-4">
                      <p className="text-xs font-medium text-gray-500 mb-1">SHIPPING TO:</p>
                      <p className="text-sm text-gray-700">
                        {order.shippingAddress.name || order.customerInfo?.fullName || 'Customer'} • {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No sales found</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all' 
                    ? "You haven't made any sales yet. Create listings to start selling!"
                    : `You don't have any ${activeTab} sales.`}
                </p>
                <Link 
                  href="/create-listing"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Listing
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Sale Details</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Sale #{selectedOrder.id.slice(-8).toUpperCase()}
                      {selectedOrder.orderNumber && (
                        <span className="ml-2">({selectedOrder.orderNumber})</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedOrder(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Order Status Timeline */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                    {(['pending', 'processing', 'shipped', 'delivered'] as const).map((status, index) => {
                      const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status || 'pending') >= index;
                      return (
                        <div key={status} className="relative flex items-center mb-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isActive ? '✓' : index + 1}
                          </div>
                          <div className="ml-4">
                            <p className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </p>
                            {isActive && selectedOrder.status === status && (
                              <p className="text-sm text-gray-600">Current status</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Items ({selectedOrder.items?.length || 0})</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: OrderItem, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              📦
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                          {item.sellerId && (
                            <p className="text-xs text-gray-500">Seller ID: {item.sellerId}</p>
                          )}
                        </div>
                        <p className="font-semibold text-gray-900">${(item.price || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm"><strong>Name:</strong> {selectedOrder.customerInfo?.fullName || 'N/A'}</p>
                    <p className="text-sm"><strong>Email:</strong> {selectedOrder.customerInfo?.email || 'N/A'}</p>
                    {selectedOrder.customerInfo?.phone && (
                      <p className="text-sm"><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                    )}
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${((selectedOrder.totalAmount || 0) - (selectedOrder.shippingCost || 0) - (selectedOrder.tax || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${(selectedOrder.shippingCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${(selectedOrder.tax || 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}