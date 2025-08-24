// pages/cart.tsx
"use client";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Geri butonu için ikon bileşeni
function ArrowLeftIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5"></path>
      <path d="M12 19l-7-7 7-7"></path>
    </svg>
  );
}

// Truck icon for shipping
function TruckIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );
}

interface ShippingInfo {
  [itemId: string]: number; // itemId -> shipping price
}

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({});
  const [loadingShipping, setLoadingShipping] = useState(true);
  const router = useRouter();

  // Benzersiz ürünleri ID'ye göre filtrele
  const uniqueCartItems = useMemo(() => {
    return cartItems.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    );
  }, [cartItems]);

  // Fetch shipping information for all cart items
  useEffect(() => {
    const fetchShippingInfo = async () => {
      if (uniqueCartItems.length === 0) {
        setLoadingShipping(false);
        return;
      }
      setLoadingShipping(true);
      const shippingData: ShippingInfo = {};
      try {
        const uniqueItems = uniqueCartItems.filter((item, index, self) =>
          index === self.findIndex(t => t.id === item.id)
        );
        await Promise.all(
          uniqueItems.map(async (item) => {
            try {
              const docRef = doc(db, "listings", item.id);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const data = docSnap.data();
                shippingData[item.id] = data.shippingPrice || 0;
              } else {
                shippingData[item.id] = 5.99;
              }
            } catch (error) {
              console.error(`Error fetching shipping for item ${item.id}:`, error);
              shippingData[item.id] = 5.99;
            }
          })
        );
        setShippingInfo(shippingData);
      } catch (error) {
        console.error("Error fetching shipping information:", error);
      } finally {
        setLoadingShipping(false);
      }
    };
    fetchShippingInfo();
  }, [uniqueCartItems]);

  const handleGoBack = () => {
    router.back();
  };

  // Satıcılara göre gruplandırılmış ürünler
  const sellers = Array.from(new Set(uniqueCartItems.map(item => item.sellerId || "default-seller")));
  
  const handleImageError = (itemId: string, sellerId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [`${itemId}-${sellerId}`]: true
    }));
  };

  // Her bir satıcı için ürünleri al
  const getSellerItems = (sellerId: string) => {
    return uniqueCartItems.filter(item => (item.sellerId || "default-seller") === sellerId);
  };

  // Her bir satıcı için toplam fiyatı hesapla (shipping dahil değil)
  const getSellerSubtotal = (sellerId: string) => {
    const sellerItems = getSellerItems(sellerId);
    return sellerItems.reduce((total, item) => total + item.price, 0);
  };

  // Her bir satıcı için shipping hesapla
  const getSellerShipping = (sellerId: string) => {
    const sellerItems = getSellerItems(sellerId);
    let totalShipping = 0;
    const uniqueItemIds = Array.from(new Set(sellerItems.map(item => item.id)));
    uniqueItemIds.forEach(itemId => {
      totalShipping += shippingInfo[itemId] || 0;
    });
    return totalShipping;
  };

  // Tüm sipariş için shipping hesapla
  const getTotalShipping = () => {
    return sellers.reduce((total, sellerId) => total + getSellerShipping(sellerId), 0);
  };

  // Marketplace fee hesapla (subtotal + shipping'in %8.5'i)
  const getMarketplaceFee = () => {
    return (getTotalPrice() + getTotalShipping()) * 0.085;
  };

  // Tüm sipariş için tax hesapla
  const getTotalTax = () => {
    const taxableAmount = getTotalPrice() + getTotalShipping() + getMarketplaceFee();
    return taxableAmount * 0.08;
  };

  // Tüm sipariş için grand total
  const getGrandTotal = () => {
    return getTotalPrice() + getTotalShipping() + getMarketplaceFee() + getTotalTax();
  };

  // Total items count
  const getTotalItemsCount = () => {
    return uniqueCartItems.length;
  };

  // Toplam fiyatı hesapla
  const getTotalPrice = () => {
    return uniqueCartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-all duration-200 group bg-white/60 hover:bg-white/80 px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-white/50 mr-6"
          >
            <ArrowLeftIcon size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center justify-between flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full border border-indigo-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="font-semibold">{getTotalItemsCount()} items</span>
            </div>
          </div>
        </div>
        {uniqueCartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* CART ITEMS - Left Column (Desktop) / Full Width (Mobile) */}
            <div className="lg:col-span-8 mb-8 lg:mb-0">
              {loadingShipping && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-3"></div>
                    <span className="text-gray-700 font-medium">Loading shipping information...</span>
                  </div>
                </div>
              )}
              <div className="space-y-8">
                {sellers.map(sellerId => {
                  const sellerItems = getSellerItems(sellerId);
                  const sellerSubtotal = getSellerSubtotal(sellerId);
                  const sellerShipping = getSellerShipping(sellerId);
                  
                  // Eğer bu satıcıya ait ürün yoksa gösterme
                  if (sellerItems.length === 0) return null;
                  
                  return (
                    <div key={sellerId} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                      {/* Enhanced Seller Header */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-xl mr-4 shadow-lg">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">
                                Seller: {sellerId === "default-seller" ? "Default Seller" : sellerId}
                              </h3>
                              <p className="text-sm text-gray-600">{sellerItems.length} items in this order</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">${sellerSubtotal.toFixed(2)}</p>
                            {sellerShipping > 0 ? (
                              <p className="text-sm text-blue-600 flex items-center justify-end font-medium">
                                <TruckIcon size={14} className="mr-1" />
                                +${sellerShipping.toFixed(2)} shipping
                              </p>
                            ) : (
                              <p className="text-sm text-green-600 flex items-center justify-end font-medium">
                                <TruckIcon size={14} className="mr-1" />
                                FREE shipping
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Enhanced Seller Items */}
                      <div className="divide-y divide-gray-100">
                        {sellerItems.map((item) => {
                          const imageKey = `${item.id}-${item.sellerId || "default-seller"}`;
                          const hasImageError = imageErrors[imageKey];
                          const itemShipping = shippingInfo[item.id] || 0;
                          return (
                            <div key={imageKey} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                              <div className="flex space-x-6">
                                {/* Enhanced Product Image */}
                                <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-md">
                                  {item.image && !hasImageError ? (
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-full h-full object-cover"
                                      onError={() => handleImageError(item.id, item.sellerId || "default-seller")}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                      <span className="text-3xl">📦</span>
                                    </div>
                                  )}
                                </div>
                                {/* Enhanced Product Details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                                  <p className="text-sm text-gray-500 mb-4">SKU: {item.id}</p>
                                  {/* Enhanced Shipping Badge */}
                                  <div className="mb-4">
                                    {itemShipping > 0 ? (
                                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                        <TruckIcon size={12} className="mr-1" />
                                        ${itemShipping.toFixed(2)} shipping
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                        <TruckIcon size={12} className="mr-1" />
                                        FREE shipping
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <p className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                      <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm shadow-sm">
                                        Qty: 1
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => removeFromCart(item.id, item.sellerId)}
                                      className="text-red-500 hover:text-red-700 transition-all duration-200 p-3 hover:bg-red-50 rounded-xl group"
                                    >
                                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Enhanced Seller Footer */}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-gray-600 font-medium">Seller subtotal: </span>
                            <span className="font-bold text-gray-900">${sellerSubtotal.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">Shipping: </span>
                            <span className="font-bold">
                              {sellerShipping > 0 ? `$${sellerShipping.toFixed(2)}` : 'FREE'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 font-medium">Total: </span>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              ${(sellerSubtotal + sellerShipping).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ENHANCED ORDER SUMMARY - Right Column (Desktop) / Bottom (Mobile) */}
            <div className="lg:col-span-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 sticky top-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4"></path>
                      <circle cx="12" cy="12" r="9"></circle>
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Order Summary</h2>
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium flex items-center">
                      <TruckIcon size={18} className="mr-2" />
                      Shipping
                    </span>
                    <span className="font-bold text-lg">
                      {getTotalShipping() > 0 ? `$${getTotalShipping().toFixed(2)}` : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Marketplace Fee</span>
                    <span className="font-bold text-lg">${getMarketplaceFee().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Tax</span>
                    <span className="font-bold text-lg">${getTotalTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${getGrandTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/"
                    className="block w-full py-3 bg-white text-blue-600 font-bold rounded-2xl border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 text-center hover:shadow-lg transform hover:scale-105"
                  >
                    Continue Shopping
                  </Link>
                </div>
                {!loadingShipping && getTotalShipping() === 0 && (
                  <div className="mt-6 text-center p-4 bg-green-50 rounded-2xl border border-green-200">
                    <p className="text-green-700 font-semibold flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"></path>
                        <circle cx="12" cy="12" r="9"></circle>
                      </svg>
                      Free shipping on all items!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}