import type { Metadata } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'
const PAGE_URL = `${SITE_URL}/terms`

export const metadata: Metadata = {
  title: 'Terms of Service | SellBookMedia',

  description:
    'Read the SellBookMedia Terms of Service covering seller responsibilities, item condition, shipping, inspections, payments, rejected items, and use of the website.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'SellBookMedia',
    title: 'Terms of Service | SellBookMedia',
    description:
      'Terms governing the use of SellBookMedia, including shipping, inspections, payments, rejected items, and seller responsibilities.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | SellBookMedia',
    description:
      'Read the terms governing selling, shipping, inspections, payments, and use of SellBookMedia.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: 'Terms of Service',
  description: 'Terms of Service for SellBookMedia.',
  isPartOf: {
    '@id': `${SITE_URL}/#website`,
  },
  about: {
    '@id': `${SITE_URL}/#organization`,
  },
}

export default function TermsLayout({
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