import { Metadata } from 'next'

// ✅ RETURNS POLICY METADATA
export const metadata: Metadata = {
  title: 'Returns Policy - What Happens If Items Are Rejected',
  description: 'Learn about our returns policy, what happens if items do not meet our condition guidelines, how rejected items are handled, and when accepted items are processed for payment.',

  keywords: [
    'returns policy',
    'rejected items',
    'sellbookmedia returns',
    'what if items rejected',
    'return rejected books',
    'item recycling policy',
  ],

  openGraph: {
    title: 'Returns Policy - SellBook Media',
    description: 'Learn what happens after inspection, how rejected items are handled, and how accepted items move forward for payment.',
    url: 'https://www.sellbookmedia.com/returns-policy',
  },

  alternates: {
    canonical: 'https://www.sellbookmedia.com/returns-policy',
  },

  robots: {
    index: true,
    follow: true,
  },
}

// ✅ POLICY SCHEMA
const policySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Returns Policy',
  description: 'Returns and rejected items policy for SellBook Media',
  publisher: {
    '@type': 'Organization',
    name: 'SellBook Media',
  },
}

export default function ReturnsPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Policy Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(policySchema) }}
      />

      {/* Page content */}
      {children}
    </>
  )
}
