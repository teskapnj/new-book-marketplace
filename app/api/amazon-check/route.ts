// /app/api/amazon-check/route.ts
// KEEPA API - SINGLE PRODUCT LOOKUP (Oxylabs'tan geçiş)
import { NextRequest, NextResponse } from 'next/server';
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
    return { type: 'isbn', searchCode: cleanCode, needsCodeLookup: true };
  }

  // UPC (CD/DVD/Oyun) -> Keepa "code" parametresiyle arattırılır
  if (cleanCode.length === 12 && /^\d{12}$/.test(cleanCode)) {
    return { type: 'upc', searchCode: cleanCode, needsCodeLookup: true };
  }

  // EAN-8
  if (cleanCode.length === 8 && /^\d{8}$/.test(cleanCode)) {
    return { type: 'upc', searchCode: cleanCode, needsCodeLookup: true };
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
      update: KEEPA_UPDATE_HOURS
    },
    timeout: 3000
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
    timeout: 3000
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
} {
  const current = product?.stats?.current;

  if (!current) {
    return { price: 0, hasNewPrice: false, bestCondition: 'unknown', analysisDetails: 'No stats available' };
  }

  const newPriceCents = current[1];
  const usedPriceCents = current[2];

  if (typeof newPriceCents === 'number' && newPriceCents > 0) {
    return {
      price: newPriceCents / 100,
      hasNewPrice: true,
      bestCondition: 'new',
      analysisDetails: `Keepa NEW price: $${(newPriceCents / 100).toFixed(2)}`
    };
  }

  if (typeof usedPriceCents === 'number' && usedPriceCents > 0) {
    return {
      price: usedPriceCents / 100,
      hasNewPrice: false,
      bestCondition: 'used',
      analysisDetails: `Keepa lowest USED price: $${(usedPriceCents / 100).toFixed(2)}`
    };
  }

  return { price: 0, hasNewPrice: false, bestCondition: 'unknown', analysisDetails: 'No valid price in stats.current' };
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
  const rootCategory = product?.rootCategory;
  const salesRankReference = product?.salesRankReference;

  // Sadece ana/root kategori sales rank kabul edilir.
  // Alt kategori rank'lari fallback olarak kullanilmaz.
  if (
    typeof rankFromStats === 'number' &&
    rankFromStats > 0 &&
    typeof rootCategory === 'number' &&
    rootCategory > 0 &&
    salesRankReference === rootCategory
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

    if (pricing.price > 0 && pricing.price < cheapestPrice) {
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

    // ---- Cache kontrolü (değişmedi) ----
    const cacheReadStart = Date.now();
    const cachedResult = await productCache.getFromCache(cleanCode);
    console.log(`⏱️ cacheRead=${Date.now() - cacheReadStart}ms`);
    if (cachedResult) {
      console.log(`Cache hit: ${cleanCode}`);
      return NextResponse.json({
        success: true,
        data: {
          product: cachedResult.product,
          pricing: cachedResult.pricing,
          // Cache bilgisi kullaniciya gosterilmez, debug.cacheHit alaninda zaten var
          message: cachedResult.message,
          debug: { ...cachedResult.debug, cacheHit: true }
        }
      } as ApiResponse);
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
    
      return NextResponse.json(
        { success: false, error: 'Product not found. Please check the barcode and try again later.' } as ApiResponse,
        { status: 404 }
      );
    }

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
      // Keepa format bilgisi -> pricingEngine kategori filtresi icin
      binding: bestProduct.binding || '',
      type: bestProduct.type || ''
    };

    const pricingResult = calculateOurPrice(product);

    const message = pricingResult.accepted && pricingResult.ourPrice
      ? 'ACCEPTED'
      : 'DOES NOT MEET OUR PURCHASING CRITERIA';

    const totalTime = Date.now() - totalStartTime;

    const debugInfo = {
      searchMethod: 'keepa-single-product',
      lookupType: codeInfo.needsCodeLookup ? 'code' : 'asin',
      cacheHit: false,
      priceAnalysis,
      timings: { totalTime }
    };

        // Cache yazmasi kullaniciyi bekletmemeli - arka planda gonderilir.
    // Yazma basarisiz olsa bile cevap dogru, sadece bir sonraki sorgu tekrar Keepa'ya gider.
    const cacheWriteStart = Date.now();
    productCache
      .saveToCache(cleanCode, codeInfo.type, product, pricingResult, message, debugInfo)
      .then(() => console.log(`⏱️ cacheWrite=${Date.now() - cacheWriteStart}ms (arka plan)`))
      .catch(err => console.error('Cache save error:', err));

    const speedLabel = totalTime < 1000 ? 'ULTRA FAST' : totalTime < 2000 ? 'FAST' : 'NORMAL';
    console.log(`[${speedLabel}] ${totalTime}ms - Keepa lookup (${debugInfo.lookupType})`);
    console.log(`💰 Price: $${priceAnalysis.price} (${priceAnalysis.bestCondition}) | Rank: ${salesRank} | Category: ${category} | Binding: ${product.binding} | Type: ${product.type}`);

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