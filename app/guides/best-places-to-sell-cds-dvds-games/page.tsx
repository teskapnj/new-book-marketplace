import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Places to Sell Used CDs, DVDs & Video Games for Cash (2026) | SellBookMedia",
  description:
    "Compare the best places to sell used CDs, DVDs, and video games for cash in 2026. See how buyback sites stack up on payouts, shipping, and payment speed.",
};

export default function BestPlacesGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Best Places to Sell Used CDs, DVDs, and Video Games for Cash
            </h1>
            <p className="text-lg text-gray-600">
              Got a stack of discs and games you'll never use again? Here's an honest look at your
              options for turning them into cash in 2026, how the main buyback sites compare, and
              what to watch out for before you ship.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Buyback sites vs. selling it yourself
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Selling individually</strong> on eBay or Facebook Marketplace can earn more
                per item for rare or collectible titles, but you handle photos, listings, buyer
                messages, fees, and shipping each sale one at a time. For a box of common discs, the
                effort rarely pays off.
              </p>
              <p>
                <strong>Buyback services</strong> flip that trade-off: you scan barcodes, get instant
                offers, and ship everything in one box with a free label. You earn less per rare item
                but save hours of work, which makes them the better choice for clearing out a
                collection of ordinary titles.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What common discs actually pay
            </h2>
            <p className="text-gray-700 mb-4">
              It helps to set expectations before you start. Based on current buyback market data,
              here's the rough range for common titles across the industry:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Common DVDs:</strong> often around $0.10&ndash;$0.65 each at most buyback sites</li>
                <li>• <strong>Common CDs:</strong> often around $0.10&ndash;$0.90 each</li>
                <li>• <strong>TV box sets, Blu-rays, rare titles:</strong> $2&ndash;$15+ depending on demand</li>
                <li>• <strong>Video games:</strong> vary widely by platform and title</li>
              </ul>
            </div>
            <p className="text-gray-700 mt-4">
              That low end is why per-item pricing matters so much. A site paying a dime per disc
              means a box of 50 might only be worth a few dollars. This is where SellBookMedia works
              differently: our offers start at $1.50 per item, so we simply don't take items we'd
              only value at pennies.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The main buyback options</h2>
            <div className="space-y-5">
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Eagle Saver</h3>
                <p className="text-gray-700 text-sm">
                  A long-running media buyback site that takes books, CDs, DVDs, Blu-rays, and games.
                  Worth knowing before you start: they only buy Region 1 (North American) DVDs, don't
                  buy textbooks or promotional/club editions, and require you to create an account to
                  get quotes. Payment is by check or PayPal.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">musicMagpie</h3>
                <p className="text-gray-700 text-sm">
                  The company that previously ran Decluttr. It offers the same scan-and-ship model for
                  CDs, DVDs, games, and books. Convenient, but reviews frequently note that the payout
                  per item is on the low side compared to the effort of gathering everything.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Comparison tools (Bonavendi)</h3>
                <p className="text-gray-700 text-sm">
                  Rather than a buyer itself, Bonavendi compares offers from several buyback vendors
                  at once, so you can see who pays most for a specific title. Useful for rare items
                  where the price gap between buyers is large.
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">eBay / Facebook Marketplace</h3>
                <p className="text-gray-700 text-sm">
                  Best for rare, collectible, or out-of-print titles where a specific buyer will pay a
                  premium. Expect to do the listing work yourself and factor in fees (eBay charges a
                  final value fee on most sales).
                </p>
              </div>
              <div className="border border-green-300 rounded-xl p-5 bg-green-50">
                <h3 className="font-semibold text-green-800 mb-2">SellBookMedia</h3>
                <p className="text-green-700 text-sm">
                  Scan-and-ship like the others, with a few differences: books, CDs, DVDs, and games
                  all go in one box, offers start at $1.50 per item, you can scan without creating an
                  account first, shipping is free once your bundle is approved, and payment goes to
                  PayPal within 2 business days of us receiving your items.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to choose the right option
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">→</span>
                <span>
                  <strong>Clearing a box of common titles fast?</strong> A buyback site that pays real
                  per-item offers and covers shipping is your best bet.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">→</span>
                <span>
                  <strong>Have a rare box set or collectible?</strong> Check eBay sold listings or a
                  comparison tool first &mdash; a single collector may pay far more than any bulk
                  buyer.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">→</span>
                <span>
                  <strong>Mixed box of books, CDs, DVDs, and games?</strong> Look for a service that
                  takes all four in one shipment so you're not splitting your collection across sites.
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common questions</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Is it worth selling common DVDs and CDs?</h3>
                <p className="text-gray-700 text-sm">
                  It depends on the buyer. At sites paying cents per disc, a small collection may not
                  be worth the effort. Services with per-item minimums like ours only accept titles
                  worth at least $1.50, so you're not shipping a box for pocket change.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Do I need the original case?</h3>
                <p className="text-gray-700 text-sm">
                  For most buyback sites, yes &mdash; items should be complete with their original
                  case and artwork, and discs should play without deep scratches. Check the specific
                  condition guidelines before shipping.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">How fast do I get paid?</h3>
                <p className="text-gray-700 text-sm">
                  It varies by service. Some pay by check, some by PayPal, and timing ranges from a
                  day to a week after your items are received and inspected. With SellBookMedia,
                  payment is sent via PayPal within 2 business days of us receiving your box.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">See what your collection is worth</h2>
            <p className="text-gray-600 mb-6">
              Scan your CDs, DVDs, and games for an instant offer &mdash; no account required to start.
            </p>
            <Link
              href="/create-listing"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Start Scanning
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}