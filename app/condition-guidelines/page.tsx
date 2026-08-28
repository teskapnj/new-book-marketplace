'use client';

import Link from "next/link";

const ACCEPT = [
  "Clean, complete items in good usable condition",
  "Normal shelf wear, light scuffs, and minor signs of use",
  "Books with intact covers and readable pages",
  "Discs that play properly and are free from major damage",
  "Original cases and cover artwork when applicable",
];

const REJECT = [
  "Heavy writing, highlighting, or excessive markings",
  "Deep scratches or damage that affects playback",
  "Water damage, mold, heavy stains, or strong odors",
  "Missing pages, discs, or essential parts",
  "Cracked, broken, or severely damaged items",
  "Ex-library books or ex-rental media",
  "Bootlegs, promotional copies, or items marked Not for Resale",
  "VHS tapes, cassette tapes, vinyl records, audiobooks, or digital-only items",
];

const PROCESS = [
  "Check your items using this simple guide",
  "Pack and send your qualifying items",
  "We inspect your shipment and issue payment",
];

const CATEGORIES = [
  { name: "Books", icon: "📚" },
  { name: "CDs", icon: "💿" },
  { name: "DVDs", icon: "📀" },
  { name: "Games", icon: "🎮" },
];

export default function ConditionGuidelines() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ===================== HEADER ===================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm font-medium text-blue-200 transition-colors hover:text-white"
            >
              <svg
                className="mr-1.5 h-4 w-4"
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
              Back
            </button>

            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-blue-200 transition-colors hover:text-white"
            >
              Home
            </Link>
          </div>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Before you ship
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Condition guidelines
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            We accept clean, complete items in good usable condition.
            Normal signs of use are okay. Use this quick guide to make
            sure your items are ready to send.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

        {/* ===================== SIMPLE STANDARD ===================== */}
        <section className="mb-14">
          <div className="rounded-2xl border-l-4 border-blue-500 bg-white px-6 py-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Simple standard
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Good, usable condition
            </h2>

            <p className="mt-3 text-[17px] leading-relaxed text-slate-700">
              Your items don&apos;t need to look brand new. Normal wear
              from regular use is fine. They should simply be clean,
              complete, and usable.
            </p>
          </div>
        </section>

        {/* ===================== ACCEPT / DON'T ACCEPT ===================== */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Quick check
          </p>

          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            What we accept
          </h2>

          <p className="mt-3 text-[16px] leading-relaxed text-slate-600">
            Most gently used items are perfectly fine. We mainly look
            for major damage, missing parts, or problems that affect use.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">

            {/* ACCEPT */}
            <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <p className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
                Good to send
              </p>

              <ul className="space-y-3 px-5 py-5 text-[15px] leading-relaxed text-slate-700">
                {ACCEPT.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-2.5 w-2.5 text-emerald-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>

                    {item}
                  </li>
                ))}
              </ul>

              <p className="border-t border-emerald-100 bg-emerald-50/50 px-5 py-4 text-[15px] leading-relaxed text-emerald-900">
                <span className="font-semibold">Normal wear is okay.</span>{" "}
                Light shelf wear, minor case scuffs, and other small signs
                of normal use generally aren&apos;t a problem.
              </p>
            </div>

            {/* REJECT */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <p className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800">
                Please don&apos;t send
              </p>

              <ul className="space-y-3 px-5 py-5 text-[15px] leading-relaxed text-slate-700">
                {REJECT.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===================== CATEGORY DETAILS ===================== */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            What you can sell
          </p>

          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Categories we accept
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm"
              >
                <div className="text-3xl" aria-hidden="true">
                  {cat.icon}
                </div>

                <div className="mt-2 font-semibold text-slate-900">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
            We buy books, music CDs, DVDs, Blu-rays, 4K UHD discs, and
            qualifying video games.
          </p>

          <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
            We currently don&apos;t purchase audiobooks, spoken-word CDs,
            VHS tapes, cassette tapes, vinyl records, or digital/download-only
            products.
          </p>
        </section>

        {/* ===================== CATEGORY TIPS ===================== */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            A few helpful tips
          </p>

          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Before packing your box
          </h2>

          <div className="mt-6 space-y-3">

            <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Books
              </h3>

              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                Covers and pages should be intact and readable. Normal
                shelf wear is okay, but please avoid sending books with
                major water damage, mold, missing pages, or excessive
                writing and highlighting.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                CDs, DVDs, Blu-rays &amp; 4K
              </h3>

              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                Discs should be playable and free from cracks or deep
                scratches. Light surface marks and normal case wear are
                generally fine.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Video games
              </h3>

              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                Games should be complete enough to use normally and the
                disc or cartridge should be in working condition.
              </p>
            </div>

          </div>
        </section>

        {/* ===================== PROCESS ===================== */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Simple process
          </p>

          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            What happens after you send your items?
          </h2>

          <ol className="mt-6 space-y-3">
            {PROCESS.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <span className="font-mono text-sm font-bold tabular-nums text-blue-600">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="text-[16px] leading-relaxed text-slate-700">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ===================== IMPORTANT NOTE ===================== */}
        <section className="mb-14">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 px-6 py-6">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>

              <div>
                <h2 className="font-serif text-xl font-bold text-slate-900">
                  Before you ship
                </h2>

                <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
                  Please review your items before sending them. Items that
                  don&apos;t meet our condition requirements may not qualify
                  for payment and cannot be returned.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== CONTACT ===================== */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-bold text-white">
            Not sure about an item?
          </h2>

          <p className="mx-auto mt-3 max-w-md text-blue-100">
            If you&apos;re unsure about the condition of something,
            just contact us before sending it. We&apos;re happy to help.
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
          >
            Contact support

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
        </div>

      </main>
    </div>
  );
}