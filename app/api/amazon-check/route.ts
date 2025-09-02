// /app/api/amazon-check/route.ts
// Oxylabs Amazon API - OPTIMIZED & CLEAN
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
  if (!pricingData?.pricing || !Array.isArray(pricingData.pricing)) {
    return {
      bestPrice: 0,
      bestCondition: 'unknown',
      analysisDetails: 'Fiyat verileri bulunamadı'
    };
  }

  const offers = pricingData.pricing;
  const newOffers: PricingOffer[] = [];
  const usedOffers: PricingOffer[] = [];

  offers.forEach(offer => {
    if (!offer.price || offer.price <= 0) return;
    
    const condition = (offer.condition || '').toLowerCase();
    
    if (condition.includes('new') || condition === '' || condition.includes('neu')) {
      newOffers.push(offer);
    } else if (condition.includes('used') || condition.includes('gebraucht') || 
               condition.includes('very good') || condition.includes('good') ||
               condition.includes('acceptable')) {
      usedOffers.push(offer);
    }
  });

  newOffers.sort((a, b) => a.price - b.price);
  usedOffers.sort((a, b) => a.price - b.price);

  let bestPrice = 0;
  let bestCondition = 'unknown';
  let analysisDetails = '';

  if (newOffers.length > 0) {
    bestPrice = newOffers[0].price;
    bestCondition = 'new';
    analysisDetails = `En düşük NEW: $${bestPrice} (${newOffers[0].seller})`;
  } else if (usedOffers.length > 0) {
    bestPrice = usedOffers[0].price;
    bestCondition = 'used';
    analysisDetails = `En düşük USED: $${bestPrice} (${usedOffers[0].seller})`;
  } else {
    analysisDetails = 'Hiç geçerli teklif bulunamadı';
  }

  return { bestPrice, bestCondition, analysisDetails };
}

/**
 * Sales rank çıkarma
 */
function extractSalesRank(productData: ProductDetailResult): number {
  if (productData.sales_rank && Array.isArray(productData.sales_rank)) {
    const mainCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD'];
    
    for (const rankItem of productData.sales_rank) {
      if (rankItem.rank && rankItem.rank > 0) {
        if (rankItem.ladder && rankItem.ladder[0]) {
          const categoryName = rankItem.ladder[0].name || '';
          if (mainCategories.some(cat => categoryName.includes(cat))) {
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
  const mainCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD'];
  
  if (data.sales_rank && Array.isArray(data.sales_rank)) {
    for (const rankItem of data.sales_rank) {
      if (rankItem.ladder && rankItem.ladder[0]) {
        const categoryName = rankItem.ladder[0].name;
        if (mainCategories.some(cat => categoryName.includes(cat))) {
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
 * PARALLEL API EXECUTION - Sadece gerekli alanlar
 */
async function executeParallelAnalysis(asin: string, username: string, password: string) {
  const startTime = Date.now();
  
  const apiConfig = {
    auth: { username, password },
    headers: { 'Content-Type': 'application/json' },
    timeout: 6000 // Daha agresif timeout
  };
  
  const pricingRequest = {
    source: 'amazon_pricing',
    query: asin,
    geo_location: '90210',
    domain: 'com',
    parse: true
  };
  
  const productRequest = {
    source: 'amazon_product',
    query: asin,
    geo_location: '90210',
    domain: 'com',
    parse: true
  };
  
  const [pricingResult, productResult] = await Promise.allSettled([
    axios.post<OxylabsResponse<PricingContent>>(
      'https://realtime.oxylabs.io/v1/queries',
      pricingRequest,
      apiConfig
    ),
    axios.post<OxylabsResponse<ProductDetailResult>>(
      'https://realtime.oxylabs.io/v1/queries',
      productRequest,
      apiConfig
    )
  ]);
  
  const parallelTime = Date.now() - startTime;
  
  const pricingContent = pricingResult.status === 'fulfilled' 
    ? pricingResult.value.data.results?.[0]?.content || null
    : null;
    
  const productContent = productResult.status === 'fulfilled'
    ? productResult.value.data.results?.[0]?.content || null
    : null;
  
  let apiCallCount = 0;
  const callSequence: string[] = [];
  
  if (pricingContent) {
    apiCallCount++;
    callSequence.push('pricing');
  }
  
  if (productContent) {
    apiCallCount++;
    callSequence.push('product');
  }
  
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
  
  try {
    const body = await request.json();
    const { isbn_upc } = body;
    
    if (!isbn_upc || typeof isbn_upc !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'ISBN veya UPC kodu gerekli'
      } as ApiResponse, { status: 400 });
    }
    
    const cleanCode = isbn_upc.replace(/[^a-zA-Z0-9X]/gi, '').trim().toUpperCase();
    const codeType = detectCodeType(cleanCode);
    
    if (codeType === 'unknown') {
      return NextResponse.json({
        success: false,
        error: 'Geçersiz ISBN/UPC formatı'
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
        error: 'Oxylabs API yapılandırması eksik'
      } as ApiResponse, { status: 500 });
    }
    
    let asin = '';
    
    // ASIN BUL
    if (codeType === 'asin') {
      asin = cleanCode;
      console.log('ASIN mevcut, arama atlanıyor');
    } else {
      const searchStart = Date.now();
      console.log(`${codeType.toUpperCase()} ile ASIN arama...`);
      apiCallCount++;
      callSequence.push('search');
      
      const searchRequest = {
        source: 'amazon_search',
        query: cleanCode,
        geo_location: '90210',
        domain: 'com',
        parse: true
      };
      
      const searchResponse = await axios.post<OxylabsResponse<SearchContent>>(
        'https://realtime.oxylabs.io/v1/queries',
        searchRequest,
        {
          auth: { username, password },
          headers: { 'Content-Type': 'application/json' },
          timeout: 6000
        }
      );
      
      searchTime = Date.now() - searchStart;
      
      const searchContent = searchResponse.data.results?.[0]?.content;
      const firstProduct = searchContent?.results?.organic?.[0] || searchContent?.results?.paid?.[0];
      
      if (!firstProduct?.asin) {
        console.log(`Ürün bulunamadı: ${cleanCode}`);
        return NextResponse.json({
          success: false,
          error: `Bu ${codeType.toUpperCase()} için ürün bulunamadı`
        } as ApiResponse, { status: 404 });
      }
      
      asin = firstProduct.asin;
      console.log(`ASIN bulundu: ${asin} (${searchTime}ms)`);
    }

    // PARALLEL EXECUTION
    const parallelResult = await executeParallelAnalysis(asin, username, password);
    
    apiCallCount += parallelResult.apiCallCount;
    callSequence.push(...parallelResult.callSequence);
    parallelTime = parallelResult.timings.parallelTime;
    
    if (!parallelResult.pricingContent) {
      console.log(`Pricing verileri alınamadı: ${asin}`);
      return NextResponse.json({
        success: false,
        error: `Pricing verileri alınamadı`
      } as ApiResponse, { status: 404 });
    }
    
    // VERİLERİ İŞLE
    const pricingAnalysis = analyzePricingOffers(parallelResult.pricingContent);
    const salesRank = parallelResult.productContent ? extractSalesRank(parallelResult.productContent) : 0;
    const category = parallelResult.productContent ? extractCategory(parallelResult.productContent) : 'Unknown';
    
    const title = parallelResult.productContent?.title || parallelResult.pricingContent?.title || 'Başlık bulunamadı';
    const image = parallelResult.productContent?.images?.[0] || '';
    
    const product: AmazonProduct = {
      title,
      image,
      price: pricingAnalysis.bestPrice,
      sales_rank: salesRank,
      category,
      asin
    };
    
    const pricingResult = calculateOurPrice(product);
    
    const message = pricingResult.accepted && pricingResult.ourPrice
      ? `Kabul Edildi! Bizim Fiyatımız: $${pricingResult.ourPrice}`
      : `Reddedildi: ${pricingResult.reason}`;
    
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
    
    await productCache.saveToCache(
      cleanCode,
      codeType,
      product,
      pricingResult,
      message,
      debugInfo
    );
    
    const speedLabel = totalTime < 4000 ? 'SUPER HIZLI' : totalTime < 7000 ? 'HIZLI' : 'NORMAL';
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
    console.error(`HATA [${totalTime}ms]: ${error.message}`);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return NextResponse.json({
        success: false,
        error: 'Timeout - API çok yavaş'
      } as ApiResponse, { status: 408 });
    }
    
    if (error.response?.status === 401) {
      return NextResponse.json({ 
        success: false, 
        error: 'API kimlik doğrulama hatası' 
      } as ApiResponse, { status: 500 });
    }
    
    if (error.response?.status === 429) {
      return NextResponse.json({ 
        success: false, 
        error: 'API limit aşıldı' 
      } as ApiResponse, { status: 429 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Amazon kontrolü sırasında hata oluştu'
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