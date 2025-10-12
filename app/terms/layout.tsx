// app/terms/layout.tsx
import { Metadata } from 'next'

// ✅ TERMS OF SERVICE METADATA
export const metadata: Metadata = {
  title: 'Terms of Service - SellBook Media',
  description: 'Read our terms of service to understand the agreement between sellers and SellBook Media. Legal terms, conditions, and policies.',
  
  openGraph: {
    title: 'Terms of Service - SellBook Media',
    description: 'Terms and conditions for using SellBook Media',
    url: 'https://www.sellbookmedia.com/terms',
  },
  
  alternates: {
    canonical: 'https://www.sellbookmedia.com/terms',
  },
  
  robots: {
    index: true,  // ✅ Legal requirement, trust signal
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
  dateModified: new Date().toISOString().split('T')[0],
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