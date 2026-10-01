

import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/how-to-read-a-barcode`;

export const metadata: Metadata = {
  title: "How to Read a Barcode on Books, DVDs, CDs & Games",
  description:
    "Learn where to find the barcode on books, DVDs, Blu-rays, CDs, and video games and how to enter the full barcode correctly.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: "How to Read a Barcode on Books, DVDs, CDs & Games",
    description:
      "Learn how to find and correctly enter barcodes on books, DVDs, CDs, and video games.",
    siteName: "SellBookMedia",
  },
};

const ITEMS = [
  {
    icon: "📚",
    label: "Books",
    title: "Find the ISBN barcode",
    description:
      "Look on the back cover of the book. Most modern books use an ISBN-13 barcode beginning with 978 or 979.",
    printed: "978 0 34554 962 4",
    entered: "9780345549624",
  },
  {
    icon: "📀",
    label: "DVD / Blu-ray / 4K",
    title: "Find the UPC on the case",
    description:
      "Look on the back of the original case or packaging. Enter the complete number, including a 0 at the beginning when shown.",
    printed: "0 43396 63091 8",
    entered: "043396630918",
  },
  {
    icon: "💿",
    label: "Music CDs",
    title: "Find the retail barcode",
    description:
      "The barcode is usually on the back insert, jewel case, or outer packaging.",
    printed: "0 75678 29762 5",
    entered: "075678297625",
  },
  {
    icon: "🎮",
    label: "Video Games",
    title: "Use the game case barcode",
    description:
      "Look on the original game case. Make sure you are scanning the product barcode, not a store price sticker.",
    printed: "7 11719 54102 8",
    entered: "711719541028",
  },
];

export default function HowToReadBarcodeGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline: "How to Read and Enter a Barcode",
        description:
          "Learn how to find and correctly enter barcodes on books, DVDs, Blu-rays, CDs, and video games.",
        url: PAGE_URL,
        datePublished: "2026-09-30",
        dateModified: "2026-09-30",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": PAGE_URL,
        },
        author: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "SellBookMedia",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
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
            name: "How to Read a Barcode",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-8 sm:px-8 sm:pb-14 sm:pt-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-200 transition hover:text-white"
          >
            ← Back to home
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Barcode help
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            How to Read and Enter a Barcode
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-blue-100 sm:text-xl">
            Find the barcode on your item and enter the full number into
            SellBookMedia.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <article>
          {/* QUICK RULE */}
          <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Quick rule
            </p>

            <p className="mt-2 text-[17px] leading-relaxed text-slate-700">
              Enter <strong>every digit</strong> printed under the barcode.
              Keep any 0 at the beginning. You do not need spaces or dashes.
            </p>
          </section>

          {/* FOUR CATEGORIES */}
          <section>
            <div className="grid gap-5 sm:grid-cols-2">
              {ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {item.label}
                      </p>

                      <h2 className="font-serif text-xl font-bold text-slate-900">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Printed under the barcode
                    </p>

                    <p className="mt-2 text-center font-mono text-sm font-semibold tracking-wider text-slate-800">
                      {item.printed}
                    </p>
                  </div>

                  <div className="py-2 text-center text-slate-400">↓</div>

                  <div className="rounded-xl border-2 border-blue-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Enter this number
                    </p>

                    <p className="mt-1 font-mono text-base font-bold tracking-wide text-slate-900">
                      {item.entered}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SCAN OR TYPE */}
          <section className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Scan it
              </p>

              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
                Using your camera?
              </h2>

              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-slate-600">
                <li>• Keep the entire barcode in view.</li>
                <li>• Use good lighting and avoid glare.</li>
                <li>• Hold the item still for a moment.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Type it
              </p>

              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
                Entering it manually?
              </h2>

              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-slate-600">
                <li>• Enter every digit shown below the barcode.</li>
                <li>• Keep any 0 at the beginning.</li>
                <li>• Spaces and dashes are not needed.</li>
              </ul>
            </div>
          </section>

          {/* NOT FOUND */}
          <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Still not found?
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Try another way to find your item
            </h2>

            <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
              If the barcode is correct but SellBookMedia cannot find the
              item, you can search for the exact product on Amazon and use its
              product ID instead.
            </p>

            <Link
              href="/guides/barcode-not-found"
              className="mt-5 inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
            >
              Item not found? Learn what to do
              <span className="ml-1.5">→</span>
            </Link>
          </section>

          {/* FINAL CTA */}
          <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">
              Ready to check your item?
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-blue-100">
              Scan or enter your barcode to see if SellBookMedia is currently
              buying your item.
            </p>

            <Link
              href="/#quote"
              className="mt-5 inline-flex items-center rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow-md transition hover:bg-blue-50"
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