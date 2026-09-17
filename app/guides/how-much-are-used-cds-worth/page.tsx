import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/how-much-are-used-cds-worth`;

export const metadata: Metadata = {
  title: "Are Old CDs Worth Anything in 2026? | SellBookMedia",
  description:
    "Find out which old CDs may be worth money, how to identify the exact pressing, check real sales history, and decide whether to sell, keep, or donate your CDs.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Are Old CDs Worth Anything in 2026? | SellBookMedia",
    description:
      "Learn what makes some old CDs collectible, how to check the exact release, and how to separate ordinary copies from CDs worth researching further.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "article",
    publishedTime: "2026-08-18",
    modifiedTime: "2026-09-16",
  },
  twitter: {
    card: "summary_large_image",
    title: "Are Old CDs Worth Anything in 2026?",
    description:
      "A practical guide to used CD value, exact pressings, sold-price research, condition, imports, box sets, and large collections.",
  },
};

const VALUABLE = [
  {
    name: "Japanese and imported pressings",
    tell: "Obi strips, import markings, different catalog numbers, or bonus tracks",
    body: "Collectors sometimes seek a specific imported edition rather than the standard U.S. release. The exact pressing matters more than the album title alone.",
  },
  {
    name: "Complete box sets",
    tell: "All discs, booklets, inserts, sleeves, and original outer packaging",
    body: "A complete multi-disc set can be much more desirable than loose discs or an incomplete package, especially when the set is out of print.",
  },
  {
    name: "Out-of-print and small-label releases",
    tell: "Older niche titles, regional releases, specialty labels, or albums no longer widely available",
    body: "Limited supply can matter when there is still collector demand. Scarcity by itself is not enough, but it is a reason to research the exact release.",
  },
  {
    name: "Audiophile, limited, promo, or unusual editions",
    tell: "Special mastering, gold-disc branding, promo markings, numbered editions, or unusual packaging",
    body: "These editions can have a different collector market from the ordinary retail copy, even when the music is the same.",
  },
  {
    name: "Niche genres with dedicated physical-media buyers",
    tell: "Specialty jazz, classical, metal, punk, regional, soundtrack, or other smaller-market releases",
    body: "Some titles were produced in smaller quantities or remain more desirable in physical form. The release and demand still need to be checked individually.",
  },
];

const SIXTY_SECOND_CHECK = [
  {
    label: "Front",
    text: "Look for limited-edition, promo, audiophile, box-set, or unusual packaging clues.",
  },
  {
    label: "Back",
    text: "Check the barcode, country, label information, bonus tracks, and copyright details.",
  },
  {
    label: "Spine",
    text: "Find the catalog number. It can help distinguish one release from another.",
  },
  {
    label: "Disc",
    text: "Check that the correct disc is present and inspect the printed label for edition or manufacturing clues.",
  },
  {
    label: "Inner ring",
    text: "For collector-level identification, look for matrix text, manufacturer marks, and IFPI/SID codes when present.",
  },
  {
    label: "Sales history",
    text: "Compare the exact release with completed or historical sales, not just optimistic asking prices.",
  },
];

const FAQ = [
  {
    q: "Are old CDs worth anything in 2026?",
    a: "Some are. Common mass-market CDs may have modest resale value, while certain imports, box sets, out-of-print titles, limited editions, audiophile releases, promos, and unusual pressings can be worth researching more closely. Age alone does not determine value.",
  },
  {
    q: "Are 1990s CDs worth anything?",
    a: "Some 1990s CDs can be collectible, but many were produced in very large quantities. The exact edition, current demand, condition, completeness, and sales history matter more than the decade printed on the case.",
  },
  {
    q: "How do I tell if a CD is rare or valuable?",
    a: "Start with the barcode and catalog number, then look for import markings, special packaging, promo or limited-edition details, and the matrix area on the disc. After identifying the exact release, compare recent sold history rather than relying only on active listing prices.",
  },
  {
    q: "Are Japanese CDs worth more?",
    a: "Some Japanese pressings attract collector interest because of their specific mastering, packaging, bonus content, scarcity, or obi strip. But a Japanese pressing is not automatically valuable; the exact release and real buyer demand still matter.",
  },
  {
    q: "Does an obi strip make a CD valuable?",
    a: "An original obi strip can make a collectible Japanese release more complete and desirable, but the obi does not create value by itself. The underlying release still needs collector demand.",
  },
  {
    q: "Are sealed CDs always worth more?",
    a: "Not always. Sealed condition can help when the underlying release is desirable, but a sealed common title is still a common title. Edition and demand come first.",
  },
  {
    q: "What does IFPI mean on a CD?",
    a: "IFPI SID codes began appearing on many commercially manufactured CDs in the 1990s and can help identify mastering and manufacturing details. They are useful when two copies share an album title but may be different pressings.",
  },
  {
    q: "Should I use the asking price to value a CD?",
    a: "No. An active listing only shows what a seller hopes to receive. Recent completed sales or a release-specific sales history are much better evidence of what buyers have actually paid.",
  },
  {
    q: "Where can I sell old CDs?",
    a: "You can compare direct buyback services, collector marketplaces, local record stores, and local marketplaces. Rare releases may justify more individual research, while a direct buyback can be simpler for larger collections of ordinary used CDs.",
  },
  {
    q: "Can I check a CD without creating an account?",
    a: "Yes. On SellBookMedia you can scan or enter a barcode and see whether the CD currently qualifies for an offer before creating an account.",
  },
];

function ArrowIcon() {
  return (
    <svg
      className="ml-2 h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function CdValueGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Are Old CDs Worth Anything in 2026?",
        description:
          "A practical guide to used CD value, collectible pressings, exact-release identification, sales history, condition, and selling options.",
        datePublished: "2026-08-18",
        dateModified: "2026-09-16",
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
            name: "Are Old CDs Worth Anything in 2026?",
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
              aria-hidden="true"
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
            Used CD value guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Are Old CDs Worth Anything in 2026?
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Some old CDs are ordinary used media. Others are imports, box sets,
            out-of-print titles, audiophile editions, or unusual pressings that
            deserve a closer look. The key is identifying the exact release before
            assuming what it is worth.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-blue-200">
            <span className="font-medium text-white">SellBookMedia</span>
            <span aria-hidden="true" className="text-white/30">/</span>
            <time dateTime="2026-09-16">Updated September 2026</time>
            <span aria-hidden="true" className="text-white/30">/</span>
            <span>10 min read</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ===================== SHORT ANSWER ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The short answer
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Yes, some old CDs are worth money — but age is not the reason
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                A CD from 1988 is not automatically more valuable than one from
                2003. What matters is the exact release, how many copies are
                available, whether collectors still want it, its condition, and
                whether the original pieces are complete.
              </p>

              <p>
                That is why two copies of the same album can belong to very
                different markets. One may be a common U.S. reissue found in
                thousands of collections. Another may be a Japanese pressing, a
                promo, a limited edition, a small-label release, or a complete box
                set with much less supply.
              </p>

              <p>
                CDs are also still an active physical format. RIAA&apos;s 2025
                year-end report lists 29.5 million CD units and $312.4 million in
                U.S. CD revenue. Those figures describe the new-music market, not
                used-CD resale prices, but they are a useful reminder that the
                format has not disappeared.
              </p>
            </div>

            <div className="mt-7 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-[16px] leading-relaxed text-slate-700">
                <strong className="text-slate-900">Best first rule:</strong>{" "}
                do not price a CD from the artist name, year, or album cover alone.
                Identify the exact copy first.
              </p>
            </div>
          </section>

          {/* ===================== OLD VS VALUABLE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Old is not the same as collectible
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              An older common CD can be worth less than a newer scarce release
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              Think about supply and demand instead of age. A mass-market album
              that sold millions of copies can remain easy to find decades later.
              A later release from a small label may be harder to replace even
              though it is technically newer.
            </p>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-3 bg-slate-900 text-sm font-semibold text-white sm:text-base">
                <div className="p-4 sm:p-5">What to compare</div>
                <div className="border-l border-white/10 p-4 sm:p-5">Common older CD</div>
                <div className="border-l border-white/10 p-4 sm:p-5">Release worth researching</div>
              </div>

              {[
                ["Age", "May be older", "May be newer"],
                ["Supply", "Many copies still available", "Fewer comparable copies"],
                ["Edition", "Standard retail issue", "Import, promo, limited, audiophile, or unusual pressing"],
                ["Packaging", "Ordinary jewel case", "Obi, box, bonus material, special packaging"],
                ["Demand", "Broad but replaceable", "Release-specific collector interest"],
              ].map((row, index) => (
                <div
                  key={row[0]}
                  className={`grid grid-cols-3 text-sm sm:text-base ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <div className="p-4 font-semibold text-slate-900 sm:p-5">{row[0]}</div>
                  <div className="border-l border-slate-200 p-4 text-slate-600 sm:p-5">{row[1]}</div>
                  <div className="border-l border-slate-200 p-4 text-slate-700 sm:p-5">{row[2]}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== EXACT RELEASE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Same album, different release
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              The album title is only the beginning
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                The same album can be released in different countries, years,
                mastering versions, packages, and label editions. Those copies may
                share the same songs but have different barcodes, catalog numbers,
                matrix information, and collector demand.
              </p>

              <p>
                For a normal used CD, the UPC is the fastest place to start. If you
                want to understand why the barcode matters, see our{" "}
                <Link
                  href="/guides/media-value-by-barcode"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  guide to checking media value by barcode
                </Link>
                . For genuinely collectible copies, you may need to go deeper than
                the UPC.
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Copy A
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Standard U.S. reissue</h3>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-slate-600">
                  <li>Common retail barcode</li>
                  <li>Standard jewel case</li>
                  <li>No special inserts</li>
                  <li>Large number of comparable copies</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Copy B
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Japanese or special edition</h3>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-slate-700">
                  <li>Different catalog number or barcode</li>
                  <li>Obi strip or unique packaging</li>
                  <li>Possible bonus tracks or different mastering</li>
                  <li>Smaller release-specific supply</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ===================== MATRIX ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Look beyond the barcode
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Barcode gets you close. The inner ring can get you closer.
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                On the data side of a manufactured CD, the clear inner area can
                contain matrix information such as a pressing number, manufacturer
                name or logo, and sometimes a barcode. Discogs notes that many CDs
                made since 1994 also include SID codes beginning with IFPI.
              </p>

              <p>
                You do not need to inspect matrix codes for every ordinary CD in a
                large collection. They become useful when two copies look almost
                identical but you suspect one may be a different pressing.
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="font-bold text-slate-900">When is the inner ring worth checking?</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
                Check it when the CD appears to be an early pressing, import,
                audiophile edition, promo, unusual release, or when collector
                databases show several nearly identical versions.
              </p>
            </div>
          </section>

          {/* ===================== 60 SECOND CHECK ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              A practical inspection
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A 60-second CD value check
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              If you have a CD in your hand, work from the outside in. This catches
              most of the clues that tell you whether the disc deserves a deeper
              lookup.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {SIXTY_SECOND_CHECK.map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-slate-900">{item.label}</h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== VALUABLE TYPES ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Pull these aside first
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              CDs that are especially worth checking
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              None of these categories guarantees a high price. They are simply
              useful signals that a release may deserve more research before you
              put it in the ordinary pile.
            </p>

            <div className="mt-6 space-y-3">
              {VALUABLE.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
                    Look for: {item.tell}
                  </p>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== RARE VS VALUABLE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              A common pricing mistake
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Rare does not automatically mean valuable
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                A release can be difficult to find and still have very few buyers.
                Scarcity matters only when it meets demand. That is why a genuinely
                obscure CD is not automatically worth more than a more common title
                with an active collector market.
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                A better mental model
              </p>
              <p className="mt-3 font-serif text-2xl font-bold">
                Scarcity + demand + exact edition + condition = potential value
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                No single factor tells the whole story. A rare release with no
                demand can be difficult to sell; a desirable release in poor or
                incomplete condition can also lose much of its appeal.
              </p>
            </div>
          </section>

          {/* ===================== ASKING VS SOLD ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Asking price is not market value
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A $150 listing does not mean your CD is worth $150
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                Anyone can list a CD at almost any price. The more useful question
                is whether comparable copies of the exact release have actually
                sold, how recently they sold, and in what condition.
              </p>

              <p>
                Discogs, for example, provides release-specific sales history and
                shows low, median, and high values based on recent Marketplace
                sales. That kind of evidence is much more useful than selecting the
                highest active listing you can find.
              </p>
            </div>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-2 bg-slate-900 text-white">
                <div className="p-5 font-semibold">Weak evidence</div>
                <div className="border-l border-white/10 p-5 font-semibold">Better evidence</div>
              </div>
              <div className="grid grid-cols-2 text-[15px] leading-relaxed">
                <div className="p-5 text-slate-600">
                  One active listing at a very high price with no proof that anyone paid it
                </div>
                <div className="border-l border-slate-200 p-5 text-slate-700">
                  Multiple recent sold examples for the same pressing in comparable condition
                </div>
              </div>
            </div>
          </section>

          {/* ===================== SEALED VS RARE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Condition helps — edition comes first
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Sealed common CD vs. used collectible pressing
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              Sealed condition can add appeal, but shrink wrap does not turn a
              mass-produced release into a scarce one. A clean used copy of a
              genuinely sought-after pressing can have a stronger collector market
              than a sealed copy of an ordinary release.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Sealed common release</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  Excellent condition can help, but there may still be many identical
                  copies available.
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Used collectible pressing</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
                  The disc may show normal use, yet the exact pressing can be harder
                  to replace and more important to collectors.
                </p>
              </div>
            </div>
          </section>

          {/* ===================== BOX SET ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Completeness matters
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Complete box set vs. missing disc or booklet
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              Box sets should be evaluated as sets, not just as a stack of discs.
              Collectors may care about the outer box, booklets, inserts, sleeves,
              bonus discs, and other original components. Missing one important
              piece can change the market for the whole package.
            </p>

            <Link
              href="/condition-guidelines"
              className="mt-5 inline-flex items-center font-semibold text-blue-600 hover:text-blue-800"
            >
              Review our condition guidelines
              <ArrowIcon />
            </Link>
          </section>

          {/* ===================== MARKETPLACE VS BUYBACK ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Choose the selling method to match the CD
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Collector marketplace vs. direct buyback
            </h2>

            <p className="mt-6 text-[17px] leading-[1.8] text-slate-700">
              There is no single best selling method for every disc. A scarce
              pressing can justify individual research and a collector-focused
              listing. A large group of ordinary used CDs can be a very different
              project.
            </p>

            <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-3 bg-slate-900 text-sm font-semibold text-white sm:text-base">
                <div className="p-4 sm:p-5">Situation</div>
                <div className="border-l border-white/10 p-4 sm:p-5">Collector marketplace</div>
                <div className="border-l border-white/10 p-4 sm:p-5">Direct buyback</div>
              </div>

              {[
                ["Rare or unusual pressing", "More individual research may be worthwhile", "Quick offer can still be compared"],
                ["200 ordinary CDs", "Many separate listings can take time", "Built for faster batch processing"],
                ["Need maximum individual-sale upside", "More control over asking price", "Convenience is the priority"],
                ["Photos and buyer messages", "Often part of the process", "Not required for each accepted CD"],
                ["Shipping", "Usually handled sale by sale", "Accepted items can ship together"],
              ].map((row, index) => (
                <div
                  key={row[0]}
                  className={`grid grid-cols-3 text-sm sm:text-base ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  <div className="p-4 font-semibold text-slate-900 sm:p-5">{row[0]}</div>
                  <div className="border-l border-slate-200 p-4 text-slate-600 sm:p-5">{row[1]}</div>
                  <div className="border-l border-slate-200 p-4 text-slate-700 sm:p-5">{row[2]}</div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
              For a broader comparison, read our{" "}
              <Link
                href="/guides/best-places-to-sell-cds-dvds-games"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                guide to places to sell used CDs and other media
              </Link>
              .
            </p>
          </section>

          {/* ===================== COLLECTION VALUE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              When you have shelves instead of one disc
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              What is a whole CD collection worth?
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                A collection is not simply the number of CDs multiplied by one
                average price. Most large collections contain a mix: common titles,
                stronger-demand titles, damaged or incomplete copies, box sets,
                imports, and sometimes a few releases worth researching separately.
              </p>

              <p>
                The efficient approach is to pull aside anything unusual first,
                then scan the ordinary retail copies in batches. Our{" "}
                <Link
                  href="/guides/how-to-sell-a-cd-collection"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  large CD collection guide
                </Link>{" "}
                walks through that workflow in more detail.
              </p>
            </div>
          </section>

          {/* ===================== DECISION TREE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Sell, research, keep, or donate?
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              A simple decision tree for old CDs
            </h2>

            <div className="mt-7 space-y-3">
              {[
                ["1", "Does it look unusual?", "Import, promo, box set, audiophile, limited edition, unusual packaging, or small-label release? Research the exact pressing first."],
                ["2", "Does it have a normal retail barcode?", "Scan the UPC and see whether the exact release currently qualifies for a buyback offer."],
                ["3", "Do sold records show strong collector demand?", "Consider whether an individual collector-market listing is worth the extra time."],
                ["4", "Is it ordinary used media?", "A direct buyback can save the work of photographing, listing, messaging, and shipping titles one at a time."],
                ["5", "No meaningful demand or too damaged?", "Consider donation, reuse, or responsible disposal instead of spending hours trying to sell it."],
              ].map(([number, title, body]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      {number}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
              If you decide some discs are not worth selling, see our{" "}
              <Link
                href="/guides/what-to-do-with-old-dvds-and-cds"
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                guide to what to do with old CDs and DVDs
              </Link>
              .
            </p>
          </section>

          {/* ===================== CTA ===================== */}
          <section className="mb-14">
            <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
              <div className="px-6 py-8 sm:px-8 sm:py-9">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Have a CD nearby?
                </p>

                <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                  Check the exact barcode before you decide what to do with it
                </h2>

                <p className="mt-3 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-slate-600">
                  Scan or enter the UPC to see whether SellBookMedia is currently
                  buying that release and view the cash offer before you ship.
                </p>

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/#quote"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Check My CD
                    <ArrowIcon />
                  </Link>

                  <span className="text-sm text-slate-500">
                    Instant quote • Free prepaid shipping • PayPal, Venmo, or check by mail
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ===================== CONDITION ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Condition still matters
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Disc, booklet, inserts, and packaging can all affect desirability
            </h2>

            <div className="mt-6 space-y-5 text-[17px] leading-[1.8] text-slate-700">
              <p>
                Collector grading usually treats the disc and printed materials as
                meaningful parts of the item. Discogs&apos; CD grading guidance,
                for example, distinguishes grades such as Mint and Near Mint and
                separately describes the insert, inlay, booklet, sleeve, or digipak.
              </p>

              <p>
                For SellBookMedia, normal signs of use can be fine, but the disc
                should be playable and the item should not have serious damage or
                missing essential components.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-emerald-800">Generally fine</p>
                <p className="mt-1 text-[15px] text-slate-600">
                  Light surface wear, normal case scuffs, and ordinary signs of careful use
                </p>
              </div>

              <div className="rounded-xl border-l-4 border-slate-400 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">Needs closer attention</p>
                <p className="mt-1 text-[15px] text-slate-600">
                  Deep scratches, cracks, mold, missing discs, missing essential artwork, or incomplete box sets
                </p>
              </div>
            </div>
          </section>

          {/* ===================== FAQ ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Old CD value questions
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

          {/* ===================== SOURCES ===================== */}
          <section className="mb-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Research notes
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Sources used for the technical and market context
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
              We use primary or platform documentation for factual details where possible.
              Market values change, so no source should be treated as a permanent price list.
            </p>
            <ul className="mt-5 space-y-3 text-[15px] leading-relaxed">
              <li>
                <a
                  href="https://www.riaa.com/wp-content/uploads/2026/03/RIAA-Year-End-Revenue-2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  RIAA 2025 Year-End Recorded Music Revenue Report ↗
                </a>
              </li>
              <li>
                <a
                  href="https://support.discogs.com/hc/en-us/articles/360005006654-Database-Guidelines-6-Format"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Discogs: CD matrix and format identification ↗
                </a>
              </li>
              <li>
                <a
                  href="https://support.discogs.com/hc/en-us/articles/360007425553-Where-Can-I-Access-Sales-History"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Discogs: release sales history ↗
                </a>
              </li>
              <li>
                <a
                  href="https://support.discogs.com/hc/en-us/articles/360001566193-How-To-Grade-Items"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Discogs: CD condition grading ↗
                </a>
              </li>
            </ul>
          </section>

          {/* ===================== INTERNAL LINKS ===================== */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Keep researching your collection
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  href: "/guides/media-value-by-barcode",
                  title: "Find Media Value by Barcode",
                  body: "Learn what the UPC identifies and why the exact release matters.",
                },
                {
                  href: "/guides/how-to-sell-a-cd-collection",
                  title: "How to Sell a Large CD Collection",
                  body: "Use a faster workflow when you have boxes or shelves of CDs to sort.",
                },
                {
                  href: "/guides/best-places-to-sell-cds-dvds-games",
                  title: "Best Places to Sell Used Media",
                  body: "Compare direct buyback, marketplaces, and local selling options.",
                },
                {
                  href: "/guides/what-to-do-with-old-dvds-and-cds",
                  title: "What to Do With Old CDs & DVDs",
                  body: "Compare selling, donating, reusing, and disposal options for unwanted media.",
                },
              ].map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <h3 className="font-bold text-slate-900">{guide.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.body}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
                    Read guide <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <RelatedGuides currentSlug="how-much-are-used-cds-worth" />

          {/* ===================== FINAL CTA ===================== */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have a CD within reach?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Check the exact UPC and see our current offer
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              No app required. See whether the release currently qualifies before
              you decide whether to sell it.
            </p>

            <Link
              href="/sell-cds-for-cash"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Sell CDs for Cash
              <ArrowIcon />
            </Link>

            <div className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-blue-200">
              <span>Instant quotes</span>
              <span aria-hidden="true">•</span>
              <span>Free prepaid shipping</span>
              <span aria-hidden="true">•</span>
              <span>PayPal, Venmo, or check by mail</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
