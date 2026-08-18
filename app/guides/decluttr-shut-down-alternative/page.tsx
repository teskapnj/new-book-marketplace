import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "Decluttr Shut Down: Where to Sell Your Books, CDs, DVDs & Games Now | SellBookMedia",
  description:
    "Decluttr closed in June 2025 with no warning. Here's what happened and where sellers can go instead to sell used books, CDs, DVDs, and video games for cash.",
};

// Zaman cizelgesi - bu sayfada sira gercek bilgi tasiyor, o yuzden numarali degil tarihli
const TIMELINE = [
  {
    date: "2013",
    title: "Decluttr starts buying back media",
    body: "Books, CDs, DVDs, games, and tech, using the scan-and-ship model most sellers know it for.",
  },
  {
    date: "Late 2024",
    title: "Parent company changes hands",
    body: "Decluttr was owned by musicMagpie, a UK company that was itself acquired by AO World.",
  },
  {
    date: "Early 2025",
    title: "Warning signs",
    body: "Sellers report slower payouts and declining customer service in the months before the close.",
  },
  {
    date: "June 2025",
    title: "Immediate shutdown",
    body: "Customers are emailed that the service is closing at once, citing only general business reasons. No advance notice, no transition period.",
  },
];

const CHECKLIST = [
  {
    title: "Covers the same categories",
    body: "Books, CDs, DVDs, and games in one box, not split across different services.",
  },
  {
    title: "Real per-item offers",
    body: "Not a cents-based bulk rate that barely covers your time.",
  },
  {
    title: "Free shipping label",
    body: "So you're not paying out of pocket to send your box.",
  },
  {
    title: "Clear condition guidelines up front",
    body: "So there are no surprises when your items are inspected.",
  },
];

const STEPS = [
  "Scan the barcode on each item with your phone's camera — no account needed to start.",
  "See your cash offer instantly for each item.",
  "Once you have at least 5 items, log in or sign up to continue.",
  "Ship your box with the free label we email you once your bundle is approved.",
  "Get paid via PayPal within 2 business days of us receiving your items.",
];

const FAQ = [
  {
    q: "Is Decluttr coming back?",
    a: "There's no public indication of a relaunch or rebrand. The company's own communications describe the closure as final.",
  },
  {
    q: "What about my order that was already in progress with Decluttr?",
    a: "Check Decluttr's website directly for any current support information regarding pending orders. We're not affiliated with Decluttr and can't access or resolve existing orders on your behalf.",
  },
  {
    q: "Do you accept the same items Decluttr did?",
    a: "We focus on books, CDs, DVDs, and video games. We don't currently buy back phones, tablets, or other tech — if that's mainly what you sold on Decluttr, our media categories are still worth checking, but you may need a separate service for electronics.",
  },
];

export default function DecluttrAlternativeGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Decluttr Shut Down — Where to Sell Your Books, CDs, DVDs, and Games Now",
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
            Service closed
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Decluttr shut down. Here&rsquo;s where to sell your media now.
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            If you used to send your old media to Decluttr, you probably already know it closed
            abruptly in mid-2025. Here&rsquo;s a quick recap of what happened, and a straightforward
            option for selling your books, CDs, DVDs, and games now that it&rsquo;s gone.
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
            <span>4 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ---------- IMZA: zaman cizelgesi ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What happened
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How a twelve-year-old service closed overnight
            </h2>

            <ol className="mt-8 relative border-l-2 border-slate-200 pl-6 sm:pl-8">
              {TIMELINE.map((item, i) => {
                const isLast = i === TIMELINE.length - 1;
                return (
                  <li key={item.date} className={isLast ? "" : "pb-8"}>
                    <span
                      className={`absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white ring-1 ${
                        isLast ? "bg-rose-500 ring-rose-200" : "bg-slate-300 ring-slate-200"
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
                    <h3 className="mt-1.5 font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-[16px] leading-relaxed text-slate-600">{item.body}</p>
                  </li>
                );
              })}
            </ol>

            <p className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4 text-[16px] leading-relaxed text-slate-700 shadow-sm">
              As of now, there&rsquo;s no indication Decluttr is reopening or rebranding. If you have
              an old order still pending, your best bet is to check their site directly for support
              contact information — but for anything new, you&rsquo;ll need a different place to
              sell.
            </p>
          </section>

          {/* ---------- Ne aramali ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Your checklist
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What to look for in a replacement
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Not every buyback site works the same way. If you&rsquo;re used to Decluttr&rsquo;s
              scan-and-ship model, these four things matter most when picking where to go next.
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Karsilastirma ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              One option
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How SellBookMedia compares
            </h2>

            <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-5">
                <p className="text-[16px] leading-relaxed text-emerald-900">
                  We work the same way you&rsquo;re used to — scan a barcode, get an instant offer,
                  ship a box — with a few differences sellers coming from Decluttr tend to notice.
                </p>
              </div>
              <dl className="divide-y divide-slate-100">
                {[
                  ["Minimum offer", "$1.50 per item, not fractions of a cent"],
                  ["Categories", "Books, CDs, DVDs, and games in the same bundle"],
                  ["Account", "Not required to scan and build your box"],
                  ["Shipping", "Free label once your bundle is approved"],
                  ["Payment", "PayPal, within 2 business days of us receiving your items"],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:gap-6">
                    <dt className="w-40 flex-shrink-0 text-sm font-semibold text-slate-500">
                      {label}
                    </dt>
                    <dd className="text-[16px] text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
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

          <RelatedGuides currentSlug="decluttr-shut-down-alternative" />

          {/* ---------- CTA ---------- */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              Ready to turn your collection into cash?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Scan your first barcode and get an instant offer. No account required to start.
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