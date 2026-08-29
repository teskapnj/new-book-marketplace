import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "Sell Video Games for Cash: Complete Guide (2026) | SellBookMedia",
  description:
    "Sell used video games for cash online. Learn what affects game value and get an instant offer by scanning the barcode — no app required.",
};

const HOLDS_VALUE = [
  {
    name: "Nintendo titles",
    body: "Many first-party Nintendo games continue to attract strong demand even years after release, making them especially worth checking.",
  },
  {
    name: "Complete-in-box games",
    body: "Original cases, cover art, inserts, and complete packaging can make a title more attractive in the resale market.",
  },
  {
    name: "Limited, collector's, and special editions",
    body: "Smaller production runs and special packaging can create stronger demand among collectors.",
  },
  {
    name: "Out-of-print or delisted titles",
    body: "Games that are no longer readily available can sometimes have stronger resale value than common releases.",
  },
  {
    name: "Older and niche releases",
    body: "Some games become harder to find over time, especially titles with smaller print runs or dedicated fan bases.",
  },
];

const STEPS = [
  "Scan the barcode on the game case with your phone, or enter it manually — no app required.",
  "See your offer instantly for qualifying games.",
  "Add games, books, CDs, and DVDs to the same order until you reach the checkout minimum.",
  "Use the prepaid shipping label we email you to send your box.",
  "After your shipment is received and inspected, qualifying items are paid through PayPal.",
];

const FAQ = [
  {
    q: "Do you buy consoles or accessories?",
    a: "Not currently. SellBookMedia focuses on physical video games rather than consoles, controllers, or other gaming hardware.",
  },
  {
    q: "What if the game case is missing?",
    a: "Complete copies are preferred. The game itself must be usable, and packaging requirements can depend on the specific item. Check our condition guidelines before shipping.",
  },
  {
    q: "I think I have a rare retro game. Should I scan it?",
    a: "Yes. Rare, older, and collectible games are especially worth checking. If you believe you have something unusually valuable, you can also compare recent collector-market sales before deciding where to sell.",
  },
  {
    q: "Can I mix games with books, CDs, and DVDs in one box?",
    a: "Yes. Qualifying games, books, CDs, DVDs, Blu-rays, and 4K titles can be combined in the same order.",
  },
  {
    q: "Can I check an offer without creating an account?",
    a: "Yes. You can scan a barcode and see whether a game qualifies for an offer before creating an account.",
  },
];

export default function SellGamesGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Sell Video Games for Cash: A Complete Guide",
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
            Video game selling guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Sell your used video games for cash
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Game values can vary dramatically from one title to another.
            The console, exact release, current demand, and availability
            all matter. The easiest way to find out what your game may be
            worth is to scan the barcode.
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

          {/* ===================== SELLING OPTIONS ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Choose what works for you
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Different ways to sell used games
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              There&apos;s more than one way to sell a game. The best choice
              depends on whether you want maximum convenience, want to manage
              the sale yourself, or have something genuinely collectible.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Store trade-in
                </p>

                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">
                    Quick and local
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">Low</dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">Payment</dt>
                      <dd className="font-medium text-slate-700">
                        Cash or store credit varies
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Marketplace
                </p>

                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">
                    Sell it yourself
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">
                        Higher, per game
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">Best for</dt>
                      <dd className="font-medium text-slate-700">
                        Rare or collectible titles
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white shadow-md">
                <p className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  SellBookMedia
                </p>

                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">
                    Scan, ship, get paid
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-dashed border-emerald-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">
                        Scan and ship together
                      </dd>
                    </div>

                    <div>
                      <dt className="text-slate-500">Payment</dt>
                      <dd className="font-medium text-slate-700">
                        PayPal
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== EARLY CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Have a game nearby?
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  See what we&apos;ll pay for it
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan the barcode and see your offer in seconds. No app
                  required and no account needed just to check.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Check My Game

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

          {/* ===================== VALUE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Check your collection
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Games that are especially worth checking
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Game values can move quickly as titles become harder to find,
              get re-released, or attract new interest. You can&apos;t always
              tell value from the cover alone, but these types are especially
              worth scanning.
            </p>

            <div className="mt-6 space-y-3">
              {HOLDS_VALUE.map((item) => (
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

            <div className="mt-5 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-slate-700">
                <strong className="text-slate-900">
                  Even common-looking games are worth checking.
                </strong>{" "}
                The exact platform, edition, and current demand can make
                a big difference.
              </p>
            </div>
          </section>

          {/* ===================== OFFERS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Our offers
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Every game gets evaluated individually
            </h2>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Scan the exact game. See the actual offer.
              </h3>

              <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                Offers vary by title and platform. We look at current market
                value, demand, sales activity, and the specific product
                represented by the barcode.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-[15px] text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  You see your offer before deciding whether to add the game.
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  Older, limited, collectible, and higher-demand games are
                  especially worth checking.
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  If a title doesn&apos;t currently meet our purchasing
                  criteria, we&apos;ll simply let you know.
                </li>
              </ul>
            </div>
          </section>

          {/* ===================== HOW IT WORKS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Start to finish
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A simple way to sell your games
            </h2>

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
              Used games don&apos;t need to look brand new. Normal case wear
              and light signs of use are generally fine. The game itself
              should be complete enough to use normally and in working
              condition.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">
                  Generally fine
                </p>

                <p className="mt-1 text-[15px] text-slate-600">
                  Normal case wear and light surface marks
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-slate-400 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">
                  Please don&apos;t send
                </p>

                <p className="mt-1 text-[15px] text-slate-600">
                  Broken, badly damaged, or unplayable games
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
              Selling used video games
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

          <RelatedGuides currentSlug="sell-video-games-for-cash" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have a game within reach?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Find out what we&apos;ll pay
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan one game barcode and see your offer in seconds.
              No app required and no commitment to sell.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Check My Game

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