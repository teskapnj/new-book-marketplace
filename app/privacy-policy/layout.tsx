// app/privacy-policy/layout.tsx
import { Metadata } from 'next'

// ✅ PRIVACY POLICY METADATA
export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data',
  description: 'Read our privacy policy to learn how SellBook Media collects, uses, protects, and manages your personal information. GDPR and CCPA compliant.',
  
  openGraph: {
    title: 'Privacy Policy - SellBook Media',
    description: 'Learn how we protect your personal information',
    url: 'https://www.sellbookmedia.com/privacy-policy',
  },
  
  alternates: {
    canonical: 'https://www.sellbookmedia.com/privacy-policy',
  },
  
  robots: {
    index: true,  // ✅ Trust signal, legal requirement
    follow: true,
  },
}

// ✅ WEBPAGE SCHEMA
const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  description: 'Privacy policy for SellBook Media',
  publisher: {
    '@type': 'Organization',
    name: 'SellBook Media',
  },
  datePublished: '2025-01-01',
  dateModified: new Date().toISOString().split('T')[0],
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Privacy Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      
      {/* Page content */}
      {children}
    </>
  )
}