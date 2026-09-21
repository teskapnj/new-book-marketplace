// /app/api/amazon-check/route.ts
// KEEPA API - SINGLE PRODUCT LOOKUP (Oxylabs'tan geçiş)
import { NextRequest, NextResponse, after } from 'next/server';
import axios from 'axios';
import { productCache } from '@/lib/productCache';

let calculateOurPrice: any;
try {
  const pricingEngine = require('@/lib/pricingEngine');
  calculateOurPrice = pricingEngine.calculateOurPrice;
} catch (e) {
  console.error('Failed to import pricingEngine:', e);
}

// ==================== TİP TANIMLAMALARI ====================

interface AmazonProduct {
  title: string;
  image: string;
  price: number;
  sales_rank: number;
  category: string;
  asin: string;
  priceType?: 'new' | 'used' | 'none';
  // BOOKS: Keepa lowest USED fiyatı. NEW olsa bile ayrıca taşınır.
  bookUsedPrice?: number;
  // GAME için Keepa NEW ve USED fiyatları ayrı tutulur
  gameNewPrice?: number;
  gameUsedPrice?: number;
  gamePlatform?: string;
  // Keepa format bilgisi (kategori filtresi icin pricingEngine'e gecer)
  binding?: string;
  type?: string;
}

interface PricingResult {
  accepted: boolean;
  ourPrice?: number;
  reason?: string;
  category: 'books' | 'cds' | 'dvds' | 'games' | 'unknown';
  priceRange?: string;
  rankRange?: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    product: AmazonProduct;
    pricing: PricingResult;
    message: string;
    debug?: {
      searchMethod?: string;
      lookupType?: string;
      cacheHit?: boolean;
      priceAnalysis?: {
        bestPrice?: number;
        bestCondition?: string;
        hasNewPrice?: boolean;
        analysisDetails?: string;
        bookUsedPrice?: number;
        gameNewPrice?: number;
        gameUsedPrice?: number;
      };
      timings?: { totalTime?: number };
      [key: string]: any; // eski cache kayıtlarındaki (apiCalls, hasRank vb.) alanlara izin verir
    };
  };
  error?: string;
}

// Keepa domain kodu: 1 = amazon.com (US)
const KEEPA_DOMAIN = 1;

// Veri bu saatten daha yeniyse Keepa canli tarama yapmadan kendi cache'inden doner.
// Alim fiyati karari icin 24 saatlik BSR/fiyat fazlasiyla yeterli.
// Dusurmek = daha taze veri + daha yavas + daha cok token.
const KEEPA_UPDATE_HOURS = 24;

// Bu surumu film kabul/red kurallari degistiginde artir.
// Eski DVD/Blu-ray cache kayitlari boylece bir kez Keepa'dan tazelenir.
const MOVIE_RULES_VERSION = 2;

// ==================== KOD TİPİ ALGILAMA (aynı, değişmedi) ====================

function convertISBN13toISBN10(isbn13: string): string | null {
  const clean = isbn13.replace(/[^0-9]/g, '');
  if (clean.length !== 13 || !clean.startsWith('978')) return null;

  const isbn10Base = clean.substring(3, 12);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn10Base[i]) * (10 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 11;
  const checkChar = checkDigit === 10 ? 'X' : checkDigit.toString();
  return isbn10Base + checkChar;
}

function detectCodeType(code: string): {
  type: 'isbn' | 'upc' | 'asin' | 'unknown';
  searchCode: string;
  converted?: boolean;
  needsCodeLookup?: boolean;
} {
  const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '');

  // ASIN formatı (B ile başlayan 10 karakter)
  if (cleanCode.length === 10 && /^B[A-Z0-9]{9}$/.test(cleanCode)) {
    return { type: 'asin', searchCode: cleanCode };
  }

  // ISBN-10 -> Keepa'da doğrudan ASIN gibi kullanılabilir (kitaplar için)
  if (cleanCode.length === 10 && /^\d{9}[\dX]$/.test(cleanCode)) {
    return { type: 'isbn', searchCode: cleanCode };
  }

  // ISBN-13 (978 önekli -> ISBN-10'a çevrilebilir, 979 önekli -> code lookup gerekir)
  if (cleanCode.length === 13 && /^97[89]\d{10}$/.test(cleanCode)) {
    if (cleanCode.startsWith('978')) {
      const isbn10 = convertISBN13toISBN10(cleanCode);
      if (isbn10) {
        console.log(`ISBN-13 converted: ${cleanCode} → ${isbn10}`);
        return { type: 'isbn', searchCode: isbn10, converted: true };
      }
    }

    // 979 önekli ISBN-13 -> Keepa'nın "code" parametresiyle arattırılır
    console.log(`ISBN-13 needs Keepa code lookup: ${cleanCode}`);

    return {
      type: 'isbn',
      searchCode: cleanCode,
      needsCodeLookup: true
    };
  }

  // EAN-13 (CD/DVD/Oyun vb.) -> Keepa "code" parametresiyle arattırılır
  if (cleanCode.length === 13 && /^\d{13}$/.test(cleanCode)) {
    return {
      type: 'upc',
      searchCode: cleanCode,
      needsCodeLookup: true
    };
  }

  // UPC (CD/DVD/Oyun) -> Keepa "code" parametresiyle arattırılır
  if (cleanCode.length === 12 && /^\d{12}$/.test(cleanCode)) {
    return {
      type: 'upc',
      searchCode: cleanCode,
      needsCodeLookup: true
    };
  }

  // EAN-8
  if (cleanCode.length === 8 && /^\d{8}$/.test(cleanCode)) {
    return {
      type: 'upc',
      searchCode: cleanCode,
      needsCodeLookup: true
    };
  }

  return { type: 'unknown', searchCode: cleanCode };
}

// ==================== KEEPA API ÇAĞRILARI ====================

/**
 * ASIN veya ISBN-10 ile doğrudan ürün sorgusu (arama gerektirmez)
 */
async function fetchKeepaByAsin(asin: string, apiKey: string) {
  const url = `https://api.keepa.com/product`;
  const response = await axios.get(url, {
    params: {
      key: apiKey,
      domain: KEEPA_DOMAIN,
      asin: asin,
      stats: 1, // son 1 gün istatistik (current fiyat/rank için yeterli)
      history: 0,
      update: KEEPA_UPDATE_HOURS
    },
    timeout: 4000
  });
  return response.data;
}

/**
 * UPC/EAN/ISBN-13 ile ürün sorgusu (Keepa kendi tarafında ASIN'e çeviriyor)
 */
async function fetchKeepaByCode(code: string, apiKey: string) {
  const url = `https://api.keepa.com/product`;
  const response = await axios.get(url, {
    params: {
      key: apiKey,
      domain: KEEPA_DOMAIN,
      code: code,
      stats: 1,
      update: KEEPA_UPDATE_HOURS
    },
    timeout: 4000
  });
  return response.data;
}

// ==================== KEEPA VERİ ÇIKARIMI ====================

/**
 * Fiyat mantığı: senin kriterine göre -
 * Yeni fiyat varsa onu kullan, yoksa en düşük used fiyatını kullan.
 * Keepa stats.current dizisi: [0]=Amazon, [1]=New, [2]=Used, [3]=SalesRank ...
 * Değer -1 ise o veri mevcut değil demektir. Fiyatlar cent cinsindendir.
 */
function extractKeepaPricing(product: any): {
  price: number;
  hasNewPrice: boolean;
  bestCondition: string;
  analysisDetails: string;
  bookUsedPrice: number;
  gameNewPrice: number;
  gameUsedPrice: number;
} {
  const current = product?.stats?.current;

  if (!current) {
    return {
      price: 0,
      hasNewPrice: false,
      bestCondition: 'unknown',
      analysisDetails: 'No stats available',
      bookUsedPrice: 0,
      gameNewPrice: 0,
      gameUsedPrice: 0
    };
  }

  const newPriceCents = current[1];
  const usedPriceCents = current[2];
  const gameNewPrice =
    typeof newPriceCents === 'number' && newPriceCents > 0
      ? newPriceCents / 100
      : 0;

  const gameUsedPrice =
    typeof usedPriceCents === 'number' && usedPriceCents > 0
      ? usedPriceCents / 100
      : 0;

  // BOOKS da ayni Keepa current[2] lowest USED degerini kullanir.
  // NEW fiyat mevcut olsa bile bu alan ayrica pricingEngine'e gonderilir.
  const bookUsedPrice = gameUsedPrice;

  if (typeof newPriceCents === 'number' && newPriceCents > 0) {
    return {
      price: newPriceCents / 100,
      hasNewPrice: true,
      bestCondition: 'new',
      analysisDetails: `Keepa NEW price: $${(newPriceCents / 100).toFixed(2)}`,
      bookUsedPrice,
      gameNewPrice,
      gameUsedPrice
    };
  }

  if (typeof usedPriceCents === 'number' && usedPriceCents > 0) {
    return {
      price: usedPriceCents / 100,
      hasNewPrice: false,
      bestCondition: 'used',
      analysisDetails: `Keepa lowest USED price: $${(usedPriceCents / 100).toFixed(2)}`,
      bookUsedPrice,
      gameNewPrice,
      gameUsedPrice
    };
  }

  return {
    price: 0,
    hasNewPrice: false,
    bestCondition: 'unknown',
    analysisDetails: 'No valid price in stats.current',
    bookUsedPrice: 0,
    gameNewPrice: 0,
    gameUsedPrice: 0
  };
}

function extractKeepaSalesRank(product: any): number {
  console.log("🔎 RANK DEBUG:", {
    asin: product?.asin,
    rootCategory: product?.rootCategory,
    salesRankReference: product?.salesRankReference,
    statsSalesRank: product?.stats?.current?.[3],
    salesRankKeys: product?.salesRanks ? Object.keys(product.salesRanks) : [],
    categoryTree: product?.categoryTree
  });

  const rankFromStats = product?.stats?.current?.[3];
  const salesRankReference = product?.salesRankReference;

  // SADECE ana Amazon kategori rank'lari kabul edilir.
  // Alt kategori rank'lari hiçbir şartta kullanılmaz.
  const MAIN_SALES_RANK_REFERENCES = new Set([
    283155,      // Books
    5174,        // CDs & Vinyl
    2625373011,  // Movies & TV
    468642       // Video Games
  ]);

  if (
    typeof rankFromStats === 'number' &&
    rankFromStats > 0 &&
    typeof salesRankReference === 'number' &&
    MAIN_SALES_RANK_REFERENCES.has(salesRankReference)
  ) {
    return rankFromStats;
  }

  return 0;
}

function extractKeepaCategory(product: any): string {
  if (product?.categoryTree && product.categoryTree.length > 0) {
    return product.categoryTree[0].name;
  }
  if (product?.productGroup) return product.productGroup;
  return 'Unknown';
}

function extractKeepaGamePlatform(product: any): string {
  if (!Array.isArray(product?.categoryTree)) return '';

  return product.categoryTree
    .map((node: any) => String(node?.name || '').trim())
    .filter(Boolean)
    .join(' > ');
}

function extractKeepaImage(product: any): string {
  // 1. Eski format: imagesCSV (virgülle ayrılmış dosya adları)
  if (product?.imagesCSV) {
    const firstImage = product.imagesCSV.split(',')[0];
    if (firstImage) {
      return `https://images-na.ssl-images-amazon.com/images/I/${firstImage}`;
    }
  }

  // 2. Yeni format: images dizisi (obje listesi, l=large m=medium)
  if (Array.isArray(product?.images) && product.images.length > 0) {
    const img = product.images[0];
    const fileName = img?.l || img?.m || '';
    if (fileName) {
      return `https://images-na.ssl-images-amazon.com/images/I/${fileName}`;
    }
  }

  return '';
}
function flattenKeepaText(value: any): string {
  if (value == null) return '';

  if (Array.isArray(value)) {
    return value.map(flattenKeepaText).join(' ');
  }

  if (typeof value === 'object') {
    return Object.values(value).map(flattenKeepaText).join(' ');
  }

  return String(value);
}

function isPhysicalMovieProduct(product: any): boolean {
  const categoryPath = Array.isArray(product?.categoryTree)
    ? product.categoryTree
        .map((node: any) => String(node?.name || ''))
        .join(' ')
        .toLowerCase()
    : '';

  const type = String(product?.type || '').toUpperCase();

  return (
    type === 'PHYSICAL_MOVIE' ||
    type === 'VIDEO_DVD' ||
    product?.rootCategory === 2625373011 ||
    categoryPath.includes('movies & tv') ||
    categoryPath.includes('dvd') ||
    categoryPath.includes('blu-ray')
  );
}

function isRentalMovie(product: any): boolean {
  if (!isPhysicalMovieProduct(product)) {
    return false;
  }

  const titleText = flattenKeepaText(product?.title);

  // Edition/format alanlarinda tek basina "Rental" bilgisi anlamlidir.
  const structuredRentalText = [
    product?.format,
    product?.edition,
  ]
    .map(flattenKeepaText)
    .join(' ');

  // Aciklama alanlarinda yalnizca daha acik rental ifadelerini kabul et.
  // Boylece film hikayesinde gecen "rental car" / "vacation rental" gibi
  // ifadeler normal bir DVD'yi yanlislikla reddetmez.
  const descriptiveText = [
    product?.itemHighlights,
    product?.features,
    product?.description,
    product?.shortDescription,
  ]
    .map(flattenKeepaText)
    .join(' ');

  const explicitRentalPattern =
    /\b(?:rental version|rental edition|rental copy|rental exclusive|rental only|former rental|ex[-\s]?rental)\b/i;

  return (
    /\brental\b/i.test(structuredRentalText) ||
    /\(\s*rental\s*\)|\[\s*rental\s*\]/i.test(titleText) ||
    explicitRentalPattern.test(titleText) ||
    explicitRentalPattern.test(descriptiveText)
  );
}

function detectMovieRestriction(product: any): string | null {
  if (!isPhysicalMovieProduct(product)) {
    return null;
  }

  const searchableText = [
    product?.title,
    product?.format,
    product?.edition,
    product?.itemHighlights,
    product?.features,
    product?.description,
    product?.shortDescription,
  ]
    .map(flattenKeepaText)
    .join(' ');

  if (isRentalMovie(product)) {
    return 'We do not accept rental-version DVDs/Blu-rays.';
  }

  // Region 2 veya Region 3
  const regionMatch = searchableText.match(
    /\b(?:playback\s+)?region(?:\s+code)?\s*[:#-]?\s*(2|3)\b/i
  );

  if (regionMatch) {
    return `We do not accept Region ${regionMatch[1]} DVDs/Blu-rays.`;
  }

  // PAL format
  const formatText = flattenKeepaText(product?.format);

  if (/\bpal\b/i.test(formatText)) {
    return 'We do not accept PAL DVDs/Blu-rays.';
  }

  return null;
}

/**
 * Keepa "code" sorgusu birden fazla ürün döndürebilir
 * (aynı barkod farklı varyant/edisyona denk gelebilir).
 * Geçerli fiyat verisi olan ilk ürünü seç.
 */
function pickBestKeepaProduct(products: any[], searchCode: string): any | null {
  if (!products || products.length === 0) return null;

  const normalizedCode = String(searchCode || '')
    .replace(/[-\s]/g, '')
    .toUpperCase();

  // ISBN-10 veya ISBN-13 ise KITAP mantigi kullan.
  const isIsbnLookup =
    /^\d{9}[\dX]$/.test(normalizedCode) ||
    /^97[89]\d{10}$/.test(normalizedCode);

  if (isIsbnLookup) {
    // Sadece Books ana kategorisindeki sonuclari al.
    const bookProducts = products.filter((p) => {
      return (
        p?.rootCategory === 283155 ||
        extractKeepaCategory(p).toLowerCase() === 'books'
      );
    });

    if (bookProducts.length > 0) {
      // Mumkunse girilen ISBN ile gercekten eslesen listingleri ayir.
      const exactMatches = bookProducts.filter((p) => {
        const codes = [
          ...(Array.isArray(p?.eanList) ? p.eanList : []),
          ...(Array.isArray(p?.upcList) ? p.upcList : []),
          ...(Array.isArray(p?.gtinList) ? p.gtinList : [])
        ]
          .map((v: any) =>
            String(v || '').replace(/[-\s]/g, '').toUpperCase()
          );

        // ISBN-10 kitaplarda ASIN genellikle ISBN-10 ile aynidir.
        return (
          codes.includes(normalizedCode) ||
          String(p?.asin || '').toUpperCase() === normalizedCode
        );
      });

      const candidates =
        exactMatches.length > 0 ? exactMatches : bookProducts;

      // Kitaplarda sadece gercek ANA Books rank'i olan listingleri tercih et.
      const rankedBooks = candidates.filter(
        (p) => extractKeepaSalesRank(p) > 0
      );

      if (rankedBooks.length > 0) {
        // Birden fazla gecerli listing varsa en iyi ANA Books rank'ini sec.
        return rankedBooks.reduce((best, current) => {
          const bestRank = extractKeepaSalesRank(best);
          const currentRank = extractKeepaSalesRank(current);

          return currentRank < bestRank ? current : best;
        });
      }

      // Books sonucu var ama hicbirinde gecerli ana rank yok.
      // Ilkini dondur; extractKeepaSalesRank = 0 olacagi icin pricingEngine reddeder.
      return candidates[0];
    }
  }

  // ============================================================
  // CD / DVD / BLU-RAY / GAME:
  // ESKI MANTIK AYNEN KALIYOR.
  // Birden fazla varyasyonda en dusuk fiyatli olani sec.
  // ============================================================
  console.log(
    "💿 MEDIA CANDIDATES:",
    products.map((p) => ({
      asin: p?.asin,
      price: extractKeepaPricing(p).price,
      rank: extractKeepaSalesRank(p)
    }))
  );

  let cheapest: any | null = null;
  let cheapestPrice = Infinity;

  for (const p of products) {
    const pricing = extractKeepaPricing(p);
    const rank = extractKeepaSalesRank(p);

    if (rank > 0 && pricing.price > 0 && pricing.price < cheapestPrice) {
      cheapestPrice = pricing.price;
      cheapest = p;
    }
  }

  if (cheapest) return cheapest;

  // Hicbirinde fiyat yoksa en iyi gecerli ana rank'i sec.
  let bestRanked = products[0];
  let bestRank = Infinity;

  for (const p of products) {
    const rank = extractKeepaSalesRank(p);

    if (rank > 0 && rank < bestRank) {
      bestRank = rank;
      bestRanked = p;
    }
  }

  return bestRanked;
}

// ==================== POST /api/amazon-check ====================

export async function POST(request: NextRequest) {
  const totalStartTime = Date.now();

  try {
    const body = await request.json();
    const { isbn_upc } = body;

    if (!isbn_upc || typeof isbn_upc !== 'string') {
      console.warn('INVALID PRODUCT CODE: missing or non-string isbn_upc');

      return NextResponse.json(
        { success: false, error: 'only valid ISBN or UPC code or ASIN' } as ApiResponse,
        { status: 400 }
      );
    }

    const cleanCode = isbn_upc.replace(/[^a-zA-Z0-9X]/gi, '').trim().toUpperCase();
    const codeInfo = detectCodeType(cleanCode);

    if (codeInfo.type === 'unknown') {
      console.warn(`INVALID PRODUCT CODE FORMAT: ${cleanCode}`);

      return NextResponse.json(
        { success: false, error: 'invalid ISBN/UPC format' } as ApiResponse,
        { status: 400 }
      );
    }

    console.log(`\nKEEPA LOOKUP: ${cleanCode} (${codeInfo.type})`);

    // ---- Cache kontrolü ----
    const cacheReadStart = Date.now();
    const cachedResult = await productCache.getFromCache(cleanCode);
    console.log(`⏱️ cacheRead=${Date.now() - cacheReadStart}ms`);

    if (cachedResult) {
      // Keepa daha once bu barkod icin urun bulamadiysa 24 saat boyunca
      // yeniden Keepa'ya gitmeden ayni 404 cevabini dondur.
      if ('notFound' in cachedResult) {
        console.log(`⚡ NOT FOUND CACHE HIT: ${cleanCode}`);

        return NextResponse.json(
          {
            success: false,
            error: 'Product not found. Please check the barcode and try again later.'
          } as ApiResponse,
          { status: 404 }
        );
      }

      const cachedProduct: any = { ...cachedResult.product };

      // Eski cache kayitlarinda bookUsedPrice olmayabilir.
      // gameUsedPrice Keepa stats.current[2] degerinden geldigi icin
      // varsa kitaplar icin lowest USED kaynagi olarak guvenle kullanabiliriz.
      const cachedCategory = String(cachedProduct?.category || '').toLowerCase();
      const isCachedBook =
        cachedCategory.includes('book') || cachedCategory.includes('kindle');

      const cachedType = String(cachedProduct?.type || '').toUpperCase();
      const isCachedMovie =
        cachedResult.pricing?.category === 'dvds' ||
        cachedType === 'PHYSICAL_MOVIE' ||
        cachedType === 'VIDEO_DVD' ||
        cachedCategory.includes('movie') ||
        cachedCategory.includes('dvd') ||
        cachedCategory.includes('blu-ray');

      const cachedMovieRulesVersion =
        Number((cachedResult.debug as any)?.movieRulesVersion || 0);

      const needsMovieRulesRefresh =
        isCachedMovie && cachedMovieRulesVersion !== MOVIE_RULES_VERSION;

      const isLegacyBookCacheMissingUsedSnapshot =
        isCachedBook &&
        cachedProduct.bookUsedPrice == null &&
        cachedProduct.gameUsedPrice == null &&
        cachedProduct.priceType !== 'used' &&
        cachedProduct.priceType !== 'none';

      // Eski BOOK cache kaydinda USED snapshot'i yoksa veya DVD/Blu-ray kaydi
      // eski film kurallariyla olusturulduysa cache'i kullanma; Keepa'dan tazele.
      if (isLegacyBookCacheMissingUsedSnapshot || needsMovieRulesRefresh) {
        if (isLegacyBookCacheMissingUsedSnapshot) {
          console.log(`♻️ LEGACY BOOK CACHE REFRESH: ${cleanCode}`);
        }
        if (needsMovieRulesRefresh) {
          console.log(
            `♻️ MOVIE RULES CACHE REFRESH: ${cleanCode} | ` +
            `cachedVersion=${cachedMovieRulesVersion} -> ${MOVIE_RULES_VERSION}`
          );
        }
      } else {
        if (isCachedBook && cachedProduct.bookUsedPrice == null) {
          cachedProduct.bookUsedPrice = cachedProduct.gameUsedPrice || 0;
        }

        // Sadece BOOKS icin yeni kurali cache hit'te yeniden hesapla.
        // CD/DVD/GAME mevcut cache davranisini aynen korur.
        const cachedPricing: any = isCachedBook
          ? calculateOurPrice(cachedProduct)
          : cachedResult.pricing;

        const cachedMessage = isCachedBook
          ? cachedPricing.accepted && cachedPricing.ourPrice
            ? 'ACCEPTED'
            : 'DOES NOT MEET OUR PURCHASING CRITERIA'
          : cachedResult.message;

        console.log(
          `⚡ CACHE HIT: ${cleanCode} | ` +
          `Price: $${cachedProduct?.price ?? 0} (${cachedProduct?.priceType || 'unknown'}) | ` +
          `${cachedPricing?.category === 'books'
            ? `BookUSED: $${cachedProduct?.bookUsedPrice ?? 0} | Rule: ${cachedPricing?.priceRange || 'N/A'} | `
            : ''}` +
          `${cachedPricing?.category === 'games'
            ? `Platform: ${cachedProduct?.gamePlatform || 'N/A'} | GameNEW: $${cachedProduct?.gameNewPrice ?? 0} | GameUSED: $${cachedProduct?.gameUsedPrice ?? 0} | Rule: ${cachedPricing?.priceRange || 'N/A'} | `
            : ''}` +
          `Rank: ${cachedProduct?.sales_rank ?? 0} | ` +
          `Category: ${cachedProduct?.category || 'Unknown'} | ` +
          `Binding: ${cachedProduct?.binding || 'N/A'} | ` +
          `Type: ${cachedProduct?.type || 'N/A'} | ` +
          `Status: ${cachedPricing?.accepted ? 'ACCEPTED' : 'REJECTED'} | ` +
          `Offer: ${cachedPricing?.accepted && cachedPricing?.ourPrice != null ? `$${cachedPricing.ourPrice}` : 'N/A'}`
        );

        return NextResponse.json({
          success: true,
          data: {
            product: cachedProduct,
            pricing: cachedPricing,
            message: cachedMessage,
            debug: { ...cachedResult.debug, cacheHit: true }
          }
        } as ApiResponse);
      }
    }

    const apiKey = process.env.KEEPA_API_KEY;
    if (!apiKey) {
      console.error('KEEPA_API_KEY missing in environment');
      return NextResponse.json(
        { success: false, error: 'Please try again later.' } as ApiResponse,
        { status: 500 }
      );
    }

    // ---- Keepa sorgusu ----
    let keepaResponse: any;
    const keepaStart = Date.now();
    try {
      if (codeInfo.needsCodeLookup) {
        keepaResponse = await fetchKeepaByCode(codeInfo.searchCode, apiKey);
      } else {
        keepaResponse = await fetchKeepaByAsin(codeInfo.searchCode, apiKey);
      }
    } catch (err: any) {
      console.error('Keepa API error:', err?.response?.data || err.message);
      const status = err?.response?.status;
      if (status === 429) {
        return NextResponse.json(
          { success: false, error: 'Please try again later.' } as ApiResponse,
          { status: 429 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Unable to verify product details. Please try scanning again later.' } as ApiResponse,
        { status: 500 }
      );
    }
    console.log(`🎫 Tokens: consumed=${keepaResponse?.tokensConsumed}, left=${keepaResponse?.tokensLeft}, keepaMs=${keepaResponse?.processingTimeInMs}, roundTrip=${Date.now() - keepaStart}ms`);

    const products = keepaResponse?.products;

    console.log('📦 KEEPA RESULT:', {
      cleanCode,
      searchCode: codeInfo.searchCode,
      lookupType: codeInfo.needsCodeLookup ? 'code' : 'asin',
      productCount: Array.isArray(products) ? products.length : 0,
      asins: Array.isArray(products)
        ? products.map((p: any) => p?.asin).filter(Boolean)
        : [],
      error: keepaResponse?.error || null
    });

    const bestProduct = pickBestKeepaProduct(products, codeInfo.searchCode);

    if (!bestProduct) {
      console.warn(`PRODUCT NOT FOUND: ${cleanCode} (${codeInfo.type})`);

      // Negatif cache: ayni bulunamayan barkod 24 saat boyunca
      // tekrar Keepa tokeni tuketmesin.
      await productCache.saveNotFoundToCache(
        cleanCode,
        codeInfo.type
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Product not found. Please check the barcode and try again later.'
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Ayni barkod birden fazla listing dondurebilir. Secilen urun filmse ve
    // ayni barkod adaylarindan herhangi biri acikca rental olarak isaretliyse
    // barkodun tamamini reddet. Bu, rental ghost listing vakalarini yakalar.
    const hasRentalCandidate =
      isPhysicalMovieProduct(bestProduct) &&
      Array.isArray(products) &&
      products.some((p: any) => isRentalMovie(p));

    // ---- Veri çıkarımı ----
    const priceAnalysis = extractKeepaPricing(bestProduct);
    const salesRank = extractKeepaSalesRank(bestProduct);
    const category = extractKeepaCategory(bestProduct);
    const title = bestProduct.title || 'Title not found';
    const image = extractKeepaImage(bestProduct);
    const asin = bestProduct.asin || codeInfo.searchCode;

    const product: AmazonProduct = {
      title,
      image,
      price: priceAnalysis.price,
      sales_rank: salesRank,
      category,
      asin,
      priceType: priceAnalysis.price <= 0
        ? 'none'
        : priceAnalysis.hasNewPrice ? 'new' : 'used',
      // BOOKS: NEW fiyat olsa bile lowest USED ayrica pricingEngine'e gider
      bookUsedPrice: priceAnalysis.bookUsedPrice,
      // GAME pricingEngine için ayrı Keepa fiyatları
      gameNewPrice: priceAnalysis.gameNewPrice,
      gameUsedPrice: priceAnalysis.gameUsedPrice,
      gamePlatform: extractKeepaGamePlatform(bestProduct),
      // Keepa format bilgisi -> pricingEngine kategori filtresi icin
      binding: bestProduct.binding || '',
      type: bestProduct.type || ''
    };

    const mediaRestriction = hasRentalCandidate
      ? 'We do not accept rental-version DVDs/Blu-rays.'
      : detectMovieRestriction(bestProduct);

    const pricingResult: PricingResult = mediaRestriction
      ? {
        accepted: false,
        reason: mediaRestriction,
        category: 'dvds'
      }
      : calculateOurPrice(product);

    const message =
      pricingResult.accepted && pricingResult.ourPrice
        ? 'ACCEPTED'
        : pricingResult.reason &&
          pricingResult.reason !== 'DOES NOT MEET OUR PURCHASING CRITERIA'
          ? pricingResult.reason
          : 'DOES NOT MEET OUR PURCHASING CRITERIA';

    const totalTime = Date.now() - totalStartTime;

    const debugInfo = {
      searchMethod: 'keepa-single-product',
      lookupType: codeInfo.needsCodeLookup ? 'code' : 'asin',
      cacheHit: false,
      movieRulesVersion: MOVIE_RULES_VERSION,
      priceAnalysis,
      timings: { totalTime }
    };

    // Cache yazmasi kullaniciyi bekletmez.
    // Next.js after() response dondükten sonra islemin tamamlanmasina izin verir.
    const cacheWriteStart = Date.now();

    after(async () => {
      try {
        await productCache.saveToCache(
          cleanCode,
          codeInfo.type,
          product,
          pricingResult,
          message,
          debugInfo
        );

        console.log(
          `💾 CACHE WRITE: ${cleanCode} | ` +
          `Price: $${product.price ?? 0} (${product.priceType || 'unknown'}) | ` +
          `${pricingResult.category === 'books'
            ? `BookUSED: $${product.bookUsedPrice ?? 0} | Rule: ${pricingResult.priceRange || 'N/A'} | `
            : ''}` +
          `${pricingResult.category === 'games'
            ? `Platform: ${product.gamePlatform || 'N/A'} | GameNEW: $${product.gameNewPrice ?? 0} | GameUSED: $${product.gameUsedPrice ?? 0} | Rule: ${pricingResult.priceRange || 'N/A'} | `
            : ''}` +
          `Rank: ${product.sales_rank ?? 0} | ` +
          `Category: ${product.category || 'Unknown'} | ` +
          `Status: ${pricingResult.accepted ? 'ACCEPTED' : 'REJECTED'} | ` +
          `Offer: ${pricingResult.accepted && pricingResult.ourPrice != null ? `$${pricingResult.ourPrice}` : 'N/A'} | ` +
          `${Date.now() - cacheWriteStart}ms`
        );
      } catch (err) {
        console.error('Cache save error:', err);
      }
    });

    const speedLabel = totalTime < 1000 ? 'ULTRA FAST' : totalTime < 2000 ? 'FAST' : 'NORMAL';
    console.log(`[${speedLabel}] ${totalTime}ms - Keepa lookup (${debugInfo.lookupType})`);

    console.log(
      `💰 KEEPA: ${cleanCode} | ` +
      `Price: $${priceAnalysis.price} (${priceAnalysis.bestCondition}) | ` +
      `${pricingResult.category === 'books'
        ? `BookUSED: $${product.bookUsedPrice ?? 0} | Rule: ${pricingResult.priceRange || 'N/A'} | `
        : ''}` +
      `${pricingResult.category === 'games'
        ? `Platform: ${product.gamePlatform || 'N/A'} | GameNEW: $${product.gameNewPrice ?? 0} | GameUSED: $${product.gameUsedPrice ?? 0} | Rule: ${pricingResult.priceRange || 'N/A'} | `
        : ''}` +
      `Rank: ${salesRank} | ` +
      `Category: ${category} | ` +
      `Binding: ${product.binding || 'N/A'} | ` +
      `Type: ${product.type || 'N/A'} | ` +
      `Status: ${pricingResult.accepted ? 'ACCEPTED' : 'REJECTED'} | ` +
      `Offer: ${pricingResult.accepted && pricingResult.ourPrice != null ? `$${pricingResult.ourPrice}` : 'N/A'}`
    );

    return NextResponse.json({
      success: true,
      data: { product, pricing: pricingResult, message, debug: debugInfo }
    } as ApiResponse);

  } catch (error: any) {
    const totalTime = Date.now() - totalStartTime;
    console.error(`ERROR [${totalTime}ms]: ${error.toString()}`);

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return NextResponse.json(
        { success: false, error: 'Please try again later.' } as ApiResponse,
        { status: 408 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Please try again later.' } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function GET() {
  const hasConfig = !!process.env.KEEPA_API_KEY;
  return NextResponse.json({
    success: true,
    message: 'Amazon Product API - Keepa Powered',
    configured: hasConfig,
    timestamp: new Date().toISOString()
  });
}