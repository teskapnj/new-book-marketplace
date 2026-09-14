import Link from "next/link";
import type { Metadata } from "next";
import MediaCategoryLinks from "../../components/MediaCategoryLinks";
import LandingCtaLink from "../../components/LandingCtaLink";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/sell-video-games-for-cash`;

export const metadata: Metadata = {
  title: "Sell Video Games for Cash Online | Retro & Used Games | SellBookMedia",
  description:
    "Sell used video games for cash with SellBookMedia. Check eligible PS1, PS2, GameCube, Nintendo, Xbox, retro, and modern games by barcode, ship free, and choose PayPal, Venmo, or check by mail.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Sell Video Games for Cash Online | SellBookMedia",
    description:
      "Scan a game barcode for an instant cash offer, ship accepted games with a prepaid label, and choose PayPal, Venmo, or check by mail for payment.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Video Games for Cash Online | SellBookMedia",
    description:
      "Check eligible used and retro video games by barcode, ship for free, and choose PayPal, Venmo, or check by mail for payment.",
  },
};

const gameFaqs = [
  {
    q: "What video games can I sell?",
    a: "We buy eligible physical video games with a readable UPC or retail barcode. Scan or enter the barcode to see whether we are currently buying the exact game and what we will pay.",
  },
  {
    q: "Do you buy PS1 and PS2 games?",
    a: "Yes. Eligible PS1 and PS2 games can qualify, along with other PlayStation, Xbox, Nintendo, GameCube, and retro game titles. Scan the barcode from the exact copy to check the current offer.",
  },
  {
    q: "Do you buy retro video games?",
    a: "We buy eligible retro games when the exact item can be identified by barcode and meets our current buying criteria. Older games can vary widely in value depending on platform, title, edition, demand, condition, and completeness.",
  },
  {
    q: "How do I find out how much my video game is worth?",
    a: "Scan or enter the barcode from the game case or original retail packaging. If we are currently buying that exact title and release, you will see our cash offer instantly.",
  },
  {
    q: "Can I sell a whole video game collection?",
    a: "Yes. You can scan a larger collection one game at a time, add qualifying titles to the same order, and ship accepted games together once your order reaches the minimum.",
  },
  {
    q: "Is shipping free?",
    a: "Yes. For an eligible submitted order, we provide a prepaid shipping label so you do not pay shipping out of pocket.",
  },
  {
    q: "How do I get paid?",
    a: "You can choose PayPal, Venmo, or check by mail. After your shipment arrives and the accepted games pass inspection, payment is processed using the method you selected at checkout.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes. Your order must reach a minimum cash offer of $7.50. Eligible video games can be combined with accepted books, CDs, DVDs, Blu-rays, and 4K movies in the same order.",
  },
  {
    q: "Do you buy every video game?",
    a: "No. Offers depend on the exact title, platform, edition, current demand, resale value, condition, completeness, and our current buying criteria. If a game does not qualify, it will show as not accepted.",
  },
  {
    q: "Can I check a game without creating an account?",
    a: "Yes. You can scan or enter a barcode and see whether the game qualifies for an offer before creating an account.",
  },
  {
    q: "Can I sell loose games without the original case?",
    a: "Our quote system identifies games by barcode, so the exact game needs a readable UPC or retail barcode to be checked. Missing cases, artwork, inserts, or other original components can also affect condition and eligibility.",
  },
];

const offerFactors = [
  {
    title: "Exact title & release",
    body: "Different releases of the same game can have different barcodes, packaging, editions, and resale demand. The exact copy in your hand matters more than the title alone.",
  },
  {
    title: "Platform",
    body: "A PlayStation, Xbox, Nintendo, GameCube, or other platform version can have a very different resale market from another version of the same game.",
  },
  {
    title: "Current demand",
    body: "Buyer demand changes over time. Some older, discontinued, niche, or harder-to-find games can attract stronger interest than common mass-market titles.",
  },
  {
    title: "Edition & completeness",
    body: "Collector editions, complete copies, original cases, artwork, manuals, inserts, and included discs can affect whether a game is more desirable or qualifies after inspection.",
  },
  {
    title: "Condition",
    body: "Heavy scratches, cracked discs, damaged labels, missing components, water damage, mold, or badly damaged packaging can affect eligibility and final inspection.",
  },
  {
    title: "Current buying criteria",
    body: "We do not buy every game at all times. Our quote tool checks whether the exact title currently meets SellBookMedia's purchasing criteria.",
  },
];

const gamePlatforms = [
  { name: "PS1 & PS2 Games", icon: "🎮" },
  { name: "PlayStation Games", icon: "🕹️" },
  { name: "Nintendo & GameCube", icon: "⭐" },
  { name: "Xbox Games", icon: "🟢" },
  { name: "Retro Game Titles", icon: "👾" },
  { name: "Collector Editions", icon: "📦" },
];

const helpfulGuides = [
  {
    href: "/guides/sell-video-games-for-cash",
    icon: "🎮",
    title: "Video Game Selling Guide",
    body: "Learn what can affect game value, including PS1, PS2, GameCube, Xbox, Nintendo, retro, and modern titles.",
  },
  {
    href: "/guides/media-value-by-barcode",
    icon: "🔎",
    title: "Find Media Value by Barcode",
    body: "See why the exact UPC matters when identifying a physical game, edition, platform release, or other media item.",
  },
  {
    href: "/guides/best-places-to-sell-cds-dvds-games",
    icon: "⚖️",
    title: "Best Places to Sell CDs, DVDs & Games",
    body: "Compare direct buyback, marketplaces, local options, and other ways to sell used physical media.",
  },
  {
    href: "/guides/decluttr-shut-down-alternative",
    icon: "🔄",
    title: "Looking for a Decluttr Alternative?",
    body: "See another option for checking books, CDs, DVDs, Blu-rays, games, and other eligible media in one place.",
  },
];

function FreeShipIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 7h.01M7 12h.01M7 17h.01M11 7h6M11 12h6M11 17h6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-3">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function SellVideoGamesForCashPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Sell Video Games for Cash",
        serviceType: "Used video game buyback",
        provider: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
        areaServed: "US",
        description:
          "Sell eligible used and retro video games for cash with instant barcode quotes, free prepaid shipping, and PayPal, Venmo, or check by mail payment.",
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
            name: "Sell Video Games for Cash",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: gameFaqs.map((faq) => ({
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
    <div className="min-h-screen bg-white">
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
              eventName="games_landing_cta_clicked"
              ctaLocation="header"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
            >
              Check a Game
            </LandingCtaLink>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative py-9 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="hidden sm:block absolute top-20 left-10 text-6xl opacity-20">🎮</div>
        <div className="hidden sm:block absolute top-32 right-16 text-5xl opacity-20">🕹️</div>
        <div className="hidden sm:block absolute bottom-20 left-1/4 text-4xl opacity-20">👾</div>
        <div className="hidden sm:block absolute bottom-32 right-1/3 text-5xl opacity-20">💿</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs sm:text-base font-semibold tracking-[0.16em] text-blue-100 mb-2 sm:mb-4">
              SELL USED &amp; RETRO VIDEO GAMES ONLINE
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 leading-tight">
              Sell Video Games for Cash Online
            </h1>

            <p className="text-base sm:text-2xl text-blue-100 mb-5 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
              Scan the barcode on an eligible game and see our cash offer instantly. Get free prepaid shipping and choose PayPal, Venmo, or check by mail for payment.
            </p>

            <LandingCtaLink
              href="/#quote"
              eventName="games_landing_cta_clicked"
              ctaLocation="hero"
              className="group inline-flex w-full max-w-xs sm:w-auto items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-base sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
            >
              Check My Game&apos;s Value
              <ArrowRight />
            </LandingCtaLink>

            <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-6 sm:mt-10 max-w-3xl mx-auto">
              <div className="min-h-[78px] sm:min-h-0 rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-2 sm:px-5 py-3 sm:py-5 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-base sm:text-3xl font-bold text-white leading-tight">FREE</div>
                <div className="text-[11px] sm:text-base leading-tight text-blue-200 mt-1">Prepaid Shipping</div>
              </div>

              <div className="min-h-[78px] sm:min-h-0 rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-2 sm:px-5 py-3 sm:py-5 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-base sm:text-3xl font-bold text-white leading-tight">INSTANT</div>
                <div className="text-[11px] sm:text-base leading-tight text-blue-200 mt-1">Barcode Offers</div>
              </div>

              <div className="min-h-[78px] sm:min-h-0 rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-2 sm:px-5 py-3 sm:py-5 backdrop-blur-sm flex flex-col justify-center">
                <div className="text-sm sm:text-3xl font-bold text-white leading-tight">PayPal + Venmo + Check</div>
                <div className="text-[11px] sm:text-base leading-tight text-blue-200 mt-1">Payment Choice</div>
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
              <span className="font-medium">Instant barcode quotes</span>
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Direct game buyback</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">A Simple Way to Sell Used Video Games Online</h2>
          </div>

          <div className="mt-8 prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-5">
            <p>
              Have old video games you no longer play? SellBookMedia lets you check eligible physical games without creating individual marketplace listings, taking product photos, negotiating with buyers, or waiting for someone to purchase each title.
            </p>
            <p>
              Scan or enter the barcode from the exact game in your hand. If we&apos;re currently buying that title, you&apos;ll see our cash offer instantly. Add qualifying games to your order, submit when the total reaches the minimum, and use the prepaid shipping label we provide.
            </p>
            <p>
              If you are deciding what older games may be worth, read our{" "}
              <Link href="/guides/sell-video-games-for-cash" className="text-blue-600 font-semibold hover:text-blue-800">
                complete guide to selling video games for cash
              </Link>
              . If you have a game in front of you, our{" "}
              <Link href="/guides/media-value-by-barcode" className="text-blue-600 font-semibold hover:text-blue-800">
                guide to checking media value by barcode
              </Link>{" "}
              explains why the exact UPC and release matter.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">From game shelf to payment</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">How to Sell Your Video Games</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Check your games, build one order, and ship qualifying titles together.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              ["1", "Scan the Barcode", "Scan or enter the UPC or retail barcode from the exact game. If it qualifies, you'll see the current cash offer instantly."],
              ["2", "Build Your Order", "Add accepted games to your order. You can also combine qualifying books, CDs, DVDs, Blu-rays, and 4K movies until you reach the minimum."],
              ["3", "Ship Free & Get Paid", "Submit your order, use the prepaid shipping label, and choose PayPal, Venmo, or check by mail. Payment is processed after the shipment arrives and accepted items pass inspection."],
            ].map(([number, title, body]) => (
              <div key={number} className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-2xl font-bold text-white">{number}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Used, older, and retro games</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">What Video Games Can I Sell?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We buy eligible physical games based on the exact title, platform, edition, demand, condition, and current buying criteria. A readable barcode is required to check the game.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {gamePlatforms.map((platform) => (
              <div key={platform.name} className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200">
                <div className="text-4xl mb-3">{platform.icon}</div>
                <div className="font-semibold text-gray-800 text-lg">{platform.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Have PS1, PS2, GameCube, Xbox, or Nintendo games?</strong>{" "}
              The fastest way to know whether a specific game qualifies is to scan its barcode. Older games can vary dramatically in demand, so do not assume a common-looking title has no value—or that every retro title is valuable.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/condition-guidelines" className="font-semibold text-blue-600 hover:text-blue-800">
              Review our video game condition guidelines →
            </Link>
          </div>
        </div>
      </section>

      {/* OFFER FACTORS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Why one game can be worth more than another</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">What Determines Your Video Game&apos;s Cash Offer?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              A game&apos;s value is not based on age alone. The exact release, platform, demand, condition, and completeness all matter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerFactors.map((factor, index) => (
              <div key={factor.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">{index + 1}</div>
                <h3 className="font-bold text-gray-900 text-lg">{factor.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{factor.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-gray-600">
            Want the bigger picture? Read our{" "}
            <Link href="/guides/sell-video-games-for-cash" className="font-semibold text-blue-600 hover:text-blue-800">
              video game value and selling guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* RETRO GAMES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Retro game value</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Are Old Video Games Worth Money?</h2>
              <div className="mt-6 space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  Some older video games can still have strong resale demand. PS1, PS2, GameCube, older Xbox, Nintendo, and other retro titles can vary widely in value depending on the exact game, edition, availability, condition, and current buyer demand.
                </p>
                <p>
                  Popular games are not always the most valuable. Harder-to-find releases, niche titles, collector editions, discontinued games, and complete copies can be more interesting than ordinary mass-market releases.
                </p>
                <p>
                  The safest shortcut is simple: identify the exact game rather than guessing from the cover. A barcode can help separate the exact release you own from a different platform or edition.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-7 sm:p-9 text-white shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Worth checking first</p>
              <div className="mt-6 space-y-5">
                {[
                  ["Older console releases", "PS1, PS2, GameCube, older Xbox, and other retro titles can have very different demand from common modern games."],
                  ["Complete copies", "Original cases, artwork, manuals, inserts, or collector packaging can matter to buyers."],
                  ["Unusual or niche titles", "Discontinued, specialty, imported, limited, or harder-to-find releases may deserve extra attention."],
                  ["Collector editions", "Special packaging, bundled content, or limited editions can have a different market from the standard release."],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM DIFFERENCE */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-10 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Exact platform matters</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">The Same Game Title Can Have Different Values</h2>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              A game released on PlayStation, Xbox, Nintendo, GameCube, or another system is not automatically the same product. Platform, region, edition, packaging, and included components can change the exact item buyers are looking for.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                "Platform-specific releases",
                "Standard vs. collector editions",
                "Original release vs. later reissue",
                "Complete copy vs. missing components",
                "Physical disc or cartridge packaging",
                "Regional or special releases",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-gray-700 rounded-xl bg-slate-50 p-4 border border-gray-100">
                  <span className="mt-0.5 text-emerald-600"><CheckIcon /></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-7 text-gray-600 leading-relaxed">
              Our{" "}
              <Link href="/guides/media-value-by-barcode" className="font-semibold text-blue-600 hover:text-blue-800">
                media value by barcode guide
              </Link>{" "}
              explains why identifying the exact physical release matters before comparing value.
            </p>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-14 items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Clearing a shelf or game room?</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Selling a Video Game Collection?</h2>
              <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                A large collection does not have to become dozens of individual marketplace listings. Scan the exact games, keep the qualifying titles together, and submit them as one order once the minimum is reached.
              </p>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                If your collection includes unusually rare, sealed, limited, or collector-focused games, you may still want to compare collector-market sales before deciding how to sell those specific pieces. For ordinary used games, a direct barcode-based buyback can save a lot of listing time.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-7 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900">A practical way to sort a large collection</h3>
              <div className="mt-6 space-y-4">
                {[
                  "Pull out unusual collector editions, sealed games, and harder-to-find releases for a closer look",
                  "Scan ordinary games by barcode instead of researching every title manually",
                  "Separate badly damaged or incomplete items before packing",
                  "Keep accepted games together until your order reaches the $7.50 minimum",
                  "Combine accepted games with books, CDs, DVDs, Blu-rays, and 4K movies if you want",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-gray-700">
                    <span className="mt-0.5 text-emerald-600"><CheckIcon /></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Choose the selling method that fits your time</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Sell Video Games Directly vs. Listing Them on a Marketplace</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Individual marketplaces can make sense for rare or highly collectible games. A direct buyback is designed for sellers who prefer a simpler way to process ordinary used games.
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
              ["Creating a listing", "No individual product listing to create", "Photos and listing details may be needed"],
              ["Buyer communication", "No buyer messages", "Questions, offers, or negotiations may be part of the sale"],
              ["Shipping", "One prepaid label for an eligible submitted order", "Shipping is usually handled sale by sale"],
              ["Seller fees", "No seller fees charged by SellBookMedia", "Marketplace fees may apply"],
              ["Large collection", "Qualifying games can be combined in one order", "Each item may need its own listing"],
            ].map(([label, direct, marketplace]) => (
              <div key={label} className="grid grid-cols-3 border-t border-gray-200 text-sm sm:text-base">
                <div className="p-4 sm:p-5 font-semibold text-gray-900 bg-slate-50">{label}</div>
                <div className="p-4 sm:p-5 border-l border-gray-200 text-gray-700">{direct}</div>
                <div className="p-4 sm:p-5 border-l border-gray-200 text-gray-600">{marketplace}</div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-gray-500 text-center">
            Want a broader comparison? Read our{" "}
            <Link href="/guides/best-places-to-sell-cds-dvds-games" className="font-semibold text-blue-600 hover:text-blue-800">
              guide to the best places to sell CDs, DVDs, and games
            </Link>
            .
          </p>
        </div>
      </section>

      {/* WHY SELLBOOKMEDIA */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Built for straightforward media buyback</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Why Sell Video Games to SellBookMedia?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Instant barcode quotes", "Check the exact physical game and see whether it qualifies before you ship anything."],
              ["Free prepaid shipping", "Eligible submitted orders receive a prepaid shipping label, so you do not pay shipping out of pocket."],
              ["Flexible Payment Options", "Choose PayPal, Venmo, or check by mail during checkout."],
              ["No seller fees", "SellBookMedia does not charge a seller fee on your accepted buyback order."],
              ["No marketplace listing", "Skip photos, listing descriptions, buyer messages, and waiting for individual sales."],
              ["Mix different media", "Combine accepted games with books, CDs, DVDs, Blu-rays, and 4K movies in the same order."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-slate-50 p-6">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MIXED MEDIA */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">One box can include more than games</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold">Sell Different Types of Media in the Same Order</h2>
              <p className="mt-5 text-lg text-slate-300 leading-relaxed">
                Clearing out more than a game shelf? Accepted video games can be combined with qualifying books, CDs, DVDs, Blu-rays, and 4K movies in the same SellBookMedia order.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/sell-books-for-cash" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                <div className="text-2xl">📚</div>
                <div className="mt-3 font-bold">Sell Books</div>
              </Link>
              <Link href="/sell-cds-for-cash" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                <div className="text-2xl">💿</div>
                <div className="mt-3 font-bold">Sell CDs</div>
              </Link>
              <Link href="/sell-dvds-for-cash" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                <div className="text-2xl">📀</div>
                <div className="mt-3 font-bold">Sell DVDs & Blu-rays</div>
              </Link>
              <Link href="/sell-video-games-for-cash" className="rounded-2xl border border-blue-400/40 bg-blue-500/10 p-5">
                <div className="text-2xl">🎮</div>
                <div className="mt-3 font-bold">Sell Video Games</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MediaCategoryLinks current="games" />

      {/* HELPFUL RESOURCES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Helpful game-selling resources</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Learn More Before You Sell</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              These guides answer different questions about value, barcodes, selling options, and choosing the right place for your physical media.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpfulGuides.map((guide) => (
              <Link key={guide.href} href={guide.href} className="group rounded-2xl border border-gray-200 bg-slate-50 p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                <div className="text-3xl">{guide.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">{guide.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{guide.body}</p>
                <span className="mt-4 inline-flex font-semibold text-blue-600">Read guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / SUPPORT LINKS */}
      <section className="py-14 bg-slate-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Before you ship</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Know Who You&apos;re Selling To and How the Process Works</h2>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Review our company information, seller instructions, condition rules, shipping questions, and return policy before submitting your order.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/about" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-700">About SellBookMedia</Link>
            <Link href="/seller-guide" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-700">Seller Guide</Link>
            <Link href="/condition-guidelines" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-700">Condition Guidelines</Link>
            <Link href="/help" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-700">Help Center</Link>
            <Link href="/returns-policy" className="rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:border-blue-400 hover:text-blue-700">Returns Policy</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Common questions</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">Frequently Asked Questions About Selling Video Games</h2>
          </div>

          <div className="space-y-4">
            {gameFaqs.map((faq) => (
              <details key={faq.q} className="group bg-slate-50 rounded-2xl border border-gray-200 shadow-sm p-6">
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
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Have a game within reach?</p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold">See What Your Video Game Is Worth</h2>
          <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Scan the barcode, see whether the exact game qualifies, and review our cash offer before you decide to sell.
          </p>

          <LandingCtaLink
            href="/#quote"
            eventName="games_landing_cta_clicked"
            ctaLocation="footer"
            className="inline-flex mt-8 items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Check My Game&apos;s Value
            <ArrowRight />
          </LandingCtaLink>

          <div className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-blue-100">
            <span>Instant barcode offer</span>
            <span aria-hidden="true">•</span>
            <span>Free prepaid shipping</span>
            <span aria-hidden="true">•</span>
            <span>PayPal, Venmo or Check</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 block">
                SellBookMedia
              </Link>
              <p className="text-gray-400 leading-relaxed">
                We buy eligible used books, CDs, DVDs, Blu-rays, 4K movies, and video games for cash.
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
              <h4 className="font-bold text-lg mb-6 text-white">Guides</h4>
              <ul className="space-y-3">
                <li><Link href="/guides/sell-video-games-for-cash" className="text-gray-400 hover:text-white transition-colors">Video Game Selling Guide</Link></li>
                <li><Link href="/guides/media-value-by-barcode" className="text-gray-400 hover:text-white transition-colors">Media Value by Barcode</Link></li>
                <li><Link href="/guides/best-places-to-sell-cds-dvds-games" className="text-gray-400 hover:text-white transition-colors">Best Places to Sell</Link></li>
                <li><Link href="/guides/decluttr-shut-down-alternative" className="text-gray-400 hover:text-white transition-colors">Decluttr Alternative</Link></li>
                <li><Link href="/guides/how-much-are-used-cds-worth" className="text-gray-400 hover:text-white transition-colors">What Are CDs Worth?</Link></li>
                <li><Link href="/guides/how-much-are-used-dvds-worth" className="text-gray-400 hover:text-white transition-colors">What Are DVDs Worth?</Link></li>
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2026 SellBookMedia. All rights reserved.</p>
              <p className="text-gray-500 text-sm">Turn your collection into money with confidence.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
