import './globals.css'
import { CartProvider } from '../contexts/CartContext'
import { WishlistProvider } from '../contexts/WishlistContext'
import { AuthProvider } from '../contexts/AuthContext'
import { StoreProvider } from '@/lib/store'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import type { Metadata } from 'next'

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://www.sellbookmedia.com'),
  title: {
    default: 'Sell Books, CDs, DVDs & Games for Cash - Free Shipping | SellBook Media',
    template: '%s | SellBook Media',
  },
  description:
    'Sell your used books, CDs, DVDs, Blu-rays, 4K movies, and video games for cash. Get instant barcode offers, free prepaid shipping, and fast PayPal payments.',

  // ❌ KEYWORDS KALDIRILDI - Google kullanmıyor (deprecated since 2009)
  // keywords: [...],

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
    description:
      'Turn your books, CDs, DVDs & games into cash. Free shipping, instant quotes, secure payments.',
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
    description:
      'Turn your used books into cash with instant quotes, free prepaid shipping, and fast PayPal payments.',
    images: ['/twitter-image.jpg'],
  },

  alternates: {
    canonical: 'https://www.sellbookmedia.com',
  },
}

// ✅ JSON-LD Structured Data
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
        height: 512,
      },
      description:
        'Buy used books, CDs, DVDs, and video games from customers nationwide',
      sameAs: ['https://www.facebook.com/sellbookmedia'],

      // ⚠️ ADDRESS - Eğer fiziksel ofis YOKSA kaldırın
      // address: {
      //   '@type': 'PostalAddress',
      //   addressCountry: 'US',
      // },

      // ⚠️ AGGREGATE RATING - Gerçek yorum verisi yoksa kullanmayın
      // aggregateRating: {
      //   '@type': 'AggregateRating',
      //   ratingValue: '4.8',
      //   bestRating: '5',
      //   ratingCount: '500',
      // },
    },

    {
      '@type': 'WebSite',
      '@id': 'https://www.sellbookmedia.com/#website',
      url: 'https://www.sellbookmedia.com',
      name: 'SellBook Media',
      publisher: {
        '@id': 'https://www.sellbookmedia.com/#organization',
      },

      // ⚠️ SEARCH ACTION - /search sayfanız yoksa kullanmayın
      // potentialAction: {
      //   '@type': 'SearchAction',
      //   target: {
      //     '@type': 'EntryPoint',
      //     urlTemplate:
      //       'https://www.sellbookmedia.com/search?q={search_term_string}',
      //   },
      //   'query-input': 'required name=search_term_string',
      // },
    },

    {
      '@type': 'Service',
      name: 'Media Buyback Service',
      description:
        'We buy used books, CDs, DVDs, and video games for cash with free shipping',
      provider: {
        '@id': 'https://www.sellbookmedia.com/#organization',
      },
      serviceType: 'Media Buyback',
      areaServed: {
        '@type': 'Country',
        name: 'United States',
      },
      offers: {
        '@type': 'Offer',
        description: 'Cash for used media with free shipping',
        availability: 'https://schema.org/InStock',
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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
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
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {
              if(f.fbq)return;
              n=f.fbq=function(){
                n.callMethod
                  ? n.callMethod.apply(n,arguments)
                  : n.queue.push(arguments)
              };

              if(!f._fbq)f._fbq=n;
              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];

              t=b.createElement(e);
              t.async=!0;
              t.src=v;

              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s);
            }(
              window,
              document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq('init', '925764013924035');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=925764013924035&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

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