import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
    title: "What to Do With Old DVDs and CDs You No Longer Want | SellBookMedia",
    description:
      "Before you give away that shelf of discs, find out which ones are worth money. Here are your real options for old DVDs and CDs, and how to tell them apart in minutes.",
    };

export default function WhatToDoWithOldDvdsAndCds() {
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
              What to Do With Old DVDs and CDs You No Longer Want
            </h1>
            <p className="text-lg text-gray-600">
              They're taking up a shelf you'd rather have back, and you're ready to let them go. Before
              you load the car for the donation bin, it's worth knowing that a shelf of discs almost
              always contains a few worth real money. Here's an honest look at every option.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why nobody seems to want them anymore
            </h2>
            <div className="space-y-4 text-gray-700">
            <p>
                It isn't your imagination. Netflix mailed its last DVD in 2023. Best Buy stopped
                selling discs the same year. Thrift stores are receiving far more discs than they can
                put on the shelf, and most of what's donated ends up sold for pocket change or
                recycled.
              </p>
              <p>
                At the same time, an enormous number of households are clearing out at once &mdash;
                downsizing, moving, or settling a family estate. Supply went up sharply while demand
                went the other way.
              </p>
              <p>
                But here's the part most people get wrong: <strong>this is true for common titles,
                not all of them.</strong> A shelf of 200 discs almost always contains a handful that
                are still worth real money. The trick is knowing which ones without checking each
                title by hand.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your five realistic options</h2>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">1. Sell the ones that are worth something</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Best for: most people, especially with 20 or more discs.
                </p>
                <p className="text-gray-700 text-sm">
                  Buyback services check each barcode against current market value and make an
                  instant offer. You only ship the ones they'll pay for, shipping is free, and the
                  whole thing takes minutes rather than weeks. You won't get top dollar for a rare
                  disc this way, but for a mixed shelf it's the best return on your time by a wide
                  margin.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">2. List rare titles individually</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Best for: out-of-print films, complete box sets, collector's editions.
                </p>
                <p className="text-gray-700 text-sm">
                  If you know you have something genuinely scarce, a collector will pay more than any
                  bulk buyer. Check completed sold listings on eBay to see what people actually paid,
                  not what sellers are asking. Be realistic about the effort though: photographing,
                  listing, packing, and shipping each disc adds up fast.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">3. Sell the whole lot locally</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Best for: very large collections you want gone this weekend.
                </p>
                <p className="text-gray-700 text-sm">
                  Facebook Marketplace, a garage sale, or a local used media shop will take a big
                  collection off your hands in one go. Expect low offers &mdash; often a flat price
                  for the whole box &mdash; but it's immediate and there's no shipping involved.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">4. Donate what's left over</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Best for: common titles nobody will pay for.
                </p>
                <p className="text-gray-700 text-sm">
                  Goodwill and most thrift stores do accept discs, and it's a genuinely good home for
                  the ones with no resale value. Libraries, senior centers, and nursing homes are often
                  glad to take them too. Our only suggestion: scan the barcodes first. It takes a couple
                  of seconds each, and it means you'll know you aren't giving away the one disc on the
                  shelf that was worth $20.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">5. Recycle the rest properly</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Best for: damaged, scratched, or genuinely unsellable discs.
                </p>
                <p className="text-gray-700 text-sm">
                  Discs and cases are made from polycarbonate and polystyrene, which most curbside
                  programs won't accept. Look for a mail-in disc recycling program, or check whether
                  your local waste authority runs a hard-plastics drop-off. It's a better ending than
                  a landfill, and it takes one trip.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to sort a big collection quickly
            </h2>
            <p className="text-gray-700 mb-4">
              If you have hundreds of discs, don't try to research titles one at a time. Work through
              the shelf with your phone instead:
            </p>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Scan each barcode. You'll see an offer or a clear "not accepted" within a couple of
                  seconds, so you can sort into two piles as you go.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Set aside anything that looks unusual &mdash; foreign releases, box sets, discs you
                  don't recognise &mdash; and check those on eBay separately.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Donate or recycle whatever's left. By this point you'll know you haven't thrown away
                  anything valuable.
                </span>
              </li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Before you box anything up
            </h2>
            <p className="text-gray-700 mb-4">
              Whichever route you take, condition decides whether a disc has any value at all. Discs
              should play without skipping, be free of deep scratches, and come with their original
              case and cover art. Light surface marks are normally fine.
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
                  Is it worth selling DVDs at all, or should I just donate them?
                </h3>
                <p className="text-gray-700 text-sm">
                  Scanning costs you nothing and takes seconds per disc, so it's worth finding out
                  before you give a collection away. Most people are surprised by which titles hold
                  value &mdash; it's rarely the blockbusters.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Should I just donate them to Goodwill instead?
                </h3>
                <p className="text-gray-700 text-sm">
                  For common titles, donating is a perfectly good option and we'd never talk you out
                  of it. It's just worth scanning the shelf first &mdash; the discs that hold value
                  are rarely the ones people expect, and a large collection often has $20 to $50
                  sitting in it.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  What about VHS tapes, vinyl records, and cassettes?
                </h3>
                <p className="text-gray-700 text-sm">
                  We don't currently buy those formats. Vinyl in particular has an active collector
                  market, so a local record shop or eBay is usually a better route for records.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Do I need to sell everything at once?
                </h3>
                <p className="text-gray-700 text-sm">
                  No. You need at least 5 accepted items to ship a box, but there's no upper limit and
                  no obligation to send everything you own in one go.
                </p>
              </div>
            </div>
          </section>

          <RelatedGuides currentSlug="what-to-do-with-old-dvds-and-cds" />

          <div className="text-center bg-blue-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Find out which of yours are worth keeping
            </h2>
            <p className="text-gray-600 mb-6">
              Scan a barcode and see an offer in seconds &mdash; no account required to start.
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