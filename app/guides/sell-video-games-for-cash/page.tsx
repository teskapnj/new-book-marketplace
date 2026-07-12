import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Video Games for Cash: Complete Guide (2026) | SellBookMedia",
  description:
    "Want to sell your used video games for cash? Learn what your games are worth, which titles hold value, and how to get an instant offer by scanning the barcode.",
};

export default function SellGamesGuide() {
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
              Sell Video Games for Cash: A Complete Guide
            </h1>
            <p className="text-lg text-gray-600">
              Old games pile up fast. Whether you've moved on to a new console or you're just clearing
              shelf space, here's what your games are actually worth and the fastest way to turn them
              into cash.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your options for selling games</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Trade-in at a game store</strong> is convenient but typically pays the least,
                and often pushes you toward store credit instead of cash.
              </p>
              <p>
                <strong>eBay or local marketplaces</strong> can bring the most money for a genuinely
                rare or sought-after title, but you're handling listings, photos, buyers, fees, and
                shipping for every single game.
              </p>
              <p>
                <strong>Buyback services</strong> sit in the middle: scan the barcode, get an instant
                offer, ship everything at once with a free label. Best for clearing a stack of games
                without the hassle of individual sales.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Which games hold their value?</h2>
            <p className="text-gray-700 mb-4">
              Game values swing more than almost any other media category. A game that sold ten
              million copies is worth almost nothing; a niche title with a small print run can be
              worth real money. These tend to hold value:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Nintendo titles</strong> &mdash; Nintendo games famously hold value better
                  than most, especially first-party series.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Complete-in-box copies</strong> &mdash; original case, cover art, and manual
                  present. Missing pieces cut the value sharply.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Limited, collector's, and special editions</strong> &mdash; smaller print
                  runs mean less supply.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Out-of-print or delisted titles</strong> &mdash; games that can't be bought
                  new or downloaded anymore.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2">✗</span>
                <span>
                  <strong>Annual sports titles</strong> &mdash; last year's edition drops to near zero
                  the moment the next one ships.
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What we pay for games</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
              <h3 className="font-semibold text-green-800 mb-3">Our offers</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Offers range from <strong>$1.50 to $4.50</strong> per game</li>
                <li>• Pricing reflects current market value and how quickly the title is selling</li>
                <li>• All major platforms are supported &mdash; scan the barcode and find out</li>
                <li>• If a game isn't worth at least $1.50 to us, we won't make an offer on it</li>
              </ul>
            </div>
            <p className="text-gray-700 text-sm">
              We'd rather be upfront that a game isn't worth shipping than have you pack a box for
              pocket change.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How it works</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Scan the barcode on the back of the game case with your phone &mdash; no account
                  needed to start.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>See your cash offer instantly. Accepted games are added to your list.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Reach 5 items total (games, DVDs, CDs, and books can all go in the same box), then
                  ship free with the label we email you.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  4
                </span>
                <span>Get paid via PayPal within 2 business days of us receiving your box.</span>
              </li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Condition requirements</h2>
            <p className="text-gray-700 mb-4">
              Games need to be complete and playable: the disc or cartridge should work without
              issues, and the original case and cover art should be included. Light wear on the case
              is fine, but missing artwork or a scratched, unplayable disc will disqualify an item.
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
                <h3 className="font-semibold text-gray-900 mb-1">Do you buy consoles or accessories?</h3>
                <p className="text-gray-700 text-sm">
                  Not currently. We buy the games themselves &mdash; not consoles, controllers, or
                  other hardware.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  What if the game case is missing?
                </h3>
                <p className="text-gray-700 text-sm">
                  Games need their original case and cover art to qualify. A loose disc without its
                  case can't be accepted.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  I think I have a rare retro game. Should I sell it here?
                </h3>
                <p className="text-gray-700 text-sm">
                  If you suspect a game is genuinely rare or collectible, check recent sold listings on
                  eBay first &mdash; collectors sometimes pay well above what any bulk buyer would
                  offer. For everything else, scanning is faster and far less work.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Can I mix games with books, CDs, and DVDs in one box?
                </h3>
                <p className="text-gray-700 text-sm">
                  Yes. That's the point &mdash; scan whatever you've got, hit the 5-item minimum in any
                  combination, and ship it all together.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">See what your games are worth</h2>
            <p className="text-gray-600 mb-6">
              Scan a barcode and get an instant offer &mdash; no account required to start.
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