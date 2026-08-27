import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "What to Do With Old DVDs and CDs You No Longer Want | SellBookMedia",
  description:
    "Before you give away that shelf of discs, find out which ones are worth money. Here are your real options for old DVDs and CDs, and how to tell them apart in minutes.",
};

const OPTIONS = [
  {
    name: "Sell the ones that are worth something",
    bestFor: "Most people, 20+ discs",
    payout: "Moderate",
    effort: "Minutes",
    tone: "primary" as const,
    body: "Buyback services check each barcode against current market value and make an instant offer. You only ship the ones they'll pay for, shipping is free, and the whole thing takes minutes rather than weeks. You won't get top dollar for a rare disc this way, but for a mixed shelf it's the best return on your time by a wide margin.",
  },
  {
    name: "List rare titles individually",
    bestFor: "Out-of-print films, box sets, collector's editions",
    payout: "Highest",
    effort: "High, per disc",
    tone: "normal" as const,
    body: "If you know you have something genuinely scarce, a collector will pay more than any bulk buyer. Check completed sold listings on eBay to see what people actually paid, not what sellers are asking. Be realistic about the effort though: photographing, listing, packing, and shipping each disc adds up fast.",
  },
  {
    name: "Sell the whole lot locally",
    bestFor: "Very large collections you want gone this weekend",
    payout: "Low",
    effort: "One afternoon",
    tone: "normal" as const,
    body: "Facebook Marketplace, a garage sale, or a local used media shop will take a big collection off your hands in one go. Expect low offers — often a flat price for the whole box — but it's immediate and there's no shipping involved.",
  },
  {
    name: "Donate what's left over",
    bestFor: "Common titles nobody will pay for",
    payout: "None",
    effort: "One trip",
    tone: "normal" as const,
    body: "Goodwill and most thrift stores do accept discs, and it's a genuinely good home for the ones with no resale value. Libraries, senior centers, and nursing homes are often glad to take them too. Our only suggestion: scan the barcodes first. It takes a couple of seconds each, and it means you'll know you aren't giving away the one disc on the shelf that was worth $20.",
  },
  {
    name: "Recycle the rest properly",
    bestFor: "Damaged, scratched, or unsellable discs",
    payout: "None",
    effort: "One trip",
    tone: "normal" as const,
    body: "Discs and cases are made from polycarbonate and polystyrene, which most curbside programs won't accept. Look for a mail-in disc recycling program, or check whether your local waste authority runs a hard-plastics drop-off. It's a better ending than a landfill, and it takes one trip.",
  },
];

const STEPS = [
  "Scan each barcode. You'll see an offer or a clear \"not accepted\" within a couple of seconds, so you can sort into two piles as you go.",
  "Set aside anything that looks unusual — foreign releases, box sets, discs you don't recognise — and check those on eBay separately.",
  "Donate or recycle whatever's left. By this point you'll know you haven't thrown away anything valuable.",
];

const FAQ = [
  {
    q: "Is it worth selling DVDs at all, or should I just donate them?",
    a: "Scanning costs you nothing and takes seconds per disc, so it's worth finding out before you give a collection away. Most people are surprised by which titles hold value — it's rarely the blockbusters.",
  },
  {
    q: "Should I just donate them to Goodwill instead?",
    a: "For common titles, donating is a perfectly good option and we'd never talk you out of it. It's just worth scanning the shelf first — the discs that hold value are rarely the ones people expect, and a large collection often has $20 to $50 sitting in it.",
  },
  {
    q: "What about VHS tapes, vinyl records, and cassettes?",
    a: "We don't currently buy those formats. Vinyl in particular has an active collector market, so a local record shop or eBay is usually a better route for records.",
  },
  {
    q: "Do I need to sell everything at once?",
    a: "No. Your accepted offers need to reach at least .50 to ship a box, but there's no upper limit and no obligation to send everything you own in one go.",
  },
];

export default function WhatToDoWithOldDvdsAndCds() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "What to Do With Old DVDs and CDs You No Longer Want",
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
            Clearing out
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            What to do with old DVDs and CDs
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            They&rsquo;re taking up a shelf you&rsquo;d rather have back. Before you load the car for
            the donation bin, it&rsquo;s worth knowing that a shelf of discs almost always contains a
            few worth real money. Here&rsquo;s an honest look at every option.
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
            <span>6 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ---------- Piyasa baglami ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What changed
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Why nobody seems to want them anymore
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              It isn&rsquo;t your imagination. Two things happened in the same year, and the disc
              market hasn&rsquo;t looked the same since.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-mono text-4xl font-bold text-slate-900 tabular-nums">2023</p>
                <p className="mt-2 font-semibold text-slate-900">Netflix mailed its last DVD</p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  The service that put discs in millions of mailboxes shut the program down.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-mono text-4xl font-bold text-slate-900 tabular-nums">2023</p>
                <p className="mt-2 font-semibold text-slate-900">Best Buy stopped selling discs</p>
                <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                  One of the last big-box retailers to carry them walked away.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Thrift stores now receive far more discs than they can put on the shelf, and most of
                what&rsquo;s donated ends up sold for pocket change or recycled. At the same time, an
                enormous number of households are clearing out at once — downsizing, moving, or
                settling a family estate. Supply went up sharply while demand went the other way.
              </p>
            </div>

            <p className="mt-6 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 text-[16px] leading-relaxed text-slate-700 shadow-sm">
              Here&rsquo;s the part most people get wrong:{" "}
              <strong className="text-slate-900">
                this is true for common titles, not all of them.
              </strong>{" "}
              A shelf of 200 discs almost always contains a handful still worth real money. The trick
              is knowing which ones without checking each title by hand.
            </p>
          </section>

          {/* ---------- IMZA: bes secenek ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Pick your route
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Your five realistic options
            </h2>

            <div className="mt-8 space-y-4">
              {OPTIONS.map((opt, i) => (
                <div
                  key={opt.name}
                  className={`overflow-hidden rounded-2xl bg-white shadow-sm ${
                    opt.tone === "primary"
                      ? "border-2 border-emerald-300 shadow-md"
                      : "border border-slate-200"
                  }`}
                >
                  <div
                    className={`flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-5 py-3 ${
                      opt.tone === "primary"
                        ? "border-emerald-100 bg-emerald-50"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <span
                      className={`font-mono text-sm font-bold tabular-nums ${
                        opt.tone === "primary" ? "text-emerald-700" : "text-slate-400"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-slate-900">{opt.name}</h3>
                  </div>

                  <div className="px-5 py-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                        Best for: {opt.bestFor}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        Payout: {opt.payout}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        Effort: {opt.effort}
                      </span>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{opt.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Hizli ayiklama ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The practical bit
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How to sort a big collection quickly
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              If you have hundreds of discs, don&rsquo;t try to research titles one at a time. Work
              through the shelf with your phone instead.
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

          {/* ---------- Durum ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you pack
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Condition decides everything
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Whichever route you take, condition decides whether a disc has any value at all. Discs
              should play without skipping, be free of deep scratches, and come with their original
              case and cover art.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">Fine</p>
                <p className="mt-1 text-[15px] text-slate-600">Light surface marks</p>
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

          <RelatedGuides currentSlug="what-to-do-with-old-dvds-and-cds" />

          {/* ---------- CTA ---------- */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              Find out which of yours are worth keeping
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Scan a barcode and see an offer in seconds. No account required to start.
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