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
    default: 'Sell Books, CDs, DVDs & Games for Cash - Free Shipping | SellBook Media',
    template: '%s | SellBook Media'
  },
  description: 'Get instant cash for your used books, CDs, DVDs, and video games. Free shipping labels, fast payments, best prices guaranteed. America\'s #1 media buyback service.',
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
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>",
    shortcut: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>",
    apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>"
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
  alternates: {
    canonical: 'https://www.sellbookmedia.com',
  },
}

// JSON-LD Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.sellbookmedia.com/#organization',
      name: 'SellBook Media',
      url: 'https://www.sellbookmedia.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.sellbookmedia.com/logo.png',
        width: 512,
        height: 512
      },
      description: 'Buy used books, CDs, DVDs, and video games from customers nationwide',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        bestRating: '5',
        ratingCount: '500'
      }
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.sellbookmedia.com/#website',
      url: 'https://www.sellbookmedia.com',
      name: 'SellBook Media',
      publisher: {
        '@id': 'https://www.sellbookmedia.com/#organization'
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.sellbookmedia.com/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Service',
      name: 'Media Buyback Service',
      description: 'We buy used books, CDs, DVDs, and video games for cash with free shipping',
      provider: {
        '@id': 'https://www.sellbookmedia.com/#organization'
      },
      serviceType: 'Media Buyback',
      areaServed: {
        '@type': 'Country',
        name: 'United States'
      },
      offers: {
        '@type': 'Offer',
        description: 'Cash for used media with free shipping',
        availability: 'https://schema.org/InStock'
      }
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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