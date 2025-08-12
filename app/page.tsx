// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

// SVG İkon Bileşenleri
function SearchIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );
}

function CartIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

function UserIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function MenuIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  );
}

function CloseIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // DAHA FAZLA ÜRÜN EKLENDİ
  const featuredProducts = [
    // Kitaplar
    {
      id: "1",
      title: "The Great Gatsby",
      price: 4.99,
      image: "/book-listing-cover.png",
      condition: "Like New",
      seller: "BookLover123"
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      price: 6.99,
      image: "/book-listing-cover.png",
      condition: "Very Good",
      seller: "ClassicBooks"
    },
    {
      id: "3",
      title: "1984 by George Orwell",
      price: 5.49,
      image: "/book-listing-cover.png",
      condition: "Good",
      seller: "DystopianBooks"
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      price: 7.99,
      image: "/book-listing-cover.png",
      condition: "Like New",
      seller: "RomanceReader"
    },
    // CD'ler
    {
      id: "5",
      title: "The Beatles - Abbey Road",
      price: 12.99,
      image: "/cd-listing-cover.png",
      condition: "Very Good",
      seller: "VinylCollector"
    },
    {
      id: "6",
      title: "Pink Floyd - The Wall",
      price: 14.99,
      image: "/cd-listing-cover.png",
      condition: "Good",
      seller: "RockMusic"
    },
    {
      id: "7",
      title: "Michael Jackson - Thriller",
      price: 11.99,
      image: "/cd-listing-cover.png",
      condition: "Like New",
      seller: "PopMusic"
    },
    {
      id: "8",
      title: "Queen - A Night at the Opera",
      price: 13.49,
      image: "/cd-listing-cover.png",
      condition: "Very Good",
      seller: "ClassicRock"
    },
    // DVD'ler
    {
      id: "9",
      title: "The Godfather Trilogy",
      price: 19.99,
      image: "/dvd-listing-cover.png",
      condition: "Like New",
      seller: "MovieBuff"
    },
    {
      id: "10",
      title: "Breaking Bad Complete Series",
      price: 29.99,
      image: "/dvd-listing-cover.png",
      condition: "Good",
      seller: "TVShows"
    },
    {
      id: "11",
      title: "The Lord of the Rings Trilogy",
      price: 24.99,
      image: "/dvd-listing-cover.png",
      condition: "Like New",
      seller: "FantasyMovies"
    },
    {
      id: "12",
      title: "Friends Complete Series",
      price: 34.99,
      image: "/dvd-listing-cover.png",
      condition: "Very Good",
      seller: "SitcomFan"
    },
    // Oyunlar
    {
      id: "13",
      title: "PlayStation 5 - Spider-Man",
      price: 39.99,
      image: "/game-listing-cover.png",
      condition: "Like New",
      seller: "GamerPro"
    },
    {
      id: "14",
      title: "Nintendo Switch - Animal Crossing",
      price: 49.99,
      image: "/game-listing-cover.png",
      condition: "Very Good",
      seller: "NintendoFan"
    },
    {
      id: "15",
      title: "Xbox Series X - Halo Infinite",
      price: 44.99,
      image: "/game-listing-cover.png",
      condition: "Good",
      seller: "XboxGamer"
    },
    {
      id: "16",
      title: "PC - Cyberpunk 2077",
      price: 29.99,
      image: "/game-listing-cover.png",
      condition: "Like New",
      seller: "PCMasterRace"
    },
    // Mix Paketler
    {
      id: "17",
      title: "Classic Media Bundle",
      price: 24.99,
      image: "/mix-listing-cover.png",
      condition: "Like New",
      seller: "MediaCollector",
      category: "mix",
      description: "Includes: 1 classic book, 1 music CD, 1 movie DVD"
    },
    {
      id: "18",
      title: "Gamer's Starter Pack",
      price: 59.99,
      image: "/mix-listing-cover.png",
      condition: "Very Good",
      seller: "GameWorld",
      category: "mix",
      description: "Includes: 2 strategy games, 1 gaming guide book"
    },
    {
      id: "19",
      title: "Movie Night Bundle",
      price: 34.99,
      image: "/mix-listing-cover.png",
      condition: "Good",
      seller: "CinemaLover",
      category: "mix",
      description: "Includes: 3 popular movies, 1 popcorn maker"
    },
    {
      id: "20",
      title: "Music Lover's Collection",
      price: 42.99,
      image: "/mix-listing-cover.png",
      condition: "Like New",
      seller: "MusicEnthusiast",
      category: "mix",
      description: "Includes: 4 classic rock CDs, 1 band biography book"
    }
  ];

  const categories = [
    { name: "Books", icon: "📚", href: "/browse?category=book" },
    { name: "CDs", icon: "💿", href: "/browse?category=cd" },
    { name: "DVDs", icon: "📀", href: "/browse?category=dvd" },
    { name: "Games", icon: "🎮", href: "/browse?category=game" },
    { name: "Mix Bundles", icon: "🎁", href: "/browse?category=mix" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobil Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
        </button>
        <div className="text-xl font-bold text-blue-600">MarketPlace</div>
        <div className="flex space-x-3">
          <SearchIcon size={20} />
          <CartIcon size={20} />
        </div>
      </div>

      {/* Mobil Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4">
          <div className="flex flex-col space-y-4">
            <Link href="/sell" className="font-medium">Sell Items</Link>
            <Link href="/login" className="font-medium">Login</Link>
            <Link href="/register" className="font-medium">Register</Link>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <header className="hidden md:flex bg-white shadow-sm p-4 items-center justify-between">
        <div className="flex items-center space-x-10">
          <div className="text-2xl font-bold text-blue-600">MarketPlace</div>
          <nav className="hidden lg:flex space-x-6">
            <Link href="/browse?category=book" className="font-medium hover:text-blue-600">Books</Link>
            <Link href="/browse?category=cd" className="font-medium hover:text-blue-600">CDs</Link>
            <Link href="/browse?category=dvd" className="font-medium hover:text-blue-600">DVDs</Link>
            <Link href="/browse?category=game" className="font-medium hover:text-blue-600">Games</Link>
            <Link href="/browse?category=mix" className="font-medium hover:text-blue-600">Mix Bundles</Link>
          </nav>
        </div>

        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/sell" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Sell Items
          </Link>
          <Link href="/login" className="font-medium">Login</Link>
          <div className="flex space-x-3">
            <UserIcon size={20} />
            <CartIcon size={20} />
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Buy & Sell Used Media</h1>
          <p className="text-lg mb-6">Find great deals on books, CDs, DVDs, games, and mix bundles. List your items in seconds!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/sell" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              Start Selling
            </Link>
            <Link href="/browse" className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
              Browse All Items
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name}
                href={category.href}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition flex flex-col items-center"
              >
                <span className="text-4xl mb-3">{category.icon}</span>
                <h3 className="font-medium text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Listings</h2>
            <Link href="/browse" className="text-blue-600 font-medium hover:underline">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">List Your Items</h3>
              <p className="text-gray-600">Scan ISBN or manually list your used books, CDs, DVDs, games, or create mix bundles.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Get Paid</h3>
              <p className="text-gray-600">When your item sells, we handle payment processing and transfer funds to you.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Ship & Track</h3>
              <p className="text-gray-600">Ship the item and add tracking. Funds are released after delivery confirmation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Join thousands of sellers earning money from their used media and mix bundles.</p>
          <Link href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition inline-block">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MarketPlace</h3>
            <p className="text-gray-400">Buy and sell used books, CDs, DVDs, games, and mix bundles with confidence.</p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">For Buyers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/browse" className="hover:text-white">Browse Items</Link></li>
              <li><Link href="/how-to-buy" className="hover:text-white">How to Buy</Link></li>
              <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">For Sellers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/sell" className="hover:text-white">Start Selling</Link></li>
              <li><Link href="/fees" className="hover:text-white">Seller Fees</Link></li>
              <li><Link href="/seller-protection" className="hover:text-white">Seller Protection</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2023 MarketPlace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}