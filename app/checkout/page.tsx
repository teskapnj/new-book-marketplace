"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Temporary types - move to lib/firebase/orders.ts later
interface Order {
  userId?: string; // Optional for guest users
  guestEmail?: string; // For guest users
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
  sellerIds: string[]; // YENİ EKLENDİ
  createdAt: Date;
  updatedAt: Date;
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

interface VendorOrderBreakdown {
  sellerId: string;
  items: any[];
  subtotal: number;
  shippingCost: number;
  itemCount: number;
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
}

// Temporary create order function - GÜNCELLENDİ
async function createOrder(orderData: Omit<Order, 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    console.log('=== CREATE ORDER START ===');
    console.log('createOrder called with:', orderData);
    
    // Check if db is available
    if (!db) {
      throw new Error('Firebase db is not initialized');
    }
    console.log('Firebase db is available');
    
    // Extract seller IDs from items - YENİ EKLENDİ
    const sellerIds = [...new Set(orderData.items.map(item => item.sellerId))];
    console.log('Seller IDs:', sellerIds);
    
    // Clean undefined values before sending to Firebase
    const cleanOrderData = JSON.parse(JSON.stringify({
      ...orderData,
      sellerIds, // YENİ EKLENDİ
      orderNumber: generateOrderNumber(),
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    console.log('Cleaned order data:', cleanOrderData);
    console.log('About to call addDoc...');
    
    const docRef = await addDoc(collection(db, 'orders'), cleanOrderData);
    
    console.log('Firebase addDoc successful, docRef.id:', docRef.id);
    console.log('=== CREATE ORDER SUCCESS ===');
    
    return docRef.id;
  } catch (error: any) {
    console.log('=== CREATE ORDER ERROR ===');
    console.log('Raw error:', error);
    console.log('Error type:', typeof error);
    console.log('Error constructor:', error?.constructor?.name);
    
    // Try different ways to extract error info
    if (error instanceof Error) {
      console.log('Error is instance of Error');
      console.log('Error message:', error.message);
      console.log('Error name:', error.name);
      console.log('Error stack:', error.stack);
    } else {
      console.log('Error is not instance of Error');
      console.log('Error as string:', String(error));
    }
    
    throw error;
  }
}

interface CheckoutData {
  cartItems: any[];
  shippingAddress: {
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  vendorShipping: Record<string, { shippingCost: number }>;
  totals: {
    subtotal: number;
    shipping: number;
    marketplaceFee: number;
    tax: number;
    grandTotal: number;
  };
  vendorBreakdown: Array<{
    sellerId: string;
    items: any[];
    subtotal: number;
    shippingCost: number;
    itemCount: number;
  }>;
}

export default function CheckoutPage() {
  console.log('=== CHECKOUT PAGE RENDERING ===');
  
  const router = useRouter();
  const { user } = useAuth();
  const { clearCart } = useCart();
  
  console.log('User from auth:', user);
  console.log('User type:', typeof user);
  console.log('User is null?', user === null);
  console.log('User is undefined?', user === undefined);
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'demo'>('demo');
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  
  // Guest user info
  const [guestInfo, setGuestInfo] = useState({
    email: '',
    fullName: '',
    phone: ''
  });
  
  // Recalculated totals (to fix tax calculation)
  const recalculatedTotals = useMemo(() => {
    if (!checkoutData) return null;
    
    const subtotal = checkoutData.totals.subtotal;
    const shipping = checkoutData.totals.shipping;
    const marketplaceFee = checkoutData.totals.marketplaceFee;
    
    // CORRECTED: Tax only on subtotal + shipping (no marketplace fee)
    const tax = (subtotal + shipping) * 0.08;
    const grandTotal = subtotal + shipping + marketplaceFee + tax;
    
    return {
      subtotal,
      shipping,
      marketplaceFee,
      tax,
      grandTotal
    };
  }, [checkoutData]);

  useEffect(() => {
    // Session storage'dan checkout verilerini al
    const storedData = sessionStorage.getItem('checkoutData');
    if (storedData) {
      setCheckoutData(JSON.parse(storedData));
    } else {
      // Eğer checkout verisi yoksa cart'a yönlendir
      router.push('/cart');
    }
  }, [router]);

  const handlePlaceOrder = async () => {
    if (!checkoutData) return;
    
    setIsProcessing(true);
    setApiErrors([]); // Önceki hataları temizle
    
    try {
      // Guest kullanıcı bilgilerini hazırla
      const customerInfo = user 
        ? { email: user.email || '', fullName: user.displayName || '', phone: '' }
        : { email: guestInfo.email, fullName: guestInfo.fullName, phone: guestInfo.phone };
      
      // Order verisini hazırla
      const orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'> = {
        userId: user?.uid,
        guestEmail: !user ? guestInfo.email : undefined,
        totalAmount: recalculatedTotals?.grandTotal || checkoutData.totals.grandTotal,
        subtotal: checkoutData.totals.subtotal,
        shippingTotal: checkoutData.totals.shipping,
        marketplaceFee: checkoutData.totals.marketplaceFee,
        taxTotal: recalculatedTotals?.tax || checkoutData.totals.tax,
        status: 'pending',
        shippingAddress: checkoutData.shippingAddress,
        customerInfo,
        items: checkoutData.cartItems.map(item => ({
          id: item.id,
          productId: item.id,
          sellerId: item.sellerId || 'default-seller',
          title: item.title,
          price: item.price,
          image: item.image,
          shippingCost: checkoutData.vendorShipping[item.sellerId || 'default-seller']?.shippingCost || 0
        })),
        vendorBreakdown: checkoutData.vendorBreakdown,
        sellerIds: [...new Set(checkoutData.cartItems.map(item => item.sellerId || 'default-seller'))] // YENİ EKLENDİ
      };
      
      // Siparişi Firebase'e kaydet
      const orderId = await createOrder(orderData);
      console.log('Order created with ID:', orderId);
      
      // Satılan ürünleri "sold" olarak işaretle - API KULLANIMI
      console.log('Marking listings as sold...');
      const updatePromises = checkoutData.cartItems.map(async (item) => {
        try {
          console.log(`Marking listing ${item.id} as sold...`);
          console.log('Item data:', JSON.stringify(item, null, 2));
          
          const requestBody = {
            listingId: item.id,
            buyerId: user?.uid || null,
            orderId: orderId
          };
          
          console.log('API request body:', requestBody);
          
          // API endpoint'ini çağır
          const response = await fetch('/api/mark-listing-sold', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
          
          console.log('API response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            
            // Hata mesajını state'e ekle
            setApiErrors(prev => [...prev, `Item ${item.id}: ${errorData.error || 'Unknown error'}`]);
            
            throw new Error(errorData.error || 'Failed to mark listing as sold');
          }
          
          const result = await response.json();
          console.log(`API Response for item ${item.id}:`, result);
          console.log(`Successfully marked listing ${item.id} as sold`);
          return { id: item.id, success: true };
        } catch (error: any) {
          console.error(`Failed to mark listing ${item.id} as sold:`, error);
          
          // Hata mesajını state'e ekle
          setApiErrors(prev => [...prev, `Item ${item.id}: ${error.message || 'Unknown error'}`]);
          
          return { id: item.id, success: false, error: error.message };
        }
      });
      
      // Tüm işlemleri bekle
      const results = await Promise.allSettled(updatePromises);
      
      // Başarısız olanları logla
      const failedUpdates = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.success)
      );
      
      if (failedUpdates.length > 0) {
        console.warn('Some listings could not be marked as sold:', failedUpdates);
        // Kullanıcıya bildirim göster ama işlemi durdurma
      }
      
      console.log('All listings processed');
      
      // Sepeti temizle
      clearCart();
      
      // Session storage'ı temizle
      sessionStorage.removeItem('checkoutData');
      
      // Başarı sayfasına yönlendir
      router.push(`/checkout/success?orderId=${orderId}`);
      
    } catch (error: any) {
      console.error('Order creation failed:', error);
      
      // Firebase hatası için özel mesaj
      if (error.code === 'permission-denied') {
        alert('Permission denied. Please try again later.');
      } else {
        alert('Order could not be placed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
        </div>
        
        {/* API Errors Display */}
        {apiErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div>
                <h3 className="font-medium text-red-900">Some items couldn't be updated</h3>
                <p className="text-red-700 text-sm mt-1">
                  Your order was placed successfully, but we encountered issues updating some items:
                </p>
                <ul className="text-red-700 text-sm mt-2 list-disc pl-5">
                  {apiErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 mb-8 lg:mb-0">
            {/* Customer Information */}
            {!user && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestInfo.email}
                      onChange={(e) => {
                        console.log('Email input changed:', e.target.value);
                        setGuestInfo(prev => ({ ...prev, email: e.target.value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestInfo.fullName}
                      onChange={(e) => {
                        console.log('FullName input changed:', e.target.value);
                        setGuestInfo(prev => ({ ...prev, fullName: e.target.value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={guestInfo.phone}
                      onChange={(e) => {
                        console.log('Phone input changed:', e.target.value);
                        setGuestInfo(prev => ({ ...prev, phone: e.target.value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Login suggestion for guest users */}
            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-blue-600 text-xl mr-3">💡</span>
                  <div>
                    <h3 className="font-medium text-blue-900">Have an account?</h3>
                    <p className="text-blue-700 text-sm">
                      <button
                        onClick={() => router.push('/login?redirect=/checkout')}
                        className="underline hover:text-blue-800"
                      >
                        Sign in
                      </button>
                      {' '}to track your orders and save your information for faster checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900">{checkoutData.shippingAddress.street1}</p>
                <p className="text-gray-600">
                  {checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state} {checkoutData.shippingAddress.zip}
                </p>
                <p className="text-gray-600">{checkoutData.shippingAddress.country}</p>
              </div>
            </div>
            
            {/* Order Items by Vendor */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              
              {checkoutData.vendorBreakdown.map(vendor => (
                <div key={vendor.sellerId} className="mb-6 last:mb-0">
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {vendor.sellerId === 'default-seller' ? 'Default Seller' : vendor.sellerId}
                    </h3>
                    <p className="text-sm text-gray-600">{vendor.itemCount} items</p>
                  </div>
                  
                  <div className="space-y-3">
                    {vendor.items.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-2xl">📦</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">SKU: {item.id}</p>
                        </div>
                        <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Payment Method (Demo) */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Demo Mode</h3>
                    <p className="text-yellow-700 text-sm">
                      Payment integration will be added later. This is a test order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">${recalculatedTotals?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">${recalculatedTotals?.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Marketplace Fee</span>
                  <span className="font-bold">${recalculatedTotals?.marketplaceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-bold">${recalculatedTotals?.tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${recalculatedTotals?.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || (!user && (!guestInfo.email || !guestInfo.fullName))}
                className={`w-full py-4 font-bold rounded-lg transition-all duration-200 ${
                  isProcessing || (!user && (!guestInfo.email || !guestInfo.fullName))
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order${!user ? ' (Guest)' : ''}`
                )}
              </button>
              
              {/* Debug info for guest users */}
              {!user && (
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Debug: Email={guestInfo.email || 'empty'}, Name={guestInfo.fullName || 'empty'}
                </div>
              )}
              
              <button
                onClick={() => router.push('/cart')}
                className="w-full mt-3 py-3 bg-white text-gray-600 font-medium rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}