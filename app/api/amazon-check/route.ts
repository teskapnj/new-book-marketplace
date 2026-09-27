// /app/api/amazon-check/route.ts
// KEEPA API - SINGLE PRODUCT LOOKUP (Oxylabs'tan geçiş)
import { NextRequest, NextResponse, after } from 'next/server';
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
  // BOOKS: Keepa lowest USED fiyatı. NEW olsa bile ayrıca taşınır.
  bookUsedPrice?: number;
  // GAME için Keepa NEW ve USED fiyatları ayrı tutulur
  gameNewPrice?: number;
  gameUsedPrice?: number;
  gamePlatform?: string;
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
        bookUsedPrice?: number;
        gameNewPrice?: number;
        gameUsedPrice?: number;
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

// Bu surumu film kabul/red kurallari degistiginde artir.
// Eski DVD/Blu-ray cache kayitlari boylece bir kez Keepa'dan tazelenir.
const MOVIE_RULES_VERSION = 2;

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


function isValidISBN10(code: string): boolean {
  if (!/^\d{9}[\dX]$/.test(code)) return false;

  let sum = 0;

  for (let i = 0; i < 10; i++) {
    const char = code[i];
    const value = char === 'X' ? 10 : Number(char);

    if (!Number.isInteger(value)) return false;

    sum += value * (10 - i);
  }

  return sum % 11 === 0;
}


function convertISBN10toISBN13(isbn10: string): string | null {
  if (!isValidISBN10(isbn10)) return null;

  const base12 = `978${isbn10.slice(0, 9)}`;

  const digits = base12.split('').map(Number);

  const weightedSum = digits.reduce(
    (sum, digit, index) =>
      sum + digit * (index % 2 === 0 ? 1 : 3),
    0
  );

  const checkDigit =
    (10 - (weightedSum % 10)) % 10;

  return `${base12}${checkDigit}`;
}

function expandTenDigitMediaCode(code: string): string {
  // Eski CD/DVD baskilarinda barkod bazen insan-okunur kisimda
  // ilk 0 ve son UPC check digit olmadan 10 hane olarak gorunur.
  // Ornek:
  // 7502132402 -> 0 75021 32402 2 -> 075021324022
  const first11 = `0${code}`;

  const digits = first11.split('').map(Number);

  const weightedSum =
    digits.reduce(
      (sum, digit, index) => sum + digit * (index % 2 === 0 ? 3 : 1),
      0
    );

  const checkDigit = (10 - (weightedSum % 10)) % 10;

  return `${first11}${checkDigit}`;
}

function isValidUPC12(code: string): boolean {
  if (!/^\d{12}$/.test(code)) return false;

  const digits = code.split('').map(Number);

  const weightedSum = digits
    .slice(0, 11)
    .reduce(
      (sum, digit, index) => sum + digit * (index % 2 === 0 ? 3 : 1),
      0
    );

  const expectedCheckDigit = (10 - (weightedSum % 10)) % 10;

  return digits[11] === expectedCheckDigit;
}

function addUPCCheckDigit(code: string): string {
  if (!/^\d{11}$/.test(code)) return code;

  const digits = code.split('').map(Number);

  const weightedSum = digits.reduce(
    (sum, digit, index) => sum + digit * (index % 2 === 0 ? 3 : 1),
    0
  );

  const checkDigit = (10 - (weightedSum % 10)) % 10;

  return `${code}${checkDigit}`;
}


function getTenDigitMediaFallbackCodes(code: string): string[] {
  if (!/^\d{10}$/.test(code)) return [];

  // Prefix 0 zaten mevcut hizli lookup'ta deneniyor.
  // Genel UPC-A number-system adaylari icinden kalanlari fallback olarak dene.
  const prefixes = ['1', '6', '7', '8', '9'];

  return prefixes.map((prefix) => {
    return addUPCCheckDigit(`${prefix}${code}`);
  });
}

function normalizeGtinForComparison(value: any): string {
  const digits = String(value || '').replace(/\D/g, '');

  if (!digits || digits.length > 14) return '';

  // UPC-12 / EAN-13 / GTIN-14 ayni urun kodunu temsil edebilir.
  // Soldan 0 ile 14 haneye tamamlamak guvenli karsilastirma saglar.
  return digits.padStart(14, '0');
}

function getMatchingFallbackCodes(
  product: any,
  candidateCodes: string[]
): string[] {
  const productCodes = [
    ...(Array.isArray(product?.upcList) ? product.upcList : []),
    ...(Array.isArray(product?.eanList) ? product.eanList : []),
    ...(Array.isArray(product?.gtinList) ? product.gtinList : [])
  ]
    .map(normalizeGtinForComparison)
    .filter(Boolean);

  return candidateCodes.filter((candidate) => {
    const normalizedCandidate =
      normalizeGtinForComparison(candidate);

    return productCodes.includes(normalizedCandidate);
  });
}


function isUnusableNumericIsbnResponse(response: any): boolean {
  const products =
    Array.isArray(response?.products)
      ? response.products
      : [];

  if (products.length === 0) return true;

  // Keepa bazen numeric ISBN-10'u ASIN gibi kabul edip
  // asin alani olan ama gercek urun bilgisi bulunmayan
  // bos bir shell dondurebiliyor.
  return products.every((product: any) => {
    const title =
      String(product?.title || '').trim();

    const hasCategoryTree =
      Array.isArray(product?.categoryTree) &&
      product.categoryTree.length > 0;

    const rootCategory =
      Number(product?.rootCategory || 0);

    const salesRankReference =
      Number(product?.salesRankReference || 0);

    const current =
      Array.isArray(product?.stats?.current)
        ? product.stats.current
        : [];

    const hasMarketData =
      Number(current?.[1] || 0) > 0 ||
      Number(current?.[2] || 0) > 0 ||
      Number(current?.[3] || 0) > 0;

    const hasIdentity =
      Boolean(title) ||
      hasCategoryTree ||
      rootCategory > 0 ||
      salesRankReference > 0 ||
      Boolean(product?.productGroup) ||
      Boolean(product?.binding) ||
      Boolean(product?.type) ||
      Boolean(product?.imagesCSV) ||
      (
        Array.isArray(product?.images) &&
        product.images.length > 0
      );

    return !hasIdentity && !hasMarketData;
  });
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

  // 10 haneli kod:
  // 1) Gercek ISBN-10 checksum'u gecerliyse kitap.
  // 2) Gecersiz ISBN ise eski CD/DVD katalog kodu olabilir.
  //    Basina 0 + sona UPC check digit ekleyerek UPC-A'ya cevir.
  if (cleanCode.length === 10 && /^\d{9}[\dX]$/.test(cleanCode)) {
    if (isValidISBN10(cleanCode)) {
      return { type: 'isbn', searchCode: cleanCode };
    }

    if (/^\d{10}$/.test(cleanCode)) {
      const expandedUpc = expandTenDigitMediaCode(cleanCode);

      console.log(
        `10-digit media code expanded: ${cleanCode} -> ${expandedUpc}`
      );

      return {
        type: 'upc',
        searchCode: expandedUpc,
        converted: true,
        needsCodeLookup: true
      };
    }
  }

  // 11 haneli UPC-A iki sekilde gelebilir:
  // 1) Bastaki 0 dusmus olabilir.
  // 2) Sondaki UPC check digit eksik olabilir.
  if (cleanCode.length === 11 && /^\d{11}$/.test(cleanCode)) {
    const zeroPrefixedUpc = `0${cleanCode}`;

    // Once bastaki 0'in dusmus olma ihtimalini kontrol et.
    if (isValidUPC12(zeroPrefixedUpc)) {
      console.log(
        `11-digit UPC restored leading zero: ${cleanCode} -> ${zeroPrefixedUpc}`
      );

      return {
        type: 'upc',
        searchCode: zeroPrefixedUpc,
        converted: true,
        needsCodeLookup: true
      };
    }

    // Degilse 11 haneyi UPC verisi kabul edip check digit'i sona ekle.
    const completedUpc = addUPCCheckDigit(cleanCode);

    console.log(
      `11-digit UPC completed with check digit: ${cleanCode} -> ${completedUpc}`
    );

    return {
      type: 'upc',
      searchCode: completedUpc,
      converted: true,
      needsCodeLookup: true
    };
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

    return {
      type: 'isbn',
      searchCode: cleanCode,
      needsCodeLookup: true
    };
  }

  // EAN-13 (CD/DVD/Oyun vb.) -> Keepa "code" parametresiyle arattırılır
  if (cleanCode.length === 13 && /^\d{13}$/.test(cleanCode)) {
    return {
      type: 'upc',
      searchCode: cleanCode,
      needsCodeLookup: true
    };
  }

  // UPC (CD/DVD/Oyun) -> Keepa "code" parametresiyle arattırılır
  if (cleanCode.length === 12 && /^\d{12}$/.test(cleanCode)) {
    return {
      type: 'upc',
      searchCode: cleanCode,
      needsCodeLookup: true
    };
  }

  // EAN-8
  if (cleanCode.length === 8 && /^\d{8}$/.test(cleanCode)) {
    return {
      type: 'upc',
      searchCode: cleanCode,
      needsCodeLookup: true
    };
  }

  return { type: 'unknown', searchCode: cleanCode };
}


// ==================== MEDIA BARCODE ZONE TEST (LOG ONLY) ====================
// SADECE DVD / BLU-RAY log gozlemi icindir.
// Kabul/red/pricing kararini DEGISTIRMEZ.
//
// IMPORTANT:
// GS1 prefix = barkodu tahsis eden GS1 Member Organisation sinyali.
// Urunun kesin uretim/satis ulkesini kanitlamaz.
function getMediaBarcodeZoneTag(
  code: string,
  isDvdOrBluRay: boolean
): string {
  if (!isDvdOrBluRay) return '';

  const digits = String(code).replace(/\D/g, '');

  // Bu testte 12 haneli UPC'leri ayri tutuyoruz.
  if (digits.length === 12) {
    return '🇺🇸/🇨🇦 UPC-12 / NORTH AMERICA SIGNAL | ';
  }

  if (digits.length !== 13) {
    return '❓ MEDIA CODE / UNKNOWN ZONE | ';
  }

  const prefix = Number(digits.slice(0, 3));
  const prefixText = digits.slice(0, 3);
  const between = (min: number, max: number) =>
    prefix >= min && prefix <= max;

  // ----------------------------------------------------------
  // NORTH AMERICA
  // ----------------------------------------------------------
  if (
    between(1, 19) ||
    between(30, 39) ||
    between(50, 59) ||
    between(60, 139)
  ) {
    return `🇺🇸 NORTH AMERICA [GS1 US ${prefixText}] | `;
  }

  if (between(754, 755)) {
    return `🇨🇦 NORTH AMERICA [GS1 Canada ${prefixText}] | `;
  }

  // ----------------------------------------------------------
  // JAPAN - ASIA'dan AYRI tutuluyor
  // ----------------------------------------------------------
  if (
    between(450, 459) ||
    between(490, 499)
  ) {
    return `🗾 JAPAN [EAN ${prefixText}] | `;
  }

  // ----------------------------------------------------------
  // EUROPE
  // ----------------------------------------------------------
  if (
    between(300, 379) || // France
    prefix === 380 ||    // Bulgaria
    prefix === 383 ||    // Slovenia
    prefix === 385 ||    // Croatia
    prefix === 387 ||    // Bosnia-Herzegovina
    prefix === 389 ||    // Montenegro
    between(400, 440) || // Germany
    prefix === 474 ||    // Estonia
    prefix === 475 ||    // Latvia
    prefix === 477 ||    // Lithuania
    prefix === 481 ||    // Belarus
    prefix === 482 ||    // Ukraine
    prefix === 484 ||    // Moldova
    between(500, 509) || // UK
    between(520, 521) || // Greece
    prefix === 529 ||    // Cyprus
    prefix === 530 ||    // Albania
    prefix === 531 ||    // North Macedonia
    prefix === 535 ||    // Malta
    prefix === 539 ||    // Ireland
    between(540, 549) || // Belgium/Luxembourg
    prefix === 560 ||    // Portugal
    prefix === 569 ||    // Iceland
    between(570, 579) || // Denmark
    prefix === 590 ||    // Poland
    prefix === 594 ||    // Romania
    prefix === 599 ||    // Hungary
    between(640, 649) || // Finland
    between(700, 709) || // Norway
    between(730, 739) || // Sweden
    between(760, 769) || // Switzerland
    between(800, 839) || // Italy
    between(840, 849) || // Spain
    prefix === 858 ||    // Slovakia
    prefix === 859 ||    // Czech Republic
    prefix === 860 ||    // Serbia
    between(870, 879) || // Netherlands
    between(900, 919)    // Austria
  ) {
    return `🌍 EUROPE [EAN ${prefixText}] | `;
  }

  // ----------------------------------------------------------
  // EURASIA / CAUCASUS / CENTRAL ASIA
  // Ayrica gosteriyoruz ki sonra kendimiz karar verebilelim.
  // ----------------------------------------------------------
  if (
    between(460, 469) || // Russia
    prefix === 470 ||    // Kyrgyzstan
    prefix === 476 ||    // Azerbaijan
    prefix === 478 ||    // Uzbekistan
    prefix === 483 ||    // Turkmenistan
    prefix === 485 ||    // Armenia
    prefix === 486 ||    // Georgia
    prefix === 487 ||    // Kazakhstan
    prefix === 488 ||    // Tajikistan
    between(868, 869)    // Türkiye
  ) {
    return `🌍 EURASIA [EAN ${prefixText}] | `;
  }

  // ----------------------------------------------------------
  // ASIA
  // ----------------------------------------------------------
  if (
    prefix === 471 ||        // Chinese Taipei
    prefix === 479 ||        // Sri Lanka
    prefix === 480 ||        // Philippines
    prefix === 489 ||        // Hong Kong
    between(680, 681) ||     // China
    between(690, 699) ||     // China
    prefix === 865 ||        // Mongolia
    prefix === 867 ||        // North Korea
    between(880, 881) ||     // South Korea
    prefix === 883 ||        // Myanmar
    prefix === 884 ||        // Cambodia
    prefix === 885 ||        // Thailand
    prefix === 888 ||        // Singapore
    prefix === 890 ||        // India
    prefix === 893 ||        // Vietnam
    prefix === 896 ||        // Pakistan
    prefix === 899 ||        // Indonesia
    prefix === 955 ||        // Malaysia
    prefix === 958           // Macau
  ) {
    return `🌏 ASIA [EAN ${prefixText}] | `;
  }

  // ----------------------------------------------------------
  // MIDDLE EAST / AFRICA
  // ----------------------------------------------------------
  if (
    prefix === 528 ||        // Lebanon
    between(600, 601) ||     // South Africa
    between(603, 609) ||
    prefix === 611 ||
    prefix === 613 ||
    between(615, 622) ||
    between(624, 632) ||
    prefix === 729           // Israel
  ) {
    return `🌍 MENA/AFRICA [EAN ${prefixText}] | `;
  }

  // ----------------------------------------------------------
  // LATIN AMERICA / CARIBBEAN
  // ----------------------------------------------------------
  if (
    between(740, 746) ||
    prefix === 750 ||        // Mexico
    prefix === 759 ||        // Venezuela
    between(770, 771) ||     // Colombia
    prefix === 773 ||        // Uruguay
    prefix === 775 ||        // Peru
    prefix === 777 ||        // Bolivia
    between(778, 779) ||     // Argentina
    prefix === 780 ||        // Chile
    prefix === 784 ||        // Paraguay
    prefix === 786 ||        // Ecuador
    between(789, 790) ||     // Brazil
    prefix === 850           // Cuba
  ) {
    return `🌎 LATAM [EAN ${prefixText}] | `;
  }

  // ----------------------------------------------------------
  // OCEANIA
  // ----------------------------------------------------------
  if (
    between(930, 939) ||     // Australia
    between(940, 949)        // New Zealand
  ) {
    return `🌏 OCEANIA [EAN ${prefixText}] | `;
  }

  // ----------------------------------------------------------
  // GS1 GLOBAL / SPECIAL
  // ----------------------------------------------------------
  if (
    between(950, 952) ||
    between(960, 969) ||
    between(977, 983)
  ) {
    return `🌐 GS1 GLOBAL/SPECIAL [EAN ${prefixText}] | `;
  }

  return `❓ OTHER [EAN ${prefixText}] | `;
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
      history: 0,
      update: KEEPA_UPDATE_HOURS
    },
    timeout: 4000
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
      history: 0,
      update: KEEPA_UPDATE_HOURS
    },
    timeout: 4000
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
  bookUsedPrice: number;
  gameNewPrice: number;
  gameUsedPrice: number;
} {
  const current = product?.stats?.current;

  if (!current) {
    return {
      price: 0,
      hasNewPrice: false,
      bestCondition: 'unknown',
      analysisDetails: 'No stats available',
      bookUsedPrice: 0,
      gameNewPrice: 0,
      gameUsedPrice: 0
    };
  }

  const newPriceCents = current[1];
  const usedPriceCents = current[2];
  const gameNewPrice =
    typeof newPriceCents === 'number' && newPriceCents > 0
      ? newPriceCents / 100
      : 0;

  const gameUsedPrice =
    typeof usedPriceCents === 'number' && usedPriceCents > 0
      ? usedPriceCents / 100
      : 0;

  // BOOKS da ayni Keepa current[2] lowest USED degerini kullanir.
  // NEW fiyat mevcut olsa bile bu alan ayrica pricingEngine'e gonderilir.
  const bookUsedPrice = gameUsedPrice;

  if (typeof newPriceCents === 'number' && newPriceCents > 0) {
    return {
      price: newPriceCents / 100,
      hasNewPrice: true,
      bestCondition: 'new',
      analysisDetails: `Keepa NEW price: $${(newPriceCents / 100).toFixed(2)}`,
      bookUsedPrice,
      gameNewPrice,
      gameUsedPrice
    };
  }

  if (typeof usedPriceCents === 'number' && usedPriceCents > 0) {
    return {
      price: usedPriceCents / 100,
      hasNewPrice: false,
      bestCondition: 'used',
      analysisDetails: `Keepa lowest USED price: $${(usedPriceCents / 100).toFixed(2)}`,
      bookUsedPrice,
      gameNewPrice,
      gameUsedPrice
    };
  }

  return {
    price: 0,
    hasNewPrice: false,
    bestCondition: 'unknown',
    analysisDetails: 'No valid price in stats.current',
    bookUsedPrice: 0,
    gameNewPrice: 0,
    gameUsedPrice: 0
  };
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
  const salesRankReference = product?.salesRankReference;

  // SADECE ana Amazon kategori rank'lari kabul edilir.
  // Alt kategori rank'lari hiçbir şartta kullanılmaz.
  const MAIN_SALES_RANK_REFERENCES = new Set([
    283155,      // Books
    5174,        // CDs & Vinyl
    2625373011,  // Movies & TV
    468642       // Video Games
  ]);

  if (
    typeof rankFromStats === 'number' &&
    rankFromStats > 0 &&
    typeof salesRankReference === 'number' &&
    MAIN_SALES_RANK_REFERENCES.has(salesRankReference)
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

function extractKeepaGamePlatform(product: any): string {
  if (!Array.isArray(product?.categoryTree)) return '';

  return product.categoryTree
    .map((node: any) => String(node?.name || '').trim())
    .filter(Boolean)
    .join(' > ');
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
function flattenKeepaText(value: any): string {
  if (value == null) return '';

  if (Array.isArray(value)) {
    return value.map(flattenKeepaText).join(' ');
  }

  if (typeof value === 'object') {
    return Object.values(value).map(flattenKeepaText).join(' ');
  }

  return String(value);
}

function isPhysicalMovieProduct(product: any): boolean {
  const categoryPath = Array.isArray(product?.categoryTree)
    ? product.categoryTree
        .map((node: any) => String(node?.name || ''))
        .join(' ')
        .toLowerCase()
    : '';

  const type = String(product?.type || '').toUpperCase();

  return (
    type === 'PHYSICAL_MOVIE' ||
    type === 'VIDEO_DVD' ||
    product?.rootCategory === 2625373011 ||
    categoryPath.includes('movies & tv') ||
    categoryPath.includes('dvd') ||
    categoryPath.includes('blu-ray')
  );
}

function isRentalMovie(product: any): boolean {
  if (!isPhysicalMovieProduct(product)) {
    return false;
  }

  const titleText = flattenKeepaText(product?.title);

  // Edition/format alanlarinda tek basina "Rental" bilgisi anlamlidir.
  const structuredRentalText = [
    product?.format,
    product?.edition,
  ]
    .map(flattenKeepaText)
    .join(' ');

  // Aciklama alanlarinda yalnizca daha acik rental ifadelerini kabul et.
  // Boylece film hikayesinde gecen "rental car" / "vacation rental" gibi
  // ifadeler normal bir DVD'yi yanlislikla reddetmez.
  const descriptiveText = [
    product?.itemHighlights,
    product?.features,
    product?.description,
    product?.shortDescription,
  ]
    .map(flattenKeepaText)
    .join(' ');

  const explicitRentalPattern =
    /\b(?:rental version|rental edition|rental copy|rental exclusive|rental only|former rental|ex[-\s]?rental)\b/i;

  return (
    /\brental\b/i.test(structuredRentalText) ||
    /\(\s*rental\s*\)|\[\s*rental\s*\]/i.test(titleText) ||
    explicitRentalPattern.test(titleText) ||
    explicitRentalPattern.test(descriptiveText)
  );
}

function detectMovieRestriction(product: any): string | null {
  if (!isPhysicalMovieProduct(product)) {
    return null;
  }

  const searchableText = [
    product?.title,
    product?.format,
    product?.edition,
    product?.itemHighlights,
    product?.features,
    product?.description,
    product?.shortDescription,
  ]
    .map(flattenKeepaText)
    .join(' ');

  if (isRentalMovie(product)) {
    return 'We do not accept rental-version DVDs/Blu-rays.';
  }

  // Region 2 veya Region 3
  const regionMatch = searchableText.match(
    /\b(?:playback\s+)?region(?:\s+code)?\s*[:#-]?\s*(2|3)\b/i
  );

  if (regionMatch) {
    return `We do not accept Region ${regionMatch[1]} DVDs/Blu-rays.`;
  }

  // PAL format
  const formatText = flattenKeepaText(product?.format);

  if (/\bpal\b/i.test(formatText)) {
    return 'We do not accept PAL DVDs/Blu-rays.';
  }

  return null;
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
    const rank = extractKeepaSalesRank(p);

    if (rank > 0 && pricing.price > 0 && pricing.price < cheapestPrice) {
      cheapestPrice = pricing.price;
      cheapest = p;
    }
  }

  if (cheapest) return cheapest;

  // Fiyatli urun bulunamadiysa en iyi gecerli ana rank'i sec.
  let bestRanked: any | null = null;
  let bestRank = Infinity;

  for (const p of products) {
    const rank = extractKeepaSalesRank(p);

    if (rank > 0 && rank < bestRank) {
      bestRank = rank;
      bestRanked = p;
    }
  }

  if (bestRanked) return bestRanked;

  // Hicbir adayda aktif rank yoksa:
  // ilk $0 listing yerine fiyat verisi olan adayi goster.
  // Rank 0 kalacagi icin pricingEngine yine urunu reddeder.
  let cheapestUnranked: any | null = null;
  let cheapestUnrankedPrice = Infinity;

  for (const p of products) {
    const pricing = extractKeepaPricing(p);

    if (
      pricing.price > 0 &&
      pricing.price < cheapestUnrankedPrice
    ) {
      cheapestUnrankedPrice = pricing.price;
      cheapestUnranked = p;
    }
  }

  if (cheapestUnranked) return cheapestUnranked;

  return products[0];
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

    const isNumericTenDigit =
      /^\d{10}$/.test(cleanCode);

    const isNumericTenDigitIsbn =
      isNumericTenDigit &&
      isValidISBN10(cleanCode);

    const isXTenDigitIsbn =
      /^\\d{9}X$/.test(cleanCode) &&
      isValidISBN10(cleanCode);

    const isAnyTenDigitIsbn =
      isNumericTenDigitIsbn ||
      isXTenDigitIsbn;

    const isTenDigitMediaCandidate =
      isNumericTenDigit &&
      !isValidISBN10(cleanCode);

    const isElevenDigitCode =
      /^\\d{11}$/.test(cleanCode);

    // Cache namespaces:
    // M10V2  = eski 10-digit media fallback
    // I10M3  = numeric ISBN-10: ISBN-13 recovery + media collision fallback
    // I10X1  = X ile biten ISBN-10: ISBN-13 recovery
    // U11V2  = 11-digit UPC iki olasi yorumu birlikte kontrol eder
    const cacheIdentifier = isTenDigitMediaCandidate
      ? `M10V2${cleanCode}`
      : isNumericTenDigitIsbn
        ? `I10M3${cleanCode}`
        : isXTenDigitIsbn
          ? `I10X1${cleanCode}`
          : isElevenDigitCode
            ? `U11V2${cleanCode}`
            : cleanCode;

    if (codeInfo.type === 'unknown') {
      console.warn(`INVALID PRODUCT CODE FORMAT: ${cleanCode}`);

      return NextResponse.json(
        { success: false, error: 'invalid ISBN/UPC format' } as ApiResponse,
        { status: 400 }
      );
    }

    console.log(`\nKEEPA LOOKUP: ${cleanCode} (${codeInfo.type})`);

    // ---- Cache kontrolü ----
    const cacheReadStart = Date.now();
    const cachedResult = await productCache.getFromCache(cacheIdentifier);
    console.log(`⏱️ cacheRead=${Date.now() - cacheReadStart}ms`);

    if (cachedResult) {
      // Keepa daha once bu barkod icin urun bulamadiysa 24 saat boyunca
      // yeniden Keepa'ya gitmeden ayni 404 cevabini dondur.
      if ('notFound' in cachedResult) {
        console.log(`⚡ NOT FOUND CACHE HIT: ${cleanCode}`);

        return NextResponse.json(
          {
            success: false,
            error: 'Product not found. Please check the barcode and try again later.'
          } as ApiResponse,
          { status: 404 }
        );
      }

      const cachedProduct: any = { ...cachedResult.product };

      // Eski cache kayitlarinda bookUsedPrice olmayabilir.
      // gameUsedPrice Keepa stats.current[2] degerinden geldigi icin
      // varsa kitaplar icin lowest USED kaynagi olarak guvenle kullanabiliriz.
      const cachedCategory = String(cachedProduct?.category || '').toLowerCase();
      const isCachedBook =
        cachedCategory.includes('book') || cachedCategory.includes('kindle');

      const cachedType = String(cachedProduct?.type || '').toUpperCase();
      const isCachedMovie =
        cachedResult.pricing?.category === 'dvds' ||
        cachedType === 'PHYSICAL_MOVIE' ||
        cachedType === 'VIDEO_DVD' ||
        cachedCategory.includes('movie') ||
        cachedCategory.includes('dvd') ||
        cachedCategory.includes('blu-ray');

      const cachedMovieRulesVersion =
        Number((cachedResult.debug as any)?.movieRulesVersion || 0);

      const needsMovieRulesRefresh =
        isCachedMovie && cachedMovieRulesVersion !== MOVIE_RULES_VERSION;

      const isLegacyBookCacheMissingUsedSnapshot =
        isCachedBook &&
        cachedProduct.bookUsedPrice == null &&
        cachedProduct.gameUsedPrice == null &&
        cachedProduct.priceType !== 'used' &&
        cachedProduct.priceType !== 'none';

      // Eski BOOK cache kaydinda USED snapshot'i yoksa veya DVD/Blu-ray kaydi
      // eski film kurallariyla olusturulduysa cache'i kullanma; Keepa'dan tazele.
      if (isLegacyBookCacheMissingUsedSnapshot || needsMovieRulesRefresh) {
        if (isLegacyBookCacheMissingUsedSnapshot) {
          console.log(`♻️ LEGACY BOOK CACHE REFRESH: ${cleanCode}`);
        }
        if (needsMovieRulesRefresh) {
          console.log(
            `♻️ MOVIE RULES CACHE REFRESH: ${cleanCode} | ` +
            `cachedVersion=${cachedMovieRulesVersion} -> ${MOVIE_RULES_VERSION}`
          );
        }
      } else {
        if (isCachedBook && cachedProduct.bookUsedPrice == null) {
          cachedProduct.bookUsedPrice = cachedProduct.gameUsedPrice || 0;
        }

        // Sadece BOOKS icin yeni kurali cache hit'te yeniden hesapla.
        // CD/DVD/GAME mevcut cache davranisini aynen korur.
        const cachedPricing: any = isCachedBook
          ? calculateOurPrice(cachedProduct)
          : cachedResult.pricing;

        const cachedMessage = isCachedBook
          ? cachedPricing.accepted && cachedPricing.ourPrice
            ? 'ACCEPTED'
            : 'DOES NOT MEET OUR PURCHASING CRITERIA'
          : cachedResult.message;

        const cachedMediaZoneTag = getMediaBarcodeZoneTag(
          cleanCode,
          cachedPricing?.category === 'dvds'
        );

        console.log(
          `${cachedMediaZoneTag}⚡ CACHE HIT: ${cleanCode} | ` +
          `Price: $${cachedProduct?.price ?? 0} (${cachedProduct?.priceType || 'unknown'}) | ` +
          `${cachedPricing?.category === 'books'
            ? `BookUSED: $${cachedProduct?.bookUsedPrice ?? 0} | Rule: ${cachedPricing?.priceRange || 'N/A'} | `
            : ''}` +
          `${cachedPricing?.category === 'games'
            ? `Platform: ${cachedProduct?.gamePlatform || 'N/A'} | GameNEW: $${cachedProduct?.gameNewPrice ?? 0} | GameUSED: $${cachedProduct?.gameUsedPrice ?? 0} | Rule: ${cachedPricing?.priceRange || 'N/A'} | `
            : ''}` +
          `Rank: ${cachedProduct?.sales_rank ?? 0} | ` +
          `Category: ${cachedProduct?.category || 'Unknown'} | ` +
          `Binding: ${cachedProduct?.binding || 'N/A'} | ` +
          `Type: ${cachedProduct?.type || 'N/A'} | ` +
          `Status: ${cachedPricing?.accepted ? 'ACCEPTED' : 'REJECTED'} | ` +
          `Offer: ${cachedPricing?.accepted && cachedPricing?.ourPrice != null ? `$${cachedPricing.ourPrice}` : 'N/A'}`
        );

        return NextResponse.json({
          success: true,
          data: {
            product: cachedProduct,
            pricing: cachedPricing,
            message: cachedMessage,
            debug: { ...cachedResult.debug, cacheHit: true }
          }
        } as ApiResponse);
      }
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
    let effectiveSearchCode = codeInfo.searchCode;
    let effectiveLookupType: 'code' | 'asin' =
      codeInfo.needsCodeLookup ? 'code' : 'asin';
    let effectiveIdentifierType:
      'isbn' | 'upc' | 'asin' | 'unknown' =
      codeInfo.type;

    const keepaStart = Date.now();
    try {
      if (isElevenDigitCode) {
        const elevenDigitCandidates = Array.from(
          new Set([
            ...(isValidUPC12(`0${cleanCode}`)
              ? [`0${cleanCode}`]
              : []),
            addUPCCheckDigit(cleanCode)
          ])
        );

        console.log(
          `🔁 11-DIGIT UPC LOOKUP: ${cleanCode} | ` +
          `trying=${elevenDigitCandidates.join(',')}`
        );

        const elevenDigitResponse =
          await fetchKeepaByCode(
            elevenDigitCandidates.join(','),
            apiKey
          );

        const elevenDigitProducts =
          Array.isArray(elevenDigitResponse?.products)
            ? elevenDigitResponse.products
            : [];

        const matchesByCode =
          new Map<string, any[]>();

        for (const product of elevenDigitProducts) {
          const matchingCodes =
            getMatchingFallbackCodes(
              product,
              elevenDigitCandidates
            );

          for (const matchingCode of matchingCodes) {
            const existing =
              matchesByCode.get(matchingCode) || [];

            existing.push(product);
            matchesByCode.set(
              matchingCode,
              existing
            );
          }
        }

        const matchedCodes =
          Array.from(matchesByCode.keys());

        if (matchedCodes.length === 1) {
          effectiveSearchCode = matchedCodes[0];
          effectiveLookupType = 'code';
          effectiveIdentifierType = 'upc';

          keepaResponse = {
            ...elevenDigitResponse,
            products:
              matchesByCode.get(effectiveSearchCode) || []
          };

          console.log(
            `✅ 11-DIGIT UPC MATCH: ` +
            `${cleanCode} -> ${effectiveSearchCode} | ` +
            `products=${keepaResponse.products.length} | ` +
            `asins=${keepaResponse.products
              .map((p: any) => p?.asin)
              .filter(Boolean)
              .join(',')}`
          );
        } else {
          keepaResponse = {
            ...elevenDigitResponse,
            products: []
          };

          if (matchedCodes.length > 1) {
            console.warn(
              `⚠️ 11-DIGIT UPC AMBIGUOUS: ` +
              `${cleanCode} | matched=${matchedCodes.join(',')}`
            );
          } else {
            console.warn(
              `❌ 11-DIGIT UPC NO VERIFIED MATCH: ` +
              `${cleanCode} | ` +
              `returnedProducts=${elevenDigitProducts.length}`
            );
          }
        }
      } else if (codeInfo.needsCodeLookup) {
        keepaResponse =
          await fetchKeepaByCode(
            codeInfo.searchCode,
            apiKey
          );
      } else {
        keepaResponse =
          await fetchKeepaByAsin(
            codeInfo.searchCode,
            apiKey
          );
      }


      // Gecerli ISBN-10 ilk ASIN sorgusunda bos/ghost sonuc dondururse
      // once ISBN-13 ile Keepa code lookup yap.
      //
      // Bu ozellikle eski DVD/CD urunlerinde onemli:
      // Amazon ASIN lookup ISBN-10 icin bos shell dondurebilir,
      // fakat ayni urun ISBN-13 code lookup ile gercek media listingine
      // resolve olabilir.
      //
      // Numeric ISBN ise ISBN-13 de sonuc vermezse mevcut eski-media
      // UPC collision fallback'i devam eder.
      //
      // X ile biten ISBN UPC olamayacagi icin sadece ISBN-13 denenir.
      if (
        isAnyTenDigitIsbn &&
        codeInfo.type === 'isbn' &&
        isUnusableNumericIsbnResponse(keepaResponse)
      ) {
        const isbn13Candidate =
          convertISBN10toISBN13(cleanCode);

        const firstTokensConsumed =
          Number(keepaResponse?.tokensConsumed || 0);

        const firstProcessingTime =
          Number(keepaResponse?.processingTimeInMs || 0);

        let isbn13Response: any = null;

        if (isbn13Candidate) {
          console.log(
            `🔁 ISBN-13 RECOVERY: ` +
            `${cleanCode} -> ${isbn13Candidate}`
          );

          isbn13Response =
            await fetchKeepaByCode(
              isbn13Candidate,
              apiKey
            );
        }

        const isbn13Usable =
          Boolean(isbn13Candidate) &&
          !isUnusableNumericIsbnResponse(
            isbn13Response
          );

        // X ile biten ISBN UPC olamaz.
        // Bu nedenle yalnizca dogrudan ISBN-13 recovery sonucunu kullan.
        if (isXTenDigitIsbn) {
          if (isbn13Usable) {
            effectiveSearchCode =
              isbn13Candidate as string;

            effectiveLookupType = 'code';
            effectiveIdentifierType = 'isbn';

            keepaResponse = {
              ...isbn13Response,
              tokensConsumed:
                firstTokensConsumed +
                Number(
                  isbn13Response?.tokensConsumed || 0
                ),
              processingTimeInMs:
                firstProcessingTime +
                Number(
                  isbn13Response?.processingTimeInMs || 0
                )
            };

            console.log(
              `✅ X-ISBN RECOVERY MATCH: ` +
              `${cleanCode} -> ${effectiveSearchCode} | ` +
              `products=${Array.isArray(keepaResponse?.products)
                ? keepaResponse.products.length
                : 0} | ` +
              `asins=${Array.isArray(keepaResponse?.products)
                ? keepaResponse.products
                    .map((p: any) => p?.asin)
                    .filter(Boolean)
                    .join(',')
                : ''}`
            );
          } else {
            keepaResponse = {
              ...(isbn13Response || keepaResponse),
              products: [],
              tokensConsumed:
                firstTokensConsumed +
                Number(
                  isbn13Response?.tokensConsumed || 0
                ),
              processingTimeInMs:
                firstProcessingTime +
                Number(
                  isbn13Response?.processingTimeInMs || 0
                )
            };

            console.warn(
              `❌ X-ISBN NO MATCH: ` +
              `${cleanCode} -> ${isbn13Candidate || 'N/A'}`
            );
          }
        } else {
          // Numeric gecerli ISBN-10:
          //
          // ISBN-13 recovery sonucunu sakla ama eski media UPC collision
          // ihtimalini de kontrol et. Boylece daha once calisan media
          // kodlarini ISBN-13 sonucu yanlislikla ezmez.
          const collisionCandidates = [
            expandTenDigitMediaCode(cleanCode),
            ...getTenDigitMediaFallbackCodes(
              cleanCode
            )
          ];

          console.log(
            `🔁 ISBN-10 MEDIA COLLISION FALLBACK: ` +
            `${cleanCode} | ` +
            `trying=${collisionCandidates.join(',')}`
          );

          const tokensBeforeMedia =
            firstTokensConsumed +
            Number(
              isbn13Response?.tokensConsumed || 0
            );

          const processingBeforeMedia =
            firstProcessingTime +
            Number(
              isbn13Response?.processingTimeInMs || 0
            );

          const fallbackResponse =
            await fetchKeepaByCode(
              collisionCandidates.join(','),
              apiKey
            );

          const fallbackProducts =
            Array.isArray(fallbackResponse?.products)
              ? fallbackResponse.products
              : [];

          const matchesByCode =
            new Map<string, any[]>();

          for (const product of fallbackProducts) {
            const matchingCodes =
              getMatchingFallbackCodes(
                product,
                collisionCandidates
              );

            for (const matchingCode of matchingCodes) {
              const existing =
                matchesByCode.get(matchingCode) || [];

              existing.push(product);

              matchesByCode.set(
                matchingCode,
                existing
              );
            }
          }

          const matchedCodes =
            Array.from(matchesByCode.keys());

          const matchedAsins =
            Array.from(
              new Set(
                matchedCodes
                  .flatMap(
                    (code) =>
                      matchesByCode.get(code) || []
                  )
                  .map((product: any) =>
                    String(product?.asin || '').trim()
                  )
                  .filter(Boolean)
              )
            );

          const canResolveMediaMatch =
            matchedCodes.length === 1 ||
            (
              matchedCodes.length > 1 &&
              matchedAsins.length === 1
            );

          const totalTokensConsumed =
            tokensBeforeMedia +
            Number(
              fallbackResponse?.tokensConsumed || 0
            );

          const totalProcessingTime =
            processingBeforeMedia +
            Number(
              fallbackResponse?.processingTimeInMs || 0
            );

          if (canResolveMediaMatch) {
            effectiveSearchCode =
              collisionCandidates.find(
                (code) =>
                  matchesByCode.has(code)
              ) || matchedCodes[0];

            effectiveLookupType = 'code';
            effectiveIdentifierType = 'upc';

            keepaResponse = {
              ...fallbackResponse,
              products:
                matchesByCode.get(
                  effectiveSearchCode
                ) || [],
              tokensConsumed:
                totalTokensConsumed,
              processingTimeInMs:
                totalProcessingTime
            };

            console.log(
              `✅ ISBN-10 MEDIA COLLISION MATCH: ` +
              `${cleanCode} -> ${effectiveSearchCode} | ` +
              `products=${keepaResponse.products.length} | ` +
              `asins=${keepaResponse.products
                .map((p: any) => p?.asin)
                .filter(Boolean)
                .join(',')}`
            );
          } else if (isbn13Usable) {
            // Derived UPC adaylarinda dogrulanmis media eslesmesi yok,
            // fakat dogrudan ISBN-13 sorgusu gercek urun dondurdu.
            effectiveSearchCode =
              isbn13Candidate as string;

            effectiveLookupType = 'code';
            effectiveIdentifierType = 'isbn';

            keepaResponse = {
              ...isbn13Response,
              tokensConsumed:
                totalTokensConsumed,
              processingTimeInMs:
                totalProcessingTime
            };

            console.log(
              `✅ ISBN-13 RECOVERY MATCH: ` +
              `${cleanCode} -> ${effectiveSearchCode} | ` +
              `products=${Array.isArray(keepaResponse?.products)
                ? keepaResponse.products.length
                : 0} | ` +
              `asins=${Array.isArray(keepaResponse?.products)
                ? keepaResponse.products
                    .map((p: any) => p?.asin)
                    .filter(Boolean)
                    .join(',')
                : ''}`
            );
          } else {
            keepaResponse = {
              ...fallbackResponse,
              products: [],
              tokensConsumed:
                totalTokensConsumed,
              processingTimeInMs:
                totalProcessingTime
            };

            if (matchedCodes.length > 1) {
              console.warn(
                `⚠️ ISBN-10 MEDIA COLLISION AMBIGUOUS: ` +
                `${cleanCode} | ` +
                `matched=${matchedCodes.join(',')}`
              );
            } else {
              console.warn(
                `❌ ISBN-10 NO VERIFIED MATCH: ` +
                `${cleanCode} | ` +
                `isbn13=${isbn13Candidate || 'N/A'} | ` +
                `mediaProducts=${fallbackProducts.length}`
              );
            }
          }
        }
      }

      // 10 haneli eski media kodu:
      // Mevcut prefix-0 lookup sonuc vermezse kalan olasi
      // UPC-A prefixlerini TEK batch Keepa isteginde dene.
      if (
        isTenDigitMediaCandidate &&
        codeInfo.needsCodeLookup &&
        (!Array.isArray(keepaResponse?.products) ||
          keepaResponse.products.length === 0)
      ) {
        const fallbackCodes =
          getTenDigitMediaFallbackCodes(cleanCode);

        console.log(
          `🔁 10-DIGIT FALLBACK: ${cleanCode} | ` +
          `trying=${fallbackCodes.join(',')}`
        );

        const firstTokensConsumed =
          Number(keepaResponse?.tokensConsumed || 0);

        const firstProcessingTime =
          Number(keepaResponse?.processingTimeInMs || 0);

        const fallbackResponse =
          await fetchKeepaByCode(
            fallbackCodes.join(','),
            apiKey
          );

        const fallbackProducts =
          Array.isArray(fallbackResponse?.products)
            ? fallbackResponse.products
            : [];

        const matchesByCode = new Map<string, any[]>();

        for (const product of fallbackProducts) {
          const matchingCodes =
            getMatchingFallbackCodes(
              product,
              fallbackCodes
            );

          for (const matchingCode of matchingCodes) {
            const existing =
              matchesByCode.get(matchingCode) || [];

            existing.push(product);
            matchesByCode.set(
              matchingCode,
              existing
            );
          }
        }

        const matchedCodes =
          Array.from(matchesByCode.keys());

        if (matchedCodes.length === 1) {
          effectiveSearchCode = matchedCodes[0];

          keepaResponse = {
            ...fallbackResponse,
            products:
              matchesByCode.get(effectiveSearchCode) || [],
            tokensConsumed:
              firstTokensConsumed +
              Number(
                fallbackResponse?.tokensConsumed || 0
              ),
            processingTimeInMs:
              firstProcessingTime +
              Number(
                fallbackResponse?.processingTimeInMs || 0
              )
          };

          console.log(
            `✅ 10-DIGIT FALLBACK MATCH: ` +
            `${cleanCode} -> ${effectiveSearchCode} | ` +
            `products=${keepaResponse.products.length} | ` +
            `asins=${keepaResponse.products
              .map((p: any) => p?.asin)
              .filter(Boolean)
              .join(',')}`
          );
        } else {
          // Birden fazla farkli prefix gercek urune denk gelirse
          // veya Keepa sonucu hangi koda ait oldugunu dogrulayamiyorsak
          // yanlis urun secmek yerine NOT FOUND birak.
          keepaResponse = {
            ...fallbackResponse,
            products: [],
            tokensConsumed:
              firstTokensConsumed +
              Number(
                fallbackResponse?.tokensConsumed || 0
              ),
            processingTimeInMs:
              firstProcessingTime +
              Number(
                fallbackResponse?.processingTimeInMs || 0
              )
          };

          if (matchedCodes.length > 1) {
            console.warn(
              `⚠️ 10-DIGIT FALLBACK AMBIGUOUS: ` +
              `${cleanCode} | matched=${matchedCodes.join(',')}`
            );
          } else {
            console.warn(
              `❌ 10-DIGIT FALLBACK NO VERIFIED MATCH: ` +
              `${cleanCode} | returnedProducts=${fallbackProducts.length}`
            );
          }
        }
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
      searchCode: effectiveSearchCode,
      lookupType: effectiveLookupType,
      productCount: Array.isArray(products) ? products.length : 0,
      asins: Array.isArray(products)
        ? products.map((p: any) => p?.asin).filter(Boolean)
        : [],
      error: keepaResponse?.error || null
    });

    const bestProduct = pickBestKeepaProduct(products, effectiveSearchCode);

    if (!bestProduct) {
      console.warn(`PRODUCT NOT FOUND: ${cleanCode} (${codeInfo.type})`);

      // Negatif cache: ayni bulunamayan barkod 24 saat boyunca
      // tekrar Keepa tokeni tuketmesin.
      await productCache.saveNotFoundToCache(
        cacheIdentifier,
        effectiveIdentifierType
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Product not found. Please check the barcode and try again later.'
        } as ApiResponse,
        { status: 404 }
      );
    }

    // Ayni barkod birden fazla listing dondurebilir. Secilen urun filmse ve
    // ayni barkod adaylarindan herhangi biri acikca rental olarak isaretliyse
    // barkodun tamamini reddet. Bu, rental ghost listing vakalarini yakalar.
    const hasRentalCandidate =
      isPhysicalMovieProduct(bestProduct) &&
      Array.isArray(products) &&
      products.some((p: any) => isRentalMovie(p));

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
      // BOOKS: NEW fiyat olsa bile lowest USED ayrica pricingEngine'e gider
      bookUsedPrice: priceAnalysis.bookUsedPrice,
      // GAME pricingEngine için ayrı Keepa fiyatları
      gameNewPrice: priceAnalysis.gameNewPrice,
      gameUsedPrice: priceAnalysis.gameUsedPrice,
      gamePlatform: extractKeepaGamePlatform(bestProduct),
      // Keepa format bilgisi -> pricingEngine kategori filtresi icin
      binding: bestProduct.binding || '',
      type: bestProduct.type || ''
    };

    const mediaRestriction = hasRentalCandidate
      ? 'We do not accept rental-version DVDs/Blu-rays.'
      : detectMovieRestriction(bestProduct);

    const pricingResult: PricingResult = mediaRestriction
      ? {
        accepted: false,
        reason: mediaRestriction,
        category: 'dvds'
      }
      : calculateOurPrice(product);

    const mediaZoneTag = getMediaBarcodeZoneTag(
      cleanCode,
      pricingResult.category === 'dvds'
    );

    const message =
      pricingResult.accepted && pricingResult.ourPrice
        ? 'ACCEPTED'
        : pricingResult.reason &&
          pricingResult.reason !== 'DOES NOT MEET OUR PURCHASING CRITERIA'
          ? pricingResult.reason
          : 'DOES NOT MEET OUR PURCHASING CRITERIA';

    const totalTime = Date.now() - totalStartTime;

    const debugInfo = {
      searchMethod: 'keepa-single-product',
      lookupType: effectiveLookupType,
      cacheHit: false,
      movieRulesVersion: MOVIE_RULES_VERSION,
      priceAnalysis,
      timings: { totalTime }
    };

    // Cache yazmasi kullaniciyi bekletmez.
    // Next.js after() response dondükten sonra islemin tamamlanmasina izin verir.
    const cacheWriteStart = Date.now();

    after(async () => {
      try {
        await productCache.saveToCache(
          cacheIdentifier,
          effectiveIdentifierType,
          product,
          pricingResult,
          message,
          debugInfo
        );

        console.log(
          `${mediaZoneTag}💾 CACHE WRITE: ${cleanCode} | ` +
          `Price: $${product.price ?? 0} (${product.priceType || 'unknown'}) | ` +
          `${pricingResult.category === 'books'
            ? `BookUSED: $${product.bookUsedPrice ?? 0} | Rule: ${pricingResult.priceRange || 'N/A'} | `
            : ''}` +
          `${pricingResult.category === 'games'
            ? `Platform: ${product.gamePlatform || 'N/A'} | GameNEW: $${product.gameNewPrice ?? 0} | GameUSED: $${product.gameUsedPrice ?? 0} | Rule: ${pricingResult.priceRange || 'N/A'} | `
            : ''}` +
          `Rank: ${product.sales_rank ?? 0} | ` +
          `Category: ${product.category || 'Unknown'} | ` +
          `Status: ${pricingResult.accepted ? 'ACCEPTED' : 'REJECTED'} | ` +
          `Offer: ${pricingResult.accepted && pricingResult.ourPrice != null ? `$${pricingResult.ourPrice}` : 'N/A'} | ` +
          `${Date.now() - cacheWriteStart}ms`
        );
      } catch (err) {
        console.error('Cache save error:', err);
      }
    });

    const speedLabel = totalTime < 1000 ? 'ULTRA FAST' : totalTime < 2000 ? 'FAST' : 'NORMAL';
    console.log(`[${speedLabel}] ${totalTime}ms - Keepa lookup (${effectiveLookupType})`);

    console.log(
      `${mediaZoneTag}💰 KEEPA: ${cleanCode} | ` +
      `Price: $${priceAnalysis.price} (${priceAnalysis.bestCondition}) | ` +
      `${pricingResult.category === 'books'
        ? `BookUSED: $${product.bookUsedPrice ?? 0} | Rule: ${pricingResult.priceRange || 'N/A'} | `
        : ''}` +
      `${pricingResult.category === 'games'
        ? `Platform: ${product.gamePlatform || 'N/A'} | GameNEW: $${product.gameNewPrice ?? 0} | GameUSED: $${product.gameUsedPrice ?? 0} | Rule: ${pricingResult.priceRange || 'N/A'} | `
        : ''}` +
      `Rank: ${salesRank} | ` +
      `Category: ${category} | ` +
      `Binding: ${product.binding || 'N/A'} | ` +
      `Type: ${product.type || 'N/A'} | ` +
      `Status: ${pricingResult.accepted ? 'ACCEPTED' : 'REJECTED'} | ` +
      `Offer: ${pricingResult.accepted && pricingResult.ourPrice != null ? `$${pricingResult.ourPrice}` : 'N/A'}`
    );

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