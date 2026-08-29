import type { Metadata } from "next";
import Link from "next/link";
import MediaCategoryLinks from "../../components/MediaCategoryLinks";
import LandingCtaLink from "../../components/LandingCtaLink";

export const metadata: Metadata = {
  title: "Sell CDs for Cash Online | Instant Quotes & Free Shipping",
  description:
    "Sell used CDs for cash with SellBookMedia. Scan the UPC, get an instant cash offer, ship for free, and get paid via PayPal.",
  alternates: {
    canonical: "https://www.sellbookmedia.com/sell-cds-for-cash",
  },
  openGraph: {
    title: "Sell CDs for Cash Online | SellBookMedia",
    description:
      "Scan your CD barcode, get an instant cash offer, ship for free, and get paid via PayPal.",
    url: "https://www.sellbookmedia.com/sell-cds-for-cash",
    siteName: "SellBookMedia",
    type: "website",
  },
};
const cdFaqs = [
  {
    q: "What CDs can I sell?",
    a: "We buy eligible music CDs, box sets, and collector editions with readable UPC barcodes. Scan or enter the barcode to see if we are currently buying your CD.",
  },
  {
    q: "How do I know how much my CD is worth?",
    a: "Scan or enter the UPC on your CD. If we are currently buying it, you will see our cash offer instantly.",
  },
  {
    q: "Is shipping free?",
    a: "Yes. We provide a prepaid shipping label, so you do not have to pay shipping out of pocket.",
  },
  {
    q: "How do I get paid?",
    a: "After your shipment arrives and your items pass inspection, payment is processed through PayPal.",
  },
  {
    q: "Is there a minimum order?",
    a: "Yes. Your order must reach a minimum cash offer of $7.50. You can combine eligible CDs with accepted books, DVDs, Blu-rays, 4K movies, and video games.",  },
  {
    q: "Do you buy every CD?",
    a: "No. Acceptance and pricing depend on current demand, resale value, edition, and condition. Scan the UPC to see whether your CD currently qualifies for an offer.",
  },
];


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
          url: "https://www.sellbookmedia.com",
        },
        areaServed: "US",
        description:
          "Sell used CDs for cash with instant UPC quotes, free shipping, and PayPal payment.",
        url: "https://www.sellbookmedia.com/sell-cds-for-cash",
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
    <main className="min-h-screen bg-white">
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <p className="text-sm sm:text-base font-semibold text-blue-100 mb-3">
            SELL USED CDs ONLINE
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Sell CDs for Cash
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Scan the UPC on your CD and see our cash offer instantly.
            Shipping is free, and payment is
            sent via PayPal.
          </p>

          <div className="mt-8">
          <LandingCtaLink
  href="/#quote"
  eventName="cds_landing_cta_clicked"
  ctaLocation="hero"
  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-lg font-bold shadow-lg transition-colors"
>
  Scan a CD Barcode
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

      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">
            An Easy Way to Sell Used CDs Online
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Have music CDs you no longer listen to? SellBookMedia lets you
            check their value without creating listings, taking photos,
            negotiating with buyers, or waiting for a sale.
          </p>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Simply scan or enter the UPC barcode from the CD case. If
            we&apos;re currently buying the title, you&apos;ll see our cash
            offer immediately.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            How to Sell Your CDs
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="text-3xl font-bold text-blue-600 mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900">
                Scan the Barcode
              </h3>
              <p className="mt-3 text-gray-600">
                Scan the UPC on your CD case or enter the barcode manually.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="text-3xl font-bold text-green-600 mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900">
                See Your Cash Offer
              </h3>
              <p className="mt-3 text-gray-600">
                Accepted CDs are added to your order automatically with the
                cash offer displayed.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-7">
              <div className="text-3xl font-bold text-purple-600 mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900">
                Ship Free &amp; Get Paid
              </h3>
              <p className="mt-3 text-gray-600">
                Once your order is submitted, use your prepaid shipping label.
                After inspection, payment is sent via PayPal.
              </p>
            </div>
          </div>
        </div>
      </section>
      <MediaCategoryLinks current="cds" />

<section className="py-16 sm:py-20 bg-slate-50">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Frequently Asked Questions
      </h2>

      <p className="text-xl text-gray-600">
        Everything you need to know about selling used CDs
      </p>
    </div>

    <div className="space-y-4">
      <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
          What CDs can I sell?
          <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">
            +
          </span>
        </summary>

        <p className="mt-4 text-gray-600 leading-relaxed">
          We buy eligible music CDs, box sets, and collector editions with
          readable UPC barcodes. Scan or enter the barcode to see if we are
          currently buying your CD.
        </p>
      </details>

      <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
          How do I know how much my CD is worth?
          <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">
            +
          </span>
        </summary>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Scan or enter the UPC on your CD. If we are currently buying it,
          you will see our cash offer instantly.
        </p>
      </details>

      <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
          Is shipping free?
          <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">
            +
          </span>
        </summary>

        <p className="mt-4 text-gray-600 leading-relaxed">
          Yes. We provide a prepaid shipping label, so you do not
          have to pay shipping out of pocket.
        </p>
      </details>

      <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
          How do I get paid?
          <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">
            +
          </span>
        </summary>

        <p className="mt-4 text-gray-600 leading-relaxed">
          After your shipment arrives and your items pass inspection, payment
          is processed through PayPal.
        </p>
      </details>

      <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
          Is there a minimum order?
          <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">
            +
          </span>
        </summary>

        <p className="mt-4 text-gray-600 leading-relaxed">
        Yes. Your order must reach a minimum cash offer of $7.50. You can combine
          eligible CDs with accepted books, DVDs, Blu-rays, 4K movies, and
          video games.
        </p>
      </details>

      <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-lg text-gray-900">
          Do you buy every CD?
          <span className="ml-4 text-blue-600 transition-transform group-open:rotate-45 text-2xl leading-none">
            +
          </span>
        </summary>

        <p className="mt-4 text-gray-600 leading-relaxed">
          No. Acceptance and pricing depend on current demand, resale value,
          edition, and condition. Scan the UPC to see whether your CD currently
          qualifies for an offer.
        </p>
      </details>
    </div>
  </div>
</section>
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            What CDs Can I Sell?
          </h2>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 text-gray-700">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              ✓ Music CDs
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              ✓ CD box sets
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              ✓ Collector editions
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              ✓ Eligible CDs with original packaging
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Not every CD will receive an offer. Availability and pricing depend
            on current market demand.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold">
            See What Your CDs Are Worth
          </h2>

          <p className="mt-4 text-lg text-blue-100">
            Grab a CD, scan the barcode, and get your cash offer.
          </p>

          <LandingCtaLink
  href="/#quote"
  eventName="cds_landing_cta_clicked"
  ctaLocation="footer"
  className="inline-flex mt-8 items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg hover:bg-gray-100 transition-colors"
>
  Get My CD Quote
</LandingCtaLink>
        </div>
      </section>
    </main>
  );
}