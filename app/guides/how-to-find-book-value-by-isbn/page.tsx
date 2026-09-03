import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/how-to-find-book-value-by-isbn`;

export const metadata: Metadata = {
  title: "How to Find Book Value by ISBN | SellBookMedia",
  description:
    "Learn how to find a book's value using its ISBN. See where to find the ISBN, how ISBN-10 and ISBN-13 work, and what affects a used book's value.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: "How to Find Book Value by ISBN",
    description:
      "Use a book's ISBN to identify the exact edition and check its current resale or buyback value.",
    siteName: "SellBookMedia",
  },
};

const FACTORS = [
  {
    factor: "Exact edition",
    reason:
      "Different editions of the same title can have different ISBNs and very different resale values.",
  },
  {
    factor: "Current demand",
    reason:
      "A book may be worth more when buyers are actively looking for that specific edition.",
  },
  {
    factor: "Condition",
    reason:
      "Writing, highlighting, water damage, missing pages, and other wear can reduce value or make a book unacceptable.",
  },
  {
    factor: "Format",
    reason:
      "Hardcover, paperback, textbook, international, and special editions may have different values.",
  },
  {
    factor: "Current resale market",
    reason:
      "Book values change over time as supply, demand, and available inventory change.",
  },
];

const STEPS = [
  {
    title: "Find the ISBN",
    body:
      "Look near the barcode on the back cover or on the copyright page inside the book.",
  },
  {
    title: "Enter or scan the number",
    body:
      "Use the ISBN to identify the exact edition instead of searching only by title or author.",
  },
  {
    title: "Check the current offer",
    body:
      "A current buyback or resale lookup can show whether that edition has demand and what it may be worth right now.",
  },
  {
    title: "Check the book's condition",
    body:
      "The ISBN identifies the edition, but the physical condition still affects whether the book can be sold and how much it may be worth.",
  },
];

const FAQ = [
  {
    q: "Can I find the exact value of a book from the ISBN?",
    a:
      "The ISBN identifies the exact edition of a book, but the ISBN itself does not contain a price. Current value depends on demand, condition, edition, and the resale market.",
  },
  {
    q: "Where can I find the ISBN on a book?",
    a:
      "The ISBN is commonly printed above or near the barcode on the back cover. It may also appear on the copyright page inside the book.",
  },
  {
    q: "What is the difference between ISBN-10 and ISBN-13?",
    a:
      "ISBN-10 contains 10 characters and is common on older books. ISBN-13 contains 13 digits and usually begins with 978 or 979. Many books show both versions.",
  },
  {
    q: "Does the same book title always have the same ISBN?",
    a:
      "No. Hardcover, paperback, revised, international, textbook, and other editions can have different ISBNs even when the title and author are the same.",
  },
  {
    q: "What if my book does not have an ISBN?",
    a:
      "Some older, specialty, or privately published books may not have an ISBN. In that case, you may need to identify the book using its title, author, publisher, edition, and publication details.",
  },
  {
    q: "Does condition matter if the ISBN is the same?",
    a:
      "Yes. Two copies with the same ISBN can have different resale value because of highlighting, writing, water damage, missing pages, binding damage, or other condition differences.",
  },
];

export default function BookValueByIsbnGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline: "How to Find the Value of a Book by ISBN",
        description:
          "Learn how to use an ISBN to identify a book edition and check its current resale or buyback value.",
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
            name: "How to Find Book Value by ISBN",
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
            Book value guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How to Find the Value of a Book by ISBN
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            An ISBN identifies the exact edition of a book. Use it to look up
            that edition, then check current demand, resale value, and condition
            to understand what the book may be worth.
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
          <section className="mb-14">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-7 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Quick answer
              </p>

              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Can an ISBN tell you what a book is worth?
              </h2>

              <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
                An ISBN does not contain the book&apos;s current price. It
                identifies a specific edition so that you can check the correct
                book against current resale or buyback data. The final value
                still depends on demand, condition, edition, and the current
                market.
              </p>
            </div>
          </section>

          {/* ===================== WHAT IS ISBN ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Start with the number
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What is an ISBN?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              ISBN stands for International Standard Book Number. It is a
              unique identifier used to distinguish one book edition and format
              from another.
            </p>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              That distinction matters when checking book value. A hardcover,
              paperback, revised edition, textbook edition, or international
              edition of the same title may have a different ISBN and a
              different resale value.
            </p>
          </section>

          {/* ===================== WHERE TO FIND ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Find your ISBN
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Where is the ISBN on a book?
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-serif text-xl font-bold text-slate-900">
                  Back cover
                </p>

                <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                  Look near the barcode on the back of the book. The ISBN is
                  often printed directly above or beside the barcode.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="font-serif text-xl font-bold text-slate-900">
                  Copyright page
                </p>

                <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
                  If it is not easy to find on the cover, check the copyright
                  or publication information page near the front of the book.
                </p>
              </div>
            </div>
          </section>

          {/* ===================== ISBN 10 VS 13 ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              ISBN formats
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              ISBN-10 vs. ISBN-13
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              You may see either a 10-character ISBN or a 13-digit ISBN on a
              book. Many books display both.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-3 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">
                <span>Format</span>
                <span>Length</span>
                <span>Example</span>
              </div>

              <div className="grid grid-cols-3 border-t border-slate-200 px-5 py-4 text-[15px] text-slate-700">
                <span className="font-semibold text-slate-900">ISBN-10</span>
                <span>10 characters</span>
                <span>Older format</span>
              </div>

              <div className="grid grid-cols-3 border-t border-slate-200 px-5 py-4 text-[15px] text-slate-700">
                <span className="font-semibold text-slate-900">ISBN-13</span>
                <span>13 digits</span>
                <span>Usually 978 or 979</span>
              </div>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              When checking a book, use the ISBN printed on the exact copy in
              your hand rather than choosing an ISBN from a different edition
              online.
            </p>
          </section>

          {/* ===================== HOW TO CHECK ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Step by step
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              How to check a book&apos;s value using its ISBN
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

          {/* ===================== CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Check your book
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  Have the ISBN in front of you?
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan the barcode or enter the ISBN to see whether
                  SellBookMedia is currently buying that edition and view your
                  cash offer.
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

          {/* ===================== VALUE FACTORS ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              More than the ISBN
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What determines how much a used book is worth?
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              The ISBN helps identify the correct book, but several other
              factors determine its current value.
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

          {/* ===================== SAME TITLE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Edition matters
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Why can the same book have different values?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Two books can have the same title and author but still be
              different products. A hardcover and paperback may have different
              ISBNs. A revised textbook may have a different ISBN from the
              previous edition. Special, international, or collectible
              editions may also use different identifiers.
            </p>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              That is why searching by ISBN is usually more precise than
              searching only by title.
            </p>

            <div className="mt-6 rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-slate-700">
                <strong className="text-slate-900">Tip:</strong>{" "}
                Always scan the barcode on the exact copy you want to sell.
                Avoid choosing a similar-looking edition from search results.
              </p>
            </div>
          </section>

          {/* ===================== CONDITION ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Physical condition
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              The ISBN can match and the book can still be rejected
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              An ISBN confirms the edition, not the condition of your
              individual copy. Books with major water damage, mold, missing
              pages, excessive writing, or other serious damage may not qualify
              even when the ISBN itself is eligible.
            </p>

            <Link
              href="/condition-guidelines"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              See our condition guidelines
              <span className="ml-1.5">→</span>
            </Link>
          </section>

          {/* ===================== NO ISBN ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Older books
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What if a book has no ISBN?
            </h2>

            <p className="mt-6 text-[17px] leading-[1.75] text-slate-700">
              Some older, specialty, or privately published books may not have
              an ISBN. In that case, identifying the exact edition can require
              the title, author, publisher, publication date, format, and other
              edition details.
            </p>

            <p className="mt-4 text-[17px] leading-[1.75] text-slate-700">
              A missing ISBN does not automatically mean a book is valuable.
              It simply means an ISBN lookup cannot be used to identify that
              edition.
            </p>
          </section>

          {/* ===================== RELATED BOOK CONTENT ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Learn more
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              More about selling and valuing used books
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/sell-books-for-cash"
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300"
              >
                <p className="font-serif text-xl font-bold text-slate-900">
                  Sell Books for Cash
                </p>

                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Scan eligible books, see your current offer, and ship accepted
                  items with a prepaid label.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                  Sell books →
                </span>
              </Link>

              <Link
                href="/guides/how-much-are-used-books-worth"
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300"
              >
                <p className="font-serif text-xl font-bold text-slate-900">
                  How Much Are Used Books Worth?
                </p>

                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Learn how edition, demand, condition, and resale activity can
                  affect used book value.
                </p>

                <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                  Read the value guide →
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
              Book ISBN and Value Questions
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

          <RelatedGuides currentSlug="how-to-find-book-value-by-isbn" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Check the exact edition
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Scan your book&apos;s ISBN
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              See whether SellBookMedia is currently buying your book and view
              your cash offer in seconds.
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