import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "How Much Are Used CDs Worth? (2026 Price Guide) | SellBookMedia",
  description:
    "What are your old CDs actually worth in 2026? See what makes a CD valuable, which ones are worth nothing, and how to get a cash offer by scanning the barcode.",
};

export default function CdValueGuide() {
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
              How Much Are Used CDs Worth?
            </h1>
            <p className="text-lg text-gray-600">
              Most people assume their CD collection is worthless. That's true for a lot of it &mdash;
              but not all. A shelf of 200 discs usually hides a few that are genuinely worth money.
              Here's what separates them.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why most CDs are worth so little
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                CDs sold in staggering numbers through the 1990s and early 2000s. A hit album might
                have shipped ten million copies in the US alone. Those copies didn't disappear &mdash;
                they're sitting in basements, garages, and thrift store bins across the country.
              </p>
              <p>
                When supply is that large and demand has moved to streaming, price collapses. The
                albums everybody owned are the albums nobody will pay for. Greatest hits compilations,
                multi-platinum pop records, and the CDs that came free with a magazine are all in this
                category.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What makes a CD actually valuable</h2>
            <p className="text-gray-700 mb-4">
              Value comes down to scarcity meeting demand. In practice, these are the CDs that hold
              real value:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Out-of-print albums</strong> &mdash; records that never got a reissue and
                  aren't on streaming services. Independent and regional releases often fall here.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Japanese pressings</strong> &mdash; usually marked with an obi strip and a
                  catalogue number starting with letters. Collectors seek these out specifically.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Box sets and complete collections</strong> &mdash; especially with all discs,
                  booklets, and outer packaging present.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Classical, jazz, and specialty labels</strong> &mdash; smaller print runs and
                  a dedicated audience that still buys physical media.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>
                  <strong>Early pressings of albums that later became famous</strong> &mdash; a first
                  pressing from a band's independent years can be worth many times a later reissue.
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How we price CDs</h2>
            <p className="text-gray-700 mb-4">
              Rather than paying pennies for everything and hoping volume covers it, we only make an
              offer on CDs that are worth something &mdash; and when we do, we pay real money.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
              <h3 className="font-semibold text-green-800 mb-3">Our CD offers</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Offers start at <strong>$1.50</strong> per disc and go up from there</li>
                <li>• Pricing is based on current market value and how well the title is selling</li>
                <li>• Higher-value, faster-selling titles get the higher offers</li>
                <li>• If a title isn't worth at least our minimum, we don't make an offer at all</li>
              </ul>
            </div>
            <p className="text-gray-700 text-sm">
              That last point matters. We'd rather tell you honestly that a disc isn't worth shipping
              than have you pack 60 CDs for a few dollars.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to find out what yours are worth
            </h2>
            <p className="text-gray-700 mb-4">
              There's no need to research titles one by one. Scan the barcode on the back of each case
              with your phone and you'll see an instant offer &mdash; or a clear "not accepted" if that
              title isn't worth it.
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
              A valuable album in poor condition isn't worth much to anyone. To qualify, discs should
              play without skipping, be free of deep scratches, and come complete with the original
              jewel case, cover art, and booklet. Light surface wear on the disc is fine; a cracked
              case with missing artwork is not.
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
                  Do you buy vinyl records?
                </h3>
                <p className="text-gray-700 text-sm">
                  Not at the moment. Vinyl has an active collector market of its own, so a local record
                  shop or a direct sale usually gets you a better price than any bulk buyer would.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  What about cassettes?
                </h3>
                <p className="text-gray-700 text-sm">
                  We don't buy cassettes either. We focus on CDs, DVDs, Blu-rays, 4K discs, books, and
                  video games.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Are audiobooks on CD accepted?
                </h3>
                <p className="text-gray-700 text-sm">
                  We don't buy audiobook CD sets. If a title in your list turns out to be an audiobook
                  when we receive it, we won't be able to pay for that item.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Why won't you take most of my collection?
                </h3>
                <p className="text-gray-700 text-sm">
                  If a title is worth less than our minimum &mdash; usually because there are far more
                  copies in circulation than buyers &mdash; we don't make an offer. It's more honest
                  than paying you a few cents for it.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  I think I have something rare. Should I sell it here?
                </h3>
                <p className="text-gray-700 text-sm">
                  If you believe you have a genuinely scarce pressing, check recent sold listings on
                  eBay first. A collector may pay more than any bulk buyer, including us. For the rest
                  of the shelf, scanning is faster and easier.
                </p>
              </div>
            </div>
          </section>

          <RelatedGuides currentSlug="how-much-are-used-cds-worth" />

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Find out what your CDs are worth</h2>
            <p className="text-gray-600 mb-6">
              Scan a barcode and see your offer in seconds &mdash; no account required to start.
            </p>
            <Link
              href="/"
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