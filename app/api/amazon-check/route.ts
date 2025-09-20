// /app/api/amazon-check/route.ts
// Oxylabs Amazon API - OPTIMIZED & CLEAN
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { productCache } from '@/lib/productCache';

// Fiyat hesaplama motorunu içe aktarmaya çalışın
let calculateOurPrice: ((product: AmazonProduct) => PricingResult) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pricingEngine = require('@/lib/pricingEngine');
  calculateOurPrice = pricingEngine.calculateOurPrice;
} catch (e) {
  console.error('Failed to import pricingEngine:', e);
}

// TypeScript tip tanımlamaları - Sadece kullanılan alanlar
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

interface PricingOffer {
  price: number;
  seller: string;
  condition: string;
}

interface PricingContent {
  title: string;
  pricing: PricingOffer[];
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

interface ProductDetailResult {
  title?: string;
  images?: string[];
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
  hasNewPrice: boolean; // Yeni eklenen: new fiyatı olup olmadığını belirtir
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
      pricingAnalysis?: PriceAnalysisResult;
      callSequence?: string[];
      timings?: {
        searchTime?: number;
        parallelTime?: number;
        totalTime?: number;
      };
    };
  };
  error?: string;
}

// Global kategori listesi
const MAIN_CATEGORIES = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD'];

/**
 * ISBN/UPC kod tipini algıla
 */
function detectCodeType(code: string): 'isbn' | 'upc' | 'asin' | 'unknown' {
  const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '');

  if (cleanCode.length === 10 && /^B[A-Z0-9]{9}$/.test(cleanCode)) {
    return 'asin';
  }

  if (cleanCode.length === 10 && /^\d{9}[\dX]$/.test(cleanCode)) {
    return 'isbn';
  }

  if (cleanCode.length === 13 && /^97[89]\d{10}$/.test(cleanCode)) {
    return 'isbn';
  }

  if (cleanCode.length === 12 && /^\d{12}$/.test(cleanCode)) {
    return 'upc';
  }

  if (cleanCode.length === 8 && /^\d{8}$/.test(cleanCode)) {
    return 'upc';
  }

  return 'unknown';
}

/**
 * Fiyat analizi - EN DÜŞÜK NEW, sonra EN DÜŞÜK USED
 */
function analyzePricingOffers(pricingData: PricingContent): PriceAnalysisResult {
  // 🔍 DEBUG EKLEME - BAŞLANGICI
  console.log('🔍 Pricing Analysis Debug:');
  console.log('Raw pricing data:', pricingData?.pricing);

  if (pricingData?.pricing && Array.isArray(pricingData.pricing)) {
    console.log('Total offers:', pricingData.pricing.length);
    pricingData.pricing.forEach((offer, i) => {
      console.log(`Offer ${i}: price=${offer.price}, condition="${offer.condition}", seller="${offer.seller}"`);
    });
  }
  // 🔍 DEBUG EKLEME - BİTİŞİ
  if (!pricingData?.pricing || !Array.isArray(pricingData.pricing)) {
    return {
      bestPrice: 0,
      bestCondition: 'unknown',
      analysisDetails: 'Price data not found',
      hasNewPrice: false
    };
  }
  const offers = pricingData.pricing;
  const newOffers: PricingOffer[] = [];
  const usedOffers: PricingOffer[] = [];
  offers.forEach(offer => {
    if (!offer.price || offer.price <= 0) return;

    const condition = (offer.condition || '').toLowerCase();

    // Accept "Like New" status as "Used"
    if (condition.includes('new') && !condition.includes('like') || condition === '' || condition.includes('neu')) {
      newOffers.push(offer);
    } else if (condition.includes('used') || condition.includes('gebraucht') ||
      condition.includes('very good') || condition.includes('good') ||
      condition.includes('acceptable') || condition.includes('like new')) {
      usedOffers.push(offer);
    }
  });
  newOffers.sort((a, b) => a.price - b.price);
  usedOffers.sort((a, b) => a.price - b.price);
  let bestPrice = 0;
  let bestCondition = 'unknown';
  let analysisDetails = '';
  const hasNewPrice = newOffers.length > 0; // Yeni eklenen: new fiyatı olup olmadığını kontrol et

  if (hasNewPrice) {
    bestPrice = newOffers[0].price;
    bestCondition = 'new';
    analysisDetails = `Lowest NEW: $${bestPrice} (${newOffers[0].seller})`;
  } else if (usedOffers.length > 0) {
    bestPrice = usedOffers[0].price;
    bestCondition = 'used';
    analysisDetails = `Lowest USED: $${bestPrice} (${usedOffers[0].seller})`;
  } else {
    analysisDetails = 'No valid offers found';
  }
  // 🔍 FINAL PRICE DEBUG EKLE - BAŞLANGICI
  console.log('🎯 Final Pricing Decision:');
  console.log(`NEW offers: ${newOffers.length}`);
  console.log(`USED offers: ${usedOffers.length}`);
  console.log(`Selected: ${bestCondition} - $${bestPrice}`);
  console.log(`Analysis: ${analysisDetails}`);
  console.log(`Has New Price: ${hasNewPrice}`);
  // 🔍 FINAL PRICE DEBUG EKLE - BİTİŞİ
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

    // İlk geçerli rank'i al
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
 * PARALLEL API EXECUTION - HER ZAMAN PRİCİNG + PRODUCT
 */
async function executeParallelAnalysis(asin: string, username: string, password: string) {
  const startTime = Date.now();

  const apiConfig = {
    auth: { username, password },
    headers: { 'Content-Type': 'application/json' },
    timeout: 6000  // 6 saniyeden 4 saniyeye düşürüldü
  };

  // HER ZAMAN İKİ API CALL - PRİCİNG + PRODUCT
  const pricingRequest = {
    source: 'amazon_pricing',
    query: asin,
    geo_location: '10001',
    domain: 'com',
    parse: true
  };

  const productRequest = {
    source: 'amazon_product',
    query: asin,
    geo_location: '10001',
    domain: 'com',
    parse: true
  };

  // Promise.allSettled yerine Promise.all kullanıldı
  const [pricingResponse, productResponse] = await Promise.all([
    axios.post<OxylabsResponse<PricingContent>>(
      'https://realtime.oxylabs.io/v1/queries',
      pricingRequest,
      apiConfig
    ).catch(error => {
      console.error('Pricing API error:', error.message);
      return null;
    }),
    axios.post<OxylabsResponse<ProductDetailResult>>(
      'https://realtime.oxylabs.io/v1/queries',
      productRequest,
      apiConfig
    ).catch(error => {
      console.error('Product API error:', error.message);
      return null;
    })
  ]);

  const parallelTime = Date.now() - startTime;

  const pricingContent = pricingResponse?.data?.results?.[0]?.content || null;
  const productContent = productResponse?.data?.results?.[0]?.content || null;

  // HER ZAMAN 2 CALL (PRİCİNG + PRODUCT)
  const apiCallCount = 2;
  const callSequence = ['pricing', 'product'];

  return {
    pricingContent,
    productContent,
    apiCallCount,
    callSequence,
    timings: { parallelTime }
  };
}

/**
 * POST /api/amazon-check - CLEAN & OPTIMIZED
 */
export async function POST(request: NextRequest) {
  const totalStartTime = Date.now();
  let apiCallCount = 0;
  const callSequence: string[] = [];
  let searchTime = 0;
  let parallelTime = 0;
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
    const codeType = detectCodeType(cleanCode);

    if (codeType === 'unknown') {
      return NextResponse.json({
        success: false,
        error: 'invalid ISBN/UPC format'
      } as ApiResponse, { status: 400 });
    }

    console.log(`\nOXYLABS OPTIMIZED: ${cleanCode} (${codeType})`);

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

    // ASIN BUL
    if (codeType === 'asin') {
      asin = cleanCode;
      console.log('ASIN available, skipping search');
    } else {
      const searchStart = Date.now();
      console.log(`Searching ASIN with ${codeType.toUpperCase()}...`);
      apiCallCount++;
      callSequence.push('search');

      const searchRequest = {
        source: 'amazon_search',
        query: cleanCode,
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
        console.log(`Product not found: ${cleanCode}`);
        return NextResponse.json({
          success: false,
          error: 'Please try again later.'
        } as ApiResponse, { status: 404 });
      }

      asin = firstProduct.asin;
      console.log(`ASIN found: ${asin} (${searchTime}ms)`);
    }
    // PARALLEL EXECUTION
    const parallelResult = await executeParallelAnalysis(asin, username, password);

    apiCallCount += parallelResult.apiCallCount;
    callSequence.push(...parallelResult.callSequence);
    parallelTime = parallelResult.timings.parallelTime;

    if (!parallelResult.pricingContent) {
      console.log(`Pricing data could not be retrieved: ${asin}`);
      hasApiError = true;
      return NextResponse.json({
        success: false,
        error: 'Please try again later.'
      } as ApiResponse, { status: 404 });
    }

    // PROCESS DATA
    const pricingAnalysis = analyzePricingOffers(parallelResult.pricingContent);
    const salesRank = parallelResult.productContent ? extractSalesRank(parallelResult.productContent) : 0;
    const category = parallelResult.productContent ? extractCategory(parallelResult.productContent) : 'Unknown';

    const title = parallelResult.productContent?.title || parallelResult.pricingContent?.title || 'Title not found';
    const image = parallelResult.productContent?.images?.[0] || '';

    // If there is no new price and there is a used price, set price to 0
    // In this case, the pricing engine will decide based on rank
    const productPrice = pricingAnalysis.hasNewPrice ? pricingAnalysis.bestPrice : 0;

    const product: AmazonProduct = {
      title,
      image,
      price: productPrice,
      sales_rank: salesRank,
      category,
      asin
    };

    // Check if calculateOurPrice is available
    if (!calculateOurPrice) {
      return NextResponse.json({
        success: false,
        error: 'Pricing engine not available'
      } as ApiResponse, { status: 500 });
    }

    const pricingResult = calculateOurPrice(product);

    let message = '';
    if (pricingResult.accepted && pricingResult.ourPrice) {
      message = `Accepted`;
    } else {
      message = `${pricingResult.reason}`;
    }

    const totalTime = Date.now() - totalStartTime;

    const debugInfo = {
      searchMethod: 'oxylabs-optimized',
      apiCalls: apiCallCount,
      hasRank: salesRank > 0,
      cacheHit: false,
      pricingAnalysis,
      callSequence,
      timings: {
        ...(searchTime > 0 && { searchTime }),
        parallelTime,
        totalTime
      }
    };

    // Save to cache only if there is no API error
    if (!hasApiError) {
      await productCache.saveToCache(
        cleanCode,
        codeType,
        product,
        pricingResult,
        message,
        debugInfo
      );
    }

    const speedLabel = totalTime < 3000 ? 'SUPER FAST' : totalTime < 5000 ? 'FAST' : 'NORMAL';
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

  } catch (error: unknown) {
    const totalTime = Date.now() - totalStartTime;
    console.error(`ERROR [${totalTime}ms]: ${error}`);

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json({
          success: false,
          error: 'Please try again later.'
        } as ApiResponse, { status: 408 });
      }
    }

    // Handle axios errors
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      
      if (axiosError.response?.status === 401) {
        return NextResponse.json({
          success: false,
          error: 'Please try again later.'
        } as ApiResponse, { status: 500 });
      }

      if (axiosError.response?.status === 429) {
        return NextResponse.json({
          success: false,
          error: 'Please try again later.'
        } as ApiResponse, { status: 429 });
      }
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
    message: 'Amazon API - Optimized Version',
    configured: hasConfig,
    timestamp: new Date().toISOString()
  });
}