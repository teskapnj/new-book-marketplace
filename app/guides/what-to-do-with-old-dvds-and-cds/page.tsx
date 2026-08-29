import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "What to Do With Old DVDs and CDs You No Longer Want | SellBookMedia",
  description:
    "Wondering what to do with old DVDs and CDs? Compare your options and check whether your discs qualify for an instant cash offer before you donate or give them away.",
};

const OPTIONS = [
  {
    name: "Check what they're worth first",
    bestFor: "Most collections",
    effort: "A quick barcode scan",
    tone: "primary" as const,
    body: "Before you donate, sell locally, or give your collection away, check the barcodes first. Some titles may qualify for an instant offer, and you can decide what to do after you know what you have.",
  },
  {
    name: "Sell collectible titles individually",
    bestFor: "Rare, unusual, or highly collectible releases",
    effort: "Higher, per item",
    tone: "normal" as const,
    body: "If you know you have a genuinely rare box set, limited edition, or collectible pressing, selling directly to a collector can sometimes make sense. The trade-off is the extra work of researching prices, creating listings, answering buyers, packing, shipping, handling marketplace fees, and dealing with possible returns.",
  },
  {
    name: "Sell the collection locally",
    bestFor: "Large collections you want to move quickly",
    effort: "One local transaction",
    tone: "normal" as const,
    body: "A local media store, Facebook Marketplace buyer, or garage sale can be convenient if your main goal is clearing everything at once. Offers may vary significantly, so checking a few individual barcodes first can help you avoid including a title you would rather sell separately.",
  },
  {
    name: "Donate what you don't want to sell",
    bestFor: "Items you simply want to pass along",
    effort: "One trip",
    tone: "normal" as const,
    body: "Donation can be a great option for usable discs you no longer want. Before you drop off the whole collection, scan a few barcodes first so you can make the decision with a better idea of what you have.",
  },
  {
    name: "Recycle damaged items responsibly",
    bestFor: "Broken or unusable discs and cases",
    effort: "Varies locally",
    tone: "normal" as const,
    body: "Badly damaged discs may not be suitable for resale or donation. Recycling options vary by location, so check with your local recycling or waste authority for accepted materials and drop-off options.",
  },
];

const STEPS = [
  "Pick up a CD or DVD and scan the barcode with your phone, or enter it manually — no app required.",
  "See instantly whether that exact title qualifies for an offer.",
  "Keep checking your shelf and add the offers you want to your order.",
  "Combine qualifying CDs, DVDs, Blu-rays, books, and games in the same shipment.",
  "Use the prepaid shipping label we email you and get paid through PayPal after inspection.",
];

const FAQ = [
  {
    q: "Is it worth checking old DVDs and CDs before donating them?",
    a: "Yes. Values vary by title and edition, so scanning the barcode is the easiest way to know whether something qualifies for an offer before you give it away.",
  },
  {
    q: "Should I just donate the whole collection?",
    a: "That's completely up to you. Donation is a good option for items you no longer want, but checking the barcodes first only takes a moment and lets you make the decision with more information.",
  },
  {
    q: "What about VHS tapes, vinyl records, and cassettes?",
    a: "We don't currently buy those formats. SellBookMedia focuses on CDs, DVDs, Blu-rays, 4K UHD, books, and qualifying video games.",
  },
  {
    q: "Do I need to sell everything at once?",
    a: "No. You can scan as many items as you want and choose which qualifying offers to include in your order. Different accepted media categories can be combined in the same box.",
  },
  {
    q: "Do I need an account just to check an offer?",
    a: "No. You can scan or enter a barcode and see whether an item qualifies before creating an account.",
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
        dateModified: "2026-08-29",
        author: {
          "@type": "Organization",
          name: "SellBookMedia",
        },
        publisher: {
          "@type": "Organization",
          name: "SellBookMedia",
        },
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
            Clearing out your collection?
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            What should you do with old DVDs and CDs?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Before you donate, give away, or sell the whole shelf for one
            price, it&apos;s worth checking what you actually have. Used
            media values vary by title, edition, and current demand.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span aria-hidden="true" className="text-white/30">/</span>
            <time dateTime="2026-08-29">Updated August 2026</time>
            <span aria-hidden="true" className="text-white/30">/</span>
            <span>5 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>

          {/* ===================== INTRO ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you clear the shelf
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Don&apos;t assume every disc has the same value
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Streaming changed the way people watch movies and listen to
                music, but physical media didn&apos;t disappear. Collectors,
                fans, and people looking for specific editions still buy CDs,
                DVDs, Blu-rays, and 4K releases.
              </p>

              <p>
                The important part is that demand isn&apos;t equal across an
                entire collection. A common release, a box set, an import,
                and an out-of-print title can all have very different resale
                markets.
              </p>
            </div>

            <div className="mt-7 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-slate-700">
                <strong className="text-slate-900">
                  The easiest first step:
                </strong>{" "}
                check a few barcodes before deciding what to do with the
                entire collection.
              </p>
            </div>
          </section>

          {/* ===================== EARLY CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Before you donate or give it away
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  See what we&apos;ll pay first
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Grab one CD or DVD, scan the barcode, and see your offer
                  in seconds. No app required and no account needed just
                  to check.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Check My Item

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

                  <span className="text-sm text-slate-500">
                    Instant offer • Free shipping • PayPal payment
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== OPTIONS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Your options
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Five practical things you can do with old media
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
                        opt.tone === "primary"
                          ? "text-emerald-700"
                          : "text-slate-400"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="font-semibold text-slate-900">
                      {opt.name}
                    </h3>
                  </div>

                  <div className="px-5 py-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                        Best for: {opt.bestFor}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        Effort: {opt.effort}
                      </span>
                    </div>

                    <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                      {opt.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== HOW TO SORT ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Make it easy
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How to work through a larger collection
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              If you have a shelf or several boxes of media, there&apos;s no
              need to research each title manually. Work through the
              barcodes and let the exact item tell you whether it qualifies.
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

                  <span className="text-[16px] leading-relaxed text-slate-700">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* ===================== CONDITION ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you pack
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Normal signs of use are okay
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Used discs don&apos;t need to look brand new. Light surface
              marks and normal case wear are generally fine. Items should
              be complete, usable, and free from serious damage.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">
                  Generally fine
                </p>

                <p className="mt-1 text-[15px] text-slate-600">
                  Light surface marks and normal case wear
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-slate-400 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">
                  Please don&apos;t send
                </p>

                <p className="mt-1 text-[15px] text-slate-600">
                  Broken discs, deep playback-affecting scratches, or
                  missing essential parts
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </Link>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Clearing out old CDs and DVDs
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

          <RelatedGuides currentSlug="what-to-do-with-old-dvds-and-cds" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Before you clear the shelf
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Check what we&apos;ll pay first
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan one CD or DVD barcode and see your offer in seconds.
              No app required and no commitment to sell.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Check My Item

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
              <span>PayPal payment</span>
            </div>
          </div>

        </article>
      </div>
    </div>
  );
}