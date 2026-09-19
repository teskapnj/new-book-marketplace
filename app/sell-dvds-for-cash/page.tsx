import type { Metadata } from "next";
import Link from "next/link";
import MediaCategoryLinks from "../../components/MediaCategoryLinks";
import LandingCtaLink from "../../components/LandingCtaLink";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/sell-dvds-for-cash`;

export const metadata: Metadata = {
  title: "Sell DVDs for Cash Online | Blu-ray & 4K | SellBookMedia",
  description:
    "Sell DVDs, Blu-rays, and 4K movies for cash with SellBookMedia. Scan the UPC for an instant quote, get free prepaid shipping, and choose PayPal, Venmo, or check by mail.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Sell DVDs, Blu-rays & 4K Movies for Cash | SellBookMedia",
    description:
      "Scan your movie barcode for an instant cash offer, ship accepted items with a prepaid label, and choose PayPal, Venmo, or check by mail for payment.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell DVDs for Cash Online | SellBookMedia",
    description:
      "Check DVDs, Blu-rays, and 4K movies by barcode, ship for free, and choose PayPal, Venmo, or check by mail for payment.",
  },
};

const dvdFaqs = [
  {
    q: "What DVDs, Blu-rays, and 4K movies can I sell?",
    a: "We buy eligible DVDs, Blu-rays, 4K UHD movies, TV series, box sets, and collector editions with readable UPC barcodes. Scan or enter the barcode from the exact release to see whether we are currently buying it and what we will pay.",
  },
  {
    q: "How do I find out how much my DVD is worth?",
    a: "Scan or enter the UPC from the exact DVD you own. The barcode identifies the release, while format, current demand, availability, condition, and our current buying criteria help determine whether it qualifies for an offer.",
  },
  {
    q: "Do you buy Blu-rays and 4K UHD movies too?",
    a: "Yes. Eligible Blu-rays and 4K UHD movies can be checked the same way as DVDs. Use the barcode from the exact case, slipcover, or complete outer set so the correct release can be identified.",
  },
  {
    q: "Is shipping free?",
    a: "Yes. For an eligible submitted order, we provide a prepaid shipping label so you do not pay shipping out of pocket.",
  },
  {
    q: "How do I get paid?",
    a: "You can choose PayPal, Venmo, or check by mail. After your shipment arrives and the accepted items pass inspection, payment is processed using the method you selected at checkout.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes. Your order must reach a minimum cash offer of $7.50. You can combine eligible DVDs, Blu-rays, and 4K movies with accepted books, CDs, and video games in the same order.",
  },
  {
    q: "Do you buy every DVD?",
    a: "No. Acceptance and pricing depend on the exact release, format, current demand, resale value, condition, availability, and our current buying criteria. The quote tool will show when an item is not currently accepted.",
  },
  {
    q: "Do I need an account just to check a DVD?",
    a: "No. You can scan or enter a barcode and see whether the item qualifies for an offer before creating an account.",
  },
  {
    q: "Does a sealed DVD automatically have more value?",
    a: "Not necessarily. A sealed copy can be attractive, but the exact release, format, current demand, scarcity, and market activity usually matter more than age or sealed status alone.",
  },
  {
    q: "Can I sell a large DVD or Blu-ray collection?",
    a: "Yes. You can work through a larger collection by scanning each barcode, adding qualifying items to the same order, and shipping accepted media together once your order reaches the minimum.",
  },
];

const offerFactors = [
  {
    title: "Exact release",
    body: "The same movie can exist as a standard DVD, re-release, box set, steelbook, collector edition, Blu-ray, or 4K release. Different versions can have different barcodes and different demand.",
  },
  {
    title: "Format",
    body: "DVD, Blu-ray, and 4K are separate products. A newer or more collectible format can have a very different resale market from a common DVD of the same title.",
  },
  {
    title: "Current demand",
    body: "Demand changes over time. Complete series, harder-to-find films, niche releases, and certain collector editions may attract stronger interest than common mass-market titles.",
  },
  {
    title: "Condition & completeness",
    body: "Deep scratches, missing discs, missing artwork, damaged packaging, mold, or incomplete box sets can affect whether a movie qualifies after inspection.",
  },
  {
    title: "Current buying criteria",
    body: "We do not buy every movie at all times. Our quote tool checks whether the exact release currently meets our purchasing criteria.",
  },
];

const movieFormats = [
  { name: "DVDs", icon: "📀" },
  { name: "Blu-rays", icon: "🔵" },
  { name: "4K UHD Movies", icon: "🎬" },
  { name: "Box Sets & Collector Editions", icon: "📦" },
];

const helpfulGuides = [
  {
    href: "/guides/how-much-are-used-dvds-worth",
    icon: "💵",
    title: "How Much Are Used DVDs Worth?",
    body: "Learn how format, edition, demand, condition, and current resale activity can affect used movie value.",
  },
  {
    href: "/guides/why-are-used-dvds-worth-so-little",
    icon: "📉",
    title: "Why Are Used DVDs Worth So Little?",
    body: "Learn why common DVDs often have low resale value and what can make certain box sets, collector editions, and harder-to-find releases worth checking.",
  },
  {
    href: "/guides/are-old-dvds-worth-anything",
    icon: "✨",
    title: "Are Old DVDs Worth Anything?",
    body: "See which older DVDs, box sets, discontinued titles, anime, and collector editions are especially worth checking.",
  },
  {
    href: "/guides/media-value-by-barcode",
    icon: "🔎",
    title: "Find Media Value by Barcode",
    body: "See why the exact UPC matters when the same movie exists on DVD, Blu-ray, 4K, or in a special edition.",
  },
  {
    href: "/guides/best-places-to-sell-cds-dvds-games",
    icon: "⚖️",
    title: "Best Places to Sell CDs, DVDs & Games",
    body: "Compare direct buyback, marketplaces, local options, and other ways to sell used physical media.",
  },
  {
    href: "/guides/what-to-do-with-old-dvds-and-cds",
    icon: "♻️",
    title: "What to Do With Old DVDs & CDs",
    body: "Compare selling, donating, giving away, and responsible disposal options when clearing a media collection.",
  },
  {
    href: "/guides/where-to-sell-books-and-dvds-for-cash",
    icon: "📍",
    title: "Where to Sell Books & DVDs for Cash",
    body: "Review practical selling options if you are deciding where to send a mixed book and movie collection.",
  },
];

function FreeShipIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7h.01M7 12h.01M7 17h.01M11 7h6M11 12h6M11 17h6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-3"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function SellDvdsForCashPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Sell DVDs, Blu-rays & 4K Movies for Cash",
        serviceType: "Used movie media buyback",
        provider: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
        areaServed: "US",
        description:
          "Sell DVDs, Blu-rays, and 4K movies for cash with instant UPC quotes, free prepaid shipping, and PayPal, Venmo, or check by mail payment.",
        url: PAGE_URL,
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
            name: "Sell DVDs for Cash",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: dvdFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <Link
              href="/"
              className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              SellBookMedia
            </Link>

            <LandingCtaLink
              href="/#quote"
              eventName="dvds_landing_cta_clicked"
              ctaLocation="header"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
            >
              Start Selling
            </LandingCtaLink>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative py-9 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="hidden sm:block absolute top-20 left-10 text-6xl opacity-20">
          📀
        </div>
        <div className="hidden sm:block absolute top-32 right-16 text-5xl opacity-20">
          🎬
        </div>
        <div className="hidden sm:block absolute bottom-20 left-1/4 text-4xl opacity-20">
          🔵
        </div>
        <div className="hidden sm:block absolute bottom-32 right-1/3 text-5xl opacity-20">
          🍿
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs sm:text-base font-semibold tracking-[0.16em] text-blue-100 mb-2 sm:mb-4">
              SELL DVDs, BLU-RAYS &amp; 4K ONLINE
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 leading-tight">
              Sell DVDs for Cash Online
            </h1>

            <p className="text-base sm:text-2xl text-blue-100 mb-5 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
              Scan the UPC on your DVD, Blu-ray, or 4K movie and see our cash
              offer instantly. Get free prepaid shipping and choose PayPal,
              Venmo, or check by mail for payment.
            </p>

            <LandingCtaLink
              href="/#quote"
              eventName="dvds_landing_cta_clicked"
              ctaLocation="hero"
              className="group inline-flex w-full max-w-xs sm:w-auto items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-base sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
            >
              Check My DVD&apos;s Value
              <ArrowRight />
            </LandingCtaLink>

            <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-6 sm:mt-10 max-w-3xl mx-auto">
              <div className="min-h-[78px] sm:min-h-0 rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-2 sm:px-5 py-3 sm:py-5 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-base sm:text-3xl font-bold text-white leading-tight">
                  FREE
                </div>
                <div className="text-[11px] sm:text-base leading-tight text-blue-200 mt-1">
                  Prepaid Shipping
                </div>
              </div>

              <div className="min-h-[78px] sm:min-h-0 rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-2 sm:px-5 py-3 sm:py-5 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-base sm:text-3xl font-bold text-white leading-tight">
                  INSTANT
                </div>
                <div className="text-[11px] sm:text-base leading-tight text-blue-200 mt-1">
                  UPC Cash Offers
                </div>
              </div>

              <div className="min-h-[78px] sm:min-h-0 rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-2 sm:px-5 py-3 sm:py-5 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-sm sm:text-3xl font-bold text-white leading-tight">
                  PayPal + Venmo + Check
                </div>
                <div className="text-[11px] sm:text-base leading-tight text-blue-200 mt-1">
                  Payment Choice
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-5 flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-1 text-xs sm:text-sm text-blue-100">
              <span>No seller fees</span>
              <span aria-hidden="true" className="text-white/30">
                •
              </span>
              <span>No app required</span>
              <span aria-hidden="true" className="text-white/30">
                •
              </span>
              <span>$7.50 minimum</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-700">
              <span className="text-blue-600">
                <FreeShipIcon />
              </span>
              <span className="font-medium">Free prepaid shipping</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-700">
              <span className="text-blue-600">
                <QuoteIcon />
              </span>
              <span className="font-medium">Instant UPC quotes</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-700">
              <span className="text-blue-600">
                <PaymentIcon />
              </span>
              <span className="font-medium">PayPal, Venmo or Check</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-700">
              <span className="text-blue-600">
                <ShieldIcon />
              </span>
              <span className="font-medium">No seller fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Direct movie buyback
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              A Simple Way to Sell Used DVDs Online
            </h2>
          </div>

          <div className="mt-8 prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-5">
            <p>
              Have DVDs, Blu-rays, or 4K movies sitting on a shelf that you no
              longer watch? SellBookMedia lets you check eligible releases
              without creating individual marketplace listings, taking product
              photos, negotiating with buyers, or waiting for someone to
              purchase each title.
            </p>
            <p>
              Scan or enter the UPC from the exact movie in your hand. If
              we&apos;re currently buying that release, you&apos;ll see our cash
              offer instantly. Add qualifying items to your order, submit when
              the total reaches the minimum, and use the prepaid shipping label
              we provide.
            </p>
            <p>
              If you want to understand value first, read our{" "}
              <Link
                href="/guides/how-much-are-used-dvds-worth"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                guide to how much used DVDs are worth
              </Link>
              . If you have a specific disc in front of you, our{" "}
              <Link
                href="/guides/media-value-by-barcode"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                guide to checking media value by barcode
              </Link>{" "}
              explains why the exact UPC and format matter.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              From shelf to payment
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              How to Sell Your DVDs for Cash
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Check the exact release, build your order, and ship accepted
              movies with a prepaid label.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              [
                "1",
                "Scan the UPC",
                "Scan the barcode on your DVD, Blu-ray, or 4K case, or enter it manually. Use the barcode from the exact release in your hand.",
              ],
              [
                "2",
                "See Your Cash Offer",
                "If we are currently buying that release, you will see the offer before deciding whether to add it to your order.",
              ],
              [
                "3",
                "Ship Free & Get Paid",
                "Submit your order, use the prepaid shipping label, and choose PayPal, Venmo, or check by mail after your accepted items arrive and pass inspection.",
              ],
            ].map(([number, title, body]) => (
              <div
                key={number}
                className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <span className="text-2xl font-bold text-white">
                    {number}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              What we buy
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              What DVDs, Blu-rays &amp; 4K Movies Can I Sell?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We buy eligible physical movie releases with readable UPC barcodes
              based on current demand, resale value, exact edition, and
              condition.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {movieFormats.map((format) => (
              <div
                key={format.name}
                className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200"
              >
                <div className="text-4xl mb-3">{format.icon}</div>
                <div className="font-semibold text-gray-800 text-lg">
                  {format.name}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Use the Barcode From the Exact Release
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The same movie can have separate DVD, Blu-ray, 4K, steelbook,
                collector edition, and box-set releases. The UPC helps identify
                the exact product instead of guessing from the movie title
                alone.
              </p>
              <Link
                href="/guides/media-value-by-barcode"
                className="inline-flex mt-4 font-semibold text-blue-600 hover:text-blue-800"
              >
                Learn how barcode value checking works →
              </Link>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Condition &amp; Completeness Still Matter
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A matching barcode does not guarantee acceptance. Serious disc
                damage, missing discs, missing artwork, incomplete sets, mold,
                or other condition problems can make an item ineligible.
              </p>
              <Link
                href="/condition-guidelines"
                className="inline-flex mt-4 font-semibold text-blue-600 hover:text-blue-800"
              >
                Review condition guidelines →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER FACTORS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Why offers differ
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              What Determines Your DVD&apos;s Cash Offer?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              The barcode identifies the exact release. The current offer
              depends on what that release looks like in today&apos;s resale
              market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
            {offerFactors.map((factor, index) => (
              <div
                key={factor.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {factor.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {factor.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  A barcode identifies the release — it does not contain the
                  price
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Use the UPC to identify the exact DVD, Blu-ray, or 4K release
                  first, then check current demand, format, condition,
                  availability, and the buyback offer for that release.
                </p>
              </div>
              <Link
                href="/guides/media-value-by-barcode"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Check Media Value by Barcode →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FORMAT DIFFERENCE */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Same movie, different product
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
                DVD vs. Blu-ray vs. 4K: The Exact Format Matters
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  A standard DVD should not be treated as the same product as a
                  Blu-ray or 4K release of the same movie. Each format usually
                  has its own barcode, packaging, supply, and buyer demand.
                </p>
                <p>
                  Steelbooks, complete series sets, limited editions, collector
                  releases, and upgraded formats can also have very different
                  resale demand from ordinary mass-market copies.
                </p>
              </div>
              <Link
                href="/guides/media-value-by-barcode"
                className="inline-flex mt-6 items-center rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
              >
                See How the Barcode Identifies the Release →
              </Link>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-7 sm:p-8">
              <p className="font-semibold text-gray-900">
                Movie releases worth checking carefully
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "Blu-ray and 4K upgrades",
                  "Steelbooks and collector editions",
                  "Complete TV series and box sets",
                  "Out-of-print or discontinued releases",
                  "Anime, concert, cult, and specialty titles",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-gray-700">
                    <span className="mt-0.5 text-green-600">
                      <CheckIcon />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OLD DVDS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 sm:p-12 text-white shadow-xl">
            <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Before you clear the shelf
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
                  Are Old DVDs Worth Anything?
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-300">
                  Some are, but age alone does not make a DVD valuable. Common
                  releases can stay common for decades, while a discontinued
                  title, complete TV series, unusual box set, anime release,
                  concert DVD, collector edition, or harder-to-find version may
                  deserve a closer look.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/guides/are-old-dvds-worth-anything"
                    className="inline-flex items-center rounded-xl bg-white px-6 py-3 font-bold text-blue-700 hover:bg-slate-100 transition-colors"
                  >
                    Which Old DVDs Can Be Valuable? →
                  </Link>
                  <Link
                    href="/guides/how-much-are-used-dvds-worth"
                    className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    Read the DVD Value Guide →
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  [
                    "1",
                    "Do not judge by age alone",
                    "Demand, exact edition, format, condition, and availability matter more than simply being old.",
                  ],
                  [
                    "2",
                    "Check the exact barcode",
                    "Use the UPC from the movie in your hand instead of estimating from the title or cover art.",
                  ],
                  [
                    "3",
                    "Slow down for unusual releases",
                    "Box sets, steelbooks, discontinued titles, anime, and specialty releases can be worth extra attention.",
                  ],
                ].map(([number, title, body]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-500 font-bold">
                        {number}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">
                          {body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[.95fr_1.05fr] gap-10 items-center">
            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-7 sm:p-8 order-2 lg:order-1">
              <div className="space-y-4">
                {[
                  "Pull out unusual box sets, steelbooks, complete series, and collector editions",
                  "Scan the ordinary titles by UPC instead of researching every movie manually",
                  "Keep qualifying items together and separate damaged or incomplete discs before packing",
                  "Combine accepted DVDs with Blu-rays, 4K movies, books, CDs, and games in the same order",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-gray-700">
                    <span className="mt-0.5 text-green-600">
                      <CheckIcon />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Clearing a movie collection?
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
                You Don&apos;t Need to List Every DVD One at a Time
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                A shelf or several boxes of movies can become hundreds of
                separate jobs if every title needs research, photos, a listing,
                buyer messages, and an individual shipment. Barcode scanning
                gives you a faster way to sort the collection and decide where
                your time is worth spending.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/guides/who-buys-dvd-collections"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  Who Buys DVD Collections? →
                </Link>

                <Link
                  href="/guides/best-places-to-sell-cds-dvds-games"
                  className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-bold text-gray-800 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  Compare Selling Options →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Choose the workflow that fits you
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Sell Directly vs. List Every Movie on a Marketplace
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Individual selling can make sense for a truly collectible title. A
              direct buyback is designed for convenience when you want to move
              through a larger group of ordinary used media.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-3 bg-slate-900 text-white font-bold text-sm sm:text-base">
              <div className="p-4 sm:p-5">What matters</div>
              <div className="p-4 sm:p-5 border-l border-white/10">
                SellBookMedia
              </div>
              <div className="p-4 sm:p-5 border-l border-white/10">
                Marketplace listing
              </div>
            </div>

            {[
              [
                "Offer",
                "See the current buyback offer before shipping",
                "Choose a listing price and wait for a buyer",
              ],
              [
                "Photos & descriptions",
                "No individual product listing",
                "Usually needed for each item",
              ],
              [
                "Buyer messages",
                "No buyer negotiation",
                "May require questions and communication",
              ],
              [
                "Shipping",
                "Accepted items can ship together with a prepaid label",
                "Often handled sale by sale",
              ],
              [
                "Seller fees",
                "No seller fees charged by SellBookMedia",
                "Platform fees may apply",
              ],
              [
                "Best fit",
                "Convenient for clearing multiple eligible titles",
                "Can make sense for rare or high-value collectibles",
              ],
            ].map(([label, direct, marketplace]) => (
              <div
                key={label}
                className="grid grid-cols-3 border-t border-gray-200 text-sm sm:text-base"
              >
                <div className="p-4 sm:p-5 font-semibold text-gray-900 bg-slate-50">
                  {label}
                </div>
                <div className="p-4 sm:p-5 border-l border-gray-200 text-gray-700">
                  {direct}
                </div>
                <div className="p-4 sm:p-5 border-l border-gray-200 text-gray-600">
                  {marketplace}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-gray-500 text-center">
            For genuinely rare or collectible releases, it can be worth checking
            collector-market sales before choosing any bulk buyback option.
          </p>
        </div>
      </section>

      {/* WHY SELLBOOKMEDIA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Straightforward by design
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Why Sell DVDs to SellBookMedia?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              [
                "No Marketplace Listings",
                "Skip individual photos, descriptions, buyer messages, auctions, and waiting for each movie to sell.",
              ],
              [
                "Exact-Release UPC Quotes",
                "Use the barcode to check the specific DVD, Blu-ray, 4K, box set, or collector edition you actually own.",
              ],
              [
                "Free Prepaid Shipping",
                "We provide a prepaid shipping label for an eligible submitted order, so you do not pay shipping out of pocket.",
              ],
              [
                "Flexible Payment Options",
                "Choose PayPal, Venmo, or check by mail at checkout.",
              ],
              [
                "Mix Eligible Media",
                "Accepted DVDs can be combined with qualifying Blu-rays, 4K movies, CDs, books, and video games in the same order.",
              ],
              [
                "Clear Yes-or-No Results",
                "If an item does not currently meet our purchasing criteria, the quote tool tells you instead of making you guess.",
              ],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-slate-50 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MIXED MEDIA */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 sm:p-10">
            <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Cleaning out more than movies?
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
                  One Order Can Include More Than DVDs
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-gray-600">
                  Accepted DVDs, Blu-rays, and 4K movies can be combined with
                  qualifying books, CDs, and video games in the same order. That
                  makes it easier to clear a mixed media collection without
                  creating separate transactions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/sell-books-for-cash"
                  className="rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="text-3xl">📚</div>
                  <div className="mt-3 font-bold text-gray-900">Sell Books</div>
                </Link>
                <Link
                  href="/sell-cds-for-cash"
                  className="rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="text-3xl">💿</div>
                  <div className="mt-3 font-bold text-gray-900">Sell CDs</div>
                </Link>
                <Link
                  href="/sell-video-games-for-cash"
                  className="rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="text-3xl">🎮</div>
                  <div className="mt-3 font-bold text-gray-900">
                    Sell Video Games
                  </div>
                </Link>
                <Link
                  href="/seller-guide"
                  className="rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="text-3xl">📦</div>
                  <div className="mt-3 font-bold text-gray-900">
                    Seller Guide
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HELPFUL RESOURCES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Helpful before you sell
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              DVD, Blu-ray &amp; 4K Selling Guides
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Go deeper on movie value, exact-release barcodes, older DVDs,
              collection clean-outs, and different ways to sell physical media.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {helpfulGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group rounded-2xl border border-gray-200 bg-slate-50 p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="text-3xl">{guide.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                  {guide.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {guide.body}
                </p>
                <span className="mt-4 inline-flex font-semibold text-blue-600">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / SUPPORT LINKS */}
      <section className="py-14 bg-slate-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-900 text-lg">
                Want to know who we are?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Learn what SellBookMedia buys and why we focus on helping
                physical media find another useful life.
              </p>
              <Link
                href="/about"
                className="inline-flex mt-4 font-semibold text-blue-600 hover:text-blue-800"
              >
                About SellBookMedia →
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-900 text-lg">
                Need help before shipping?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Check common questions about selling, shipping, account details,
                and the order process.
              </p>
              <Link
                href="/help"
                className="inline-flex mt-4 font-semibold text-blue-600 hover:text-blue-800"
              >
                Visit Help Center →
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-900 text-lg">
                Review our policies
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Read the returns policy and seller terms before submitting an
                order if you want the full details.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                <Link
                  href="/returns-policy"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Returns →
                </Link>
                <Link
                  href="/terms"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Terms →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MediaCategoryLinks current="dvds" />

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Common questions
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              What to know before selling DVDs, Blu-rays, and 4K movies for cash
              online
            </p>
          </div>

          <div className="space-y-4">
            {dvdFaqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-slate-50 rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
                  {faq.q}
                  <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
            Have a movie within reach?
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            See What Your DVD Is Worth
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Scan the barcode and see whether we&apos;re currently buying that
            exact DVD, Blu-ray, or 4K release.
          </p>

          <LandingCtaLink
            href="/#quote"
            eventName="dvds_landing_cta_clicked"
            ctaLocation="footer"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Get My DVD Quote
            <ArrowRight />
          </LandingCtaLink>

          <p className="mt-5 text-sm text-blue-100">
            Instant quote • Free prepaid shipping • PayPal, Venmo or Check
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 block"
              >
                SellBookMedia
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6">
                We buy used books, CDs, DVDs, Blu-rays, 4K movies, and games for
                cash.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">For Sellers</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/sell-books-for-cash"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sell Books for Cash
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sell-dvds-for-cash"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sell DVDs, Blu-rays &amp; 4K
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sell-cds-for-cash"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sell CDs for Cash
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sell-video-games-for-cash"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sell Video Games for Cash
                  </Link>
                </li>
                <li>
                  <Link
                    href="/condition-guidelines"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Condition Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/seller-guide"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Seller Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Guides</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/guides/how-much-are-used-dvds-worth"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How Much Are Used DVDs Worth?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/are-old-dvds-worth-anything"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Are Old DVDs Worth Anything?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/media-value-by-barcode"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Media Value by Barcode
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/best-places-to-sell-cds-dvds-games"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Best Places to Sell
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/what-to-do-with-old-dvds-and-cds"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    What to Do With Old DVDs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/decluttr-shut-down-alternative"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Decluttr Alternative
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns-policy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Returns Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2026 SellBookMedia. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                <span className="text-gray-400 text-sm">
                  Made with ❤️ for collectors
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
