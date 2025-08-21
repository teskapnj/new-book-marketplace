// /app/api/amazon-check/route.ts
// Oxylabs Amazon API - ISBN/UPC optimized search

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Try importing from pricingEngine
let calculateOurPrice: any;
try {
  const pricingEngine = require('@/lib/pricingEngine');
  calculateOurPrice = pricingEngine.calculateOurPrice;
} catch (e) {
  console.error('Failed to import pricingEngine:', e);
}

// Define types locally to avoid import issues
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

interface OxylabsSearchRequest {
  source: string;
  query: string;
  geo_location: string;
  parse: boolean;
  domain?: string;
}

interface OxylabsPricingRequest {
  source: string;
  query: string;  // ASIN
  geo_location: string;
  parse: boolean;
  domain?: string;
}

interface PricingResult {
  title?: string;
  asin?: string;
  offers?: Array<{
    price: number;
    condition: string;
    seller_name?: string;
    delivery?: string;
    is_fba?: boolean;
    is_prime?: boolean;
  }>;
  // Sometimes the API returns these fields
  new_price?: number;
  used_price?: number;
  lowest_new_price?: number;
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
  // Sometimes available in search results
  sales_rank?: number;
  best_sellers_rank?: string;
  category?: string;
}

interface ProductDetailResult {
  asin?: string;
  title?: string;
  price?: number | string;
  price_upper?: number;
  images?: string[];
  rating?: number;
  // Buybox price - usually the featured/winning seller price
  buybox?: Array<{
    price: number;
    stock: string;
    delivery_type: string;
    condition?: string; // "New", "Used", "Refurbished", etc.
    seller?: string;
  }>;
  price_buybox?: number; // Sometimes direct buybox price
  // New & Used pricing
  pricing_str?: string; // "New & Used (229) from $237.99"
  pricing_count?: number;
  // NEW products only price
  price_new?: number;
  new_price?: number;
  // Sales rank info
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
  // Condition info
  condition?: string; // "New", "Used", etc.
  is_prime_eligible?: boolean;
  // Offers summary
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

interface SearchContent {
  results?: {
    organic?: SearchResult[];
    paid?: SearchResult[];
  };
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
    };
  };
  error?: string;
}

/**
 * Detect ISBN/UPC code type
 */
function detectCodeType(code: string): 'isbn' | 'upc' | 'asin' | 'unknown' {
  const cleanCode = code.replace(/[^a-zA-Z0-9]/g, '');
  
  // ASIN: 10 characters, usually starts with B
  if (cleanCode.length === 10 && /^B[A-Z0-9]{9}$/.test(cleanCode)) {
    return 'asin';
  }
  
  // ISBN-10: 10 digits or 9 digits + X
  if (cleanCode.length === 10 && /^\d{9}[\dX]$/.test(cleanCode)) {
    return 'isbn';
  }
  
  // ISBN-13: starts with 978 or 979
  if (cleanCode.length === 13 && /^97[89]\d{10}$/.test(cleanCode)) {
    return 'isbn';
  }
  
  // UPC: 12 digits
  if (cleanCode.length === 12 && /^\d{12}$/.test(cleanCode)) {
    return 'upc';
  }
  
  // UPC-E: 8 digits
  if (cleanCode.length === 8 && /^\d{8}$/.test(cleanCode)) {
    return 'upc';
  }
  
  return 'unknown';
}

/**
 * Format ISBN with hyphens
 */
function formatISBN(isbn: string): string {
  const clean = isbn.replace(/[^0-9X]/gi, '');
  
  // ISBN-13: 978-0-123-45678-9
  if (clean.length === 13) {
    return `${clean.slice(0,3)}-${clean.slice(3,4)}-${clean.slice(4,7)}-${clean.slice(7,12)}-${clean.slice(12)}`;
  }
  
  // ISBN-10: 0-123-45678-X
  if (clean.length === 10) {
    return `${clean.slice(0,1)}-${clean.slice(1,4)}-${clean.slice(4,9)}-${clean.slice(9)}`;
  }
  
  return clean;
}

/**
 * Parse Oxylabs price data - ONLY NEW product prices
 * Priority: 1. NEW Buybox, 2. Lowest NEW price, 3. Standard price (assumed NEW)
 */
function parsePrice(priceData: any, productDetail?: ProductDetailResult): number {
  // If detailed product data is available
  if (productDetail) {
    // 1. Check for direct NEW price fields
    if (productDetail.price_new && typeof productDetail.price_new === 'number' && productDetail.price_new > 0) {
      console.log(`💰 Using price_new field: ${productDetail.price_new}`);
      return productDetail.price_new;
    }
    
    if (productDetail.new_price && typeof productDetail.new_price === 'number' && productDetail.new_price > 0) {
      console.log(`💰 Using new_price field: ${productDetail.new_price}`);
      return productDetail.new_price;
    }
    
    // 2. Check buybox - ONLY if it's NEW condition
    if (productDetail.buybox && Array.isArray(productDetail.buybox) && productDetail.buybox.length > 0) {
      // Find NEW buybox
      const newBuybox = productDetail.buybox.find(item => 
        !item.condition || 
        item.condition.toLowerCase() === 'new' ||
        item.condition.toLowerCase().includes('new')
      );
      
      if (newBuybox && newBuybox.price > 0) {
        console.log(`💰 Using NEW buybox price: ${newBuybox.price}`);
        return newBuybox.price;
      } else if (productDetail.buybox[0]) {
        const condition = productDetail.buybox[0].condition || 'Unknown';
        console.log(`⚠️ Buybox is ${condition}, looking for NEW price...`);
      }
    }
    
    // 3. Find lowest NEW price from offers_summary
    if (productDetail.offers_summary && Array.isArray(productDetail.offers_summary)) {
      const newOffers = productDetail.offers_summary.filter(
        offer => offer.condition && offer.condition.toLowerCase().includes('new')
      );
      
      if (newOffers.length > 0) {
        // Get the lowest NEW price
        const prices = newOffers.map(o => o.price).filter(p => p > 0);
        if (prices.length > 0) {
          const lowestNewPrice = Math.min(...prices);
          if (lowestNewPrice > 0 && lowestNewPrice !== Infinity) {
            console.log(`💰 Using lowest NEW price from offers: ${lowestNewPrice}`);
            return lowestNewPrice;
          }
        }
      }
    }
    
    // 4. Extract NEW price from pricing_str
    if (productDetail.pricing_str && typeof productDetail.pricing_str === 'string') {
      // Try to extract "New from $X" or "New (50) from $X"
      const newPriceMatch = productDetail.pricing_str.match(/New[^$]*from\s+\$?([\d,]+\.?\d*)/i);
      if (newPriceMatch) {
        const extractedPrice = parseFloat(newPriceMatch[1].replace(/,/g, ''));
        if (!isNaN(extractedPrice) && extractedPrice > 0) {
          console.log(`💰 Extracted NEW price from pricing_str: ${extractedPrice}`);
          return extractedPrice;
        }
      }
      
      // If no "Used" mentioned and has "from $X", assume it's NEW
      if (!productDetail.pricing_str.toLowerCase().includes('used') && 
          !productDetail.pricing_str.toLowerCase().includes('refurbished')) {
        const priceMatch = productDetail.pricing_str.match(/from\s+\$?([\d,]+\.?\d*)/);
        if (priceMatch) {
          const extractedPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
          if (!isNaN(extractedPrice) && extractedPrice > 0) {
            console.log(`💰 Extracted price (assuming NEW): ${extractedPrice}`);
            return extractedPrice;
          }
        }
      }
    }
    
    // 5. Check general condition - if not NEW, don't use the price
    if (productDetail.condition) {
      const isNewProduct = productDetail.condition.toLowerCase() === 'new' || 
                          productDetail.condition.toLowerCase().includes('new');
      
      if (!isNewProduct) {
        console.log(`⚠️ Product condition is ${productDetail.condition}, NEW price not found`);
        return 0; // No NEW price available
      }
    }
  }
  
  // Standard price parsing (assuming NEW if no condition specified)
  if (typeof priceData === 'number' && priceData > 0) {
    console.log(`💰 Using standard price (assuming NEW): ${priceData}`);
    return priceData;
  }
  
  if (typeof priceData === 'string') {
    const cleanPrice = priceData.replace(/[$,]/g, '').trim();
    const parsed = parseFloat(cleanPrice);
    if (!isNaN(parsed) && parsed > 0) {
      console.log(`💰 Parsed price (assuming NEW): ${parsed}`);
      return parsed;
    }
  }
  
  console.log('❌ No NEW price found');
  return 0;
}

/**
 * Parse rank from string
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
 * Extract sales rank from search results (fast method)
 */
function extractSalesRankFromSearch(searchResult: SearchResult): number {
  if (searchResult.sales_rank && typeof searchResult.sales_rank === 'number') {
    return searchResult.sales_rank;
  }
  
  if (searchResult.best_sellers_rank) {
    return parseRankFromString(searchResult.best_sellers_rank);
  }
  
  return 0;
}

/**
 * Extract sales rank from product details (detailed method)
 * Prioritizes main category rank (Books, Music, etc.)
 */
function extractSalesRankFromProduct(productData: ProductDetailResult): number {
  console.log('🔍 Extracting sales rank from product details...');
  
  // Method 1: sales_rank array - Find main category
  if (productData.sales_rank && Array.isArray(productData.sales_rank)) {
    console.log(`📊 Found ${productData.sales_rank.length} sales rank entries`);
    
    // Prioritize media categories
    const mainCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD'];
    let mainCategoryRank = 0;
    let anyRank = 0;
    
    for (const rankItem of productData.sales_rank) {
      if (rankItem.rank && typeof rankItem.rank === 'number' && rankItem.rank > 0) {
        // Save first valid rank (fallback)
        if (anyRank === 0) {
          anyRank = rankItem.rank;
        }
        
        // Check if main category
        if (rankItem.ladder && Array.isArray(rankItem.ladder)) {
          const categoryName = rankItem.ladder[0]?.name || '';
          console.log(`  - Rank #${rankItem.rank} in ${categoryName}`);
          
          // Main category found
          if (mainCategories.some(cat => categoryName.includes(cat))) {
            mainCategoryRank = rankItem.rank;
            console.log(`✅ Main category rank found: #${mainCategoryRank} in ${categoryName}`);
            return mainCategoryRank;
          }
        }
      }
    }
    
    // If no main category found, return first rank
    if (anyRank > 0) {
      console.log(`⚠️ No main category rank, using first rank: #${anyRank}`);
      return anyRank;
    }
  }
  
  // Method 2: best_sellers_rank string field - Get first rank (usually main category)
  if (productData.best_sellers_rank) {
    console.log('📊 Parsing best_sellers_rank string:', productData.best_sellers_rank);
    
    // Extract "#1,715,366 in Books" format
    const mainRankMatch = productData.best_sellers_rank.match(/#?([\d,]+)\s+in\s+(Books|Music|Movies|Video Games|CDs)/i);
    if (mainRankMatch) {
      const rank = parseInt(mainRankMatch[1].replace(/,/g, ''));
      if (!isNaN(rank) && rank > 0) {
        console.log(`✅ Main category rank from string: #${rank} in ${mainRankMatch[2]}`);
        return rank;
      }
    }
    
    // General format: Get first rank
    const parsed = parseRankFromString(productData.best_sellers_rank);
    if (parsed > 0) {
      console.log(`✅ Rank from string: #${parsed}`);
      return parsed;
    }
  }
  
  // Method 3: specifications.best_sellers_rank
  if (productData.specifications?.best_sellers_rank) {
    console.log('📊 Parsing specifications.best_sellers_rank:', productData.specifications.best_sellers_rank);
    
    // Special parsing for main category
    const specRankMatch = productData.specifications.best_sellers_rank.match(/#?([\d,]+)\s+in\s+(Books|Music|Movies|Video Games|CDs)/i);
    if (specRankMatch) {
      const rank = parseInt(specRankMatch[1].replace(/,/g, ''));
      if (!isNaN(rank) && rank > 0) {
        console.log(`✅ Main category rank from specifications: #${rank} in ${specRankMatch[2]}`);
        return rank;
      }
    }
    
    const parsed = parseRankFromString(productData.specifications.best_sellers_rank);
    if (parsed > 0) {
      console.log(`✅ Rank from specifications: #${parsed}`);
      return parsed;
    }
  }
  
  console.log('❌ No sales rank found in product details');
  return 0;
}

/**
 * Extract category - Prioritizes main category
 */
function extractCategory(data: any): string {
  console.log('🔍 Extracting category...');
  
  // Main media categories
  const mainCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games', 'Music', 'DVD & Blu-ray'];
  
  // Method 1: Main category from sales_rank
  if (data.sales_rank && Array.isArray(data.sales_rank)) {
    for (const rankItem of data.sales_rank) {
      if (rankItem.ladder && rankItem.ladder[0]) {
        const categoryName = rankItem.ladder[0].name;
        
        // Check if main category
        if (mainCategories.some(cat => categoryName.includes(cat))) {
          console.log(`✅ Main category from sales rank: ${categoryName}`);
          return categoryName;
        }
      }
    }
  }
  
  // Method 2: From category array
  if (data.category && Array.isArray(data.category)) {
    if (data.category[0]?.ladder) {
      const ladder = data.category[0].ladder;
      
      // Search for main category in ladder
      for (const item of ladder) {
        const name = item.name || '';
        
        // Main category found
        if (mainCategories.some(cat => name.includes(cat))) {
          console.log(`✅ Main category from ladder: ${name}`);
          return name;
        }
      }
      
      // If no main category, return most general category (usually first element)
      if (ladder.length > 0) {
        const firstCategory = ladder[0]?.name;
        if (firstCategory) {
          console.log(`✅ General category from ladder: ${firstCategory}`);
          return firstCategory;
        }
      }
    }
  }
  
  // Method 3: Simple category from search result
  if (data.category && typeof data.category === 'string') {
    console.log(`✅ Category from search: ${data.category}`);
    return data.category;
  }
  
  console.log('❌ No category found, using Unknown');
  return 'Unknown';
}

/**
 * Optimization decision: Is sales rank needed?
 */
function needsSalesRank(price: number, category: string): boolean {
  // Low price items don't need sales rank
  if (price < 10) return false;
  
  // Media categories need sales rank
  const mediaCategories = ['Books', 'CDs & Vinyl', 'Movies & TV', 'Video Games'];
  if (mediaCategories.includes(category)) return true;
  
  // High price items need sales rank
  if (price > 50) return true;
  
  return false;
}

/**
 * POST /api/amazon-check
 * ISBN/UPC optimized Amazon product check
 */
export async function POST(request: NextRequest) {
  try {
    // Debug: Log raw request body
    const bodyText = await request.text();
    console.log('📥 Raw request body:', bodyText);
    
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body'
      } as ApiResponse, { status: 400 });
    }
    
    console.log('📦 Parsed body:', body);
    
    const { isbn_upc, force_detailed = false } = body;
    
    // Input validation
    if (!isbn_upc || typeof isbn_upc !== 'string') {
      console.error('❌ Validation failed:', { isbn_upc, type: typeof isbn_upc });
      return NextResponse.json({
        success: false,
        error: 'ISBN or UPC code required'
      } as ApiResponse, { status: 400 });
    }
    
    // Clean the code
    const cleanCode = isbn_upc.replace(/[^a-zA-Z0-9X]/gi, '').trim().toUpperCase();
    
    // Detect code type
    const codeType = detectCodeType(cleanCode);
    console.log(`📖 Code type: ${codeType} - ${cleanCode}`);
    
    // Format validation
    if (codeType === 'unknown') {
      return NextResponse.json({
        success: false,
        error: 'Invalid ISBN/UPC format. ISBN: 10 or 13 digits, UPC: 8 or 12 digits'
      } as ApiResponse, { status: 400 });
    }
    
    // API credentials
    const username = process.env.OXYLABS_USERNAME;
    const password = process.env.OXYLABS_PASSWORD;
    
    console.log('🔐 Credentials check:', {
      hasUsername: !!username,
      hasPassword: !!password,
      usernameLength: username?.length || 0
    });
    
    if (!username || !password) {
      console.error('❌ Missing Oxylabs credentials');
      return NextResponse.json({
        success: false,
        error: 'Oxylabs API configuration missing'
      } as ApiResponse, { status: 500 });
    }
    
    console.log(`\n🔍 Searching Amazon for: ${cleanCode} (${codeType})`);
    console.log('═══════════════════════════════════');
    
    // Prepare search query
    let searchQuery = cleanCode;
    
    // Format ISBN if needed
    if (codeType === 'isbn') {
      searchQuery = formatISBN(cleanCode);
      console.log(`📚 Formatted ISBN: ${searchQuery}`);
    }
    
    // STEP 1: Search by ISBN/UPC
    const searchRequest: OxylabsSearchRequest = {
      source: 'amazon_search',
      query: searchQuery,
      geo_location: '90210',
      domain: 'com',
      parse: true
    };
    
    console.log('📡 Searching...');
    let apiCallCount = 1;
    
    const searchResponse = await axios.post<OxylabsResponse<SearchContent>>(
      'https://realtime.oxylabs.io/v1/queries',
      searchRequest,
      {
        auth: { username, password },
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );
    
    // Check results
    if (!searchResponse.data.results?.[0]?.content?.results) {
      return NextResponse.json({
        success: false,
        error: 'Amazon API not responding'
      } as ApiResponse, { status: 500 });
    }
    
    const searchContent = searchResponse.data.results[0].content;
    const allProducts = [
      ...(searchContent.results?.organic || []),
      ...(searchContent.results?.paid || [])
    ];
    
    if (allProducts.length === 0) {
      console.log('❌ Product not found');
      
      // Retry with unformatted code
      if (codeType === 'isbn' && searchQuery !== cleanCode) {
        console.log('🔄 Retrying with unformatted ISBN...');
        searchRequest.query = cleanCode;
        
        const retryResponse = await axios.post<OxylabsResponse<SearchContent>>(
          'https://realtime.oxylabs.io/v1/queries',
          searchRequest,
          {
            auth: { username, password },
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
          }
        );
        
        apiCallCount++;
        
        const retryContent = retryResponse.data.results?.[0]?.content;
        const retryProducts = [
          ...(retryContent?.results?.organic || []),
          ...(retryContent?.results?.paid || [])
        ];
        
        if (retryProducts.length === 0) {
          return NextResponse.json({
            success: false,
            error: `No product found for this ${codeType.toUpperCase()}: ${cleanCode}`
          } as ApiResponse, { status: 404 });
        }
        
        allProducts.push(...retryProducts);
      } else {
        return NextResponse.json({
          success: false,
          error: `No product found for this ${codeType.toUpperCase()}: ${cleanCode}`
        } as ApiResponse, { status: 404 });
      }
    }
    
    // Get first product
    const firstProduct = allProducts[0];
    const asin = firstProduct.asin;
    
    if (!asin) {
      console.log('❌ ASIN not found');
      return NextResponse.json({
        success: false,
        error: 'Product ASIN not found'
      } as ApiResponse, { status: 404 });
    }
    
    console.log(`✅ Product found!`);
    console.log(`📦 ASIN: ${asin}`);
    console.log(`📚 Title: ${firstProduct.title}`);
    console.log(`💰 Price: $${parsePrice(firstProduct.price)}`);
    
    // Quick assessment: Check for sales rank in search results
    let quickRank = extractSalesRankFromSearch(firstProduct);
    let quickCategory = firstProduct.category || 'Unknown';
    const price = parsePrice(firstProduct.price || firstProduct.price_upper);
    
    if (quickRank > 0) {
      console.log(`📊 Quick rank found: ${quickRank}`);
    }
    
    // Optimization decision
    const shouldFetchDetails = force_detailed || 
                              quickRank === 0 || 
                              needsSalesRank(price, quickCategory);
    
    let product: AmazonProduct;
    let searchMethod: string;
    let hasRank = false;
    
    if (shouldFetchDetails) {
      // STEP 2: Detailed info needed - Get product details by ASIN
      console.log('📡 Fetching detailed info (for sales rank)...');
      
      const productRequest= {
        source: 'amazon_product',
        query: asin,
        geo_location: '90210',
        domain: 'com',
        parse: true
      };
      
      apiCallCount++;
      
      try {
        const productResponse = await axios.post<OxylabsResponse<ProductDetailResult>>(
          'https://realtime.oxylabs.io/v1/queries',
          productRequest,
          {
            auth: { username, password },
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
          }
        );
        
        const productContent = productResponse.data.results?.[0]?.content;
        
        if (productContent) {
          const detailedRank = extractSalesRankFromProduct(productContent);
          const detailedCategory = extractCategory(productContent);
          
          // Detailed price check - NEW products only
          const detailedPrice = parsePrice(
            productContent.price || productContent.price_upper || firstProduct.price,
            productContent // Pass productDetail for NEW price extraction
          );
          
          product = {
            title: productContent.title || firstProduct.title || 'Title not found',
            image: productContent.images?.[0] || firstProduct.image || firstProduct.thumbnail || '',
            price: detailedPrice,
            sales_rank: detailedRank || quickRank,
            category: detailedCategory !== 'Unknown' ? detailedCategory : quickCategory,
            asin: productContent.asin || asin
          };
          
          searchMethod = 'detailed';
          hasRank = (detailedRank || quickRank) > 0;
          
          console.log(`✅ Detailed info retrieved`);
          if (detailedRank > 0) {
            console.log(`📊 Sales Rank: ${detailedRank}`);
          }
          if (productContent.buybox && productContent.buybox[0]) {
            const buyboxCondition = productContent.buybox[0].condition || 'Unknown';
            console.log(`💳 Buybox condition: ${buyboxCondition}`);
          }
          if (detailedPrice === 0) {
            console.log(`⚠️ WARNING: No NEW price found, product might be USED only`);
          }
        } else {
          throw new Error('Product details empty');
        }
        
      } catch (detailError) {
        console.log('⚠️ Details not available, using search results');
        
        product = {
          title: firstProduct.title || 'Title not found',
          image: firstProduct.image || firstProduct.thumbnail || '',
          price: parsePrice(price, undefined),
          sales_rank: quickRank,
          category: quickCategory,
          asin: asin
        };
        
        searchMethod = 'search-fallback';
        hasRank = quickRank > 0;
      }
      
    } else {
      // Optimization: Use search results only
      console.log('⚡ Fast mode: Search results sufficient');
      
      product = {
        title: firstProduct.title || 'Title not found',
        image: firstProduct.image || firstProduct.thumbnail || '',
        price: parsePrice(price, undefined),
        sales_rank: quickRank,
        category: quickCategory,
        asin: asin
      };
      
      searchMethod = 'search-only';
      hasRank = quickRank > 0;
    }
    
    console.log('\n📋 Product Summary:');
    console.log('═══════════════');
    console.log(`📚 Title: ${product.title}`);
    console.log(`💰 Price: $${product.price}`);
    console.log(`📊 Sales Rank: ${product.sales_rank || 'Not found'}`);
    console.log(`📂 Category: ${product.category}`);
    console.log(`🔖 ASIN: ${product.asin}`);
    console.log(`🔍 Search method: ${searchMethod}`);
    console.log(`📡 API calls: ${apiCallCount}`);
    
    // Calculate pricing
    const pricingResult = calculateOurPrice(product);
    
    // Special handling if NEW price not found
    if (product.price === 0) {
      console.log(`\n⚠️ NEW price not found - might be USED/REFURBISHED only`);
      return NextResponse.json({
        success: true,
        data: {
          product,
          pricing: {
            accepted: false,
            reason: 'No NEW product price found. Only used or refurbished items may be available.'
          },
          message: '❌ NEW product price not found',
          debug: {
            searchMethod,
            apiCalls: apiCallCount,
            hasRank
          }
        }
      } as ApiResponse);
    }
    
    // Format result
    let message = '';
    if (pricingResult.accepted && pricingResult.ourPrice) {
      message = `✅ Accepted! Our price: $${pricingResult.ourPrice}`;
    } else {
      message = `❌ ${pricingResult.reason}`;
    }
    
    console.log(`\n🎯 Result: ${message}`);
    console.log('═══════════════════════════════════\n');
    
    return NextResponse.json({
      success: true,
      data: {
        product,
        pricing: pricingResult,
        message,
        debug: {
          searchMethod,
          apiCalls: apiCallCount,
          hasRank
        }
      }
    } as ApiResponse);
    
  } catch (error: any) {
    console.error('❌ Amazon API Error:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      
      if (error.response.status === 401) {
        return NextResponse.json({
          success: false,
          error: 'Oxylabs API authentication error'
        } as ApiResponse, { status: 500 });
      }
      
      if (error.response.status === 429) {
        return NextResponse.json({
          success: false,
          error: 'API rate limit exceeded, please wait'
        } as ApiResponse, { status: 429 });
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json({
        success: false,
        error: 'API timeout - please try again'
      } as ApiResponse, { status: 408 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'An error occurred while checking Amazon'
    } as ApiResponse, { status: 500 });
  }
}

/**
 * GET /api/amazon-check - Health check
 */
export async function GET() {
  const hasConfig = !!(process.env.OXYLABS_USERNAME && process.env.OXYLABS_PASSWORD);
  
  return NextResponse.json({
    success: true,
    message: 'Amazon API endpoint is working',
    configured: hasConfig,
    timestamp: new Date().toISOString()
  });
}