import './globals.css'
import { CartProvider } from '../contexts/CartContext'
import { WishlistProvider } from '../contexts/WishlistContext'
import { AuthProvider } from '../contexts/AuthContext'
import { StoreProvider } from '@/lib/store'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'
const BRAND = 'SellBookMedia'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'Sell Books, CDs, DVDs & Games for Cash | SellBookMedia',

  description:
    'Sell books, CDs, DVDs, Blu-rays, 4K movies, and video games for cash. Get instant barcode offers, free prepaid shipping, and choose PayPal, Venmo, or check by mail.',

  applicationName: BRAND,

  authors: [{ name: BRAND }],
  creator: BRAND,
  publisher: BRAND,

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
    siteName: BRAND,
    title: 'Sell Books, CDs, DVDs & Games for Cash | SellBookMedia',
    description:
      'Turn books, CDs, DVDs, Blu-rays, 4K movies, and video games into cash with instant barcode offers and free prepaid shipping.',
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
      'Get instant offers for eligible books and physical media with free prepaid shipping.',
    images: ['/twitter-image.jpg'],
  },

  icons: {
    icon: '/favicon.ico',
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BRAND,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      description:
        'SellBookMedia is an online buyback service for books, CDs, DVDs, Blu-rays, 4K movies, and video games.',
      sameAs: ['https://www.facebook.com/sellbookmedia'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BRAND,
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Microsoft Advertising UET */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w, d, t, u, o) {
                w[u] = w[u] || [];
                o.ts = (new Date).getTime();

                var n = d.createElement(t);
                n.src = "https://bat.bing.net/bat.js?ti=" + o.ti + ("uetq" != u ? "&q=" + u : "");
                n.async = 1;

                n.onload = n.onreadystatechange = function() {
                  var s = this.readyState;
                  s && "loaded" !== s && "complete" !== s ||
                  (
                    o.q = w[u],
                    w[u] = new UET(o),
                    w[u].push("pageLoad"),
                    n.onload = n.onreadystatechange = null
                  );
                };

                var i = d.getElementsByTagName(t)[0];
                i.parentNode.insertBefore(n, i);
              })(window, document, "script", "uetq", {
                ti: "343271771",
                enableAutoSpaTracking: true
              });
            `,
          }}
        />

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