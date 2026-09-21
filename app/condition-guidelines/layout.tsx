import type { Metadata } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'
const PAGE_URL = `${SITE_URL}/condition-guidelines`

export const metadata: Metadata = {
  title: 'Condition Guidelines for Books, CDs, DVDs & Games | SellBookMedia',

  description:
    'Review SellBookMedia condition requirements for books, CDs, DVDs, Blu-rays, 4K movies, and video games before shipping your order.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'SellBookMedia',
    title: 'Condition Guidelines | SellBookMedia',
    description:
      'See which condition issues can affect whether books, CDs, DVDs, Blu-rays, 4K movies, and video games are accepted.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Condition Guidelines | SellBookMedia',
    description:
      'Review condition requirements before shipping books and physical media to SellBookMedia.',
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
      name: 'Condition Guidelines for Books, CDs, DVDs & Games',
      description:
        'Condition requirements for books, CDs, DVDs, Blu-rays, 4K movies, and video games submitted to SellBookMedia.',
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
          name: 'Condition Guidelines',
          item: PAGE_URL,
        },
      ],
    },
  ],
}

export default function ConditionGuidelinesLayout({
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