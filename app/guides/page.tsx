import Link from 'next/link'
import type { Metadata } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'
const PAGE_URL = `${SITE_URL}/guides`

export const metadata: Metadata = {
  title: 'Selling Guides for Books, CDs, DVDs & Games | SellBookMedia',

  description:
    'Explore SellBookMedia guides about selling used books, CDs, DVDs, Blu-rays, video games, collections, barcode values, and physical media.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: 'SellBookMedia',
    title: 'Selling Guides | SellBookMedia',
    description:
      'Practical guides about selling books, CDs, DVDs, video games, and physical media.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Selling Guides | SellBookMedia',
    description:
      'Practical guides about selling books and physical media.',
  },
}

const guideSections = [
  {
    title: 'Books',
    description:
      'Learn how book value works, how ISBNs identify editions, and what can affect used book prices.',
    guides: [
      {
        title: 'How Much Are Used Books Worth?',
        description:
          'Understand what affects the resale value of used books.',
        href: '/guides/how-much-are-used-books-worth',
      },
      {
        title: 'How to Find a Book Value by ISBN',
        description:
          'Use the ISBN to identify the exact edition and research its value.',
        href: '/guides/how-to-find-book-value-by-isbn',
      },
      {
        title: 'Where to Sell Books & DVDs for Cash',
        description:
          'Compare practical options for selling books and physical media.',
        href: '/guides/where-to-sell-books-and-dvds-for-cash',
      },
    ],
  },

  {
    title: 'CDs',
    description:
      'Guides for checking CD value, selling collections, and understanding what buyers look for.',
    guides: [
      {
        title: 'How Much Are Used CDs Worth?',
        description:
          'Learn what can make one used CD worth more than another.',
        href: '/guides/how-much-are-used-cds-worth',
      },
      {
        title: 'How to Sell a CD Collection',
        description:
          'A practical process for sorting, valuing, and selling a CD collection.',
        href: '/guides/how-to-sell-a-cd-collection',
      },
      {
        title: 'Who Buys CD Collections?',
        description:
          'Compare buyback services, marketplaces, and other selling options.',
        href: '/guides/who-buys-cd-collections',
      },
    ],
  },

  {
    title: 'DVDs & Movies',
    description:
      'Learn why DVD values vary and how to decide whether older movies are worth selling.',
    guides: [
      {
        title: 'How Much Are Used DVDs Worth?',
        description:
          'See which factors influence the value of used DVDs.',
        href: '/guides/how-much-are-used-dvds-worth',
      },
      {
        title: 'Are Old DVDs Worth Anything?',
        description:
          'Learn why some older DVDs still have value while others do not.',
        href: '/guides/are-old-dvds-worth-anything',
      },
      {
        title: 'Who Buys DVD Collections?',
        description:
          'Compare options for selling a larger DVD collection.',
        href: '/guides/who-buys-dvd-collections',
      },
      {
        title: 'Why Are Used DVDs Worth So Little?',
        description:
          'Understand supply, demand, format popularity, and resale economics.',
        href: '/guides/why-are-used-dvds-worth-so-little',
      },
      {
        title: 'What to Do With Old DVDs & CDs',
        description:
          'Compare selling, donating, reusing, and recycling options.',
        href: '/guides/what-to-do-with-old-dvds-and-cds',
      },
    ],
  },

  {
    title: 'Selling & Value',
    description:
      'General guides for comparing buyers, checking barcodes, and choosing how to sell physical media.',
    guides: [
      {
        title: 'Best Places to Sell CDs, DVDs & Games',
        description:
          'Compare buyback services and selling marketplaces.',
        href: '/guides/best-places-to-sell-cds-dvds-games',
      },
      {
        title: 'Media Value by Barcode',
        description:
          'Learn how UPC and ISBN barcodes help identify the exact item.',
        href: '/guides/media-value-by-barcode',
      },
      {
        title: 'Decluttr Alternatives',
        description:
          'Explore other ways to sell used physical media.',
        href: '/guides/decluttr-shut-down-alternative',
      },
      {
        title: 'What Makes Used Video Games Valuable?',
        description:
          'Learn how platform, edition, demand, condition, completeness, and exact release can affect used game value.',
        href: '/guides/what-makes-used-video-games-valuable',
      },
    ],
  },
]

export default function GuidesPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${PAGE_URL}#collection`,
    url: PAGE_URL,
    name: 'SellBookMedia Selling Guides',
    description:
      'Guides about selling used books, CDs, DVDs, video games, and physical media.',
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-200 transition-colors hover:text-white"
          >
            ← Back to home
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            SellBookMedia Guides
          </p>

          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            Guides for selling books and physical media
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-blue-100 sm:text-xl">
            Learn how used media value works, how to check exact editions and
            barcodes, and how different selling options compare.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <section className="mb-14">
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/sell-books-for-cash"
              className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                Sell Books
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Get an instant book offer
              </h2>
              <p className="mt-2 leading-relaxed text-slate-600">
                Scan an ISBN and see whether the exact book currently qualifies.
              </p>
            </Link>

            <Link
              href="/sell-dvds-for-cash"
              className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                Sell Media
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Check DVDs, CDs and games
              </h2>
              <p className="mt-2 leading-relaxed text-slate-600">
                Use the barcode to check eligible physical media for a current
                offer.
              </p>
            </Link>
          </div>
        </section>

        <div className="space-y-16">
          {guideSections.map((section) => (
            <section key={section.title}>
              <div className="mb-7">
                <h2 className="font-serif text-3xl font-bold text-slate-900">
                  {section.title}
                </h2>

                <p className="mt-2 max-w-3xl text-[17px] leading-relaxed text-slate-600">
                  {section.description}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {section.guides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
                  >
                    <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                      {guide.title}
                    </h3>

                    <p className="mt-2 leading-relaxed text-slate-600">
                      {guide.description}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-blue-700">
                      Read guide →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 rounded-2xl bg-slate-900 px-6 py-8 text-center sm:px-10 sm:py-10">
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
            Ready to check your items?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-300">
            Scan the ISBN or UPC to see whether your book or physical media
            currently qualifies for an offer.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Check an item
          </Link>
        </section>
      </main>
    </div>
  )
}