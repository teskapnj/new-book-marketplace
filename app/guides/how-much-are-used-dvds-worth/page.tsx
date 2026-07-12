import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Much Are Used DVDs Worth? (2026 Price Guide) | SellBookMedia",
  description:
    "What are your used DVDs actually worth in 2026? See real price ranges, what makes a DVD valuable, and how to get a cash offer instantly by scanning the barcode.",
};

export default function DvdValueGuide() {
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
              How Much Are Used DVDs Worth?
            </h1>
            <p className="text-lg text-gray-600">
              The honest answer: it depends entirely on the title. Some DVDs are worth pennies, some
              are worth real money, and most people are surprised by which is which. Here's how DVD
              pricing actually works, and how to find out what your specific discs are worth.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              The uncomfortable truth about common DVDs
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Most mainstream Hollywood DVDs &mdash; the ones that sold millions of copies &mdash;
                are worth very little today. Across the buyback industry, common titles typically
                fetch somewhere in the range of $0.10 to $0.65 each. That's not a knock on any
                particular service; it's just supply and demand. When millions of copies of a title
                exist and few people are buying, the price collapses.
              </p>
              <p>
                This is why some buyback sites will happily take your entire box and pay you a few
                dollars total. The math works for them because they're buying in bulk at pennies.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What makes a DVD actually valuable</h2>
            <p className="text-gray-700 mb-4">
              Value comes down to two things: how many copies are floating around, and how many people
              still want it. In practice, these are the DVDs that hold real value:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Out-of-print titles</strong> &mdash; films that were never re-released or
                  never made it to streaming. Scarcity drives price.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Complete TV box sets</strong> &mdash; full seasons or series collections,
                  especially if all discs are present and the packaging is intact.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Blu-ray and 4K editions</strong> &mdash; generally hold more value than
                  standard DVDs of the same film.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Criterion, special, and collector's editions</strong> &mdash; niche
                  audiences that actively hunt these.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Documentaries, educational, and specialty content</strong> &mdash; smaller
                  print runs, steady demand.
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How we price DVDs</h2>
            <p className="text-gray-700 mb-4">
              Rather than paying pennies for everything, we take a different approach: we only make an
              offer on DVDs that are actually worth something, and when we do, we pay real money for
              them.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
              <h3 className="font-semibold text-green-800 mb-3">Our DVD offers</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Offers range from <strong>$1.50 to $4.50</strong> per disc</li>
                <li>• Pricing is based on current market value and how well the title is selling</li>
                <li>• Higher-value, faster-selling titles get the higher offers</li>
                <li>• If a title isn't worth at least $1.50 to us, we don't make an offer at all</li>
              </ul>
            </div>
            <p className="text-gray-700 text-sm">
              That last point matters. We'd rather tell you honestly that a disc isn't worth shipping
              than have you box up 40 DVDs for a $6 payout.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to find out what yours are worth
            </h2>
            <p className="text-gray-700 mb-4">
              There's no need to guess or look up titles one by one. Scan the barcode on the back of
              each DVD with your phone and you'll see an instant offer &mdash; or a clear "not
              accepted" if that title isn't worth it.
            </p>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Open the scanner and point your camera at the barcode &mdash; no account needed.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>See your offer instantly. Accepted items are added to your list automatically.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Once you reach 5 items, ship them free with the label we email you, and get paid via
                  PayPal within 2 business days of us receiving your box.
                </span>
              </li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Condition matters</h2>
            <p className="text-gray-700 mb-4">
              A valuable title in poor condition isn't worth much to anyone. To qualify, your DVDs
              should play without skipping, be free of deep scratches, and come complete with their
              original case and cover art. Light surface wear is fine.
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
                  Why won't you take some of my DVDs?
                </h3>
                <p className="text-gray-700 text-sm">
                  If a title is worth less than our $1.50 minimum &mdash; usually because there are
                  far more copies out there than buyers &mdash; we don't make an offer. It's more
                  honest than paying you a few cents for it.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  I have a rare box set. Should I sell it here?
                </h3>
                <p className="text-gray-700 text-sm">
                  If you think you have something genuinely rare or collectible, it's worth checking
                  recent sold listings on eBay first. A dedicated collector may pay more than any bulk
                  buyer &mdash; including us. For everything else, scanning is faster and easier.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Do you take Blu-rays and 4K discs?</h3>
                <p className="text-gray-700 text-sm">
                  Yes. Scan the barcode like any other disc and you'll see the offer instantly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">What about VHS tapes?</h3>
                <p className="text-gray-700 text-sm">
                  We don't currently buy VHS tapes. We focus on DVDs, Blu-rays, 4K, CDs, books, and
                  video games.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Find out what your DVDs are worth</h2>
            <p className="text-gray-600 mb-6">
              Scan a barcode and see your offer in seconds &mdash; no account required to start.
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