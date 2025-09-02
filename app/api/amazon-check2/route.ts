// /app/api/amazon-check/route.ts
// Scrapingdog Amazon API - SINGLE CALL STRATEGY (FIXED)
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

// TypeScript tip tanımlamaları
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

interface ScrapingdogSearchResult {
  asin?: string;
  title?: string;
  price?: number;
  image?: string;
  rating?: number;
  url?: string;
}

interface ScrapingdogSearchResponse {
  // Response is array format: [results_array, pagination_array]
  0?: ScrapingdogSearchResult[];
  1?: string[];
}

interface ScrapingdogProductResponse {
  title?: string;
  price?: string;
  list_price?: string;
  previous_price?: string;
  availability_status?: string;
  images_of_specified_asin?: string[];
  rating?: number;
  asin?: string;
  brand?: string;
  category?: string[];
  // Scrapingdog doesn't provide bestsellers_rank directly in product API
  // We need to get rank from other means or accept it won't be available
  product_information?: {
    [key: string]: any;
  };
  other_sellers?: Array<{
    price: string;
    seller: string;
    condition: string;
    availability: string;
  }>;
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
      dataConsistency?: string;
      cacheHit?: boolean;
      scrapingdogResponse?: any;
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
 * Fiyatı parse eder - "$22.98" -> 22.98
 */
function parsePrice(priceString: string | number): number {
  if (typeof priceString === 'number') return priceString;
  if (!priceString) return 0;
  
  const cleaned = priceString.toString().replace(/[^0-9.,]/g, '');
  const price = parseFloat(cleaned.replace(',', ''));
  
  return isNaN(price) ? 0 : price;
}

/**
 * Sales rank'i çıkarmaya çalışır - Scrapingdog product API'sinde genelde yok
 */
function extractSalesRank(productData: ScrapingdogProductResponse): number {
  console.log('📊 Sales rank aranıyor...');
  
  // Scrapingdog product API genelde sales rank vermez
  // Sadece product_information içinde varsa kontrol et
  if (productData.product_information) {
    for (const [key, value] of Object.entries(productData.product_information)) {
      if (key.toLowerCase().includes('rank') || key.toLowerCase().includes('best seller')) {
        const rankStr = value.toString();
        const match = rankStr.match(/#?([\d,]+)/);
        if (match) {
          const rank = parseInt(match[1].replace(/,/g, ''));
          if (!isNaN(rank) && rank > 0) {
            console.log(`✅ Product info'dan sıralama bulundu: #${rank}`);
            return rank;
          }
        }
      }
    }
  }
  
  console.log('⚠️ Sales rank bulunamadı (Scrapingdog product API sınırlaması)');
  return 0;
}

/**
 * Kategori çıkarır - Scrapingdog'da brand'den veya title'dan tahmin et
 */
function extractCategory(productData: ScrapingdogProductResponse): string {
  console.log('📂 Kategori çıkarılıyor...');
  
  // Title'da kategori ipuçları ara
  const title = productData.title || '';
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('book') || lowerTitle.includes('novel') || lowerTitle.includes('guide')) {
    console.log(`✅ Title'dan kategori: Books`);
    return 'Books';
  }
  
  if (lowerTitle.includes('cd') || lowerTitle.includes('album') || lowerTitle.includes('music')) {
    console.log(`✅ Title'dan kategori: CDs & Vinyl`);
    return 'CDs & Vinyl';
  }
  
  if (lowerTitle.includes('dvd') || lowerTitle.includes('movie') || lowerTitle.includes('film')) {
    console.log(`✅ Title'dan kategori: Movies & TV`);
    return 'Movies & TV';
  }
  
  if (lowerTitle.includes('game') || lowerTitle.includes('nintendo') || lowerTitle.includes('xbox') || 
      lowerTitle.includes('playstation') || lowerTitle.includes('gaming')) {
    console.log(`✅ Title'dan kategori: Video Games`);
    return 'Video Games';
  }
  
  console.log('❌ Kategori belirlenemedi, Unknown olarak ayarlandı');
  return 'Unknown';
}

/**
 * En iyi fiyatı bulur
 */
function getBestPrice(productData: ScrapingdogProductResponse): { price: number; condition: string; details: string } {
  console.log('💰 En iyi fiyat aranıyor...');
  
  let bestPrice = 0;
  let condition = 'unknown';
  let details = '';
  
  // Ana fiyatı kontrol et
  if (productData.price) {
    bestPrice = parsePrice(productData.price);
    condition = 'new';
    details = `Ana fiyat: $${bestPrice}`;
    console.log(`✅ Ana fiyat bulundu: $${bestPrice}`);
  }
  
  // other_sellers'ları kontrol et (daha iyi fiyat varsa)
  if (productData.other_sellers && Array.isArray(productData.other_sellers) && productData.other_sellers.length > 0) {
    console.log(`📊 ${productData.other_sellers.length} alternatif satıcı bulundu`);
    
    // NEW teklifleri filtrele
    const newOffers = productData.other_sellers.filter(offer => 
      offer.condition && offer.condition.toLowerCase().includes('new')
    );
    
    // USED teklifleri filtrele
    const usedOffers = productData.other_sellers.filter(offer => 
      offer.condition && (
        offer.condition.toLowerCase().includes('used') ||
        offer.condition.toLowerCase().includes('good') ||
        offer.condition.toLowerCase().includes('acceptable')
      )
    );
    
    // En düşük NEW fiyatı bul
    if (newOffers.length > 0) {
      const cheapestNew = newOffers.reduce((min, offer) => {
        const price = parsePrice(offer.price);
        return price > 0 && (min.price === 0 || price < min.price) 
          ? { price, seller: offer.seller, condition: offer.condition }
          : min;
      }, { price: 0, seller: '', condition: '' });
      
      if (cheapestNew.price > 0 && (bestPrice === 0 || cheapestNew.price < bestPrice)) {
        bestPrice = cheapestNew.price;
        condition = 'new';
        details = `En düşük NEW: $${bestPrice} (${cheapestNew.seller})`;
        console.log(`✅ En düşük NEW teklif: $${bestPrice}`);
      }
    }
    
    // NEW yoksa USED'a bak
    if (bestPrice === 0 && usedOffers.length > 0) {
      const cheapestUsed = usedOffers.reduce((min, offer) => {
        const price = parsePrice(offer.price);
        return price > 0 && (min.price === 0 || price < min.price)
          ? { price, seller: offer.seller, condition: offer.condition }
          : min;
      }, { price: 0, seller: '', condition: '' });
      
      if (cheapestUsed.price > 0) {
        bestPrice = cheapestUsed.price;
        condition = 'used';
        details = `NEW yok, en düşük USED: $${bestPrice} (${cheapestUsed.seller})`;
        console.log(`⚠️ NEW yok, en düşük USED: $${bestPrice}`);
      }
    }
  }
  
  if (bestPrice === 0) {
    details = 'Hiç geçerli fiyat bulunamadı';
    console.log('❌ Hiç geçerli fiyat bulunamadı');
  }
  
  return { price: bestPrice, condition, details };
}

/**
 * Scrapingdog Amazon Search API
 */
async function searchWithScrapingdog(query: string): Promise<{ asin: string; searchTime: number }> {
  const startTime = Date.now();
  console.log(`📡 Scrapingdog Search API ile arama: ${query}`);
  
  const apiUrl = `https://api.scrapingdog.com/amazon/search`;
  const params = {
    api_key: '68b6756347130d1dab198d29',
    domain: 'com',
    query: query,
    page: '1'
  };
  
  const response = await axios.get<ScrapingdogSearchResponse>(apiUrl, {
    params,
    timeout: 8000
  });
  
  const searchTime = Date.now() - startTime;
  const searchData = response.data;
  
  // Response format: [results_array, pagination_array]
  const results = Array.isArray(searchData) ? searchData[0] : searchData;
  
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`Arama sonucu bulunamadı: ${query}`);
  }
  
  // İlk sonuçtan ASIN'i çıkar
  const firstResult = results[0];
  let asin = firstResult.asin;
  
  // ASIN yoksa URL'den çıkarmaya çalış
  if (!asin && firstResult.url) {
    const asinMatch = firstResult.url.match(/\/dp\/([A-Z0-9]{10})/i);
    if (asinMatch) {
      asin = asinMatch[1];
    }
  }
  
  if (!asin) {
    throw new Error(`ASIN çıkarılamadı: ${query}`);
  }
  
  console.log(`✅ ASIN bulundu: ${asin} (${searchTime}ms)`);
  return { asin, searchTime };
}

/**
 * Scrapingdog Amazon Product API
 */
async function getProductWithScrapingdog(asin: string): Promise<{ productData: ScrapingdogProductResponse; productTime: number }> {
  const startTime = Date.now();
  console.log(`🛍️ Scrapingdog Product API ile ürün detayları: ${asin}`);
  
  const apiUrl = `https://api.scrapingdog.com/amazon/product`;
  const params = {
    api_key: '68b6756347130d1dab198d29',
    domain: 'com',
    asin: asin
  };
  
  const response = await axios.get<ScrapingdogProductResponse>(apiUrl, {
    params,
    timeout: 8000
  });
  
  const productTime = Date.now() - startTime;
  const productData = response.data;
  
  console.log(`✅ Ürün detayları alındı (${productTime}ms)`);
  return { productData, productTime };
}

/**
 * POST /api/amazon-check - SCRAPINGDOG SINGLE CALL STRATEGY (FIXED)
 */
export async function POST(request: NextRequest) {
  const totalStartTime = Date.now();
  let apiCallCount = 0;
  const callSequence: string[] = [];
  let searchTime = 0;
  let productTime = 0;
  
  try {
    const bodyText = await request.text();
    let body;
    
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'İstekteki JSON formatı geçersiz'
      } as ApiResponse, { status: 400 });
    }
    
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
        error: 'Geçersiz ISBN/UPC formatı. Lütfen kontrol edin.'
      } as ApiResponse, { status: 400 });
    }
    
    console.log(`\n🐕 SCRAPINGDOG FIXED STRATEGY: ${cleanCode} (${codeType})`);
    
    // Cache kontrolü
    const cachedResult = await productCache.getFromCache(cleanCode);
    
    if (cachedResult) {
      console.log(`🎯 Cache'den bulundu: ${cleanCode}`);
      console.log(`✅ [CACHE HIT] API çağrısı: 0 (Veriler önbellekten sunuldu)`);
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
    
    let asin = '';
    let searchMethod = 'scrapingdog-fixed';
    let scrapingdogProductData: ScrapingdogProductResponse | null = null;
    
    // === ADIM 1: ASIN BUL (search veya direkt) ===
    if (codeType === 'asin') {
      asin = cleanCode;
      console.log('📌 ASIN zaten mevcut, arama atlanıyor');
    } else {
      try {
        const searchResult = await searchWithScrapingdog(cleanCode);
        asin = searchResult.asin;
        searchTime = searchResult.searchTime;
        apiCallCount++;
        callSequence.push('scrapingdog-search');
      } catch (searchError: any) {
        console.log(`❌ Search hatası: ${searchError.message}`);
        return NextResponse.json({
          success: false,
          error: `Bu ${codeType.toUpperCase()} için ürün bulunamadı: ${cleanCode}`
        } as ApiResponse, { status: 404 });
      }
    }
    
    // === ADIM 2: PRODUCT DATA AL ===
    console.log(`🛍️ ADIM 2: Product data alınıyor...`);
    try {
      const productResult = await getProductWithScrapingdog(asin);
      scrapingdogProductData = productResult.productData;
      productTime = productResult.productTime;
      apiCallCount++;
      callSequence.push('scrapingdog-product');
    } catch (productError: any) {
      console.log(`❌ Product API hatası: ${productError.message}`);
      return NextResponse.json({
        success: false,
        error: `Ürün detayları alınamadı: ${asin}`
      } as ApiResponse, { status: 404 });
    }
    
    // === ADIM 3: VERİLERİ İŞLE ===
    const bestPriceResult = getBestPrice(scrapingdogProductData);
    const salesRank = extractSalesRank(scrapingdogProductData);
    const category = extractCategory(scrapingdogProductData);
    
    const product: AmazonProduct = {
      title: scrapingdogProductData.title || 'Başlık bulunamadı',
      image: scrapingdogProductData.images_of_specified_asin?.[0] || '',
      price: bestPriceResult.price,
      sales_rank: salesRank,
      category: category,
      asin: asin
    };
    
    const pricingResult = calculateOurPrice(product);
    
    let message = '';
    if (pricingResult.accepted && pricingResult.ourPrice) {
      message = `✅ Kabul Edildi! Bizim Fiyatımız: $${pricingResult.ourPrice} (Kaynak: ${bestPriceResult.condition} teklif)`;
    } else {
      message = `❌ ${pricingResult.reason}`;
    }
    
    const totalTime = Date.now() - totalStartTime;
    
    const debugInfo = {
      searchMethod,
      apiCalls: apiCallCount,
      hasRank: salesRank > 0,
      cacheHit: false,
      scrapingdogResponse: {
        priceAnalysis: bestPriceResult.details,
        availableOffers: scrapingdogProductData.other_sellers?.length || 0,
        availability: scrapingdogProductData.availability_status,
        rankLimitation: 'Scrapingdog product API genelde sales rank vermez'
      },
      callSequence,
      timings: {
        ...(searchTime > 0 && { searchTime }),
        productTime,
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
    
    const speedLabel = totalTime < 3000 ? '🚀 SUPER HIZLI' : totalTime < 5000 ? '⚡ HIZLI' : '📈 NORMAL';
    console.log(`✅ [SCRAPINGDOG COMPLETE] ${speedLabel} Toplam: ${totalTime}ms, API: ${apiCallCount} calls, Sequence: ${callSequence.join(' → ')}`);
    
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
    console.error(`❌ [API CALLS: ${apiCallCount}, TIME: ${totalTime}ms] Scrapingdog API Hatası:`, error.message);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return NextResponse.json({
        success: false,
        error: 'İstek zaman aşımına uğradı. Scrapingdog API çok yavaş yanıt veriyor, lütfen tekrar deneyin.'
      } as ApiResponse, { status: 408 });
    }
    
    if (error.response) {
      if (error.response.status === 401) return NextResponse.json({ success: false, error: 'API kimlik doğrulama hatası - API key kontrol edin' } as ApiResponse, { status: 500 });
      if (error.response.status === 429) return NextResponse.json({ success: false, error: 'API çağrı limiti aşıldı' } as ApiResponse, { status: 429 });
      if (error.response.status === 402) return NextResponse.json({ success: false, error: 'Scrapingdog credits tükendi' } as ApiResponse, { status: 402 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Amazon kontrolü sırasında hata oluştu'
    } as ApiResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Amazon API çalışıyor - Scrapingdog Fixed Strategy',
    provider: 'Scrapingdog',
    timestamp: new Date().toISOString()
  });
}