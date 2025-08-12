// components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  seller: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">
        <div className="relative h-48 bg-gray-200">
          <Image 
            src={product.image} 
            alt={product.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {product.condition}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.title}</h3>
          <p className="text-gray-500 text-sm mb-2">Sold by {product.seller}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}