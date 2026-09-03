import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "How Much Are Used DVDs Worth? (2026 Price Guide) | SellBookMedia",
  description:
    "Find out what affects the value of used DVDs, Blu-rays and 4K movies, which editions may be worth more, and how to get an instant cash offer by scanning the barcode.",
};

const VALUABLE = [
  {
    name: "Out-of-print titles",
    body: "Movies and releases that are harder to find can sometimes have stronger resale demand, especially when they are no longer widely available.",
  },
  {
    name: "Complete TV series and box sets",
    body: "Multi-disc seasons and complete collections are especially worth checking when all discs and packaging are present.",
  },
  {
    name: "Blu-ray and 4K UHD editions",
    body: "Higher-resolution editions can have different demand and resale value from the standard DVD version of the same movie.",
  },
  {
    name: "Criterion, special, and collector's editions",
    body: "Special packaging, bonus content, limited releases, and collector-focused editions can attract dedicated physical-media buyers.",
  },
  {
    name: "Documentaries and specialty releases",
    body: "Educational, niche, regional, and specialty titles may have smaller print runs and less competition in the used market.",
  },
];

const STEPS = [
  "Scan the barcode on the DVD, Blu-ray, or 4K title with your phone, or enter it manually — no app required.",
  "See your offer instantly for qualifying titles.",
  "Add DVDs, Blu-rays, books, CDs, and games to the same order until you reach the checkout minimum.",
  "Use the prepaid shipping label we email you to send your box.",
  "After your shipment is received and inspected, qualifying items are paid through PayPal.",
];

const FAQ = [
  {
    q: "Why do some DVDs get an offer and others don't?",
    a: "Every title has different demand, resale value, and sales activity. Some editions qualify for an offer while others may not meet our current purchasing criteria.",
  },
  {
    q: "I have a rare box set. Should I scan it?",
    a: "Absolutely. Box sets and unusual editions are especially worth checking. If you believe you have a genuinely rare collectible, you may also want to compare recent collector-market sales before deciding where to sell it.",
  },
  {
    q: "Do you buy Blu-rays and 4K UHD movies?",
    a: "Yes. Scan the barcode just like a DVD and you'll see whether that exact edition qualifies for an offer.",
  },
  {
    q: "What about VHS tapes?",
    a: "We don't currently buy VHS tapes. We focus on DVDs, Blu-rays, 4K UHD, CDs, books, and qualifying video games.",
  },
  {
    q: "Can I check a DVD without creating an account?",
    a: "Yes. You can scan a barcode and check an offer before creating an account.",
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
            DVD, Blu-ray &amp; 4K value guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How much are your used DVDs worth?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Movie values can vary much more than people expect. A common DVD,
            a complete TV box set, a Blu-ray, and a collector&apos;s edition
            can all have very different resale demand. The quickest way to
            know what you have is to scan the barcode.
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
              Why one DVD can be worth more than another
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Used movie value depends largely on{" "}
                <strong className="text-slate-900">
                  supply, demand, format, and the exact edition
                </strong>.
                A widely available DVD may have a very different resale
                market from a limited release, complete series, Blu-ray,
                or 4K edition.
              </p>

              <p>
                Even two versions of the same movie can be different.
                Special features, packaging, format, release year, and
                availability can all affect what buyers are looking for.
              </p>
            </div>

            <div className="mt-7 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-slate-700">
                <strong className="text-slate-900">
                  Don&apos;t judge the whole shelf at once.
                </strong>{" "}
                Scan the individual barcodes. A few titles in an ordinary
                collection can be very different from the rest.
              </p>
            </div>
          </section>

          {/* ===================== EARLY CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Have a movie nearby?
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  See what we&apos;ll pay for it
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan one DVD, Blu-ray, or 4K barcode and see your offer
                  in seconds. No app required and no account needed just
                  to check.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Check My Movie

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
              Movies that are especially worth checking
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              You can&apos;t reliably tell value from the cover alone, but
              certain kinds of releases are particularly worth scanning
              before you donate, discard, or sell your collection elsewhere.
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== OFFERS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Our offers
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Every title gets evaluated individually
            </h2>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Scan the exact edition. See the actual offer.
              </h3>

              <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                Offers vary by title and edition. We look at current market
                value, demand, sales activity, and the specific product
                represented by the barcode before showing an offer.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-[15px] text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  You see the offer before deciding whether to add the item.
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  Blu-rays, 4K titles, box sets, and harder-to-find editions
                  are all worth checking.
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  If a title doesn&apos;t currently meet our purchasing
                  criteria, we&apos;ll simply let you know.
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
              Used DVDs and Blu-rays don&apos;t need to look brand new.
              Light surface marks and normal case wear are generally fine.
              The disc should be playable, complete, and free from serious
              damage.
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
                  Cracked discs, deep playback-affecting scratches, or
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

          {/* ===================== HOW IT WORKS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              From shelf to offer
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Find out what your movies are worth
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              You don&apos;t need to research every title individually.
              Scan the barcode on the back of the case and check the exact
              edition in seconds.
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
              DVD, Blu-ray &amp; 4K value questions
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
  Have a DVD, Blu-ray, or 4K movie in front of you? Learn how to{" "}
  <Link
    href="/guides/media-value-by-barcode"
    className="font-semibold text-blue-600 hover:text-blue-800"
  >
    check its value using the barcode
  </Link>
  .
</p>

          <RelatedGuides currentSlug="how-much-are-used-dvds-worth" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have a movie within reach?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Find out what we&apos;ll pay
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan one DVD, Blu-ray, or 4K barcode and see your offer
              in seconds. No app required and no commitment to sell.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Check My Movie

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