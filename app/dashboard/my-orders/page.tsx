"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function MyOrdersPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user orders
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;
    
    const fetchOrders = () => {
      try {
        setOrdersLoading(true);
        setError(null);
        
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        
        const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
          const ordersData: any[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            ordersData.push({
              id: doc.id,
              ...data,
              // Handle both string and Timestamp dates
              createdAt: data.createdAt ? 
                (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : new Date(data.createdAt)) 
                : new Date(),
              updatedAt: data.updatedAt ? 
                (typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate() : new Date(data.updatedAt)) 
                : new Date(),
              // Map fields to expected names
              items: data.items || [],
              totalAmount: data.totalAmount || 0,
              status: data.status || 'pending',
              shippingAddress: data.shippingAddress || {},
              estimatedDelivery: data.estimatedDelivery || null,
              trackingNumber: data.trackingNumber || null
            });
          });
          console.log(`Loaded ${ordersData.length} orders for user ${user.uid}`);
          setOrders(ordersData);
          setOrdersLoading(false);
        }, (err) => {
          console.error("Error fetching orders:", err);
          setError("Failed to load your orders. Please try again later.");
          setOrdersLoading(false);
        });
        
        return () => unsubscribe();
      } catch (err) {
        console.error("Error setting up orders query:", err);
        setError("Failed to load your orders. Please try again later.");
        setOrdersLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, loading, router]);

  // Filter orders by status
  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => order.status === activeTab);

  // Get status color - now includes 'confirmed'
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      confirmed: "bg-indigo-100 text-indigo-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Get status icon - now includes 'confirmed'
  const getStatusIcon = (status: string) => {
    const icons = {
      pending: "⏳",
      processing: "📦",
      shipped: "🚚",
      delivered: "✅",
      cancelled: "❌",
      confirmed: "✅"
    };
    return icons[status as keyof typeof icons] || "📋";
  };

  // Calculate order stats - now includes 'confirmed'
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length
  };

  // Loading state
  if (loading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
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
          <p className="text-gray-600 mb-6">Please login to view your orders.</p>
          <Link href="/login" className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
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
              <h1 className="text-3xl font-bold text-gray-900">My Orders 🛒</h1>
              <p className="mt-2 text-gray-600">Track and manage your purchases</p>
            </div>
            <div>
              <Link href="/dashboard" className="text-orange-600 hover:text-orange-800 font-medium">
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

        {/* Statistics Cards - Now includes confirmed */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-1">📦</div>
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              <p className="text-xs text-gray-600">Total Orders</p>
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
              <div className="text-2xl mb-1">✅</div>
              <p className="text-2xl font-bold text-indigo-600">{orderStats.confirmed}</p>
              <p className="text-xs text-gray-600">Confirmed</p>
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

        {/* Filter Tabs - Now includes confirmed */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 min-w-fit px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
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
                          Order #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📅 Ordered: {order.createdAt.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                        {order.estimatedDelivery && (
                          <p>📦 Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
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
                        {order.items?.slice(0, 4).map((item: any, index: number) => (
                          <div key={index} className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white overflow-hidden">
                            {item.image ? (
                              <Image
                                src={item.image}
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
                          className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-50"
                        >
                          View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">
                            Leave Review
                          </button>
                        )}
                        {order.trackingNumber && (
                          <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50">
                            Track Package
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
                        {order.shippingAddress.street1} • {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'all'
                    ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                    : `You don't have any ${activeTab} orders.`}
                </p>
                <Link
                  href="/listings"
                  className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Start Shopping
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
                    <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                    <p className="text-sm text-gray-600 mt-1">Order #{selectedOrder.id.slice(-8).toUpperCase()}</p>
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
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
                      const isActive = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status || 'pending') >= index;
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
                    {selectedOrder.items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
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
                        </div>
                        <p className="font-semibold text-gray-900">${(item.price || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${(selectedOrder.shippingTotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${(selectedOrder.taxTotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Marketplace Fee</span>
                      <span className="font-medium">${(selectedOrder.marketplaceFee || 0).toFixed(2)}</span>
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