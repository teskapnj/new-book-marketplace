import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // HOMEPAGE
    {
      url: "https://www.sellbookmedia.com",
      lastModified: new Date("2026-09-09"),
      changeFrequency: "daily",
      priority: 1.0,
    },

    // PRIMARY LANDING PAGES
    {
      url: "https://www.sellbookmedia.com/sell-books-for-cash",
      lastModified: new Date("2026-09-09"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: "https://www.sellbookmedia.com/sell-dvds-for-cash",
      lastModified: new Date("2026-09-09"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: "https://www.sellbookmedia.com/sell-cds-for-cash",
      lastModified: new Date("2026-09-09"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: "https://www.sellbookmedia.com/sell-video-games-for-cash",
      lastModified: new Date("2026-09-09"),
      changeFrequency: "weekly",
      priority: 0.95,
    },

    // HIGH VALUE PAGES
    {
      url: "https://www.sellbookmedia.com/seller-guide",
      lastModified: new Date("2026-09-19"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/help",
      lastModified: new Date("2026-08-29"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.sellbookmedia.com/condition-guidelines",
      lastModified: new Date("2026-09-19"),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // GUIDE PAGES
    {
      url: "https://www.sellbookmedia.com/guides/where-to-sell-books-and-dvds-for-cash",
      lastModified: new Date("2026-08-29"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/decluttr-shut-down-alternative",
      lastModified: new Date("2026-08-18"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/best-places-to-sell-cds-dvds-games",
      lastModified: new Date("2026-08-29"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/how-much-are-used-dvds-worth",
      lastModified: new Date("2026-08-18"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/who-buys-dvd-collections",
      lastModified: new Date("2026-09-19"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/why-are-used-dvds-worth-so-little",
      lastModified: new Date("2026-08-18"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/are-old-dvds-worth-anything",
      lastModified: new Date("2026-09-06"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/sell-video-games-for-cash",
      lastModified: new Date("2026-08-29"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/how-much-are-used-books-worth",
      lastModified: new Date("2026-09-03"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/how-to-find-book-value-by-isbn",
      lastModified: new Date("2026-09-06"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/what-to-do-with-old-dvds-and-cds",
      lastModified: new Date("2026-08-18"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/media-value-by-barcode",
      lastModified: new Date("2026-09-06"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/how-much-are-used-cds-worth",
      lastModified: new Date("2026-09-09"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/how-to-sell-a-cd-collection",
      lastModified: new Date("2026-09-08"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.sellbookmedia.com/guides/who-buys-cd-collections",
      lastModified: new Date("2026-09-19"),
      changeFrequency: "monthly",
      priority: 0.9,
    },

    // ABOUT
    {
      url: "https://www.sellbookmedia.com/about",
      lastModified: new Date("2026-09-09"),
      changeFrequency: "yearly",
      priority: 0.7,
    },

    // SUPPORT & POLICY PAGES
    {
      url: "https://www.sellbookmedia.com/contact",
      lastModified: new Date("2026-08-29"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://www.sellbookmedia.com/returns-policy",
      lastModified: new Date("2026-09-19"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: "https://www.sellbookmedia.com/privacy-policy",
      lastModified: new Date("2026-08-29"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://www.sellbookmedia.com/terms",
      lastModified: new Date("2026-09-19"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}