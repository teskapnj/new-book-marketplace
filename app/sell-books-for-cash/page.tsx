import Link from "next/link";
import type { Metadata } from "next";
import MediaCategoryLinks from "../../components/MediaCategoryLinks";
import LandingCtaLink from "../../components/LandingCtaLink";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/sell-books-for-cash`;

export const metadata: Metadata = {
  title: "Sell Books for Cash Online | Free Shipping | SellBookMedia",
  description:
   "Sell used books and textbooks for cash with SellBookMedia. Scan the ISBN for an instant quote, get free prepaid shipping, and choose PayPal, Venmo, or check by mail for payment.",

  alternates: {
    canonical: PAGE_URL,
  },

  openGraph: {
    title: "Sell Books for Cash Online | SellBookMedia",
    description:
      "Scan your book ISBN for an instant cash offer, ship accepted books with a prepaid label, and choose PayPal, Venmo, or check by mail for payment.",
    url: PAGE_URL,
    siteName: "SellBookMedia",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sell Books for Cash Online | SellBookMedia",
    description:
     "Scan your book ISBN, see your offer instantly, ship for free, and choose PayPal, Venmo, or check by mail for payment.",
  },
};

const faqs = [
  {
    q: "What books can I sell?",
    a: "We buy eligible used books with a valid ISBN, including many hardcovers, paperbacks, textbooks, and book sets. Scan or enter the ISBN to see whether we are currently buying that exact edition and what we will pay.",
  },
  {
    q: "How do I find out how much my book is worth?",
    a: "Scan or enter the ISBN printed near the barcode on the back of the book. The ISBN identifies the exact edition, while current demand, resale value, and condition help determine what that copy may be worth.",
  },
  {
    q: "Is shipping really free?",
    a: "Yes. For an eligible submitted order, we provide a prepaid shipping label so you do not pay shipping out of pocket.",
  },
  {
    q: "How do I get paid?",
    a: "You can choose PayPal, Venmo, or check by mail. After your shipment arrives and your books pass our condition inspection, payment is processed using the method you selected at checkout.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes. Your order must reach a minimum cash offer of $7.50. Eligible books can also be combined with accepted CDs, DVDs, Blu-rays, 4K movies, and video games in the same order.",
  },
  {
    q: "What condition do my books need to be in?",
    a: "Books should be in very good condition with only minor wear. They should not have excessive writing, highlighting, missing pages, strong odors, mold, or water damage. Review our condition guidelines before shipping.",
  },
  {
    q: "Do you buy every book?",
    a: "No. Offers depend on the exact edition, current demand, resale value, and our current buying criteria. If a book does not qualify at the moment, the quote tool will show it as not accepted.",
  },
  {
    q: "Where can I sell used books for cash online?",
    a: "You can sell eligible used books directly to SellBookMedia. Scan or enter the ISBN, see our current cash offer before you ship, add accepted items to your order, and use the prepaid shipping label we provide.",
  },
  {
    q: "Can I sell textbooks for cash?",
    a: "Yes, many textbooks are worth checking. The exact edition matters, so scan the ISBN on the specific copy you have rather than searching only by title or author.",
  },
];

const offerFactors = [
  {
    title: "Exact edition",
    body: "Hardcover, paperback, textbook, revised, international, and other editions can have different ISBNs and different resale values.",
  },
  {
    title: "Current demand",
    body: "Demand changes over time. A title buyers are actively looking for can qualify differently from a book with little current demand.",
  },
  {
    title: "Resale value",
    body: "Current market value helps determine whether we can make an offer and how strong that offer can be.",
  },
  {
    title: "Condition",
    body: "Writing, highlighting, water damage, missing pages, odors, mold, or binding damage can reduce eligibility even when the ISBN itself qualifies.",
  },
  {
    title: "Current buying criteria",
    body: "We do not buy every title at all times. Our quote tool checks whether the exact book currently meets our purchasing criteria.",
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
         "Sell used books for cash with instant ISBN quotes, free prepaid shipping, and PayPal, Venmo, or check by mail payment.",
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
            name: "Sell Books for Cash",
            item: PAGE_URL,
          },
        ],
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
              eventName="books_landing_cta_clicked"
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

        <div className="hidden sm:block absolute top-20 left-10 text-6xl opacity-20">📚</div>
        <div className="hidden sm:block absolute top-32 right-16 text-5xl opacity-20">📖</div>
        <div className="hidden sm:block absolute bottom-20 left-1/4 text-4xl opacity-20">📕</div>
        <div className="hidden sm:block absolute bottom-32 right-1/3 text-5xl opacity-20">📘</div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs sm:text-base font-semibold tracking-[0.16em] text-blue-100 mb-2 sm:mb-4">
              SELL USED BOOKS ONLINE
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 leading-tight">
              Sell Books for Cash Online
            </h1>

            <p className="text-base sm:text-2xl text-blue-100 mb-5 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            Scan or enter your book&apos;s ISBN and see our cash offer instantly. Get free prepaid shipping and choose PayPal, Venmo, or check by mail for payment.
            </p>

            <LandingCtaLink
              href="/#quote"
              eventName="books_landing_cta_clicked"
              ctaLocation="hero"
              className="group inline-flex w-full max-w-xs sm:w-auto items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-base sm:text-xl rounded-2xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
            >
              Check My Book&apos;s Value
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
                  ISBN Cash Offers
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
              <span>See your offer before shipping</span>
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
              <span className="font-medium">Instant ISBN quotes</span>
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
              Direct book buyback
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              An Easy Way to Sell Used Books Online
            </h2>
          </div>

          <div className="mt-8 prose prose-lg text-gray-600 max-w-none leading-relaxed space-y-5">
            <p>
              Looking for where to sell used books for cash? SellBookMedia buys
              eligible books directly from you. There&apos;s no marketplace listing
              to create, no buyers to message, and no waiting for someone to
              purchase your book before you know what you can get.
            </p>

            <p>
              Scan or enter the ISBN on the exact copy in your hand. If we&apos;re
              currently buying that edition, you&apos;ll see our cash offer instantly.
              Add accepted items to your order, submit when your total reaches the
              minimum, and use the prepaid shipping label we send you.
            </p>

            <p>
              If you&apos;re trying to understand the market first, read our{" "}
              <Link
                href="/guides/how-much-are-used-books-worth"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                guide to how much used books are worth
              </Link>
              . If you have a specific book in front of you, our{" "}
              <Link
                href="/guides/how-to-find-book-value-by-isbn"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                guide to finding book value by ISBN
              </Link>{" "}
              explains why the exact edition matters.
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
              How to Sell Your Books for Cash
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Check the exact edition, build your order, and ship it with a prepaid label.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Scan the ISBN</h3>
              <p className="text-gray-600 leading-relaxed">
                Scan or enter the ISBN from your book. If we&apos;re currently buying
                that exact edition, you&apos;ll see your cash offer instantly.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ship for Free</h3>
              <p className="text-gray-600 leading-relaxed">
                Submit your eligible order and use the prepaid shipping label we
                send you. Pack the books securely and send the box to us.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Paid</h3>
              <p className="text-gray-600 leading-relaxed">
              After your shipment arrives and the books pass inspection, payment
              is sent by PayPal, Venmo, or check by mail based on the method you selected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK TYPES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Books worth checking
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              What Books Can I Sell?
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We buy eligible used books, textbooks, hardcovers, paperbacks, and
              book sets with valid ISBNs based on current demand and resale value.
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
                <div className="font-semibold text-gray-800 text-lg">{book.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-3">Generally good to send</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1"><CheckIcon /></span><span>Clean, readable pages</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1"><CheckIcon /></span><span>Intact binding and cover</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1"><CheckIcon /></span><span>Normal shelf wear</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1"><CheckIcon /></span><span>All pages present</span></li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-3">Please check condition first</h3>
              <p className="text-gray-700 leading-relaxed">
                Significant water damage, mold, missing pages, excessive writing or
                highlighting, strong odors, and other major damage can make a book
                ineligible even when its ISBN is accepted.
              </p>
              <Link
                href="/condition-guidelines"
                className="inline-flex mt-4 text-blue-600 font-semibold hover:text-blue-800"
              >
                Review book condition guidelines →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER FACTORS */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Why book values differ
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              What Determines Your Book&apos;s Cash Offer?
            </h2>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              A title alone is not enough to price a used book accurately. The ISBN
              identifies the exact edition, and several current market factors help
              determine whether we can make an offer.
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
                  Want to identify the exact edition first?
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Learn where to find ISBN-10 and ISBN-13, why editions can have
                  different values, and how to check the specific copy you own.
                </p>
              </div>
              <Link
                href="/guides/how-to-find-book-value-by-isbn"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Find Book Value by ISBN →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              A simpler way to sell
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900">
              Sell Directly vs. Listing on a Marketplace
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              A marketplace can make sense when you want to manage your own listing.
              A direct buyback is built for sellers who prefer a faster, simpler process.
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
              ["Buyer communication", "No buyer messages", "Buyer questions or messages may be part of the sale"],
              ["Shipping", "Prepaid label for eligible submitted orders", "Shipping setup depends on the marketplace"],
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
              Why Sell Books to SellBookMedia?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">See Your Offer First</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Check the exact ISBN and see the current offer before deciding whether
                to add the book to your order.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">No Marketplace Listings</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                No photos, descriptions, buyer messages, auctions, or waiting for an
                individual buyer to purchase your book.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">Free Prepaid Shipping</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                We provide the shipping label for an eligible submitted order, so you
                do not pay shipping out of pocket.
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

      {/* COLLECTION / CROSS CATEGORY */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 sm:p-12 text-white shadow-xl">
            <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Clearing more than a bookshelf?
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
                  One Shipment Doesn&apos;t Have to Be Books Only
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-300">
                  Eligible books can be combined with accepted CDs, DVDs, Blu-rays,
                  4K movies, and video games in the same order. That can make it easier
                  to clear a mixed media collection without creating separate shipments.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/sell-cds-for-cash" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl">💿</div>
                  <div className="mt-3 font-bold">Sell CDs for Cash</div>
                </Link>
                <Link href="/sell-dvds-for-cash" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl">📀</div>
                  <div className="mt-3 font-bold">Sell DVDs &amp; Blu-rays</div>
                </Link>
                <Link href="/sell-video-games-for-cash" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl">🎮</div>
                  <div className="mt-3 font-bold">Sell Video Games</div>
                </Link>
                <Link href="/seller-guide" className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors">
                  <div className="text-3xl">📦</div>
                  <div className="mt-3 font-bold">Seller Guide</div>
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
              Book Selling &amp; Value Resources
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Learn how to identify the exact edition, understand used-book value,
              check condition, and prepare an order with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/guides/how-to-find-book-value-by-isbn"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">🔎</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                Find Book Value by ISBN
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Learn where to find the ISBN and why it identifies the exact edition.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Read guide →</span>
            </Link>

            <Link
              href="/guides/how-much-are-used-books-worth"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">💵</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                How Much Are Used Books Worth?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                See how demand, edition, supply, and condition can affect value.
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
                Check what condition we expect before you pack and ship your books.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Review guidelines →</span>
            </Link>

            <Link
              href="/seller-guide"
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl">📦</div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-blue-700">
                Seller Guide
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Review the selling, packing, shipping, and payment process in one place.
              </p>
              <span className="mt-4 inline-flex font-semibold text-blue-600">Open seller guide →</span>
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
                Learn what SellBookMedia buys and why we focus on giving physical media another useful life.
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

      <MediaCategoryLinks current="books" />

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
              What to know before selling used books for cash online
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
                  <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
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
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
            Have a book within reach?
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            See What Your Book Is Worth
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Scan the ISBN and see whether we&apos;re currently buying that exact edition.
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
              <h4 className="font-bold text-lg mb-6 text-white">Book Guides</h4>
              <ul className="space-y-3">
                <li><Link href="/guides/how-to-find-book-value-by-isbn" className="text-gray-400 hover:text-white transition-colors">Find Book Value by ISBN</Link></li>
                <li><Link href="/guides/how-much-are-used-books-worth" className="text-gray-400 hover:text-white transition-colors">How Much Are Used Books Worth?</Link></li>
                <li><Link href="/guides/how-much-are-used-dvds-worth" className="text-gray-400 hover:text-white transition-colors">What Are DVDs Worth?</Link></li>
                <li><Link href="/guides/how-much-are-used-cds-worth" className="text-gray-400 hover:text-white transition-colors">What Are CDs Worth?</Link></li>
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
