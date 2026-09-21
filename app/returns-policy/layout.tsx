import type { Metadata } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'
const PAGE_URL = `${SITE_URL}/returns-policy`

export const metadata: Metadata = {
  title: 'Returns & Rejected Items Policy | SellBookMedia',

  description:
    'Learn what happens when submitted items do not meet SellBookMedia condition standards, how rejected items can be returned, and how accepted items are paid.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'SellBookMedia',
    title: 'Returns & Rejected Items Policy | SellBookMedia',
    description:
      'Learn how SellBookMedia handles rejected items, return shipping, inspections, and payment for accepted items.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Returns & Rejected Items Policy | SellBookMedia',
    description:
      'See what happens after inspection and how rejected items can be returned.',
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
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Returns & Rejected Items Policy',
      description:
        'SellBookMedia policy covering inspections, rejected items, return shipping, and payment for accepted items.',
      isPartOf: {
        '@id': `${SITE_URL}/#website`,
      },
      about: {
        '@id': `${SITE_URL}/#organization`,
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
          name: 'Returns Policy',
          item: PAGE_URL,
        },
      ],
    },
  ],
}

export default function ReturnsPolicyLayout({
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