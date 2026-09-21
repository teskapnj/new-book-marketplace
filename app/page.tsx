import type { Metadata } from 'next'
import HomeClient from './HomeClient'

const SITE_URL = 'https://www.sellbookmedia.com'

export const metadata: Metadata = {
  title: 'Sell Books, CDs, DVDs & Games for Cash | SellBookMedia',

  description:
    'Sell books, CDs, DVDs, Blu-rays, 4K movies, and video games for cash. Scan a barcode for an instant offer, get free prepaid shipping, and choose PayPal, Venmo, or check by mail.',

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'SellBookMedia',
    title: 'Sell Books, CDs, DVDs & Games for Cash | SellBookMedia',
    description:
      'Get instant offers for eligible books and physical media with free prepaid shipping.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SellBookMedia - Sell Books and Physical Media for Cash',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sell Books, CDs, DVDs & Games for Cash | SellBookMedia',
    description:
      'Scan books and physical media for instant cash offers and free prepaid shipping.',
    images: ['/twitter-image.jpg'],
  },
}

export default function HomePage() {
  return <HomeClient />
}