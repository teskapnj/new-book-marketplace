import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title:
    "Decluttr Shut Down: Where to Sell Your Books, CDs, DVDs & Games Now | SellBookMedia",
  description:
    "Decluttr shut down in 2025. See another simple way to sell used books, CDs, DVDs, Blu-rays, 4K movies, and video games online for cash.",
};

const TIMELINE = [
  {
    date: "2013",
    title: "Decluttr starts buying back media",
    body: "Books, CDs, DVDs, games, and tech through the scan-and-ship model many sellers became familiar with.",
  },
  {
    date: "Late 2024",
    title: "Parent company changes hands",
    body: "Decluttr was owned by musicMagpie, a UK company that was acquired by AO World.",
  },
  {
    date: "Early 2025",
    title: "Changes begin to surface",
    body: "Some sellers reported slower payouts and customer-service issues in the months leading up to the closure.",
  },
  {
    date: "June 2025",
    title: "Decluttr shuts down",
    body: "The service stopped accepting new business, leaving longtime users looking for another place to sell their used media.",
  },
];

const CHECKLIST = [
  {
    title: "Instant barcode offers",
    body: "You should be able to quickly check what individual items are worth before committing to an order.",
  },
  {
    title: "Multiple categories in one box",
    body: "Selling books, CDs, DVDs, Blu-rays, and games together saves time compared with splitting everything between services.",
  },
  {
    title: "Free shipping",
    body: "A prepaid label keeps shipping costs from eating into the value of your order.",
  },
  {
    title: "Clear condition guidelines",
    body: "Simple rules help you know what to send before you pack your box.",
  },
];

const STEPS = [
  "Scan the barcode on your item with your phone or enter it manually — no app required.",
  "See your cash offer instantly and add accepted items to your box.",
  "Once your order reaches the minimum checkout amount, continue with your shipping information.",
  "Use the prepaid shipping label we email you to send your box.",
  "After your shipment is received and inspected, qualifying items are paid through PayPal.",
];

const FAQ = [
  {
    q: "Is Decluttr coming back?",
    a: "There has been no public indication that the former U.S. Decluttr buyback service is returning. If you previously used Decluttr to sell media, you'll need another service for new orders.",
  },
  {
    q: "What about an old Decluttr order?",
    a: "SellBookMedia isn't affiliated with Decluttr and can't access previous Decluttr orders. For an existing order, check any current support information provided by Decluttr or its former operator.",
  },
  {
    q: "Does SellBookMedia buy the same types of items?",
    a: "We focus on used books, music CDs, DVDs, Blu-rays, 4K UHD movies, and qualifying video games. We don't currently buy phones, tablets, or other consumer electronics.",
  },
  {
    q: "Do I need an account to check an offer?",
    a: "No. You can start scanning barcodes and checking offers before creating an account.",
  },
];

export default function DecluttrAlternativeGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline:
          "Decluttr Shut Down — Where to Sell Your Books, CDs, DVDs, and Games Now",
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
            Decluttr alternative
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Decluttr shut down. Here&apos;s another way to sell your media.
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            If you used Decluttr to clear out books, CDs, DVDs, and games,
            you don&apos;t have to go back to listing everything one item
            at a time. You can still scan barcodes, check offers, and ship
            qualifying items together.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <time dateTime="2026-08-29">Updated August 2026</time>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <span>4 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>

          {/* ===================== WHAT HAPPENED ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What happened
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What happened to Decluttr?
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              Decluttr became popular because it made selling used media
              relatively simple: scan an item, receive an offer, and ship
              multiple products together. After years in the U.S. market,
              the service shut down in 2025.
            </p>

            <ol className="mt-8 relative border-l-2 border-slate-200 pl-6 sm:pl-8">
              {TIMELINE.map((item, i) => {
                const isLast = i === TIMELINE.length - 1;

                return (
                  <li key={item.date} className={isLast ? "" : "pb-8"}>
                    <span
                      className={`absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white ring-1 ${
                        isLast
                          ? "bg-rose-500 ring-rose-200"
                          : "bg-slate-300 ring-slate-200"
                      }`}
                      aria-hidden="true"
                    />

                    <p
                      className={`font-mono text-xs font-semibold uppercase tracking-wider ${
                        isLast ? "text-rose-600" : "text-slate-500"
                      }`}
                    >
                      {item.date}
                    </p>

                    <h3 className="mt-1.5 font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[16px] leading-relaxed text-slate-600">
                      {item.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ===================== EARLY CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Looking for a replacement?
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  See what we&apos;ll pay for your items
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Have an old book, CD, DVD, Blu-ray, or game nearby?
                  Scan one barcode and get an instant offer. There&apos;s
                  no app to download and no account needed just to check.
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
                    Free shipping • PayPal payment
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== WHAT TO LOOK FOR ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Your checklist
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What to look for in a Decluttr alternative
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              If you liked the simplicity of scanning and shipping through
              Decluttr, look for another service that keeps the process
              straightforward. These are some of the features that matter
              most when you&apos;re clearing out more than a few items.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CHECKLIST.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
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
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== SELLBOOKMEDIA ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Another option
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How SellBookMedia works
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              SellBookMedia uses a familiar buyback approach: check
              individual items by barcode, build a box with the offers
              you want to accept, ship everything together, and receive
              payment after inspection.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-5">
                <p className="text-[16px] leading-relaxed text-emerald-900">
                  Start by scanning a single barcode. You&apos;ll see your
                  offer immediately before deciding whether you want to
                  continue.
                </p>
              </div>

              <dl className="divide-y divide-slate-100">
                {[
                  ["Offers", "Instant offer for each qualifying barcode"],
                  [
                    "Categories",
                    "Books, CDs, DVDs, Blu-rays, 4K UHD, and video games",
                  ],
                  ["App", "No app download required"],
                  ["Shipping", "Free prepaid shipping label"],
                  ["Payment", "PayPal after your shipment is inspected"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:gap-6"
                  >
                    <dt className="w-40 flex-shrink-0 text-sm font-semibold text-slate-500">
                      {label}
                    </dt>

                    <dd className="text-[16px] text-slate-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* ===================== HOW IT WORKS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Start to finish
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Five simple steps
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

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Still looking for a Decluttr replacement?
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

          <RelatedGuides currentSlug="decluttr-shut-down-alternative" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Try it with one item
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              See what your old media is worth
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan one barcode and see your offer in seconds. No app
              required and no commitment to sell.
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