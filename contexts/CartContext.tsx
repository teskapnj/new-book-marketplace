// contexts/CartContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  sellerId: string; // Added seller ID
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, sellerId: string) => void; // Updated to include sellerId
  updateQuantity: (id: string, sellerId: string, quantity: number) => void; // Updated to include sellerId
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void; // Added clear cart function
  getItemsBySeller: (sellerId: string) => CartItem[]; // Added to get items by seller
  getUniqueItemCount: () => number; // Benzersiz ürün sayısı için yeni fonksiyon
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Check if the cart has the new structure with sellerId
        if (parsedCart.length > 0 && parsedCart[0].sellerId === undefined) {
          // Migrate old cart data (if needed)
          console.warn('Old cart format detected. Clearing cart.');
          localStorage.removeItem('cart');
        } else {
          setCartItems(parsedCart);
        }
      } catch (e) {
        console.error('Failed to parse cart data', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Sepet değiştiğinde event tetikle
    if (typeof window !== 'undefined') {
      const uniqueItemCount = getUniqueItemCountForItems(cartItems);
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { uniqueItemCount }
      }));
    }
  }, [cartItems]);

  // Benzersiz ürün sayısını hesaplayan yardımcı fonksiyon
  const getUniqueItemCountForItems = (items: CartItem[]) => {
    if (items.length === 0) return 0;
    
    const uniqueItems = new Set(
      items.map(item => `${item.id}-${item.sellerId}`)
    );
    
    return uniqueItems.size;
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      // Check if item with same ID and seller already exists
      const existingItem = prevItems.find(
        cartItem => cartItem.id === item.id && cartItem.sellerId === item.sellerId
      );
      
      if (existingItem) {
        // Ürün zaten sepette, hiçbir şey yapma
        return prevItems;
      } else {
        // Yeni ürünü sepete ekle
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string, sellerId: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === id && item.sellerId === sellerId))
    );
  };

  const updateQuantity = (id: string, sellerId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id, sellerId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.sellerId === sellerId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemsBySeller = (sellerId: string) => {
    return cartItems.filter(item => item.sellerId === sellerId);
  };

  // Benzersiz ürün sayısını döndüren fonksiyon
  const getUniqueItemCount = () => {
    return getUniqueItemCountForItems(cartItems);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice,
      clearCart,
      getItemsBySeller,
      getUniqueItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}