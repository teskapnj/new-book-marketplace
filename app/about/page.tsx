import Link from "next/link";
import type { Metadata } from "next";

const SITE_URL = "https://www.sellbookmedia.com";
const PAGE_URL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: "About Us | SellBookMedia",
  description:
    "Learn why SellBookMedia was created and how we help give used books, CDs, DVDs, Blu-rays, and video games another life instead of letting them go to waste.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "About SellBookMedia",
    description:
      "We believe books and physical media deserve another life. Learn how SellBookMedia makes it easier to reuse, resell, and keep media in circulation.",
    siteName: "SellBookMedia",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: "About SellBookMedia",
        url: PAGE_URL,
        description:
          "SellBookMedia helps people sell used books and physical media while keeping reusable items in circulation.",
        mainEntity: {
          "@type": "Organization",
          name: "SellBookMedia",
          url: SITE_URL,
        },
      },
      {
        "@type": "Organization",
        name: "SellBookMedia",
        url: SITE_URL,
        description:
          "An online buyback service for books, CDs, DVDs, Blu-rays, and video games.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ===================== HEADER ===================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-200 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            About SellBookMedia
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Giving books and physical media another life
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            A book that is finished, a CD that has not been played in years, or
            a shelf full of old movies does not have to become waste. We believe
            useful media should stay in circulation for as long as possible.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <article>
          {/* ===================== WHY WE EXIST ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Why we exist
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Before it becomes waste, give it another chance
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Millions of books, CDs, DVDs, Blu-rays, and video games spend
                years sitting on shelves, in closets, garages, and storage
                boxes. Eventually, many of them are thrown away simply because
                their owners no longer need them.
              </p>

              <p>
                We think there should be a better step between{" "}
                <em>&quot;I don&apos;t need this anymore&quot;</em> and{" "}
                <em>&quot;throw it away.&quot;</em>
              </p>

              <p>
                SellBookMedia was built around that idea. We make it easier to
                find out whether used media still has value and, when possible,
                help keep it moving from one shelf to another instead of
                disappearing into the waste stream.
              </p>
            </div>
          </section>

          {/* ===================== MISSION CARD ===================== */}
          <section className="mb-14 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-7 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Our philosophy
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Reuse first. Recycle when necessary.
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Recycling matters, but an item that can still be used does not
                need to be destroyed and remade into something else.
              </p>

              <p>
                A book can be read again. A CD can be played again. A movie can
                be watched again. A video game can find another player.
              </p>

              <p className="font-semibold text-slate-900">
                Keeping something useful in circulation is often the simplest
                form of recycling.
              </p>
            </div>
          </section>

          {/* ===================== PHYSICAL MEDIA ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              More than old stuff
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              We do not want physical media to simply disappear
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Streaming and digital media have changed the way people read,
                listen, watch, and play. But physical media still has something
                digital files cannot completely replace.
              </p>

              <p>
                A favorite book can sit on a shelf for decades. An old album can
                bring back a memory the moment you hold it. A DVD box set,
                special edition, game, or recording can preserve something that
                may not always be available online.
              </p>

              <p>
                Some items are common. Some are collectible. Some are simply
                useful to the next person. We believe all of them deserve to be
                checked before they are treated as worthless.
              </p>
            </div>
          </section>

          {/* ===================== WHAT WE DO ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What we do
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Make selling used media less complicated
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              Selling items one by one on a marketplace can mean photographs,
              descriptions, messages, fees, waiting for buyers, and separate
              shipments. We wanted the process to be simpler.
            </p>

            <div className="mt-7 space-y-4">
              {[
                {
                  number: "1",
                  title: "Scan the barcode",
                  text: "Use the ISBN or UPC to identify the exact book, CD, movie, or game.",
                },
                {
                  number: "2",
                  title: "See the offer",
                  text: "If the item meets our current buying criteria, you can see our offer immediately.",
                },
                {
                  number: "3",
                  title: "Build one shipment",
                  text: "Combine qualifying books and media instead of creating hundreds of separate listings.",
                },
                {
                  number: "4",
                  title: "Ship it to us",
                  text: "Qualifying submissions receive a prepaid USPS shipping label.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    {step.number}
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-semibold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===================== WHAT WE BUY ===================== */}
          <section className="mb-14 rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              What we buy
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              One box can contain a little bit of everything
            </h2>

            <p className="mt-5 text-[17px] leading-[1.75] text-slate-700">
              SellBookMedia currently buys qualifying books and physical media,
              including CDs, DVDs, Blu-rays, and video games.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Books",
                  href: "/sell-books-for-cash",
                },
                {
                  title: "CDs",
                  href: "/sell-cds-for-cash",
                },
                {
                  title: "DVDs & Blu-rays",
                  href: "/sell-dvds-for-cash",
                },
                {
                  title: "Video Games",
                  href: "/sell-video-games-for-cash",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {item.title}
                    </span>

                    <svg
                      className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ===================== PEOPLE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Who SellBookMedia is for
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              From one forgotten shelf to an entire collection
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                Maybe you have ten books left over from college. Maybe there are
                fifty DVDs in a cabinet nobody opens anymore. Maybe you have
                spent thirty years building a CD collection and finally decided
                it is time to make some room.
              </p>

              <p>
                Whatever the reason, we want checking those items to be easier
                than researching and listing every one individually.
              </p>

              <p>
                Sometimes an ordinary-looking item turns out to be worth more
                than expected. Sometimes it does not qualify at all. Either way,
                knowing is better than guessing.
              </p>
            </div>
          </section>

          {/* ===================== NOT EVERYTHING HAS VALUE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              A realistic approach
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Not everything has resale value — and that is okay
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                We cannot buy every item. Market demand changes, some titles are
                extremely common, and condition matters.
              </p>

              <p>
                But our broader goal remains the same: encourage people to check
                reusable media before throwing it away.
              </p>

              <p>
                If an item still has a useful life, we would rather see it read,
                watched, listened to, or played again.
              </p>
            </div>
          </section>

          {/* ===================== BOTTOM LINE ===================== */}
          <section className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Our mission
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Less waste. More second chances.
            </h2>

            <div className="mt-5 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                SellBookMedia is a buyback service, but the idea behind it is
                bigger than buying and selling.
              </p>

              <p>
                It is about making it easier for useful things to change hands
                instead of being forgotten, discarded, or unnecessarily
                destroyed.
              </p>

              <p className="font-semibold text-slate-900">
                If something still has another chapter, another song, another
                movie night, or another game left in it, we think it deserves
                the chance.
              </p>
            </div>
          </section>

          {/* ===================== FINAL CTA ===================== */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
              Have something sitting on the shelf?
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-white">
              Give it another chance
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-[16px] leading-relaxed text-blue-100">
              Scan the barcode and see whether your book, CD, DVD, Blu-ray, or
              video game qualifies for a SellBookMedia offer.
            </p>

            <Link
              href="/#quote"
              className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
            >
              Check My Item

              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M12 5l7 7-7 7"
                />
              </svg>
            </Link>

            <div className="mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-blue-200">
              <span>Instant offers</span>
              <span aria-hidden="true">•</span>
              <span>Free shipping</span>
              <span aria-hidden="true">•</span>
              <span>PayPal payment</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}