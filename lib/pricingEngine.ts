// /lib/pricingEngine.ts
// Amazon ürün fiyatlandırma motoru - DÜZELTILMIŞ VERSİYON
export interface AmazonProduct {
  title: string;
  image: string;
  price: number;
  sales_rank: number;
  category: string;
  asin?: string;
}
export interface PricingResult {
  accepted: boolean;
  ourPrice?: number;
  reason?: string;
  category: ProductCategory;
  priceRange?: string;
  rankRange?: string;
}
export type ProductCategory = 'books' | 'cds' | 'dvds' | 'games' | 'unknown';
/**
 * Amazon kategorisini bizim kategori sistemimize çevirir
 */
export function detectCategory(amazonCategory: string): ProductCategory {
  const category = amazonCategory.toLowerCase();
  
  if (category.includes('book') || category.includes('kindle')) {
    return 'books';
  }
  
  if (category.includes('cd') || category.includes('vinyl') || category.includes('music')) {
    return 'cds';
  }
  
  if (category.includes('dvd') || category.includes('blu-ray') || category.includes('movie') || category.includes('tv')) {
    return 'dvds';
  }
  
  if (category.includes('game') || category.includes('video game') || category.includes('gaming')) {
    return 'games';
  }
  
  return 'unknown';
}
/**
 * Kitap kategorisi için fiyatlandırma kuralları - DÜZELTİLDİ
 */
function calculateBookPrice(price: number, salesRank: number): PricingResult {
  // Rank control
  if (salesRank > 2000000) {
    return {
      accepted: false,
      reason: "Sales rank too low (over 2 million)",
      category: 'books',
      rankRange: "> 2,000,000"
    };
  }
  
  // 1 million and below rank
  if (salesRank <= 1000000) {
    if (price > 23 && price < 31) {
      return { accepted: true, ourPrice: 1.5, category: 'books', priceRange: "$24-30.99", rankRange: "≤ 1M" };
    }
    if (price >= 31 && price < 41) {
      return { accepted: true, ourPrice: 2.5, category: 'books', priceRange: "$31-40.99", rankRange: "≤ 1M" };
    }
    if (price >= 41 && price < 51) {
      return { accepted: true, ourPrice: 3.5, category: 'books', priceRange: "$41-50.99", rankRange: "≤ 1M" };
    }
    if (price >= 51 && price < 61) {
      return { accepted: true, ourPrice: 4.5, category: 'books', priceRange: "$51-60.99", rankRange: "≤ 1M" };
    }
    if (price >= 61 && price < 91) {
      return { accepted: true, ourPrice: 5.5, category: 'books', priceRange: "$61-90.99", rankRange: "≤ 1M" };
    }
    if (price >= 91 && price < 121) {
      return { accepted: true, ourPrice: 6.5, category: 'books', priceRange: "$91-120.99", rankRange: "≤ 1M" };
    }
    if (price >= 121) {
      return { accepted: true, ourPrice: 7.5, category: 'books', priceRange: "$121+", rankRange: "≤ 1M" };
    }
    
    return {
      accepted: false,
      reason: "Price doesn't fit our range (minimum $24)",
      category: 'books',
      priceRange: `$${price} (min: $24)`
    };
  }
  
  // 1-2 million range rank
  if (salesRank <= 2000000) {
    if (price >= 51 && price < 61) {
      return { accepted: true, ourPrice: 2.5, category: 'books', priceRange: "$51-60.99", rankRange: "1M-2M" };
    }
    if (price >= 61 && price < 91) {
      return { accepted: true, ourPrice: 3.5, category: 'books', priceRange: "$61-90.99", rankRange: "1M-2M" };
    }
    if (price >= 91 && price < 121) {
      return { accepted: true, ourPrice: 4.5, category: 'books', priceRange: "$91-120.99", rankRange: "1M-2M" };
    }
    if (price >= 121) {
      return { accepted: true, ourPrice: 5.5, category: 'books', priceRange: "$121+", rankRange: "1M-2M" };
    }
    
    return {
      accepted: false,
      reason: "Price doesn't fit our range (minimum $51)",
      category: 'books',
      priceRange: `$${price} (min: $51)`
    };
  }
  
  return {
    accepted: false,
    reason: "Unknown rank range",
    category: 'books'
  };
}
/**
 * CD kategorisi için fiyatlandırma kuralları - DÜZELTİLDİ
 */
function calculateCDPrice(price: number, salesRank: number): PricingResult {
  // Rank control
  if (salesRank > 300000) {
    return {
      accepted: false,
      reason: "Sales rank too low (over 300k)",
      category: 'cds',
      rankRange: "> 300,000"
    };
  }
  
  // 100k and below rank
  if (salesRank <= 100000) {
    if (price > 23 && price < 35) {
      return { accepted: true, ourPrice: 1.5, category: 'cds', priceRange: "$25-34.99", rankRange: "≤ 100k" };
    }
    if (price >= 35 && price < 46) {
      return { accepted: true, ourPrice: 2.5, category: 'cds', priceRange: "$35-45.99", rankRange: "≤ 100k" };
    }
    if (price >= 46 && price < 57) {
      return { accepted: true, ourPrice: 3.5, category: 'cds', priceRange: "$46-56.99", rankRange: "≤ 100k" };
    }
    if (price >= 57) {
      return { accepted: true, ourPrice: 4.5, category: 'cds', priceRange: "$57+", rankRange: "≤ 100k" };
    }
    
    return {
      accepted: false,
      reason: "Price doesn't fit our range (minimum $25)",
      category: 'cds',
      priceRange: `$${price} (min: $25)`
    };
  }
  
  // 100k-200k range rank
  if (salesRank <= 200000) {
    if (price > 23 && price < 46) {
      return { accepted: true, ourPrice: 1.5, category: 'cds', priceRange: "$25-45.99", rankRange: "100k-200k" };
    }
    if (price >= 46 && price < 57) {
      return { accepted: true, ourPrice: 2.5, category: 'cds', priceRange: "$46-56.99", rankRange: "100k-200k" };
    }
    if (price >= 57) {
      return { accepted: true, ourPrice: 3.5, category: 'cds', priceRange: "$57+", rankRange: "100k-200k" };
    }
    
    return {
      accepted: false,
      reason: "Price doesn't fit our range (minimum $25)",
      category: 'cds',
      priceRange: `$${price} (min: $25)`
    };
  }
  
  // 200k-300k range rank
  if (salesRank <= 300000) {
    if (price >= 50) {
      return { accepted: true, ourPrice: 1.5, category: 'cds', priceRange: "$50+", rankRange: "200k-300k" };
    }
    
    return {
      accepted: false,
      reason: "Price doesn't fit our range (minimum $50)",
      category: 'cds',
      priceRange: `$${price} (min: $50)`
    };
  }
  
  return {
    accepted: false,
    reason: "Unknown rank range",
    category: 'cds'
  };
}
/**
 * DVD/Blu-ray kategorisi için fiyatlandırma kuralları (CD ile aynı)
 */
function calculateDVDPrice(price: number, salesRank: number): PricingResult {
  const result = calculateCDPrice(price, salesRank);
  return {
    ...result,
    category: 'dvds'
  };
}
/**
 * Oyun kategorisi için fiyatlandırma kuralları (CD ile aynı)
 */
function calculateGamePrice(price: number, salesRank: number): PricingResult {
  const result = calculateCDPrice(price, salesRank);
  return {
    ...result,
    category: 'games'
  };
}
/**
 * Fiyat yoksa rank'e göre default fiyat atar
 */
function handleNoPriceScenario(category: ProductCategory, salesRank: number): PricingResult {
  switch (category) {
    case 'books':
      if (salesRank <= 1000000) {
        return {
          accepted: true,
          ourPrice: 3,
          category: 'books',
          priceRange: "No price - default",
          rankRange: "≤ 1M"
        };
      }
      if (salesRank <= 2000000) {
        return {
          accepted: true,
          ourPrice: 2,
          category: 'books',
          priceRange: "No price - default",
          rankRange: "1M-2M"
        };
      }
      return {
        accepted: false,
        reason: "Rank too low (over 2M)",
        category: 'books',
        rankRange: "> 2M"
      };
      
    case 'cds':
    case 'dvds': 
    case 'games':
      if (salesRank <= 100000) {
        return {
          accepted: true,
          ourPrice: 3,
          category,
          priceRange: "No price - default", 
          rankRange: "≤ 100K"
        };
      }
      if (salesRank <= 200000) {
        return {
          accepted: true,
          ourPrice: 2,
          category,
          priceRange: "No price - default",
          rankRange: "100K-200K"
        };
      }
      return {
        accepted: false,
        reason: "Rank too low (over 200K)",
        category,
        rankRange: "> 200K"
      };
      
    default:
      return {
        accepted: false,
        reason: "Unsupported category",
        category: 'unknown'
      };
  }
}
/**
 * Ana fiyatlandırma fonksiyonu - YENİ VERSİYON
 */
export function calculateOurPrice(product: AmazonProduct): PricingResult {
  const category = detectCategory(product.category);
  
  // Sales rank check
  if (!product.sales_rank || product.sales_rank <= 0) {
    return {
      accepted: false,
      reason: "Sales rank information not found",
      category
    };
  }
  
  // If no price, assign default price based on rank
  if (!product.price || product.price <= 0) {
    return handleNoPriceScenario(category, product.sales_rank);
  }
  
  // If normal price exists, use current logic
  switch (category) {
    case 'books':
      return calculateBookPrice(product.price, product.sales_rank);
    case 'cds':
      return calculateCDPrice(product.price, product.sales_rank);
    case 'dvds':
      return calculateDVDPrice(product.price, product.sales_rank);
    case 'games':
      return calculateGamePrice(product.price, product.sales_rank);
    default:
      return {
        accepted: false,
        reason: "Unsupported category",
        category: 'unknown'
      };
  }
}
/**
 * Fiyatlandırma sonucunu insan dostu mesaja çevirir
 */
export function formatPricingMessage(result: PricingResult): string {
  if (result.accepted && result.ourPrice) {
    return `✅ Accepted! Our price: $${result.ourPrice} (${result.priceRange}, Rank: ${result.rankRange})`;
  }
  
  return `❌ ${result.reason}`;
}
/**
 * Test fonksiyonu - development için
 */
export function testPricingEngine() {
  console.log("🧪 Testing Pricing Engine...");
  
  // Test data - with your example product
  const testProducts: AmazonProduct[] = [
    // Your example product
    { title: "Pocket Primary Care (Pocket Notebook Series)", image: "", price: 40.38, sales_rank: 15853, category: "Books" },
    
    // Other test data
    { title: "Test Book 1", image: "", price: 25, sales_rank: 50000, category: "Books" },
    { title: "Test Book 2", image: "", price: 35, sales_rank: 50000, category: "Books" },
    { title: "Test Book 3", image: "", price: 55, sales_rank: 1500000, category: "Books" },
    
    // CD tests
    { title: "Test CD 1", image: "", price: 30, sales_rank: 50000, category: "CDs & Vinyl" },
    { title: "Test CD 2", image: "", price: 55, sales_rank: 250000, category: "Music" },
    
    // DVD tests
    { title: "Test DVD 1", image: "", price: 40, sales_rank: 150000, category: "Movies & TV" },
    
    // Game tests
    { title: "Test Game 1", image: "", price: 45, sales_rank: 80000, category: "Video Games" },
    
    // No price tests
    { title: "No Price CD", image: "", price: 0, sales_rank: 50000, category: "CDs & Vinyl" },
    { title: "No Price Book", image: "", price: 0, sales_rank: 1200000, category: "Books" },
    { title: "No Price DVD", image: "", price: 0, sales_rank: 150000, category: "Movies & TV" },
  ];
  
  testProducts.forEach((product, index) => {
    const result = calculateOurPrice(product);
    console.log(`${index + 1}. ${product.title}:`);
    console.log(`   ${formatPricingMessage(result)}`);
    console.log(`   Category: ${result.category}, Price: $${product.price}, Rank: ${product.sales_rank}`);
    console.log('');
  });
}