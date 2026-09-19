import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/who-buys-dvd-collections`;

export const metadata: Metadata = {
  title: "Who Buys DVD Collections? Where to Sell DVDs for Cash",
  description:
    "Find out who buys DVD collections, where to sell DVDs in bulk, and when to use an online buyback service, marketplace, local store, or collector.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Who Buys DVD Collections? Where to Sell DVDs for Cash",
    description:
      "Compare online DVD buyers, local stores, marketplaces, and collectors, and learn how to sell a large DVD collection without listing every title individually.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "article",
    publishedTime: "2026-09-19",
    modifiedTime: "2026-09-19",
  },
  twitter: {
    card: "summary_large_image",
    title: "Who Buys DVD Collections?",
    description:
      "A practical guide to selling a DVD collection online, locally, in bulk, or title by title.",
  },
};

const BUYER_TYPES = [
  {
    title: "Online buyback services",
    bestFor: "Large collections of ordinary used DVDs",
    body:
      "A direct buyback service lets you check individual UPCs, build one shipment from qualifying titles, and avoid creating separate marketplace listings for every DVD.",
  },
  {
    title: "Local used-media stores",
    bestFor: "People who want a local, in-person option",
    body:
      "Some record stores, used-media shops, bookstores, and resale stores buy DVDs. Policies vary widely, and many stores only want titles they believe they can resell quickly.",
  },
  {
    title: "Online marketplaces",
    bestFor: "Higher-value or unusual individual titles",
    body:
      "Selling directly to another buyer can give you more control over the asking price, but you may need photos, descriptions, buyer messages, packing, and separate shipments.",
  },
  {
    title: "Collectors",
    bestFor: "Rare, out-of-print, niche, or special editions",
    body:
      "Collectors are usually interested in specific releases rather than random boxes of common movies. Exact edition, format, condition, and completeness matter.",
  },
];

const PULL_ASIDE = [
  {
    title: "Box sets",
    body:
      "Complete TV series, franchise collections, multi-disc sets, and deluxe boxes deserve a separate look before you treat them like ordinary single DVDs.",
  },
  {
    title: "Out-of-print titles",
    body:
      "A movie that is no longer widely available on physical media can sometimes have stronger resale demand than a common studio release.",
  },
  {
    title: "Collector and limited editions",
    body:
      "Steelbooks, special packaging, numbered editions, anniversary releases, and releases with bonus material may attract a different buyer than a standard DVD.",
  },
  {
    title: "Anime and niche releases",
    body:
      "Some anime, cult films, specialty labels, documentaries, concert DVDs, and other niche releases can have smaller but more dedicated buyer markets.",
  },
  {
    title: "Blu-rays and 4K UHD movies",
    body:
      "Do not automatically mix newer formats into the ordinary DVD pile. Format alone does not guarantee value, but Blu-ray and 4K releases may have different demand.",
  },
  {
    title: "Sealed or unusually complete copies",
    body:
      "Factory-sealed items and complete sets with slipcovers, booklets, inserts, or original outer packaging may deserve additional research.",
  },
];

const PROCESS = [
  {
    n: "1",
    title: "Separate unusual titles first",
    body:
      "Pull out box sets, imports, limited editions, niche releases, Blu-rays, 4K movies, and anything that looks different from an ordinary mass-market DVD.",
  },
  {
    n: "2",
    title: "Scan the UPC",
    body:
      "Use the barcode on each standard retail case to identify the exact release and see whether it currently qualifies for a cash offer.",
  },
  {
    n: "3",
    title: "Build one qualifying shipment",
    body:
      "Accepted DVDs, Blu-rays, 4K movies, CDs, books, and qualifying games can be combined into the same submission when they meet the current purchasing criteria.",
  },
  {
    n: "4",
    title: "Ship the accepted items",
    body:
      "Once your qualifying total reaches the required minimum, follow the shipping instructions and use the prepaid shipping option provided for the order.",
  },
];

const FAQ = [
  {
    q: "Who buys DVD collections?",
    a:
      "DVD collections can be bought by online buyback services, local used-media stores, marketplace buyers, and collectors. The best type of buyer depends on whether your collection is mostly common DVDs or includes rare, out-of-print, limited, niche, Blu-ray, or 4K releases.",
  },
  {
    q: "Where can I sell a large DVD collection?",
    a:
      "For a large collection, you can compare direct online buyback services, local media stores, marketplaces, and collector-focused selling. A direct buyback can reduce the work of photographing and listing common DVDs individually, while unusual titles may deserve separate research.",
  },
  {
    q: "Can I sell DVDs in bulk?",
    a:
      "Yes, but 'bulk' can mean different things. Some buyers may offer one price for an entire lot, while online buyback services often evaluate qualifying titles individually and allow accepted items to be shipped together in one order.",
  },
  {
    q: "Who buys old DVDs near me?",
    a:
      "Local record stores, used-media stores, bookstores, resale shops, and individual marketplace buyers may buy DVDs depending on your area. An online buyback service is another option because you can check titles without depending on a nearby store.",
  },
  {
    q: "Are old DVD collections worth anything?",
    a:
      "Some are, but the age of the collection does not determine its value. Most collections contain a mix of common titles, stronger-demand titles, damaged copies, box sets, and sometimes unusual releases worth researching separately.",
  },
  {
    q: "Do DVD buyers also buy Blu-rays and 4K movies?",
    a:
      "Some do. SellBookMedia checks qualifying DVDs, Blu-rays, and 4K UHD movies through the same movie-selling workflow. Eligibility still depends on the exact release and current purchasing criteria.",
  },
  {
    q: "Do I have to list every DVD individually?",
    a:
      "Not if you use a direct buyback service. With SellBookMedia, you scan or enter each UPC to see the current offer, but you do not need to create a public listing, write a description, negotiate with a buyer, or photograph every accepted title.",
  },
  {
    q: "How do I know which DVDs in my collection may be worth more?",
    a:
      "Pull aside box sets, discontinued titles, collector editions, anime, concert DVDs, niche releases, unusual packaging, Blu-rays, and 4K movies. Then identify the exact release by barcode and compare its current market and buyer demand.",
  },
  {
    q: "Can I check my DVDs before shipping them?",
    a:
      "Yes. SellBookMedia lets you scan or enter the UPC to see whether a title currently qualifies and view the offer before you include it in a submission.",
  },
  {
    q: "Does SellBookMedia buy every DVD?",
    a:
      "No. Purchasing criteria can change based on the exact release, current demand, resale conditions, price data, and other factors. The barcode checker tells you whether a specific title currently qualifies.",
  },
];

function ArrowIcon() {
  return (
    <svg
      className="ml-2 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M12 5l7 7-7 7"
      />
    </svg>
  );
}

export default function WhoBuysDvdCollectionsGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Who Buys DVD Collections?",
        description:
          "A practical guide to finding buyers for DVD collections, comparing bulk buyback, local stores, marketplaces, and collectors.",
        datePublished: "2026-09-19",
        dateModified: "2026-09-19",
        mainEntityOfPage: PAGE_URL,
        author: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
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
            name: "Who Buys DVD Collections?",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
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
              aria-hidden="true"
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
            DVD collection selling guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Who Buys DVD Collections?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            If you have shelves or boxes of DVDs, you have more options than
            listing every movie one at a time. Online buyback services, local
            stores, marketplace buyers, and collectors all buy DVDs — but they
            are looking for different things.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <time dateTime="2026-09-19">Updated September 2026</time>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <span>9 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ===================== SHORT ANSWER ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The short answer
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Several types of buyers purchase DVD collections
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                The most common options are{" "}
                <strong className="text-slate-900">
                  online buyback services, local used-media stores, online
                  marketplaces, and collectors
                </strong>
                . The right choice depends on what is actually in your
                collection.
              </p>

              <p>
                A box of common studio DVDs is very different from a shelf
                containing discontinued box sets, anime, special editions,
                Blu-rays, 4K movies, concert releases, or collector-focused
                titles. You do not need to treat every disc the same way.
              </p>

              <p>
                For a large ordinary collection, convenience may matter more
                than squeezing the maximum possible price from every individual
                title. For unusual releases, taking a few extra minutes to
                identify the exact edition can make more sense.
              </p>
            </div>

            <div className="mt-7 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-slate-700">
                <strong className="text-slate-900">
                  A practical approach:
                </strong>{" "}
                pull aside anything unusual, then scan the barcodes on the
                ordinary DVDs to see which titles currently have a buyback
                offer.
              </p>
            </div>
          </section>

          {/* ===================== BUYER TYPES ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Your main selling options
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Who actually buys used DVD collections?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              Different buyers solve different problems. Someone with 20 rare
              titles may choose differently from someone trying to clear 400
              ordinary DVDs from a basement.
            </p>

            <div className="mt-7 space-y-4">
              {BUYER_TYPES.map((buyer) => (
                <div
                  key={buyer.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      {buyer.title}
                    </h3>

                    <span className="inline-flex self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Best for: {buyer.bestFor}
                    </span>
                  </div>

                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                    {buyer.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== COMPARISON ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Match the buyer to the collection
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              The best selling method depends on what you have
            </h2>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-3 bg-slate-900 text-sm font-semibold text-white sm:text-base">
                <div className="p-4 sm:p-5">Your situation</div>
                <div className="border-l border-white/10 p-4 sm:p-5">
                  Good place to start
                </div>
                <div className="border-l border-white/10 p-4 sm:p-5">
                  Main trade-off
                </div>
              </div>

              {[
                [
                  "Large collection of ordinary DVDs",
                  "Direct buyback",
                  "Fast sorting, but not every title will qualify",
                ],
                [
                  "Rare or unusual releases",
                  "Collector marketplace",
                  "More research and selling work",
                ],
                [
                  "Want to sell locally",
                  "Used-media store or local buyer",
                  "Inventory needs vary by store",
                ],
                [
                  "Want one buyer to take a whole lot",
                  "Local bulk buyer",
                  "Convenience can mean a lower overall offer",
                ],
                [
                  "Mixed DVDs, Blu-rays, CDs, books, and games",
                  "Multi-category buyback",
                  "Each item still needs to meet buying criteria",
                ],
              ].map((row, index) => (
                <div
                  key={row[0]}
                  className={`grid grid-cols-3 text-sm sm:text-base ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <div className="p-4 font-semibold text-slate-900 sm:p-5">
                    {row[0]}
                  </div>
                  <div className="border-l border-slate-200 p-4 text-slate-700 sm:p-5">
                    {row[1]}
                  </div>
                  <div className="border-l border-slate-200 p-4 text-slate-600 sm:p-5">
                    {row[2]}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
              For a broader comparison of selling methods, see our{" "}
              <Link
                href="/guides/best-places-to-sell-cds-dvds-games"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                guide to the best places to sell CDs, DVDs, and games
              </Link>
              .
            </p>
          </section>

          {/* ===================== WHOLE COLLECTION ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Selling the whole collection
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              One big lot and individual title buyback are not the same thing
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                When people search for someone to buy an entire DVD collection,
                they often mean:{" "}
                <em>
                  “I do not want to photograph, list, negotiate, and ship 200
                  movies one at a time.”
                </em>
              </p>

              <p>
                There are two ways to solve that problem. A local bulk buyer may
                offer one amount for a whole box or collection. An online
                buyback service can instead evaluate individual titles quickly
                and let you ship all qualifying items together.
              </p>

              <p>
                SellBookMedia uses the second approach. We do not assign one
                blanket value to an unseen collection. You scan the UPCs, see
                which exact releases currently qualify, and build a submission
                from the accepted items.
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  One-price bulk sale
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Fastest way to clear everything
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  Useful if your main goal is getting rid of the entire
                  collection at once and you are comfortable with a buyer
                  pricing the lot as a whole.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Barcode-based buyback
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  Check qualifying titles individually
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
                  Scan the collection quickly, keep the titles that qualify,
                  and ship accepted items together without creating public
                  listings.
                </p>
              </div>
            </div>
          </section>

          {/* ===================== PULL ASIDE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you sell the box
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Pull these DVDs aside before treating everything as bulk
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              Most large collections contain ordinary titles, but sometimes a
              few releases deserve extra attention. These categories do not
              guarantee a high price — they are simply good reasons to slow
              down and check the exact release.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {PULL_ASIDE.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
              If you are trying to identify potentially collectible titles,
              read{" "}
              <Link
                href="/guides/are-old-dvds-worth-anything"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Are Old DVDs Worth Anything?
              </Link>{" "}
              before selling unusual releases as part of a generic lot.
            </p>
          </section>

          {/* ===================== BARCODE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Check the exact release
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              The UPC is the fastest way to sort a large DVD collection
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                A movie title alone is not enough. The same film may exist as
                an older DVD, a special edition, a multi-disc release, a
                Blu-ray, a 4K release, a box set, or a later reissue.
              </p>

              <p>
                The barcode helps identify the exact retail release instead of
                guessing from the cover. That makes it especially useful when
                you are working through shelves of movies and want a repeatable
                sorting process.
              </p>
            </div>

            <Link
              href="/guides/media-value-by-barcode"
              className="mt-5 inline-flex items-center font-semibold text-blue-600 hover:text-blue-800"
            >
              Learn how media value by barcode works
              <ArrowIcon />
            </Link>
          </section>

          {/* ===================== COMMON DVDS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What about common DVDs?
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A familiar movie title does not automatically mean strong resale value
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                Many popular DVDs were produced in very large quantities.
                Strong name recognition can exist alongside a large supply of
                used copies. That is one reason a movie you remember paying
                $15 or $20 for years ago may have a much smaller buyback value
                today.
              </p>

              <p>
                It does not mean every older DVD is worthless. It means the
                exact release, current supply, buyer demand, format, and
                condition need to be considered together.
              </p>
            </div>

            <Link
              href="/guides/why-are-used-dvds-worth-so-little"
              className="mt-5 inline-flex items-center font-semibold text-blue-600 hover:text-blue-800"
            >
              Why are many used DVDs worth so little?
              <ArrowIcon />
            </Link>
          </section>

          {/* ===================== PROCESS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              A faster collection workflow
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How to work through a large DVD collection
            </h2>

            <div className="mt-7 space-y-3">
              {PROCESS.map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      {step.n}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Start with one DVD
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  Scan a UPC and see whether we are currently buying it
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  You do not need to know the value of the entire collection
                  before you start. Check a barcode, see the current offer, and
                  work through the collection from there.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/sell-dvds-for-cash"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Check My DVD
                    <ArrowIcon />
                  </Link>

                  <span className="text-sm text-slate-500">
                    Instant quote • Free prepaid shipping • PayPal, Venmo, or
                    check by mail
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== CONDITION ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Condition matters
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A buyer still needs a resellable, complete item
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                A qualifying barcode does not override the physical condition
                of the item. The correct disc should be present and playable,
                and essential packaging or components should not be seriously
                damaged or missing.
              </p>

              <p>
                For box sets and multi-disc releases, completeness matters even
                more. Check that all discs and required components are present
                before shipping.
              </p>
            </div>

            <Link
              href="/condition-guidelines"
              className="mt-5 inline-flex items-center font-semibold text-blue-600 hover:text-blue-800"
            >
              Review the condition guidelines
              <ArrowIcon />
            </Link>
          </section>

          {/* ===================== NEAR ME ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Looking for a DVD buyer near you?
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Local selling is one option — but you are not limited to your ZIP code
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                Searching for “who buys DVDs near me” can lead to record stores,
                resale shops, used bookstores, flea-market dealers, or local
                marketplace buyers. That can work well if you want an in-person
                transaction.
              </p>

              <p>
                The limitation is that every local buyer has different
                inventory needs. A store may already have too many copies of a
                common movie or may not currently buy DVDs at all.
              </p>

              <p>
                Online buyback gives you another route: check the exact UPC
                from home and know whether the title currently qualifies before
                you pack it.
              </p>
            </div>
          </section>

          {/* ===================== UNSOLD ITEMS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Not everything needs to be sold
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Have a plan for the DVDs no buyer wants
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              A large collection will often contain titles that are not worth
              the time or shipping cost to resell. Depending on condition, you
              may decide to donate them, give them away, repurpose them, or use
              an appropriate recycling option.
            </p>

            <Link
              href="/guides/what-to-do-with-old-dvds-and-cds"
              className="mt-5 inline-flex items-center font-semibold text-blue-600 hover:text-blue-800"
            >
              What to do with old DVDs and CDs
              <ArrowIcon />
            </Link>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              DVD collection selling questions
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

          {/* ===================== INTERNAL LINKS ===================== */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              More help selling your DVD collection
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  href: "/guides/are-old-dvds-worth-anything",
                  title: "Are Old DVDs Worth Anything?",
                  body:
                    "Learn which older DVDs, box sets, discontinued titles, and special editions deserve a closer look.",
                },
                {
                  href: "/guides/media-value-by-barcode",
                  title: "Find Media Value by Barcode",
                  body:
                    "See why the exact UPC matters when one movie has multiple releases and formats.",
                },
                {
                  href: "/guides/why-are-used-dvds-worth-so-little",
                  title: "Why Are Used DVDs Worth So Little?",
                  body:
                    "Understand how large supply and changing demand affect many common DVD titles.",
                },
                {
                  href: "/guides/best-places-to-sell-cds-dvds-games",
                  title: "Best Places to Sell Used Media",
                  body:
                    "Compare direct buyback, marketplaces, local selling, and other options.",
                },
                {
                  href: "/guides/what-to-do-with-old-dvds-and-cds",
                  title: "What to Do With Old DVDs & CDs",
                  body:
                    "Review selling, donating, giving away, and responsible disposal options.",
                },
                {
                  href: "/seller-guide",
                  title: "SellBookMedia Seller Guide",
                  body:
                    "See how scanning, shipping, inspection, and payment work from start to finish.",
                },
              ].map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <h3 className="font-bold text-slate-900">{guide.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {guide.body}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
                    Read guide
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <RelatedGuides currentSlug="who-buys-dvd-collections" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Ready to sort your collection?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Start with the barcode on your first DVD
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan or enter the UPC to see whether the exact release currently
              qualifies and view the offer before you ship anything.
            </p>

            <Link
              href="/sell-dvds-for-cash"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Sell DVDs for Cash
              <ArrowIcon />
            </Link>

            <div className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-blue-200">
              <span>Instant quotes</span>
              <span aria-hidden="true">•</span>
              <span>Free prepaid shipping</span>
              <span aria-hidden="true">•</span>
              <span>PayPal, Venmo, or check by mail</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
