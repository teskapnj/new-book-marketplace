import type { Metadata } from 'next'

const PAGE_URL = 'https://www.sellbookmedia.com/help'

export const metadata: Metadata = {
  title: 'Help Center | Selling, Shipping & Payments | SellBookMedia',

  description:
    'Get answers about selling books, CDs, DVDs, Blu-rays, 4K movies, and video games, including barcode offers, shipping, inspections, payments, and orders.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'SellBookMedia',
    title: 'Help Center | SellBookMedia',
    description:
      'Answers about barcode offers, accepted items, prepaid shipping, inspections, payments, and selling to SellBookMedia.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Help Center | SellBookMedia',
    description:
      'Get help with selling, shipping, inspections, payments, and SellBookMedia orders.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}