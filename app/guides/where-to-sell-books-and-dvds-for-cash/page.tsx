import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "Where to Sell Used Books and DVDs for Cash (2026 Guide) | SellBookMedia",
  description:
    "Compare ways to sell used books, DVDs, CDs, Blu-rays, 4K movies, and video games for cash. Check an instant offer online with free shipping.",
};

const DIFFERENCES = [
  {
    title: "One box for multiple categories",
    body: "Books, CDs, DVDs, Blu-rays, 4K movies, and qualifying video games can be combined in the same order.",
  },
  {
    title: "Instant barcode offers",
    body: "Scan or enter the barcode and see whether that exact item qualifies for an offer before deciding what to send.",
  },
  {
    title: "Free shipping",
    body: "When you're ready to ship your order, we provide a prepaid shipping label.",
  },
  {
    title: "PayPal payment",
    body: "Qualifying items are paid through PayPal after your shipment is received and inspected.",
  },
];

const STEPS = [
  "Scan the barcode on a book, CD, DVD, Blu-ray, 4K movie, or game — no app required.",
  "See your offer instantly for qualifying items.",
  "Keep adding accepted items until your order reaches the checkout minimum.",
  "Use the prepaid shipping label we email you to send everything together.",
  "After your shipment is received and inspected, qualifying items are paid through PayPal.",
];

const NOT_ACCEPTED = [
  "Heavy writing or excessive highlighting",
  "Deep scratches that affect playback",
  "Water damage, mold, or heavy stains",
  "Missing pages, discs, or essential parts",
  "Strong smoke or mildew odors",
  "Ex-library or bootleg copies",
  "VHS tapes and cassette tapes",
];

const FAQ = [
  {
    q: "Do I need an account to check what my items are worth?",
    a: "No. You can scan or enter barcodes and check offers before creating an account.",
  },
  {
    q: "Is there a minimum number of items?",
    a: "No. The checkout requirement is based on the total value of your accepted offers, not a fixed number of items.",
  },
  {
    q: "Can I mix books, CDs, DVDs, and games in the same box?",
    a: "Yes. Qualifying books, CDs, DVDs, Blu-rays, 4K movies, and video games can be combined in the same order.",
  },
  {
    q: "What happens if an item doesn't meet the condition guidelines?",
    a: "Items are inspected after they arrive. Please review the condition guidelines before shipping so you know what types of wear and damage we can accept.",
  },
];

export default function WhereToSellGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Where to Sell Used Books and DVDs for Cash",
        datePublished: "2026-08-18",
        dateModified: "2026-08-29",
        author: {
          "@type": "Organization",
          name: "SellBookMedia",
        },
        publisher: {
          "@type": "Organization",
          name: "SellBookMedia",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===================== HEADER ===================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Selling guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Where to sell used books, DVDs, CDs, and games for cash
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            You can sell used media locally, list items yourself, or use
            a buyback service. The best option depends on how much work
            you want to do and what kinds of items you have.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span aria-hidden="true" className="text-white/30">/</span>
            <time dateTime="2026-08-29">Updated August 2026</time>
            <span aria-hidden="true" className="text-white/30">/</span>
            <span>5 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>

          {/* ===================== OPTIONS ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Pick your route
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Three common ways to sell used media
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              Each option has a different balance of convenience, time,
              and control over the sale.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Local shop
                </p>

                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">
                    Quick and in person
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">
                        Low
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">Best for</dt>
                      <dd className="font-medium text-slate-700">
                        Selling locally
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Marketplace
                </p>

                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">
                    Manage the sale yourself
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">
                        Higher, per item
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">Includes</dt>
                      <dd className="font-medium text-slate-700">
                        Listings, buyers, fees &amp; shipping
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white shadow-md">
                <p className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  SellBookMedia
                </p>

                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">
                    Scan, ship, get paid
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-dashed border-emerald-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">
                        Scan and ship together
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">Payment</dt>
                      <dd className="font-medium text-slate-700">
                        PayPal
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
              If you&apos;re selling individually, remember to factor in
              photos, listings, buyer messages, marketplace fees,
              promoted-listing costs, packing, shipping, and possible returns.
              A buyback service trades some of that control for a simpler
              one-box process.
            </p>
          </section>

          {/* ===================== EARLY CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Compare before you decide
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  See our offer for one item
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan a book, CD, DVD, Blu-ray, 4K movie, or game and
                  see what we&apos;ll pay. No app required and no account
                  needed just to check.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Check My Item

                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </Link>

                  <span className="text-sm text-slate-500">
                    Instant offer • Free shipping • PayPal payment
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== DIFFERENCES ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Why use SellBookMedia?
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A simpler way to clear out mixed media
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              SellBookMedia is built for people who have more than one
              kind of media sitting around and don&apos;t want to manage
              individual listings and buyers.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {DIFFERENCES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== HOW IT WORKS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Start to finish
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How selling to SellBookMedia works
            </h2>

            <ol className="mt-6 space-y-3">
              {STEPS.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="text-[16px] leading-relaxed text-slate-700">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* ===================== CONDITION ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you pack
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Normal signs of use are okay
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Items don&apos;t need to look brand new. Normal shelf wear,
              light case scuffs, and ordinary signs of use are generally
              fine. Items should be clean, complete, usable, and free from
              major damage.
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
              <p className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800">
                Please don&apos;t send
              </p>

              <ul className="grid gap-2 px-5 py-4 text-[15px] text-slate-700 sm:grid-cols-2">
                {NOT_ACCEPTED.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/condition-guidelines"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              See the full condition guidelines

              <svg
                className="ml-1.5 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </Link>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Selling books and used media online
            </h2>

            <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
              {FAQ.map((item) => (
                <div key={item.q} className="py-6">
                  <dt className="font-serif text-lg font-semibold text-slate-900">
                    {item.q}
                  </dt>

                  <dd className="mt-2 text-[16px] leading-[1.75] text-slate-600">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <RelatedGuides currentSlug="where-to-sell-books-and-dvds-for-cash" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Compare before you choose
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              See what we&apos;ll pay
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan one barcode and see your offer in seconds. No app
              required and no commitment to sell.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Check My Item

              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </Link>

            <div className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-blue-200">
              <span>Instant offers</span>
              <span aria-hidden="true">•</span>
              <span>Free shipping</span>
              <span aria-hidden="true">•</span>
              <span>PayPal payment</span>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}