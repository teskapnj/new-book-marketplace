import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

export const metadata: Metadata = {
  title: "How Much Are Used Books Worth? (2026 Price Guide) | SellBookMedia",
  description:
    "What are your used books actually worth? Learn which books hold value, why some sell for more than others, and how to get an instant cash offer by scanning the barcode.",
};

// Kategoriler - tier etiketi okuyucunun rafini ayirmasina yariyor
const CATEGORIES = [
  {
    name: "Textbooks and academic titles",
    tier: "High value",
    tone: "high" as const,
    body: "Often the highest-value category, especially current editions in fields that update slowly. The catch: they must be clean. Highlighting and margin notes — extremely common in textbooks — disqualify a book entirely.",
  },
  {
    name: "Technical and professional books",
    tier: "High value",
    tone: "high" as const,
    body: "Medicine, law, engineering, certification prep, specialized software. Small print runs, professional buyers, consistent demand.",
  },
  {
    name: "Art, photography, and coffee-table books",
    tier: "Steady",
    tone: "mid" as const,
    body: "Expensive to print, often go out of print quickly, and collectors seek them out. Condition matters a lot here since the appeal is visual.",
  },
  {
    name: "Niche non-fiction and out-of-print titles",
    tier: "Steady",
    tone: "mid" as const,
    body: "Specialized histories, regional interest, hobbyist manuals, anything that was never reprinted. Scarcity does the work.",
  },
  {
    name: "Mass-market bestsellers",
    tier: "Low value",
    tone: "low" as const,
    body: "The paperback thriller everyone read on vacation. Millions of copies, thousands listed used at any moment. These are usually worth close to nothing regardless of condition.",
  },
];

const TIER_STYLES = {
  high: "bg-emerald-100 text-emerald-800",
  mid: "bg-blue-100 text-blue-800",
  low: "bg-rose-100 text-rose-800",
};

const ACCEPTED = [
  "Clean pages, no writing",
  "Intact binding and cover",
  "Light shelf wear is fine",
  "All pages present",
];

const REJECTED = [
  "Writing or highlighting",
  "Water damage or stains",
  "Ex-library copies",
  "Strong odors (smoke, mildew)",
];

const STEPS = [
  "Scan each book's barcode with your camera — no account needed to start.",
  "Accepted books are added to your list with their offer shown.",
  "Reach 5 items (books, CDs, DVDs, and games can share a box), then ship free with the label we email you.",
  "Get paid via PayPal within 2 business days of us receiving your box.",
];

const FAQ = [
  {
    q: "Why won't you take most of my paperbacks?",
    a: "Popular fiction usually has enormous used supply and low demand, which pushes the market value below our $1.50 minimum. It's not about the book being bad — it's about how many copies already exist.",
  },
  {
    q: "Do you buy textbooks?",
    a: "Yes, and they're often among the most valuable books people send us — as long as they're clean. Highlighting or written notes disqualify a book, which unfortunately rules out a lot of used textbooks.",
  },
  {
    q: "What about old or antique books?",
    a: "Books without a scannable ISBN barcode (generally anything published before the 1970s) can't go through our system. If you think you have something genuinely rare or antiquarian, a specialist dealer will serve you far better than any bulk buyer.",
  },
  {
    q: "Is a hardcover worth more than a paperback?",
    a: "Sometimes, but not automatically. What matters is the specific title's supply and demand, not the format. A common hardcover can be worth less than a scarce paperback.",
  },
  {
    q: "My book has a small stamp inside. Is that ex-library?",
    a: "Ex-library books — those with library stamps, stickers, barcodes, or pocket labels — can't be accepted, even if the pages themselves are clean.",
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
            How much are used books worth?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Two books can look nearly identical on your shelf and be worth wildly different amounts.
            One might be worth several dollars, the other nothing at all. Here&rsquo;s what actually drives book
            value, which categories hold up best, and how to check your own shelf without looking up
            titles one by one.
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
            <span>6 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ---------- IMZA: arz vs talep ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The one rule
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What determines a used book&rsquo;s value
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              It comes down to a simple tension:{" "}
              <strong className="text-slate-900">how many copies exist</strong> versus{" "}
              <strong className="text-slate-900">how many people still want one</strong>. Everything
              else is a variation on that theme.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-rose-600">
                  High supply
                </p>
                <p className="mt-3 font-serif text-3xl font-bold text-slate-900">10,000,000</p>
                <p className="mt-1 text-sm text-slate-500">copies printed</p>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  A blockbuster novel competes against thousands of used copies for sale right now.
                  Supply overwhelms demand and the price falls to almost nothing.
                </p>
                <p className="mt-4 border-t border-slate-100 pt-3 font-mono text-sm font-semibold text-rose-600">
                  Worth ≈ $0
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Low supply
                </p>
                <p className="mt-3 font-serif text-3xl font-bold text-slate-900">2,000</p>
                <p className="mt-1 text-sm text-slate-500">copies printed</p>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  A specialized technical book has only a handful of used copies available at any
                  time, and the people who need it really need it.
                </p>
                <p className="mt-4 border-t border-slate-100 pt-3 font-mono text-sm font-semibold text-emerald-700">
                  Offers start at $1.50
                </p>
              </div>
            </div>

            <p className="mt-6 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 text-[16px] leading-relaxed text-slate-700 shadow-sm">
              This is why &ldquo;is my book old?&rdquo; is usually the wrong question. Age alone
              doesn&rsquo;t create value — scarcity and demand do.
            </p>
          </section>

          {/* ---------- Kategoriler ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Sort your shelf
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Which books tend to hold value
            </h2>

            <div className="mt-6 space-y-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        TIER_STYLES[cat.tone]
                      }`}
                    >
                      {cat.tier}
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{cat.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Ne odiyoruz ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Our offers
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What we pay for books
            </h2>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-5xl font-bold text-emerald-700 tabular-nums">
                  $1.50
                </span>
                <span className="font-serif text-2xl font-semibold text-slate-900">and up</span>
              </div>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-500">
                Minimum offer per book
              </p>

              <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 text-[15px] text-slate-700">
                
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  Pricing reflects current market value and how quickly the title is selling.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  If a book isn&rsquo;t worth at least $1.50 to us, we don&rsquo;t make an offer on it.
                </li>
              </ul>
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
              We&rsquo;d rather tell you honestly that a paperback isn&rsquo;t worth shipping than pay
              you three cents for it. That&rsquo;s why some of your books won&rsquo;t get an offer —
              not because there&rsquo;s anything wrong with them, but because there are already too
              many copies out there.
            </p>
          </section>

          {/* ---------- Durum ---------- */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Pass or fail
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Condition is a hard filter
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              With books, condition isn&rsquo;t a sliding scale for us — it&rsquo;s pass or fail. A
              valuable title in poor condition isn&rsquo;t worth anything to the next reader, so we
              hold a firm line.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-200 bg-white shadow-sm">
                <p className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
                  Accepted
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

              <div className="rounded-xl border border-rose-200 bg-white shadow-sm">
                <p className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-800">
                  Not accepted
                </p>
                <ul className="space-y-2 px-5 py-4 text-[15px] text-slate-700">
                  {REJECTED.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 rounded-xl border-l-4 border-amber-500 bg-white px-5 py-4 shadow-sm">
              <p className="font-semibold text-slate-900">A note on textbooks</p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                They&rsquo;re often the most valuable books people own, but also the most likely to be
                highlighted. If yours are clean, they&rsquo;re well worth scanning. If every page is
                marked up, they won&rsquo;t qualify.
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
              Find out what your books are worth
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Don&rsquo;t look them up one at a time. Scan the barcode on the back cover (or the ISBN)
              with your phone and you&rsquo;ll see an offer instantly — or a clear &ldquo;not
              accepted&rdquo; so you know to set it aside.
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

          <RelatedGuides currentSlug="how-much-are-used-books-worth" />

          {/* ---------- CTA ---------- */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
            <h2 className="font-serif text-2xl font-bold text-white">
              See what your books are worth
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