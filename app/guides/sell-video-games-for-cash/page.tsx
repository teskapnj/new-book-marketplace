import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "Sell Video Games for Cash: Complete Guide (2026) | SellBookMedia",
  description:
    "Want to sell your used video games for cash? Learn what your games are worth, which titles hold value, and how to get an instant offer by scanning the barcode.",
};

const HOLDS_VALUE = [
  {
    name: "Nintendo titles",
    body: "Nintendo games famously hold value better than most, especially first-party series.",
  },
  {
    name: "Complete-in-box copies",
    body: "Original case, cover art, and manual present. Missing pieces cut the value sharply.",
  },
  {
    name: "Limited, collector's, and special editions",
    body: "Smaller print runs mean less supply.",
  },
  {
    name: "Out-of-print or delisted titles",
    body: "Games that can't be bought new or downloaded anymore.",
  },
];

const STEPS = [
  "Scan the barcode on the back of the game case with your phone — no account needed to start.",
  "See your cash offer instantly. Accepted games are added to your list.",
  "Reach 5 items total (games, DVDs, CDs, and books can all go in the same box), then ship free with the label we email you.",
  "Get paid via PayPal within 2 business days of us receiving your box.",
];

const FAQ = [
  {
    q: "Do you buy consoles or accessories?",
    a: "Not currently. We buy the games themselves — not consoles, controllers, or other hardware.",
  },
  {
    q: "What if the game case is missing?",
    a: "Games need their original case and cover art to qualify. A loose disc without its case can't be accepted.",
  },
  {
    q: "I think I have a rare retro game. Should I sell it here?",
    a: "If you suspect a game is genuinely rare or collectible, check recent sold listings on eBay first — collectors sometimes pay well above what any bulk buyer would offer. For everything else, scanning is faster and far less work.",
  },
  {
    q: "Can I mix games with books, CDs, and DVDs in one box?",
    a: "Yes. That's the point — scan whatever you've got, hit the 5-item minimum in any combination, and ship it all together.",
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
            Selling guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Sell video games for cash
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Old games pile up fast. Whether you&rsquo;ve moved on to a new console or you&rsquo;re
            just clearing shelf space, here&rsquo;s what your games are actually worth and the
            fastest way to turn them into cash.
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
          {/* ---------- IMZA: uc satis yolu yan yana ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Pick your route
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Three ways to sell, three different trade-offs
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {/* Magaza takasi */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Store trade-in
                </p>
                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">Lowest payout</p>
                  <dl className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">Low</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Paid in</dt>
                      <dd className="font-medium text-slate-700">Often store credit</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* eBay */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  eBay / local
                </p>
                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">Highest ceiling</p>
                  <dl className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">High, per game</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Best for</dt>
                      <dd className="font-medium text-slate-700">Genuinely rare titles</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Buyback */}
              <div className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white shadow-md">
                <p className="border-b border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Buyback (us)
                </p>
                <div className="px-4 py-5">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-mono text-3xl font-bold text-emerald-700 tabular-nums">
                      $1.50
                    </span>
                    <span className="font-medium text-slate-700">and up</span>
                  </div>
                  <dl className="mt-4 space-y-2 border-t border-dashed border-emerald-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">Scan and ship once</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Paid in</dt>
                      <dd className="font-medium text-slate-700">PayPal cash</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <ul className="mt-6 space-y-2.5 text-[16px] leading-relaxed text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
                Pricing reflects current market value and how quickly the title is selling.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
                All major platforms are supported — scan the barcode and find out.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
                If a game isn&rsquo;t worth at least $1.50 to us, we won&rsquo;t make an offer on it.
                We&rsquo;d rather be upfront than have you pack a box for pocket change.
              </li>
            </ul>
          </section>

          {/* ---------- Deger tutan oyunlar ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Sort your shelf
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Which games hold their value?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Game values swing more than almost any other media category. A game that sold ten
              million copies is worth almost nothing; a niche title with a small print run can be
              worth real money. These tend to hold value.
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

            <div className="mt-4 rounded-xl border-l-4 border-rose-500 bg-white px-5 py-4 shadow-sm">
              <p className="font-semibold text-slate-900">The one to expect nothing for</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                Annual sports titles. Last year&rsquo;s edition drops to near zero the moment the next
                one ships.
              </p>
            </div>
          </section>

          {/* ---------- Nasil calisir ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Start to finish
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How it works
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
              Condition requirements
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Games need to be complete and playable: the disc or cartridge should work without
              issues, and the original case and cover art should be included.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">Fine</p>
                <p className="mt-1 text-[15px] text-slate-600">Light wear on the case</p>
              </div>
              <div className="rounded-xl border-l-4 border-rose-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-rose-800">Not accepted</p>
                <p className="mt-1 text-[15px] text-slate-600">
                  Missing artwork, or a scratched, unplayable disc
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

          <RelatedGuides currentSlug="sell-video-games-for-cash" />

          {/* ---------- CTA ---------- */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              See what your games are worth
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Scan a barcode and get an instant offer. No account required to start.
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