'use client';

import Link from "next/link";

const STEPS = [
  {
    id: "scan",
    n: "01",
    title: "Scan and add items",
    blurb: "Use your phone to scan barcodes, or type them in",
  },
  {
    id: "details",
    n: "02",
    title: "Enter your details",
    blurb: "Contact, payment, and package information",
  },
  {
    id: "label",
    n: "03",
    title: "Get your shipping label",
    blurb: "Free prepaid label once your bundle is approved",
  },
  {
    id: "paid",
    n: "04",
    title: "Ship and get paid",
    blurb: "Send your box, receive payment via PayPal",
  },
];

const FAQ = [
  {
    q: "How long does the entire process take?",
    a: "After you submit your bundle, our team reviews it within 24 hours. Once approved and we receive your shipped items, payment is typically sent within 2 business days.",
  },
  {
    q: "What if some of my items aren't accepted?",
    a: "Only qualifying items receive payment. Non-qualifying items are responsibly recycled rather than returned.",
  },
  {
    q: "Can I track my package?",
    a: "Yes. Your prepaid shipping label includes tracking information that you can monitor online.",
  },
  {
    q: "What if I made a mistake in my submission?",
    a: "Contact our support team as soon as possible. Changes may be possible before your shipping label is generated.",
  },
  {
    q: "Are there any shipping fees?",
    a: "No, shipping is completely free — we email you a prepaid label once your bundle is approved.",
  },
  {
    q: "What payment methods do you offer?",
    a: "Currently we only offer PayPal payments, for fast and secure transactions.",
  },
];

// Adim bolumu basligi - dort adimda ayni yapida
function StepHeading({ n, title, blurb }: { n: string; title: string; blurb: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-200 pb-5">
      <span className="font-mono text-2xl font-bold text-blue-600 tabular-nums">{n}</span>
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-[16px] text-slate-600">{blurb}</p>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  tone = "plain",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "plain" | "good" | "warn";
}) {
  const border =
    tone === "good" ? "border-emerald-200" : tone === "warn" ? "border-amber-200" : "border-slate-200";
  const head =
    tone === "good"
      ? "border-emerald-100 bg-emerald-50 text-emerald-800"
      : tone === "warn"
      ? "border-amber-100 bg-amber-50 text-amber-900"
      : "border-slate-100 bg-slate-50 text-slate-700";

  return (
    <div className={`overflow-hidden rounded-xl border bg-white shadow-sm ${border}`}>
      <p className={`border-b px-5 py-3 text-sm font-semibold ${head}`}>{title}</p>
      <div className="px-5 py-4 text-[15px] leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SellerGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================== BASLIK BANDI ===================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
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
            Seller guide
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            How to sell your books, CDs, DVDs, and games
          </h1>

          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-blue-100">
            Four steps from the shelf to your PayPal account. Here&rsquo;s exactly what happens at
            each one, and what to check before you ship.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center rounded-xl bg-white px-6 py-3 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
          >
            Start scanning
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
      </header>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {/* ---------- Adim gezinmesi ---------- */}
        <nav aria-label="Steps" className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            The whole process
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Four steps, start to finish
          </h2>

          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li key={step.id}>
                <a
                  href={`#${step.id}`}
                  className="block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">
                    {step.n}
                  </span>
                  <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-slate-600">{step.blurb}</p>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ---------- ADIM 1 ---------- */}
        <section id="scan" className="mb-16 scroll-mt-8">
          <StepHeading n="01" title="Scan and add items" blurb="Three ways to identify an item" />

          <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
            <div className="space-y-3">
              <Card title="Camera scan (recommended)">
                Point your phone camera at the barcode — the ISBN on a book, the UPC on a disc — and
                we identify the item automatically.
              </Card>
              <Card title="Type it in">
                Enter the barcode number by hand. Useful on desktop, or when a barcode is damaged.
              </Card>
              <Card title="Amazon ASIN">
                If you have the ASIN, that works too.
              </Card>
            </div>

            <div className="space-y-3">
              <Card title="What we accept" tone="good">
                <Bullets
                  items={[
                    "Books — fiction, non-fiction, textbooks",
                    "Music CDs",
                    "Movies — DVD, Blu-ray, 4K",
                    "Video games — all platforms",
                  ]}
                />
              </Card>
              <Card title="Worth knowing" tone="warn">
                <Bullets
                  items={[
                    "Items only appear in your list if we accept them",
                    "If an item doesn't appear, we don't currently buy that title",
                    "Check the condition guide before adding items",
                  ]}
                />
                <Link
                  href="/condition-guidelines"
                  className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Condition guidelines
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
              </Card>
            </div>
          </div>
        </section>

        {/* ---------- ADIM 2 ---------- */}
        <section id="details" className="mb-16 scroll-mt-8">
          <StepHeading
            n="02"
            title="Enter your details"
            blurb="What we need to send your label and your money"
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
            <div className="space-y-3">
              <Card title="About you">
                <Bullets items={["First and last name", "PayPal account email"]} />
              </Card>
              <Card title="Shipping address">
                <Bullets items={["Street address", "City, state, ZIP code", "Country"]} />
              </Card>
            </div>

            <div className="space-y-3">
              <Card title="Your box">
                <p className="mb-3">
                  Measure the box you&rsquo;ll actually ship in — the label depends on it.
                </p>
                <Bullets
                  items={[
                    "Weight, up to 50 lbs",
                    "Length, width, height — up to 18 × 16 × 16 in",
                    "One box per order",
                  ]}
                />
              </Card>
              <Card title="Before you submit" tone="warn">
                <Bullets
                  items={[
                    "Double-check your PayPal email — that's where the money goes",
                    "Accurate dimensions matter; a wrong label costs you time",
                    "All fields are required to continue",
                  ]}
                />
              </Card>
            </div>
          </div>
        </section>

        {/* ---------- ADIM 3 ---------- */}
        <section id="label" className="mb-16 scroll-mt-8">
          <StepHeading
            n="03"
            title="Get your shipping label"
            blurb="What happens after you hit submit"
          />

          <ol className="mt-6 space-y-3">
            {[
              {
                t: "Confirmation email",
                b: "You get an immediate confirmation that we've received your submission.",
              },
              {
                t: "We review your bundle",
                b: "Our team checks the submitted items, typically within 24 hours.",
              },
              {
                t: "Label sent if approved",
                b: "Once approved, you receive an email with your free prepaid shipping label.",
              },
            ].map((item, i) => (
              <li
                key={item.t}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{item.t}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-slate-600">{item.b}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 grid gap-4 md:grid-cols-2 md:items-start">
            <Card title="What arrives in the email" tone="good">
              <Bullets
                items={[
                  "Prepaid shipping label (PDF)",
                  "Packing instructions",
                  "Tracking information",
                ]}
              />
            </Card>
            <Card title="Printing tips">
              <Bullets
                items={[
                  'Print on standard 8.5" × 11" paper',
                  "Use clear tape to secure the label",
                  "Keep confirmation emails for your records",
                  "Check your spam folder if the label doesn't arrive",
                ]}
              />
            </Card>
          </div>
        </section>

        {/* ---------- ADIM 4 ---------- */}
        <section id="paid" className="mb-16 scroll-mt-8">
          <StepHeading
            n="04"
            title="Ship and get paid"
            blurb="Pack the box, drop it off, watch for the payment"
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 md:items-start">
            <div className="space-y-3">
              <Card title="Packing">
                <Bullets
                  items={[
                    "Use a sturdy box or padded envelope",
                    "Include every item from your submission",
                    "Fill empty space so items can't shift in transit — crumpled paper works fine",
                  ]}
                />
              </Card>
              <Card title="Shipping">
                <Bullets
                  items={[
                    "Attach the prepaid label securely",
                    "Drop off at the designated shipping location",
                    "Keep the tracking number",
                    "Shipping costs you nothing",
                  ]}
                />
              </Card>
            </div>

            <div className="space-y-3">
              <Card title="How you get paid" tone="good">
                <Bullets
                  items={[
                    "Items are inspected on arrival",
                    "Qualifying items are processed for payment",
                    "Payment goes to your PayPal account",
                    "You get an email confirming the details",
                  ]}
                />
              </Card>
              <Card title="Before you seal the box" tone="warn">
                <Bullets
                  items={[
                    "Only items meeting the condition guide are paid for",
                    "Non-qualifying items are recycled, not returned",
                    "Review the condition guide one last time",
                  ]}
                />
              </Card>
            </div>
          </div>
        </section>

        {/* ---------- SSS ---------- */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Still wondering
          </p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Common questions
          </h2>

          <dl className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {FAQ.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="font-serif text-lg font-semibold text-slate-900">{item.q}</dt>
                <dd className="mt-2 text-[16px] leading-[1.75] text-slate-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- CTA ---------- */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-bold text-white">Ready to start?</h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            Scan your first item and get an instant cash offer. No account required to start.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-transform hover:scale-[1.02]"
          >
            Start scanning
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