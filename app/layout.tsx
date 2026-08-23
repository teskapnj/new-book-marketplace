import './globals.css'
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
  description: 'Sell your used books, CDs, DVDs, Blu-rays, 4K movies, and video games for cash. Get instant barcode offers, free prepaid shipping, and fast PayPal payments.',

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
    description: 'Turn your used books into cash with instant quotes, free prepaid shipping, and fast PayPal payments.',
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
      sameAs: [
        'https://www.facebook.com/sellbookmedia'
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.sellbookmedia.com/#website',
      url: 'https://www.sellbookmedia.com',
      name: 'SellBook Media',
      publisher: {
        '@id': 'https://www.sellbookmedia.com/#organization'
      },
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

        {/* Brave Browser Detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  if (window.location.pathname === '/browser-not-supported.html') {
                    return;
                  }

                  var ua = navigator.userAgent || '';

                  // Brave on iOS normally includes "Brave" in the User-Agent.
                  if (/Brave/i.test(ua)) {
                    window.location.replace('/browser-not-supported.html');
                    return;
                  }

                  // Brave detection for desktop / Android / supported environments.
                  if (
                    navigator.brave &&
                    typeof navigator.brave.isBrave === 'function'
                  ) {
                    navigator.brave
                      .isBrave()
                      .then(function (isBrave) {
                        if (isBrave) {
                          window.location.replace('/browser-not-supported.html');
                        }
                      })
                      .catch(function () {});
                  }
                } catch (e) {
                  // Never interfere with normal browsers if detection fails.
                }
              })();
            `,
          }}
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

      </head>

      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <StoreProvider>

                {children}

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