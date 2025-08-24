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
  // Sıralama kontrolü
  if (salesRank > 2000000) {
    return {
      accepted: false,
      reason: "Satış sıralaması çok düşük (2 milyon üstü)",
      category: 'books',
      rankRange: "> 2,000,000"
    };
  }
  
  // 1 milyon ve altı sıralama
  if (salesRank <= 1000000) {
    if (price >= 24 && price < 31) {  // < 31 olarak değiştirdim
      return { accepted: true, ourPrice: 1, category: 'books', priceRange: "$24-30.99", rankRange: "≤ 1M" };
    }
    if (price >= 31 && price < 41) {  // < 41 olarak değiştirdim
      return { accepted: true, ourPrice: 2, category: 'books', priceRange: "$31-40.99", rankRange: "≤ 1M" };
    }
    if (price >= 41 && price < 51) {  // < 51 olarak değiştirdim
      return { accepted: true, ourPrice: 3, category: 'books', priceRange: "$41-50.99", rankRange: "≤ 1M" };
    }
    if (price >= 51 && price < 61) {  // < 61 olarak değiştirdim
      return { accepted: true, ourPrice: 4, category: 'books', priceRange: "$51-60.99", rankRange: "≤ 1M" };
    }
    if (price >= 61 && price < 91) {  // < 91 olarak değiştirdim
      return { accepted: true, ourPrice: 5, category: 'books', priceRange: "$61-90.99", rankRange: "≤ 1M" };
    }
    if (price >= 91 && price < 121) {  // < 121 olarak değiştirdim
      return { accepted: true, ourPrice: 6, category: 'books', priceRange: "$91-120.99", rankRange: "≤ 1M" };
    }
    if (price >= 121) {  // >= 121 olarak değiştirdim
      return { accepted: true, ourPrice: 7, category: 'books', priceRange: "$121+", rankRange: "≤ 1M" };
    }
    
    return {
      accepted: false,
      reason: "Fiyat aralığımıza uymuyor (minimum $24)",
      category: 'books',
      priceRange: `$${price} (min: $24)`
    };
  }
  
  // 1-2 milyon arası sıralama
  if (salesRank <= 2000000) {
    if (price >= 51 && price < 61) {  // < 61 olarak değiştirdim
      return { accepted: true, ourPrice: 2, category: 'books', priceRange: "$51-60.99", rankRange: "1M-2M" };
    }
    if (price >= 61 && price < 91) {  // < 91 olarak değiştirdim
      return { accepted: true, ourPrice: 3, category: 'books', priceRange: "$61-90.99", rankRange: "1M-2M" };
    }
    if (price >= 91 && price < 121) {  // < 121 olarak değiştirdim
      return { accepted: true, ourPrice: 4, category: 'books', priceRange: "$91-120.99", rankRange: "1M-2M" };
    }
    if (price >= 121) {  // >= 121 olarak değiştirdim
      return { accepted: true, ourPrice: 5, category: 'books', priceRange: "$121+", rankRange: "1M-2M" };
    }
    
    return {
      accepted: false,
      reason: "Fiyat aralığımıza uymuyor (minimum $51)",
      category: 'books',
      priceRange: `$${price} (min: $51)`
    };
  }
  
  return {
    accepted: false,
    reason: "Bilinmeyen sıralama aralığı",
    category: 'books'
  };
}

/**
 * CD kategorisi için fiyatlandırma kuralları - DÜZELTİLDİ
 */
function calculateCDPrice(price: number, salesRank: number): PricingResult {
  // Sıralama kontrolü
  if (salesRank > 300000) {
    return {
      accepted: false,
      reason: "Satış sıralaması çok düşük (300k üstü)",
      category: 'cds',
      rankRange: "> 300,000"
    };
  }
  
  // 100k ve altı sıralama
  if (salesRank <= 100000) {
    if (price >= 25 && price < 35) {  // < 35 olarak değiştirdim
      return { accepted: true, ourPrice: 1, category: 'cds', priceRange: "$25-34.99", rankRange: "≤ 100k" };
    }
    if (price >= 35 && price < 46) {  // < 46 olarak değiştirdim
      return { accepted: true, ourPrice: 2, category: 'cds', priceRange: "$35-45.99", rankRange: "≤ 100k" };
    }
    if (price >= 46 && price < 57) {  // < 57 olarak değiştirdim
      return { accepted: true, ourPrice: 3, category: 'cds', priceRange: "$46-56.99", rankRange: "≤ 100k" };
    }
    if (price >= 57) {
      return { accepted: true, ourPrice: 4, category: 'cds', priceRange: "$57+", rankRange: "≤ 100k" };
    }
    
    return {
      accepted: false,
      reason: "Fiyat aralığımıza uymuyor (minimum $25)",
      category: 'cds',
      priceRange: `$${price} (min: $25)`
    };
  }
  
  // 100k-200k arası sıralama
  if (salesRank <= 200000) {
    if (price >= 25 && price < 46) {  // < 46 olarak değiştirdim
      return { accepted: true, ourPrice: 1, category: 'cds', priceRange: "$25-45.99", rankRange: "100k-200k" };
    }
    if (price >= 46 && price < 57) {  // < 57 olarak değiştirdim
      return { accepted: true, ourPrice: 2, category: 'cds', priceRange: "$46-56.99", rankRange: "100k-200k" };
    }
    if (price >= 57) {
      return { accepted: true, ourPrice: 3, category: 'cds', priceRange: "$57+", rankRange: "100k-200k" };
    }
    
    return {
      accepted: false,
      reason: "Fiyat aralığımıza uymuyor (minimum $25)",
      category: 'cds',
      priceRange: `$${price} (min: $25)`
    };
  }
  
  // 200k-300k arası sıralama
  if (salesRank <= 300000) {
    if (price >= 50) {
      return { accepted: true, ourPrice: 1, category: 'cds', priceRange: "$50+", rankRange: "200k-300k" };
    }
    
    return {
      accepted: false,
      reason: "Fiyat aralığımıza uymuyor (minimum $50)",
      category: 'cds',
      priceRange: `$${price} (min: $50)`
    };
  }
  
  return {
    accepted: false,
    reason: "Bilinmeyen sıralama aralığı",
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
 * Ana fiyatlandırma fonksiyonu
 */
export function calculateOurPrice(product: AmazonProduct): PricingResult {
  const category = detectCategory(product.category);
  
  // Temel validasyonlar
  if (!product.price || product.price <= 0) {
    return {
      accepted: false,
      reason: "Geçersiz fiyat bilgisi",
      category
    };
  }
  
  if (!product.sales_rank || product.sales_rank <= 0) {
    return {
      accepted: false,
      reason: "Satış sıralaması bilgisi bulunamadı",
      category
    };
  }
  
  // Kategori bazlı fiyatlandırma
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
        reason: "Desteklenmeyen kategori",
        category: 'unknown'
      };
  }
}

/**
 * Fiyatlandırma sonucunu insan dostu mesaja çevirir
 */
export function formatPricingMessage(result: PricingResult): string {
  if (result.accepted && result.ourPrice) {
    return `✅ Kabul edildi! Bizim fiyatımız: $${result.ourPrice} (${result.priceRange}, Rank: ${result.rankRange})`;
  }
  
  return `❌ ${result.reason}`;
}

/**
 * Test fonksiyonu - development için
 */
export function testPricingEngine() {
  console.log("🧪 Fiyatlandırma Motoru Test Ediliyor...");
  
  // Test verileri - SENİN ÖRNEK ÜRÜNÜNLE BİRLİKTE
  const testProducts: AmazonProduct[] = [
    // Senin örnek ürünün
    { title: "Pocket Primary Care (Pocket Notebook Series)", image: "", price: 40.38, sales_rank: 15853, category: "Books" },
    
    // Diğer test verileri
    { title: "Test Book 1", image: "", price: 25, sales_rank: 50000, category: "Books" },
    { title: "Test Book 2", image: "", price: 35, sales_rank: 50000, category: "Books" },
    { title: "Test Book 3", image: "", price: 55, sales_rank: 1500000, category: "Books" },
    
    // CD testleri
    { title: "Test CD 1", image: "", price: 30, sales_rank: 50000, category: "CDs & Vinyl" },
    { title: "Test CD 2", image: "", price: 55, sales_rank: 250000, category: "Music" },
    
    // DVD testleri
    { title: "Test DVD 1", image: "", price: 40, sales_rank: 150000, category: "Movies & TV" },
    
    // Oyun testleri
    { title: "Test Game 1", image: "", price: 45, sales_rank: 80000, category: "Video Games" }
  ];
  
  testProducts.forEach((product, index) => {
    const result = calculateOurPrice(product);
    console.log(`${index + 1}. ${product.title}:`);
    console.log(`   ${formatPricingMessage(result)}`);
    console.log(`   Kategori: ${result.category}, Fiyat: $${product.price}, Rank: ${product.sales_rank}`);
    console.log('');
  });
}