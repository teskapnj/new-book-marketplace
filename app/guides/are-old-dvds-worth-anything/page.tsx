import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/are-old-dvds-worth-anything`;

export const metadata: Metadata = {
  title: "Are Old DVDs Worth Anything? Valuable DVDs to Look For | SellBookMedia",
  description:
    "Are old DVDs worth anything? Learn which DVDs may have value, including box sets, rare releases, collector's editions, anime, and out-of-print titles.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title:
      "Are Old DVDs Worth Anything? 10 Types of DVDs That Can Still Be Valuable",
    description:
      "Learn which types of old DVDs may still have resale value and how to check the exact release using its barcode.",
    siteName: "SellBookMedia",
  },
};

const FAQ = [
  {
    q: "Are old DVDs worth money?",
    a: "Some are. DVD value depends on the exact release, current demand, availability, condition, and whether the item or set is complete.",
  },
  {
    q: "What types of DVDs can be worth more?",
    a: "Complete TV series, box sets, discontinued releases, collector's editions, anime, cult films, concert DVDs, and certain specialty releases can be worth checking.",
  },
  {
    q: "Does a sealed DVD have more value?",
    a: "Sometimes, but being sealed does not automatically make a DVD valuable. Demand and the exact edition are usually more important.",
  },
  {
    q: "How do I find the value of a DVD?",
    a: "The easiest way is to use the UPC barcode on the case to identify the exact release and check its current resale or buyback value.",
  },
  {
    q: "Are DVDs without cases worth anything?",
    a: "They may have some value, but missing cases, artwork, inserts, or discs can reduce resale value or make the item unacceptable to some buyers.",
  },
  {
    q: "Does an old DVD automatically become valuable?",
    a: "No. Age alone does not determine value. Demand, edition, availability, condition, and current market activity matter much more.",
  },
];

export default function AreOldDVDsWorthAnythingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline:
          "Are Old DVDs Worth Anything? 10 Types of DVDs That Can Still Be Valuable",
        datePublished: "2026-09-06",
        dateModified: "2026-09-06",
        author: {
          "@type": "Organization",
          name: "SellBookMedia",
        },
        publisher: {
          "@type": "Organization",
          name: "SellBookMedia",
        },
        mainEntityOfPage: PAGE_URL,
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
            DVD value guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Are old DVDs worth anything? 10 types of DVDs that can still be
            valuable
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            A shelf full of old DVDs may look ordinary, but some releases are
            much more interesting than others. Box sets, discontinued titles,
            collector&apos;s editions, anime, concert DVDs, and niche releases
            can all be worth checking.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>

            <span aria-hidden="true" className="text-white/30">
              /
            </span>

            <time dateTime="2026-09-06">Updated September 2026</time>

            <span aria-hidden="true" className="text-white/30">
              /
            </span>

            <span>7 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ===================== QUICK ANSWER ===================== */}
          <section className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Quick answer
            </p>

            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-6 sm:px-7">
              <p className="text-[17px] leading-[1.75] text-slate-700">
                Yes. Many common DVDs have relatively low resale value, but
                certain releases can still be worth checking. Complete TV
                series, discontinued titles, collector&apos;s editions, niche
                movies, anime, concert DVDs, and unusual box sets may be more
                valuable than ordinary mass-market releases.
              </p>

              <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
                The title alone is not enough to determine value. The exact
                edition matters, and the UPC barcode on the case is usually the
                easiest way to identify it.
              </p>
            </div>
          </section>

          {/* ===================== TOP CTA ===================== */}
          <section className="mb-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-9 text-center sm:px-10 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have DVDs within reach?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Check your DVDs now
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan the barcode and see whether your DVD qualifies for a current
              SellBookMedia offer.
            </p>

            <Link
              href="/#quote"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Scan My DVDs

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
              <span>PayPal, Venmo, or check by mail payment</span>
            </div>
          </section>

          {/* ===================== INTRO ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What creates value?
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Why some old DVDs are still worth checking
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                DVDs were produced in enormous numbers, so age by itself does
                not make a disc rare. A common movie that sold millions of
                copies may still have very little resale value years later.
              </p>

              <p>
                The interesting DVDs are often the ones with something
                different about them: limited production, unusual packaging, a
                complete series, a discontinued release, a niche audience, or
                continued demand after new copies become harder to find.
              </p>

              <p>
                If you want a broader explanation of how DVD pricing works, read
                our{" "}
                <Link
                  href="/guides/how-much-are-used-dvds-worth"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  guide to used DVD value
                </Link>
                .
              </p>
            </div>
          </section>

          {/* ===================== 1 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 1
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Complete TV series and box sets
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Multi-disc collections and complete-series sets are often more
                interesting than individual season discs. Someone looking for
                an entire television series may prefer one complete collection
                instead of collecting each season separately.
              </p>

              <p>
                Make sure all discs, cases, sleeves, and other pieces that
                belong to the set are present. Missing discs can significantly
                affect value.
              </p>
            </div>

            <div className="mt-5 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Worth checking
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                Complete-series sets, multi-season collections, premium box
                sets, and sets with all original discs and packaging.
              </p>
            </div>
          </section>

          {/* ===================== 2 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 2
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Out-of-print and discontinued DVDs
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Some movies or television releases eventually stop being
                manufactured. If people still want a title after new copies
                become difficult to find, existing copies can become more
                desirable.
              </p>

              <p>
                Being out of print does not automatically make a DVD valuable.
                There still needs to be enough demand for that exact release.
              </p>
            </div>
          </section>

          {/* ===================== 3 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 3
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Collector&apos;s editions and limited editions
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              Special releases can be worth checking because they may include
              packaging, artwork, bonus discs, or other material that does not
              come with the standard edition.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Collector's Edition",
                "Limited Edition",
                "Anniversary Edition",
                "Special Edition",
                "Bonus-disc releases",
                "Premium packaging",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== 4 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 4
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Horror, cult, and niche movies
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Mainstream blockbusters are not always the DVDs collectors are
                searching for. Horror, cult, independent, and other niche films
                can sometimes maintain a dedicated audience years after their
                original release.
              </p>

              <p>
                Lower availability combined with continuing collector interest
                can make some unusual releases worth checking.
              </p>
            </div>
          </section>

          {/* ===================== 5 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 5
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Anime DVDs and box sets
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Older anime releases can be especially interesting when a
                series, English-language edition, or complete collection is no
                longer easy to find.
              </p>

              <p>
                Complete sets and limited editions are generally more useful to
                check than incomplete collections. Not every anime DVD is
                valuable simply because it is old.
              </p>
            </div>
          </section>

          {/* ===================== 6 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 6
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Concert and music DVDs
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Concert films, live performances, music documentaries, and
                special performance releases can attract buyers interested in a
                particular artist or event.
              </p>

              <p>
                Some performances were released on DVD for a limited period and
                may not be as easy to replace through newer formats or
                streaming services.
              </p>
            </div>
          </section>

          {/* ===================== 7 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 7
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Educational, fitness, and specialty DVDs
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Not every potentially useful DVD is a movie. Instructional
                programs, training material, fitness series, documentaries,
                language-learning sets, and other specialty releases may have
                smaller but more specific audiences.
              </p>

              <p>
                These titles can be easy to overlook because their covers may
                not look collectible at all.
              </p>
            </div>
          </section>

          {/* ===================== 8 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 8
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Foreign and international releases
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Certain international, foreign-language, or
                limited-distribution releases can have different availability
                than the standard U.S. edition.
              </p>
            </div>

            <div className="mt-5 rounded-xl border-l-4 border-amber-400 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-900">
                Check the exact edition
              </p>

              <p className="mt-1 text-[15px] leading-relaxed text-amber-900/80">
                Region codes, PAL versus NTSC formats, packaging, language, and
                barcode differences can identify different releases of the same
                movie.
              </p>
            </div>
          </section>

          {/* ===================== 9 ===================== */}
          <section className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 9
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Sealed or complete copies
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                A factory-sealed copy can sometimes be more desirable than an
                open copy, but sealed does not automatically mean valuable. A
                common DVD with very little demand may remain inexpensive even
                when unopened.
              </p>

              <p>
                For used copies, condition and completeness matter. Original
                cases, artwork, inserts, and all included discs can make a
                meaningful difference.
              </p>
            </div>

            <Link
              href="/condition-guidelines"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              See our condition guidelines

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

          {/* ===================== 10 ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Type 10
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              DVDs with unexpectedly strong demand
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                This may be the most interesting category because some DVDs
                simply do not look valuable. A plain case sitting in a box for
                years can still represent a release people are actively
                searching for.
              </p>

              <p className="font-semibold text-slate-900">
                That is why it is usually better to scan the barcode than judge
                a DVD only by its age, title, or appearance.
              </p>
            </div>
          </section>

          {/* ===================== VALUE FACTORS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Value factors
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What actually determines a DVD&apos;s value?
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              There is no single rule that makes a DVD valuable. Several
              factors can influence what a particular release may be worth.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Exact edition",
                  text: "Different releases of the same movie can have different resale values.",
                },
                {
                  title: "Current demand",
                  text: "A scarce DVD still needs buyers who actually want it.",
                },
                {
                  title: "Availability",
                  text: "Titles that are easy to replace are often worth less.",
                },
                {
                  title: "Condition",
                  text: "Scratches, damaged cases, or missing artwork can affect value.",
                },
                {
                  title: "Completeness",
                  text: "Box sets should contain all discs and included materials.",
                },
                {
                  title: "Market activity",
                  text: "Prices can change as supply and demand change over time.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                >
                  <h3 className="font-serif text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== BARCODE ===================== */}
          <section className="mb-14 rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Identify the exact release
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Where is the barcode on a DVD?
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                The UPC barcode is usually printed on the back of the DVD case.
                Most U.S. DVD barcodes contain 12 digits.
              </p>

              <p>
                The barcode helps identify the specific release rather than
                just the movie title. Two DVDs with nearly identical covers can
                still be different editions.
              </p>
            </div>

            <Link
              href="/guides/media-value-by-barcode"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Learn how to check media value by barcode

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

          {/* ===================== HOW TO CHECK ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Three simple steps
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How can I check what my DVDs are worth?
            </h2>

            <div className="mt-6 space-y-4">
              {[
                {
                  number: "1",
                  title: "Find the barcode",
                  text: "Look for the UPC barcode on the back of the DVD case.",
                },
                {
                  number: "2",
                  title: "Scan or enter it",
                  text: "Use the SellBookMedia barcode scanner or enter the code manually.",
                },
                {
                  number: "3",
                  title: "Check your offer",
                  text: "If the DVD meets the current purchasing criteria, you will see an offer.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-semibold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <Link
                href="/#quote"
                className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Check a DVD Now

                <svg
                  className="ml-2 h-4 w-4"
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
          </section>

          {/* ===================== OLD DVDS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Before you clear the shelf
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Should you throw away DVDs that seem worthless?
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Before discarding a collection, it can be worth checking the
                barcodes. A large box may contain many common DVDs but also a
                few titles, sets, or editions that are much more interesting
                than the rest.
              </p>

              <p>
                You do not necessarily need to research every movie
                individually. Scanning the barcode can make it easier to
                separate titles worth considering from the ones that do not
                qualify.
              </p>

              <p>
                If you are clearing out a larger collection, our{" "}
                <Link
                  href="/guides/what-to-do-with-old-dvds-and-cds"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  guide to what to do with old DVDs and CDs
                </Link>{" "}
                covers some of the other options.
              </p>
            </div>
          </section>

          {/* ===================== SELLING OPTIONS ===================== */}
          <section className="mb-14 rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Ready to sell?
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What if my DVDs have value?
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                If a DVD qualifies for an offer, you can add it to your
                SellBookMedia order along with other qualifying DVDs, Blu-rays,
                4K movies, CDs, books, or video games.
              </p>

              <p>
                You can also read our{" "}
                <Link
                  href="/sell-dvds-for-cash"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  DVD selling page
                </Link>{" "}
                for an overview of the process, or compare different selling
                methods in our{" "}
                <Link
                  href="/guides/best-places-to-sell-cds-dvds-games"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  guide to places to sell CDs, DVDs, and games
                </Link>
                .
              </p>
            </div>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Old DVD value: frequently asked questions
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

          {/* ===================== BOTTOM LINE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Bottom line
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Don&apos;t judge an old DVD by the cover
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Most DVDs are not rare collectibles, but that does not mean
                every old DVD is worthless. Box sets, discontinued releases,
                collector&apos;s editions, anime, niche movies, concert DVDs,
                and unusual editions can still be worth checking.
              </p>

              <p className="font-semibold text-slate-900">
                The title alone is not enough. The exact barcode and edition
                matter.
              </p>
            </div>
          </section>

          {/* ===================== RELATED GUIDES ===================== */}
          <RelatedGuides currentSlug="are-old-dvds-worth-anything" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have a DVD within reach?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Find out what we&apos;ll pay
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan one DVD barcode and see whether it qualifies for an offer.
              No app required and no commitment to sell.
            </p>

            <Link
              href="/#quote"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Check My DVD

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
              <span>PayPal, Venmo, or check by mail payment</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}