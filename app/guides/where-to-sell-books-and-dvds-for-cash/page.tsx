import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where to Sell Used Books and DVDs for Cash (2026 Guide) | SellBookMedia",
  description:
    "Looking for where to sell used books, DVDs, CDs, and video games for cash? Compare your options and see how SellBookMedia pays $1.50+ per item with free shipping.",
};

export default function WhereToSellGuide() {
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
              Where to Sell Used Books and DVDs for Cash
            </h1>
            <p className="text-lg text-gray-600">
              If you've got a box of books, DVDs, CDs, or video games gathering dust, you have more
              options than you might think. Here's a straightforward look at where to sell them for
              cash, and why more people are choosing to scan and ship with SellBookMedia instead of
              driving to a used bookstore or negotiating a garage sale price.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your main options</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Local used bookstores or pawn shops</strong> will take some items, but offers
                are usually made in person, item by item, and can vary a lot depending on who's behind
                the counter that day.
              </p>
              <p>
                <strong>Marketplace apps</strong> (Facebook Marketplace, eBay) can get you more per
                item, but you're doing all the work: photos, listings, buyer messages, and shipping
                each sale individually.
              </p>
              <p>
                <strong>Buyback services</strong> like SellBookMedia let you scan a barcode, get an
                instant cash offer, and ship a whole box at once with a free label &mdash; no listings,
                no back-and-forth with buyers.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What makes SellBookMedia different
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-semibold text-green-800 mb-2">One platform, four categories</h3>
                <p className="text-green-700 text-sm">
                  Most buyback sites only take books. We accept books, CDs, DVDs, and video games in
                  the same box &mdash; no need to sort items across different services.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-semibold text-green-800 mb-2">Real cash, not cents</h3>
                <p className="text-green-700 text-sm">
                  Our offers start at $1.50 per item. We don't run a cents-per-item model like some
                  bulk buyback sites do.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-semibold text-green-800 mb-2">Free shipping label</h3>
                <p className="text-green-700 text-sm">
                  Once your bundle is submitted, we email you a free shipping label &mdash; no cost to
                  send your box.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-semibold text-green-800 mb-2">Fast payment</h3>
                <p className="text-green-700 text-sm">
                  Once we receive and inspect your items, payment is sent to your PayPal within 2
                  business days.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Scan the barcode on each book, CD, DVD, or game using your phone's camera &mdash; no
                  account needed to start.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>See your cash offer for each item instantly, based on current market value.</span>
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
                <span>Print your free shipping label and send your box.</span>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What condition do your items need to be in?
            </h2>
            <p className="text-gray-700 mb-4">
              We accept items in <strong>very good condition</strong>: fully functional, clean, and
              complete with their original case, cover art, and inserts. Minor surface wear is fine,
              and case condition isn't a dealbreaker &mdash; we focus on the disc or book itself.
            </p>
            <p className="text-gray-700 mb-4">
              We can't accept items with writing or highlighting, deep scratches that affect playback,
              water damage, missing cases or inserts, strong odors, or ex-library and bootleg copies.
              VHS tapes and cassette tapes aren't currently supported.
            </p>
            <Link
              href="/condition-guidelines"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              See the full condition guidelines →
            </Link>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common questions</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Do I need an account to check my items' value?
                </h3>
                <p className="text-gray-700 text-sm">
                  No. You can scan and add items without creating an account. You'll only need to log
                  in or sign up once you're ready to ship your box.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Is there a minimum number of items?
                </h3>
                <p className="text-gray-700 text-sm">
                  Yes, we require a minimum of 5 items per bundle so that a single shipping label
                  covers the cost of shipping and processing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  What happens if an item doesn't meet the condition guidelines?
                </h3>
                <p className="text-gray-700 text-sm">
                  Items that don't meet our very good condition standard are recycled rather than
                  returned, so it's worth double-checking condition before you ship.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ready to see what your items are worth?</h2>
            <p className="text-gray-600 mb-6">
              Scan your first barcode and get an instant cash offer &mdash; no account required to start.
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