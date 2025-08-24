// /app/api/amazon-check/route.ts
// Oxylabs Amazon API - Optimize Ed ISBN/UPC search with Data Consistency Check
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Fiyat hesaplama motorunu içe aktarmaya çalışın
let calculateOurPrice: any;
try {
  const pricingEngine = require('@/lib/pricingEngine');
  calculateOurPrice = pricingEngine.calculateOurPrice;
} catch (e) {
  console.error('Failed to import pricingEngine:', e);
}

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
    };
  };
  error?: string;
}

/**
 * ISBN/UPC kod tipini algıla
 */
function detectCodeType(code: string): 'isbn' | 'upc' | 'asin' | 'unknown' {
  const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '');
  
  // ASIN: 10 karakter, genellikle B ile başlar
  if (cleanCode.length === 10 && /^B[A-Z0-9]{9}$/.test(cleanCode)) {
    return 'asin';
  }
  
  // ISBN-10: 10 basamak veya 9 basamak + X
  if (cleanCode.length === 10 && /^\d{9}[\dX]$/.test(cleanCode)) {
    return 'isbn';
  }
  
  // ISBN-13: 978 veya 979 ile başlar
  if (cleanCode.length === 13 && /^97[89]\d{10}$/.test(cleanCode)) {
    return 'isbn';
  }
  
  // UPC: 12 basamak
  if (cleanCode.length === 12 && /^\d{12}$/.test(cleanCode)) {
    return 'upc';
  }
  
  // UPC-E: 8 basamak
  if (cleanCode.length === 8 && /^\d{8}$/.test(cleanCode)) {
    return 'upc';
  }
  
  return 'unknown';
}

/**
 * Oxylabs fiyat verisini ayrıştırır - SADECE YENİ ürün fiyatları
 * Öncelik: 1. YENİ Buybox, 2. En düşük YENİ fiyat, 3. Standart fiyat (YENİ kabul edilir)
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
      } else if (productDetail.buybox[0]) {
        const condition = productDetail.buybox[0].condition || 'Unknown';
        console.log(`⚠️ Buybox ${condition} durumunda, YENİ fiyat aranıyor...`);
      }
    }
    
    if (productDetail.offers_summary && Array.isArray(productDetail.offers_summary)) {
      const newOffers = productDetail.offers_summary.filter(
        offer => offer.condition && offer.condition.toLowerCase().includes('new')
      );
      
      if (newOffers.length > 0) {
        const prices = newOffers.map(o => o.price).filter(p => p > 0);
        if (prices.length > 0) {
          const lowestNewPrice = Math.min(...prices);
          if (lowestNewPrice > 0 && lowestNewPrice !== Infinity) {
            console.log(`💰 Tekliflerden en düşük YENİ fiyat kullanılıyor: ${lowestNewPrice}`);
            return lowestNewPrice;
          }
        }
      }
    }
    
    if (productDetail.pricing_str && typeof productDetail.pricing_str === 'string') {
      const newPriceMatch = productDetail.pricing_str.match(/New[^$]*from\s+\$?([\d,]+\.?\d*)/i);
      if (newPriceMatch) {
        const extractedPrice = parseFloat(newPriceMatch[1].replace(/,/g, ''));
        if (!isNaN(extractedPrice) && extractedPrice > 0) {
          console.log(`💰 pricing_str'den çıkarılan YENİ fiyat: ${extractedPrice}`);
          return extractedPrice;
        }
      }
      
      if (!productDetail.pricing_str.toLowerCase().includes('used') && 
          !productDetail.pricing_str.toLowerCase().includes('refurbished')) {
        const priceMatch = productDetail.pricing_str.match(/from\s+\$?([\d,]+\.?\d*)/);
        if (priceMatch) {
          const extractedPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
          if (!isNaN(extractedPrice) && extractedPrice > 0) {
            console.log(`💰 Çıkarılan fiyat (YENİ kabul edildi): ${extractedPrice}`);
            return extractedPrice;
          }
        }
      }
    }
    
    if (productDetail.condition) {
      const isNewProduct = productDetail.condition.toLowerCase() === 'new' || 
                          productDetail.condition.toLowerCase().includes('new');
      
      if (!isNewProduct) {
        console.log(`⚠️ Ürün durumu ${productDetail.condition}, YENİ fiyat bulunamadı`);
        return 0;
      }
    }
  }
  
  if (typeof priceData === 'number' && priceData > 0) {
    console.log(`💰 Standart fiyat kullanılıyor (YENİ kabul edildi): ${priceData}`);
    return priceData;
  }
  
  if (typeof priceData === 'string') {
    const cleanPrice = priceData.replace(/[$,]/g, '').trim();
    const parsed = parseFloat(cleanPrice);
    if (!isNaN(parsed) && parsed > 0) {
      console.log(`💰 Ayrıştırılan fiyat (YENİ kabul edildi): ${parsed}`);
      return parsed;
    }
  }
  
  console.log('❌ YENİ fiyat bulunamadı');
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
    console.log(`📊 ${productData.sales_rank.length} satış sıralaması girişi bulundu`);
    
    const mainCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD'];
    let mainCategoryRank = 0;
    let anyRank = 0;
    
    for (const rankItem of productData.sales_rank) {
      if (rankItem.rank && typeof rankItem.rank === 'number' && rankItem.rank > 0) {
        if (anyRank === 0) {
          anyRank = rankItem.rank;
        }
        
        if (rankItem.ladder && Array.isArray(rankItem.ladder)) {
          const categoryName = rankItem.ladder[0]?.name || '';
          console.log(`  - ${categoryName} içinde #${rankItem.rank} sıralaması`);
          
          if (mainCategories.some(cat => categoryName.includes(cat))) {
            mainCategoryRank = rankItem.rank;
            console.log(`✅ Ana kategori sıralaması bulundu: ${mainCategoryRank}`);
            return mainCategoryRank;
          }
        }
      }
    }
    
    if (anyRank > 0) {
      console.log(`⚠️ Ana kategori sıralaması yok, ilk sıralama kullanılıyor: #${anyRank}`);
      return anyRank;
    }
  }
  
  if (productData.best_sellers_rank) {
    console.log('📊 best_sellers_rank metni ayrıştırılıyor:', productData.best_sellers_rank);
    
    const mainRankMatch = productData.best_sellers_rank.match(/#?([\d,]+)\s+in\s+(Books|Music|Movies|Video Games|CDs)/i);
    if (mainRankMatch) {
      const rank = parseInt(mainRankMatch[1].replace(/,/g, ''));
      if (!isNaN(rank) && rank > 0) {
        console.log(`✅ Metinden ana kategori sıralaması: ${mainRankMatch[2]} içinde #${rank}`);
        return rank;
      }
    }
    
    const parsed = parseRankFromString(productData.best_sellers_rank);
    if (parsed > 0) {
      console.log(`✅ Metinden sıralama: #${parsed}`);
      return parsed;
    }
  }
  
  if (productData.specifications?.best_sellers_rank) {
    console.log('📊 specifications.best_sellers_rank ayrıştırılıyor:', productData.specifications.best_sellers_rank);
    
    const specRankMatch = productData.specifications.best_sellers_rank.match(/#?([\d,]+)\s+in\s+(Books|Music|Movies|Video Games|CDs)/i);
    if (specRankMatch) {
      const rank = parseInt(specRankMatch[1].replace(/,/g, ''));
      if (!isNaN(rank) && rank > 0) {
        console.log(`✅ Özelliklerden ana kategori sıralaması: ${specRankMatch[2]} içinde #${rank}`);
        return rank;
      }
    }
    
    const parsed = parseRankFromString(productData.specifications.best_sellers_rank);
    if (parsed > 0) {
      console.log(`✅ Özelliklerden sıralama: #${parsed}`);
      return parsed;
    }
  }
  
  console.log('❌ Ürün detaylarında satış sıralaması bulunamadı');
  return 0;
}

/**
 * Kategoriyi çıkarır - Ana kategoriye öncelik verir
 */
function extractCategory(data: any): string {
  console.log('🔍 Kategori çıkarılıyor...');
  
  const mainCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD & Blu-ray'];
  
  if (data.sales_rank && Array.isArray(data.sales_rank)) {
    for (const rankItem of data.sales_rank) {
      if (rankItem.ladder && rankItem.ladder[0]) {
        const categoryName = rankItem.ladder[0].name;
        
        if (mainCategories.some(cat => categoryName.includes(cat))) {
          console.log(`✅ Satış sıralamasından ana kategori: ${categoryName}`);
          return categoryName;
        }
      }
    }
  }
  
  if (data.category && Array.isArray(data.category)) {
    if (data.category[0]?.ladder) {
      const ladder = data.category[0].ladder;
      
      for (const item of ladder) {
        const name = item.name || '';
        
        if (mainCategories.some(cat => name.includes(cat))) {
          console.log(`✅ Hiyerarşiden ana kategori: ${name}`);
          return name;
        }
      }
      
      if (ladder.length > 0) {
        const firstCategory = ladder[0]?.name;
        if (firstCategory) {
          console.log(`✅ Hiyerarşiden genel kategori: ${firstCategory}`);
          return firstCategory;
        }
      }
    }
  }
  
  if (data.category && typeof data.category === 'string') {
    console.log(`✅ Aramadan kategori: ${data.category}`);
    return data.category;
  }
  
  console.log('❌ Kategori bulunamadı, Bilinmeyen kullanılıyor');
  return 'Unknown';
}


/**
 * POST /api/amazon-check
 * Optimize edilmiş API çağrı akışı:
 * 1. Eğer ASIN ise, doğrudan ürün detayları araması (1 çağrı)
 * 2. Eğer ISBN/UPC ise, ASIN'i bulmak için arama, ardından ASIN ile detayları çağır (2 çağrı toplam)
 */
export async function POST(request: NextRequest) {
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
        error: `Geçersiz ISBN/UPC formatı. Lütfen kontrol edin.`
      } as ApiResponse, { status: 400 });
    }
    
    const username = process.env.OXYLABS_USERNAME;
    const password = process.env.OXYLABS_PASSWORD;
    
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Oxylabs API yapılandırması eksik'
      } as ApiResponse, { status: 500 });
    }
    
    console.log(`\n🔍 Amazon için kontrol ediliyor: ${cleanCode} (${codeType})`);
    console.log('═══════════════════════════════════');
    
    let asin = '';
    let productContent: ProductDetailResult | null = null;
    let apiCallCount = 0;
    
    if (codeType === 'asin') {
      // Akış 1: Eğer kod zaten bir ASIN ise, doğrudan ürün detayları çağrısı yapıyoruz. Bu en hızlı yol.
      console.log('📡 ASIN algılandı. Doğrudan ürün detayları araması yapılıyor...');
      apiCallCount = 1;
      asin = cleanCode;
      
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
          timeout: 30000,
        }
      );
      
      productContent = productResponse.data.results?.[0]?.content || null;
      
    } else {
      // Akış 2: Eğer kod ISBN veya UPC ise, ASIN'i bulmak için önce bir arama (amazon_search)
      // ardından ürün detaylarını almak için ikinci bir çağrı (amazon_product) yapıyoruz.
      console.log(`📡 ${codeType.toUpperCase()} algılandı. ASIN'i bulmak için arama API'si kullanılıyor...`);
      apiCallCount = 1;
      
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
          timeout: 30000
        }
      );
      
      const searchContent = searchResponse.data.results?.[0]?.content;
      const firstProduct = searchContent?.results?.organic?.[0] || searchContent?.results?.paid?.[0];
      
      if (!firstProduct || !firstProduct.asin) {
        return NextResponse.json({
          success: false,
          error: `Bu ${codeType.toUpperCase()} için ürün bulunamadı: ${cleanCode}`
        } as ApiResponse, { status: 404 });
      }
      
      asin = firstProduct.asin;
      console.log(`✅ Arama ile ürün bulundu! ASIN: ${asin}`);
      
      console.log('📡 ASIN ile ürün detayları getiriliyor...');
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
          timeout: 30000
        }
      );
      
      productContent = productResponse.data.results?.[0]?.content || null;
    }
    
    if (!productContent) {
      return NextResponse.json({
        success: false,
        error: `Ürün detayları ASIN: ${asin} için alınamadı.`
      } as ApiResponse, { status: 404 });
    }
    
    const price = parsePrice(productContent.price || productContent.price_upper, productContent);
    const salesRank = extractSalesRankFromProduct(productContent);
    const category = extractCategory(productContent);
    
    const product: AmazonProduct = {
      title: productContent.title || 'Başlık bulunamadı',
      image: productContent.images?.[0] || '',
      price: price,
      sales_rank: salesRank,
      category: category,
      asin: asin
    };
    
    console.log('\n� Ürün Özeti:');
    console.log('═══════════════');
    console.log(`📚 Başlık: ${product.title}`);
    console.log(`💰 Fiyat: $${product.price}`);
    console.log(`📊 Satış Sıralaması: ${product.sales_rank || 'Bulunamadı'}`);
    console.log(`📂 Kategori: ${product.category}`);
    console.log(`🔖 ASIN: ${product.asin}`);
    console.log(`🔍 Arama Yöntemi: ${codeType === 'asin' ? 'doğrudan-arama' : 'arama-sonra-detaylar'}`);
    console.log(`📡 API Çağrıları: ${apiCallCount}`);
    
    const pricingResult = calculateOurPrice(product);
    
    if (product.price === 0) {
      return NextResponse.json({
        success: true,
        data: {
          product,
          pricing: {
            accepted: false,
            reason: 'Yeni ürün fiyatı bulunamadı. Yalnızca kullanılmış veya yenilenmiş ürünler mevcut olabilir.'
          },
          message: '❌ Yeni ürün fiyatı bulunamadı',
          debug: {
            searchMethod: codeType === 'asin' ? 'doğrudan-arama' : 'arama-sonra-detaylar',
            apiCalls: apiCallCount,
            hasRank: salesRank > 0
          }
        }
      } as ApiResponse);
    }
    
    let message = '';
    if (pricingResult.accepted && pricingResult.ourPrice) {
      message = `✅ Kabul Edildi! Bizim Fiyatımız: $${pricingResult.ourPrice}`;
    } else {
      message = `❌ ${pricingResult.reason}`;
    }
    
    console.log(`\n🎯 Sonuç: ${message}`);
    console.log('═══════════════════════════════════\n');
    
    const lastKnownData = {
      price: 38,
      sales_rank: 142
    };

    let dataConsistencyMessage = 'Veri tutarlılığı kontrolü yapıldı: Uygun';
    if (lastKnownData.price > 0 && lastKnownData.sales_rank > 0) {
      const priceChangePercentage = Math.abs((product.price - lastKnownData.price) / lastKnownData.price) * 100;
      const rankChangeRatio = product.sales_rank / lastKnownData.sales_rank;

      if (priceChangePercentage > 10 && product.price !== 0) {
        dataConsistencyMessage = `❌ Fiyat değişimi anormal: %${priceChangePercentage.toFixed(2)}'lik bir değişim var.`;
      }
      
      if (rankChangeRatio > 10 || rankChangeRatio < 0.1) {
          dataConsistencyMessage = `❌ Sıralama değişimi anormal: Son bilinen sıralamanın ${rankChangeRatio.toFixed(2)} katı.`;
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        product,
        pricing: pricingResult,
        message,
        debug: {
          searchMethod: codeType === 'asin' ? 'doğrudan-arama' : 'arama-sonra-detaylar',
          apiCalls: apiCallCount,
          hasRank: salesRank > 0,
          dataConsistency: dataConsistencyMessage
        }
      }
    } as ApiResponse);
    
  } catch (error: any) {
    console.error('❌ Amazon API Hatası:', error.message);
    
    if (error.response) {
      console.error('Durum:', error.response.status);
      
      if (error.response.status === 401) {
        return NextResponse.json({
          success: false,
          error: 'Oxylabs API kimlik doğrulama hatası'
        } as ApiResponse, { status: 500 });
      }
      
      if (error.response.status === 429) {
        return NextResponse.json({
          success: false,
          error: 'API çağrı limiti aşıldı, lütfen bekleyin'
        } as ApiResponse, { status: 429 });
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json({
        success: false,
        error: 'API zaman aşımı - lütfen tekrar deneyin'
      } as ApiResponse, { status: 408 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Amazon kontrolü sırasında bir hata oluştu'
    } as ApiResponse, { status: 500 });
  }
}

/**
 * GET /api/amazon-check - Sağlık kontrolü
 */
export async function GET() {
  const hasConfig = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);
  
  return NextResponse.json({
    success: true,
    message: 'Amazon API uç noktası çalışıyor',
    configured: hasConfig,
    timestamp: new Date().toISOString()
  });
}
