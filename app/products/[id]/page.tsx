// app/products/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

// SVG İkonlar (aynı)
function ArrowLeftIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"></polyline>
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

function HeartIcon({ size = 24, className = "", filled = false }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}

function ShareIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );
}

// 🔄 TÜM KATEGORİLERİN TÜM ÜRÜNLERİNİ İÇEREN ARRAY
const allProducts = [
  // KİTAPLAR
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 4.99,
    originalPrice: 12.99,
    condition: "Like New",
    seller: "BookLover123",
    sellerRating: 4.8,
    images: ["/book-listing-cover.png", "/book-listing-cover.png", "/book-listing-cover.png"],
    description: "A classic American novel set in the Jazz Age. The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion and obsession with the beautiful former debutante Daisy Buchanan.",
    features: ["ISBN: 9780743273565", "Publisher: Scribner", "Language: English", "Pages: 180"],
    category: "book"
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 6.99,
    originalPrice: 14.99,
    condition: "Very Good",
    seller: "ClassicBooks",
    sellerRating: 4.9,
    images: ["/book-listing-cover.png", "/book-listing-cover.png", "/book-listing-cover.png"],
    description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
    features: ["ISBN: 9780061120084", "Publisher: Harper Perennial", "Language: English", "Pages: 336"],
    category: "book"
  },
  {
    id: "3",
    title: "1984 by George Orwell",
    author: "George Orwell",
    price: 5.49,
    originalPrice: 11.99,
    condition: "Good",
    seller: "DystopianBooks",
    sellerRating: 4.7,
    images: ["/book-listing-cover.png", "/book-listing-cover.png", "/book-listing-cover.png"],
    description: "A dystopian social science fiction novel and cautionary tale written by English writer George Orwell.",
    features: ["ISBN: 9780451524935", "Publisher: Signet Classic", "Language: English", "Pages: 328"],
    category: "book"
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 7.99,
    originalPrice: 13.99,
    condition: "Like New",
    seller: "RomanceReader",
    sellerRating: 4.8,
    images: ["/book-listing-cover.png", "/book-listing-cover.png", "/book-listing-cover.png"],
    description: "A romantic novel of manners written by Jane Austen, set in rural England in the early 19th century.",
    features: ["ISBN: 9781503290563", "Publisher: Penguin Classics", "Language: English", "Pages: 432"],
    category: "book"
  },
  
  // CD'LER
  {
    id: "5",
    title: "The Beatles - Abbey Road",
    artist: "The Beatles",
    price: 12.99,
    originalPrice: 19.99,
    condition: "Very Good",
    seller: "VinylCollector",
    sellerRating: 4.7,
    images: ["/cd-listing-cover.png", "/cd-listing-cover.png", "/cd-listing-cover.png"],
    description: "The eleventh studio album by the English rock band the Beatles, released on 26 September 1969 by Apple Records.",
    features: ["Format: CD", "Label: Apple Records", "Genre: Rock", "Tracks: 17"],
    category: "cd"
  },
  {
    id: "6",
    title: "Pink Floyd - The Wall",
    artist: "Pink Floyd",
    price: 14.99,
    originalPrice: 21.99,
    condition: "Good",
    seller: "RockMusic",
    sellerRating: 4.6,
    images: ["/cd-listing-cover.png", "/cd-listing-cover.png", "/cd-listing-cover.png"],
    description: "The eleventh studio album by English rock band Pink Floyd, released as a double album on 30 November 1979.",
    features: ["Format: CD", "Label: Columbia", "Genre: Progressive Rock", "Tracks: 26"],
    category: "cd"
  },
  {
    id: "7",
    title: "Michael Jackson - Thriller",
    artist: "Michael Jackson",
    price: 11.99,
    originalPrice: 16.99,
    condition: "Like New",
    seller: "PopMusic",
    sellerRating: 4.9,
    images: ["/cd-listing-cover.png", "/cd-listing-cover.png", "/cd-listing-cover.png"],
    description: "The sixth studio album by American singer Michael Jackson, released on November 30, 1982.",
    features: ["Format: CD", "Label: Epic", "Genre: Pop", "Tracks: 9"],
    category: "cd"
  },
  {
    id: "8",
    title: "Queen - A Night at the Opera",
    artist: "Queen",
    price: 13.49,
    originalPrice: 18.99,
    condition: "Very Good",
    seller: "ClassicRock",
    sellerRating: 4.8,
    images: ["/cd-listing-cover.png", "/cd-listing-cover.png", "/cd-listing-cover.png"],
    description: "The fourth studio album by the British rock band Queen, released on 21 November 1975.",
    features: ["Format: CD", "Label: EMI", "Genre: Rock", "Tracks: 12"],
    category: "cd"
  },
  
  // DVD'LER
  {
    id: "9",
    title: "The Godfather Trilogy",
    director: "Francis Ford Coppola",
    price: 19.99,
    originalPrice: 29.99,
    condition: "Like New",
    seller: "MovieBuff",
    sellerRating: 4.8,
    images: ["/dvd-listing-cover.png", "/dvd-listing-cover.png", "/dvd-listing-cover.png"],
    description: "The epic trilogy following the Corleone family, an Italian-American crime family led by Vito Corleone.",
    features: ["Format: DVD", "Rating: R", "Runtime: 9 hours", "Discs: 3"],
    category: "dvd"
  },
  {
    id: "10",
    title: "Breaking Bad Complete Series",
    director: "Vince Gilligan",
    price: 29.99,
    originalPrice: 49.99,
    condition: "Good",
    seller: "TVShows",
    sellerRating: 4.9,
    images: ["/dvd-listing-cover.png", "/dvd-listing-cover.png", "/dvd-listing-cover.png"],
    description: "The complete series of the American crime drama television series created by Vince Gilligan.",
    features: ["Format: DVD", "Rating: TV-MA", "Seasons: 5", "Discs: 16"],
    category: "dvd"
  },
  {
    id: "11",
    title: "The Lord of the Rings Trilogy",
    director: "Peter Jackson",
    price: 24.99,
    originalPrice: 39.99,
    condition: "Like New",
    seller: "FantasyMovies",
    sellerRating: 4.7,
    images: ["/dvd-listing-cover.png", "/dvd-listing-cover.png", "/dvd-listing-cover.png"],
    description: "Epic fantasy adventure films based on the novel by J. R. R. Tolkien.",
    features: ["Format: DVD", "Rating: PG-13", "Runtime: 9 hours", "Discs: 6"],
    category: "dvd"
  },
  {
    id: "12",
    title: "Friends Complete Series",
    director: "Various",
    price: 34.99,
    originalPrice: 59.99,
    condition: "Very Good",
    seller: "SitcomFan",
    sellerRating: 4.8,
    images: ["/dvd-listing-cover.png", "/dvd-listing-cover.png", "/dvd-listing-cover.png"],
    description: "The complete series of the American television sitcom created by David Crane and Marta Kauffman.",
    features: ["Format: DVD", "Rating: TV-14", "Seasons: 10", "Discs: 20"],
    category: "dvd"
  },
  
  // OYUNLAR
  {
    id: "13",
    title: "PlayStation 5 - Spider-Man",
    platform: "PS5",
    price: 39.99,
    originalPrice: 59.99,
    condition: "Like New",
    seller: "GamerPro",
    sellerRating: 4.6,
    images: ["/game-listing-cover.png", "/game-listing-cover.png", "/game-listing-cover.png"],
    description: "Experience the rise of Miles Morales as the new hero mastering incredible, explosive new powers to become his own Spider-Man.",
    features: ["Platform: PlayStation 5", "Genre: Action-Adventure", "ESRB: T", "Players: 1"],
    category: "game"
  },
  {
    id: "14",
    title: "Nintendo Switch - Animal Crossing",
    platform: "Nintendo Switch",
    price: 49.99,
    originalPrice: 59.99,
    condition: "Very Good",
    seller: "NintendoFan",
    sellerRating: 4.9,
    images: ["/game-listing-cover.png", "/game-listing-cover.png", "/game-listing-cover.png"],
    description: "A social simulation game developed and published by Nintendo for the Nintendo Switch.",
    features: ["Platform: Nintendo Switch", "Genre: Simulation", "ESRB: E", "Players: 1"],
    category: "game"
  },
  {
    id: "15",
    title: "Xbox Series X - Halo Infinite",
    platform: "Xbox Series X",
    price: 44.99,
    originalPrice: 69.99,
    condition: "Good",
    seller: "XboxGamer",
    sellerRating: 4.5,
    images: ["/game-listing-cover.png", "/game-listing-cover.png", "/game-listing-cover.png"],
    description: "The sixth mainline installment in the Halo series and the third Halo game from 343 Industries.",
    features: ["Platform: Xbox Series X", "Genre: FPS", "ESRB: M", "Players: 1"],
    category: "game"
  },
  {
    id: "16",
    title: "PC - Cyberpunk 2077",
    platform: "PC",
    price: 29.99,
    originalPrice: 59.99,
    condition: "Like New",
    seller: "PCMasterRace",
    sellerRating: 4.4,
    images: ["/game-listing-cover.png", "/game-listing-cover.png", "/game-listing-cover.png"],
    description: "An open-world, action-adventure role-playing video game developed and published by CD Projekt.",
    features: ["Platform: PC", "Genre: RPG", "ESRB: M", "Players: 1"],
    category: "game"
  },
  
  // MIX PAKETLER
  {
    id: "17",
    title: "Classic Media Bundle",
    price: 24.99,
    originalPrice: 39.99,
    condition: "Like New",
    seller: "MediaCollector",
    sellerRating: 4.5,
    images: ["/mix-listing-cover.png", "/mix-listing-cover.png", "/mix-listing-cover.png"],
    description: "Perfect starter pack for media lovers! Includes a classic novel, music CD, and movie DVD.",
    features: ["Includes: Book + CD + DVD", "Genres: Various", "Condition: Like New", "Value: $40+"],
    category: "mix"
  },
  {
    id: "18",
    title: "Gamer's Starter Pack",
    price: 59.99,
    originalPrice: 89.99,
    condition: "Very Good",
    seller: "GameWorld",
    sellerRating: 4.6,
    images: ["/mix-listing-cover.png", "/mix-listing-cover.png", "/mix-listing-cover.png"],
    description: "Perfect for new gamers! Includes 2 strategy games and a gaming guide book.",
    features: ["Includes: 2 Games + Book", "Genres: Strategy", "Condition: Very Good", "Value: $90+"],
    category: "mix"
  },
  {
    id: "19",
    title: "Movie Night Bundle",
    price: 34.99,
    originalPrice: 54.99,
    condition: "Good",
    seller: "CinemaLover",
    sellerRating: 4.7,
    images: ["/mix-listing-cover.png", "/mix-listing-cover.png", "/mix-listing-cover.png"],
    description: "Everything you need for a perfect movie night! Includes 3 popular movies and popcorn maker.",
    features: ["Includes: 3 Movies + Popcorn Maker", "Genres: Various", "Condition: Good", "Value: $55+"],
    category: "mix"
  },
  {
    id: "20",
    title: "Music Lover's Collection",
    price: 42.99,
    originalPrice: 69.99,
    condition: "Like New",
    seller: "MusicEnthusiast",
    sellerRating: 4.8,
    images: ["/mix-listing-cover.png", "/mix-listing-cover.png", "/mix-listing-cover.png"],
    description: "For the ultimate music fan! Includes 4 classic rock CDs and a band biography book.",
    features: ["Includes: 4 CDs + Book", "Genres: Rock", "Condition: Like New", "Value: $70+"],
    category: "mix"
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const { id } = use(params);
  const product = allProducts.find(p => p.id === id);

  useEffect(() => {
    setLoading(false);
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      //quantity: quantity
    });
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0]
      });
    }
  };

  const handleShare = async () => {
    if (!product) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title} on MarketPlace!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Added to cart successfully!
        </div>
      )}

      {/* Back Button */}
      <div className="bg-white shadow-sm p-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-600 font-medium"
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back to results
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <Image 
                src={product.images[0]} 
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-24 bg-gray-200 rounded overflow-hidden">
                  <Image 
                    src={image} 
                    alt={`${product.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{product.title}</h1>
              {product.author && <p className="text-gray-600">by {product.author}</p>}
              {product.artist && <p className="text-gray-600">by {product.artist}</p>}
              {product.director && <p className="text-gray-600">Directed by {product.director}</p>}
              {product.platform && <p className="text-gray-600">Platform: {product.platform}</p>}
              
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.sellerRating} (128 reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Condition:</span>
                <span className="font-medium">{product.condition}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Seller:</span>
                <span className="font-medium text-blue-600">{product.seller}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Category:</span>
                <span className="font-medium capitalize">{product.category}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={!product}
                  className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center ${
                    !product ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <ShoppingCartIcon size={20} className="mr-2" />
                  Add to Cart
                </button>
                <button 
                  onClick={handleWishlist}
                  disabled={!product}
                  className={`p-3 border rounded-lg hover:bg-gray-100 transition ${
                    isInWishlist(product?.id) ? 'text-red-500 border-red-500' : 'text-gray-500'
                  }`}
                >
                  <HeartIcon size={20} filled={isInWishlist(product?.id)} />
                </button>
                <button 
                  onClick={handleShare}
                  disabled={!product}
                  className="p-3 border rounded-lg hover:bg-gray-100 transition"
                >
                  <ShareIcon size={20} />
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-3">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-3">Product Details</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}