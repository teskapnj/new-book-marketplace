// app/[category]/not-found.tsx - Güvenli Versiyon
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sanitizeInput } from "@/lib/auth-utils"; // Güvenlik için eklendi

// Kategori ikonları
const categoryIcons = {
  books: "📚",
  cds: "💿", 
  dvds: "📀",
  games: "🎮",
  mix: "🎁"
};

// Güvenli kategori listesi
const allowedCategories = Object.keys(categoryIcons);

export default function CategoryNotFound() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  
  // URL'den kategoriyi güvenli şekilde çıkar
  const rawCategory = pathname.split('/')[1];
  const sanitizedCategory = sanitizeInput(rawCategory).toLowerCase();
  
  // Kategori validation
  const isValidCategory = allowedCategories.includes(sanitizedCategory);
  const category = isValidCategory ? sanitizedCategory : 'books'; // Fallback
  
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  const icon = categoryIcons[category as keyof typeof categoryIcons];

  // Güvenli arama fonksiyonu
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedQuery = sanitizeInput(searchQuery);
    
    if (sanitizedQuery.length > 0) {
      // URL encoding ile güvenli yönlendirme
      const encodedQuery = encodeURIComponent(sanitizedQuery);
      router.push(`/search?q=${encodedQuery}&category=${category}`);
    }
  };

  // Input değişikliği
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setSearchQuery(sanitizedValue);
  };

  const relatedProducts = [
    {
      id: "1",
      title: `${categoryName} Örnek 1`,
      price: 9.99,
      image: `/${category}-listing-cover.png`
    },
    {
      id: "2", 
      title: `${categoryName} Örnek 2`,
      price: 14.99,
      image: `/${category}-listing-cover.png`
    },
    {
      id: "3",
      title: `${categoryName} Örnek 3`, 
      price: 19.99,
      image: `/${category}-listing-cover.png`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Güvenlik uyarısı (geçersiz kategori için) */}
        {!isValidCategory && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="text-yellow-400 text-xl mr-3">⚠️</div>
              <div>
                <p className="text-yellow-700 font-medium">Invalid Category</p>
                <p className="text-yellow-600 text-sm">Showing default category instead</p>
              </div>
            </div>
          </div>
        )}

        {/* Kategori Bilgisi */}
        <div className="mb-8">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryName} Kategorisi
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            No products were found in this category.
          </p>
        </div>

        {/* Hızlı Erişim */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="text-4xl mb-2">🏠</div>
            <span className="font-medium">Home page</span>
          </Link>
          <Link
            href="/browse"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="text-4xl mb-2">🔍</div>
            <span className="font-medium">All products</span>
          </Link>
          <Link
            href={`/${category}`}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="text-4xl mb-2">{icon}</div>
            <span className="font-medium">{categoryName}</span>
          </Link>
        </div>

        {/* İlgili Ürünler */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {categoryName} Popular Products in This Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="relative h-48 bg-gray-200">
                  {/* Placeholder for product image */}
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1">{product.title}</h4>
                  <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Güvenli Arama Formu */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Couldn't find what you were looking for?
          </h3>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={`${categoryName} kategorisinde ara...`}
              maxLength={100} // Güvenlik: uzunluk sınırı
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button 
              type="submit"
              disabled={searchQuery.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Ara
            </button>
          </form>
        </div>

        {/* Diğer Kategoriler */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Explore Other Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(categoryIcons).map(([key, icon]) => (
              <Link
                key={key}
                href={`/${key}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="text-3xl mb-2">{icon}</span>
                <span className="font-medium capitalize">{key}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}