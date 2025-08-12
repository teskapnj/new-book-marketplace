// app/not-found.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// SVG İkonlar
function HomeIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 7 7" />
      <path d="M21 3l-9 7-7 7" />
    </svg>
  );
}

function SearchIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ShoppingCartIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}

function QuestionMarkIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1.83l3.41 3.41a3 3 0 0 1 0 5.83l-3.41 3.41A3 3 0 0 1 9.09 9z" />
      <path d="M12 2v3m0 18v3" />
    </svg>
  );
}

// Popüler ürünler için örnek veri
const popularProducts = [
  {
    id: "1",
    title: "The Great Gatsby",
    price: 4.99,
    image: "/book-listing-cover.png",
    category: "book"
  },
  {
    id: "5",
    title: "The Beatles - Abbey Road",
    price: 12.99,
    image: "/cd-listing-cover.png",
    category: "cd"
  },
  {
    id: "9",
    title: "The Godfather Trilogy",
    price: 19.99,
    image: "/dvd-listing-cover.png",
    category: "dvd"
  },
  {
    id: "13",
    title: "PlayStation 5 - Spider-Man",
    price: 39.99,
    image: "/game-listing-cover.png",
    category: "game"
  }
];

export default function NotFound() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Rastgele öneriler oluştur
    const randomSuggestions = [
      "Try searching for 'books'",
      "Check out our CD collection",
      "Browse DVD deals",
      "Find great games",
      "Look for mix bundles"
    ];
    setSuggestions(randomSuggestions.sort(() => 0.5 - Math.random()).slice(0, 3));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Ana İçerik */}
        <div className="mb-8">
          <div className="inline-block p-4 bg-red-100 rounded-full mb-4">
            <QuestionMarkIcon size={48} className="text-red-500" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Sayfa Bulunamadı
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Aradığınız sayfa mevcut değil, kaldırılmış veya URL'de bir hata olabilir.
            Aşağıdaki önerilerden birini deneyin veya arama yapın.
          </p>
        </div>

        {/* Arama Formu */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Ara
            </button>
          </form>
        </div>

        {/* Hızlı Erişim Linkleri */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
          >
            <HomeIcon size={32} className="text-blue-600 mb-2" />
            <span className="font-medium">Ana Sayfa</span>
          </Link>
          <Link
            href="/browse"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
          >
            <SearchIcon size={32} className="text-blue-600 mb-2" />
            <span className="font-medium">Tüm Ürünler</span>
          </Link>
          <Link
            href="/cart"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
          >
            <ShoppingCartIcon size={32} className="text-blue-600 mb-2" />
            <span className="font-medium">Sepetim</span>
          </Link>
          <Link
            href="/help"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center"
          >
            <QuestionMarkIcon size={32} className="text-blue-600 mb-2" />
            <span className="font-medium">Yardım</span>
          </Link>
        </div>

        {/* Öneriler */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bunları Deneyebilirsiniz:</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(suggestion)}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Popüler Ürünler */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popüler Ürünler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-32 bg-gray-200">
                  <Image 
                    src={product.image} 
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1 line-clamp-1">{product.title}</h4>
                  <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Ek Bilgi */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Sorun devam ediyorsa lütfen{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              bizimle iletişime geçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}