import Link from 'next/link'
import type { Metadata } from 'next'

const SITE_URL = 'https://www.sellbookmedia.com'
const PAGE_URL =
  `${SITE_URL}/guides/what-makes-used-video-games-valuable`

export const metadata: Metadata = {
  title: 'What Makes Used Video Games Valuable? | SellBookMedia',

  description:
    'Learn what can make a used video game valuable, including platform, edition, rarity, demand, condition, completeness, and the exact barcode or release.',

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    type: 'article',
    url: PAGE_URL,
    siteName: 'SellBookMedia',
    title: 'What Makes Used Video Games Valuable?',
    description:
      'Learn why some used and retro video games are worth more than others and what factors can affect resale value.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'What Makes Used Video Games Valuable?',
    description:
      'Platform, edition, demand, condition, completeness, and exact release can all affect used game value.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

const valueFactors = [
  {
    title: 'Exact title and release',
    text:
      'Two copies with the same game title may not be the same product. Different releases, regions, editions, packaging, and barcodes can have different resale markets.',
  },
  {
    title: 'Platform',
    text:
      'The PlayStation, Nintendo, Xbox, GameCube, or other platform version of a game may have very different demand from another version of the same title.',
  },
  {
    title: 'Supply and demand',
    text:
      'Games that are easy to find generally behave differently from titles that have fewer available copies or stronger collector demand.',
  },
  {
    title: 'Edition',
    text:
      'Collector editions, limited releases, special packaging, bundles, and certain re-releases may be valued differently from standard copies.',
  },
  {
    title: 'Condition',
    text:
      'Scratches, damaged labels, cracked cases, water damage, missing artwork, and other condition problems can reduce resale value or make an item unsuitable for some buyers.',
  },
  {
    title: 'Completeness',
    text:
      'Original cases, artwork, manuals, inserts, bonus discs, and other included materials may matter, especially for collectible games.',
  },
]

const faq = [
  {
    q: 'Are old video games always valuable?',
    a:
      'No. Age alone does not determine value. Some older games are common and inexpensive, while others may have stronger demand or lower supply.',
  },
  {
    q: 'Are retro games worth more than modern games?',
    a:
      'Not necessarily. Some retro titles can be valuable, but platform, title, release, condition, completeness, and current demand matter more than age alone.',
  },
  {
    q: 'Why does the barcode matter?',
    a:
      'The barcode can help identify the exact retail release. Different editions of the same game may have different packaging, contents, and resale values.',
  },
  {
    q: 'Does the original case matter?',
    a:
      'It can. For some titles, especially collectible releases, the original case, artwork, manual, inserts, or other components can affect desirability.',
  },
  {
    q: 'How can I check whether SellBookMedia is buying my game?',
    a:
      'Scan or enter the UPC from the exact game. If that release currently meets SellBookMedia buying criteria, you can see the current offer.',
  },
]

export default function VideoGameValueGuide() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${PAGE_URL}#article`,
        headline: 'What Makes Used Video Games Valuable?',
        description:
          'A guide to the factors that can affect used and retro video game value.',
        url: PAGE_URL,
        datePublished: '2026-09-21',
        dateModified: '2026-09-21',
        author: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'SellBookMedia',
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'SellBookMedia',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': PAGE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: `${SITE_URL}/guides`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'What Makes Used Video Games Valuable?',
            item: PAGE_URL,
          },
        ],
      },
    ],
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

        <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
          <Link
            href="/guides"
            className="inline-flex items-center text-sm font-medium text-blue-200 transition-colors hover:text-white"
          >
            ← Back to guides
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Video game value guide
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            What makes used video games valuable?
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-blue-100 sm:text-xl">
            Age is only one small part of the picture. The exact release,
            platform, demand, condition, edition, and completeness can all
            affect how a used game is valued.
          </p>

          <div className="mt-8 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span className="mx-2 text-white/30">/</span>
            <time dateTime="2026-09-21">Updated September 2026</time>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <article>
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The basic idea
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              The title alone does not tell you the value
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                A used video game can have several different versions. The same
                title may have been released on multiple consoles, in different
                editions, or with different packaging.
              </p>

              <p>
                That means searching only the game name can produce misleading
                results. A more useful comparison starts with the exact copy in
                your hand.
              </p>

              <p>
                The UPC or retail barcode is one of the easiest ways to identify
                that exact release.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Main factors
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              Six things that can affect used game value
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {valueFactors.map((factor) => (
                <div
                  key={factor.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {factor.title}
                  </h3>

                  <p className="mt-2 leading-relaxed text-slate-600">
                    {factor.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Exact editions
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              Why two copies of the same game can be worth different amounts
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Imagine two people both have the same game title. One has a
                standard release, while the other has a collector edition with
                different packaging and included materials.
              </p>

              <p>
                Even though the title is identical, they are not necessarily the
                same resale product. This is why edition details and the exact
                barcode can matter.
              </p>
            </div>
          </section>

          <section className="mb-12 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Quick check
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Check the exact barcode first
            </h2>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              If you want to know whether SellBookMedia is currently buying your
              exact game, scan or enter its UPC. The quote is tied to that
              specific product rather than only the game title.
            </p>

            <Link
              href="/sell-video-games-for-cash"
              className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Check a video game offer →
            </Link>
          </section>

          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Selling options
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              Buyback service or marketplace?
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                <div>Option</div>
                <div>Best fit</div>
                <div>Work involved</div>
              </div>

              <div className="grid grid-cols-3 border-b border-slate-200 px-4 py-4 text-sm leading-relaxed text-slate-700">
                <div className="font-semibold text-slate-900">
                  Buyback service
                </div>
                <div>
                  People who want a faster, simpler selling process
                </div>
                <div>
                  Scan, pack, and ship accepted items together
                </div>
              </div>

              <div className="grid grid-cols-3 px-4 py-4 text-sm leading-relaxed text-slate-700">
                <div className="font-semibold text-slate-900">
                  Marketplace
                </div>
                <div>
                  Rare or collectible items you want to list individually
                </div>
                <div>
                  Photos, listings, pricing, buyers, fees, and individual
                  shipments
                </div>
              </div>
            </div>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              Neither method is automatically right for every game. A common
              title may be better suited to a simple buyback process, while a
              rare collectible may justify the extra work of an individual
              marketplace listing.
            </p>
          </section>

          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Practical process
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              How to evaluate a used game
            </h2>

            <ol className="mt-6 space-y-4">
              <li className="rounded-xl border border-slate-200 bg-white p-5">
                <strong className="text-slate-900">
                  1. Identify the platform.
                </strong>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Confirm whether the game is for PlayStation, Nintendo, Xbox,
                  GameCube, or another system.
                </p>
              </li>

              <li className="rounded-xl border border-slate-200 bg-white p-5">
                <strong className="text-slate-900">
                  2. Find the exact UPC.
                </strong>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Use the barcode on the original retail case or packaging when
                  available.
                </p>
              </li>

              <li className="rounded-xl border border-slate-200 bg-white p-5">
                <strong className="text-slate-900">
                  3. Check the edition.
                </strong>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Look for collector, limited, greatest-hits, bundle, or other
                  edition differences.
                </p>
              </li>

              <li className="rounded-xl border border-slate-200 bg-white p-5">
                <strong className="text-slate-900">
                  4. Review condition and completeness.
                </strong>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Check the disc or cartridge, case, artwork, manuals, inserts,
                  and any included components.
                </p>
              </li>

              <li className="rounded-xl border border-slate-200 bg-white p-5">
                <strong className="text-slate-900">
                  5. Compare the exact product.
                </strong>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Avoid comparing your copy with a different platform or
                  edition.
                </p>
              </li>
            </ol>
          </section>

          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              FAQ
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              Common questions about used game value
            </h2>

            <div className="mt-6 space-y-4">
              {faq.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="font-bold text-slate-900">{item.q}</h3>

                  <p className="mt-2 leading-relaxed text-slate-600">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-slate-900 px-6 py-8 text-center sm:px-8 sm:py-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              Have games you want to check?
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-slate-300">
              Scan the barcode from the exact game to see whether it currently
              qualifies for a SellBookMedia offer.
            </p>

            <Link
              href="/sell-video-games-for-cash"
              className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Sell video games for cash
            </Link>
          </section>
        </article>
      </main>
    </div>
  )
}