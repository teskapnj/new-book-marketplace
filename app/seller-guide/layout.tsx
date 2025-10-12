// app/seller-guide/layout.tsx
import { Metadata } from 'next'

// ✅ SELLER GUIDE METADATA
export const metadata: Metadata = {
  title: 'Seller Guide - How to Sell Books, CDs, DVDs & Games for Maximum Value',
  description: 'Complete guide to selling your used media. Tips for preparing items, maximizing value, packaging properly, and getting paid quickly. Learn the best practices for selling books, CDs, DVDs, and games.',
  
  keywords: [
    'how to sell books online',
    'selling books tips',
    'maximize book value',
    'prepare items for selling',
    'book selling guide',
    'DVD selling tips',
    'CD selling advice',
    'game selling guide',
  ],
  
  openGraph: {
    title: 'Complete Seller Guide - Maximize Your Earnings',
    description: 'Learn how to sell your books, CDs, DVDs, and games for maximum value. Expert tips and best practices.',
    url: 'https://www.sellbookmedia.com/seller-guide',
    type: 'article',
  },
  
  alternates: {
    canonical: 'https://www.sellbookmedia.com/seller-guide',
  },
  
  robots: {
    index: true,  // ✅ ÇOK YÜKSEK SEO değeri!
    follow: true,
  },
}

// ✅ HOWTO SCHEMA - Step-by-step guide
const guideSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Sell Books, CDs, DVDs, and Games for Cash',
  description: 'Complete guide to selling your used media items for maximum value',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Check Item Condition',
      text: 'Inspect your items carefully. Only items in very good condition with no writing, highlighting, or damage will be accepted.',
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'Clean Your Items',
      text: 'Wipe down cases and discs with a soft cloth. Make sure items are free of dust, fingerprints, and odors.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'Scan Barcodes',
      text: 'Use your phone camera or type the ISBN/UPC barcode to get instant quotes. Focus on items with higher values first.',
      position: 3,
    },
    {
      '@type': 'HowToStep',
      name: 'Package Properly',
      text: 'Use bubble wrap or padding for protection. Pack items snugly to prevent movement during shipping.',
      position: 4,
    },
    {
      '@type': 'HowToStep',
      name: 'Ship with Provided Label',
      text: 'Use the prepaid shipping label sent within 24 hours. Drop off at any USPS location.',
      position: 5,
    },
    {
      '@type': 'HowToStep',
      name: 'Get Paid',
      text: 'Receive payment within 2 business days after delivery via PayPal.',
      position: 6,
    },
  ],
  totalTime: 'PT30M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0',
  },
}

export default function SellerGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideSchema) }}
      />
      
      {/* Page content */}
      {children}
    </>
  )
}