import type { Metadata } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'
const PAGE_URL = `${SITE_URL}/privacy-policy`

export const metadata: Metadata = {
  title: 'Privacy Policy | SellBookMedia',

  description:
    'Read the SellBookMedia Privacy Policy to learn how personal information related to site usage, orders, shipping, payments, and customer support is collected and handled.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'SellBookMedia',
    title: 'Privacy Policy | SellBookMedia',
    description:
      'Learn how SellBookMedia collects, uses, and handles personal information related to site usage and seller transactions.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | SellBookMedia',
    description:
      'Learn how SellBookMedia handles personal information related to site usage and seller transactions.',
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
  name: 'Privacy Policy',
  description: 'Privacy Policy for SellBookMedia.',
  isPartOf: {
    '@id': `${SITE_URL}/#website`,
  },
  about: {
    '@id': `${SITE_URL}/#organization`,
  },
}

export default function PrivacyPolicyLayout({
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