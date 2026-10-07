import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getRecentAcceptedItems,
} from "@/lib/recentAcceptedItems";

const SITE_URL =
  "https://www.sellbookmedia.com";

const PAGE_URL =
  `${SITE_URL}/items-we-buy`;

export const revalidate = 900;

export const metadata: Metadata = {
  title:
    "Recently Accepted Items We Buy | SellBookMedia",
  description:
    "See recently accepted books, CDs, DVDs, Blu-rays and video games at SellBookMedia. Check your barcode or ISBN to see what we may buy for cash.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title:
      "Recently Accepted Items We Buy | SellBookMedia",
    description:
      "Browse recent examples of books, CDs, DVDs, Blu-rays and video games accepted by SellBookMedia.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "website",
  },
};

const CATEGORY_INFO = {
  books: {
    label: "Book",
    icon: "📚",
    codeLabel: "ISBN",
  },
  cds: {
    label: "CD",
    icon: "💿",
    codeLabel: "UPC / EAN",
  },
  dvds: {
    label: "DVD / Blu-ray / 4K",
    icon: "📀",
    codeLabel: "UPC / EAN",
  },
  games: {
    label: "Video Game",
    icon: "🎮",
    codeLabel: "UPC / EAN",
  },
} as const;

export default async function ItemsWeBuyPage() {
  const items =
    await getRecentAcceptedItems();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      "Recently Accepted Items at SellBookMedia",
    numberOfItems: items.length,
    itemListElement: items.map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: item.title,
          identifier: item.code,
        },
      })
    ),
  };

  const safeJsonLd =
    JSON.stringify(jsonLd).replace(
      /</g,
      "\\u003c"
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd,
        }}
      />

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Link
            href="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-3xl"
          >
            SellBookMedia
          </Link>

          <Link
            href="/#quote"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-blue-800 sm:px-6 sm:text-base"
          >
            Check Your Item
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-12 text-white sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
          <div className="absolute inset-0 bg-black/15" />

          <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
              RECENT EXAMPLES
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Recently Accepted Items We Buy
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-blue-100 sm:text-xl">
              See books, CDs, DVDs,
              Blu-rays, 4K movies and video
              games that recently met our
              buying criteria. Scan your
              exact barcode or ISBN to see
              whether we are currently
              buying your item.
            </p>

            <Link
              href="/#quote"
              className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 px-7 py-3.5 font-bold text-white shadow-xl hover:-translate-y-0.5"
            >
              Check My Item →
            </Link>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                What kinds of media do we buy?
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                SellBookMedia buys eligible
                physical media including used
                books, CDs, DVDs, Blu-rays,
                4K movies and video games.
                If you want to sell DVDs
                online, sell DVDs for cash,
                sell CDs, or sell books and
                DVDs together, scan the
                barcode from the exact item
                you own.
              </p>

              <p className="mt-3 leading-7 text-gray-600">
                The products below are recent
                examples only. Acceptance and
                offer amounts can change based
                on the exact edition, demand,
                availability, market data and
                condition.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Recently Accepted
                </h2>

                <p className="mt-2 text-gray-600">
                  Recent examples from our
                  barcode and ISBN checker.
                </p>
              </div>

              <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                Updated automatically
              </span>
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {items.map((item) => {
                  const info =
                    CATEGORY_INFO[
                      item.category
                    ];

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 sm:h-56">
                        <span className="absolute left-2 top-2 z-10 rounded-full border border-green-200 bg-green-50 px-2 py-1 text-[9px] font-bold text-green-700 sm:text-[11px]">
                          ✓ ACCEPTED
                        </span>

                        <span className="absolute right-2 top-2 z-10 rounded-full border border-gray-200 bg-white px-2 py-1 text-[9px] font-semibold text-gray-600 sm:text-[11px]">
                          {info.label}
                        </span>

                        {item.image ? (
                          <div className="relative h-[135px] w-[105px] sm:h-[180px] sm:w-[140px]">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 105px, 140px"
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <span
                            className="text-6xl"
                            aria-hidden="true"
                          >
                            {info.icon}
                          </span>
                        )}
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="min-h-[44px] text-sm font-bold leading-5 text-gray-900 sm:text-base">
                          {item.title}
                        </h3>

                        <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {info.codeLabel}
                        </div>

                        <div className="mt-1 break-all font-mono text-xs text-gray-700 sm:text-sm">
                          {item.code}
                        </div>

                        <div className="mt-3 border-t border-gray-100 pt-3 text-[11px] text-gray-500">
                          Recently accepted
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
                Recently accepted items will
                appear here as eligible
                products are checked.
              </div>
            )}

            <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
              <strong>Important:</strong>{" "}
              These products are examples
              only. Eligibility and offer
              amounts may change. Always scan
              your exact barcode or ISBN for
              the current result.
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl sm:p-9">
              <h2 className="text-3xl font-bold">
                Sell Your Used Media
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/sell-books-for-cash"
                  className="rounded-xl border border-slate-700 bg-slate-800 p-4 font-semibold hover:bg-slate-700"
                >
                  Sell Books for Cash
                </Link>

                <Link
                  href="/sell-cds-for-cash"
                  className="rounded-xl border border-slate-700 bg-slate-800 p-4 font-semibold hover:bg-slate-700"
                >
                  Sell CDs for Cash
                </Link>

                <Link
                  href="/sell-dvds-for-cash"
                  className="rounded-xl border border-slate-700 bg-slate-800 p-4 font-semibold hover:bg-slate-700"
                >
                  Sell DVDs for Cash
                </Link>

                <Link
                  href="/sell-video-games-for-cash"
                  className="rounded-xl border border-slate-700 bg-slate-800 p-4 font-semibold hover:bg-slate-700"
                >
                  Sell Video Games
                </Link>
              </div>

              <Link
                href="/seller-guide"
                className="mt-6 inline-block font-semibold text-blue-300 hover:text-blue-200"
              >
                Read the Seller Guide →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
