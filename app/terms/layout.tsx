import { Metadata } from 'next'

// ✅ TERMS OF SERVICE METADATA
export const metadata: Metadata = {
  title: 'Terms of Service - SellBook Media',
  description: 'Read our terms of service covering seller responsibilities, item condition, shipping, payment methods, rejected items, and other policies for using SellBook Media.',

  openGraph: {
    title: 'Terms of Service - SellBook Media',
    description: 'Terms and conditions for using SellBook Media, including shipping, inspection, payment, and seller responsibilities.',
    url: 'https://www.sellbookmedia.com/terms',
  },

  alternates: {
    canonical: 'https://www.sellbookmedia.com/terms',
  },

  robots: {
    index: true,
    follow: true,
  },
}

// ✅ WEBPAGE SCHEMA
const termsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms of Service',
  description: 'Terms of service for SellBook Media',
  publisher: {
    '@type': 'Organization',
    name: 'SellBook Media',
  },
  datePublished: '2025-01-01',
  dateModified: '2026-09-14',
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Terms Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />

      {/* Page content */}
      {children}
    </>
  )
}
