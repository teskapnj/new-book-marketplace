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

    // ✅ HIGH VALUE PAGES - SEO için çok önemli
    {
      url: 'https://www.sellbookmedia.com/seller-guide',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9, // ⬆️ 0.6'dan 0.9'a yükseltildi!
    },
    {
      url: 'https://www.sellbookmedia.com/help',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8, // ⭐ YENİ! FAQ schema var
    },
    {
      url: 'https://www.sellbookmedia.com/condition-guidelines',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7, // ⬆️ 0.6'dan 0.7'ye yükseltildi
    },

    // ✅ SUPPORT & POLICY PAGES
    {
      url: 'https://www.sellbookmedia.com/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6, // ⬆️ 0.5'ten 0.6'ya yükseltildi
    },
    {
      url: 'https://www.sellbookmedia.com/returns-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6, // ⭐ YENİ!
    },
    {
      url: 'https://www.sellbookmedia.com/privacy-policy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3, // ⭐ YENİ!
    },
    {
      url: 'https://www.sellbookmedia.com/terms',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // ❌ REMOVED - Private pages (Google indexlememeli!)
    // {
    //   url: 'https://www.sellbookmedia.com/create-listing',
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
    // {
    //   url: 'https://www.sellbookmedia.com/login',
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
    // {
    //   url: 'https://www.sellbookmedia.com/register',
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.5,
    // },
  ]
}