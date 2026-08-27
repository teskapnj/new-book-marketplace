import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "How Much Are Used DVDs Worth? (2026 Price Guide) | SellBookMedia",
  description:
    "What are your used DVDs actually worth in 2026? See real price ranges, what makes a DVD valuable, and how to get a cash offer instantly by scanning the barcode.",
};

const VALUABLE = [
  {
    name: "Out-of-print titles",
    body: "Films that were never re-released or never made it to streaming. Scarcity drives price.",
  },
  {
    name: "Complete TV box sets",
    body: "Full seasons or series collections, especially if all discs are present and the packaging is intact.",
  },
  {
    name: "Blu-ray and 4K editions",
    body: "Generally hold more value than standard DVDs of the same film.",
  },
  {
    name: "Criterion, special, and collector's editions",
    body: "Niche audiences that actively hunt these.",
  },
  {
    name: "Documentaries, educational, and specialty content",
    body: "Smaller print runs, steady demand.",
  },
];

const STEPS = [
  "Open the scanner and point your camera at the barcode — no account needed.",
  "See your offer instantly. Accepted items are added to your list automatically.",
  "Once your accepted offers reach $7.50, ship them free with the label we email you, and get paid via PayPal within 2 business days of us receiving your box.",
];

const FAQ = [
  {
    q: "Why won't you take some of my DVDs?",
    a: "If a title is worth less than our $1.50 minimum — usually because there are far more copies out there than buyers — we don't make an offer. It's more honest than paying you a few cents for it.",
  },
  {
    q: "I have a rare box set. Should I sell it here?",
    a: "If you think you have something genuinely rare or collectible, it's worth checking recent sold listings on eBay first. A dedicated collector may pay more than any bulk buyer — including us. For everything else, scanning is faster and easier.",
  },
  {
    q: "Do you take Blu-rays and 4K discs?",
    a: "Yes. Scan the barcode like any other disc and you'll see the offer instantly.",
  },
  {
    q: "What about VHS tapes?",
    a: "We don't currently buy VHS tapes. We focus on DVDs, Blu-rays, 4K, CDs, books, and video games.",
  },
];

export default function DvdValueGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How Much Are Used DVDs Worth?",
        datePublished: "2026-08-18",
        dateModified: "2026-08-18",
        author: { "@type": "Organization", name: "SellBookMedia" },
        publisher: { "@type": "Organization", name: "SellBookMedia" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
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

      {/* ===================== BASLIK BANDI ===================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Price guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How much are used DVDs worth?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            The honest answer: it depends entirely on the title. Some DVDs are worth pennies, some are
            worth real money, and most people are surprised by which is which. Here&rsquo;s how DVD
            pricing actually works, and how to check your own shelf.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <time dateTime="2026-08-18">Updated August 2026</time>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <span>5 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ---------- IMZA: odeme matematigi ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Do the math first
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              The uncomfortable truth about common DVDs
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Most mainstream Hollywood DVDs — the ones that sold millions of copies — are worth very
              little today. Across the buyback industry, common titles typically fetch somewhere in
              the range of $0.10 to $0.65 each. That&rsquo;s not a knock on any particular service;
              it&rsquo;s just supply and demand.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {/* Sektor tarafi */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Typical buyback site
                </p>
                <div className="px-5 py-6">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-4xl font-bold text-slate-400 tabular-nums">
                      $0.15
                    </span>
                    <span className="text-lg font-medium text-slate-500">per disc</span>
                  </div>
                  <dl className="mt-5 space-y-2.5 border-t border-dashed border-slate-200 pt-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Takes</dt>
                      <dd className="text-right font-medium text-slate-700">Everything you send</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">40 common DVDs</dt>
                      <dd className="text-right font-mono font-bold text-rose-600 tabular-nums">
                        $6.00
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-[14px] leading-relaxed text-slate-500">
                    A full evening of sorting, packing, and hauling a box to the post office.
                  </p>
                </div>
              </div>

              {/* Bizim taraf */}
              <div className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white shadow-md">
                <p className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  SellBookMedia
                </p>
                <div className="px-5 py-6">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-4xl font-bold text-emerald-700 tabular-nums">
                      $1.50
                    </span>
                    <span className="text-lg font-medium text-slate-700">and up</span>
                  </div>
                  <dl className="mt-5 space-y-2.5 border-t border-dashed border-emerald-200 pt-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Takes</dt>
                      <dd className="text-right font-medium text-slate-700">
                        Only what clears $1.50
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500">Below that</dt>
                      <dd className="text-right font-medium text-slate-700">We say so upfront</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-[14px] leading-relaxed text-slate-600">
                    Fewer discs accepted, but the box you actually ship is worth shipping.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
              Some buyback sites will happily take your whole box — the math works for them because
              they&rsquo;re buying in bulk at pennies. We work the other way round: pricing is based
              on current market value and how well each title is selling, and if a disc isn&rsquo;t
              worth at least $1.50, we don&rsquo;t make an offer at all.
            </p>
          </section>

          {/* ---------- Degerli olanlar ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The exceptions
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What makes a DVD actually valuable
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Value comes down to two things: how many copies are floating around, and how many people
              still want one. In practice, these are the discs that hold real value.
            </p>

            <div className="mt-6 space-y-3">
              {VALUABLE.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-emerald-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

 
          {/* ---------- Durum ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you pack
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Condition matters
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              A valuable title in poor condition isn&rsquo;t worth much to anyone. To qualify, your
              DVDs should play without skipping, be free of deep scratches, and come complete with
              their original case and cover art.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">Fine</p>
                <p className="mt-1 text-[15px] text-slate-600">Light surface wear on the disc</p>
              </div>
              <div className="rounded-xl border-l-4 border-rose-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-rose-800">Not accepted</p>
                <p className="mt-1 text-[15px] text-slate-600">
                  Deep scratches, missing case or cover art
                </p>
              </div>
            </div>

            <Link
              href="/condition-guidelines"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              See the full condition guidelines
              <svg
                className="ml-1.5 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </section>

          {/* ---------- Nasil ogrenirim ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Check your shelf
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How to find out what yours are worth
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              There&rsquo;s no need to guess or look up titles one by one. Scan the barcode on the back
              of each DVD with your phone and you&rsquo;ll see an instant offer — or a clear
              &ldquo;not accepted&rdquo; if that title isn&rsquo;t worth it.
            </p>

            <ol className="mt-6 space-y-3">
              {STEPS.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[16px] leading-relaxed text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------- SSS ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Still wondering
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Common questions
            </h2>

            <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
              {FAQ.map((item) => (
                <div key={item.q} className="py-6">
                  <dt className="font-serif text-lg font-semibold text-slate-900">{item.q}</dt>
                  <dd className="mt-2 text-[16px] leading-[1.75] text-slate-600">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <RelatedGuides currentSlug="how-much-are-used-dvds-worth" />

          {/* ---------- CTA ---------- */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              Find out what your DVDs are worth
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Scan a barcode and see your offer in seconds. No account required to start.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Start scanning
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}