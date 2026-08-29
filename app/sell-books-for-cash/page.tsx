import Link from "next/link";
import type { Metadata } from "next";
import MediaCategoryLinks from "../../components/MediaCategoryLinks";
import LandingCtaLink from "../../components/LandingCtaLink";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/sell-books-for-cash`;

export const metadata: Metadata = {
  title: "Sell Books for Cash Online | Free Shipping | SellBookMedia",
  description:
    "Sell used books for cash with SellBookMedia. Scan or enter the ISBN for an instant quote, ship for free, and get paid by PayPal.",

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    title: "Sell Books for Cash Online | SellBookMedia",
    description:
      "Turn your used books into cash. Scan the ISBN for an instant quote, ship for free, and get paid by PayPal.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sell Books for Cash Online | SellBookMedia",
    description:
      "Scan your book ISBN, get an instant quote, ship for free, and get paid by PayPal.",
  },
};

const faqs = [
  {
    q: "What books can I sell?",
    a: "We buy eligible used books with a valid ISBN. Scan or enter the ISBN to see whether we are currently buying the book and what we will pay.",
  },
  {
    q: "How do I find out how much my book is worth?",
    a: "Scan or enter the ISBN printed near the barcode on the back of the book. If we are currently buying the title, you will see our cash offer instantly.",
  },
  {
    q: "Is shipping really free?",
    a: "Yes. We provide a prepaid shipping label, so you do not pay shipping out of pocket.",
  },
  {
    q: "How do I get paid?",
    a: "We pay by PayPal. After your shipment arrives and your books pass our condition inspection, payment is processed to your PayPal account.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes. Your order must reach a minimum cash offer of $7.50. Eligible books can also be combined with accepted CDs, DVDs, Blu-rays, 4K movies, and video games in the same order.",
  },
  {
    q: "What condition do my books need to be in?",
    a: "Books should be in very good condition with only minor wear. They should not have excessive writing, highlighting, missing pages, strong odors, or water damage. Please review our condition guidelines before shipping.",
  },
  {
    q: "Do you buy every book?",
    a: "No. Offers depend on current demand, resale value, edition, and condition. If a book does not meet our current buying criteria, it will show as not accepted.",
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

function PayPalIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
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

export default function SellBooksForCashPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Sell Books for Cash",
        serviceType: "Used book buyback",
        provider: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
        areaServed: "US",
        description:
          "Sell used books for cash with instant ISBN quotes, free shipping, and PayPal payment.",
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
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER */}
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
  eventName="books_landing_cta_clicked"
  ctaLocation="header"
  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
>
  Start Selling
</LandingCtaLink>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute top-20 left-10 text-6xl opacity-20">
          📚
        </div>
        <div className="absolute top-32 right-16 text-5xl opacity-20">
          📖
        </div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-20">
          📕
        </div>
        <div className="absolute bottom-32 right-1/3 text-5xl opacity-20">
          📘
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm sm:text-base font-semibold text-blue-100 mb-4">
              SELL USED BOOKS ONLINE
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Sell Books for Cash
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
              Scan or enter the ISBN and see our cash offer instantly.
              Shipping is free, and payment is
              sent via PayPal.
            </p>

            <div className="grid grid-cols-3 gap-6 sm:gap-8 mt-14 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  FREE
                </div>
                <div className="text-blue-200 text-sm sm:text-base">
                  Prepaid Shipping
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  INSTANT
                </div>
                <div className="text-blue-200 text-sm sm:text-base">
                  Cash Offers
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  PayPal
                </div>
                <div className="text-blue-200 text-sm sm:text-base">
                  Fast Payment
                </div>
              </div>
            </div>

            <div className="mt-12">
            <LandingCtaLink
  href="/#quote"
  eventName="books_landing_cta_clicked"
  ctaLocation="hero"
  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
>
  Check My Book&apos;s Value
  <ArrowRight />
</LandingCtaLink>
            </div>

            <p className="mt-4 text-sm text-blue-100">
            Minimum order value: $7.50
            </p>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-blue-600">
                <FreeShipIcon />
              </span>
              <span className="font-medium">Free prepaid shipping</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-blue-600">
                <QuoteIcon />
              </span>
              <span className="font-medium">Instant ISBN quotes</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-gray-700">
              <span className="text-blue-600">
                <PayPalIcon />
              </span>
              <span className="font-medium">PayPal payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
            An Easy Way to Sell Used Books Online
          </h2>

          <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-4">
            <p>
              Looking for where to sell used books for cash? SellBookMedia
              buys eligible books directly from you. There&apos;s no
              marketplace listing to create, no buyers to message, and no
              waiting for someone to purchase your book.
            </p>

            <p>
              Simply scan or enter the ISBN, see whether we&apos;re currently
              buying the book, and view our cash offer instantly. Add your
              accepted items to an order and ship them to us using a prepaid
              shipping label.
            </p>

            <p>
              Whether you&apos;re clearing a bookshelf, downsizing a
              collection, selling textbooks, or simply making room at home,
              SellBookMedia gives you a simple way to turn eligible books into
              cash.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How to Sell Your Books
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sell your used books for cash in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-8">
                <span className="text-3xl font-bold text-white">1</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Scan the ISBN
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Scan or enter the ISBN from your book. If we&apos;re currently
                buying it, you&apos;ll see your cash offer instantly.
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
                Submit your order and use the prepaid shipping
                label we send you to ship your books.
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
                After your shipment arrives and your books pass inspection,
                your payment is processed through PayPal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK TYPES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Books Can I Sell?
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We buy eligible books with valid ISBNs based on current demand
              and resale value.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: "Hardcover Books", icon: "📕" },
              { name: "Paperback Books", icon: "📗" },
              { name: "Textbooks", icon: "📘" },
              { name: "Book Sets", icon: "📚" },
            ].map((book) => (
              <div
                key={book.name}
                className="bg-slate-50 p-6 rounded-2xl text-center border border-gray-200"
              >
                <div className="text-4xl mb-3">{book.icon}</div>
                <div className="font-semibold text-gray-800 text-lg">
                  {book.name}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              Before You Ship
            </h3>

            <p className="text-gray-600 leading-relaxed">
              Your books should match our condition requirements. Books with
              significant water damage, missing pages, excessive writing or
              highlighting, strong odors, or other major damage may not qualify.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/condition-guidelines"
              className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Review our condition guidelines →
            </Link>
          </div>
        </div>
      </section>

      {/* WHY SELLBOOKMEDIA */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why Sell Books to SellBookMedia?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900">
                No Marketplace Listings
              </h3>
              <p className="mt-2 text-gray-600">
                No photos, descriptions, buyer messages, auctions, or waiting
                for someone to purchase your book.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Instant ISBN Quotes
              </h3>
              <p className="mt-2 text-gray-600">
                Scan the ISBN and immediately find out whether we&apos;re
                buying your book and what we&apos;ll pay.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Free Shipping
              </h3>
              <p className="mt-2 text-gray-600">
                We provide a prepaid shipping label, so you don&apos;t pay shipping out of pocket.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900">
                Mix Eligible Media
              </h3>
              <p className="mt-2 text-gray-600">
                Accepted books can be combined with eligible CDs, DVDs,
                Blu-rays, 4K movies, and video games in the same order.
              </p>
            </div>
          </div>
        </div>
      </section>
      <MediaCategoryLinks current="books" />

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>

            <p className="text-xl text-gray-600">
              Everything you need to know about selling used books for cash
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group bg-slate-50 rounded-2xl border border-gray-200 shadow-sm p-6"
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

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            See What Your Books Are Worth
          </h2>

          <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Grab a book, scan the ISBN, and see our cash offer.
          </p>

          <LandingCtaLink
  href="/#quote"
  eventName="books_landing_cta_clicked"
  ctaLocation="footer"
  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
>
  Get My Book Quote
  <ArrowRight />
</LandingCtaLink>
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
                We buy used books, CDs, DVDs, Blu-rays, 4K movies, and games
                for cash.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">
                For Sellers
              </h4>

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
                    href="/condition-guidelines"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Condition Guidelines
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
                    href="/guides/how-much-are-used-books-worth"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    What Are Books Worth?
                  </Link>
                </li>

                <li>
                  <Link
                    href="/guides/how-much-are-used-dvds-worth"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    What Are DVDs Worth?
                  </Link>
                </li>

                <li>
                  <Link
                    href="/guides/how-much-are-used-cds-worth"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    What Are CDs Worth?
                  </Link>
                </li>

                <li>
                  <Link
                    href="/guides/sell-video-games-for-cash"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Sell Video Games
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