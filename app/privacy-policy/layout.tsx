import { Metadata } from 'next'

// ✅ PRIVACY POLICY METADATA
export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data',
  description: 'Read our privacy policy to learn how SellBook Media collects, uses, protects, and manages personal information related to accounts, shipping, payments, and site usage.',

  openGraph: {
    title: 'Privacy Policy - SellBook Media',
    description: 'Learn how SellBook Media collects, uses, protects, and manages personal information.',
    url: 'https://www.sellbookmedia.com/privacy-policy',
  },

  alternates: {
    canonical: 'https://www.sellbookmedia.com/privacy-policy',
  },

  robots: {
    index: true,
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
  dateModified: '2026-09-14',
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
