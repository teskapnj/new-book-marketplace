import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ✅ HOMEPAGE - En yüksek priority
    {
      url: 'https://www.sellbookmedia.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // ✅ PRIMARY LANDING PAGE - Ana dönüşüm sayfası (SEO hedefli)
    {
      url: 'https://www.sellbookmedia.com/sell-books-and-dvds-for-cash',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },

    // ✅ HIGH VALUE PAGES - SEO için çok önemli
    {
      url: 'https://www.sellbookmedia.com/seller-guide',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.sellbookmedia.com/help',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.sellbookmedia.com/condition-guidelines',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // ✅ GUIDE PAGES - SEO içerik sayfaları
    {
      url: 'https://www.sellbookmedia.com/guides/where-to-sell-books-and-dvds-for-cash',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.sellbookmedia.com/guides/decluttr-shut-down-alternative',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.sellbookmedia.com/guides/best-places-to-sell-cds-dvds-games',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.sellbookmedia.com/guides/how-much-are-used-dvds-worth',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.sellbookmedia.com/guides/sell-video-games-for-cash',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.sellbookmedia.com/guides/how-much-are-used-books-worth',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ✅ SUPPORT & POLICY PAGES
    {
      url: 'https://www.sellbookmedia.com/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: 'https://www.sellbookmedia.com/returns-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: 'https://www.sellbookmedia.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://www.sellbookmedia.com/terms',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}