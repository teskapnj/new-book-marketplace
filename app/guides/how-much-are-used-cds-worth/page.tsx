import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "How Much Are Used CDs Worth? (2026 Price Guide) | SellBookMedia",
  description:
    "What are your old CDs actually worth in 2026? See what makes a CD valuable, which ones are worth nothing, and how to get a cash offer by scanning the barcode.",
};

// Degerli CD tipleri + elindeki diske bakarak taniyabilecegin fiziksel ipucu
const VALUABLE = [
  {
    name: "Out-of-print albums",
    tell: "Not on streaming services",
    body: "Records that never got a reissue. Independent and regional releases often fall here.",
  },
  {
    name: "Japanese pressings",
    tell: "Obi strip, letter-prefixed catalogue number",
    body: "Collectors seek these out specifically, often paying well above the US edition.",
  },
  {
    name: "Box sets and complete collections",
    tell: "All discs, booklets, and outer packaging present",
    body: "Completeness is everything here — a missing booklet can wipe out most of the value.",
  },
  {
    name: "Classical, jazz, and specialty labels",
    tell: "Small label name on the spine",
    body: "Smaller print runs and a dedicated audience that still buys physical media.",
  },
  {
    name: "Early pressings of albums that later became famous",
    tell: "Original label, not a reissue imprint",
    body: "A first pressing from a band's independent years can be worth many times a later reissue.",
  },
];

const STEPS = [
  "Open the scanner and point your camera at the barcode — no account needed.",
  "See your offer instantly. Accepted items are added to your list automatically.",
  "Once your accepted offers reach $7.50, ship them free with the label we email you, and get paid via PayPal within 2 business days of us receiving your box.",
];

const FAQ = [
  {
    q: "Do you buy vinyl records?",
    a: "Not at the moment. Vinyl has an active collector market of its own, so a local record shop or a direct sale usually gets you a better price than any bulk buyer would.",
  },
  {
    q: "What about cassettes?",
    a: "We don't buy cassettes either. We focus on CDs, DVDs, Blu-rays, 4K discs, books, and video games.",
  },
  {
    q: "Are audiobooks on CD accepted?",
    a: "We don't buy audiobook CD sets. If a title in your list turns out to be an audiobook when we receive it, we won't be able to pay for that item.",
  },
  {
    q: "Why won't you take most of my collection?",
    a: "If a title is worth less than our minimum — usually because there are far more copies in circulation than buyers — we don't make an offer. It's more honest than paying you a few cents for it.",
  },
  {
    q: "I think I have something rare. Should I sell it here?",
    a: "If you believe you have a genuinely scarce pressing, check recent sold listings on eBay first. A collector may pay more than any bulk buyer, including us. For the rest of the shelf, scanning is faster and easier.",
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
            Price guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How much are used CDs worth?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Most people assume their CD collection is worthless. That&rsquo;s true for a lot of it —
            but not all. A shelf of 200 discs usually hides a few that are genuinely worth money.
            Here&rsquo;s what separates them.
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
          {/* ---------- Neden cogu degersiz ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The hard part
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Why most CDs are worth so little
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.75] text-slate-700">
              <p>
                CDs sold in staggering numbers through the 1990s and early 2000s. A hit album might
                have shipped ten million copies in the US alone. Those copies didn&rsquo;t disappear —
                they&rsquo;re sitting in basements, garages, and thrift store bins across the country.
              </p>
              <p>
                When supply is that large and demand has moved to streaming, price collapses. The
                albums everybody owned are the albums nobody will pay for. Greatest hits compilations,
                multi-platinum pop records, and the CDs that came free with a magazine are all in this
                category.
              </p>
            </div>
          </section>

          {/* ---------- IMZA: raf ayiklama rehberi ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Sort your shelf
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What makes a CD actually valuable
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Value comes down to scarcity meeting demand. The useful part: with CDs you can usually
              spot the good ones by looking at the case. Here&rsquo;s what to check for.
            </p>

            <div className="mt-6 space-y-3">
              {VALUABLE.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
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
                  <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Fiyatlandirma ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Our offers
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How we price CDs
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Rather than paying pennies for everything and hoping volume covers it, we only make an
              offer on CDs that are worth something — and when we do, we pay real money.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-5xl font-bold text-emerald-700 tabular-nums">
                  $1.50
                </span>
                <span className="font-serif text-2xl font-semibold text-slate-900">and up</span>
              </div>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-500">
                Minimum offer per disc
              </p>

              <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 text-[15px] text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  Pricing is based on current market value and how well the title is selling.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  Higher-value, faster-selling titles get the higher offers.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  If a title isn&rsquo;t worth at least our minimum, we don&rsquo;t make an offer at
                  all.
                </li>
              </ul>
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
              That last point matters. We&rsquo;d rather tell you honestly that a disc isn&rsquo;t
              worth shipping than have you pack 60 CDs for a few dollars.
            </p>
          </section>

          {/* ---------- Durum ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you pack
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Condition matters
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              A valuable album in poor condition isn&rsquo;t worth much to anyone. To qualify, discs
              should play without skipping, be free of deep scratches, and come complete with the
              original jewel case, cover art, and booklet.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">Fine</p>
                <p className="mt-1 text-[15px] text-slate-600">Light surface wear on the disc</p>
              </div>
              <div className="rounded-xl border-l-4 border-rose-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-rose-800">Not accepted</p>
                <p className="mt-1 text-[15px] text-slate-600">
                  Cracked case with missing artwork
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

          {/* ---------- Nasil ogrenirim ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Check your shelf
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How to find out what yours are worth
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              There&rsquo;s no need to research titles one by one. Scan the barcode on the back of each
              case with your phone and you&rsquo;ll see an instant offer — or a clear &ldquo;not
              accepted&rdquo; if that title isn&rsquo;t worth it.
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

          <RelatedGuides currentSlug="how-much-are-used-cds-worth" />

          {/* ---------- CTA ---------- */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              Find out what your CDs are worth
            </h2>
            <p className="mx-auto mt-3 max-w-md text-blue-100">
              Scan a barcode and see your offer in seconds. No account required to start.
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