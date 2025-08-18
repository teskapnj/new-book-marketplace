// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  image?: string;
  condition: string;
  seller?: string;
  sellerName?: string;
  category?: string;
  totalItems?: number;
  vendorId?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  
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
  
  const getConditionColor = (condition: string) => {
    return condition === 'like-new' 
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
      : 'bg-amber-50 text-amber-700 border border-amber-200';
  };
  
  // Image handling with fallback
  const productImage = product.imageUrl || product.image;
  const sellerName = product.sellerName || product.seller || "Anonymous Seller";
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };
  
  // Sepete ekleme fonksiyonu - image hatası düzeltildi
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Image için güvenli bir değer oluştur
    const safeImage = productImage && productImage.startsWith('http') 
      ? productImage 
      : ''; // Geçersiz URL için boş string
    
    addToCart({
      id: product.id,
      sellerId: product.vendorId || sellerName,
      title: product.title,
      price: product.price,
      image: safeImage // Artık her zaman string olacak
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    
    console.log("Added to cart:", product.title);
  };
  
  // URL validation for display
  const isValidImageUrl = productImage && 
    (productImage.startsWith('https://firebasestorage.googleapis.com') || 
     productImage.startsWith('https://storage.googleapis.com'));
  
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
          {isValidImageUrl && !imageError ? (
            <Image
              src={productImage}
              alt="Product image"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={true}
            />
          ) : imageLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">{getCategoryIcon(product.category || 'mix')}</span>
            </div>
          )}
          
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
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.category && (
                <span className="text-xs text-gray-500 capitalize">{product.category}</span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleAddToCart}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                addedToCart 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {addedToCart ? 'Added!' : 'Add to Cart'}
            </button>
            
            <button className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}