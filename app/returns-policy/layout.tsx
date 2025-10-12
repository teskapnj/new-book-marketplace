// app/returns-policy/layout.tsx
import { Metadata } from 'next'

// ✅ RETURNS POLICY METADATA
export const metadata: Metadata = {
  title: 'Returns Policy - What Happens If Items Are Rejected',
  description: 'Learn about our returns policy. What happens if your items don\'t meet our condition guidelines, how we handle rejected items, and our recycling process.',
  
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
    description: 'What happens if your items are rejected. Learn about our recycling process.',
    url: 'https://www.sellbookmedia.com/returns-policy',
  },
  
  alternates: {
    canonical: 'https://www.sellbookmedia.com/returns-policy',
  },
  
  robots: {
    index: true,  // ✅ Trust signal
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