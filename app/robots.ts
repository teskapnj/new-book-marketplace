import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/login',
          '/register',
          '/create-listing',  // ⭐ EKLE - Private tool!
          '/checkout/',
          '/cart/',
          '/account/',
          '/orders/',
          '/listings/',       // ⭐ EKLE - Individual listings (eğer varsa)
          // ❌ Query parameters kaldırıldı - SEO için riskli olabilir
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/dashboard/',
          '/login',
          '/register',
          '/create-listing',  // ⭐ EKLE
        ],
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://www.sellbookmedia.com/sitemap.xml',
  }
}