import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "How Much Are Used Books Worth? (2026 Price Guide) | SellBookMedia",
  description:
    "Find out what affects used book value, which types of books may be worth more, and how to get an instant cash offer by scanning the ISBN or barcode.",
};

const CATEGORIES = [
  {
    name: "Textbooks and academic titles",
    tier: "Worth checking",
    tone: "high" as const,
    body: "Current textbooks and academic titles can still have strong resale demand, especially when the edition is useful and the book is in good condition.",
  },
  {
    name: "Technical and professional books",
    tier: "Worth checking",
    tone: "high" as const,
    body: "Engineering, medicine, law, certification, trade, and other specialized books can hold value because buyers may be looking for a very specific title or edition.",
  },
  {
    name: "Art, photography, and specialty books",
    tier: "Can hold value",
    tone: "mid" as const,
    body: "Large-format, visual, niche, and harder-to-find books can be worth checking, particularly when they are complete and in good usable condition.",
  },
  {
    name: "Niche non-fiction and out-of-print titles",
    tier: "Can surprise you",
    tone: "mid" as const,
    body: "Specialized history, hobbies, regional topics, manuals, and books with smaller print runs can sometimes have demand that isn't obvious from looking at the cover.",
  },
  {
    name: "Popular fiction and common paperbacks",
    tier: "Varies",
    tone: "low" as const,
    body: "Common titles often have more used copies available, which can affect value. But the exact edition and current demand matter, so scanning the barcode is still the easiest way to know.",
  },
];

const TIER_STYLES = {
  high: "bg-emerald-100 text-emerald-800",
  mid: "bg-blue-100 text-blue-800",
  low: "bg-slate-100 text-slate-700",
};

const ACCEPTED = [
  "Clean, readable pages",
  "Intact binding and cover",
  "Normal shelf wear",
  "All pages present",
];

const REJECTED = [
  "Heavy writing or excessive highlighting",
  "Water damage, mold, or heavy stains",
  "Missing pages or serious damage",
  "Strong smoke or mildew odors",
];

const STEPS = [
  "Scan the ISBN or barcode with your phone, or enter it manually — no app required.",
  "See your offer instantly for qualifying books.",
  "Add books, CDs, DVDs, and games to the same order until you reach the checkout minimum.",
  "Use the prepaid shipping label we email you to send your box.",
  "After your shipment is received and inspected, qualifying items are paid through PayPal.",
];

const FAQ = [
  {
    q: "Why are some used books worth more than others?",
    a: "Used book value depends on the specific title, edition, current demand, available supply, and resale market. Two similar-looking books can have very different values.",
  },
  {
    q: "Do you buy textbooks?",
    a: "Yes. Textbooks and academic titles are worth scanning, especially current or specialized editions. Condition still matters, so books with major damage or excessive markings may not qualify.",
  },
  {
    q: "What about old or antique books?",
    a: "Our system works best with books that have a scannable ISBN or barcode. Truly rare or antiquarian books may be better evaluated by a specialist dealer who works specifically with collectible books.",
  },
  {
    q: "Is a hardcover worth more than a paperback?",
    a: "Not automatically. The title, edition, supply, and current demand usually matter more than the binding alone.",
  },
  {
    q: "Can I check a book without creating an account?",
    a: "Yes. You can scan or enter a barcode and see whether your book qualifies for an offer before creating an account.",
  },
];

export default function BookValueGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How Much Are Used Books Worth?",
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
            Used book value guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How much are your used books worth?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            There&apos;s no single price for a used book. The exact title,
            edition, demand, and resale market can make two books that look
            similar worth very different amounts. The quickest way to know
            is to check the barcode.
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
              Why one used book may be worth more than another
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              A used book&apos;s value is driven largely by{" "}
              <strong className="text-slate-900">supply and demand</strong>.
              A book with many used copies available may have a lower resale
              value, while a harder-to-find title with active demand can be
              much more interesting to buyers.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                  More available copies
                </p>

                <h3 className="mt-3 font-serif text-2xl font-bold text-slate-900">
                  Supply matters
                </h3>

                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  Popular books can have thousands of used copies competing
                  for the same buyers. That can push resale prices lower even
                  when the book itself is in excellent condition.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Stronger demand
                </p>

                <h3 className="mt-3 font-serif text-2xl font-bold text-slate-900">
                  The right title can stand out
                </h3>

                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  Specialized, current, or harder-to-find books may have fewer
                  copies available and buyers actively searching for them.
                </p>
              </div>
            </div>

            <p className="mt-6 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 text-[16px] leading-relaxed text-slate-700 shadow-sm">
              <strong className="text-slate-900">
                Don&apos;t judge a book by age or appearance alone.
              </strong>{" "}
              The barcode tells us exactly which edition you have, which is
              why scanning it gives you a much better answer.
            </p>
          </section>

          {/* ===================== EARLY CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Have a book nearby?
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  See what we&apos;ll pay for it
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan the barcode and get an instant offer in seconds.
                  No app required and no account needed just to check.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Check My Book

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

          {/* ===================== CATEGORIES ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Check your shelf
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Which types of books are worth checking?
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              You can&apos;t reliably tell what a book is worth just from its
              category, but some types are especially worth scanning before
              you donate, give away, or set them aside.
            </p>

            <div className="mt-6 space-y-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="font-semibold text-slate-900">
                      {cat.name}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        TIER_STYLES[cat.tone]
                      }`}
                    >
                      {cat.tier}
                    </span>
                  </div>

                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    {cat.body}
                  </p>
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
              Every book gets evaluated individually
            </h2>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                No guessing. Scan the exact edition.
              </h3>

              <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                Offers vary from title to title. We look at the specific book,
                current market value, demand, and sales activity before showing
                you an offer.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-[15px] text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  You see your offer before deciding whether to add the book.
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  Higher-demand titles may receive stronger offers.
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
              Condition matters
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Normal wear is okay
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Used books don&apos;t need to look brand new. Normal shelf wear
              and signs of regular use are generally fine. We&apos;re mainly
              looking for books that are clean, complete, readable, and free
              from major damage.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-white shadow-sm">
                <p className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
                  Good to send
                </p>

                <ul className="space-y-2 px-5 py-4 text-[15px] text-slate-700">
                  {ACCEPTED.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800">
                  Please don&apos;t send
                </p>

                <ul className="space-y-2 px-5 py-4 text-[15px] text-slate-700">
                  {REJECTED.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
              <p className="font-semibold text-slate-900">
                Have textbooks?
              </p>

              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                They&apos;re definitely worth checking. Specialized and current
                editions can have good resale demand, so scan the barcode before
                deciding what to do with them.
              </p>
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
              Find out what your books are worth
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              You don&apos;t need to search marketplace listings or research
              every title individually. Scan the ISBN or barcode and check
              the specific book in seconds.
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
              Used book value questions
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

          <RelatedGuides currentSlug="how-much-are-used-books-worth" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have a book within reach?
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
              Check My Book

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