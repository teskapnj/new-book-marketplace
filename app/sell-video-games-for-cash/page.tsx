import Link from "next/link";
import type { Metadata } from "next";
import MediaCategoryLinks from "../../components/MediaCategoryLinks";
import LandingCtaLink from "../../components/LandingCtaLink";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/sell-video-games-for-cash`;

export const metadata: Metadata = {
  title: "Sell Video Games for Cash Online | SellBookMedia",
  description:
    "Sell used video games for cash with SellBookMedia. Get competitive cash offers for eligible games, scan the UPC for an instant quote, ship for free, and get paid by PayPal.",

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    title: "Sell Video Games for Cash Online | SellBookMedia",
    description:
      "Turn your used video games into cash. Scan the barcode for an instant quote, ship for free, and get paid by PayPal.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sell Video Games for Cash Online | SellBookMedia",
    description:
      "Scan your game barcode, get an instant quote, ship for free, and get paid by PayPal.",
  },
};

const faqs = [
  {
    q: "What video games can I sell?",
    a: "We buy eligible video games with a readable UPC or barcode. Scan or enter the barcode to see whether we are currently buying the game and what we will pay.",
  },
  {
    q: "Do you buy PS1 and PS2 games?",
    a: "Yes. We buy eligible PS1 and PS2 games, along with other PlayStation, Xbox, Nintendo, GameCube, and retro game titles. Scan or enter the barcode to see whether we are currently buying the game and what we will pay.",
  },
  {
    q: "How do I find out how much my game is worth?",
    a: "Scan or enter the barcode on the game case. If we are currently buying the title, you will see our cash offer instantly.",
  },
  {
    q: "Is shipping free?",
    a: "Yes. We provide a prepaid shipping label, so you do not pay shipping out of pocket.",
  },
  {
    q: "How do I get paid?",
    a: "We pay by PayPal. After your shipment arrives and your games pass inspection, payment is processed to your PayPal account.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes. Your order must reach a minimum cash offer of $7.50. Eligible games can be combined with accepted books, CDs, DVDs, Blu-rays, and 4K movies in the same order.",  },
  {
    q: "Do you buy every video game?",
    a: "No. Offers depend on current demand, resale value, platform, edition, and condition. If a title does not meet our current buying criteria, it will show as not accepted.",
  },
];

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
          "Sell used video games for cash with instant barcode quotes, free shipping, and PayPal payment.",
        url: PAGE_URL,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
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

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              SellBookMedia
            </Link>

            <LandingCtaLink
  href="/#quote"
  eventName="games_landing_cta_clicked"
  ctaLocation="header"
  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
>
  Start Selling
</LandingCtaLink>
          </div>
        </div>
      </header>

      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute top-20 left-10 text-6xl opacity-20">🎮</div>
        <div className="absolute top-32 right-16 text-5xl opacity-20">🕹️</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-20">🎮</div>
        <div className="absolute bottom-32 right-1/3 text-5xl opacity-20">💿</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm sm:text-base font-semibold text-blue-100 mb-4">
              SELL USED VIDEO GAMES ONLINE
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Sell Video Games for Cash
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
            Get competitive cash offers for eligible video games. Scan the barcode
            to see your offer instantly, ship for free, and get paid via PayPal.
            </p>

            <div className="mt-12">
            <LandingCtaLink
  href="/#quote"
  eventName="games_landing_cta_clicked"
  ctaLocation="hero"
  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
>
  Check My Game&apos;s Value
  <ArrowRight />
</LandingCtaLink>
            </div>

            <p className="mt-4 text-sm text-blue-100">
            Minimum order value: $7.50
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
            An Easy Way to Sell Used Video Games Online
          </h2>

          <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-4">
            <p>
              Have video games you no longer play? SellBookMedia lets you check
              their value without creating listings, taking photos, messaging
              buyers, or waiting for someone to purchase them.
            </p>

            <p>
              Simply scan or enter the barcode on the game case. If we&apos;re
              currently buying the title, you&apos;ll see our cash offer
              instantly.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How to Sell Your Video Games
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sell your used games for cash in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-8">
                <span className="text-3xl font-bold text-white">1</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Scan the Barcode
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Scan or enter the UPC from your game case. If we&apos;re
                currently buying it, you&apos;ll see your cash offer instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-8">
                <span className="text-3xl font-bold text-white">2</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ship for Free
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Submit your order and use your prepaid shipping
                label to send your games.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-8">
                <span className="text-3xl font-bold text-white">3</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Paid
              </h3>

              <p className="text-gray-600 leading-relaxed">
                After your games arrive and pass inspection, payment is
                processed through PayPal.
              </p>
            </div>
          </div>
        </div>
      </section>
   

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Video Games Can I Sell?
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
  We buy eligible physical video games based on current demand,
  platform, edition, and resale value, including many PS1, PS2,
  GameCube, Xbox, and other retro game titles.
</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "PS1 & PS2 Games", icon: "🎮" },
              { name: "Xbox Games", icon: "🎮" },
              { name: "GameCube & Nintendo Games", icon: "🕹️" },
              { name: "Retro Game Collections", icon: "📦" },
            ].map((game) => (
              <div
                key={game.name}
                className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200"
              >
                <div className="text-4xl mb-3">{game.icon}</div>
                <div className="font-semibold text-gray-800 text-lg">
                  {game.name}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Not every game will receive an offer. Pricing and acceptance depend
            on current market demand.
          </p>

          <div className="text-center mt-6">
            <Link
              href="/condition-guidelines"
              className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Review our condition guidelines →
            </Link>
          </div>
        </div>
      </section>
      <MediaCategoryLinks current="games" />


      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>

            <p className="text-xl text-gray-600">
              Everything you need to know about selling used video games
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
                  {f.q}

                  <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            See What Your Video Games Are Worth
          </h2>

          <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Grab a game, scan the barcode, and see our cash offer.
          </p>

          <LandingCtaLink
  href="/#quote"
  eventName="games_landing_cta_clicked"
  ctaLocation="footer"
  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
>
  Get My Game Quote
  <ArrowRight />
</LandingCtaLink>
        </div>
      </section>
    </div>
  );
}