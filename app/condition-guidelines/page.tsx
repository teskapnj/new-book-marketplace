'use client';

import Link from "next/link";

const ACCEPT = [
  "Items that play or function perfectly without issues",
  "Minor surface wear or light scuffs that don't affect function",
  "Complete with all original inserts, artwork, and manuals",
  "Discs and artwork clean — no stickers, writing, or markings",
  "Clean, readable, and odor-free",
];

const REJECT = [
  { text: "Any writing, highlighting, underlining, or annotations", strong: true },
  { text: "CDs or DVDs with stickers, writing, or markings on the disc or artwork", strong: true },
  { text: "Deep scratches that affect playback or reading", strong: true },
  { text: "Ex-library books and ex-rental discs", strong: true },
  { text: "Cracked, broken, or badly damaged items", strong: false },
  { text: "Water damage, stains, mold, or warped items", strong: false },
  { text: "Missing original case, cover art, inserts, or manuals", strong: false },
  { text: "Strong odors (smoke, mildew, and similar)", strong: false },
  { text: "Promotional copies or bootleg items", strong: false },
  { text: "Advance Reader Copies (ARCs) or items marked \"Not for Resale\"", strong: false },
  { text: "Magazines, newspapers, or periodicals", strong: false },
  { text: "Audiobooks and spoken-word CDs", strong: true },
  { text: "Region-locked or non-US format discs (for example PAL)", strong: false },
  { text: "Digital or streaming codes, or download-only items", strong: false },
  { text: "VHS tapes, cassette tapes, and vinyl records", strong: true },
];

const PROCESS = [
  { text: "Check your items against this guide", tone: "blue" as const },
  { text: "Send only items in very good condition", tone: "blue" as const },
  { text: "We inspect and pay for qualifying items", tone: "blue" as const },
  { text: "Non-qualifying items are recycled, not returned", tone: "red" as const },
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
            Before you ship
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Condition guidelines
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            We only accept items in very good condition. Please check these criteria carefully before
            sending your items — anything that doesn&rsquo;t meet the standard is recycled rather than
            returned.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {/* ---------- Tek kural ---------- */}
        <section className="mb-14">
          <div className="rounded-2xl border-l-4 border-blue-500 bg-white px-6 py-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              The standard
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Very good condition
            </h2>
            <p className="mt-3 text-[17px] leading-relaxed text-slate-700">
              All items must be in very good condition, with minimal wear from normal use only.
            </p>
          </div>
        </section>

        {/* ---------- Kabul / Red ---------- */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            The two lists
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            What we accept, and what we don&rsquo;t
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
            {/* Kabul */}
            <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <p className="border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
                We accept
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="border-t border-emerald-100 bg-emerald-50/50 px-5 py-4 text-[15px] leading-relaxed text-emerald-900">
                <span className="font-semibold">On cases:</span> we don&rsquo;t judge the outer case
                condition. A worn or scuffed case is fine — but the case and artwork must be present,
                and the disc and artwork themselves must meet the standard.
              </p>
            </div>

            {/* Red */}
            <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm">
              <p className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-800">
                We don&rsquo;t accept
              </p>
              <ul className="space-y-3 px-5 py-5 text-[15px] leading-relaxed text-slate-700">
                {REJECT.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                    <span className={item.strong ? "font-semibold text-slate-900" : ""}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Iki net kural ---------- */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Strictly enforced
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Two rules with no exceptions
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border-l-4 border-amber-500 bg-white px-5 py-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">No writing, stickers, or markings</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                We can&rsquo;t accept items with writing, highlighting, underlining, marker stains,
                stickers, or markings of any kind. This applies to books as well as the discs and
                artwork of CDs and DVDs, across every product category.
              </p>
            </div>

            <div className="rounded-xl border-l-4 border-amber-500 bg-white px-5 py-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">No ex-library or ex-rental copies</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                Library copies carry stamps, stickers, spine labels, or pocket inserts. Former rental
                discs — Redbox, Blockbuster, library rentals — usually come in generic cases, carry
                rental stickers, or are missing the original artwork. Neither can be accepted, even if
                the disc plays perfectly or the pages are clean.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Kategoriler ---------- */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            What goes in the box
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
                <div className="mt-2 font-semibold text-slate-900">{cat.name}</div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            Music CDs, DVDs, Blu-ray, and 4K UHD discs are all welcome. Audiobooks, spoken-word CDs,
            VHS, cassette tapes, and vinyl records are not accepted.
          </p>
        </section>

        {/* ---------- Surec ---------- */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Start to finish
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            How the check works
          </h2>

          <ol className="mt-6 space-y-3">
            {PROCESS.map((step, i) => (
              <li
                key={step.text}
                className={`flex items-start gap-4 rounded-xl border bg-white px-5 py-4 shadow-sm ${
                  step.tone === "red" ? "border-rose-200" : "border-slate-200"
                }`}
              >
                <span
                  className={`font-mono text-sm font-bold tabular-nums ${
                    step.tone === "red" ? "text-rose-600" : "text-blue-600"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[16px] leading-relaxed text-slate-700">{step.text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- Iade yok ---------- */}
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
                <h2 className="font-serif text-xl font-bold text-slate-900">No returns</h2>
                <p className="mt-2 text-[16px] leading-relaxed text-slate-700">
                  Items that don&rsquo;t meet our very good condition standard are recycled and not
                  returned to you. Please check your items carefully before sending them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Iletisim ---------- */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-bold text-white">
            Not sure about an item?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            If you&rsquo;re unsure whether something meets the standard, ask us before you send it.
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