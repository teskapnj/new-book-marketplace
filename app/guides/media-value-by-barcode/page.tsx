import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/media-value-by-barcode`;

export const metadata: Metadata = {
  title: "Find CD, DVD & Blu-ray Value by Barcode | SellBookMedia",
  description:
    "Learn how to use a UPC or barcode to identify CDs, DVDs, Blu-rays, and 4K movies and check their current resale or buyback value.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: "Find CD, DVD & Blu-ray Value by Barcode",
    description:
      "Use a barcode or UPC to identify the exact release of a CD, DVD, Blu-ray, or 4K movie and check its current value.",
    siteName: "SellBookMedia",
  },
};

const FACTORS = [
  {
    factor: "Exact release",
    reason:
      "Different releases of the same album or movie can have different barcodes and different resale values.",
  },
  {
    factor: "Format",
    reason:
      "CD, DVD, Blu-ray, 4K, box sets, and special editions may have very different demand.",
  },
  {
    factor: "Current demand",
    reason:
      "Values can change depending on how many buyers currently want that specific release.",
  },
  {
    factor: "Condition",
    reason:
      "Scratches, missing discs, damaged cases, missing artwork, and other problems can affect eligibility and value.",
  },
  {
    factor: "Availability",
    reason:
      "Harder-to-find, discontinued, or limited releases may sometimes have stronger resale demand than common editions.",
  },
];

const STEPS = [
  {
    title: "Find the barcode",
    body:
      "Look on the back of the CD, DVD, Blu-ray, 4K case, or the outer packaging of a complete box set.",
  },
  {
    title: "Scan or enter the barcode",
    body:
      "Use the barcode from the exact copy in your hand so the correct release can be identified.",
  },
  {
    title: "Check the current offer",
    body:
      "If SellBookMedia is currently buying that release, you can see the cash offer before deciding whether to sell.",
  },
  {
    title: "Check the condition",
    body:
      "The barcode identifies the release, but the physical condition still affects whether an item qualifies.",
  },
];

const FAQ = [
  {
    q: "Can I find the value of a CD or DVD by barcode?",
    a:
      "A barcode can identify the exact release of a CD, DVD, Blu-ray, or 4K movie, but it does not contain the current price. Once the release is identified, current demand, condition, format, and resale activity help determine its value.",
  },
  {
    q: "Where is the barcode on a CD or DVD?",
    a:
      "The barcode is usually printed on the back of the case or outer packaging. For box sets and special editions, use the barcode belonging to the complete set whenever possible.",
  },
  {
    q: "Is a UPC the same as a barcode?",
    a:
      "A UPC is a common type of product barcode used in the United States. CDs, DVDs, Blu-rays, 4K movies, and many other retail products commonly use UPC barcodes.",
  },
  {
    q: "Can two copies of the same movie have different barcodes?",
    a:
      "Yes. A DVD, Blu-ray, 4K edition, collector's edition, re-release, or box set can each have a different barcode even when the movie title is the same.",
  },
  {
    q: "Can two copies of the same CD have different values?",
    a:
      "Yes. Different pressings, reissues, labels, packaging, release years, and editions can have different barcodes and different resale demand.",
  },
  {
    q: "What if the barcode is missing?",
    a:
      "A missing barcode can make exact identification more difficult. Details such as the title, catalog number, label, release year, format, and packaging may help identify the release.",
  },
];

export default function MediaValueByBarcodeGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline:
          "How to Find the Value of CDs, DVDs, Blu-rays and 4K Movies by Barcode",
        description:
          "Learn how UPC and product barcodes help identify exact CD and movie releases and how current resale value is determined.",
        datePublished: "2026-09-03",
        dateModified: "2026-09-03",
        mainEntityOfPage: PAGE_URL,
        author: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: `${SITE_URL}/guides`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Media Value by Barcode",
            item: PAGE_URL,
          },
        ],
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
            Media value guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How to Find the Value of CDs, DVDs, Blu-rays &amp; 4K Movies by
            Barcode
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            A UPC or barcode can identify the exact release of a CD, DVD,
            Blu-ray, or 4K movie so you can check its current resale or buyback
            value.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>

            <span aria-hidden="true" className="text-white/30">
              /
            </span>

            <time dateTime="2026-09-03">Updated September 2026</time>

            <span aria-hidden="true" className="text-white/30">
              /
            </span>

            <span>6 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ===================== QUICK ANSWER ===================== */}
          <section className="mb-8">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-7 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Quick answer
              </p>

              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Can a barcode tell you what a CD or movie is worth?
              </h2>

              <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
                A barcode identifies a specific product or release. It does not
                contain the item&apos;s current price, but it can be used to
                identify the exact CD, DVD, Blu-ray, or 4K movie and check its
                current resale or buyback value.
              </p>
            </div>
          </section>

          {/* ===================== EARLY SCANNER CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border-2 border-blue-300 bg-white shadow-md">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Have an item in front of you?
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  Scan the barcode and check your offer
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan your CD, DVD, Blu-ray, or 4K movie barcode to see
                  whether SellBookMedia is currently buying it and view your
                  cash offer.
                </p>

                <Link
                  href="/"
                  className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-7 py-4 text-base font-bold text-white shadow-md transition hover:bg-blue-700"
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

                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span>Instant offer</span>
                  <span aria-hidden="true">•</span>
                  <span>Free shipping</span>
                  <span aria-hidden="true">•</span>
                  <span>PayPal payment</span>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== HOW TO CHECK ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Step by step
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How to check media value by barcode
            </h2>

            <div className="mt-7 space-y-3">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                >
                  <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== WHAT BARCODE DOES ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Product identification
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What does a UPC barcode tell you?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              A product barcode helps identify a particular retail release.
              That matters because two items with the same title may actually
              be different products.
            </p>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              A movie may have separate DVD, Blu-ray, 4K, collector&apos;s
              edition, steelbook, and box set releases. An album may be issued
              and reissued on CD several times with different packaging,
              labels, or bonus content.
            </p>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              Using the barcode helps identify the exact version instead of
              estimating value from the title alone.
            </p>
          </section>

          {/* ===================== WHERE TO FIND ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Find the barcode
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Where is the barcode on CDs, DVDs, Blu-rays and 4K movies?
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  CDs
                </h3>

                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Usually on the back of the jewel case, digipak, or outer
                  packaging.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  DVDs
                </h3>

                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Usually on the back cover of the original DVD case.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Blu-rays &amp; 4K
                </h3>

                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Look on the back of the original case, slipcover, or outer
                  packaging.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Box sets
                </h3>

                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Use the barcode for the complete outer set rather than a
                  barcode belonging to one disc or component inside it.
                </p>
              </div>
            </div>
          </section>

          {/* ===================== VALUE FACTORS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What changes value?
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What determines the value of used CDs and movies?
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              Identifying the exact barcode is only the first step. Current
              value depends on several other factors.
            </p>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-[0.8fr_1.6fr] bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
                <span>Factor</span>
                <span>Why it matters</span>
              </div>

              {FACTORS.map((item) => (
                <div
                  key={item.factor}
                  className="grid grid-cols-[0.8fr_1.6fr] gap-4 border-t border-slate-200 px-5 py-4 text-[15px]"
                >
                  <span className="font-semibold text-slate-900">
                    {item.factor}
                  </span>

                  <span className="leading-relaxed text-slate-600">
                    {item.reason}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== DVD BLURAY 4K ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Movies
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              DVD vs. Blu-ray vs. 4K value
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              The same movie can exist in several physical formats, and each
              version normally has its own barcode. A standard DVD should not
              be treated as the same product as a Blu-ray or 4K release.
            </p>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              Collector&apos;s editions, steelbooks, complete series sets,
              limited releases, and other versions can also have different
              resale demand from a common release.
            </p>

            <Link
              href="/sell-dvds-for-cash"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Sell DVDs, Blu-rays &amp; 4K movies
              <span className="ml-1.5">→</span>
            </Link>
          </section>

          {/* ===================== CDS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Music
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Why can two copies of the same CD have different values?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Albums can be reissued many times. Different releases may use
              different barcodes and may vary by record label, packaging,
              edition, bonus content, or release year.
            </p>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              That is why checking the barcode on the exact CD in your hand is
              more useful than searching only for the artist and album title.
            </p>

            <Link
              href="/sell-cds-for-cash"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Sell CDs for cash
              <span className="ml-1.5">→</span>
            </Link>
          </section>

          {/* ===================== CONDITION ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Condition still matters
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A matching barcode does not guarantee acceptance
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              A barcode identifies the release, not the physical condition of
              your copy. Deep scratches, missing discs, missing essential
              components, severe damage, mold, or other problems can affect
              whether an item qualifies.
            </p>

            <Link
              href="/condition-guidelines"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              See our condition guidelines
              <span className="ml-1.5">→</span>
            </Link>
          </section>

          {/* ===================== NO BARCODE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Missing barcode
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What if the barcode is missing?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Without the original barcode, identifying the exact release can
              be more difficult because similar-looking editions may have
              different values.
            </p>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              Details such as the catalog number, record label, release year,
              format, edition, and packaging may help identify the correct
              release.
            </p>
          </section>

          {/* ===================== RELATED VALUE GUIDES ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Learn more
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              More about used CD and movie value
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/guides/how-much-are-used-cds-worth"
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300"
              >
                <p className="font-serif text-xl font-bold text-slate-900">
                  How Much Are Used CDs Worth?
                </p>

                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Learn what can affect the value of used CDs and why some
                  releases may be worth more than others.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                  Read the CD value guide →
                </span>
              </Link>

              <Link
                href="/guides/how-much-are-used-dvds-worth"
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300"
              >
                <p className="font-serif text-xl font-bold text-slate-900">
                  How Much Are Used DVDs Worth?
                </p>

                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Learn how format, edition, condition, and current demand can
                  affect used movie value.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                  Read the DVD value guide →
                </span>
              </Link>
            </div>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Barcode and Media Value Questions
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

          <RelatedGuides currentSlug="media-value-by-barcode" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Check the exact release
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Scan your barcode
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              See whether SellBookMedia is currently buying your CD, DVD,
              Blu-ray, or 4K movie and view your cash offer.
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
          </div>
        </article>
      </div>
    </div>
  );
}