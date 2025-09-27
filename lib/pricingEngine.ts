// /lib/pricingEngine.ts
// Amazon ürün fiyatlandırma motoru - TÜM ARALIKLARI +$5 ARTTIRILDI
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
 * Kitap kategorisi için fiyatlandırma kuralları - TÜM ARALIKLARI +$5
 */
function calculateBookPrice(price: number, salesRank: number): PricingResult {
  // Rank control
  if (salesRank > 2000000) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      rankRange: "> 2,000,000"
    };
  }
  
  // 1 million and below rank - TÜM ARALIKLARI +$5
  if (salesRank <= 1000000) {
    if (price > 28 && price < 36) { // 23->28, 31->36
      return { accepted: true, ourPrice: 1.5, category: 'books', priceRange: "$29-35.99", rankRange: "≤ 1M" };
    }
    if (price >= 36 && price < 46) { // 31->36, 41->46
      return { accepted: true, ourPrice: 2.5, category: 'books', priceRange: "$36-45.99", rankRange: "≤ 1M" };
    }
    if (price >= 46 && price < 56) { // 41->46, 51->56
      return { accepted: true, ourPrice: 3.5, category: 'books', priceRange: "$46-55.99", rankRange: "≤ 1M" };
    }
    if (price >= 56 && price < 66) { // 51->56, 61->66
      return { accepted: true, ourPrice: 4.5, category: 'books', priceRange: "$56-65.99", rankRange: "≤ 1M" };
    }
    if (price >= 66 && price < 96) { // 61->66, 91->96
      return { accepted: true, ourPrice: 5.5, category: 'books', priceRange: "$66-95.99", rankRange: "≤ 1M" };
    }
    if (price >= 96 && price < 126) { // 91->96, 121->126
      return { accepted: true, ourPrice: 6.5, category: 'books', priceRange: "$96-125.99", rankRange: "≤ 1M" };
    }
    if (price >= 126) { // 121->126
      return { accepted: true, ourPrice: 7.5, category: 'books', priceRange: "$126+", rankRange: "≤ 1M" };
    }
    
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      priceRange: `$${price} (min: $29)`
    };
  }
  
  // 1-2 million range rank - TÜM ARALIKLARI +$5
  if (salesRank <= 2000000) {
    if (price >= 56 && price < 66) { // 51->56, 61->66
      return { accepted: true, ourPrice: 2.5, category: 'books', priceRange: "$56-65.99", rankRange: "1M-2M" };
    }
    if (price >= 66 && price < 96) { // 61->66, 91->96
      return { accepted: true, ourPrice: 3.5, category: 'books', priceRange: "$66-95.99", rankRange: "1M-2M" };
    }
    if (price >= 96 && price < 126) { // 91->96, 121->126
      return { accepted: true, ourPrice: 4.5, category: 'books', priceRange: "$96-125.99", rankRange: "1M-2M" };
    }
    if (price >= 126) { // 121->126
      return { accepted: true, ourPrice: 5.5, category: 'books', priceRange: "$126+", rankRange: "1M-2M" };
    }
    
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      priceRange: `$${price}`
    };
  }
  
  return {
    accepted: false,
    reason: "Unknown rank range",
    category: 'books'
  };
}

/**
 * CD kategorisi için fiyatlandırma kuralları - TÜM ARALIKLARI +$5
 */
function calculateCDPrice(price: number, salesRank: number): PricingResult {
  // Rank control
  if (salesRank > 300000) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'cds',
      rankRange: "> 300,000"
    };
  }
  
  // 100k and below rank - TÜM ARALIKLARI +$5
  if (salesRank <= 100000) {
    if (price > 28 && price < 40) { // 23->28, 35->40
      return { accepted: true, ourPrice: 1.5, category: 'cds', priceRange: "$29-39.99", rankRange: "≤ 100k" };
    }
    if (price >= 40 && price < 51) { // 35->40, 46->51
      return { accepted: true, ourPrice: 2.5, category: 'cds', priceRange: "$40-50.99", rankRange: "≤ 100k" };
    }
    if (price >= 51 && price < 62) { // 46->51, 57->62
      return { accepted: true, ourPrice: 3.5, category: 'cds', priceRange: "$51-61.99", rankRange: "≤ 100k" };
    }
    if (price >= 62) { // 57->62
      return { accepted: true, ourPrice: 4.5, category: 'cds', priceRange: "$62+", rankRange: "≤ 100k" };
    }
    
    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price}`
    };
  }
  
  // 100k-200k range rank - TÜM ARALIKLARI +$5
  if (salesRank <= 200000) {
    if (price > 28 && price < 51) { // 23->28, 46->51
      return { accepted: true, ourPrice: 1.5, category: 'cds', priceRange: "$29-50.99", rankRange: "100k-200k" };
    }
    if (price >= 51 && price < 62) { // 46->51, 57->62
      return { accepted: true, ourPrice: 2.5, category: 'cds', priceRange: "$51-61.99", rankRange: "100k-200k" };
    }
    if (price >= 62) { // 57->62
      return { accepted: true, ourPrice: 3.5, category: 'cds', priceRange: "$62+", rankRange: "100k-200k" };
    }
    
    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price}`
    };
  }
  
  // 200k-300k range rank - TÜM ARALIKLARI +$5
  if (salesRank <= 300000) {
    if (price >= 55) { // 50->55
      return { accepted: true, ourPrice: 1.5, category: 'cds', priceRange: "$55+", rankRange: "200k-300k" };
    }
    
    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price} `
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
      if (salesRank <= 500000) {
        return {
          accepted: true,
          ourPrice: 2,
          category: 'books',
          priceRange: "No price - default",
          rankRange: "≤ 500K"
        };
      }
      return {
        accepted: false,
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category: 'books',
        rankRange: "> 500K"
      };
      
    case 'cds':
    case 'dvds': 
    case 'games':
      if (salesRank <= 50000) {
        return {
          accepted: true,
          ourPrice: 2,
          category,
          priceRange: "No price - default", 
          rankRange: "≤ 50K"
        };
      }
      return {
        accepted: false,
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category,
        rankRange: "> 50K"
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
 * Ana fiyatlandırma fonksiyonu
 */
export function calculateOurPrice(product: AmazonProduct): PricingResult {
  const category = detectCategory(product.category);
  
  // Sales rank check
  if (!product.sales_rank || product.sales_rank <= 0) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
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
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category: 'unknown'
      };
  }
}

/**
 * Fiyatlandırma sonucunu insan dostu mesaja çevirir
 */
export function formatPricingMessage(result: PricingResult): string {
  if (result.accepted && result.ourPrice) {
    return `Accepted! `;
  }
  
  return `${result.reason}`;
}

/**
 * Test fonksiyonu - development için
 */
export function testPricingEngine() {
  console.log("Testing Pricing Engine - All Ranges +$5...");
  
  const testProducts: AmazonProduct[] = [
    // Books - test new ranges
    { title: "Test Book 1", image: "", price: 30, sales_rank: 50000, category: "Books" }, // Should be accepted now (was $25, now $30)
    { title: "Test Book 2", image: "", price: 40, sales_rank: 50000, category: "Books" }, // Should be accepted (was $35, now $40)
    { title: "Test Book 3", image: "", price: 60, sales_rank: 1500000, category: "Books" }, // Should be accepted (was $55, now $60)
    
    // CDs - test new ranges  
    { title: "Test CD 1", image: "", price: 35, sales_rank: 50000, category: "CDs & Vinyl" }, // Should be accepted (was $30, now $35)
    { title: "Test CD 2", image: "", price: 60, sales_rank: 250000, category: "Music" }, // Should be accepted (was $55, now $60)
    
    // DVDs - test new ranges
    { title: "Test DVD 1", image: "", price: 45, sales_rank: 150000, category: "Movies & TV" }, // Should be accepted (was $40, now $45)
    
    // Games - test new ranges
    { title: "Test Game 1", image: "", price: 50, sales_rank: 80000, category: "Video Games" }, // Should be accepted (was $45, now $50)
  ];
  
  testProducts.forEach((product, index) => {
    const result = calculateOurPrice(product);
    console.log(`${index + 1}. ${product.title}:`);
    console.log(`   ${formatPricingMessage(result)}`);
    console.log(`   Category: ${result.category}, Price: $${product.price}, Rank: ${product.sales_rank}`);
    console.log('');
  });
}