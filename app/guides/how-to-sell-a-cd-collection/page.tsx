import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/how-to-sell-a-cd-collection`;

export const metadata: Metadata = {
  title: "How to Sell a Large CD Collection | SellBookMedia",
  description:
    "Have boxes of old CDs? Learn how to sort and sell a large CD collection without listing every disc individually, including what to check before you sell.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: "How to Sell a Large CD Collection Without Listing Every Disc Individually",
    description:
      "A practical guide to sorting, checking, and selling a large music CD collection without creating hundreds of individual listings.",
    siteName: "SellBookMedia",
  },
};

const FAQ = [
  {
    q: "Where can I sell a large CD collection?",
    a: "Your options include online marketplaces, local record stores, collector communities, and media buyback services. The best choice depends on how much time you want to spend researching, listing, packing, and selling individual titles.",
  },
  {
    q: "Can I sell CDs in bulk?",
    a: "Yes. A large collection does not necessarily need to be listed one disc at a time. Buyback services can let you check individual barcodes and combine qualifying CDs into a larger shipment.",
  },
  {
    q: "Should I check my CDs before selling the whole collection?",
    a: "Yes. It is worth looking more closely at unusual box sets, imports, limited editions, early pressings, and harder-to-find releases before treating every CD in the collection the same way.",
  },
  {
    q: "Is it better to sell CDs individually or all at once?",
    a: "Selling individually can make sense for collectible or unusually valuable titles, but it requires more research and work. For ordinary CDs, a buyback service can be a much faster way to process a large collection.",
  },
  {
    q: "How do I quickly check hundreds of CDs?",
    a: "Using the barcode is usually much faster than searching every album by artist and title. A barcode identifies the specific release and lets you check titles one after another.",
  },
  {
    q: "Can I send CDs with other media in the same SellBookMedia order?",
    a: "Yes. Qualifying CDs can be added to the same order with qualifying books, DVDs, Blu-rays, 4K movies, and video games.",
  },
];

export default function SellLargeCDCollectionGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline:
          "How to Sell a Large CD Collection Without Listing Every Disc Individually",
        url: PAGE_URL,
        datePublished: "2026-09-08",
        dateModified: "2026-09-08",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": PAGE_URL,
        },
        author: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "SellBookMedia",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "SellBookMedia",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: `${SITE_URL}/guides`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "How to Sell a Large CD Collection",
            item: PAGE_URL,
          },
        ],
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
            CD collection guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How to sell a large CD collection without listing every disc individually
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Boxes of old CDs can turn into a surprisingly big project once you
            start researching prices, taking photos, writing listings, and
            shipping discs one at a time. There is a faster way to sort through
            a collection without treating every album like a separate sale.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span aria-hidden="true" className="text-white/30">/</span>
            <time dateTime="2026-09-08">Updated September 2026</time>
            <span aria-hidden="true" className="text-white/30">/</span>
            <span>7 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>

          {/* ===================== OPENING ===================== */}
          <section className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Start with the collection, not the listings
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A few hundred CDs can become hundreds of separate jobs
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Selling one CD online is simple. Selling 200 or 500 CDs that way
                is different. Every disc may need a price check, photos, a
                description, a listing, buyer messages, packaging, and a
                separate shipment.
              </p>

              <p>
                That can make a CD collection feel like a small inventory
                business rather than a clean-out project.
              </p>

              <p>
                A better approach is to split the job in two: identify the CDs
                that deserve extra attention, then process the rest as
                efficiently as possible.
              </p>
            </div>
          </section>

          {/* ===================== TOP CTA ===================== */}
          <section className="mb-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-9 text-center sm:px-10 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have a box of CDs nearby?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Start with one barcode
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan a CD and see whether it qualifies for a current
              SellBookMedia offer. No need to create a listing just to check.
            </p>

            <Link
              href="/#quote"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Check My First CD

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
              <span>Instant offers</span>
              <span aria-hidden="true">•</span>
              <span>Free shipping</span>
              <span aria-hidden="true">•</span>
              <span>PayPal, Venmo, or check by mail payment</span>
            </div>
          </section>

          {/* ===================== FIRST PASS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              First pass
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Pull out the CDs that look different from the rest
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                You do not need to become a CD collector before selling your
                collection. But it is worth slowing down when something clearly
                stands out.
              </p>

              <p>
                Set aside unusual box sets, Japanese or imported editions,
                limited releases, special packaging, early pressings, and CDs
                that appear harder to find. Those titles may deserve a little
                extra research before you sell them with the rest.
              </p>

              <p>
                We cover those differences in more detail in our{" "}
                <Link
                  href="/guides/how-much-are-used-cds-worth"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  guide to used CD value
                </Link>
                .
              </p>
            </div>

            <div className="mt-6 rounded-xl border-l-4 border-amber-400 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900">
                Don&apos;t assume “old” means valuable
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-amber-900/80">
                A CD can be decades old and still be common. What matters more
                is the exact release, availability, and whether people are still
                looking for it.
              </p>
            </div>
          </section>

          {/* ===================== BARCODE WORKFLOW ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The faster workflow
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Use the barcode instead of researching every album by hand
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Searching by artist and album title sounds easy until the same
                album has several different releases. Reissues, imports,
                remasters, box-set versions, and other editions can look almost
                identical while representing different products.
              </p>

              <p>
                The UPC barcode gives you a much faster way to work through a
                shelf or box. Pick up a CD, scan it, check the result, and move
                to the next one.
              </p>

              <p>
                If you want to understand why the barcode matters, see our{" "}
                <Link
                  href="/guides/media-value-by-barcode"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  guide to checking media value by barcode
                </Link>
                .
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Pick up a CD",
                  text: "Keep the collection beside you so you can work through it without stopping.",
                },
                {
                  number: "02",
                  title: "Scan the barcode",
                  text: "Check the exact release instead of searching the album title manually.",
                },
                {
                  number: "03",
                  title: "Sort as you go",
                  text: "Keep qualifying titles together and move on to the next disc.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                >
                  <span className="font-mono text-sm font-bold text-blue-600">
                    {item.number}
                  </span>
                  <h3 className="mt-3 font-serif text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== INDIVIDUAL VS BULK ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Choose where your time is worth spending
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Should you sell CDs individually or use a buyback service?
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              There is no single best method for every CD in a collection. A
              smart clean-out can use more than one.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Individual selling
                </p>
                <h3 className="mt-2 font-serif text-xl font-bold text-slate-900">
                  Better for CDs worth extra effort
                </h3>

                <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-slate-600">
                  <li>• Rare or collectible editions</li>
                  <li>• Unusual imports or pressings</li>
                  <li>• High-value box sets</li>
                  <li>• Titles with a specialized collector market</li>
                </ul>

                <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
                  The tradeoff is time: research, photos, listings, buyer
                  questions, fees, and individual shipments.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Buyback
                </p>
                <h3 className="mt-2 font-serif text-xl font-bold text-slate-900">
                  Better when convenience matters
                </h3>

                <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-slate-700">
                  <li>• Check many CDs quickly</li>
                  <li>• No individual product listings</li>
                  <li>• Combine qualifying items into one order</li>
                  <li>• Ship using a prepaid label</li>
                </ul>

                <p className="mt-5 text-[15px] leading-relaxed text-slate-700">
                  You trade some of the work of selling individually for a
                  simpler way to move through a larger collection.
                </p>
              </div>
            </div>
          </section>

          {/* ===================== SORTING ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Make three piles
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A simple way to sort hundreds of CDs
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              You do not need a spreadsheet and you do not need to alphabetize
              the whole collection first. Three basic groups are enough.
            </p>

            <div className="mt-7 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-slate-900">
                  1. Worth checking more closely
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Imports, box sets, unusual editions, special packaging, and
                  anything that looks different from the ordinary releases
                  around it.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-slate-900">
                  2. Normal used CDs
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  These are good candidates for barcode scanning. Instead of
                  guessing what the whole box is worth, check each release as
                  you work through it.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-slate-900">
                  3. Clearly damaged or incomplete
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Cracked discs, missing discs, or serious damage should be
                  separated before you start packing.
                </p>
              </div>
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
              Before shipping, check our{" "}
              <Link
                href="/condition-guidelines"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                condition guidelines
              </Link>
              .
            </p>
          </section>

          {/* ===================== COLLECTION SIZE ===================== */}
          <section className="mb-14 rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              A collection does not need one price
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Don&apos;t try to guess what the entire box is worth
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                One of the easiest mistakes is looking at 300 CDs and trying to
                assign an average value to every disc.
              </p>

              <p>
                Real collections are uneven. One shelf may contain mostly common
                releases, a few titles with stronger demand, and one unusual
                edition that deserves separate attention.
              </p>

              <p className="font-semibold text-slate-900">
                Treat the collection as a group for efficiency, but evaluate the
                CDs individually.
              </p>
            </div>
          </section>

          {/* ===================== WHERE TO SELL ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Selling options
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Where can you sell a large CD collection?
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-slate-700">
              <p>
                If you have the time, online marketplaces can be useful for
                individual CDs that justify the extra work. Collector groups can
                also make sense for specialized releases.
              </p>

              <p>
                Local music or record stores may be convenient, although what
                they buy will depend on the store and its current inventory.
              </p>

              <p>
                A media buyback service is the more practical option when your
                priority is processing a large number of ordinary used CDs
                without creating a separate listing for every disc.
              </p>

              <p>
                If you want to compare broader selling options, see our{" "}
                <Link
                  href="/guides/best-places-to-sell-cds-dvds-games"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  guide to places to sell CDs, DVDs, and games
                </Link>
                .
              </p>
            </div>
          </section>

          {/* ===================== SELLBOOKMEDIA ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Using SellBookMedia
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              You can build one order as you work through the collection
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                With SellBookMedia, you can scan or enter CD barcodes and add
                qualifying titles to the same order. You do not need to create
                photos, descriptions, or separate listings.
              </p>

              <p>
                Qualifying books, DVDs, Blu-rays, 4K movies, and video games can
                also be added to the same order, which can be useful if the CDs
                are part of a larger media clean-out.
              </p>

              <p>
                When you are ready, complete the order and use the prepaid
                shipping label provided for your shipment. After the items
                arrive and pass inspection, qualifying items are paid through
                PayPal, Venmo, or check by mail.
              </p>
            </div>

            <Link
              href="/sell-cds-for-cash"
              className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              See how selling CDs to SellBookMedia works

              <svg
                className="ml-1.5 h-4 w-4"
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
          </section>

          {/* ===================== PACKING ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before shipping
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Pack CDs so they cannot move around freely in the box
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                A large CD shipment can become heavy quickly, and jewel cases
                can crack when a box has too much empty space.
              </p>

              <p>
                Keep the CDs packed closely enough that they do not slide around,
                fill empty areas with appropriate packing material, and use a
                sturdy box that can handle the weight of the shipment.
              </p>

              <p>
                It is better to use more than one manageable box than overload a
                single weak box.
              </p>
            </div>
          </section>

          {/* ===================== OTHER OPTIONS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Not everything needs to be sold
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What about CDs you decide not to sell?
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Some titles may not qualify for a buyback offer and may not be
                worth the work of listing individually. That does not mean the
                only option is the trash.
              </p>

              <p>
                Depending on condition, you may want to donate them, offer them
                locally, give them to someone building a music collection, or
                explore other reuse options.
              </p>

              <p>
                Our{" "}
                <Link
                  href="/guides/what-to-do-with-old-dvds-and-cds"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  guide to what to do with old DVDs and CDs
                </Link>{" "}
                covers more alternatives.
              </p>
            </div>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Selling a CD collection: frequently asked questions
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

          {/* ===================== BOTTOM LINE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Bottom line
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Don&apos;t turn a clean-out into a second job
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                A large CD collection does not have to mean hundreds of
                individual online listings.
              </p>

              <p>
                Give unusual or potentially collectible releases the extra
                attention they deserve. For the rest, barcode scanning gives you
                a much faster way to work through the collection one disc at a
                time.
              </p>

              <p className="font-semibold text-slate-900">
                The goal is not to research every CD. It is to know which CDs
                are worth your time.
              </p>
            </div>
          </section>

          {/* ===================== RELATED GUIDES ===================== */}
          <RelatedGuides currentSlug="how-to-sell-a-cd-collection" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Ready to start?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Pick up the first CD and scan it
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              You don&apos;t have to sort the whole collection before you begin.
              Check one barcode, see your offer, and work through the box at
              your own pace.
            </p>

            <Link
              href="/#quote"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Start Scanning CDs

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
              <span>PayPal, Venmo, or check by mail payment</span>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}