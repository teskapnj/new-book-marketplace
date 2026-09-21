import type { Metadata } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'
const PAGE_URL = `${SITE_URL}/contact`

export const metadata: Metadata = {
  title: 'Contact SellBookMedia | Customer Support',

  description:
    'Contact SellBookMedia for help with orders, shipping, payments, barcode offers, or questions about selling books, CDs, DVDs, Blu-rays, 4K movies, and video games.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'SellBookMedia',
    title: 'Contact SellBookMedia | Customer Support',
    description:
      'Get help with SellBookMedia orders, shipping, payments, barcode offers, and selling questions.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Contact SellBookMedia | Customer Support',
    description:
      'Get help with orders, shipping, payments, barcode offers, and selling questions.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${PAGE_URL}#contactpage`,
      url: PAGE_URL,
      name: 'Contact SellBookMedia',
      description:
        'Customer support for SellBookMedia sellers and users.',
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
      about: {
        '@id': `${SITE_URL}/#organization`,
      },
      mainEntity: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'SellBookMedia',
        url: SITE_URL,
        email: 'support@sellbookmedia.com',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact',
          item: PAGE_URL,
        },
      ],
    },
  ],
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {children}
    </>
  )
}