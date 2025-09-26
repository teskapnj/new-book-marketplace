// /app/api/amazon-check/route.ts
// Oxylabs Amazon API - SINGLE PRODUCT CALL OPTIMIZED
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { productCache } from '@/lib/productCache';

// Fiyat hesaplama motorunu içe aktarmaya çalışın
let calculateOurPrice: any;
try {
  const pricingEngine = require('@/lib/pricingEngine');
  calculateOurPrice = pricingEngine.calculateOurPrice;
} catch (e) {
  console.error('Failed to import pricingEngine:', e);
}

// TypeScript tip tanımlamaları - Basitleştirilmiş
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

interface SearchResult {
  asin?: string;
  title?: string;
}

interface SearchContent {
  results?: {
    organic?: SearchResult[];
    paid?: SearchResult[];
  };
}

// Buybox bilgileri
interface BuyboxInfo {
  price: number;
  stock?: string;
  condition?: string;
}

interface ProductDetailResult {
  title?: string;
  images?: string[];
  price?: number;
  price_buybox?: number;
  buybox?: BuyboxInfo[];
  sales_rank?: Array<{
    rank: number;
    ladder: Array<{
      name: string;
    }>;
  }>;
  best_sellers_rank?: string;
  category?: Array<{
    ladder: Array<{
      name: string;
    }>;
  }>;
}

interface OxylabsResponse<T> {
  results: Array<{
    content: T;
  }>;
}

interface PriceAnalysisResult {
  bestPrice: number;
  bestCondition: string;
  analysisDetails: string;
  hasNewPrice: boolean;
}

interface ApiResponse {
  success: boolean;
  data?: {
    product: AmazonProduct;
    pricing: PricingResult;
    message: string;
    debug?: {
      searchMethod: string;
      apiCalls: number;
      hasRank: boolean;
      cacheHit?: boolean;
      priceAnalysis?: PriceAnalysisResult;
      callSequence?: string[];
      timings?: {
        searchTime?: number;
        productTime?: number;
        totalTime?: number;
      };
    };
  };
  error?: string;
}

// Global kategori listesi (Video Games geri eklendi)
const MAIN_CATEGORIES = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD'];

/**
 * ISBN-13'ü ISBN-10'a dönüştür
 */
function convertISBN13toISBN10(isbn13: string): string | null {
  const clean = isbn13.replace(/[^0-9]/g, '');
  
  if (clean.length !== 13 || !clean.startsWith('978')) {
    return null;
  }
  
  const isbn10Base = clean.substring(3, 12);
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn10Base[i]) * (10 - i);
  }
  
  const checkDigit = (11 - (sum % 11)) % 11;
  const checkChar = checkDigit === 10 ? 'X' : checkDigit.toString();
  
  return isbn10Base + checkChar;
}

/**
 * ISBN/UPC kod tipini algıla ve ISBN-13'ü dönüştür
 */
function detectCodeType(code: string): { type: 'isbn' | 'upc' | 'asin' | 'unknown', searchCode: string, converted?: boolean, needsSearch?: boolean } {
  const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '');

  if (cleanCode.length === 10 && /^B[A-Z0-9]{9}$/.test(cleanCode)) {
    return { type: 'asin', searchCode: cleanCode };
  }

  if (cleanCode.length === 10 && /^\d{9}[\dX]$/.test(cleanCode)) {
    return { type: 'isbn', searchCode: cleanCode };
  }

  if (cleanCode.length === 13 && /^97[89]\d{10}$/.test(cleanCode)) {
    if (cleanCode.startsWith('978')) {
      // 978 prefix'li ISBN-13'ü ISBN-10'a dönüştür
      const isbn10 = convertISBN13toISBN10(cleanCode);
      if (isbn10) {
        console.log(`ISBN-13 converted: ${cleanCode} → ${isbn10}`);
        return { type: 'isbn', searchCode: isbn10, converted: true };
      }
    }
    // 979 prefix'li veya dönüştürülemeyen ISBN-13'ler için search gerekli
    console.log(`ISBN-13 requires search: ${cleanCode} (979 prefix or conversion failed)`);
    return { type: 'isbn', searchCode: cleanCode, needsSearch: true };
  }

  if (cleanCode.length === 12 && /^\d{12}$/.test(cleanCode)) {
    return { type: 'upc', searchCode: cleanCode };
  }

  if (cleanCode.length === 8 && /^\d{8}$/.test(cleanCode)) {
    return { type: 'upc', searchCode: cleanCode };
  }

  return { type: 'unknown', searchCode: cleanCode };
}

/**
 * Buybox ve price field'larından en iyi fiyatı çıkar
 * Öncelik: NEW fiyat → USED fiyat → 0
 */
function extractBestPrice(productData: ProductDetailResult): PriceAnalysisResult {
  console.log('Price Analysis Debug:');
  console.log('price:', productData.price);
  console.log('price_buybox:', productData.price_buybox);
  console.log('buybox array:', productData.buybox);

  let bestPrice = 0;
  let bestCondition = 'unknown';
  let analysisDetails = '';
  let hasNewPrice = false;

  // 1. Önce buybox array'ini kontrol et - en güvenilir
  if (productData.buybox && Array.isArray(productData.buybox) && productData.buybox.length > 0) {
    const buybox = productData.buybox[0]; // İlk buybox'ı al
    if (buybox.price && buybox.price > 0) {
      bestPrice = buybox.price;
      
      // Buybox condition'ını kontrol et
      if (buybox.condition) {
        const conditionLower = buybox.condition.toLowerCase().trim();
        if (conditionLower.includes('new') || conditionLower.includes('buy new')) {
          bestCondition = 'new';
          hasNewPrice = true;
        } else if (conditionLower.includes('used') || conditionLower.includes('like new') || 
                   conditionLower.includes('very good') || conditionLower.includes('good') || 
                   conditionLower.includes('acceptable') || conditionLower.includes('save with used')) {
          bestCondition = 'used';
          hasNewPrice = false;
        } else {
          // Belirsiz condition, ama buybox genellikle new olur
          bestCondition = 'new';
          hasNewPrice = true;
        }
        analysisDetails = `Buybox: $${bestPrice} (${buybox.condition})`;
      } else {
        // Condition belirtilmemiş, varsayılan new
        bestCondition = 'new';
        hasNewPrice = true;
        analysisDetails = `Buybox: $${bestPrice} (condition not specified, assumed new)`;
      }
      
      console.log('Using buybox array price:', analysisDetails);
      return { bestPrice, bestCondition, analysisDetails, hasNewPrice };
    }
  }

  // 2. price_buybox field'ını kontrol et
  if (productData.price_buybox && productData.price_buybox > 0) {
    bestPrice = productData.price_buybox;
    bestCondition = 'new'; // price_buybox genellikle new condition
    hasNewPrice = true;
    analysisDetails = `price_buybox: $${bestPrice} (assumed new)`;
    console.log('Using price_buybox field:', analysisDetails);
    return { bestPrice, bestCondition, analysisDetails, hasNewPrice };
  }

  // 3. Ana price field'ını kontrol et
  if (productData.price && productData.price > 0) {
    bestPrice = productData.price;
    bestCondition = 'new'; // Ana fiyat genellikle new
    hasNewPrice = true;
    analysisDetails = `main price: $${bestPrice} (assumed new)`;
    console.log('Using main price field:', analysisDetails);
    return { bestPrice, bestCondition, analysisDetails, hasNewPrice };
  }

  // Hiç fiyat bulunamadı
  analysisDetails = 'No valid price found';
  console.log('No price found in any field');
  
  return { bestPrice, bestCondition, analysisDetails, hasNewPrice };
}

/**
 * Sales rank çıkarma
 */
function extractSalesRank(productData: ProductDetailResult): number {
  if (productData.sales_rank && Array.isArray(productData.sales_rank)) {
    for (const rankItem of productData.sales_rank) {
      if (rankItem.rank && rankItem.rank > 0) {
        if (rankItem.ladder && rankItem.ladder[0]) {
          const categoryName = rankItem.ladder[0].name || '';
          if (MAIN_CATEGORIES.some(cat => categoryName.includes(cat))) {
            return rankItem.rank;
          }
        }
      }
    }

    if (productData.sales_rank[0]?.rank > 0) {
      return productData.sales_rank[0].rank;
    }
  }

  if (productData.best_sellers_rank) {
    const match = productData.best_sellers_rank.match(/#?([\d,]+)/);
    if (match) {
      const rank = parseInt(match[1].replace(/,/g, ''));
      return isNaN(rank) ? 0 : rank;
    }
  }

  return 0;
}

/**
 * Kategori çıkarma
 */
function extractCategory(data: ProductDetailResult): string {
  if (data.sales_rank && Array.isArray(data.sales_rank)) {
    for (const rankItem of data.sales_rank) {
      if (rankItem.ladder && rankItem.ladder[0]) {
        const categoryName = rankItem.ladder[0].name;
        if (MAIN_CATEGORIES.some(cat => categoryName.includes(cat))) {
          return categoryName;
        }
      }
    }
  }

  if (data.category && data.category[0]?.ladder && data.category[0].ladder[0]) {
    return data.category[0].ladder[0].name;
  }

  return 'Unknown';
}

/**
 * SINGLE PRODUCT API CALL - No Retry
 */
async function executeProductAnalysis(asin: string, username: string, password: string) {
  const startTime = Date.now();

  const apiConfig = {
    auth: { username, password },
    headers: { 'Content-Type': 'application/json' },
    timeout: 5500
  };

  const productRequest = {
    source: 'amazon_product',
    query: asin,
    geo_location: '10001',
    domain: 'com',
    parse: true,
    context: [
      {
        key: 'autoselect_variant',
        value: true
      }
    ]
  };

  try {
    const productResponse = await axios.post<OxylabsResponse<ProductDetailResult>>(
      'https://realtime.oxylabs.io/v1/queries',
      productRequest,
      apiConfig
    );

    const productTime = Date.now() - startTime;
    const productContent = productResponse.data.results?.[0]?.content || null;

    return {
      productContent,
      apiCallCount: 1,
      callSequence: ['product'],
      timings: { productTime }
    };
  } catch (error) {
    console.error('Product API error:', error);
    return {
      productContent: null,
      apiCallCount: 1,
      callSequence: ['product'],
      timings: { productTime: Date.now() - startTime }
    };
  }
}

/**
 * POST /api/amazon-check - SINGLE PRODUCT OPTIMIZED
 */
export async function POST(request: NextRequest) {
  const totalStartTime = Date.now();
  let apiCallCount = 0;
  const callSequence: string[] = [];
  let searchTime = 0;
  let productTime = 0;
  let hasApiError = false;

  try {
    const body = await request.json();
    const { isbn_upc } = body;

    if (!isbn_upc || typeof isbn_upc !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'only valid ISBN or UPC code or ASIN'
      } as ApiResponse, { status: 400 });
    }

    const cleanCode = isbn_upc.replace(/[^a-zA-Z0-9X]/gi, '').trim().toUpperCase();
    const codeInfo = detectCodeType(cleanCode);

    if (codeInfo.type === 'unknown') {
      return NextResponse.json({
        success: false,
        error: 'invalid ISBN/UPC format'
      } as ApiResponse, { status: 400 });
    }

    console.log(`\nOXYLABS SINGLE PRODUCT: ${cleanCode} (${codeInfo.type})`);

    // Cache kontrolü
    const cachedResult = await productCache.getFromCache(cleanCode);

    if (cachedResult) {
      console.log(`Cache hit: ${cleanCode}`);
      return NextResponse.json({
        success: true,
        data: {
          product: cachedResult.product,
          pricing: cachedResult.pricing,
          message: cachedResult.message + ' (Cache)',
          debug: {
            ...cachedResult.debug,
            cacheHit: true
          }
        }
      } as ApiResponse);
    }

    const username = process.env.OXYLABS_USERNAME;
    const password = process.env.OXYLABS_PASSWORD;

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Please try again later.'
      } as ApiResponse, { status: 500 });
    }

    let asin = '';

    // ASIN BUL - ISBN için direkt ASIN kullan (978 prefix'li), diğerleri için search
    if (codeInfo.type === 'asin') {
      asin = codeInfo.searchCode;
      console.log('ASIN available, skipping search');
    } else if (codeInfo.type === 'isbn' && !codeInfo.needsSearch) {
      // Sadece 978 prefix'li ve başarıyla dönüştürülen ISBN'ler direkt ASIN olarak kullanılır
      asin = codeInfo.searchCode;
      const note = codeInfo.converted ? ' (converted from ISBN-13)' : ' (ISBN-10)';
      console.log(`Using ISBN as ASIN: ${asin}${note} (search bypassed)`);
    } else {
      // UPC ve 979 prefix'li ISBN'ler için search yap
      const searchStart = Date.now();
      console.log(`Searching ASIN with ${codeInfo.type.toUpperCase()}...`);
      apiCallCount++;
      callSequence.push('search');

      const searchRequest = {
        source: 'amazon_search',
        query: codeInfo.searchCode,
        geo_location: '10001',
        domain: 'com',
        parse: true
      };

      const searchResponse = await axios.post<OxylabsResponse<SearchContent>>(
        'https://realtime.oxylabs.io/v1/queries',
        searchRequest,
        {
          auth: { username, password },
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );

      searchTime = Date.now() - searchStart;

      const searchContent = searchResponse.data.results?.[0]?.content;
      const firstProduct = searchContent?.results?.organic?.[0] || searchContent?.results?.paid?.[0];

      if (!firstProduct?.asin) {
        console.log(`Product not found: ${codeInfo.searchCode}`);
        return NextResponse.json({
          success: false,
          error: 'Product not found. Please check the barcode and try again later.'
        } as ApiResponse, { status: 404 });
      }

      asin = firstProduct.asin;
      console.log(`ASIN found: ${asin} (${searchTime}ms)`);
    }

    // SINGLE PRODUCT API CALL
    const productResult = await executeProductAnalysis(asin, username, password);

    apiCallCount += productResult.apiCallCount;
    callSequence.push(...productResult.callSequence);
    productTime = productResult.timings.productTime;

    if (!productResult.productContent) {
      hasApiError = true;
      console.log('Product API call failed');
      
      return NextResponse.json({
        success: false,
        error: 'Unable to verify product details. Please try scanning again later.'
      } as ApiResponse, { status: 500 });
    }

    // PROCESS DATA
    const priceAnalysis = extractBestPrice(productResult.productContent);
    const salesRank = extractSalesRank(productResult.productContent);
    const category = extractCategory(productResult.productContent);

    const title = productResult.productContent.title || 'Title not found';
    const image = productResult.productContent.images?.[0] || '';

    // Basit mantık: En iyi fiyatı gönder (NEW varsa NEW, yoksa USED, hiçbiri yoksa 0)
    const productPrice = priceAnalysis.bestPrice;

    const product: AmazonProduct = {
      title,
      image,
      price: productPrice,
      sales_rank: salesRank,
      category,
      asin
    };

    const pricingResult = calculateOurPrice(product);

    let message = '';
    if (pricingResult.accepted && pricingResult.ourPrice) {
      message = `Accepted`;
    } else {
      message = `${pricingResult.reason}`;
    }

    const totalTime = Date.now() - totalStartTime;

    const debugInfo = {
      searchMethod: 'oxylabs-single-product',
      apiCalls: apiCallCount,
      hasRank: salesRank > 0,
      cacheHit: false,
      priceAnalysis,
      callSequence,
      timings: {
        ...(searchTime > 0 && { searchTime }),
        productTime,
        totalTime
      }
    };

    // Save to cache only if there is no API error
    if (!hasApiError) {
      await productCache.saveToCache(
        cleanCode,
        codeInfo.type,
        product,
        pricingResult,
        message,
        debugInfo
      );
    }

    const speedLabel = totalTime < 2000 ? 'ULTRA FAST' : totalTime < 3000 ? 'SUPER FAST' : totalTime < 5000 ? 'FAST' : 'NORMAL';
    console.log(`[${speedLabel}] ${totalTime}ms, ${apiCallCount} calls: ${callSequence.join(' + ')}`);

    return NextResponse.json({
      success: true,
      data: {
        product,
        pricing: pricingResult,
        message,
        debug: debugInfo
      }
    } as ApiResponse);

  } catch (error: any) {
    const totalTime = Date.now() - totalStartTime;
    console.error(`ERROR [${totalTime}ms]: ${error.toString()}`);

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return NextResponse.json({
        success: false,
        error: 'Please try again later.'
      } as ApiResponse, { status: 408 });
    }

    if (error.response?.status === 401) {
      return NextResponse.json({
        success: false,
        error: 'Please try again later.'
      } as ApiResponse, { status: 500 });
    }

    if (error.response?.status === 429) {
      return NextResponse.json({
        success: false,
        error: 'Please try again later.'
      } as ApiResponse, { status: 429 });
    }

    return NextResponse.json({
      success: false,
      error: 'Please try again later.'
    } as ApiResponse, { status: 500 });
  }
}

export async function GET() {
  const hasConfig = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);

  return NextResponse.json({
    success: true,
    message: 'Amazon API - Single Product Optimized Version (Books, CDs, DVDs, Games, Music)',
    configured: hasConfig,
    timestamp: new Date().toISOString()
  });
}