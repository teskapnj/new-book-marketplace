// app/condition-guidelines/layout.tsx
import { Metadata } from 'next'

// ✅ CONDITION GUIDELINES METADATA
export const metadata: Metadata = {
  title: 'Condition Guidelines - What We Accept',
  description: 'Learn what condition we accept for books, CDs, DVDs, and video games. Detailed guidelines for acceptable items, damages we reject, and quality standards for selling your media.',
  
  keywords: [
    'book condition guidelines',
    'acceptable book condition',
    'DVD condition requirements',
    'CD condition standards',
    'game condition accepted',
    'what condition books sellbookmedia',
    'media condition guide',
  ],
  
  openGraph: {
    title: 'Item Condition Guidelines - What We Accept',
    description: 'Detailed condition requirements for books, CDs, DVDs, and games. Learn what we accept and reject.',
    url: 'https://www.sellbookmedia.com/condition-guidelines',
  },
  
  alternates: {
    canonical: 'https://www.sellbookmedia.com/condition-guidelines',
  },
  
  robots: {
    index: true,  // ✅ Google indexlesin (SEO değeri yüksek!)
    follow: true,
  },
}

// ✅ ARTICLE SCHEMA - Guide/Tutorial tipi içerik
const guideSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Condition Guidelines for Books, CDs, DVDs, and Games',
  description: 'Comprehensive guide on what condition we accept for media items. Learn about acceptable and unacceptable item conditions.',
  author: {
    '@type': 'Organization',
    name: 'SellBook Media',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SellBook Media',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.sellbookmedia.com/logo.png',
    },
  },
  datePublished: '2025-01-01',
  dateModified: new Date().toISOString().split('T')[0],
}

export default function ConditionGuidelinesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Article/Guide Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }}
      />
      
      {/* Page content */}
      {children}
    </>
  )
}