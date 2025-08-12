// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

// 🔄 İkonu doğrudan burada tanımla
function ShoppingCartIcon({ size = 24, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

export default function Navbar() {
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              MarketPlace
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/browse" className="text-gray-700 hover:text-blue-600">
              Browse
            </Link>
            <Link href="/sell" className="text-gray-700 hover:text-blue-600">
              Sell
            </Link>
            
            {/* Sepet Butonu */}
            <Link href="/cart" className="relative p-2">
              <ShoppingCartIcon size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {/* Mobil Menü Butonu */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}