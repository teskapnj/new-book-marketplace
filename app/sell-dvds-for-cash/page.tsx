import type { Metadata } from "next";
import Link from "next/link";
import MediaCategoryLinks from "../../components/MediaCategoryLinks";
import LandingCtaLink from "../../components/LandingCtaLink";

export const metadata: Metadata = {
    title: "Sell DVDs, Blu-rays & 4K Movies for Cash Online",
    description:
    "Sell used DVDs, Blu-rays and 4K UHD movies for cash with SellBookMedia. Scan the UPC, get an instant offer, ship for free, and get paid via PayPal.",
    alternates: {
    canonical: "https://www.sellbookmedia.com/sell-dvds-for-cash",
  },
  openGraph: {
    title: "Sell DVDs, Blu-rays & 4K Movies for Cash Online | SellBookMedia",
    description:
      "Scan your DVD barcode, get an instant cash offer, ship for free, and get paid via PayPal.",
    url: "https://www.sellbookmedia.com/sell-dvds-for-cash",
    siteName: "SellBookMedia",
    type: "website",
  },
};
const dvdFaqs = [
  {
    q: "How do I find out how much my DVD is worth?",
    a: "Scan or enter the UPC barcode on the back of the DVD case. If we're buying that title, you'll see our cash offer immediately.",
  },
  {
    q: "Do I have to pay for shipping?",
    a: "No. Approved orders receive a prepaid shipping label.",
  },
  {
    q: "How many items do I need?",
    a: "You need at least 5 accepted items to submit an order. Eligible books, CDs, DVDs, Blu-rays, 4K movies, and games can be combined in the same order.",
  },
  {
    q: "How will I get paid?",
    a: "Payment is processed through PayPal after your shipment arrives and the items pass inspection.",
  },
];


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
          url: "https://www.sellbookmedia.com",
        },
        areaServed: "US",
        description:
          "Sell used DVDs, Blu-rays and 4K UHD movies for cash with instant UPC quotes, free shipping, and PayPal payment.",
        url: "https://www.sellbookmedia.com/sell-dvds-for-cash",
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
    <main className="min-h-screen bg-white">
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />

  {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-sm sm:text-base font-semibold text-blue-100 mb-3">
            SELL USED DVDs ONLINE
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Sell DVDs for Cash
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
          Scan the UPC on your DVD, Blu-ray, or 4K UHD movie and see our cash
offer instantly. Accepted offers start at $1.50, shipping is free,
and payment is sent via PayPal.
          </p>

          <div className="mt-8">
          <LandingCtaLink
  href="/#quote"
  eventName="dvds_landing_cta_clicked"
  ctaLocation="hero"
  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-lg font-bold shadow-lg transition-colors"
>
  Scan a Movie Barcode
</LandingCtaLink>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-100">
            <span>✓ Instant Cash Offers</span>
            <span>✓ Free Shipping</span>
            <span>✓ PayPal Payment</span>
            <span>✓ No Listing Fees</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            An Easy Way to Sell Used DVDs Online
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Have DVDs sitting on a shelf that you no longer watch?
            SellBookMedia lets you check their value without creating
            listings, taking photos, negotiating with buyers, or waiting for
            someone to purchase them.
          </p>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Simply scan or enter the UPC barcode from the back of the DVD
            case. If we&apos;re currently buying the title, you&apos;ll see
            our cash offer immediately.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How to Sell Your DVDs
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="text-3xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900">
                Scan the Barcode
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Scan the UPC on the back of your DVD case or enter the barcode
                manually.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="text-3xl font-bold text-green-600 mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900">
                See Your Cash Offer
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Accepted DVDs are added to your order automatically with the
                cash offer displayed.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="text-3xl font-bold text-purple-600 mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900">
                Ship Free &amp; Get Paid
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Once your order is approved, use your prepaid shipping label.
                After inspection, payment is sent via PayPal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            Why Sell DVDs to SellBookMedia?
          </h2>

          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900">
                No Marketplace Listings
              </h3>
              <p className="mt-2 text-gray-600">
                No photos, descriptions, buyer messages, auctions, or waiting
                for a sale.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900">
                Instant Quotes
              </h3>
              <p className="mt-2 text-gray-600">
                Scan the barcode and immediately find out whether we&apos;re
                buying your DVD and what we&apos;ll pay.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900">
                Free Shipping
              </h3>
              <p className="mt-2 text-gray-600">
                Approved orders receive a prepaid shipping label, so you
                don&apos;t pay shipping out of pocket.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900">
                Sell Different Media Together
              </h3>
              <p className="mt-2 text-gray-600">
                Your order can include eligible DVDs, CDs, books, and video
                games together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TYPES */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          What DVDs, Blu-rays & 4K Movies Can I Sell?
          </h2>

          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            We buy eligible DVD titles based on current demand, resale value,
            and condition. Each item needs a readable UPC barcode and must meet
            our condition standards.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 text-gray-700">
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    ✓ DVDs
  </div>
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    ✓ Blu-rays
  </div>
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    ✓ 4K UHD movies
  </div>
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    ✓ TV series, box sets & collector editions
  </div>
</div>

          <p className="mt-6 text-sm text-gray-500">
            Not every DVD will receive an offer. Availability and pricing
            depend on current market demand.
          </p>

          <Link
            href="/condition-guidelines"
            className="inline-block mt-5 font-semibold text-blue-600 hover:text-blue-800"
          >
            View our condition guidelines →
          </Link>
        </div>
      </section>
      <MediaCategoryLinks current="dvds" />

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                How do I find out how much my DVD is worth?
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Scan or enter the UPC barcode on the back of the DVD case. If
                we&apos;re buying that title, you&apos;ll see our cash offer
                immediately.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Do I have to pay for shipping?
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                No. Approved orders receive a prepaid shipping label.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                How many items do I need?
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                You need at least 5 accepted items to submit an order. Eligible
                books, CDs, DVDs, and games can be combined in the same order.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                How will I get paid?
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Payment is processed through PayPal after your shipment arrives
                and the items pass inspection.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Do you buy every DVD?
              </h3>
              <p className="mt-2 text-gray-600 leading-relaxed">
                No. Offers depend on demand, current resale value, and
                condition. If a title does not meet our current buying
                criteria, it will show as not accepted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            See What Your DVDs Are Worth
          </h2>

          <p className="mt-4 text-lg text-blue-100">
            Grab a DVD, scan the barcode, and get your cash offer.
          </p>

          <LandingCtaLink
  href="/#quote"
  eventName="dvds_landing_cta_clicked"
  ctaLocation="footer"
  className="inline-flex mt-8 items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg hover:bg-gray-100 transition-colors"
>
  Get My DVD Quote
</LandingCtaLink>
        </div>
      </section>
    </main>
  );
}