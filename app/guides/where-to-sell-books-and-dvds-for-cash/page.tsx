import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "Where to Sell Used Books and DVDs for Cash (2026 Guide) | SellBookMedia",
  description:
    "Looking for where to sell used books, DVDs, CDs, and video games for cash? Compare your options and see how SellBookMedia offers instant quotes with free shipping.",
};

const DIFFERENCES = [
  {
    title: "One platform, four categories",
    body: "Most buyback sites only take books. We accept books, CDs, DVDs, and video games in the same box — no need to sort items across different services.",
  },
  {
    title: "Real cash, not cents",
    body: "Our offers are based on current demand and resale value. Scan your item to see whether it qualifies and what we can offer.",
  },
  {
    title: "Free shipping label",
    body: "Once your bundle is submitted, we email you a free shipping label — no cost to send your box.",
  },
  {
    title: "Fast payment",
    body: "Once we receive and inspect your items, payment is sent to your PayPal within 2 business days.",
  },
];

const STEPS = [
  "Scan the barcode on each book, CD, DVD, or game using your phone's camera — no account needed to start.",
  "See your cash offer for each item instantly, based on current market value.",
  "Once your accepted offers reach $7.50, log in or sign up to continue.",
  "Print your free shipping label and send your box.",
  "Get paid via PayPal within 2 business days of us receiving your items.",
];

const NOT_ACCEPTED = [
  "Writing or highlighting",
  "Deep scratches that affect playback",
  "Water damage",
  "Missing cases or inserts",
  "Strong odors",
  "Ex-library and bootleg copies",
  "VHS and cassette tapes",
];

const FAQ = [
  {
    q: "Do I need an account to check my items' value?",
    a: "No. You can scan and add items without creating an account. You'll only need to log in or sign up once you're ready to ship your box.",
  },
  {
    q: "Is there a minimum number of items?",
    a: "Yes, we require a minimum cash offer of $7.50 per order so that a single shipping label covers the cost of shipping and processing.",
  },
  {
    q: "What happens if an item doesn't meet the condition guidelines?",
    a: "Items that don't meet our very good condition standard are recycled rather than returned, so it's worth double-checking condition before you ship.",
  },
];

export default function WhereToSellGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Where to Sell Used Books and DVDs for Cash",
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
            Where to sell used books and DVDs for cash
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            If you&rsquo;ve got a box of books, DVDs, CDs, or video games gathering dust, you have
            more options than you might think. Here&rsquo;s a straightforward look at where to sell
            them — and what each route costs you in time.
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
          {/* ---------- IMZA: uc yol yan yana ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Pick your route
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Your main options
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {/* Yerel dukkan */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Local shop
                </p>
                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">Same-day cash</p>
                  <dl className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Offers</dt>
                      <dd className="font-medium text-slate-700">In person, item by item</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Catch</dt>
                      <dd className="font-medium text-slate-700">
                        Varies by who&rsquo;s at the counter
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Marketplace */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  eBay / Marketplace
                </p>
                <div className="px-4 py-5">
                  <p className="font-serif text-xl font-bold text-slate-900">Most per item</p>
                  <dl className="mt-4 space-y-2 border-t border-dashed border-slate-200 pt-3 text-sm">
                    <div>
                      <dt className="text-slate-500">Effort</dt>
                      <dd className="font-medium text-slate-700">All of it, per sale</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Catch</dt>
                      <dd className="font-medium text-slate-700">
                        Photos, listings, buyer messages
                      </dd>
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
                      VARIES
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

            <p className="mt-6 text-[16px] leading-relaxed text-slate-600">
              Scan a barcode, get an instant cash offer, ship a whole box at once with a free label —
              no listings, no back-and-forth with buyers.
            </p>
          </section>

          {/* ---------- Farkimiz ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The details
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What makes SellBookMedia different
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {DIFFERENCES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
                </div>
              ))}
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
              What condition do your items need to be in?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              We accept items in <strong className="text-slate-900">very good condition</strong>:
              fully functional, clean, and complete with their original case, cover art, and inserts.
              Minor surface wear is fine — we focus on the disc or book itself.
            </p>

            <div className="mt-6 rounded-xl border border-rose-200 bg-white shadow-sm">
              <p className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-800">
                We can&rsquo;t accept
              </p>
              <ul className="grid gap-2 px-5 py-4 text-[15px] text-slate-700 sm:grid-cols-2">
                {NOT_ACCEPTED.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
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

          <RelatedGuides currentSlug="where-to-sell-books-and-dvds-for-cash" />

          {/* ---------- CTA ---------- */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              Ready to see what your items are worth?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Scan your first barcode and get an instant cash offer. No account required to start.
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