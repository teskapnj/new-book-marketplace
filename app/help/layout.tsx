// app/help/layout.tsx
import { Metadata } from 'next'

// ✅ HELP PAGE METADATA
export const metadata: Metadata = {
  title: 'Help Center - FAQ & Support',
  description: 'Find answers to common questions about selling books, CDs, DVDs, and games. Shipping, payment, condition guidelines, and more. Get help quickly with SellBook Media.',
  
  keywords: [
    'help selling books',
    'how to sell books online',
    'book selling faq',
    'sellbookmedia help',
    'media buyback questions',
    'shipping questions',
    'payment help',
  ],
  
  openGraph: {
    title: 'Help Center - Frequently Asked Questions',
    description: 'Get answers to all your questions about selling books, CDs, DVDs, and games.',
    url: 'https://www.sellbookmedia.com/help',
  },
  
  alternates: {
    canonical: 'https://www.sellbookmedia.com/help',
  },
  
  robots: {
    index: true,  // ✅ Google indexlesin (SEO değeri çok yüksek!)
    follow: true,
  },
}

// ✅ FAQ SCHEMA - Google Rich Snippets için!
// Bu sayede Google'da arama sonuçlarında kutucuklar çıkar!
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I sell my books, CDs, DVDs, or games?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply scan or type the barcode from your items. You\'ll get an instant quote. If you accept, we\'ll send you a free prepaid shipping label within 24 hours. Pack your items and ship them for free. Payment is processed within 2 business days after delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is shipping really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We provide free prepaid shipping labels for all accepted items. There are no hidden fees or shipping costs. You simply pack your items and drop them off at any USPS location.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much money can I get for my items?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prices start at $1.49 per item and vary based on condition and demand. You\'ll receive an instant quote when you scan your item\'s barcode. Our quotes are competitive and transparent with no hidden fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast do I get paid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Payment is processed within 2 business days after your items arrive at our facility. We pay directly to your PayPal account. You\'ll receive email confirmation once payment is sent.',
      },
    },
    {
      '@type': 'Question',
      name: 'What condition must my items be in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Items must be in good, usable condition. Books should have intact covers and readable pages. CDs, DVDs, and games should play without issues. Check our condition guidelines page for detailed requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my items are rejected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If items don\'t meet our condition standards, we\'ll notify you. You can choose to have them returned to you (shipping fees apply) or allow us to recycle them responsibly at no cost to you.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does the entire process take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'From creating your listing to receiving payment typically takes 5-10 business days, depending on shipping time. You\'ll receive your shipping label within 24 hours, and payment within 2 business days after delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I sell textbooks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We buy textbooks in good condition. College textbooks, especially current editions in high demand, often receive competitive quotes. Scan your textbook\'s ISBN to get an instant quote.',
      },
    },
  ],
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* FAQ Schema markup - Google Rich Snippets! */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Page content */}
      {children}
    </>
  )
}