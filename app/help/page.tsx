'use client';

import { useState } from "react";
import Link from "next/link";

type Item = {
  q: string;
  a: string;
  href?: string;
  hrefLabel?: string;
};

type Group = {
  id: string;
  name: string;
  blurb: string;
  items: Item[];
};

const GROUPS: Group[] = [
  {
    id: "selling",
    name: "Selling items",
    blurb: "Scanning, what we take, and what we don't",
    items: [
      {
        q: "How do I start selling?",
        a: "Scan a barcode with your phone camera, or type the number in by hand. If we buy that title, it's added to your list with the offer shown. You don't need an account to scan — only to submit your box.",
      },
      {
        q: "What can I scan?",
        a: "The ISBN on a book, the UPC on a CD, DVD, Blu-ray, 4K disc, or game. Amazon ASINs work too. If a barcode is damaged, type the number in instead.",
      },
      {
        q: "What do you buy?",
        a: "Books, music CDs, movies on DVD, Blu-ray and 4K, and video games on all platforms. We don't currently buy VHS tapes, cassettes, vinyl records, or audiobook CD sets.",
      },
      {
        q: "Why didn't my item appear in the list?",
        a: "Items only appear if we make an offer on them. If nothing appeared, that title is worth less than our $1.50 minimum, or it's a format we don't buy. It isn't a problem with the scan.",
      },
      {
        q: "What condition do items need to be in?",
        a: "Very good condition: clean, complete with original case and artwork, no writing or stickers, and no deep scratches. Ex-library and ex-rental copies aren't accepted.",
        href: "/condition-guidelines",
        hrefLabel: "Full condition guidelines",
      },
      {
        q: "Is there a minimum number of items?",
        a: "Yes, five accepted items per box. Books, CDs, DVDs, and games can be mixed in any combination to reach it.",
      },
    ],
  },
  {
    id: "shipping",
    name: "Shipping",
    blurb: "Labels, packing, and box limits",
    items: [
      {
        q: "How long until I get a shipping label?",
        a: "We review your submission, typically within 24 hours. Once it's approved, the free prepaid label arrives by email. Check your spam folder if you don't see it.",
      },
      {
        q: "Are there any shipping fees?",
        a: "No. Shipping costs you nothing — the prepaid label is included once your bundle is approved.",
      },
      {
        q: "How big can my box be?",
        a: "One box per order, up to 18 × 16 × 16 inches and 50 lbs. If your items won't fit in a single box, submit them as separate orders.",
      },
      {
        q: "How should I pack the items?",
        a: "Use a sturdy box or padded envelope, include every item from your submission, and attach the prepaid label securely. No extra packing material is needed inside.",
      },
      {
        q: "Can I track my package?",
        a: "Yes. Your prepaid label includes tracking, so you can follow the box online.",
      },
    ],
  },
  {
    id: "process",
    name: "After you ship",
    blurb: "Inspection, payment, and what happens to rejected items",
    items: [
      {
        q: "What happens when you receive my box?",
        a: "Every item is inspected against our condition standards, then sorted. Items that meet the standard are processed for payment; items that don't are recycled.",
      },
      {
        q: "How do I get paid?",
        a: "Payment goes to the PayPal address you entered, within 2 business days of inspection. You'll get an email confirming the details.",
      },
      {
        q: "Do you return items you don't accept?",
        a: "No. Items that don't meet our condition standard are recycled rather than returned, and aren't paid for. That's why it's worth checking condition carefully before you ship.",
        href: "/returns-policy",
        hrefLabel: "Returns policy",
      },
      {
        q: "What if I made a mistake in my submission?",
        a: "Contact support as soon as you can. Changes may still be possible before your shipping label is generated.",
        href: "/contact",
        hrefLabel: "Contact support",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical help",
    blurb: "Camera, browser, and account issues",
    items: [
      {
        q: "The camera won't scan my barcode",
        a: "Make sure the barcode is inside the red line, hold steady, and try more light. If your browser hasn't been given camera permission, the scanner won't open — check your browser's site settings. You can always type the number in instead.",
      },
      {
        q: "Do I need to install an app?",
        a: "No. Everything runs in your phone's browser — there's nothing to download.",
      },
      {
        q: "Do I need an account?",
        a: "Not to scan and build your list. You'll need to sign in or create an account when you're ready to submit your box, so we know where to send the label and the payment.",
      },
      {
        q: "I can't sign in",
        a: "Check that you're using the same email you registered with, and look for a verification email in your spam folder. If you're still stuck, contact support and we'll sort it out.",
        href: "/contact",
        hrefLabel: "Contact support",
      },
    ],
  },
];

const LINKS = [
  { href: "/condition-guidelines", title: "Condition guidelines", blurb: "What we accept and reject" },
  { href: "/returns-policy", title: "Returns policy", blurb: "Why items aren't sent back" },
  { href: "/seller-guide", title: "Seller guide", blurb: "The whole process, step by step" },
  { href: "/", title: "Start scanning", blurb: "Get an instant cash offer" },
];

export default function HelpCenterPage() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const groups = q
    ? GROUPS.map((g) => ({
        ...g,
        items: g.items.filter(
          (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        ),
      })).filter((g) => g.items.length > 0)
    : GROUPS;

  const resultCount = groups.reduce((n, g) => n + g.items.length, 0);

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
            Help center
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How can we help?
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-blue-100">
            Answers about selling your books, CDs, DVDs, and games.
          </p>

          <div className="relative mt-7">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.substring(0, 100))}
              placeholder="Search — try &ldquo;payment&rdquo; or &ldquo;label&rdquo;"
              className="w-full rounded-xl border border-white/20 bg-white/95 py-4 pl-5 pr-12 text-base text-slate-900 shadow-lg outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
              aria-label="Search help articles"
            />
            <svg
              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {q && (
          <p className="mb-8 text-sm text-slate-500">
            {resultCount === 0
              ? "No answers matched that search."
              : `${resultCount} answer${resultCount === 1 ? "" : "s"} matched.`}
          </p>
        )}

        {resultCount === 0 && q ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <h2 className="font-serif text-xl font-bold text-slate-900">Nothing found</h2>
            <p className="mx-auto mt-2 max-w-sm text-[16px] leading-relaxed text-slate-600">
              Try a different word, or clear the search to browse everything. If it&rsquo;s something
              we haven&rsquo;t covered, just ask us.
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-6 inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear search
            </button>
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.id} className="mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                {group.blurb}
              </p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                {group.name}
              </h2>

              <div className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {group.items.map((item) => (
                  <details key={item.q} className="group px-5 py-4" open={Boolean(q)}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <span className="font-semibold text-slate-900">{item.q}</span>
                      <svg
                        className="mt-1 h-5 w-5 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-[16px] leading-[1.75] text-slate-600">{item.a}</p>
                    {item.href && (
                      <Link
                        href={item.href}
                        className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {item.hrefLabel}
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
                    )}
                  </details>
                ))}
              </div>
            </section>
          ))
        )}

        {/* ---------- Onemli sayfalar ---------- */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Read next
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Important pages
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/40"
              >
                <h3 className="font-semibold text-slate-900">{link.title}</h3>
                <p className="mt-1 text-[15px] text-slate-600">{link.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- Iletisim ---------- */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-bold text-white">Still stuck?</h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            Send us a message and we&rsquo;ll get back to you within 24 hours.
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