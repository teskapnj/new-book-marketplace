// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl?: string; // Updated to match your data structure
  image?: string; // Keep for backward compatibility
  condition: string;
  seller?: string;
  sellerName?: string; // Updated to match your data structure
  category?: string;
  totalItems?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  
  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    const icons = {
      book: "📚",
      cd: "💿",
      dvd: "📀",
      game: "🎮",
      mix: "📦"
    };
    return icons[category as keyof typeof icons] || "📦";
  };

  // Helper function to get condition styling
  const getConditionColor = (condition: string) => {
    return condition === 'like-new' 
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
      : 'bg-amber-50 text-amber-700 border border-amber-200';
  };

  // Use imageUrl if available, fallback to image for compatibility
  const productImage = product.imageUrl || product.image;
  const sellerName = product.sellerName || product.seller || "Anonymous Seller";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
          {productImage && !imageError ? (
            <Image
              src={productImage}
              alt="Product image"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">{getCategoryIcon(product.category || 'mix')}</span>
            </div>
          )}
          
          {/* Condition badge only */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getConditionColor(product.condition)}`}>
              {product.condition === "like-new" ? "Like New" : "Good"}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3">
            by <span className="font-medium">{sellerName}</span>
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.category && (
                <span className="text-xs text-gray-500 capitalize">{product.category}</span>
              )}
            </div>
            
            <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}