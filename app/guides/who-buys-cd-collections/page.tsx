import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/who-buys-cd-collections`;

export const metadata: Metadata = {
  title: "Who Buys CD Collections? Where to Sell CDs for Cash",
  description:
    "Find out who buys CD collections, where to sell large music collections, which CDs deserve extra research, and when barcode, catalog, or matrix details matter.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Who Buys CD Collections? Where to Sell CDs for Cash",
    description:
      "A practical guide to finding buyers for ordinary, large, rare, and collectible CD collections.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "article",
    publishedTime: "2026-09-19",
    modifiedTime: "2026-09-19",
  },
  twitter: {
    card: "summary_large_image",
    title: "Who Buys CD Collections?",
    description:
      "Learn how to sort a CD collection by buyer type, release details, condition, and resale potential.",
  },
};

const COLLECTION_PILES = [
  {
    title: "Everyday barcode CDs",
    label: "Pile 1",
    body:
      "Standard retail CDs with a UPC are the fastest group to check through a direct buyback service. These are usually the titles you can process in volume without researching every pressing manually.",
  },
  {
    title: "Potentially collectible releases",
    label: "Pile 2",
    body:
      "Imports, box sets, limited editions, unusual label releases, early pressings, rare genres, Japanese editions, and long out-of-print CDs deserve a closer look before being treated like ordinary stock.",
  },
  {
    title: "Incomplete or questionable items",
    label: "Pile 3",
    body:
      "Missing discs, heavily damaged booklets, burned CDrs, loose discs, promos, or incomplete multi-disc sets should be separated early because buyer eligibility can be very different.",
  },
];

const RESEARCH_SIGNALS = [
  "Box sets and multi-disc collections",
  "Japanese imports and editions with an obi",
  "Early or unusual pressings",
  "Out-of-print titles",
  "Limited, numbered, deluxe, or special editions",
  "Jazz, classical, metal, ambient, soundtrack, and other niche releases",
  "Small-label or independent releases",
  "Sealed copies",
  "Complete sets with booklets, slipcases, inserts, or outer boxes",
];

const SIZE_STRATEGIES = [
  {
    range: "20–50 CDs",
    title: "You can afford to inspect more titles individually",
    body:
      "With a smaller collection, it is realistic to barcode-check the ordinary CDs and manually research anything unusual. The extra time per item is manageable.",
  },
  {
    range: "100–300 CDs",
    title: "Sort first, research second",
    body:
      "Separate obvious collector candidates from standard retail CDs before doing detailed research. This prevents you from spending ten minutes on every common album.",
  },
  {
    range: "500+ CDs",
    title: "Use a triage system",
    body:
      "For very large collections, speed matters. Process ordinary barcode CDs in batches, pull aside unusual releases, and only do deep pressing research where there is a reason to.",
  },
];

const FAQ = [
  {
    q: "Who buys CD collections?",
    a:
      "CD collections can be purchased by online media buyback services, record and music stores, marketplace buyers, specialist collectors, and local bulk buyers. The right buyer depends on whether your collection is mostly ordinary retail CDs or includes rarer and more collectible releases.",
  },
  {
    q: "Where can I sell a large CD collection?",
    a:
      "Large collections can be sold through online buyback services, local record stores, marketplaces, or specialist buyers. A practical approach is to separate potentially collectible CDs first, then process standard barcode CDs in volume.",
  },
  {
    q: "Who buys old CDs near me?",
    a:
      "Depending on your area, local record stores, used-media shops, bookstores, resale stores, estate buyers, and individual marketplace buyers may purchase CDs. Online buyback is another option because it lets you check titles without relying on nearby inventory needs.",
  },
  {
    q: "Are old CDs worth anything?",
    a:
      "Some are, but age alone does not create value. Exact release, demand, pressing, condition, completeness, genre, label, and current buyer interest all matter.",
  },
  {
    q: "Does the barcode tell me exactly which CD I have?",
    a:
      "Often it identifies the retail release well enough for a buyback check, but collectible CDs can have multiple pressings or manufacturing variants. In those cases, catalog numbers, matrix information, packaging, and other identifiers may matter.",
  },
  {
    q: "What is a CD matrix number?",
    a:
      "The matrix is information found around the inner ring of the disc. It can include manufacturing or pressing details and can help distinguish one pressing from another.",
  },
  {
    q: "What are IFPI codes on CDs?",
    a:
      "Many pressed CDs manufactured from the mid-1990s onward include SID or IFPI codes associated with mastering or manufacturing. Collectors sometimes use these along with matrix information to distinguish pressings.",
  },
  {
    q: "Do booklets and inserts affect CD value?",
    a:
      "Yes. For many CDs, especially collectible releases and box sets, the condition and completeness of booklets, inserts, digipaks, slipcases, and other original packaging can affect desirability.",
  },
  {
    q: "Can I sell CDs in bulk?",
    a:
      "Yes. Some buyers purchase whole lots, while online buyback services may evaluate qualifying CDs individually and let you ship accepted items together.",
  },
  {
    q: "Does SellBookMedia buy every CD?",
    a:
      "No. Eligibility depends on the exact release, condition, demand, current pricing data, and purchasing criteria. The barcode checker shows whether a title currently qualifies.",
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

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 flex-none text-emerald-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4 4L19 6"
      />
    </svg>
  );
}

export default function WhoBuysCdCollectionsGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Who Buys CD Collections?",
        description:
          "A practical guide to finding buyers for CD collections and deciding which releases deserve extra research.",
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
            name: "Who Buys CD Collections?",
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
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            ← Back to home
          </Link>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
                CD collection guide
              </p>

              <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                Who Buys CD Collections?
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                If you have boxes, shelves, or decades of CDs, the first question
                is not just “what are they worth?” It is{" "}
                <strong className="font-semibold text-slate-900">
                  which buyer is right for which part of the collection?
                </strong>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Quick rule
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Barcode-check the ordinary CDs. Research the unusual ones.
                Separate incomplete or damaged items before either step.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
            <span>SellBookMedia</span>
            <span>•</span>
            <time dateTime="2026-09-19">Updated September 2026</time>
            <span>•</span>
            <span>10 min read</span>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        {/* INTRO */}
        <section className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Start with the collection, not the buyer
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
            A CD collection usually contains more than one kind of inventory
          </h2>

          <div className="mt-6 space-y-5 text-[17px] leading-8 text-slate-700">
            <p>
              One box may contain common pop albums, a few discontinued imports,
              a valuable box set, loose discs, burned copies, and a handful of
              releases that collectors identify by pressing details rather than
              album title alone.
            </p>

            <p>
              That is why selling every CD the same way can be inefficient.
              Standard retail CDs are often best handled with a fast barcode
              workflow. Unusual releases may deserve manual research. Incomplete
              or non-standard discs should be separated before either step.
            </p>
          </div>
        </section>

        {/* 3 PILES */}
        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              The three-pile method
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
              Sort the collection before you try to price it
            </h2>
            <p className="mt-4 text-[17px] leading-8 text-slate-600">
              This is the fastest way to avoid over-researching common CDs while
              accidentally under-researching the interesting ones.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {COLLECTION_PILES.map((pile) => (
              <div
                key={pile.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
              >
                <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                  {pile.label}
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {pile.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">
                  {pile.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO BUYS */}
        <section className="mt-16 border-y border-slate-200 py-14">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Buyer types
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
                Who actually buys used CD collections?
              </h2>
              <p className="mt-5 text-[17px] leading-8 text-slate-600">
                The buyer that makes sense for a box of ordinary CDs may not be
                the buyer you want for rare imports or niche collector titles.
              </p>
            </div>

            <div className="space-y-3">
              {[
                [
                  "Online media buyback services",
                  "Useful for processing standard barcode CDs in volume without creating public listings.",
                ],
                [
                  "Record and music stores",
                  "A local option, but what they buy depends heavily on their current inventory and customer base.",
                ],
                [
                  "Marketplace buyers",
                  "Better suited to titles where extra selling work may be justified by stronger demand.",
                ],
                [
                  "Specialist collectors",
                  "Relevant for exact pressings, rare labels, imports, niche genres, and unusual editions.",
                ],
                [
                  "Bulk and estate buyers",
                  "Useful when convenience and clearing a very large collection matter more than optimizing every title.",
                ],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-4"
                >
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CD VS DVD DIFFERENCE */}
        <section className="mt-16">
          <div className="rounded-3xl bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-11">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
              Why CDs need a different approach
            </p>

            <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold">
              The album title is sometimes only the beginning
            </h2>

            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold">Standard resale check</h3>
                <p className="mt-2 text-[15px] leading-7 text-slate-300">
                  For an ordinary retail CD, the UPC is usually the fastest place
                  to start because it identifies the product efficiently for a
                  buyback workflow.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold">Collector identification</h3>
                <p className="mt-2 text-[15px] leading-7 text-slate-300">
                  For unusual releases, collectors may also care about catalog
                  number, country, packaging, matrix text, SID or IFPI codes,
                  label details, and pressing variations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* UPC MATRIX */}
        <section className="mt-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                Use the barcode when
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                You are processing ordinary retail CDs quickly
              </h2>

              <ul className="mt-5 space-y-3 text-[15px] leading-6 text-slate-700">
                {[
                  "The CD has standard retail packaging",
                  "You are checking many titles",
                  "The release does not appear unusual",
                  "Your goal is a current buyback offer",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                Check deeper when
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">
                The exact pressing could matter
              </h2>

              <ul className="mt-5 space-y-3 text-[15px] leading-6 text-slate-700">
                {[
                  "The packaging or label looks unusual",
                  "There are multiple known versions of the album",
                  "The CD is an import or collector edition",
                  "A marketplace identifies releases by matrix or catalog details",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-[16px] leading-7 text-slate-600">
            You can learn more about standard UPC-based identification in our{" "}
            <Link
              href="/guides/media-value-by-barcode"
              className="font-semibold text-emerald-700 hover:text-emerald-900"
            >
              media value by barcode guide
            </Link>
            .
          </p>
        </section>

        {/* WHAT TO RESEARCH */}
        <section className="mt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Pull these aside
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
              CDs that deserve manual research before a bulk sale
            </h2>
            <p className="mt-4 text-[17px] leading-8 text-slate-600">
              None of these categories guarantees high value. They are simply
              signals that the exact release may matter enough to justify a
              closer look.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {RESEARCH_SIGNALS.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <CheckIcon />
                <span className="text-[15px] leading-6 text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-6 max-w-3xl">
            <Link
              href="/guides/how-much-are-used-cds-worth"
              className="inline-flex items-center font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Learn what affects used CD value
              <ArrowIcon />
            </Link>
          </div>
        </section>

        {/* COLLECTION SIZE */}
        <section className="mt-16 bg-slate-50 px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Collection size changes the strategy
            </p>
            <h2 className="mt-3 text-center font-serif text-3xl font-bold text-slate-950">
              The bigger the collection, the more important triage becomes
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {SIZE_STRATEGIES.map((item) => (
                <div
                  key={item.range}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="text-2xl font-black text-emerald-700">
                    {item.range}
                  </div>
                  <h3 className="mt-3 font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONDITION */}
        <section className="mt-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                Condition and completeness
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
                The disc is not the only part that matters
              </h2>

              <div className="mt-5 space-y-4 text-[17px] leading-8 text-slate-700">
                <p>
                  For collectible or premium releases, buyers may care about the
                  booklet, rear inlay, digipak, slipcase, outer box, inserts, and
                  whether a multi-disc set is complete.
                </p>

                <p>
                  A cracked standard jewel case can be replaceable. Missing
                  release-specific artwork or missing discs are a different
                  issue.
                </p>
              </div>

              <Link
                href="/condition-guidelines"
                className="mt-5 inline-flex items-center font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Review SellBookMedia condition guidelines
                <ArrowIcon />
              </Link>
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <h3 className="text-lg font-bold text-slate-950">
                Check before selling
              </h3>

              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                {[
                  "Correct disc is inside",
                  "All discs in a set are present",
                  "Booklet and inlay belong to the release",
                  "No severe water damage or mold",
                  "No obvious burned or homemade copy",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* NEAR ME */}
        <section className="mt-16 border-t border-slate-200 pt-14">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Who buys CDs near me?
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
              Local stores can work — but their demand is local too
            </h2>

            <div className="mt-5 space-y-5 text-[17px] leading-8 text-slate-700">
              <p>
                Record stores and used-media shops often buy selectively based on
                what their customers are currently looking for. One store may
                want jazz and metal but have no interest in common pop CDs.
              </p>

              <p>
                Online buyback removes that geographic limitation. You can check
                the exact barcode from home and see whether a title currently
                qualifies before packing it.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <div className="rounded-3xl bg-emerald-700 px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">
                  Start with the ordinary CDs
                </p>
                <h2 className="mt-3 font-serif text-3xl font-bold">
                  Scan a UPC and see the current offer
                </h2>
                <p className="mt-3 max-w-xl text-[16px] leading-7 text-emerald-50">
                  You do not need to price the entire collection before starting.
                  Check one standard retail CD, then work through the collection
                  in batches.
                </p>
              </div>

              <Link
                href="/sell-cds-for-cash"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
              >
                Check My CD
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW-TO SEPARATION */}
        <section className="mt-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <p className="text-sm font-bold text-slate-950">
              Looking for the step-by-step selling process?
            </p>
            <p className="mt-2 text-[16px] leading-7 text-slate-600">
              This guide focuses on who buys CD collections and how to decide
              which buyer fits each part of a collection. For the actual selling
              workflow, scanning, sorting, packing, and shipping process, use our
              dedicated how-to guide.
            </p>

            <Link
              href="/guides/how-to-sell-a-cd-collection"
              className="mt-4 inline-flex items-center font-semibold text-emerald-700 hover:text-emerald-900"
            >
              How to Sell a CD Collection
              <ArrowIcon />
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Common questions
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
              CD collection selling FAQ
            </h2>

            <dl className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
              {FAQ.map((item) => (
                <div key={item.q} className="py-6">
                  <dt className="text-lg font-bold text-slate-950">
                    {item.q}
                  </dt>
                  <dd className="mt-2 text-[16px] leading-7 text-slate-600">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* MORE LINKS */}
        <section className="mt-16">
          <h2 className="font-serif text-2xl font-bold text-slate-950">
            More help with used CDs
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                href: "/guides/how-much-are-used-cds-worth",
                title: "How Much Are Used CDs Worth?",
                body:
                  "Learn how release details, scarcity, demand, condition, and exact edition can affect value.",
              },
              {
                href: "/guides/how-to-sell-a-cd-collection",
                title: "How to Sell a CD Collection",
                body:
                  "Use a step-by-step process for sorting, checking, and preparing a collection for sale.",
              },
              {
                href: "/guides/media-value-by-barcode",
                title: "Find Media Value by Barcode",
                body:
                  "Understand how UPC-based identification works for ordinary retail media.",
              },
              {
                href: "/guides/best-places-to-sell-cds-dvds-games",
                title: "Best Places to Sell Used Media",
                body:
                  "Compare direct buyback, local stores, marketplaces, and other selling options.",
              },
            ].map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm"
              >
                <h3 className="font-bold text-slate-950">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {guide.body}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700">
                  Read guide
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <RelatedGuides currentSlug="who-buys-cd-collections" />

        {/* FINAL CTA */}
        <section className="mt-14 border-t border-slate-200 pt-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Ready to start?
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">
            Start with the barcode on your first CD
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-7 text-slate-600">
            Check whether the exact retail title currently qualifies before you
            pack or ship anything.
          </p>

          <Link
            href="/sell-cds-for-cash"
            className="mt-7 inline-flex items-center rounded-xl bg-slate-950 px-7 py-3.5 font-bold text-white transition hover:bg-slate-800"
          >
            Sell CDs for Cash
            <ArrowIcon />
          </Link>
        </section>
      </article>
    </main>
  );
}