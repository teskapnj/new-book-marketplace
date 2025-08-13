// app/browse/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

// SVG İkon Bileşenleri
function FilterIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );
}

function GridIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}

function ListIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );
}

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // URL'den kategori parametresini oku
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // TÜM ÜRÜNLER - ANA SAYFA İLE AYNI
  const allProducts = [
    // Kitaplar
    {
      id: "1",
      title: "The Great Gatsby",
      price: 4.99,
      image: "/book-listing-cover.png",
      condition: "Like New",
      seller: "BookLover123",
      category: "book"
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      price: 6.99,
      image: "/book-listing-cover.png",
      condition: "Very Good",
      seller: "ClassicBooks",
      category: "book"
    },
    {
      id: "3",
      title: "1984 by George Orwell",
      price: 5.49,
      image: "/book-listing-cover.png",
      condition: "Good",
      seller: "DystopianBooks",
      category: "book"
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      price: 7.99,
      image: "/book-listing-cover.png",
      condition: "Like New",
      seller: "RomanceReader",
      category: "book"
    },
    // CD'ler
    {
      id: "5",
      title: "The Beatles - Abbey Road",
      price: 12.99,
      image: "/cd-listing-cover.png",
      condition: "Very Good",
      seller: "VinylCollector",
      category: "cd"
    },
    {
      id: "6",
      title: "Pink Floyd - The Wall",
      price: 14.99,
      image: "/cd-listing-cover.png",
      condition: "Good",
      seller: "RockMusic",
      category: "cd"
    },
    {
      id: "7",
      title: "Michael Jackson - Thriller",
      price: 11.99,
      image: "/cd-listing-cover.png",
      condition: "Like New",
      seller: "PopMusic",
      category: "cd"
    },
    {
      id: "8",
      title: "Queen - A Night at the Opera",
      price: 13.49,
      image: "/cd-listing-cover.png",
      condition: "Very Good",
      seller: "ClassicRock",
      category: "cd"
    },
    // DVD'ler
    {
      id: "9",
      title: "The Godfather Trilogy",
      price: 19.99,
      image: "/dvd-listing-cover.png",
      condition: "Like New",
      seller: "MovieBuff",
      category: "dvd"
    },
    {
      id: "10",
      title: "Breaking Bad Complete Series",
      price: 29.99,
      image: "/dvd-listing-cover.png",
      condition: "Good",
      seller: "TVShows",
      category: "dvd"
    },
    {
      id: "11",
      title: "The Lord of the Rings Trilogy",
      price: 24.99,
      image: "/dvd-listing-cover.png",
      condition: "Like New",
      seller: "FantasyMovies",
      category: "dvd"
    },
    {
      id: "12",
      title: "Friends Complete Series",
      price: 34.99,
      image: "/dvd-listing-cover.png",
      condition: "Very Good",
      seller: "SitcomFan",
      category: "dvd"
    },
    // Oyunlar
    {
      id: "13",
      title: "PlayStation 5 - Spider-Man",
      price: 39.99,
      image: "/game-listing-cover.png",
      condition: "Like New",
      seller: "GamerPro",
      category: "game"
    },
    {
      id: "14",
      title: "Nintendo Switch - Animal Crossing",
      price: 49.99,
      image: "/game-listing-cover.png",
      condition: "Very Good",
      seller: "NintendoFan",
      category: "game"
    },
    {
      id: "15",
      title: "Xbox Series X - Halo Infinite",
      price: 44.99,
      image: "/game-listing-cover.png",
      condition: "Good",
      seller: "XboxGamer",
      category: "game"
    },
    {
      id: "16",
      title: "PC - Cyberpunk 2077",
      price: 29.99,
      image: "/game-listing-cover.png",
      condition: "Like New",
      seller: "PCMasterRace",
      category: "game"
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

  // Filtreleme ve sıralama
  const filteredProducts = allProducts
    .filter(product => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "newest": return b.id.localeCompare(a.id);
        default: return 0;
      }
    });

  const categories = [
    { id: "all", name: "All Categories", count: allProducts.length },
    { id: "mix", name: "🎁 Mix Bundles", count: allProducts.filter(p => p.category === "mix").length },
    { id: "book", name: "📚 Books", count: allProducts.filter(p => p.category === "book").length },
    { id: "cd", name: "💿 CDs", count: allProducts.filter(p => p.category === "cd").length },
    { id: "dvd", name: "📀 DVDs/Blu-rays", count: allProducts.filter(p => p.category === "dvd").length },
    { id: "game", name: "🎮 Games", count: allProducts.filter(p => p.category === "game").length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-600 font-medium">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold">
              {selectedCategory === "all" ? "Browse All Items" : 
               selectedCategory === "mix" ? "Mix Bundles" :
               selectedCategory === "book" ? "Books" :
               selectedCategory === "cd" ? "CDs" :
               selectedCategory === "dvd" ? "DVDs/Blu-rays" :
               selectedCategory === "game" ? "Games" : "Browse Items"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex border rounded-lg">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : ""}`}
              >
                <GridIcon size={20} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-100 text-blue-600" : ""}`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                <button 
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 100]);
                  }}
                  className="text-blue-600 text-sm"
                >
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="mr-2"
                        />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-gray-500 text-sm">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {allProducts.length} items
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm p-4 flex">
                    <div className="relative h-24 w-24 bg-gray-200 rounded mr-4 flex-shrink-0">
                      <Image 
                        src={product.image} 
                        alt={product.title}
                        width={96}
                        height={96}
                        className="object-cover rounded"
                      />
                      {product.category === "mix" && (
                        <div className="absolute top-0 left-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-br rounded-tl">
                          🎁 Bundle
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{product.title}</h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-1">{product.description}</p>
                      )}
                      <p className="text-gray-500 text-sm">Sold by {product.seller}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        <Link href={`/products/${product.id}`}>
                          <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your filters.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 100]);
                  }}
                  className="mt-4 text-blue-600 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}