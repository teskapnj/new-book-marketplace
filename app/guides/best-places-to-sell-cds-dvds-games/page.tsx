import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "Best Places to Sell Used CDs, DVDs & Video Games for Cash (2026) | SellBookMedia",
  description:
    "Compare the best places to sell used CDs, DVDs, and video games for cash in 2026. See how buyback sites stack up on payouts, shipping, and payment speed.",
};

// Rehber sayfalarinda kullanilan karsilastirma verisi.
// Sadece yazida iddia edilen bilgiler - emin olmadigimiz alanlar "—" birakildi.
const COMPARISON = [
  {
    name: "Eagle Saver",
    takes: "Books, CDs, DVDs, Blu-rays, games",
    account: "Required",
    payment: "Check or PayPal",
    note: "Region 1 DVDs only. No textbooks or club editions.",
    highlight: false,
  },
  {
    name: "musicMagpie",
    takes: "CDs, DVDs, games, books",
    account: "—",
    payment: "—",
    note: "Formerly ran Decluttr. Reviews often flag low per-item payouts.",
    highlight: false,
  },
  {
    name: "Bonavendi",
    takes: "Not a buyer — compares buyers",
    account: "Not required",
    payment: "n/a",
    note: "Useful for rare titles where offers vary a lot between buyers.",
    highlight: false,
  },
  {
    name: "eBay / Marketplace",
    takes: "Anything you can photograph",
    account: "Required",
    payment: "Varies",
    note: "Best price on rare titles, but you do the listing work and pay fees.",
    highlight: false,
  },
  {
    name: "SellBookMedia",
    takes: "Books, CDs, DVDs, games — one box",
    account: "Not required to scan",
    payment: "PayPal, 2 business days",
    note: "Instant quotes based on current demand and resale value. Free shipping once approved.",
    highlight: true,
  },
];

const FAQ = [
  {
    q: "Is it worth selling common DVDs and CDs?",
    a: "It depends on the buyer. At sites paying cents per disc, a small collection may not be worth the effort. Services like ours focus on titles that currently have enough demand and resale value to qualify for an offer.",
  },
  {
    q: "Do I need the original case?",
    a: "For most buyback sites, yes — items should be complete with their original case and artwork, and discs should play without deep scratches. Check the specific condition guidelines before shipping.",
  },
  {
    q: "How fast do I get paid?",
    a: "It varies by service. Some pay by check, some by PayPal, and timing ranges from a day to a week after your items are received and inspected. With SellBookMedia, payment is sent via PayPal within 2 business days of us receiving your box.",
  },
];

export default function BestPlacesGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Best Places to Sell Used CDs, DVDs, and Video Games for Cash",
        datePublished: "2026-08-18",
        dateModified: "2026-08-18",
        author: { "@type": "Organization", name: "SellBookMedia" },
        publisher: { "@type": "Organization", name: "SellBookMedia" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
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

      {/* ===================== BASLIK BANDI ===================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Buying guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Best places to sell used CDs, DVDs, and video games for cash
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Got a stack of discs and games you&rsquo;ll never use again? Here&rsquo;s an honest look
            at your options in 2026 — how the main buyback sites compare, and what to check before
            you ship anything.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <time dateTime="2026-08-18">Updated August 2026</time>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <span>5 min read</span>
          </div>
        </div>
      </header>

      {/* ===================== MAKALE ===================== */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ---------- Buyback vs kendin satmak ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The trade-off
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Buyback sites vs. selling it yourself
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-slate-700">
              <p>
                <strong className="text-slate-900">Selling individually</strong> on eBay or Facebook
                Marketplace can earn more per item for rare or collectible titles, but you handle
                photos, listings, buyer messages, fees, and shipping one sale at a time. For a box of
                common discs, the effort rarely pays off.
              </p>
              <p>
                <strong className="text-slate-900">Buyback services</strong> flip that trade-off: you
                scan barcodes, get instant offers, and ship everything in one box with a free label.
                You earn less per rare item but save hours of work, which makes them the better choice
                for clearing out a collection of ordinary titles.
              </p>
            </div>
          </section>

          {/* ---------- IMZA: fiyat farki ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Set your expectations
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What common discs actually pay
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Before you start sorting, it helps to know the real numbers. Based on current buyback
              market data, this is the rough range for common titles across the industry — and why
              the per-item floor matters more than any headline offer.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="space-y-7">
                {/* Tipik teklif */}
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium text-slate-600">
                      Typical offer, common DVD
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-500 tabular-nums">
                      $0.10&ndash;$0.65
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-slate-300" style={{ width: "12%" }} />
                  </div>
                </div>

                {/* Bizim taban */}
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium text-slate-900">
                      Our minimum, any accepted item
                    </span>
                    <span className="font-mono text-sm font-semibold text-emerald-700 tabular-nums">
                      VARIES
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-7 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-600">
                A site paying a dime per disc means a box of 50 might only be worth a few dollars.
                We focus on items that currently meet our purchasing criteria, so we simply don&rsquo;t accept
                items we&rsquo;d only value at pennies.
              </p>
            </div>

            <ul className="mt-6 grid gap-2 text-[15px] text-slate-700 sm:grid-cols-2">
              <li className="rounded-lg bg-white border border-slate-200 px-4 py-3">
                <span className="font-medium text-slate-900">Common CDs</span> — around
                $0.10&ndash;$0.90 each
              </li>
              <li className="rounded-lg bg-white border border-slate-200 px-4 py-3">
                <span className="font-medium text-slate-900">Box sets, Blu-rays, rare titles</span> —
                $2&ndash;$15+
              </li>
              <li className="rounded-lg bg-white border border-slate-200 px-4 py-3 sm:col-span-2">
                <span className="font-medium text-slate-900">Video games</span> — vary widely by
                platform and title
              </li>
            </ul>
          </section>

          {/* ---------- Karsilastirma tablosu ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Side by side
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              The main buyback options
            </h2>

            <div className="mt-6 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="py-3 pr-4 font-semibold text-slate-900">Service</th>
                    <th className="py-3 pr-4 font-semibold text-slate-900">What they take</th>
                    <th className="py-3 pr-4 font-semibold text-slate-900">Account to quote</th>
                    <th className="py-3 pr-4 font-semibold text-slate-900">Payment</th>
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
                            row.highlight ? "text-emerald-800" : "text-slate-900"
                          }`}
                        >
                          {row.name}
                        </span>
                        <p className="mt-1 max-w-[15rem] text-xs leading-relaxed text-slate-500">
                          {row.note}
                        </p>
                      </td>
                      <td className="py-4 pr-4 text-slate-700">{row.takes}</td>
                      <td className="py-4 pr-4 text-slate-700">{row.account}</td>
                      <td className="py-4 pr-4 text-slate-700">{row.payment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Details change — check each site&rsquo;s own terms before you ship.
            </p>
          </section>

          {/* ---------- Karar rehberi ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Pick your route
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How to choose the right option
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
                <p className="font-semibold text-slate-900">Clearing a box of common titles fast?</p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  A buyback site that pays real per-item offers and covers shipping is your best bet.
                </p>
              </div>
              <div className="rounded-xl border-l-4 border-amber-500 bg-white px-5 py-4 shadow-sm">
                <p className="font-semibold text-slate-900">Have a rare box set or collectible?</p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  Check eBay sold listings or a comparison tool first — a single collector may pay far
                  more than any bulk buyer.
                </p>
              </div>
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="font-semibold text-slate-900">
                  Mixed box of books, CDs, DVDs, and games?
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  Look for a service that takes all four in one shipment so you&rsquo;re not splitting
                  your collection across sites.
                </p>
              </div>
            </div>
          </section>

          {/* ---------- SSS ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you ship
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Common questions
            </h2>

            <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
              {FAQ.map((item) => (
                <div key={item.q} className="py-6">
                  <dt className="font-serif text-lg font-semibold text-slate-900">{item.q}</dt>
                  <dd className="mt-2 text-[16px] leading-[1.75] text-slate-600">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <RelatedGuides currentSlug="best-places-to-sell-cds-dvds-games" />

          {/* ---------- CTA ---------- */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              See what your collection is worth
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Scan a barcode and get an instant offer. No account needed to start, and shipping is
              free once your bundle is approved.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Start scanning
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}