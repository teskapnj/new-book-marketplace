'use client';

import Link from "next/link";

const ACCEPTABLE = [
  "In good working condition, fully functional",
  "Minor wear from normal use",
  "Complete with original components (cases, covers, manuals)",
  "Clean and odor-free",
];

const UNACCEPTABLE = [
  "Any writing, highlighting, or marker stains",
  "Pen marks, underlining, or annotations",
  "Damaged, broken, or non-functional items",
  "Water damage, stains, or mold",
  "Strong odors (smoke, mildew, and similar)",
  "Missing essential components",
  "Excessive wear that affects functionality",
];

const PROCESS = [
  {
    title: "Inspection",
    body: "Every item is checked against our condition standards.",
  },
  {
    title: "Sorting",
    body: "Items are separated into those that meet the standard and those that don't.",
  },
];

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================== BASLIK BANDI ===================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm font-medium text-blue-200 transition-colors hover:text-white"
            >
              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
            Policy
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Returns policy
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            We don&rsquo;t send items back. Anything that doesn&rsquo;t meet our condition standard is
            recycled rather than returned, so it&rsquo;s worth checking your items before you ship
            them.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {/* ---------- Politikanin ozu ---------- */}
        <section className="mb-14">
          <div className="rounded-2xl border-2 border-rose-300 bg-white px-6 py-6 shadow-md">
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-6 w-6 flex-shrink-0 text-rose-500"
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
                  Once you ship, you can&rsquo;t get items back
                </h2>
                <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
                  We don&rsquo;t accept returns of any kind. Items that meet our standard are paid
                  for; items that don&rsquo;t are sent to recycling, with no compensation. By sending
                  us your items, you accept this policy — so please check them carefully first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- IMZA: kutu elimize gecince ---------- */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            After you ship
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            What happens when we receive your box
          </h2>

          <ol className="mt-6 space-y-3">
            {PROCESS.map((step, i) => (
              <li
                key={step.title}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Catallanma */}
          <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Then one of two things
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white shadow-sm">
              <p className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
                Meets the standard
              </p>
              <div className="px-5 py-5">
                <p className="font-serif text-xl font-bold text-slate-900">You get paid</p>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  Payment is sent to your PayPal account within 2 business days of inspection.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border-2 border-rose-300 bg-white shadow-sm">
              <p className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-800">
                Doesn&rsquo;t meet the standard
              </p>
              <div className="px-5 py-5">
                <p className="font-serif text-xl font-bold text-slate-900">Recycled, not returned</p>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                  The item isn&rsquo;t paid for and isn&rsquo;t shipped back to you under any
                  circumstances.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Genel standartlar ---------- */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            The short version
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            General condition standards
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
            <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <p className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
                Acceptable
              </p>
              <ul className="space-y-3 px-5 py-5 text-[15px] leading-relaxed text-slate-700">
                {ACCEPTABLE.map((item) => (
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm">
              <p className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-800">
                Will be recycled
              </p>
              <ul className="space-y-3 px-5 py-5 text-[15px] leading-relaxed text-slate-700">
                {UNACCEPTABLE.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-xl border-l-4 border-blue-500 bg-white px-5 py-4 shadow-sm">
            <p className="text-[15px] leading-relaxed text-slate-700">
              This is the summary. The full list — including format exclusions, ex-library and
              ex-rental copies, and category-specific rules — lives on the condition guidelines page.
            </p>
            <Link
              href="/condition-guidelines"
              className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              See the full condition guidelines
              <svg
                className="ml-1.5 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ---------- Iletisim ---------- */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-bold text-white">Not sure about an item?</h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            Ask us before you ship it. It&rsquo;s much easier to answer a question now than to explain
            a recycled item later.
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}