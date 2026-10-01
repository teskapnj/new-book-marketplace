import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/barcode-not-found`;

export const metadata: Metadata = {
  title: "Barcode Not Found? Find Your Item Another Way",
  description:
    "Barcode not found? Learn how to find the exact book, DVD, CD, or video game on Amazon and check the item on SellBookMedia.",
  keywords: [
    "barcode not found",
    "item not found by barcode",
    "find item by barcode",
    "find exact item on Amazon",
    "barcode lookup",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: "Barcode Not Found? Find Your Item Another Way",
    description:
      "Learn what to do when a book, DVD, CD, or video game barcode cannot be found.",
    siteName: "SellBookMedia",
  },
  twitter: {
    card: "summary",
    title: "Barcode Not Found? Find Your Item Another Way",
    description:
      "Learn what to do when a barcode cannot be found.",
  },
};

export default function BarcodeNotFoundGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline: "Barcode Not Found? Find Your Item Another Way",
        description:
          "Learn what to do when a book, DVD, CD, or video game barcode cannot be found.",
        url: PAGE_URL,
        datePublished: "2026-09-30",
        dateModified: "2026-09-30",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": PAGE_URL,
        },
        author: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: `${SITE_URL}/guides`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Barcode Not Found",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* HERO */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="mx-auto max-w-3xl px-5 pb-12 pt-8 sm:px-8 sm:pb-14 sm:pt-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white"
          >
            ← Back to home
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Barcode help
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            Barcode Not Found?
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-blue-100 sm:text-xl">
            If your barcode is correct but we cannot find the item, you can
            still locate the exact product another way.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <article>
          {/* QUICK ANSWER */}
          <section className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Quick answer
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Find the exact product on Amazon
            </h2>

            <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
              Search for the item by its title, author, movie name, artist,
              game title, or other identifying information. Make sure you
              select the exact edition or product.
            </p>
          </section>

          {/* STEPS */}
          <section className="mt-8 space-y-5">
            {/* STEP 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  1
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    Find the exact item
                  </h2>

                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    Search Amazon using the title or other information printed
                    on the item. For books, check the author and edition. For
                    movies, CDs, and games, check the exact title and version.
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  2
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    Make sure it is the same product
                  </h2>

                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    Check the cover, format, edition, publisher, release
                    version, or other details. Different editions can have
                    different product identifiers.
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  3
                </div>

                <div className="w-full">
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    Find the product ID
                  </h2>

                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    Amazon gives each product a 10-character identifier called an{" "}
                    <strong>ASIN</strong>. You can find it on the Amazon
                    product page, usually in the Product Information section.
                  </p>

                  <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Example ASIN
                    </p>

                    <p className="mt-1 font-mono text-base font-bold tracking-wide text-slate-900">
                      B08N5KWB9H
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  4
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    Enter it in SellBookMedia
                  </h2>

                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    Copy the ASIN and enter it in the{" "}
                    <strong>SellBookMedia barcode field</strong>, then check
                    the item again.
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      SellBookMedia barcode field
                    </p>

                    <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
                      B08N5KWB9H
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* IMPORTANT */}
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Important
            </p>

            <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
              If the barcode is from a different edition, region, or product
              version, make sure you find the exact matching item before
              checking it again.
            </p>
          </section>

          {/* OTHER GUIDE */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Barcode help
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Not sure how to enter the barcode?
            </h2>

            <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
              Learn where to find the main barcode on books, DVDs, CDs, and
              video games.
            </p>

            <Link
              href="/guides/how-to-read-a-barcode"
              className="mt-4 inline-flex font-semibold text-blue-600 hover:text-blue-700"
            >
              How to read a barcode →
            </Link>
          </section>

          {/* CTA */}
          <section className="mt-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">
              Ready to check your item?
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-blue-100">
              Return to SellBookMedia and try your item again.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex items-center rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow-md hover:bg-blue-50"
            >
              Check My Item
              <span className="ml-2">→</span>
            </Link>
          </section>
        </article>
      </main>
    </div>
  );
}