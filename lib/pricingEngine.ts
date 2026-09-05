// /lib/pricingEngine.ts
// Amazon ürün fiyatlandırma motoru
// GÜNCELLEME: "Hiç fiyat yok" ve "New yok, Used var" senaryoları yeni kriterlere göre ayrıldı
// GÜNCELLEME 2: Kabul edilmeyen formatlar (vinyl, VHS, kaset, indirilebilir audiobook)
//               Keepa binding/type alanlarına göre en başta reddedilir.

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
  // GAME için Keepa'dan ayrı fiyatlar
gameNewPrice?: number;
gameUsedPrice?: number;
  // YENİ ALANLAR: Keepa'dan gelen format bilgisi (kategori filtresi için)
  // binding -> ör. 'audioCD', 'lp_record', 'VHStape', 'cassette'
  // type    -> ör. 'ABIS_MUSIC', 'ABIS_VIDEO', 'DOWNLOADABLE_AUDIO'
  binding?: string;
  type?: string;
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

// ==================== KABUL EDİLMEYEN FORMATLAR ====================
// Keepa'nin gercek verisiyle dogrulanan binding degerleri (12 Agustos 2026 testleri):
//   Vinyl -> binding: 'lp_record'
//   VHS   -> binding: 'VHStape'
//   Kaset -> binding: 'cassette'
//   Indirilebilir audiobook -> type: 'DOWNLOADABLE_AUDIO'
// NOT: Fiziksel audiobook CD, muzik CD ile ayni gorunur (binding 'audioCD', type 'ABIS_MUSIC')
//      -> otomatik ayrilamaz, elle kontrol edilir.
// Karsilastirma buyuk/kucuk harf duyarsiz ve olasi varyasyonlari da kapsar.

const REJECTED_BINDINGS = [
  'lp_record',   // vinyl
  'vinyl',       // olasi varyasyon
  'vhstape',     // VHS
  'vhs_tape',    // olasi varyasyon
  'vhs',         // olasi varyasyon
  'cassette',    // kaset
  'audiocassette', // olasi varyasyon
  'audio_cassette', // olasi varyasyon
];

const REJECTED_TYPES = [
  'DOWNLOADABLE_AUDIO', // indirilebilir audiobook (Audible)
];

/**
 * Ürünün kabul edilmeyen bir formatta olup olmadığını kontrol eder.
 * Kabul edilmiyorsa reddetme sebebini döndürür, ediliyorsa null döndürür.
 */
function checkRejectedFormat(product: AmazonProduct): string | null {
  const binding = (product.binding || '').toLowerCase().replace(/\s+/g, '');
  const type = (product.type || '').toUpperCase();

  if (binding && REJECTED_BINDINGS.includes(binding)) {
    return `We do not currently accept this format (${product.binding}).`;
  }

  if (type && REJECTED_TYPES.includes(type)) {
    return `We do not currently accept audiobooks.`;
  }

  return null;
}

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

  if (category === 'video games') {
    return 'games';
  }

  return 'unknown';
}

// ==================== YENİ SABİT KRİTERLER ====================

// Senaryo: Hiç fiyat yok (ne NEW ne USED)
const NO_PRICE_BOOK_RANK_LIMIT = 1_000_000;
const NO_PRICE_BOOK_PRICE = 3;
const NO_PRICE_BOOK_HIGH_RANK_LIMIT = 1_500_000;
const NO_PRICE_BOOK_HIGH_RANK_PRICE = 0.75;
const NO_PRICE_MEDIA_RANK_LIMIT = 200_000; // CD / DVD
const NO_PRICE_MEDIA_PRICE = 3;
const NO_PRICE_MEDIA_HIGH_RANK_LIMIT = 300_000;
const NO_PRICE_MEDIA_HIGH_RANK_PRICE = 0.75;

// Senaryo: NEW yok, USED var
const USED_ONLY_BOOK_RANK_LIMIT = 1_000_000;
const USED_ONLY_BOOK_PRICE = 1.5;
const USED_ONLY_BOOK_HIGH_RANK_LIMIT = 1_500_000;
const USED_ONLY_BOOK_HIGH_RANK_PRICE = 0.75;
const USED_ONLY_MEDIA_RANK_LIMIT = 200_000; // CD / DVD
const USED_ONLY_MEDIA_PRICE = 1.5;
const USED_ONLY_MEDIA_HIGH_RANK_LIMIT = 300_000;
const USED_ONLY_MEDIA_HIGH_RANK_PRICE = 0.75;

/**
 * Kitap kategorisi için fiyatlandırma kuralları (NEW fiyat mevcutken kullanılır)
 */
function calculateBookPrice(price: number, salesRank: number): PricingResult {
  if (salesRank > 1500000) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      rankRange: "> 1,500,000"
    };
  }

  // ------------------------------------------------------------
  // BOOKS: rank ≤ 200k
  // ------------------------------------------------------------
  if (salesRank <= 200000) {
    if (price >= 16.99 && price < 20) {
      return { accepted: true, ourPrice: 0.4, category: 'books', priceRange: "$16.99-19.99", rankRange: "≤ 200k" };
    }
    if (price >= 20 && price < 24) {
      return { accepted: true, ourPrice: 0.65, category: 'books', priceRange: "$20-23.99", rankRange: "≤ 200k" };
    }
    if (price >= 24 && price < 27) {
      return { accepted: true, ourPrice: 0.9, category: 'books', priceRange: "$24-26.99", rankRange: "≤ 200k" };
    }
    if (price >= 27 && price < 31) {
      return { accepted: true, ourPrice: 1.4, category: 'books', priceRange: "$27-30.99", rankRange: "≤ 200k" };
    }
    if (price >= 31 && price < 40) {
      return { accepted: true, ourPrice: 1.9, category: 'books', priceRange: "$31-39.99", rankRange: "≤ 200k" };
    }
    if (price >= 40 && price < 50) {
      return { accepted: true, ourPrice: 3.4, category: 'books', priceRange: "$40-49.99", rankRange: "≤ 200k" };
    }
    
    if (price >= 50 && price < 60) {
      return { accepted: true, ourPrice: 3.9, category: 'books', priceRange: "$50-59.99", rankRange: "≤ 200k" };
    }
    
    if (price >= 60 && price < 70) {
      return { accepted: true, ourPrice: 4.65, category: 'books', priceRange: "$60-69.99", rankRange: "≤ 200k" };
    }
    
    if (price >= 70 && price < 80) {
      return { accepted: true, ourPrice: 5.65, category: 'books', priceRange: "$70-79.99", rankRange: "≤ 200k" };
    }
    
    if (price >= 80 && price < 110) {
      return { accepted: true, ourPrice: 6.65, category: 'books', priceRange: "$80-109.99", rankRange: "≤ 200k" };
    }
    
    if (price >= 110 && price < 140) {
      return { accepted: true, ourPrice: 7.65, category: 'books', priceRange: "$110-139.99", rankRange: "≤ 200k" };
    }
    
    if (price >= 140) {
      return { accepted: true, ourPrice: 8.65, category: 'books', priceRange: "$140+", rankRange: "≤ 200k" };
    }

    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      priceRange: `$${price}`
    };
  }

  // ------------------------------------------------------------
  // BOOKS: rank 200k-500k
  // ------------------------------------------------------------
  if (salesRank <= 500000) {
    if (price >= 19 && price < 23) {
      return { accepted: true, ourPrice: 0.4, category: 'books', priceRange: "$19-22.99", rankRange: "200k-500k" };
    }
    if (price >= 23 && price < 27) {
      return { accepted: true, ourPrice: 0.65, category: 'books', priceRange: "$23-26.99", rankRange: "200k-500k" };
    }
    if (price >= 27 && price < 31) {
      return { accepted: true, ourPrice: 0.9, category: 'books', priceRange: "$27-30.99", rankRange: "200k-500k" };
    }
    if (price >= 31 && price < 40) {
      return { accepted: true, ourPrice: 1.65, category: 'books', priceRange: "$31-39.99", rankRange: "200k-500k" };
    }
    if (price >= 40 && price < 50) {
      return { accepted: true, ourPrice: 2.15, category: 'books', priceRange: "$40-49.99", rankRange: "200k-500k" };
    }
    if (price >= 50 && price < 60) {
      return { accepted: true, ourPrice: 2.65, category: 'books', priceRange: "$50-59.99", rankRange: "200k-500k" };
    }
    if (price >= 60 && price < 70) {
      return { accepted: true, ourPrice: 3.65, category: 'books', priceRange: "$60-69.99", rankRange: "200k-500k" };
    }
    if (price >= 70 && price < 80) {
      return { accepted: true, ourPrice: 4.65, category: 'books', priceRange: "$70-79.99", rankRange: "200k-500k" };
    }
    if (price >= 80 && price < 110) {
      return { accepted: true, ourPrice: 5.65, category: 'books', priceRange: "$80-109.99", rankRange: "200k-500k" };
    }
    if (price >= 110 && price < 140) {
      return { accepted: true, ourPrice: 6.65, category: 'books', priceRange: "$110-139.99", rankRange: "200k-500k" };
    }
    if (price >= 140) {
      return { accepted: true, ourPrice: 7.65, category: 'books', priceRange: "$140+", rankRange: "200k-500k" };
    }

    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      priceRange: `$${price}`
    };
  }

  // ------------------------------------------------------------
  // BOOKS: rank 500k-1M
  // ------------------------------------------------------------
  if (salesRank <= 1000000) {
    if (price >= 21.99 && price < 30) {
      return { accepted: true, ourPrice: 0.4, category: 'books', priceRange: "$21.99-29.99", rankRange: "500k-1M" };
    }
    if (price >= 30 && price < 35) {
      return { accepted: true, ourPrice: 0.9, category: 'books', priceRange: "$30-34.99", rankRange: "500k-1M" };
    }
    if (price >= 35 && price < 40) {
      return { accepted: true, ourPrice: 1.15, category: 'books', priceRange: "$35-39.99", rankRange: "500k-1M" };
    }
    if (price >= 40 && price < 45) {
      return { accepted: true, ourPrice: 1.4, category: 'books', priceRange: "$40-44.99", rankRange: "500k-1M" };
    }
    if (price >= 45 && price < 50) {
      return { accepted: true, ourPrice: 1.65, category: 'books', priceRange: "$45-49.99", rankRange: "500k-1M" };
    }
    if (price >= 50 && price < 60) {
      return { accepted: true, ourPrice: 2.15, category: 'books', priceRange: "$50-59.99", rankRange: "500k-1M" };
    }
    if (price >= 60 && price < 70) {
      return { accepted: true, ourPrice: 2.65, category: 'books', priceRange: "$60-69.99", rankRange: "500k-1M" };
    }
    if (price >= 70 && price < 80) {
      return { accepted: true, ourPrice: 3.15, category: 'books', priceRange: "$70-79.99", rankRange: "500k-1M" };
    }
    if (price >= 80 && price < 95) {
      return { accepted: true, ourPrice: 3.65, category: 'books', priceRange: "$80-94.99", rankRange: "500k-1M" };
    }
    if (price >= 95 && price < 110) {
      return { accepted: true, ourPrice: 4.15, category: 'books', priceRange: "$95-109.99", rankRange: "500k-1M" };
    }
    if (price >= 110 && price < 125) {
      return { accepted: true, ourPrice: 4.65, category: 'books', priceRange: "$110-124.99", rankRange: "500k-1M" };
    }
    if (price >= 125 && price < 140) {
      return { accepted: true, ourPrice: 5.15, category: 'books', priceRange: "$125-139.99", rankRange: "500k-1M" };
    }
    if (price >= 140 && price < 160) {
      return { accepted: true, ourPrice: 5.65, category: 'books', priceRange: "$140-159.99", rankRange: "500k-1M" };
    }
    if (price >= 160 && price < 180) {
      return { accepted: true, ourPrice: 6.15, category: 'books', priceRange: "$160-179.99", rankRange: "500k-1M" };
    }
    if (price >= 180) {
      return { accepted: true, ourPrice: 6.65, category: 'books', priceRange: "$180+", rankRange: "500k-1M" };
    }

    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'books',
      priceRange: `$${price}`
    };
  }

  // ------------------------------------------------------------
  // BOOKS: rank 1M-1.5M
  // ------------------------------------------------------------
  if (salesRank <= 1500000) {
    if (price >= 56 && price < 100) {
      return { accepted: true, ourPrice: 1.65, category: 'books', priceRange: "$56-99.99", rankRange: "1M-1.5M" };
    }
    if (price >= 100) {
      return { accepted: true, ourPrice: 2.65, category: 'books', priceRange: "$100+", rankRange: "1M-1.5M" };
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

  // CD / DVD /: rank ≤ 50k
  if (salesRank <= 50000) {
    if (price >= 15 && price < 18) {
      return { accepted: true, ourPrice: 0.4, category: 'cds', priceRange: "$15-17.99", rankRange: "≤ 50k" };
    }
    if (price >= 18 && price < 21) {
      return { accepted: true, ourPrice: 0.65, category: 'cds', priceRange: "$18-20.99", rankRange: "≤ 50k" };
    }
    if (price >= 21 && price < 24) {
      return { accepted: true, ourPrice: 0.9, category: 'cds', priceRange: "$21-23.99", rankRange: "≤ 50k" };
    }
    if (price >= 24 && price < 29) {
      return { accepted: true, ourPrice: 1.15, category: 'cds', priceRange: "$24-28.99", rankRange: "≤ 50k" };
    }
    if (price >= 29 && price < 35) {
      return { accepted: true, ourPrice: 1.65, category: 'cds', priceRange: "$29-34.99", rankRange: "≤ 50k" };
    }
    if (price >= 35 && price < 48) {
      return { accepted: true, ourPrice: 2.65, category: 'cds', priceRange: "$35-47.99", rankRange: "≤ 50k" };
    }
    if (price >= 48 && price < 60) {
      return { accepted: true, ourPrice: 3.65, category: 'cds', priceRange: "$48-59.99", rankRange: "≤ 50k" };
    }
    if (price >= 60) {
      return { accepted: true, ourPrice: 4.65, category: 'cds', priceRange: "$60+", rankRange: "≤ 50k" };
    }

    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price}`
    };
  }

  // CD / DVD /: rank 50k-100k
  if (salesRank <= 100000) {
    if (price >= 18 && price < 21) {
      return { accepted: true, ourPrice: 0.4, category: 'cds', priceRange: "$18-20.99", rankRange: "50k-100k" };
    }
    if (price >= 21 && price < 24) {
      return { accepted: true, ourPrice: 0.65, category: 'cds', priceRange: "$21-23.99", rankRange: "50k-100k" };
    }
    if (price >= 24 && price < 29) {
      return { accepted: true, ourPrice: 0.9, category: 'cds', priceRange: "$24-28.99", rankRange: "50k-100k" };
    }
    if (price >= 29 && price < 35) {
      return { accepted: true, ourPrice: 1.15, category: 'cds', priceRange: "$29-34.99", rankRange: "50k-100k" };
    }
    if (price >= 35 && price < 48) {
      return { accepted: true, ourPrice: 1.65, category: 'cds', priceRange: "$35-47.99", rankRange: "50k-100k" };
    }
    if (price >= 48 && price < 60) {
      return { accepted: true, ourPrice: 2.65, category: 'cds', priceRange: "$48-59.99", rankRange: "50k-100k" };
    }
    if (price >= 60 && price < 72) {
      return { accepted: true, ourPrice: 3.65, category: 'cds', priceRange: "$60-71.99", rankRange: "50k-100k" };
    }
    if (price >= 72) {
      return { accepted: true, ourPrice: 4.65, category: 'cds', priceRange: "$72+", rankRange: "50k-100k" };
    }

    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price}`
    };
  }

  // CD / DVD / : rank 100k-200k
  if (salesRank <= 200000) {
    if (price >= 24 && price < 28) {
      return { accepted: true, ourPrice: 0.4, category: 'cds', priceRange: "$24-27.99", rankRange: "100k-200k" };
    }
    if (price >= 28 && price < 32) {
      return { accepted: true, ourPrice: 0.65, category: 'cds', priceRange: "$28-31.99", rankRange: "100k-200k" };
    }
    if (price >= 32 && price < 35) {
      return { accepted: true, ourPrice: 0.9, category: 'cds', priceRange: "$32-34.99", rankRange: "100k-200k" };
    }
    if (price >= 35 && price < 48) {
      return { accepted: true, ourPrice: 1.4, category: 'cds', priceRange: "$35-47.99", rankRange: "100k-200k" };
    }
    if (price >= 48 && price < 60) {
      return { accepted: true, ourPrice: 1.9, category: 'cds', priceRange: "$48-59.99", rankRange: "100k-200k" };
    }
    if (price >= 60 && price < 72) {
      return { accepted: true, ourPrice: 2.4, category: 'cds', priceRange: "$60-71.99", rankRange: "100k-200k" };
    }
    if (price >= 72) {
      return { accepted: true, ourPrice: 2.65, category: 'cds', priceRange: "$72+", rankRange: "100k-200k" };
    }

    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price}`
    };
  }

  // CD / DVD / : rank 200k-300k — AYNI
  if (salesRank <= 300000) {
    if (price >= 75) {
      return { accepted: true, ourPrice: 1.65, category: 'cds', priceRange: "$75+", rankRange: "200k-300k" };
    }

    return {
      accepted: false,
      reason: "Does not meet our purchasing criteria",
      category: 'cds',
      priceRange: `$${price}`
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

function calculateGamePrice(
  gameNewPrice: number,
  gameUsedPrice: number,
  salesRank: number
): PricingResult {
  // GAME: sadece rank 100k ve altı
  if (salesRank > 100000) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category: 'games',
      rankRange: "> 100,000"
    };
  }

  const hasGameUsedPrice = gameUsedPrice > 0;
  const hasGameNewPrice = gameNewPrice > 0;

  // GAME USED $40 veya üzeri -> USED fiyatın %20'si
  if (hasGameUsedPrice && gameUsedPrice >= 40) {
    return {
      accepted: true,
      ourPrice: Math.min(
        Math.round(gameUsedPrice * 0.20 * 100) / 100,
        50
      ),
      category: 'games',
      priceRange: `Game used $${gameUsedPrice}`,
      rankRange: "≤ 100k"
    };
  }

  // GAME USED var ama $40 altında
  if (hasGameUsedPrice && gameUsedPrice < 40) {
    // NEW fiyat da varsa CD/DVD fiyat tablosunu kullan
    if (hasGameNewPrice) {
      const gameResult = calculateCDPrice(gameNewPrice, salesRank);

      return {
        ...gameResult,
        category: 'games'
      };
    }

    // USED <$40 ve NEW yok
    return {
      accepted: true,
      ourPrice: 1.5,
      category: 'games',
      priceRange: "Game used under $40, no new price",
      rankRange: "≤ 100k"
    };
  }

  // GAME USED fiyat hiç yok
  if (!hasGameUsedPrice) {
    // NEW varsa CD/DVD fiyat tablosunu kullan
    if (hasGameNewPrice) {
      const gameResult = calculateCDPrice(gameNewPrice, salesRank);

      return {
        ...gameResult,
        category: 'games'
      };
    }

    // GAME USED yok + NEW yok
    return {
      accepted: true,
      ourPrice: 5,
      category: 'games',
      priceRange: "Game has no used or new price",
      rankRange: "≤ 100k"
    };
  }

  return {
    accepted: false,
    reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
    category: 'games'
  };
}

/**
 * SENARYO 1-2: Hiç fiyat yok (ne NEW ne USED)
* Kitap: rank ≤ 1,000,000 ise $3, 1M-1.5M ise $0.75, üstündeyse reddet
 * CD/DVD: rank ≤ 200,000 ise $3, 200k-300k ise $0.75, üstündeyse reddet
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

  if (salesRank <= NO_PRICE_BOOK_HIGH_RANK_LIMIT) {
    return {
      accepted: true,
      ourPrice: NO_PRICE_BOOK_HIGH_RANK_PRICE,
      category: 'books',
      priceRange: "No price available",
      rankRange: "1M-1.5M"
    };
  }

  return {
    accepted: false,
    reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
    category: 'books',
    rankRange: `> ${NO_PRICE_BOOK_HIGH_RANK_LIMIT.toLocaleString()}`
  };

  case 'cds':
    case 'dvds':
      if (salesRank <= NO_PRICE_MEDIA_RANK_LIMIT) {
        return {
          accepted: true,
          ourPrice: NO_PRICE_MEDIA_PRICE,
          category,
          priceRange: "No price available",
          rankRange: `≤ ${NO_PRICE_MEDIA_RANK_LIMIT.toLocaleString()}`
        };
      }

      if (salesRank <= NO_PRICE_MEDIA_HIGH_RANK_LIMIT) {
        return {
          accepted: true,
          ourPrice: NO_PRICE_MEDIA_HIGH_RANK_PRICE,
          category,
          priceRange: "No price available",
          rankRange: "200k-300k"
        };
      }

      return {
        accepted: false,
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category,
        rankRange: `> ${NO_PRICE_MEDIA_HIGH_RANK_LIMIT.toLocaleString()}`
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
 * Kitap: rank ≤ 1,000,000 ise $1.5, 1M-1.5M ise $0.75, üstündeyse reddet
 * CD/DVD: rank ≤ 200,000 ise $1.5, 200k-300k ise $0.75, üstündeyse reddet
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

  if (salesRank <= USED_ONLY_BOOK_HIGH_RANK_LIMIT) {
    return {
      accepted: true,
      ourPrice: USED_ONLY_BOOK_HIGH_RANK_PRICE,
      category: 'books',
      priceRange: "Used price only",
      rankRange: "1M-1.5M"
    };
  }

  return {
    accepted: false,
    reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
    category: 'books',
    rankRange: `> ${USED_ONLY_BOOK_HIGH_RANK_LIMIT.toLocaleString()}`
  };
  case 'cds':
    case 'dvds':
      if (salesRank <= USED_ONLY_MEDIA_RANK_LIMIT) {
        return {
          accepted: true,
          ourPrice: USED_ONLY_MEDIA_PRICE,
          category,
          priceRange: "Used price only",
          rankRange: `≤ ${USED_ONLY_MEDIA_RANK_LIMIT.toLocaleString()}`
        };
      }

      if (salesRank <= USED_ONLY_MEDIA_HIGH_RANK_LIMIT) {
        return {
          accepted: true,
          ourPrice: USED_ONLY_MEDIA_HIGH_RANK_PRICE,
          category,
          priceRange: "Used price only",
          rankRange: "200k-300k"
        };
      }

      return {
        accepted: false,
        reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
        category,
        rankRange: `> ${USED_ONLY_MEDIA_HIGH_RANK_LIMIT.toLocaleString()}`
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

  // ADIM 0: Kabul edilmeyen format kontrolü (vinyl, VHS, kaset, indirilebilir audiobook)
  // Fiyat/rank bakılmadan EN BAŞTA reddedilir.
  const rejectedFormat = checkRejectedFormat(product);
  if (rejectedFormat) {
    return {
      accepted: false,
      reason: rejectedFormat,
      category
    };
  }

  // Sales rank kontrolü - rank yoksa/geçersizse direkt reddet
  if (!product.sales_rank || product.sales_rank <= 0) {
    return {
      accepted: false,
      reason: "DOES NOT MEET OUR PURCHASING CRITERIA",
      category
    };
  }
  // GAME kendi özel fiyat motorunu kullanır
if (category === 'games') {
  return calculateGamePrice(
    product.gameNewPrice || 0,
    product.gameUsedPrice || 0,
    product.sales_rank
  );
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
    { title: "Test Book (used only, rank too high)", image: "", price: 20, sales_rank: 1600000, category: "Books", priceType: 'used' },
    { title: "Test DVD (used only, rank ok)", image: "", price: 15, sales_rank: 100000, category: "Movies & TV", priceType: 'used' },
    { title: "Test DVD (used only, rank too high)", image: "", price: 15, sales_rank: 200000, category: "Movies & TV", priceType: 'used' },

    // Hiç fiyat yok - sabit $3
    { title: "Test Book (no price, rank ok)", image: "", price: 0, sales_rank: 900000, category: "Books", priceType: 'none' },
    { title: "Test Book (no price, rank too high)", image: "", price: 0, sales_rank: 1600000, category: "Books", priceType: 'none' },
    { title: "Test Game (no price, rank ok)", image: "", price: 0, sales_rank: 120000, category: "Video Games", priceType: 'none' },
    { title: "Test Game (no price, rank too high)", image: "", price: 0, sales_rank: 180000, category: "Video Games", priceType: 'none' },

    // Kabul edilmeyen formatlar - hepsi reddedilmeli
    { title: "Test Vinyl", image: "", price: 78, sales_rank: 5000, category: "CDs & Vinyl", priceType: 'new', binding: 'lp_record', type: 'ABIS_MUSIC' },
    { title: "Test VHS", image: "", price: 31, sales_rank: 5000, category: "Movies & TV", priceType: 'used', binding: 'VHStape', type: 'ABIS_VIDEO' },
    { title: "Test Cassette", image: "", price: 0, sales_rank: 2255, category: "CDs & Vinyl", priceType: 'none', binding: 'cassette', type: 'ABIS_MUSIC' },
    { title: "Test Audiobook (downloadable)", image: "", price: 0, sales_rank: 447308, category: "Books", priceType: 'none', binding: '', type: 'DOWNLOADABLE_AUDIO' },
  ];

  testProducts.forEach((product, index) => {
    const result = calculateOurPrice(product);
    console.log(`${index + 1}. ${product.title}:`);
    console.log(`   ${formatPricingMessage(result)} ${result.accepted ? `-> $${result.ourPrice}` : ''}`);
    console.log(`   Category: ${result.category}, Price: $${product.price}, Rank: ${product.sales_rank}, PriceType: ${product.priceType}`);
    console.log('');
  });
}