import Link from "next/link";
import type { Metadata } from "next";
import BarcodeNotFoundSearch from "@/components/BarcodeNotFoundSearch";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/barcode-not-found`;

export const metadata: Metadata = {
  title: "Barcode Not Found? Search for Your Item",
  description:
    "Barcode not found? Search SellBookMedia by title to find a book, DVD, Blu-ray, CD, or video game and check the item another way.",
  keywords: [
    "barcode not found",
    "item not found by barcode",
    "find item by title",
    "barcode lookup",
    "DVD barcode not found",
    "CD barcode not found",
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
    title: "Barcode Not Found? Search for Your Item",
    description:
      "Search SellBookMedia by title when a barcode cannot be found.",
    siteName: "SellBookMedia",
  },
  twitter: {
    card: "summary",
    title: "Barcode Not Found? Search for Your Item",
    description:
      "Search SellBookMedia by title when a barcode cannot be found.",
  },
};

export default function BarcodeNotFoundGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline: "Barcode Not Found? Search for Your Item",
        description:
          "Search SellBookMedia by title when a barcode cannot be found.",
        url: PAGE_URL,
        datePublished: "2026-09-30",
        dateModified: "2026-10-02",
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
            Search for your item by title instead.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <article>
          <section className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Quick answer
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Search by title
            </h2>

            <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
              If the main barcode cannot be found, enter the title below.
              We&apos;ll look for a relevant book, DVD, Blu-ray, 4K movie,
              CD, or video game. For better results, include the format,
              edition, or platform — for example: <strong>The Ringer DVD</strong>,{" "}
              <strong>Pink Floyd Dark Side of the Moon CD</strong>,{" "}
              <strong>Grand Theft Auto San Andreas PS2</strong>, or{" "}
              <strong>The Hobbit hardcover</strong>. If we can&apos;t find a
              relevant match, unfortunately we won&apos;t be able to make an
              offer for that item at this time.
            </p>
          </section>

          <BarcodeNotFoundSearch />

          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Important
            </p>

            <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
              Check the cover, title, format, and edition before continuing.
              If the result is not your exact item, search again using a more
              specific title, author, artist, or edition.
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Barcode help
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Not sure which barcode to scan?
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

          <section className="mt-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">
              Want to try the barcode again?
            </h2>

            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-blue-100">
              Return to SellBookMedia and enter or scan the main barcode.
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
