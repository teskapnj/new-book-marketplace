import './globals.css'
import AuthDebug from '@/components/AutoDebug'
import { CartProvider } from '../contexts/CartContext'
import { WishlistProvider } from '../contexts/WishlistContext'
import { AuthProvider } from '../contexts/AuthContext'
import { StoreProvider } from '@/lib/store'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://www.sellbookmedia.com'),
  title: {
    default: 'SellBook Media - Sell Your Books, CDs, DVDs & Games for Cash',
    template: '%s | SellBook Media'
  },
  description: 'Sell your used books, CDs, DVDs, and video games for instant cash. Free shipping, fast quotes, secure payments. Turn your media collection into money today!',
  keywords: [
    'sell books for cash',
    'sell used books',
    'sell CDs online',
    'sell DVDs',
    'sell video games',
    'cash for books',
    'textbook buyback',
    'used media buyback',
    'book resale',
    'instant book quote',
    'media buyback service',
    'used book buyers'
  ],
  authors: [{ name: 'SellBook Media' }],
  creator: 'SellBook Media',
  publisher: 'SellBook Media',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.sellbookmedia.com',
    title: 'SellBook Media - Sell Books, CDs, DVDs & Games for Cash',
    description: 'Turn your books, CDs, DVDs & games into cash. Free shipping, instant quotes, secure payments.',
    siteName: 'SellBook Media',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SellBook Media - Sell Your Media for Cash',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SellBook Media - Sell Your Books for Cash',
    description: 'Turn your books into cash! Free shipping & best prices guaranteed.',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.sellbookmedia.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - eğer kullanıyorsanız */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script> */}
      </head>
      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <StoreProvider>
                {children}
                <AuthDebug />
                <SpeedInsights />
                <Analytics />
              </StoreProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}