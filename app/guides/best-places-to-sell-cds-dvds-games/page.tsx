import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title:
    "Best Places to Sell CDs, DVDs & Games for Cash | SellBookMedia",
  description:
    "Compare ways to sell used CDs, DVDs, Blu-rays, and video games for cash. Learn what affects offers, shipping, payment, and which option may fit you best.",
};

const COMPARISON = [
  {
    name: "SellBookMedia",
    takes: "Books, CDs, DVDs, Blu-rays, 4K & games",
    payment: "PayPal",
    note: "Scan a barcode and get an instant offer. No app required, with free shipping.",
    highlight: true,
  },
  {
    name: "Eagle Saver",
    takes: "Books, CDs, DVDs, Blu-rays, games",
    payment: "Check or PayPal",
    note: "Region 1 DVDs only. No textbooks or club editions.",
    highlight: false,
  },
  {
    name: "musicMagpie",
    takes: "CDs, DVDs, games, books",
    payment: "—",
    note: "Formerly ran Decluttr. Availability and buying options may vary.",
    highlight: false,
  },
  {
    name: "Bonavendi",
    takes: "Not a buyer — compares buyers",
    payment: "n/a",
    note: "Useful when you want to compare offers from multiple buyers.",
    highlight: false,
  },
  {
    name: "eBay / Marketplace",
    takes: "Most items you can list yourself",
    payment: "Varies",
    note: "Can work well for rare or collectible titles, but you handle listings, buyers, fees, and shipping.",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Is it worth selling common DVDs and CDs?",
    a: "It depends on the individual title. Demand and resale value vary widely, so the easiest way to know whether an item qualifies is to scan its barcode and check the offer.",
  },
  {
    q: "Do I need the original case?",
    a: "Media items should generally be complete and usable. Original cases and artwork are preferred when applicable. Review the condition guidelines before shipping your order.",
  },
  {
    q: "How fast do I get paid?",
    a: "Payment timing varies by service. SellBookMedia uses PayPal and processes qualifying orders after the shipment is received and inspected.",
  },
  {
    q: "Do I need an account just to check a price?",
    a: "No. With SellBookMedia, you can start scanning and checking offers without creating an account first.",
  },
];

const OFFER_FACTORS = [
  {
    title: "Current demand",
    text: "Titles people are actively buying may qualify for stronger offers.",
  },
  {
    title: "Resale value",
    text: "Current market value plays an important role in each offer.",
  },
  {
    title: "Sales activity",
    text: "Items with healthier sales activity are generally more attractive to buyback services.",
  },
  {
    title: "Format & condition",
    text: "Complete, usable items in accepted formats have the best chance of qualifying.",
  },
];

export default function BestPlacesGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline:
          "Best Places to Sell Used CDs, DVDs, and Video Games for Cash",
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
            Best places to sell used CDs, DVDs, and video games for cash
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Clearing out a shelf or an entire collection? Here&apos;s how
            the main selling options compare, what affects your offers,
            and what to consider before you choose where to sell.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>

            <span aria-hidden="true" className="text-white/30">
              /
            </span>

            <time dateTime="2026-08-29">Updated August 2026</time>

            <span aria-hidden="true" className="text-white/30">
              /
            </span>

            <span>5 min read</span>
          </div>
        </div>
      </header>

      {/* ===================== ARTICLE ===================== */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>

          {/* ===================== BUYBACK VS SELL YOURSELF ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The trade-off
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Buyback sites vs. selling items yourself
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-slate-700">
              <p>
              <strong className="text-slate-900">
  Selling individually
</strong>{" "}
on eBay or Facebook Marketplace can make sense for rare,
collectible, or especially valuable titles. The trade-off
is that you do more of the work yourself: taking photos,
creating listings, answering buyer messages, packing each
order, and shipping items one at a time. You may also need
to factor in marketplace selling fees, optional advertising
or promoted-listing costs, payment processing fees, and the
time or expense involved if a buyer requests a return or
refund.
              </p>

              <p>
                <strong className="text-slate-900">
                  Buyback services
                </strong>{" "}
                are designed for convenience. You scan your items, receive
                offers, combine qualifying products into one shipment, and
                avoid managing individual buyers.
              </p>

              <p>
                For many people, the right choice depends on what they value
                more: maximizing the price of a few special items or saving
                time while clearing out a larger collection.
              </p>
            </div>
          </section>

          {/* ===================== FIRST CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Compare for yourself
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  See our offer before you decide
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan one barcode and see what we&apos;ll pay. There&apos;s
                  no account required just to check an offer.
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
                  Free shipping • PayPal payment
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== OFFER FACTORS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What affects value
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Why one title may be worth more than another
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              There isn&apos;t one fixed price for used CDs, DVDs, Blu-rays,
              or games. Two items that look almost identical can have very
              different resale values depending on current demand and the
              exact edition.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {OFFER_FACTORS.map((factor) => (
                <div
                  key={factor.title}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">
                    {factor.title}
                  </h3>

                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    {factor.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border-l-4 border-blue-500 bg-blue-50/60 px-5 py-4">
              <p className="text-[16px] leading-relaxed text-slate-700">
                <strong className="text-slate-900">
                  The easiest way to know?
                </strong>{" "}
                Scan the barcode. Your offer is based on the specific item,
                not a generic category estimate.
              </p>
            </div>
          </section>

          {/* ===================== COMPARISON ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Side by side
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              The main selling options
            </h2>

            <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
              Different services work better for different types of
              collections. Here&apos;s a quick comparison of some common
              options.
            </p>

            <div className="mt-6 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-3 pr-4 font-semibold text-slate-900">
                      Service
                    </th>

                    <th className="py-3 pr-4 font-semibold text-slate-900">
                      What they take
                    </th>

                    <th className="py-3 pr-4 font-semibold text-slate-900">
                      Payment
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {COMPARISON.map((row) => (
                    <tr
                      key={row.name}
                      className={`border-b border-slate-200 align-top ${
                        row.highlight ? "bg-emerald-50/70" : ""
                      }`}
                    >
                      <td className="py-4 pr-4">
                        <span
                          className={`font-semibold ${
                            row.highlight
                              ? "text-emerald-800"
                              : "text-slate-900"
                          }`}
                        >
                          {row.name}
                        </span>

                        <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-slate-500">
                          {row.note}
                        </p>
                      </td>

                      <td className="py-4 pr-4 text-slate-700">
                        {row.takes}
                      </td>

                      <td className="py-4 pr-4 text-slate-700">
                        {row.payment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Service details can change. Check each company&apos;s current
              terms before shipping.
            </p>
            <section className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
    Is Bonavendi worth using?
  </h2>

  <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
    <p>
      Bonavendi is a comparison service rather than a direct buyer. It can be
      useful if you want to compare offers from multiple buyback companies
      before deciding where to sell your used books, CDs, DVDs, or games.
    </p>

    <p>
      If comparing several buyers feels like more work than you want,
      SellBookMedia offers a simpler option. You can check books, CDs, DVDs,
      Blu-rays, and games in one place, get an instant offer, and ship
      qualifying items together with free prepaid shipping.
    </p>
  </div>
</section>
          </section>

          {/* ===================== CHOOSE OPTION ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Pick your route
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Which option makes the most sense?
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
                <p className="font-semibold text-slate-900">
                  Clearing out a box of everyday titles?
                </p>

                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  A buyback service can save you the work of creating and
                  managing dozens of individual listings.
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-amber-500 bg-white px-5 py-4 shadow-sm">
                <p className="font-semibold text-slate-900">
                  Have a rare box set or collectible?
                </p>

                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  Check recent marketplace sales first. A collector may be
                  willing to pay more than a bulk buyer for an unusual or
                  highly desirable item.
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="font-semibold text-slate-900">
                  Mixed box of books, CDs, DVDs, and games?
                </p>

                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  A service that accepts multiple categories in one order
                  can keep you from splitting the collection across several
                  different buyers.
                </p>
              </div>
            </div>
          </section>

          {/* ===================== TRUST / HOW IT WORKS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Keep it simple
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What selling to SellBookMedia looks like
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <span className="text-sm font-bold text-blue-600">01</span>
                <h3 className="mt-2 font-semibold text-slate-900">
                  Scan the barcode
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Check your item without downloading an app.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <span className="text-sm font-bold text-blue-600">02</span>
                <h3 className="mt-2 font-semibold text-slate-900">
                  See your offer
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Accepted items are added to your bundle automatically.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <span className="text-sm font-bold text-blue-600">03</span>
                <h3 className="mt-2 font-semibold text-slate-900">
                  Ship your order
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  We provide a prepaid shipping label.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <span className="text-sm font-bold text-blue-600">04</span>
                <h3 className="mt-2 font-semibold text-slate-900">
                  Get paid
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Qualifying items are paid through PayPal after inspection.
                </p>
              </div>
            </div>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you sell
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Common questions
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

          <RelatedGuides currentSlug="best-places-to-sell-cds-dvds-games" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Takes only a few seconds
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              See our offer before you decide
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Have a CD, DVD, Blu-ray, book, or game nearby? Scan one
              barcode and see what we&apos;ll pay. No app required and no
              account needed just to check.
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
              <span>No app required</span>
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