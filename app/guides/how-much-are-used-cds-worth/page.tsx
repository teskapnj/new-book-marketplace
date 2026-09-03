import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "Used CD Value: How Much Are Your CDs Worth? (2026) | SellBookMedia",
  description:
  "Check used CD value and learn what affects how much your CDs are worth. Scan the barcode for an instant cash offer with free shipping and PayPal payment.",
};

const VALUABLE = [
  {
    name: "Out-of-print albums",
    tell: "Older or harder-to-find releases",
    body: "Albums that are no longer widely available can sometimes attract stronger demand from collectors and fans.",
  },
  {
    name: "Japanese and imported pressings",
    tell: "Obi strips, import markings, or unique catalog numbers",
    body: "Certain imported editions are collected specifically for their mastering, packaging, bonus tracks, or limited availability.",
  },
  {
    name: "Box sets and complete collections",
    tell: "Multiple discs, booklets, and original packaging",
    body: "Complete sets can be especially worth checking because buyers often want the entire package rather than individual discs.",
  },
  {
    name: "Jazz, classical, and specialty releases",
    tell: "Smaller labels or niche artists",
    body: "Some specialty genres continue to have dedicated physical-media buyers, particularly for harder-to-find releases.",
  },
  {
    name: "Limited, early, or unusual editions",
    tell: "Special packaging, early pressing, or uncommon release",
    body: "A less common edition can sometimes have very different resale demand from the standard version of the same album.",
  },
  {
    q: "How do I find the value of a used CD?",
    a: "The easiest way is to identify the exact release using its barcode. Used CD value can vary by edition, demand, condition, and current resale activity, so scanning the specific title gives a more useful result than estimating from the album name alone.",
  },
];

const STEPS = [
  "Scan the barcode on the CD with your phone, or enter it manually — no app required.",
  "See your offer instantly for qualifying titles.",
  "Add CDs, books, DVDs, and games to the same order until you reach the checkout minimum.",
  "Use the prepaid shipping label we email you to send your box.",
  "After your shipment is received and inspected, qualifying items are paid through PayPal.",
];

const FAQ = [
  {
    q: "Do you buy vinyl records?",
    a: "Not currently. SellBookMedia focuses on CDs, DVDs, Blu-rays, 4K UHD, books, and qualifying video games.",
  },
  {
    q: "What about cassette tapes?",
    a: "We don't currently buy cassette tapes. Our media buyback categories focus on CDs and disc-based formats.",
  },
  {
    q: "Are audiobooks on CD accepted?",
    a: "No. We currently focus on music CDs rather than audiobook or spoken-word CD sets.",
  },
  {
    q: "Why do some CDs get an offer and others don't?",
    a: "Each title has different demand, resale value, and sales activity. Some CDs qualify for an offer while others may not meet our current purchasing criteria.",
  },
  {
    q: "I think I have a rare CD. Should I sell it here?",
    a: "If you believe you have a genuinely rare or collectible pressing, it's worth checking recent collector-market sales as well. You can still scan the barcode with us first to see the offer available for that exact title.",
  },
  {
    q: "Can I check a CD without creating an account?",
    a: "Yes. You can scan a barcode and check an offer before creating an account.",
  },
];

export default function CdValueGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How Much Are Used CDs Worth?",
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
            Used CD value guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How much are your used CDs worth?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            CD values can vary much more than people expect. A common album,
            a box set, an import, and a harder-to-find pressing can all have
            very different resale demand. The fastest way to know what you
            have is to scan the barcode.
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

          {/* ===================== VALUE ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What affects value
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Why one CD can be worth more than another
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Used CD value comes down largely to{" "}
                <strong className="text-slate-900">
                  supply, demand, and the exact edition
                </strong>.
                Two copies of the same album may look similar but have very
                different resale interest if one is a common release and the
                other is an import, box-set edition, or harder-to-find pressing.
              </p>

              <p>
                That&apos;s why looking at the artist or album title alone
                doesn&apos;t tell you much. The barcode helps identify the
                specific release so it can be evaluated against current demand.
              </p>
            </div>

            <div className="mt-7 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-slate-700">
                <strong className="text-slate-900">
                  Have a stack of CDs?
                </strong>{" "}
                Don&apos;t assume the entire collection has the same value.
                Checking the individual barcodes is the easiest way to find
                the titles that stand out.
              </p>
            </div>
          </section>

          {/* ===================== EARLY CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Have a CD nearby?
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  See what we&apos;ll pay for it
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan one barcode and see your offer in seconds. No app
                  required and no account needed just to check.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Check My CD

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

          {/* ===================== VALUABLE TYPES ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Check your collection
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              CDs that are especially worth checking
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              You can&apos;t reliably judge value by appearance alone, but
              certain kinds of releases are particularly worth scanning before
              you donate, discard, or sell your collection elsewhere.
            </p>

            <div className="mt-6 space-y-3">
              {VALUABLE.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">
                    {item.name}
                  </h3>

                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
                    <svg
                      className="h-3.5 w-3.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                    </svg>

                    Look for: {item.tell}
                  </p>

                  <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== PRICING ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Our offers
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Every CD gets evaluated individually
            </h2>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Scan the exact title. See the actual offer.
              </h3>

              <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                Offers vary by title. We look at the specific release,
                current market value, demand, and sales activity before
                showing you an offer.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-[15px] text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  You see the offer before deciding whether to add the CD.
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  Higher-demand and harder-to-find titles may receive stronger offers.
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  If a title doesn&apos;t currently meet our purchasing criteria,
                  we&apos;ll simply let you know.
                </li>
              </ul>
            </div>
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
              Used CDs don&apos;t need to look brand new. Light surface marks
              and normal case wear are generally fine. The disc should be
              playable, complete, and free from serious damage.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">
                  Generally fine
                </p>

                <p className="mt-1 text-[15px] text-slate-600">
                  Light surface wear and normal case scuffs
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-slate-400 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">
                  Please don&apos;t send
                </p>

                <p className="mt-1 text-[15px] text-slate-600">
                  Cracked discs, deep playback-affecting scratches, or missing essential parts
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

          {/* ===================== HOW IT WORKS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              From shelf to offer
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Find out what your CDs are worth
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              You don&apos;t need to research each album individually.
              Scan the barcode and check the exact title in seconds.
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

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Used CD value questions
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
          <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
  Have a CD in front of you? Learn how to{" "}
  <Link
    href="/guides/media-value-by-barcode"
    className="font-semibold text-blue-600 hover:text-blue-800"
  >
    check CD value using the barcode
  </Link>
  .
</p>

          <RelatedGuides currentSlug="how-much-are-used-cds-worth" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have a CD within reach?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Find out what we&apos;ll pay
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan one barcode and see your offer in seconds. No app
              required and no commitment to sell.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Check My CD

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