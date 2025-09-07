// app/cart/page.tsx
"use client";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DOMPurify from 'isomorphic-dompurify'; // Bu satırı ekleyin

// USPS Media Mail pricing table (weight in lbs to cost in $)
const uspsMediaMailPricing: Record<number, number> = {
  1: 4.47,
  2: 5.22,
  3: 5.97,
  4: 6.72,
  5: 7.47,
  6: 8.22,
  7: 8.97,
  8: 9.72,
  9: 10.47,
  10: 11.22,
  11: 11.97,
  12: 12.72,
  13: 13.47,
  14: 14.22,
  15: 14.97,
  16: 15.72,
  17: 16.47,
  18: 17.22,
  19: 17.97,
  20: 18.72,
  21: 19.47,
  22: 20.22,
  23: 20.97,
  24: 21.72,
  25: 22.47,
  26: 23.22,
  27: 23.97,
  28: 24.72,
  29: 25.47,
  30: 26.22,
  31: 26.97,
  32: 27.72,
  33: 28.47,
  34: 29.22,
  35: 29.97,
  36: 30.72,
  37: 31.47,
  38: 32.22,
  39: 32.97,
  40: 33.72,
  41: 34.47,
  42: 35.22,
  43: 35.97,
  44: 36.72,
  45: 37.47,
  46: 38.22,
  47: 38.97,
  48: 39.72,
  49: 40.47,
  50: 41.22
};

// Function to calculate shipping cost based on weight with 15% extra
function calculateShippingCost(weight: number): number {
  // Find the closest weight in the pricing table
  const weightRounded = Math.ceil(weight);

  let baseCost;
  if (weightRounded <= 1) {
    baseCost = uspsMediaMailPricing[1];
  } else if (weightRounded >= 50) {
    baseCost = uspsMediaMailPricing[50];
  } else {
    baseCost = uspsMediaMailPricing[weightRounded];
  }

  // Add 15% extra to shipping cost
  return baseCost * 1.15;
}

// Icons (unchanged)
function ArrowLeftIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5"></path>
      <path d="M12 19l-7-7 7-7"></path>
    </svg>
  );
}

function TruckIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="3" width="15" height="13"></rect>
      <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
      <circle cx="5.5" cy="18.5" r="2.5"></circle>
      <circle cx="18.5" cy="18.5" r="2.5"></circle>
    </svg>
  );
}

function LocationIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

interface ShippingAddress {
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Compact Shipping Address Form (with clear functionality)
function CompactShippingAddressForm({ onAddressChange, address, onClearAddress }: {
  onAddressChange: (address: ShippingAddress) => void;
  address: ShippingAddress;
  onClearAddress?: () => void;
}) {
  const [validationResults, setValidationResults] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // GÜVENLİ
  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    // Input sanitization ve validation
    const sanitizedValue = DOMPurify.sanitize(value);

    // Field-specific validation
    let validatedValue = sanitizedValue;

    if (field === 'state') {
      validatedValue = sanitizedValue.replace(/[^A-Z]/g, '').substring(0, 2);
    } else if (field === 'zip') {
      validatedValue = sanitizedValue.replace(/[^\d-]/g, '').substring(0, 10);
    } else {
      validatedValue = sanitizedValue.substring(0, 100); // Length limit
    }

    const updatedAddress = {
      ...address,
      [field]: validatedValue
    };
    onAddressChange(updatedAddress);

    if (validationResults[field]) {
      setValidationResults(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }

    if (field === 'zip') {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        if (value.length >= 5) {
          const zipRegex = /^\d{5}(-\d{4})?$/;
          if (!zipRegex.test(value)) {
            setValidationResults(prev => ({
              ...prev,
              zip: 'Invalid ZIP format (use 12345 or 12345-6789)'
            }));
          }
        }
      }, 500);

      setDebounceTimer(timer);
    }

    if (updatedAddress.street1 && updatedAddress.city && updatedAddress.state && updatedAddress.zip && updatedAddress.zip.length >= 5) {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (zipRegex.test(updatedAddress.zip)) {
        validateAddress(updatedAddress);
      }
    }
  };

  const validateAddress = async (addressToValidate: ShippingAddress) => {
    if (isValidating) return;

    setIsValidating(true);
    try {
      const response = await fetch('/api/address/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street1: addressToValidate.street1,
          city: addressToValidate.city,
          state: addressToValidate.state,
          zip: addressToValidate.zip,
          country: addressToValidate.country
        })
      });

      // GÜVENLİ
      if (response.ok) {
        const data = await response.json();

        // API response validation
        if (data && typeof data.valid === 'boolean') {
          if (data.valid) {
            setValidationResults(prev => ({
              ...prev,
              general: '✅ Address verified'
            }));

            // Suggested address validation
            if (data.suggested &&
              typeof data.suggested === 'object' &&
              typeof data.suggested.street1 === 'string' &&
              typeof data.suggested.city === 'string' &&
              typeof data.suggested.state === 'string' &&
              typeof data.suggested.zip === 'string') {

              const sanitizedSuggestion = {
                street1: DOMPurify.sanitize(data.suggested.street1),
                city: DOMPurify.sanitize(data.suggested.city),
                state: DOMPurify.sanitize(data.suggested.state),
                zip: DOMPurify.sanitize(data.suggested.zip)
              };

              setValidationResults(prev => ({
                ...prev,
                suggestion: `💡 Did you mean: ${sanitizedSuggestion.street1}, ${sanitizedSuggestion.city}, ${sanitizedSuggestion.state} ${sanitizedSuggestion.zip}?`
              }));
            }
          } else {
            setValidationResults(prev => ({
              ...prev,
              general: '⚠️ Address could not be verified'
            }));
          }
        }
      }
    } catch (error) {
      console.log('Address validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <LocationIcon className="text-blue-600 mr-2" size={16} />
          <h4 className="text-md font-medium text-gray-900">Delivery Address</h4>
        </div>
        <div className="flex items-center space-x-2">
          {isValidating && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-xs text-blue-600">Validating...</span>
            </div>
          )}
          {onClearAddress && (address.street1 || address.city || address.state || address.zip) && (
            <button
              onClick={onClearAddress}
              className="text-xs text-red-600 hover:text-red-700 underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Street Address"
          value={address.street1}
          onChange={(e) => handleInputChange('street1', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm ${validationResults.street1 ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm ${validationResults.city ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
        />
        <input
          type="text"
          placeholder="State"
          value={address.state}
          onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
          maxLength={2}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm ${validationResults.state ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
        />
        <input
          type="text"
          placeholder="ZIP Code (e.g., 12345 or 12345-6789)"
          value={address.zip}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d-]/g, '');
            handleInputChange('zip', value);
          }}
          maxLength={10}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm ${validationResults.zip && address.zip.length >= 5 ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
        />
      </div>

      {/* Show saved address indicator */}
      {address.street1 && address.zip.length >= 5 && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
            <span className="text-green-700 text-sm">Address saved for future orders</span>
          </div>
        </div>
      )}

      {Object.entries(validationResults).map(([field, message]) => {
        if (field === 'zip' && address.zip.length < 5) {
          return null;
        }

        return (
          <div key={field} className={`mt-2 text-xs ${message.includes('✅') ? 'text-green-600' :
            message.includes('💡') ? 'text-blue-600' : 'text-red-600'
            }`}>
            {message}
          </div>
        );
      })}
    </div>
  );
}

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street1: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });
  const [vendorShipping, setVendorShipping] = useState<Record<string, { shippingCost: number }>>({});
  const router = useRouter();

  // Load saved address from localStorage on component mount
  // GÜVENLİ
  useEffect(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
      try {
        const parsedAddress = JSON.parse(savedAddress);
        // Validation ekleyin
        if (parsedAddress &&
          typeof parsedAddress.street1 === 'string' &&
          typeof parsedAddress.city === 'string' &&
          typeof parsedAddress.state === 'string' &&
          typeof parsedAddress.zip === 'string' &&
          typeof parsedAddress.country === 'string') {
          setShippingAddress({
            street1: DOMPurify.sanitize(parsedAddress.street1),
            city: DOMPurify.sanitize(parsedAddress.city),
            state: DOMPurify.sanitize(parsedAddress.state),
            zip: DOMPurify.sanitize(parsedAddress.zip),
            country: DOMPurify.sanitize(parsedAddress.country)
          });
        }
      } catch (error) {
        console.error('Error parsing saved address:', error);
        localStorage.removeItem('shippingAddress'); // Corrupt data'yı temizle
      }
    }
  }, []);

  // Save address to localStorage whenever it changes
  useEffect(() => {
    if (shippingAddress.street1 || shippingAddress.city || shippingAddress.state || shippingAddress.zip) {
      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }
  }, [shippingAddress]);

  // Memoize unique cart items
  const uniqueCartItems = useMemo(() => {
    return cartItems.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    );
  }, [cartItems]);

  // Memoize sellers array
  const sellers = useMemo(() => {
    return Array.from(new Set(uniqueCartItems.map(item => item.sellerId || "default-seller")));
  }, [uniqueCartItems]);

  // Memoize seller items function
  const getSellerItems = useCallback((sellerId: string) => {
    return uniqueCartItems.filter(item => (item.sellerId || "default-seller") === sellerId);
  }, [uniqueCartItems]);

  // Memoize seller subtotal function
  const getSellerSubtotal = useCallback((sellerId: string) => {
    const sellerItems = getSellerItems(sellerId);
    return sellerItems.reduce((total, item) => total + item.price, 0);
  }, [getSellerItems]);

  // Memoize seller shipping cost
  const getSellerShipping = useCallback((sellerId: string) => {
    return vendorShipping[sellerId]?.shippingCost || 0;
  }, [vendorShipping]);

  // Memoize total calculations
  const getTotalPrice = useMemo(() => {
    return uniqueCartItems.reduce((total, item) => total + item.price, 0);
  }, [uniqueCartItems]);

  const getTotalShipping = useMemo(() => {
    return sellers.reduce((total, sellerId) => total + getSellerShipping(sellerId), 0);
  }, [sellers, getSellerShipping]);

  const getMarketplaceFee = useMemo(() => {
    return (getTotalPrice + getTotalShipping) * 0.085;
  }, [getTotalPrice, getTotalShipping]);

  const getTotalTax = useMemo(() => {
    // Tax base: Only subtotal + shipping (marketplace fee excluded)
    const taxableAmount = getTotalPrice + getTotalShipping;
    return taxableAmount * 0.08; // %8 sales tax
  }, [getTotalPrice, getTotalShipping]); // Removed getMarketplaceFee from dependency

  const getGrandTotal = useMemo(() => {
    return getTotalPrice + getTotalShipping + getMarketplaceFee + getTotalTax;
  }, [getTotalPrice, getTotalShipping, getMarketplaceFee, getTotalTax]);

  const getTotalItemsCount = useMemo(() => {
    return uniqueCartItems.length;
  }, [uniqueCartItems]);

  // Fetch vendor shipping settings and calculate shipping
  useEffect(() => {
    const calculateShippingRates = async () => {
      const vendorShippingData: Record<string, { shippingCost: number }> = {};

      for (const sellerId of sellers) {
        const sellerItems = getSellerItems(sellerId);

        try {
          // Calculate total shipping cost for this seller's items
          let totalShippingCost = 0;

          // Loop through each item to calculate individual shipping cost
          for (const item of sellerItems) {
            try {
              // Fetch listing data from Firestore using the item ID
              const listingDoc = await getDoc(doc(db, "listings", item.id));

              if (listingDoc.exists()) {
                const listingData = listingDoc.data();

                // Use package dimensions from listing
                if (listingData.shippingInfo && listingData.shippingInfo.packageDimensions) {
                  const dimensions = listingData.shippingInfo.packageDimensions;
                  const itemWeight = parseFloat(dimensions.weight.toString());

                  // Calculate shipping cost for this individual item (with 15% extra)
                  const itemShippingCost = calculateShippingCost(itemWeight);

                  // Add to total shipping cost for this seller
                  totalShippingCost += itemShippingCost;
                }
              }
            } catch (error) {
              console.error('❌ Error fetching listing from Firestore:', error);
            }
          }

          vendorShippingData[sellerId] = {
            shippingCost: totalShippingCost
          };

        } catch (error) {
          console.error(`Error calculating shipping for vendor ${sellerId}:`, error);
          vendorShippingData[sellerId] = {
            shippingCost: 0
          };
        }
      }

      setVendorShipping(vendorShippingData);
    };

    if (sellers.length > 0) {
      calculateShippingRates();
    }
  }, [sellers, getSellerItems, uniqueCartItems]); // Added uniqueCartItems to dependency array

  const handleGoBack = () => {
    router.back();
  };

  const handleImageError = (itemId: string, sellerId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [`${itemId}-${sellerId}`]: true
    }));
  };

  const handleRemoveFromCart = (e: React.MouseEvent, itemId: string, sellerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(itemId, sellerId);
  };

  // Clear saved address
  const handleClearAddress = () => {
    const emptyAddress = {
      street1: '',
      city: '',
      state: '',
      zip: '',
      country: 'US'
    };
    setShippingAddress(emptyAddress);
    localStorage.removeItem('shippingAddress');
  };
  // NEW: Checkout handler function
  const handleProceedToCheckout = () => {
    // Checkout verisini sessionStorage'a kaydet
    const checkoutData = {
      cartItems: uniqueCartItems,
      shippingAddress,
      vendorShipping,
      totals: {
        subtotal: getTotalPrice,
        shipping: getTotalShipping,
        marketplaceFee: getMarketplaceFee,
        tax: getTotalTax,
        grandTotal: getGrandTotal
      },
      vendorBreakdown: sellers.map(sellerId => ({
        sellerId,
        items: getSellerItems(sellerId),
        subtotal: getSellerSubtotal(sellerId),
        shippingCost: getSellerShipping(sellerId),
        itemCount: getSellerItems(sellerId).length
      }))
    };

    // Session storage'a kaydet
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

    // Checkout sayfasına yönlendir
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
              <span className="font-semibold">{getTotalItemsCount} items</span>
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
            {/* CART ITEMS - Left Column */}
            <div className="lg:col-span-8 mb-8 lg:mb-0">
              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {sellers.map(sellerId => {
                  const sellerItems = getSellerItems(sellerId);

                  if (sellerItems.length === 0) return null;

                  return (
                    <div key={sellerId} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                      {/* Seller Header */}
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {sellerId === "default-seller" ? "Default Seller" : DOMPurify.sanitize(sellerId)}
                            </h3>
                            <p className="text-sm text-gray-600">{sellerItems.length} items</p>
                          </div>
                        </div>
                      </div>

                      {/* Seller Items */}
                      <div className="divide-y divide-gray-100">
                        {sellerItems.map((item) => {
                          const imageKey = `${item.id}-${item.sellerId || "default-seller"}`;
                          const hasImageError = imageErrors[imageKey];

                          return (
                            <Link
                              key={imageKey}
                              href={`/products/${item.id}`}
                              className="block p-6 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div className="flex space-x-4">
                                {/* Product Image */}
                                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                  {item.image && !hasImageError ? (
                                    <img
                                      src={item.image}
                                      alt={DOMPurify.sanitize(item.title)}
                                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                      onError={() => handleImageError(item.id, item.sellerId || "default-seller")}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <span className="text-2xl">📦</span>
                                    </div>
                                  )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 mb-1">{DOMPurify.sanitize(item.title)}</h4>
                                  <p className="text-sm text-gray-500 mb-3">SKU: {item.id}</p>

                                  <div className="flex items-center justify-between">
                                    <p className="text-xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
                                    <button
                                      onClick={(e) => handleRemoveFromCart(e, item.id, item.sellerId || "default-seller")}
                                      className="text-red-500 hover:text-red-700 transition-all duration-200 p-2 hover:bg-red-50 rounded-lg"
                                    >
                                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compact Shipping Address Form */}
              <CompactShippingAddressForm
                address={shippingAddress}
                onAddressChange={setShippingAddress}
                onClearAddress={handleClearAddress}
              />
            </div>

            {/* ORDER SUMMARY - Right Column */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">${getTotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center">
                      <TruckIcon size={16} className="mr-1" />
                      Shipping
                    </span>
                    <span className="font-bold">
                      ${getTotalShipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marketplace Fee</span>
                    <span className="font-bold">${getMarketplaceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-bold">${getTotalTax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${getGrandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ZIP Code Status */}
                {shippingAddress.street1 && shippingAddress.zip.length < 5 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-blue-800 text-sm">
                        Complete ZIP code to calculate shipping
                      </span>
                    </div>
                  </div>
                )}

                {/* Checkout Button - UPDATED */}
                <div className="space-y-3">
                  <button
                    onClick={handleProceedToCheckout}
                    className={`w-full py-3 font-bold rounded-lg transition-all duration-200 ${getTotalShipping >= 0 && shippingAddress.street1 && shippingAddress.zip.length >= 5
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    disabled={!shippingAddress.street1 || shippingAddress.zip.length < 5}
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/"
                    className="block w-full py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}