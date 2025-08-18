// components/CartIcon.tsx
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  size?: number;
  className?: string;
}

export default function CartIcon({ size = 24, className = "" }: CartIconProps) {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  const handleClick = () => {
    router.push('/cart');
  };

  return (
    <button 
      onClick={handleClick}
      className={`relative ${className}`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
}