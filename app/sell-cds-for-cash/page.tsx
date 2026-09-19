import type { Metadata } from "next";
import Link from "next/link";
import MediaCategoryLinks from "../../components/MediaCategoryLinks";
import LandingCtaLink from "../../components/LandingCtaLink";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/sell-cds-for-cash`;

export const metadata: Metadata = {
  title: "Sell CDs for Cash Online | SellBookMedia",
  description:
    "Sell used CDs for cash with SellBookMedia. Scan the UPC for an instant quote, get free prepaid shipping, and choose PayPal, Venmo, or check by mail for payment.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Sell CDs for Cash Online | SellBookMedia",
    description:
      "Scan your CD barcode for an instant cash offer, ship accepted CDs with a prepaid label, and choose PayPal, Venmo, or check by mail for payment.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell CDs for Cash Online | SellBookMedia",
    description:
      "Scan your CD barcode, see your offer instantly, ship for free, and choose PayPal, Venmo, or check by mail for payment.",
  },
};

const cdFaqs = [
  {
    q: "What CDs can I sell?",
    a: "We buy eligible music CDs, box sets, and collector editions with readable UPC barcodes. Scan or enter the barcode from the exact release to see whether we are currently buying it and what we will pay.",
  },
  {
    q: "How do I know how much my CD is worth?",
    a: "Scan or enter the UPC on the exact CD you own. The barcode identifies the release, while current demand, availability, condition, and our current buying criteria help determine whether it qualifies for an offer.",
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
    a: "Yes. Your order must reach a minimum cash offer of $7.50. You can combine eligible CDs with accepted books, DVDs, Blu-rays, 4K movies, and video games in the same order.",
  },
  {
    q: "Do you buy every CD?",
    a: "No. Acceptance and pricing depend on the exact release, current demand, resale value, condition, availability, and our current buying criteria. The quote tool will show when a CD is not currently accepted.",
  },
  {
    q: "Do I need an account just to check a CD?",
    a: "No. You can scan or enter a barcode and see whether the CD qualifies for an offer before creating an account.",
  },
  {
    q: "Do you buy CDs without the original case or artwork?",
    a: "The exact requirements depend on the item, but missing discs, missing essential artwork or components, serious damage, or other condition problems can make an item ineligible. Review our condition guidelines before shipping.",
  },
  {
    q: "Do you buy vinyl records or cassette tapes?",
    a: "Not currently. SellBookMedia focuses on CDs, DVDs, Blu-rays, 4K UHD, books, and qualifying video games.",
  },
  {
    q: "Can I sell a large CD collection?",
    a: "Yes. You can work through a large collection by scanning each barcode, adding qualifying CDs to the same order, and shipping accepted items together once your order reaches the minimum.",
  },
];

const offerFactors = [
  {
    title: "Exact release",
    body: "Two copies of the same album can be different releases. Reissues, imports, remasters, box sets, and special editions may use different barcodes and can have different resale demand.",
  },
  {
    title: "Current demand",
    body: "Demand changes over time. A title that buyers are actively looking for can qualify differently from a common release with weak current demand.",
  },
  {
    title: "Condition & completeness",
    body: "Deep scratches, missing discs, missing artwork, damaged packaging, mold, or other serious problems can affect whether a CD qualifies after inspection.",
  },
  {
    title: "Availability & edition",
    body: "Harder-to-find releases, imports, unusual pressings, and complete box sets can have very different demand from ordinary mass-market copies.",
  },
  {
    title: "Current buying criteria",
    body: "We do not buy every CD at all times. Our quote tool checks whether the exact release currently meets our purchasing criteria.",
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

export default function SellCdsForCashPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Sell CDs for Cash",
        serviceType: "Used CD buyback",
        provider: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
        areaServed: "US",
        description:
          "Sell used CDs for cash with instant UPC quotes, free prepaid shipping, and PayPal, Venmo, or check by mail payment.",
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
            name: "Sell CDs for Cash",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: cdFaqs.map((faq) => ({
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
              eventName="cds_landing_cta_clicked"
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

        <div className="hidden sm:block absolute top-20 left-10 text-6xl opacity-20">💿</div>
        <div className="hidden sm:block absolute top-32 right-16 text-5xl opacity-20">🎵</div>
        <div className="hidden sm:block absolute bottom-20 left-1/4 text-4xl opacity-20">🎶</div>
        <div className="hidden sm:block absolute bottom-32 right-1/3 text-5xl opacity-20">💿</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs sm:text-base font-semibold tracking-[0.16em] text-blue-100 mb-2 sm:mb-4">
              SELL USED CDs ONLINE
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 leading-tight">
              Sell CDs for Cash Online
            </h1>

            <p className="text-base sm:text-2xl text-blue-100 mb-5 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
              Scan or enter the UPC on your CD and see our cash offer instantly. Get free prepaid shipping and choose PayPal, Venmo, or check by mail for payment.
            </p>

            <LandingCtaLink
              href="/#quote"
              eventName="cds_landing_cta_clicked"
              ctaLocation="hero"
              className="group inline-flex w-full max-w-xs sm:w-auto items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-base sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
            >
              Check My CD&apos;s Value
              <ArrowRight />
            </LandingCtaLink>

            <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-6 sm:mt-10 max-w-3xl mx-auto">
              <div className="min-h-[78px] sm:min-h-0 rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-2 sm:px-5 py-3 sm:py-5 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-base sm:text-3xl font-bold text-white leading-tight">FREE</div>
                <div className="text-[11px] sm:text-base leading-tight text-blue-200 mt-1">
                  Prepaid Shipping
                </div>
              </div>

              <div className="min-h-[78px] sm:min-h-0 rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-2 sm:px-5 py-3 sm:py-5 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-base sm:text-3xl font-bold text-white leading-tight">INSTANT</div>
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
              <span aria-hidden="true" className="text-white/30">•</span>
              <span>No app required</span>
              <span aria-hidden="true" className="text-white/30">•</span>
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
              <span className="text-blue-600"><FreeShipIcon /></span>
              <span className="font-medium">Free prepaid shipping</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-700">
              <span className="text-blue-600"><QuoteIcon /></span>
              <span className="font-medium">Instant UPC quotes</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-700">
              <span className="text-blue-600"><PaymentIcon /></span>
              <span className="font-medium">PayPal, Venmo or Check</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-700">
              <span className="text-blue-600"><ShieldIcon /></span>
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
              Direct CD buyback
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              An Easy Way to Sell Used CDs Online
            </h2>
          </div>

          <div className="mt-8 prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-5">
            <p>
              Have a shelf, box, or full music collection you no longer need?
              SellBookMedia lets you check eligible CDs without creating individual
              marketplace listings, taking product photos, negotiating with buyers,
              or waiting for someone to purchase each album.
            </p>

            <p>
              Scan or enter the UPC from the exact CD in your hand. If we&apos;re
              currently buying that release, you&apos;ll see our cash offer instantly.
              Add qualifying CDs to your order, submit when the total reaches the
              minimum, and use the prepaid shipping label we provide.
            </p>

            <p>
              If you&apos;re trying to understand the market first, read our{" "}
              <Link
                href="/guides/how-much-are-used-cds-worth"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                guide to how much used CDs are worth
              </Link>
              . If you have a specific disc in front of you, our{" "}
              <Link
                href="/guides/media-value-by-barcode"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                guide to checking media value by barcode
              </Link>{" "}
              explains why the exact UPC matters.
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
              How to Sell Your CDs for Cash
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Check the exact release, build your order, and ship accepted CDs with a prepaid label.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Scan the UPC</h3>
              <p className="text-gray-600 leading-relaxed">
                Scan the barcode on the CD case or enter the code manually. If we&apos;re
                currently buying that exact release, you&apos;ll see the cash offer instantly.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Your Order</h3>
              <p className="text-gray-600 leading-relaxed">
                Add accepted CDs as you scan. You can also mix qualifying books, DVDs,
                Blu-rays, 4K movies, and video games in the same order.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ship Free &amp; Get Paid</h3>
              <p className="text-gray-600 leading-relaxed">
                Submit an eligible order, use the prepaid shipping label, and choose
                PayPal, Venmo, or check by mail after the shipment arrives and passes inspection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT CDS CAN I SELL */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              What we check
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              What CDs Can I Sell?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We focus on eligible music CDs and complete releases that can be identified by a readable UPC barcode.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Music CDs", icon: "💿" },
              { name: "CD Box Sets", icon: "📦" },
              { name: "Collector Editions", icon: "✨" },
              { name: "Imports & Special Releases", icon: "🌎" },
            ].map((cd) => (
              <div
                key={cd.name}
                className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200"
              >
                <div className="text-4xl mb-3">{cd.icon}</div>
                <div className="font-semibold text-gray-800 text-lg">{cd.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-2">Use the Barcode From the Exact Release</h3>
              <p className="text-gray-600 leading-relaxed">
                An album can have multiple pressings or reissues. The UPC helps identify the
                specific retail release instead of guessing from the artist and album title alone.
              </p>
              <Link
                href="/guides/media-value-by-barcode"
                className="inline-flex mt-4 font-semibold text-blue-600 hover:text-blue-800"
              >
                Learn how barcode value checking works →
              </Link>
            </div>

            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-2">Condition Still Matters</h3>
              <p className="text-gray-600 leading-relaxed">
                A matching barcode does not guarantee acceptance. Serious disc damage,
                missing components, mold, or other condition problems can make an item ineligible.
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
              What Determines Your CD&apos;s Cash Offer?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              The barcode identifies the release. The current offer depends on what that exact release looks like in today&apos;s resale market.
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
                <h3 className="font-bold text-gray-900 text-lg">{factor.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{factor.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  A barcode identifies the release — it does not contain the price
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Use the UPC to identify the exact CD first, then check current demand,
                  condition, availability, and the buyback offer for that release.
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

      {/* OLD CDS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Before you clear the shelf
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
                Are Old CDs Worth Anything?
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  Some are, but age alone does not make a CD valuable. A common release can
                  stay common for decades, while an import, unusual pressing, limited edition,
                  complete box set, or harder-to-find release may have stronger demand.
                </p>
                <p>
                  The fastest first step is to scan the exact barcode rather than trying to
                  estimate value from the artist or album title alone.
                </p>
              </div>
              <Link
                href="/guides/how-much-are-used-cds-worth"
                className="inline-flex mt-6 items-center rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Read the Used CD Value Guide →
              </Link>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-7 sm:p-8">
              <p className="font-semibold text-gray-900">CDs that deserve a closer look</p>
              <div className="mt-5 space-y-4">
                {[
                  "Out-of-print or harder-to-find albums",
                  "Japanese and imported pressings",
                  "Complete box sets and collector editions",
                  "Jazz, classical, blues, and specialty releases",
                  "Limited, early, or unusual editions",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-gray-700">
                    <span className="mt-0.5 text-green-600"><CheckIcon /></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LARGE COLLECTION */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 sm:p-12 text-white shadow-xl">
            <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Have boxes of CDs?
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
                  Selling a Large CD Collection Doesn&apos;t Need to Become a Second Job
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-300">
                  Listing hundreds of discs one at a time can mean hundreds of price checks,
                  photos, descriptions, buyer messages, packages, and shipments. A faster
                  workflow is to pull out anything unusual, then scan the rest by barcode and
                  build one order as you go.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/guides/who-buys-cd-collections"
                    className="inline-flex items-center rounded-xl bg-white px-6 py-3 font-bold text-blue-700 hover:bg-slate-100 transition-colors"
                  >
                    Who Buys CD Collections? →
                  </Link>

                  <Link
                    href="/guides/how-to-sell-a-cd-collection"
                    className="inline-flex items-center rounded-xl border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10 transition-colors"
                  >
                    How to Sell a Large CD Collection →
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  ["1", "Pull out unusual CDs", "Set aside imports, box sets, special packaging, and anything that looks collectible."],
                  ["2", "Scan the everyday titles", "Use the UPC to check each exact release instead of researching every album manually."],
                  ["3", "Sort as you go", "Keep accepted titles together, separate damaged items, and research true rarities independently."],
                ].map(([number, title, body]) => (
                  <div key={number} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-500 font-bold">
                        {number}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">{body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Choose the selling method that fits your time
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Sell CDs Directly vs. Listing Them on a Marketplace
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Individual marketplaces can make sense for truly collectible CDs. A direct buyback is built for sellers who prefer a simpler way to process ordinary used media.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 bg-slate-900 text-white font-semibold text-sm sm:text-base">
              <div className="p-4 sm:p-5">What changes?</div>
              <div className="p-4 sm:p-5 border-l border-white/10">SellBookMedia</div>
              <div className="p-4 sm:p-5 border-l border-white/10">Marketplace listing</div>
            </div>

            {[
              ["Knowing your price", "See our cash offer before shipping", "Set a listing price and wait for a buyer"],
              ["Creating a listing", "No product listing to create", "Photos and listing details may be needed"],
              ["Buyer communication", "No buyer messages", "Buyer questions or offers may be part of the sale"],
              ["Shipping", "Prepaid label for eligible submitted orders", "Shipping is usually handled sale by sale"],
              ["Seller fees", "No seller fees charged by SellBookMedia", "Marketplace fees may apply"],
            ].map((row, index) => (
              <div
                key={row[0]}
                className={`grid grid-cols-3 text-sm sm:text-base ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
              >
                <div className="p-4 sm:p-5 font-semibold text-gray-900">{row[0]}</div>
                <div className="p-4 sm:p-5 border-l border-gray-200 text-gray-700">{row[1]}</div>
                <div className="p-4 sm:p-5 border-l border-gray-200 text-gray-600">{row[2]}</div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-gray-500 text-center">
            Want a broader comparison? Read our{" "}
            <Link
              href="/guides/best-places-to-sell-cds-dvds-games"
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              guide to the best places to sell CDs, DVDs, and games
            </Link>
            .
          </p>
        </div>
      </section>

      {/* WHY SELLBOOKMEDIA */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Clear from quote to payment
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Why Sell CDs to SellBookMedia?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">See Your Offer First</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Check the exact UPC and see the current offer before deciding whether to add the CD to your order.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">No Marketplace Listings</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                No product photos, descriptions, auctions, buyer messages, or waiting for an individual buyer to purchase each CD.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Free Prepaid Shipping</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                We provide the shipping label for an eligible submitted order, so you do not pay shipping out of pocket.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Flexible Payment Options</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Choose PayPal, Venmo, or check by mail when you complete checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MIXED MEDIA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 sm:p-10">
            <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Cleaning out more than music?
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
                  One Order Can Include More Than CDs
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-gray-600">
                  Accepted CDs can be combined with qualifying books, DVDs, Blu-rays,
                  4K movies, and video games in the same order. That makes it easier to
                  clear a mixed media collection without creating separate transactions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/sell-books-for-cash" className="rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="text-3xl">📚</div>
                  <div className="mt-3 font-bold text-gray-900">Sell Books</div>
                </Link>
                <Link href="/sell-dvds-for-cash" className="rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="text-3xl">📀</div>
                  <div className="mt-3 font-bold text-gray-900">Sell DVDs &amp; Blu-rays</div>
                </Link>
                <Link href="/sell-video-games-for-cash" className="rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="text-3xl">🎮</div>
                  <div className="mt-3 font-bold text-gray-900">Sell Video Games</div>
                </Link>
                <Link href="/seller-guide" className="rounded-2xl border border-blue-100 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className="text-3xl">📦</div>
                  <div className="mt-3 font-bold text-gray-900">Seller Guide</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HELPFUL RESOURCES */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Helpful before you sell
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              CD Selling &amp; Value Guides
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Go deeper on CD value, barcodes, large collections, selling options, and what to do with the discs you decide not to sell.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/guides/how-much-are-used-cds-worth"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">💵</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                How Much Are Used CDs Worth?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Learn what makes one CD more valuable than another and which releases are worth checking closely.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Read guide →</span>
            </Link>

            <Link
              href="/guides/media-value-by-barcode"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">🔎</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                Find Media Value by Barcode
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                See how a UPC identifies the exact CD, DVD, Blu-ray, or 4K release you own.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Read guide →</span>
            </Link>

            <Link
              href="/guides/who-buys-cd-collections"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">💿</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                Who Buys CD Collections?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Compare online buyback services, record stores, marketplace buyers, collectors, and other options for large CD collections.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Read guide →</span>
            </Link>

            <Link
              href="/guides/how-to-sell-a-cd-collection"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">📦</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                How to Sell a Large CD Collection
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Work through hundreds of CDs without turning every disc into a separate listing.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Read guide →</span>
            </Link>

            <Link
              href="/guides/best-places-to-sell-cds-dvds-games"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">⚖️</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                Best Places to Sell CDs, DVDs &amp; Games
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Compare direct buyback, marketplaces, local options, and other ways to sell used media.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Read guide →</span>
            </Link>

            <Link
              href="/guides/what-to-do-with-old-dvds-and-cds"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">♻️</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                What to Do With Old DVDs &amp; CDs
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Compare selling, donating, giving away, and responsible disposal options for unwanted media.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Read guide →</span>
            </Link>

            <Link
              href="/condition-guidelines"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">✅</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                Condition Guidelines
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Check the condition requirements before you pack and ship accepted CDs.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Review guidelines →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST / SUPPORT LINKS */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-lg">Want to know who we are?</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Learn what SellBookMedia buys and why we focus on helping physical media find another useful life.
              </p>
              <Link href="/about" className="inline-flex mt-4 font-semibold text-blue-600 hover:text-blue-800">
                About SellBookMedia →
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-lg">Need help before shipping?</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Check common questions about selling, shipping, account details, and the order process.
              </p>
              <Link href="/help" className="inline-flex mt-4 font-semibold text-blue-600 hover:text-blue-800">
                Visit Help Center →
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-lg">Review our policies</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Read the returns policy and seller terms before submitting an order if you want the full details.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                <Link href="/returns-policy" className="font-semibold text-blue-600 hover:text-blue-800">Returns →</Link>
                <Link href="/terms" className="font-semibold text-blue-600 hover:text-blue-800">Terms →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MediaCategoryLinks current="cds" />

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
              What to know before selling used CDs for cash online
            </p>
          </div>

          <div className="space-y-4">
            {cdFaqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-slate-50 rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
                  {faq.q}
                  <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
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
            Have a CD within reach?
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            See What Your CD Is Worth
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Scan the barcode and see whether we&apos;re currently buying that exact release.
          </p>

          <LandingCtaLink
            href="/#quote"
            eventName="cds_landing_cta_clicked"
            ctaLocation="footer"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Get My CD Quote
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
                We buy used books, CDs, DVDs, Blu-rays, 4K movies, and games for cash.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">For Sellers</h4>
              <ul className="space-y-3">
                <li><Link href="/sell-books-for-cash" className="text-gray-400 hover:text-white transition-colors">Sell Books for Cash</Link></li>
                <li><Link href="/sell-dvds-for-cash" className="text-gray-400 hover:text-white transition-colors">Sell DVDs, Blu-rays &amp; 4K</Link></li>
                <li><Link href="/sell-cds-for-cash" className="text-gray-400 hover:text-white transition-colors">Sell CDs for Cash</Link></li>
                <li><Link href="/sell-video-games-for-cash" className="text-gray-400 hover:text-white transition-colors">Sell Video Games for Cash</Link></li>
                <li><Link href="/condition-guidelines" className="text-gray-400 hover:text-white transition-colors">Condition Guidelines</Link></li>
                <li><Link href="/seller-guide" className="text-gray-400 hover:text-white transition-colors">Seller Guide</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">CD Guides</h4>
              <ul className="space-y-3">
                <li><Link href="/guides/how-much-are-used-cds-worth" className="text-gray-400 hover:text-white transition-colors">How Much Are Used CDs Worth?</Link></li>
                <li><Link href="/guides/media-value-by-barcode" className="text-gray-400 hover:text-white transition-colors">Media Value by Barcode</Link></li>
                <li><Link href="/guides/who-buys-cd-collections" className="text-gray-400 hover:text-white transition-colors">Who Buys CD Collections?</Link></li>
                <li><Link href="/guides/how-to-sell-a-cd-collection" className="text-gray-400 hover:text-white transition-colors">Sell a Large CD Collection</Link></li>
                <li><Link href="/guides/best-places-to-sell-cds-dvds-games" className="text-gray-400 hover:text-white transition-colors">Best Places to Sell CDs</Link></li>
                <li><Link href="/guides/what-to-do-with-old-dvds-and-cds" className="text-gray-400 hover:text-white transition-colors">What to Do With Old CDs</Link></li>
                <li><Link href="/guides/decluttr-shut-down-alternative" className="text-gray-400 hover:text-white transition-colors">Decluttr Alternative</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/returns-policy" className="text-gray-400 hover:text-white transition-colors">Returns Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2026 SellBookMedia. All rights reserved.</p>
              <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                <span className="text-gray-400 text-sm">Made with ❤️ for collectors</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
