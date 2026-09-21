import Link from "next/link";
import type { Metadata } from "next";
import RelatedGuides from "@/components/RelatedGuides";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/guides/why-are-used-dvds-worth-so-little`;

export const metadata: Metadata = {
  title:
    "Why Are Used DVDs Worth So Little? What Makes Some Valuable? | SellBookMedia",
  description:
    "Most common DVDs, Blu-rays, and 4K movies have modest buyback value, but some releases can be worth more. Learn realistic buyback ranges and what makes certain titles stand out.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title:
      "Why Are Used DVDs Worth So Little? What Makes Some Valuable?",
    description:
      "See realistic buyback expectations for common DVDs, Blu-rays, and 4K movies, plus the releases that may be worth checking more closely.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "article",
  },
};

const valueRanges = [
  {
    label: "Common DVD / Blu-ray / 4K",
    range: "$0–$1",
    note: "A realistic buyback range for many ordinary mass-market releases. Some titles may receive no offer at all.",
  },
  {
    label: "Better-demand titles",
    range: "$1–$3",
    note: "Less common releases or titles with healthier current resale demand may move above the basic range.",
  },
  {
    label: "Stronger / special releases",
    range: "$3–$5",
    note: "Some desirable editions, harder-to-find releases, or better-demand titles can reach this area.",
  },
  {
    label: "Rare / box sets / collector editions",
    range: "Can be higher",
    note: "Higher offers happen, but they are much less common and usually involve something unusual about the exact release.",
  },
];

const reasons = [
  {
    number: "01",
    title: "There are simply too many copies",
    body: "Popular movies were often produced in enormous quantities. Years later, the used market can still contain far more copies than active buyers need.",
  },
  {
    number: "02",
    title: "Streaming changed everyday demand",
    body: "Many casual viewers no longer need a physical copy of a common movie. That matters most for standard editions that are easy to replace.",
  },
  {
    number: "03",
    title: "The title is not the product",
    body: "The same movie can exist as a basic DVD, collector edition, box set, Blu-ray, 4K release, steelbook, or discontinued edition. The exact barcode matters.",
  },
  {
    number: "04",
    title: "Value is concentrated unevenly",
    body: "A collection can contain dozens of low-value common titles and only a few releases that account for most of its buyback value.",
  },
];

const worthChecking = [
  {
    title: "Complete box sets",
    body: "TV series, franchise collections, multi-disc sets, and complete boxed editions can stand out when all discs and original packaging are present.",
  },
  {
    title: "Out-of-print releases",
    body: "A discontinued title can become harder to replace, especially when there is no equivalent current physical release.",
  },
  {
    title: "Collector editions",
    body: "Steelbooks, limited packaging, anniversary editions, bonus-disc sets, slipcovers, and other edition-specific extras can separate one release from a common copy.",
  },
  {
    title: "Niche titles",
    body: "Anime, concert releases, documentaries, specialty films, foreign titles, and smaller-label releases may have fewer used copies in circulation.",
  },
  {
    title: "Hard-to-find versions",
    body: "Alternate cuts, discontinued versions, special transfers, and releases containing material unavailable elsewhere can sometimes attract stronger demand.",
  },
  {
    title: "Better-demand Blu-ray or 4K editions",
    body: "The format alone does not guarantee value, but some Blu-ray and 4K editions have stronger demand than widely available DVD versions.",
  },
];

const FAQ = [
  {
    q: "How much are most used DVDs worth to a buyback website?",
    a: "For many common mass-market DVDs, Blu-rays, and 4K releases, a realistic buyback expectation is often between $0 and $1 per item. Some titles may receive no offer, while better-demand releases can be higher.",
  },
  {
    q: "Can a DVD, Blu-ray, or 4K movie be worth $3 to $5?",
    a: "Yes. Some titles with stronger demand, lower availability, or a more desirable edition can reach roughly the $3 to $5 range. That is less common than the basic $0 to $1 range.",
  },
  {
    q: "Can some movies be worth more than $5?",
    a: "Yes, but higher buyback values are much less common. Complete box sets, collector editions, discontinued releases, rare versions, and other hard-to-find titles can sometimes be worth more.",
  },
  {
    q: "Does Blu-ray or 4K automatically mean a movie is worth more?",
    a: "No. A common Blu-ray or 4K release can still have modest resale value. The exact edition, current demand, availability, condition, and completeness matter more than format alone.",
  },
  {
    q: "Does an old DVD automatically become valuable?",
    a: "No. Age by itself does not create value. Many old DVDs remain common because large numbers were produced. Scarcity and buyer demand matter more.",
  },
  {
    q: "How can I check the exact release I own?",
    a: "Use the UPC barcode on the case or outer box. Different editions of the same movie can have different barcodes, availability, and resale demand.",
  },
];

export default function WhyAreUsedDvdsWorthSoLittlePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}#article`,
        headline:
          "Why Are Used DVDs Worth So Little? What Actually Makes Some DVDs Valuable?",
        description:
          "A practical guide to realistic DVD, Blu-ray, and 4K buyback expectations and the factors that make certain physical-media releases more valuable.",
        url: PAGE_URL,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": PAGE_URL,
        },
        author: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "SellBookMedia",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
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
            name: "Why Are Used DVDs Worth So Little?",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.20),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.12),transparent_28%)]" />

        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-4xl">
            <Link
              href="/sell-dvds-for-cash"
              className="inline-flex items-center text-sm font-semibold text-blue-300 hover:text-white"
            >
              ← Sell DVDs, Blu-rays & 4K
            </Link>

            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Physical Media Value Guide
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
              Why Are Most Used DVDs Worth So Little?
              <span className="mt-2 block text-slate-300">
                And What Actually Makes Some Worth More?
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Most ordinary DVDs, Blu-rays, and 4K movies do not have high
              buyback value. That does not mean every disc is worthless. The
              real question is which releases are common, which still have
              demand, and which editions deserve a closer look.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK ANSWER */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                The realistic answer
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                For common physical media, think cents and dollars — not
                collector prices.
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Across the buyback market, many ordinary mass-market DVDs,
                Blu-rays, and 4K releases fall into a roughly{" "}
                <strong className="text-slate-900">$0–$1</strong> expectation.
                Some better titles can move into the{" "}
                <strong className="text-slate-900">$1–$3</strong> range, and
                stronger or more unusual releases may reach roughly{" "}
                <strong className="text-slate-900">$3–$5</strong>.
              </p>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                Higher values do exist, but they are much less common and are
                usually tied to box sets, collector editions, discontinued
                releases, unusual versions, or titles with unusually strong
                demand.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-blue-400">
                Important
              </p>

              <p className="mt-3 text-xl font-bold leading-8">
                A shelf with 100 movies should not be treated as 100 items worth
                several dollars each.
              </p>

              <p className="mt-4 leading-7 text-slate-300">
                Most collections are uneven. Many common titles have modest
                buyback value, while a smaller number of better releases may
                account for a much larger share of the collection&apos;s total
                value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE RANGE */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Buyback expectations
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              What might a used movie actually be worth?
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              These are broad buyback-market expectations, not guaranteed
              SellBookMedia quotes. Exact offers can change based on the
              release and current demand.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200">
            {valueRanges.map((item, index) => (
              <div
                key={item.label}
                className={`grid gap-4 px-6 py-7 sm:grid-cols-[1fr_180px_1.4fr] sm:items-center ${
                  index !== valueRanges.length - 1
                    ? "border-b border-slate-200"
                    : ""
                }`}
              >
                <div className="font-bold text-slate-900">{item.label}</div>

                <div className="text-2xl font-black text-blue-600">
                  {item.range}
                </div>

                <div className="leading-7 text-slate-600">{item.note}</div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            A title can fall outside these ranges. Buyback values change over
            time as demand, supply, availability, and resale conditions change.
          </p>
        </div>
      </section>

      {/* WHY LOW */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Why values are low
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              A great movie can still be a very common used product.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {reasons.map((item) => (
              <div
                key={item.number}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="text-sm font-black tracking-[0.15em] text-blue-600">
                  {item.number}
                </div>

                <h3 className="mt-3 text-xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTERINTUITIVE */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                The counterintuitive part
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                A blockbuster can be worth less than a movie almost nobody
                remembers.
              </h2>

              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
                <p>
                  Imagine a blockbuster that sold millions of physical copies.
                  The movie may still be famous, but thousands of used copies
                  can remain available decades later.
                </p>

                <p>
                  Now compare that with a small specialty release that had a
                  limited physical run and later went out of print.
                </p>

                <p>
                  The second title may have a smaller audience, but if copies
                  are difficult to replace and buyers are still searching for
                  it, its resale market can be much stronger.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <div className="text-sm font-bold text-slate-500">
                  MASS-MARKET RELEASE
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  Famous title + huge supply
                </div>
                <p className="mt-3 leading-7 text-slate-600">
                  Easy to replace, many used copies available, limited reason
                  for a buyer to pay much.
                </p>
              </div>

              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-7">
                <div className="text-sm font-bold text-blue-600">
                  HARDER-TO-FIND RELEASE
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  Smaller supply + active demand
                </div>
                <p className="mt-3 leading-7 text-slate-600">
                  The movie may be less famous, but the exact release can be
                  harder to replace and more desirable to the right buyer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO CHECK */}
      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-400">
              Worth a closer look
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              These are the releases you should slow down and check.
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-300">
              None of these automatically means “valuable,” but they are more
              likely to deserve individual attention than an ordinary
              mass-market movie.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {worthChecking.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/guides/are-old-dvds-worth-anything"
              className="rounded-xl bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-100"
            >
              Which old DVDs may be worth checking? →
            </Link>

            <Link
              href="/guides/how-much-are-used-dvds-worth"
              className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white hover:bg-white/10"
            >
              Read the full DVD value guide →
            </Link>
          </div>
        </div>
      </section>

      {/* EXACT RELEASE */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                The barcode matters
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                “The same movie” can actually be several different products.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-slate-600">
              <p>
                A movie title can exist as a standard DVD, two-disc special
                edition, box set, Blu-ray, 4K release, steelbook, anniversary
                edition, or later reissue.
              </p>

              <p>
                Those products can have different UPC barcodes because they are
                different retail releases. They can also have very different
                supply and demand.
              </p>

              <p>
                That is why searching a movie title alone can give misleading
                results. The exact edition in your hand is what matters.
              </p>

              <Link
                href="/guides/media-value-by-barcode"
                className="inline-flex font-bold text-blue-600 hover:text-blue-800"
              >
                Learn how media value by barcode works →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ASKING PRICE */}
      <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              A common mistake
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              A $40 listing does not mean your DVD is worth $40.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Online marketplaces contain asking prices, and sellers can ask
              almost anything. A high listing price does not prove that buyers
              are actually paying that amount.
            </p>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Real resale demand depends on the exact release, how many copies
              are available, condition, completeness, and what comparable items
              are actually able to sell for.
            </p>

            <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-7">
              <p className="text-lg font-black text-slate-900">
                Buyback price is also different from marketplace price.
              </p>

              <p className="mt-3 leading-7 text-slate-700">
                A marketplace seller may wait weeks or months, photograph an
                item, create a listing, answer questions, pay fees, handle
                returns, and ship individual orders. A buyback service is
                designed around convenience and bulk processing, so its offer
                will normally be lower than the best possible direct-to-buyer
                sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LARGE COLLECTION */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
                Large collections
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Have hundreds of movies? Do not research every title by hand.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                The most practical approach is to separate obvious unusual
                releases from ordinary titles and use the exact barcode to
                check the rest.
              </p>
            </div>

            <div className="space-y-4">
              {[
                [
                  "1",
                  "Pull out unusual items first",
                  "Box sets, steelbooks, collector editions, complete series, niche releases, and unusual packaging deserve extra attention.",
                ],
                [
                  "2",
                  "Scan common titles instead of researching them",
                  "The UPC is faster and more reliable than manually searching every movie title.",
                ],
                [
                  "3",
                  "Keep expectations realistic",
                  "A large collection can contain many common titles with little buyback value and only a smaller group of stronger items.",
                ],
                [
                  "4",
                  "Decide whether convenience matters",
                  "Selling individually may earn more on exceptional titles, while a buyback service can be much simpler for ordinary media.",
                ],
              ].map(([number, title, body]) => (
                <div
                  key={number}
                  className="flex gap-5 rounded-2xl border border-slate-200 p-6"
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 font-black text-white">
                    {number}
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">{title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/guides/what-to-do-with-old-dvds-and-cds"
            className="mt-8 inline-flex font-bold text-blue-600 hover:text-blue-800"
          >
            See what to do with a large DVD or CD collection →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-100">
            Skip the guessing
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Check the exact DVD, Blu-ray, or 4K release you own.
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-100">
            Scan or enter the UPC to see whether SellBookMedia is currently
            buying that release and view your offer before you ship. You can
            combine eligible movies with accepted books, CDs, and video games
            in the same order.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/sell-dvds-for-cash"
              className="rounded-xl bg-white px-7 py-4 font-black text-blue-700 shadow-lg hover:bg-blue-50"
            >
              Check Your Movies
            </Link>

            <Link
              href="/condition-guidelines"
              className="rounded-xl border border-white/30 px-7 py-4 font-bold text-white hover:bg-white/10"
            >
              View Condition Guidelines
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
            FAQ
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Used DVD value questions
          </h2>

          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {FAQ.map((item) => (
              <div key={item.q} className="py-7">
                <h3 className="text-lg font-black text-slate-900">{item.q}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>

          <RelatedGuides currentSlug="why-are-used-dvds-worth-so-little" />
        </div>
      </section>
    </div>
  );
}
