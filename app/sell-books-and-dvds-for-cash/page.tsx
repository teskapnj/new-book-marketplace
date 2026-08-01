// app/sell-books-and-dvds-for-cash/page.tsx
// SEO landing page targeting: "sell books and dvds for cash", "sell dvds and books",
// "where to sell books and dvds". Server component so we can export metadata + JSON-LD.

import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/sell-books-and-dvds-for-cash`;

export const metadata: Metadata = {
  title: "Sell Books and DVDs for Cash | Free Shipping",
  description:
    "Sell your used books, DVDs, CDs, and video games for cash. Scan a barcode for an instant quote, ship free, and get paid by PayPal. Start selling today.",
  keywords: [
    "sell books and dvds for cash",
    "sell dvds and books",
    "where to sell books and dvds",
    "sell used books for cash",
    "sell dvds for cash",
    "sell cds for cash",
    "sell media",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Sell Books and DVDs for Cash | SellBook Media",
    description:
      "Turn your used books, DVDs, CDs, and games into cash. Instant quotes, free shipping, and fast PayPal payment.",
    url: PAGE_URL,
    siteName: "SellBook Media",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Books and DVDs for Cash | SellBook Media",
    description:
      "Instant quotes, free shipping, fast PayPal payment. Sell your used books, DVDs, CDs, and games today.",
  },
};

// FAQ content — also powers the FAQPage structured data below.
const faqs = [
  {
    q: "What can I sell?",
    a: "We buy used books, CDs, DVDs, and video games. Just scan or type the barcode (ISBN or UPC) and you'll get an instant quote. VHS tapes, cassette tapes, and vinyl records are not currently accepted.",
  },
  {
    q: "Is shipping really free?",
    a: "Yes. Once your items are approved, we email you a prepaid shipping label within 24 hours. You never pay for shipping.",
  },
  {
    q: "How do I get paid?",
    a: "We pay by PayPal. After your items arrive at our facility and pass our condition check, your payment is sent directly to your PayPal account within 2 business days.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes, you need at least 5 items per shipment. This keeps shipping free and worthwhile for everyone.",
  },
  {
    q: "What condition do my items need to be in?",
    a: "Items should be in very good condition with only minor wear. No writing, highlighting, water damage, or deep scratches that affect playback or reading. You can review our full condition guidelines before you send anything.",
  },
  {
    q: "What happens to items that don't qualify?",
    a: "Items that don't meet our very good condition standard are recycled and not returned, so please check your items against our condition guide before shipping.",
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

function PayPalIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
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

function ArrowRight() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-3">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function SellBooksAndDvdsForCash() {
  // Structured data: Service + FAQPage (rich snippet eligibility)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Sell Books and DVDs for Cash",
        serviceType: "Used media buyback",
        provider: {
          "@type": "Organization",
          name: "SellBook Media",
          url: SITE_URL,
        },
        areaServed: "US",
        description:
          "Sell used books, CDs, DVDs, and video games for cash with instant quotes, free shipping, and PayPal payment.",
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
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header (static, no auth) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SellBookMedia
            </Link>
            <Link
              href="/create-listing"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-10 text-6xl opacity-20">📚</div>
        <div className="absolute top-32 right-16 text-5xl opacity-20">📀</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-20">💿</div>
        <div className="absolute bottom-32 right-1/3 text-5xl opacity-20">🎮</div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Sell Books and DVDs for Cash
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
              Turn your used books, DVDs, CDs, and video games into cash. Scan a barcode
              for an instant quote, ship for free, and get paid by PayPal.
            </p>

            <div className="grid grid-cols-3 gap-6 sm:gap-8 mt-14 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">$0</div>
                <div className="text-blue-200 text-sm sm:text-base">Shipping Cost</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24h</div>
                <div className="text-blue-200 text-sm sm:text-base">Label by Email</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">PayPal</div>
                <div className="text-blue-200 text-sm sm:text-base">Fast Payment</div>
              </div>
            </div>

            <div className="mt-12">
              <Link
                href="/create-listing"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
              >
                Get Your Instant Quote
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-blue-600"><FreeShipIcon /></span>
              <span className="font-medium">Free prepaid shipping</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-blue-600"><QuoteIcon /></span>
              <span className="font-medium">Instant barcode quotes</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-blue-600"><PayPalIcon /></span>
              <span className="font-medium">Fast PayPal payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro copy (keyword-rich, natural) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
            The easy way to sell books and DVDs
          </h2>
          <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-4">
            <p>
              Looking for where to sell books and DVDs for cash? SellBook Media buys used
              books, CDs, DVDs, and video games directly from you. There's no auction to
              set up, no buyers to message, and no listing fees — just scan your items,
              accept your quote, and ship them to us for free.
            </p>
            <p>
              Whether you're clearing a shelf, downsizing a collection, or turning old
              media into extra money, we make it simple to sell dvds and books in one
              shipment and get paid quickly by PayPal.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sell your books and DVDs for cash in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-8">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scan Your Items</h3>
              <p className="text-gray-600 leading-relaxed">
                Scan or type the barcode from your books, CDs, DVDs, or games. Amazon ASIN
                codes work too. You'll see your quote instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-8">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ship for Free</h3>
              <p className="text-gray-600 leading-relaxed">
                Within 24 hours, we email your prepaid shipping label. Pack your items
                securely, attach the label, and drop the box off.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-8">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Paid Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Once your items arrive and pass our condition check, we send your payment
                straight to your PayPal within 2 business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we buy */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What We Buy</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We accept four categories of used media in very good condition
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Books", icon: "📚" },
              { name: "CDs", icon: "💿" },
              { name: "DVDs", icon: "📀" },
              { name: "Games", icon: "🎮" },
            ].map((c) => (
              <div key={c.name} className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200">
                <div className="text-4xl mb-3">{c.icon}</div>
                <div className="font-semibold text-gray-800 text-lg">{c.name}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/condition-guidelines" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
              Review our condition guidelines before you send →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ (visible + schema-backed) */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about selling books and DVDs for cash
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
                  {f.q}
                  <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to sell your books and DVDs?
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get an instant quote in seconds. Free shipping, no fees, fast PayPal payment.
          </p>
          <Link
            href="/create-listing"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Start Selling Now
            <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 block">
                SellBookMedia
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6">
                We buy used books, CDs, DVDs, and games for cash. Turn your collection into
                money with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">For Sellers</h4>
              <ul className="space-y-3">
                <li><Link href="/condition-guidelines" className="text-gray-400 hover:text-white transition-colors">Condition Guidelines</Link></li>
                <li><Link href="/returns-policy" className="text-gray-400 hover:text-white transition-colors">Returns Policy</Link></li>
                <li><Link href="/seller-guide" className="text-gray-400 hover:text-white transition-colors">Seller Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Guides</h4>
              <ul className="space-y-3">
                <li><Link href="/guides/how-much-are-used-books-worth" className="text-gray-400 hover:text-white transition-colors">What Are Books Worth?</Link></li>
                <li><Link href="/guides/how-much-are-used-dvds-worth" className="text-gray-400 hover:text-white transition-colors">What Are DVDs Worth?</Link></li>
                <li><Link href="/guides/sell-video-games-for-cash" className="text-gray-400 hover:text-white transition-colors">Sell Video Games</Link></li>
                <li><Link href="/guides/best-places-to-sell-cds-dvds-games" className="text-gray-400 hover:text-white transition-colors">Best Places to Sell</Link></li>
                <li><Link href="/guides/where-to-sell-books-and-dvds-for-cash" className="text-gray-400 hover:text-white transition-colors">Where to Sell for Cash</Link></li>
                <li><Link href="/guides/decluttr-shut-down-alternative" className="text-gray-400 hover:text-white transition-colors">Decluttr Alternative</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
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