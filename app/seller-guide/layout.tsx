import type { Metadata } from 'next'

const PAGE_URL = 'https://www.sellbookmedia.com/seller-guide'

export const metadata: Metadata = {
  title: 'How Selling Works | Seller Guide | SellBookMedia',

  description:
    'Learn how to sell books, CDs, DVDs, Blu-rays, 4K movies, and video games to SellBookMedia, from barcode scanning to free shipping and payment.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    title: 'How Selling Works | Seller Guide | SellBookMedia',
    description:
      'Learn how barcode offers, prepaid shipping, inspection, and payment work when selling books and physical media to SellBookMedia.',
    url: PAGE_URL,
    type: 'article',
    siteName: 'SellBookMedia',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'How Selling Works | Seller Guide | SellBookMedia',
    description:
      'Learn how barcode offers, free prepaid shipping, inspection, and payment work.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

const guideSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Sell Books, CDs, DVDs, Blu-rays, 4K Movies, and Video Games for Cash',
  description:
    'A step-by-step guide to checking eligible items, preparing them for shipment, and getting paid by SellBookMedia.',
  url: PAGE_URL,
  provider: {
    '@type': 'Organization',
    name: 'SellBookMedia',
    url: 'https://www.sellbookmedia.com',
  },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Check item condition',
      text: 'Review your books and physical media to make sure they meet SellBookMedia condition guidelines.',
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'Scan or enter the barcode',
      text: 'Scan the ISBN or UPC with your phone camera, or enter the barcode manually, to check whether the exact item qualifies for an offer.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'Add accepted items to your order',
      text: 'Add qualifying books, CDs, DVDs, Blu-rays, 4K movies, and video games to the same order until the minimum order value is reached.',
      position: 3,
    },
    {
      '@type': 'HowToStep',
      name: 'Enter shipping and payment details',
      text: 'Submit your contact, shipping, and selected payment information during checkout.',
      position: 4,
    },
    {
      '@type': 'HowToStep',
      name: 'Use the prepaid shipping label',
      text: 'Pack your accepted items securely and ship them using the prepaid shipping label provided for your order.',
      position: 5,
    },
    {
      '@type': 'HowToStep',
      name: 'Inspection and payment',
      text: 'After your shipment arrives, accepted items are inspected and payment is processed using your selected method: PayPal, Venmo, or check by mail.',
      position: 6,
    },
  ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(guideSchema),
        }}
      />

      {children}
    </>
  )
}