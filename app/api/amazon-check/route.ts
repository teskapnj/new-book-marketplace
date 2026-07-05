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
      stats: 1 // son 1 gün istatistik (current fiyat/rank için yeterli)
    },
    timeout: 5500
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
      stats: 180
    },
    timeout: 5500
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
  const rankFromStats = product?.stats?.current?.[3];
  if (typeof rankFromStats === 'number' && rankFromStats > 0) {
    return rankFromStats;
  }

  // Fallback: salesRanks objesinden en güncel değeri al
  if (product?.salesRanks) {
    const rankArrays = Object.values(product.salesRanks) as number[][];
    for (const arr of rankArrays) {
      if (Array.isArray(arr) && arr.length >= 2) {
        const lastRank = arr[arr.length - 1];
        if (typeof lastRank === 'number' && lastRank > 0) return lastRank;
      }
    }
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
function pickBestKeepaProduct(products: any[]): any | null {
  if (!products || products.length === 0) return null;

  for (const p of products) {
    const pricing = extractKeepaPricing(p);
    if (pricing.price > 0) return p;
  }

  // Hiçbirinde fiyat yoksa yine de ilkini döndür (title/image gösterebilmek için)
  return products[0];
}

// ==================== POST /api/amazon-check ====================

export async function POST(request: NextRequest) {
  const totalStartTime = Date.now();

  try {
    const body = await request.json();
    const { isbn_upc } = body;

    if (!isbn_upc || typeof isbn_upc !== 'string') {
      return NextResponse.json(
        { success: false, error: 'only valid ISBN or UPC code or ASIN' } as ApiResponse,
        { status: 400 }
      );
    }

    const cleanCode = isbn_upc.replace(/[^a-zA-Z0-9X]/gi, '').trim().toUpperCase();
    const codeInfo = detectCodeType(cleanCode);

    if (codeInfo.type === 'unknown') {
      return NextResponse.json(
        { success: false, error: 'invalid ISBN/UPC format' } as ApiResponse,
        { status: 400 }
      );
    }

    console.log(`\nKEEPA LOOKUP: ${cleanCode} (${codeInfo.type})`);

    // ---- Cache kontrolü (değişmedi) ----
    const cachedResult = await productCache.getFromCache(cleanCode);
    if (cachedResult) {
      console.log(`Cache hit: ${cleanCode}`);
      return NextResponse.json({
        success: true,
        data: {
          product: cachedResult.product,
          pricing: cachedResult.pricing,
          message: cachedResult.message + ' (Cache)',
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
    console.log(`🎫 Tokens: consumed=${keepaResponse?.tokensConsumed}, left=${keepaResponse?.tokensLeft}`);

    const products = keepaResponse?.products;
    const bestProduct = pickBestKeepaProduct(products);

    if (!bestProduct) {
      console.log(`Product not found: ${cleanCode}`);
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
      asin
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

    await productCache.saveToCache(cleanCode, codeInfo.type, product, pricingResult, message, debugInfo);

    const speedLabel = totalTime < 1000 ? 'ULTRA FAST' : totalTime < 2000 ? 'FAST' : 'NORMAL';
    console.log(`[${speedLabel}] ${totalTime}ms - Keepa lookup (${debugInfo.lookupType})`);
    console.log(`💰 Price: $${priceAnalysis.price} (${priceAnalysis.bestCondition}) | Rank: ${salesRank} | Category: ${category}`);

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