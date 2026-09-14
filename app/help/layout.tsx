import { Metadata } from 'next'

// ✅ HELP PAGE METADATA
export const metadata: Metadata = {
  title: 'Help Center - FAQ & Support',
  description: 'Find answers to common questions about selling books, CDs, DVDs, and games. Learn about shipping, condition guidelines, and payment by PayPal, Venmo, or check by mail.',

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
    description: 'Get answers to common questions about selling books, CDs, DVDs, and games, including shipping and payment options.',
    url: 'https://www.sellbookmedia.com/help',
  },

  alternates: {
    canonical: 'https://www.sellbookmedia.com/help',
  },

  robots: {
    index: true,
    follow: true,
  },
}

// ✅ FAQ SCHEMA
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I sell my books, CDs, DVDs, or games?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply scan or type the barcode from your items. You\'ll get an instant quote. If you accept, we\'ll send you a free prepaid shipping label within 24 hours. Pack your items and ship them for free. After your items arrive and pass inspection, payment is processed using the method you selected at checkout.',
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
        text: 'Prices vary based on the exact item, current demand, resale value, and condition. You\'ll receive an instant quote when you scan your item\'s barcode.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast do I get paid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Payment is processed within 2 business days after inspection using the method you selected at checkout. You can choose PayPal, Venmo, or check by mail. PayPal and Venmo payments are sent electronically, while paper checks are mailed to your shipping address. You\'ll receive email confirmation once payment is processed.',
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
        text: 'Items that do not meet our condition standards are not paid for and are handled according to our returns policy. Review the returns policy and condition guidelines before shipping.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does the entire process take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Timing depends on shipping and inspection. You\'ll receive your shipping label after your submission is reviewed, and payment is processed after your shipment arrives and accepted items pass inspection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I sell textbooks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We buy eligible textbooks in good condition. Scan your textbook\'s ISBN to see whether we are currently buying that exact edition and view the current offer.',
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
      {/* FAQ Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Page content */}
      {children}
    </>
  )
}
