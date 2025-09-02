// /app/api/amazon-check/route.ts
// Oxylabs Amazon API - Optimize Ed ISBN/UPC search with Data Consistency Check + Cache + Yüksek Fiyatlı Ürünler için İkinci Arama
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

// === YENİ SABİT ===
// İkinci arama için fiyat eşiği. Bu fiyatın üzerindeki ürünler için detaylı bilgi alınır.
const PRICE_THRESHOLD_FOR_SECOND_CALL = 23.0;

// Güvenli tip tanımlamaları
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
  price?: number | string;
  price_upper?: number;
  image?: string;
  thumbnail?: string;
  rating?: number;
  url?: string;
  sales_rank?: number;
  best_sellers_rank?: string;
  category?: string;
}

interface SearchContent {
  results?: {
    organic?: SearchResult[];
    paid?: SearchResult[];
  };
}

interface ProductDetailResult {
  asin?: string;
  title?: string;
  price?: number | string;
  price_upper?: number;
  images?: string[];
  rating?: number;
  buybox?: Array<{
    price: number;
    stock: string;
    delivery_type: string;
    condition?: string;
    seller?: string;
  }>;
  price_buybox?: number;
  pricing_str?: string;
  pricing_count?: number;
  price_new?: number;
  new_price?: number;
  sales_rank?: Array<{
    rank: number;
    ladder: Array<{
      name: string;
      url: string;
    }>;
  }>;
  best_sellers_rank?: string;
  category?: Array<{
    ladder: Array<{
      name: string;
      url: string;
    }>;
  }>;
  specifications?: {
    best_sellers_rank?: string;
    customer_reviews?: string;
    [key: string]: any;
  };
  condition?: string;
  is_prime_eligible?: boolean;
  offers_summary?: Array<{
    condition: string;
    price: number;
    count: number;
  }>;
}

interface OxylabsResponse<T> {
  results: Array<{
    content: T;
    created_at: string;
    updated_at: string;
    page: number;
    url: string;
    job_id: string;
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
      skippedSecondCall?: boolean; // Yeni debug alanı
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
 * Oxylabs fiyat verisini ayrıştırır - SADECE YENİ ürün fiyatları
 */
function parsePrice(priceData: any, productDetail?: ProductDetailResult): number {
  if (productDetail) {
    if (productDetail.price_new && typeof productDetail.price_new === 'number' && productDetail.price_new > 0) {
      console.log(`💰 price_new alanı kullanılıyor: ${productDetail.price_new}`);
      return productDetail.price_new;
    }
    
    if (productDetail.new_price && typeof productDetail.new_price === 'number' && productDetail.new_price > 0) {
      console.log(`💰 new_price alanı kullanılıyor: ${productDetail.new_price}`);
      return productDetail.new_price;
    }
    
    if (productDetail.buybox && Array.isArray(productDetail.buybox) && productDetail.buybox.length > 0) {
      const newBuybox = productDetail.buybox.find(item => 
        !item.condition || 
        item.condition.toLowerCase() === 'new' ||
        item.condition.toLowerCase().includes('new')
      );
      
      if (newBuybox && newBuybox.price > 0) {
        console.log(`💰 YENİ buybox fiyatı kullanılıyor: ${newBuybox.price}`);
        return newBuybox.price;
      }
    }
  }
  
  if (typeof priceData === 'number' && priceData > 0) {
    console.log(`💰 Standart fiyat kullanılıyor: ${priceData}`);
    return priceData;
  }
  
  if (typeof priceData === 'string') {
    const cleanPrice = priceData.replace(/[$,]/g, '').trim();
    const parsed = parseFloat(cleanPrice);
    if (!isNaN(parsed) && parsed > 0) {
      console.log(`💰 Ayrıştırılan fiyat: ${parsed}`);
      return parsed;
    }
  }
  
  console.log('❌ Fiyat bulunamadı');
  return 0;
}

/**
 * Sıralamayı metinden ayrıştırır
 */
function parseRankFromString(value: string): number {
  const match = value.match(/#?([\d,]+)/);
  if (match) {
    const rank = parseInt(match[1].replace(/,/g, ''));
    return isNaN(rank) ? 0 : rank;
  }
  return 0;
}

/**
 * Ürün detaylarından satış sıralamasını çıkarır
 */
function extractSalesRankFromProduct(productData: ProductDetailResult): number {
  console.log('🔍 Ürün detaylarından satış sıralaması çıkarılıyor...');
  
  if (productData.sales_rank && Array.isArray(productData.sales_rank)) {
    const mainCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD'];
    let anyRank = 0;
    
    for (const rankItem of productData.sales_rank) {
      if (rankItem.rank && typeof rankItem.rank === 'number' && rankItem.rank > 0) {
        if (anyRank === 0) {
          anyRank = rankItem.rank;
        }
        
        if (rankItem.ladder && Array.isArray(rankItem.ladder)) {
          const categoryName = rankItem.ladder[0]?.name || '';
          
          if (mainCategories.some(cat => categoryName.includes(cat))) {
            console.log(`✅ Ana kategori sıralaması: ${rankItem.rank}`);
            return rankItem.rank;
          }
        }
      }
    }
    
    if (anyRank > 0) {
      console.log(`⚠️ İlk sıralama kullanılıyor: #${anyRank}`);
      return anyRank;
    }
  }
  
  if (productData.best_sellers_rank) {
    const parsed = parseRankFromString(productData.best_sellers_rank);
    if (parsed > 0) {
      console.log(`✅ Metinden sıralama: #${parsed}`);
      return parsed;
    }
  }
  
  console.log('❌ Satış sıralaması bulunamadı');
  return 0;
}

/**
 * Kategoriyi çıkarır
 */
function extractCategory(data: any): string {
  console.log('🔍 Kategori çıkarılıyor...');
  
  const mainCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD'];
  
  if (data.sales_rank && Array.isArray(data.sales_rank)) {
    for (const rankItem of data.sales_rank) {
      if (rankItem.ladder && rankItem.ladder[0]) {
        const categoryName = rankItem.ladder[0].name;
        
        if (mainCategories.some(cat => categoryName.includes(cat))) {
          console.log(`✅ Ana kategori: ${categoryName}`);
          return categoryName;
        }
      }
    }
  }
  
  if (data.category && Array.isArray(data.category)) {
    if (data.category[0]?.ladder && data.category[0].ladder.length > 0) {
      const firstCategory = data.category[0].ladder[0]?.name;
      if (firstCategory) {
        console.log(`✅ Genel kategori: ${firstCategory}`);
        return firstCategory;
      }
    }
  }
  
  console.log('❌ Kategori bulunamadı');
  return 'Unknown';
}

/**
 * POST /api/amazon-check - Yüksek fiyatlı ürünler için ikinci arama optimizasyonu ile
 */
export async function POST(request: NextRequest) {
  // === DÜZELTME: Değişkeni en başta tanımla ===
  let apiCallCount = 0; 
  
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
    
    console.log(`\n🔍 Amazon için kontrol: ${cleanCode} (${codeType})`);
    
    // Cache kontrolü
    const cachedResult = await productCache.getFromCache(cleanCode);
    
    if (cachedResult) {
      console.log(`🎯 Cache'den bulundu: ${cleanCode}`);
      if (cachedResult.product.price < PRICE_THRESHOLD_FOR_SECOND_CALL) {
        console.log(`⚠️ Cache'den gelen ürün fiyatı eşiğin altında ($${cachedResult.product.price}), ikinci arama atlanıyor.`);
        console.log(`✅ [CACHE HIT - LOW PRICE] Toplam API Çağrısı: 0 (Veriler önbellekten sunuldu)`);
        return NextResponse.json({
          success: true,
          data: {
            product: cachedResult.product,
            pricing: cachedResult.pricing,
            message: cachedResult.message + ' (Cache - Low Price, Skipped Detail)',
            debug: { 
              ...cachedResult.debug, 
              cacheHit: true, 
              skippedSecondCall: true 
            }
          }
        } as ApiResponse);
      }
      console.log(`✅ [CACHE HIT] Toplam API Çağrısı: 0 (Veriler önbellekten sunuldu)`);
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
    
    // Oxylabs API setup
    const username = process.env.OXYLABS_USERNAME;
    const password = process.env.OXYLABS_PASSWORD;
    
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Oxylabs API yapılandırması eksik'
      } as ApiResponse, { status: 500 });
    }
    
    let asin = '';
    let initialSearchResult: SearchResult | ProductDetailResult | null = null;
    let productContent: ProductDetailResult | null = null;
    // apiCallCount zaten en başta tanımlandı.
    let searchMethod = '';
    let skippedSecondCall = false;
    
    // === ADIM 1: İLK ARAMA (ASIN veya Arama Sonucu) ===
    if (codeType === 'asin') {
      console.log('📡 ASIN ile direkt arama...');
      apiCallCount = 1; 
      asin = cleanCode;
      searchMethod = 'doğrudan-arama';
      
      const productRequest = {
        source: 'amazon_product',
        query: asin,
        geo_location: '90210',
        domain: 'com',
        parse: true,
      };
      
      const productResponse = await axios.post<OxylabsResponse<ProductDetailResult>>(
        'https://realtime.oxylabs.io/v1/queries',
        productRequest,
        {
          auth: { username, password },
          headers: { 'Content-Type': 'application/json' },
          timeout: 12000,
        }
      );
      
      initialSearchResult = productResponse.data.results?.[0]?.content || null;
      productContent = initialSearchResult as ProductDetailResult | null;
      console.log(`✅ [DIRECT ASIN SEARCH] Toplam API Çağrısı: ${apiCallCount}`);

    } else {
      console.log(`📡 ${codeType.toUpperCase()} ile arama...`);
      apiCallCount = 1; 
      searchMethod = 'arama-sonra-detaylar';
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
          timeout: 12000
        }
      );
      
      const searchContent = searchResponse.data.results?.[0]?.content;
      const firstProduct = searchContent?.results?.organic?.[0] || searchContent?.results?.paid?.[0];
      
      if (!firstProduct || !firstProduct.asin) {
        console.log(`❌ [API CALLS: ${apiCallCount}] Bu ${codeType.toUpperCase()} için ürün bulunamadı: ${cleanCode}`);
        return NextResponse.json({
          success: false,
          error: `Bu ${codeType.toUpperCase()} için ürün bulunamadı: ${cleanCode}`
        } as ApiResponse, { status: 404 });
      }
      
      asin = firstProduct.asin;
      console.log(`✅ ASIN bulundu: ${asin}`);
      console.log(`✅ [INITIAL SEARCH] Toplam API Çağrısı: ${apiCallCount}`);
      initialSearchResult = firstProduct;
    }

    if (!initialSearchResult) {
        console.log(`❌ [API CALLS: ${apiCallCount}] İlk arama sonucu işlenemedi: ${asin}`);
        return NextResponse.json({
            success: false,
            error: `İlk arama sonucu işlenemedi: ${asin}`
        } as ApiResponse, { status: 404 });
    }

    // === ADIM 2: İLK FİYAT KONTROLÜ VE İKİNCİ ARAMA KARARI ===
    let initialPrice = 0;
    if (initialSearchResult) {
        if ('price_upper' in initialSearchResult) {
            initialPrice = parsePrice(initialSearchResult.price || initialSearchResult.price_upper, undefined);
        } else if ('price_new' in initialSearchResult) {
            initialPrice = parsePrice(initialSearchResult.price, initialSearchResult);
        }
    }
    console.log(`📊 İlk fiyat kontrolü: $${initialPrice} (Eşik: $${PRICE_THRESHOLD_FOR_SECOND_CALL})`);

    if (initialPrice < PRICE_THRESHOLD_FOR_SECOND_CALL) {
      console.log(`⚠️ Fiyat eşiğin altında. İkinci detaylı arama YAPILMAYACAK.`);
      skippedSecondCall = true;
      console.log(`✅ [LOW PRICE - SKIPPED SECOND CALL] Toplam API Çağrısı: ${apiCallCount}`);
    } else {
      console.log(`✅ Fiyat eşiğin üzerinde veya eşit. İkinci detaylı arama yapılıyor...`);
      if (codeType !== 'asin') {
        apiCallCount++; 
        const productRequest = {
          source: 'amazon_product',
          query: asin,
          geo_location: '90210',
          domain: 'com',
          parse: true
        };
        
        const productResponse = await axios.post<OxylabsResponse<ProductDetailResult>>(
          'https://realtime.oxylabs.io/v1/queries',
          productRequest,
          {
            auth: { username, password },
            headers: { 'Content-Type': 'application/json' },
            timeout: 12000
          }
        );
        
        productContent = productResponse.data.results?.[0]?.content || null;
        console.log(`✅ [HIGH PRICE - MADE SECOND CALL] Toplam API Çağrısı: ${apiCallCount}`);
      }
      if(codeType === 'asin') {
        console.log(`✅ [HIGH PRICE - DIRECT ASIN, NO SECOND CALL NEEDED] Total API Calls: ${apiCallCount}`);
      }
    }
    
    // === ADIM 3: NİHAYİ ÜRÜN BİLGİLERİNİ İŞLE ===
    if (codeType === 'asin' && !productContent) {
        console.error(`❌ [API CALLS: ${apiCallCount}] Kritik Hata: ASIN ile arama yapıldı ancak productContent boş.`);
        return NextResponse.json({
            success: false,
            error: `ASIN için detaylar alınamadı: ${asin}`
        } as ApiResponse, { status: 500 });
    }

    const finalContent = productContent || (initialSearchResult as ProductDetailResult | null);

    const finalPrice = parsePrice(finalContent?.price || finalContent?.price_upper, finalContent);
    const salesRank = finalContent ? extractSalesRankFromProduct(finalContent) : 0;
    const category = finalContent ? extractCategory(finalContent) : 'Unknown';
    
    const product: AmazonProduct = {
      title: finalContent?.title || initialSearchResult?.title || 'Başlık bulunamadı',
      image: finalContent?.images?.[0] || (initialSearchResult as SearchResult)?.image || (initialSearchResult as SearchResult)?.thumbnail || '',
      price: finalPrice > 0 ? finalPrice : initialPrice,
      sales_rank: salesRank,
      category: category,
      asin: asin
    };
    
    const pricingResult = calculateOurPrice(product);
    
    let message = '';
    if (pricingResult.accepted && pricingResult.ourPrice) {
      message = `✅ Kabul Edildi! Bizim Fiyatımız: $${pricingResult.ourPrice}`;
    } else {
      message = `❌ ${pricingResult.reason}`;
    }
    
    const debugInfo = {
      searchMethod,
      apiCalls: apiCallCount,
      hasRank: salesRank > 0,
      cacheHit: false,
      skippedSecondCall: skippedSecondCall
    };
    
    await productCache.saveToCache(
      cleanCode,
      codeType,
      product,
      pricingResult,
      message,
      debugInfo
    );
    
    console.log(`✅ [PROCESSING COMPLETE] Toplam API Çağrısı: ${apiCallCount}. Ürün cache'lendi.`);
    
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
    // === DÜZELTME: Artık apiCallCount her zaman tanımlı ===
    console.error(`❌ [API CALLS: ${apiCallCount}] Amazon API Hatası:`, error.message);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return NextResponse.json({
        success: false,
        error: 'İstek zaman aşımına uğradı. Amazon API çok yavaş yanıt veriyor, lütfen tekrar deneyin.'
      } as ApiResponse, { status: 408 });
    }
    
    if (error.response) {
      if (error.response.status === 401) return NextResponse.json({ success: false, error: 'API kimlik doğrulama hatası' } as ApiResponse, { status: 500 });
      if (error.response.status === 429) return NextResponse.json({ success: false, error: 'API çağrı limiti aşıldı' } as ApiResponse, { status: 429 });
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
    message: 'Amazon API çalışıyor',
    configured: hasConfig,
    timestamp: new Date().toISOString()
  });
}