import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Much Are Used Books Worth? (2026 Price Guide) | SellBookMedia",
  description:
    "What are your used books actually worth? Learn which books hold value, why some sell for more than others, and how to get an instant cash offer by scanning the barcode.",
};

export default function BookValueGuide() {
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
              How Much Are Used Books Worth?
            </h1>
            <p className="text-lg text-gray-600">
              Two books can look nearly identical on your shelf and be worth wildly different amounts.
              One might be worth $7, the other worth nothing at all. Here's what actually drives book
              value, which categories hold up best, and how to find out what your specific books are
              worth without looking them up one by one.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What determines a used book's value
            </h2>
            <p className="text-gray-700 mb-4">
              It comes down to a simple tension: <strong>how many copies exist</strong> versus{" "}
              <strong>how many people still want one</strong>. Everything else is a variation on that
              theme.
            </p>
            <div className="space-y-4 text-gray-700">
              <p>
                A blockbuster novel that sold ten million copies is competing against thousands of used
                copies for sale right now. Supply overwhelms demand and the price falls to almost
                nothing &mdash; sometimes literally pennies.
              </p>
              <p>
                Meanwhile, a specialized technical book with a small print run might have only a
                handful of used copies available at any given time, and the people who need it really
                need it. Low supply, steady demand, higher price.
              </p>
              <p>
                This is why "is my book old?" is usually the wrong question. Age alone doesn't create
                value &mdash; scarcity and demand do.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Which books tend to hold value</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-green-800 mb-1">Textbooks and academic titles</h3>
                <p className="text-green-700 text-sm">
                  Often the highest-value category, especially current editions in fields that update
                  slowly. The catch: they must be clean. Highlighting and margin notes &mdash; extremely
                  common in textbooks &mdash; disqualify a book entirely.
                </p>
              </div>
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-green-800 mb-1">Technical and professional books</h3>
                <p className="text-green-700 text-sm">
                  Medicine, law, engineering, certification prep, specialized software. Small print
                  runs, professional buyers, consistent demand.
                </p>
              </div>
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-green-800 mb-1">Art, photography, and coffee-table books</h3>
                <p className="text-green-700 text-sm">
                  Expensive to print, often go out of print quickly, and collectors seek them out.
                  Condition matters a lot here since the appeal is visual.
                </p>
              </div>
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-green-800 mb-1">Niche non-fiction and out-of-print titles</h3>
                <p className="text-green-700 text-sm">
                  Specialized histories, regional interest, hobbyist manuals, anything that was never
                  reprinted. Scarcity does the work.
                </p>
              </div>
              <div className="border-l-4 border-red-300 bg-red-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-red-800 mb-1">Mass-market bestsellers</h3>
                <p className="text-red-700 text-sm">
                  The paperback thriller everyone read on vacation. Millions of copies, thousands
                  listed used at any moment. These are usually worth close to nothing regardless of
                  condition.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What we pay for books</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
              <h3 className="font-semibold text-green-800 mb-3">Our book offers</h3>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Offers range from <strong>$1.50 to $7.50</strong> per book</li>
                <li>• That's our widest range of any category &mdash; books have the most upside</li>
                <li>• Pricing reflects current market value and how quickly the title is selling</li>
                <li>• If a book isn't worth at least $1.50 to us, we don't make an offer on it</li>
              </ul>
            </div>
            <p className="text-gray-700 text-sm">
              We'd rather tell you honestly that a paperback isn't worth shipping than pay you three
              cents for it. That's why some of your books won't get an offer &mdash; not because
              there's anything wrong with them, but because there are already too many copies out
              there.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Condition is a hard filter</h2>
            <p className="text-gray-700 mb-4">
              With books, condition isn't a sliding scale for us &mdash; it's pass or fail. A valuable
              title in poor condition isn't worth anything to the next reader, so we hold a firm line:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2 text-sm">✓ Accepted</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Clean pages, no writing</li>
                  <li>• Intact binding and cover</li>
                  <li>• Light shelf wear is fine</li>
                  <li>• All pages present</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2 text-sm">✗ Not accepted</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Writing or highlighting</li>
                  <li>• Water damage or stains</li>
                  <li>• Ex-library copies</li>
                  <li>• Strong odors (smoke, mildew)</li>
                </ul>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-2">
              <strong>A note on textbooks:</strong> they're often the most valuable books people own,
              but they're also the most likely to be highlighted. If yours are clean, they're well
              worth scanning. If every page is marked up, they won't qualify.
            </p>
            <Link
              href="/condition-guidelines"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              See the full condition guidelines →
            </Link>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Find out what your books are worth
            </h2>
            <p className="text-gray-700 mb-4">
              Don't look them up one at a time. Scan the barcode on the back cover (or the ISBN) with
              your phone and you'll see an offer instantly &mdash; or a clear "not accepted" so you
              know to set it aside.
            </p>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>Scan each book's barcode with your camera &mdash; no account needed to start.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>Accepted books are added to your list with their offer shown.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Reach 5 items (books, CDs, DVDs, and games can share a box), then ship free with the
                  label we email you.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common questions</h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Why won't you take most of my paperbacks?
                </h3>
                <p className="text-gray-700 text-sm">
                  Popular fiction usually has enormous used supply and low demand, which pushes the
                  market value below our $1.50 minimum. It's not about the book being bad &mdash; it's
                  about how many copies already exist.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Do you buy textbooks?</h3>
                <p className="text-gray-700 text-sm">
                  Yes, and they're often among the most valuable books people send us &mdash; as long
                  as they're clean. Highlighting or written notes disqualify a book, which unfortunately
                  rules out a lot of used textbooks.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">What about old or antique books?</h3>
                <p className="text-gray-700 text-sm">
                  Books without a scannable ISBN barcode (generally anything published before the
                  1970s) can't go through our system. If you think you have something genuinely rare or
                  antiquarian, a specialist dealer will serve you far better than any bulk buyer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Is a hardcover worth more than a paperback?</h3>
                <p className="text-gray-700 text-sm">
                  Sometimes, but not automatically. What matters is the specific title's supply and
                  demand, not the format. A common hardcover can be worth less than a scarce paperback.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  My book has a small stamp inside. Is that ex-library?
                </h3>
                <p className="text-gray-700 text-sm">
                  Ex-library books &mdash; those with library stamps, stickers, barcodes, or pocket
                  labels &mdash; can't be accepted, even if the pages themselves are clean.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">See what your books are worth</h2>
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