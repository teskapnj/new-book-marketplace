// /lib/pricingEngine.ts
// Amazon ürün fiyatlandırma motoru
// GÜNCELLEME: "Hiç fiyat yok" ve "New yok, Used var" senaryoları yeni kriterlere göre ayrıldı

export interface AmazonProduct {
  title: string;
  image: string;
  price: number;
  sales_rank: number;
  category: string;
  asin?: string;
  // YENİ ALAN: route.ts'ten gelen fiyatın tipini belirtir.
  // 'new'  -> Keepa'dan gerçek NEW fiyatı geldi, kademeli bant sistemi uygulanır
  // 'used' -> NEW yoktu, USED fiyatına düşüldü, sabit fiyat kuralı uygulanır
  // 'none' -> ne NEW ne USED fiyatı var, price alanı 0/boş
  priceType?: 'new' | 'used' | 'none';
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

// ==================== YENİ SABİT KRİTERLER ====================

// Senaryo: Hiç fiyat yok (ne NEW ne USED)
const NO_PRICE_BOOK_RANK_LIMIT = 1_000_000;
const NO_PRICE_BOOK_PRICE = 3;
const NO_PRICE_MEDIA_RANK_LIMIT = 150_000; // CD / DVD / Oyun ortak
const NO_PRICE_MEDIA_PRICE = 3;

// Senaryo: NEW yok, USED var
const USED_ONLY_BOOK_RANK_LIMIT = 1_000_000;
const USED_ONLY_BOOK_PRICE = 1.5;
const USED_ONLY_MEDIA_RANK_LIMIT = 150_000; // CD / DVD / Oyun ortak
const USED_ONLY_MEDIA_PRICE = 1.5;

/**
 * Kitap kategorisi için fiyatlandırma kuralları (NEW fiyat mevcutken kullanılır)
 */
function calculateBookPrice(price: number, salesRank: number): PricingResult {
  if (salesRank > 2000000) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      rankRange: "> 2,000,000"
    };
  }

  if (salesRank <= 1000000) {
    if (price > 28 && price < 36) {
      return { accepted: true, ourPrice: 1.5, category: 'books', priceRange: "$29-35.99", rankRange: "≤ 1M" };
    }
    if (price >= 36 && price < 46) {
      return { accepted: true, ourPrice: 2.5, category: 'books', priceRange: "$36-45.99", rankRange: "≤ 1M" };
    }
    if (price >= 46 && price < 56) {
      return { accepted: true, ourPrice: 3.5, category: 'books', priceRange: "$46-55.99", rankRange: "≤ 1M" };
    }
    if (price >= 56 && price < 66) {
      return { accepted: true, ourPrice: 4.5, category: 'books', priceRange: "$56-65.99", rankRange: "≤ 1M" };
    }
    if (price >= 66 && price < 96) {
      return { accepted: true, ourPrice: 5.5, category: 'books', priceRange: "$66-95.99", rankRange: "≤ 1M" };
    }
    if (price >= 96 && price < 126) {
      return { accepted: true, ourPrice: 6.5, category: 'books', priceRange: "$96-125.99", rankRange: "≤ 1M" };
    }
    if (price >= 126) {
      return { accepted: true, ourPrice: 7.5, category: 'books', priceRange: "$126+", rankRange: "≤ 1M" };
    }

    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      priceRange: `$${price} (min: $29)`
    };
  }

  if (salesRank <= 2000000) {
    if (price >= 56 && price < 66) {
      return { accepted: true, ourPrice: 2.5, category: 'books', priceRange: "$56-65.99", rankRange: "1M-2M" };
    }
    if (price >= 66 && price < 96) {
      return { accepted: true, ourPrice: 3.5, category: 'books', priceRange: "$66-95.99", rankRange: "1M-2M" };
    }
    if (price >= 96 && price < 126) {
      return { accepted: true, ourPrice: 4.5, category: 'books', priceRange: "$96-125.99", rankRange: "1M-2M" };
    }
    if (price >= 126) {
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
 * CD kategorisi için fiyatlandırma kuralları (NEW fiyat mevcutken kullanılır)
 */
function calculateCDPrice(price: number, salesRank: number): PricingResult {
  if (salesRank > 300000) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'cds',
      rankRange: "> 300,000"
    };
  }

  if (salesRank <= 100000) {
    if (price > 28 && price < 40) {
      return { accepted: true, ourPrice: 1.5, category: 'cds', priceRange: "$29-39.99", rankRange: "≤ 100k" };
    }
    if (price >= 40 && price < 51) {
      return { accepted: true, ourPrice: 2.5, category: 'cds', priceRange: "$40-50.99", rankRange: "≤ 100k" };
    }
    if (price >= 51 && price < 62) {
      return { accepted: true, ourPrice: 3.5, category: 'cds', priceRange: "$51-61.99", rankRange: "≤ 100k" };
    }
    if (price >= 62) {
      return { accepted: true, ourPrice: 4.5, category: 'cds', priceRange: "$62+", rankRange: "≤ 100k" };
    }

    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price}`
    };
  }

  if (salesRank <= 200000) {
    if (price > 28 && price < 51) {
      return { accepted: true, ourPrice: 1.5, category: 'cds', priceRange: "$29-50.99", rankRange: "100k-200k" };
    }
    if (price >= 51 && price < 62) {
      return { accepted: true, ourPrice: 2.5, category: 'cds', priceRange: "$51-61.99", rankRange: "100k-200k" };
    }
    if (price >= 62) {
      return { accepted: true, ourPrice: 3.5, category: 'cds', priceRange: "$62+", rankRange: "100k-200k" };
    }

    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price}`
    };
  }

  if (salesRank <= 300000) {
    if (price >= 55) {
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

function calculateDVDPrice(price: number, salesRank: number): PricingResult {
  const result = calculateCDPrice(price, salesRank);
  return { ...result, category: 'dvds' };
}

function calculateGamePrice(price: number, salesRank: number): PricingResult {
  const result = calculateCDPrice(price, salesRank);
  return { ...result, category: 'games' };
}

/**
 * SENARYO 1-2: Hiç fiyat yok (ne NEW ne USED)
 * Kitap: rank ≤ 1,000,000 ise $3, üstündeyse reddet
 * CD/DVD/Oyun: rank ≤ 150,000 ise $3, üstündeyse reddet
 */
function handleNoPriceScenario(category: ProductCategory, salesRank: number): PricingResult {
  switch (category) {
    case 'books':
      if (salesRank <= NO_PRICE_BOOK_RANK_LIMIT) {
        return {
          accepted: true,
          ourPrice: NO_PRICE_BOOK_PRICE,
          category: 'books',
          priceRange: "No price available",
          rankRange: `≤ ${NO_PRICE_BOOK_RANK_LIMIT.toLocaleString()}`
        };
      }
      return {
        accepted: false,
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category: 'books',
        rankRange: `> ${NO_PRICE_BOOK_RANK_LIMIT.toLocaleString()}`
      };

    case 'cds':
    case 'dvds':
    case 'games':
      if (salesRank <= NO_PRICE_MEDIA_RANK_LIMIT) {
        return {
          accepted: true,
          ourPrice: NO_PRICE_MEDIA_PRICE,
          category,
          priceRange: "No price available",
          rankRange: `≤ ${NO_PRICE_MEDIA_RANK_LIMIT.toLocaleString()}`
        };
      }
      return {
        accepted: false,
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category,
        rankRange: `> ${NO_PRICE_MEDIA_RANK_LIMIT.toLocaleString()}`
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
 * SENARYO 3-4: NEW fiyat yok, USED fiyat var
 * Kitap: rank ≤ 1,000,000 ise $1.5, üstündeyse reddet
 * CD/DVD/Oyun: rank ≤ 150,000 ise $1.5, üstündeyse reddet
 * NOT: Used fiyatın kendi tutarı burada kriter olarak kullanılmıyor, sadece rank bakılıyor.
 */
function handleUsedOnlyScenario(category: ProductCategory, salesRank: number): PricingResult {
  switch (category) {
    case 'books':
      if (salesRank <= USED_ONLY_BOOK_RANK_LIMIT) {
        return {
          accepted: true,
          ourPrice: USED_ONLY_BOOK_PRICE,
          category: 'books',
          priceRange: "Used price only",
          rankRange: `≤ ${USED_ONLY_BOOK_RANK_LIMIT.toLocaleString()}`
        };
      }
      return {
        accepted: false,
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category: 'books',
        rankRange: `> ${USED_ONLY_BOOK_RANK_LIMIT.toLocaleString()}`
      };

    case 'cds':
    case 'dvds':
    case 'games':
      if (salesRank <= USED_ONLY_MEDIA_RANK_LIMIT) {
        return {
          accepted: true,
          ourPrice: USED_ONLY_MEDIA_PRICE,
          category,
          priceRange: "Used price only",
          rankRange: `≤ ${USED_ONLY_MEDIA_RANK_LIMIT.toLocaleString()}`
        };
      }
      return {
        accepted: false,
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category,
        rankRange: `> ${USED_ONLY_MEDIA_RANK_LIMIT.toLocaleString()}`
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

  // Sales rank kontrolü - rank yoksa/geçersizse direkt reddet
  if (!product.sales_rank || product.sales_rank <= 0) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category
    };
  }

  const hasPrice = !!product.price && product.price > 0;

  // SENARYO 1-2: Hiç fiyat yok
  if (!hasPrice || product.priceType === 'none') {
    return handleNoPriceScenario(category, product.sales_rank);
  }

  // SENARYO 3-4: NEW yok, USED var
  if (product.priceType === 'used') {
    return handleUsedOnlyScenario(category, product.sales_rank);
  }

  // SENARYO 5-6: NEW fiyat var (priceType 'new' veya belirtilmemişse geriye dönük uyumluluk için 'new' kabul edilir)
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
    return `Accepted!`;
  }
  return `${result.reason}`;
}

/**
 * Test fonksiyonu - development için
 */
export function testPricingEngine() {
  console.log("Testing Pricing Engine - Updated Criteria...");

  const testProducts: AmazonProduct[] = [
    // NEW fiyat var - mevcut bant sistemi
    { title: "Test Book (new price)", image: "", price: 30, sales_rank: 50000, category: "Books", priceType: 'new' },
    { title: "Test CD (new price)", image: "", price: 35, sales_rank: 50000, category: "CDs & Vinyl", priceType: 'new' },

    // NEW yok, USED var - sabit $1.5
    { title: "Test Book (used only, rank ok)", image: "", price: 20, sales_rank: 800000, category: "Books", priceType: 'used' },
    { title: "Test Book (used only, rank too high)", image: "", price: 20, sales_rank: 1200000, category: "Books", priceType: 'used' },
    { title: "Test DVD (used only, rank ok)", image: "", price: 15, sales_rank: 100000, category: "Movies & TV", priceType: 'used' },
    { title: "Test DVD (used only, rank too high)", image: "", price: 15, sales_rank: 200000, category: "Movies & TV", priceType: 'used' },

    // Hiç fiyat yok - sabit $3
    { title: "Test Book (no price, rank ok)", image: "", price: 0, sales_rank: 900000, category: "Books", priceType: 'none' },
    { title: "Test Book (no price, rank too high)", image: "", price: 0, sales_rank: 1500000, category: "Books", priceType: 'none' },
    { title: "Test Game (no price, rank ok)", image: "", price: 0, sales_rank: 120000, category: "Video Games", priceType: 'none' },
    { title: "Test Game (no price, rank too high)", image: "", price: 0, sales_rank: 180000, category: "Video Games", priceType: 'none' },
  ];

  testProducts.forEach((product, index) => {
    const result = calculateOurPrice(product);
    console.log(`${index + 1}. ${product.title}:`);
    console.log(`   ${formatPricingMessage(result)} ${result.accepted ? `-> $${result.ourPrice}` : ''}`);
    console.log(`   Category: ${result.category}, Price: $${product.price}, Rank: ${product.sales_rank}, PriceType: ${product.priceType}`);
    console.log('');
  });
}