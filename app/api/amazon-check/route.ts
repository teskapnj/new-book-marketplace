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
  price_shipping?: number;
  pricing_str?: string;
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
  totalPrice: number;
  shippingCost: number;
  bestCondition: string;
  analysisDetails: string;
  hasNewPrice: boolean;
  pricingInfo?: string;
  lowestAvailablePrice?: number;
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

// Global kategori listesi
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
      const isbn10 = convertISBN13toISBN10(cleanCode);
      if (isbn10) {
        console.log(`ISBN-13 converted: ${cleanCode} → ${isbn10}`);
        return { type: 'isbn', searchCode: isbn10, converted: true };
      }
    }
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
 * Pricing string'den en düşük fiyatı çıkar - DÜZELTİLMİŞ
 */
function parseLowestPriceFromPricingStr(pricingStr: string): number {
  if (!pricingStr) return 0;
  
  console.log('Parsing pricing string:', pricingStr);
  
  // "from $17.70" kısmını yakala - shipping öncesi
  const fromMatch = pricingStr.match(/from\s+\$(\d+\.?\d*)/i);
  if (fromMatch) {
    const price = parseFloat(fromMatch[1]);
    console.log(`Found "from" price: $${price}`);
    return price;
  }
  
  // "from" bulunamazsa, ilk fiyatı al ama shipping ile karıştırma
  const priceMatches = pricingStr.match(/\$(\d+\.?\d*)/g);
  
  if (!priceMatches || priceMatches.length === 0) {
    console.log('No prices found in pricing string');
    return 0;
  }
  
  // İlk fiyatı al (genellikle ürün fiyatıdır)
  const firstPrice = parseFloat(priceMatches[0].replace('$', ''));
  
  if (!isNaN(firstPrice) && firstPrice > 0) {
    console.log(`Using first price found: $${firstPrice}`);
    return firstPrice;
  }
  
  console.log('No valid price found');
  return 0;
}

/**
 * Buybox ve price field'larından en iyi fiyatı çıkar
 */
function extractBestPrice(productData: ProductDetailResult): PriceAnalysisResult {
  console.log('=== ENHANCED PRICE ANALYSIS DEBUG ===');
  console.log('price:', productData.price);
  console.log('price_buybox:', productData.price_buybox);
  console.log('price_shipping:', productData.price_shipping);
  console.log('pricing_str:', productData.pricing_str);
  console.log('buybox array:', productData.buybox);

  let bestPrice = 0;
  let shippingCost = 0;
  let bestCondition = 'unknown';
  let analysisDetails = '';
  let hasNewPrice = false;
  let pricingInfo = productData.pricing_str || '';
  let lowestAvailablePrice = 0;

  // Shipping fiyatını al
  if (productData.price_shipping && productData.price_shipping > 0) {
    shippingCost = productData.price_shipping;
    console.log(`Shipping cost found: $${shippingCost}`);
  }

  // Pricing string'den en düşük fiyatı çıkar
  if (pricingInfo) {
    const lowestFromPricing = parseLowestPriceFromPricingStr(pricingInfo);
    if (lowestFromPricing > 0) {
      // FREE Shipping kontrolü
      const hasFreeShipping = pricingInfo.toLowerCase().includes('free');
      
      // Shipping maliyetini belirle
      let shippingForLowest = 0;
      if (!hasFreeShipping) {
        // Önce pricing string'den shipping fiyatını çıkarmaya çalış
        const shippingMatch = pricingInfo.match(/\+\s*\$(\d+\.?\d*)\s*shipping/i);
        if (shippingMatch) {
          shippingForLowest = parseFloat(shippingMatch[1]);
          console.log(`Found shipping in pricing_str: ${shippingForLowest}`);
        } else if (shippingCost > 0) {
          // Pricing string'de shipping yoksa, genel shipping kullan
          shippingForLowest = shippingCost;
          console.log(`Using general shipping: ${shippingForLowest}`);
        }
      }
      
      lowestAvailablePrice = lowestFromPricing + shippingForLowest;
      console.log(`📊 Lowest from pricing_str: ${lowestFromPricing}, Shipping: ${shippingForLowest}, Total: ${lowestAvailablePrice}`);
    }
  }

  // 1. Buybox array'ini kontrol et
  if (productData.buybox && Array.isArray(productData.buybox) && productData.buybox.length > 0) {
    const buybox = productData.buybox[0];
    console.log('Analyzing buybox:', buybox);
    
    if (buybox.price && buybox.price > 0) {
      bestPrice = buybox.price;
      
      if (buybox.condition) {
        const conditionLower = buybox.condition.toLowerCase().trim();
        console.log('Buybox condition:', conditionLower);
        
        if (conditionLower.includes('new') || conditionLower.includes('buy new')) {
          bestCondition = 'new';
          hasNewPrice = true;
        } else {
          bestCondition = 'used';
          hasNewPrice = false;
        }
        analysisDetails = `Buybox: $${bestPrice} (${buybox.condition})`;
      } else {
        bestCondition = 'new';
        hasNewPrice = true;
        analysisDetails = `Buybox: $${bestPrice} (condition not specified, assumed new)`;
      }
      
      if (shippingCost > 0) {
        analysisDetails += ` + $${shippingCost} shipping`;
      }
      
      console.log('✅ Using buybox array price:', analysisDetails);
      
      const totalPrice = bestPrice + shippingCost;
      return { 
        bestPrice, 
        totalPrice, 
        shippingCost, 
        bestCondition, 
        analysisDetails, 
        hasNewPrice,
        pricingInfo,
        lowestAvailablePrice
      };
    }
  }

  // 2. price_buybox field'ını kontrol et
  if (productData.price_buybox && productData.price_buybox > 0) {
    bestPrice = productData.price_buybox;
    bestCondition = 'new';
    hasNewPrice = true;
    analysisDetails = `price_buybox: $${bestPrice} (assumed new)`;
    
    if (shippingCost > 0) {
      analysisDetails += ` + $${shippingCost} shipping`;
    }
    
    console.log('✅ Using price_buybox field:', analysisDetails);
    
    const totalPrice = bestPrice + shippingCost;
    return { 
      bestPrice, 
      totalPrice, 
      shippingCost, 
      bestCondition, 
      analysisDetails, 
      hasNewPrice,
      pricingInfo,
      lowestAvailablePrice
    };
  }

  // 3. Ana price field'ını kontrol et
  if (productData.price && productData.price > 0) {
    bestPrice = productData.price;
    bestCondition = 'new';
    hasNewPrice = true;
    analysisDetails = `main price: $${bestPrice} (assumed new)`;
    
    if (shippingCost > 0) {
      analysisDetails += ` + $${shippingCost} shipping`;
    }
    
    console.log('✅ Using main price field:', analysisDetails);
    
    const totalPrice = bestPrice + shippingCost;
    return { 
      bestPrice, 
      totalPrice, 
      shippingCost, 
      bestCondition, 
      analysisDetails, 
      hasNewPrice,
      pricingInfo,
      lowestAvailablePrice
    };
  }

  // Hiç fiyat bulunamadı - pricing_str'yi fallback olarak kullan
  if (lowestAvailablePrice > 0) {
    bestPrice = parseLowestPriceFromPricingStr(pricingInfo);
    const totalPrice = lowestAvailablePrice;
    bestCondition = 'unknown';
    hasNewPrice = false;
    analysisDetails = `pricing_str fallback: ${bestPrice} + shipping = ${totalPrice} total`;
    
    console.log('✅ Using pricing_str as fallback:', analysisDetails);
    
    return { 
      bestPrice, 
      totalPrice, 
      shippingCost: totalPrice - bestPrice, 
      bestCondition, 
      analysisDetails, 
      hasNewPrice,
      pricingInfo,
      lowestAvailablePrice
    };
  }
  
  // Gerçekten hiç fiyat yok
  analysisDetails = 'No valid price found in any field';
  console.log('❌ No price found in any field');
  
  const totalPrice = bestPrice + shippingCost;
  return { 
    bestPrice, 
    totalPrice, 
    shippingCost, 
    bestCondition, 
    analysisDetails, 
    hasNewPrice,
    pricingInfo,
    lowestAvailablePrice
  };
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
 * SINGLE PRODUCT API CALL
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
    console.log(`Making product API call for ASIN: ${asin}`);
    
    const productResponse = await axios.post<OxylabsResponse<ProductDetailResult>>(
      'https://realtime.oxylabs.io/v1/queries',
      productRequest,
      apiConfig
    );

    const productTime = Date.now() - startTime;
    const productContent = productResponse.data.results?.[0]?.content || null;

    console.log(`✅ Product API call completed in ${productTime}ms`);

    return {
      productContent,
      apiCallCount: 1,
      callSequence: ['product'],
      timings: { productTime }
    };
  } catch (error) {
    const productTime = Date.now() - startTime;
    console.error(`❌ Product API error (${productTime}ms):`, error);
    
    return {
      productContent: null,
      apiCallCount: 1,
      callSequence: ['product'],
      timings: { productTime }
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

    console.log(`\nOXYLABS ENHANCED SINGLE PRODUCT: ${cleanCode} (${codeInfo.type})`);

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
    if (codeInfo.type === 'asin') {
      asin = codeInfo.searchCode;
      console.log('ASIN available, skipping search');
    } else if (codeInfo.type === 'isbn' && !codeInfo.needsSearch) {
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

    // DATA PROCESSING
    const priceAnalysis = extractBestPrice(productResult.productContent);
    const salesRank = extractSalesRank(productResult.productContent);
    const category = extractCategory(productResult.productContent);

    const title = productResult.productContent.title || 'Title not found';
    const image = productResult.productContent.images?.[0] || '';

    // ÖZEL FİYAT MANTĞI - Sadece buybox yoksa ve 28 dolar altı için
    let finalPrice = priceAnalysis.totalPrice; // varsayılan
    let displayMessage = '';
    
    // Eğer buybox fiyatı yoksa (pricing_str fallback kullanıldıysa)
    const isFallbackPrice = priceAnalysis.analysisDetails.includes('pricing_str fallback');
    
    if (isFallbackPrice && priceAnalysis.totalPrice < 28) {
      // Buybox yok + 28 dolar altı → En düşük fiyat kuralı
      let lowestTotalPrice = priceAnalysis.totalPrice;
      
      if (priceAnalysis.lowestAvailablePrice && priceAnalysis.lowestAvailablePrice > 0) {
        lowestTotalPrice = priceAnalysis.lowestAvailablePrice;
      }
      
      if (lowestTotalPrice >= 17) {
        finalPrice = 29;
        console.log(`💡 Fallback price adjustment: ${lowestTotalPrice} → ${finalPrice} (buybox yok + lowest price ≥ $17 rule)`);
      } else {
        console.log(`💡 Fallback no adjustment: ${lowestTotalPrice} (buybox yok + lowest price < $17 - keeping real price)`);
      }
    } else if (isFallbackPrice && priceAnalysis.totalPrice >= 28) {
      // Buybox yok + 28 dolar üstü → Direkt gerçek fiyat
      console.log(`💡 Fallback direct price: ${priceAnalysis.totalPrice} (buybox yok + ≥ $28 - using real price)`);
    } else {
      // Buybox var → Normal işlem
      console.log(`💡 Buybox available: ${priceAnalysis.totalPrice} (using buybox price)`);
    }

    // Ürün kartı için basit product objesi (eskisi gibi)
    const product: AmazonProduct = {
      title,
      image,
      price: finalPrice,
      sales_rank: salesRank,
      category,
      asin
    };

    const pricingResult = calculateOurPrice(product);

    // Basit message oluşturma - sadece 2 seçenek
    let message = '';
    if (pricingResult.accepted && pricingResult.ourPrice) {
      message = ` ACCEPTED`;
    } else {
      message = `DOES NOT MEET OUR PURCHASING CRITERIA`;
    }

    // 28 dolardan düşükse fiyat detaylarını console'a yaz (debug için)
    if (priceAnalysis.totalPrice < 28) {
      const basePriceStr = `$${priceAnalysis.bestPrice.toFixed(2)}`;
      const shippingStr = priceAnalysis.shippingCost > 0 ? ` + $${priceAnalysis.shippingCost.toFixed(2)} shipping` : '';
      const totalStr = ` = $${priceAnalysis.totalPrice.toFixed(2)} total`;
      
      displayMessage = `${basePriceStr}${shippingStr}${totalStr}`;
      
      // Pricing info varsa ekle
      if (priceAnalysis.pricingInfo && priceAnalysis.pricingInfo.trim()) {
        displayMessage = `${priceAnalysis.pricingInfo} | ${displayMessage}`;
      }
      
      console.log(`💰 Under $28 pricing details: ${displayMessage}`);
      // message'a eklenmez, sadece console'da görünür
    }

    const totalTime = Date.now() - totalStartTime;

    const debugInfo = {
      searchMethod: 'oxylabs-enhanced-single-product',
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
    console.log(`💰 Original pricing: Base $${priceAnalysis.bestPrice} + Shipping $${priceAnalysis.shippingCost} = Total $${priceAnalysis.totalPrice}`);
    console.log(`🎯 Final product price sent to engine: $${finalPrice}`);
    if (displayMessage) {
      console.log(`📋 Display message: ${displayMessage}`);
    }

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
    message: 'Amazon API - Enhanced Single Product with Smart Pricing Logic',
    configured: hasConfig,
    timestamp: new Date().toISOString()
  });
}