import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decluttr Shut Down: Where to Sell Your Books, CDs, DVDs & Games Now | SellBookMedia",
  description:
    "Decluttr closed in June 2025 with no warning. Here's what happened and where sellers can go instead to sell used books, CDs, DVDs, and video games for cash.",
};

export default function DecluttrAlternativeGuide() {
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
              Decluttr Shut Down &mdash; Where to Sell Your Books, CDs, DVDs, and Games Now
            </h1>
            <p className="text-lg text-gray-600">
              If you used to send your old media to Decluttr, you probably already know it closed
              abruptly in mid-2025. Here's a quick recap of what happened, and a straightforward
              option for selling your books, CDs, DVDs, and games now that it's gone.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What happened to Decluttr?</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                In June 2025, Decluttr emailed customers that it was closing immediately, citing
                only general "business reasons." There was no advance notice and no transition
                period. The company, which had been buying back books, CDs, DVDs, games, and tech
                since 2013, simply stopped accepting new trade-ins.
              </p>
              <p>
                Decluttr had been owned by musicMagpie, a UK company that was itself acquired by
                AO World in late 2024. In the months leading up to the shutdown, many sellers had
                already reported slower payouts and declining customer service, so the closure
                wasn't entirely without warning signs &mdash; it just came faster than most
                expected.
              </p>
              <p>
                As of now, there's no indication Decluttr is reopening or rebranding. If you have
                an old order still pending with them, your best bet is to check their site directly
                for any support contact information &mdash; but for anything new, you'll need a
                different place to sell.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What to look for in a Decluttr alternative
            </h2>
            <p className="text-gray-700 mb-4">
              Not every buyback site works the same way. If you're used to Decluttr's scan-and-ship
              model, here's what matters most when picking where to go next:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Covers the same categories</strong> &mdash; books, CDs, DVDs, and games in
                  one box, not split across different services.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Real per-item offers</strong>, not a cents-based bulk rate that barely
                  covers your time.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Free shipping label</strong>, so you're not paying out of pocket to send
                  your box.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Clear condition guidelines up front</strong>, so there are no surprises
                  when your items are inspected.
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How SellBookMedia compares
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-800 mb-4">
                SellBookMedia works the same way you're used to &mdash; scan a barcode, get an
                instant offer, ship a box &mdash; with a few differences sellers coming from
                Decluttr tend to appreciate:
              </p>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Offers start at $1.50 per item, not fractions of a cent</li>
                <li>• Books, CDs, DVDs, and games are all accepted in the same bundle</li>
                <li>• You can scan and build your box without creating an account first</li>
                <li>• Free shipping label once your bundle is approved</li>
                <li>• Payment via PayPal within 2 business days of us receiving your items</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Scan the barcode on each item with your phone's camera &mdash; no account needed to start.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>See your cash offer instantly for each item.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>Once you have at least 5 items, log in or sign up to continue.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>Ship your box with the free label we email you once your bundle is approved.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  5
                </span>
                <span>Get paid via PayPal within 2 business days of us receiving your items.</span>
              </li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common questions</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Is Decluttr coming back?</h3>
                <p className="text-gray-700 text-sm">
                  There's no public indication of a relaunch or rebrand. The company's own
                  communications describe the closure as final.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  What about my order that was already in progress with Decluttr?
                </h3>
                <p className="text-gray-700 text-sm">
                  Check Decluttr's website directly for any current support information regarding
                  pending orders. We're not affiliated with Decluttr and can't access or resolve
                  existing orders on your behalf.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Do you accept the same items Decluttr did?
                </h3>
                <p className="text-gray-700 text-sm">
                  We focus on books, CDs, DVDs, and video games. We don't currently buy back phones,
                  tablets, or other tech &mdash; if that's mainly what you sold on Decluttr, our
                  media categories are still worth checking, but you may need a separate service for
                  electronics.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Ready to turn your collection into cash?
            </h2>
            <p className="text-gray-600 mb-6">
              Scan your first barcode and get an instant offer &mdash; no account required to start.
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