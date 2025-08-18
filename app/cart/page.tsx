// pages/cart.tsx
"use client";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Geri butonu için ikon bileşeni
function ArrowLeftIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5"></path>
      <path d="M12 19l-7-7 7-7"></path>
    </svg>
  );
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getItemsBySeller } = useCart();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const router = useRouter();
  
  // Geri butonu tıklandığında çalışacak fonksiyon
  const handleGoBack = () => {
    router.back();
  };
  
  // Satıcılara göre gruplandırılmış ürünler
  const sellers = Array.from(new Set(cartItems.map(item => item.sellerId)));
  
  const handleImageError = (itemId: string, sellerId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [`${itemId}-${sellerId}`]: true
    }));
  };
  
  // Her bir satıcı için toplam fiyatı hesapla
  const getSellerTotal = (sellerId: string) => {
    const sellerItems = getItemsBySeller(sellerId);
    return sellerItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GERİ BUTONU EKLENDİ */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
          >
            <ArrowLeftIcon size={20} className="mr-1" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center justify-between flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {cartItems.reduce((total, item) => total + item.quantity, 0)} items
            </span>
          </div>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Satıcılara göre gruplandırılmış ürünler */}
            {sellers.map(sellerId => {
              const sellerItems = getItemsBySeller(sellerId);
              const sellerTotal = getSellerTotal(sellerId);
              
              return (
                <div key={sellerId} className="mb-8">
                  <div className="bg-white rounded-t-2xl p-4 border-b border-gray-200 flex items-center">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Seller: {sellerId}</h3>
                      <p className="text-sm text-gray-600">{sellerItems.length} items</p>
                    </div>
                    <div className="ml-auto">
                      <span className="font-bold text-gray-900">${sellerTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {sellerItems.map((item) => {
                        const imageKey = `${item.id}-${item.sellerId}`;
                        const hasImageError = imageErrors[imageKey];
                        
                        return (
                          <div key={imageKey} className="p-6 flex flex-col sm:flex-row">
                            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                              {item.image && !hasImageError ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover"
                                  onError={() => handleImageError(item.id, item.sellerId)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                  <span className="text-3xl">📦</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                              <p className="text-gray-600 text-sm mb-2">SKU: {item.id}</p>
                              <div className="flex items-center justify-between mb-4">
                                <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.sellerId, item.quantity - 1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 font-medium">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.sellerId, item.quantity + 1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                  >
                                    +
                                  </button>
                                </div>
                                <button 
                                  onClick={() => removeFromCart(item.id, item.sellerId)}
                                  className="text-red-500 hover:text-red-700 font-medium transition-colors flex items-center"
                                >
                                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                  </svg>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Sipariş Özeti */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky bottom-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-lg font-bold text-gray-900">${getTotalPrice().toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">$5.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${(getTotalPrice() + 5.99 + (getTotalPrice() * 0.08)).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Proceed to Checkout
                </button>
                <Link 
                  href="/" 
                  className="flex-1 py-3 bg-white text-blue-600 font-bold rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Multiple sellers will process your order separately</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}