import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Main pages
    { url: SITE_URL },
    { url: `${SITE_URL}/sell-books-for-cash` },
    { url: `${SITE_URL}/sell-cds-for-cash` },
    { url: `${SITE_URL}/sell-dvds-for-cash` },
    { url: `${SITE_URL}/sell-video-games-for-cash` },

    // Guides hub
    { url: `${SITE_URL}/guides` },

    // Book guides
    { url: `${SITE_URL}/guides/how-much-are-used-books-worth` },
    { url: `${SITE_URL}/guides/how-to-find-book-value-by-isbn` },

    // CD guides
    { url: `${SITE_URL}/guides/how-much-are-used-cds-worth` },
    { url: `${SITE_URL}/guides/how-to-sell-a-cd-collection` },
    { url: `${SITE_URL}/guides/who-buys-cd-collections` },

    // DVD guides
    { url: `${SITE_URL}/guides/how-much-are-used-dvds-worth` },
    { url: `${SITE_URL}/guides/are-old-dvds-worth-anything` },
    { url: `${SITE_URL}/guides/who-buys-dvd-collections` },
    { url: `${SITE_URL}/guides/why-are-used-dvds-worth-so-little` },
    { url: `${SITE_URL}/guides/what-to-do-with-old-dvds-and-cds` },

    // Video game guide
    {
      url: `${SITE_URL}/guides/what-makes-used-video-games-valuable`,
    },

    // General selling/value guides
    {
      url: `${SITE_URL}/guides/where-to-sell-books-and-dvds-for-cash`,
    },
    {
      url: `${SITE_URL}/guides/best-places-to-sell-cds-dvds-games`,
    },
    { url: `${SITE_URL}/guides/media-value-by-barcode` },
    { url: `${SITE_URL}/guides/decluttr-shut-down-alternative` },

    // Help and trust pages
    { url: `${SITE_URL}/seller-guide` },
    { url: `${SITE_URL}/condition-guidelines` },
    { url: `${SITE_URL}/help` },
    { url: `${SITE_URL}/about` },
    { url: `${SITE_URL}/contact` },
    { url: `${SITE_URL}/returns-policy` },
    { url: `${SITE_URL}/privacy-policy` },
    { url: `${SITE_URL}/terms` },
  ]
}
