'use client';

import Link from "next/link";

const SECTIONS = [
  { id: "acceptance", n: "01", title: "Acceptance of terms" },
  { id: "service", n: "02", title: "Our service" },
  { id: "responsibilities", n: "03", title: "Seller responsibilities" },
  { id: "acceptance-rejection", n: "04", title: "Submission acceptance and rejection" },
  { id: "condition", n: "05", title: "Condition standards and inspection" },
  { id: "no-returns", n: "06", title: "No returns policy" },
  { id: "payment", n: "07", title: "Payment terms" },
  { id: "shipping", n: "08", title: "Shipping and labels" },
  { id: "prohibited", n: "09", title: "What we don't buy" },
  { id: "security", n: "10", title: "Account security" },
  { id: "liability", n: "11", title: "Limitation of liability" },
  { id: "ip", n: "12", title: "Intellectual property" },
  { id: "privacy", n: "13", title: "Privacy and data" },
  { id: "modifications", n: "14", title: "Modifications and changes" },
  { id: "law", n: "15", title: "Governing law" },
  { id: "contact", n: "16", title: "Contact information" },
];

function SectionHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-slate-200 pb-3">
      <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">{n}</span>
      <h2 className="font-serif text-2xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-4 space-y-2.5 text-[16px] leading-relaxed text-slate-700">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({
  tone,
  label,
  children,
}: {
  tone: "warn" | "danger";
  label: string;
  children: React.ReactNode;
}) {
  const border = tone === "danger" ? "border-rose-500" : "border-amber-500";
  const text = tone === "danger" ? "text-rose-800" : "text-amber-900";
  return (
    <div className={`mt-5 rounded-xl border-l-4 bg-white px-5 py-4 shadow-sm ${border}`}>
      <p className={`text-sm font-semibold ${text}`}>{label}</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-slate-700">{children}</p>
    </div>
  );
}

export default function TermsPage() {
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
            Legal
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Terms of service
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-blue-100">
            Please read these terms before selling your books, CDs, DVDs, or games through our
            platform. By submitting items, you agree to be bound by them.
          </p>

          <p className="mt-8 border-t border-white/15 pt-5 text-sm text-blue-200">
            Effective <time dateTime="2026-08-18">August 18, 2026</time>
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {/* ---------- Icindekiler ---------- */}
        <nav aria-label="Contents" className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Jump to
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">Contents</h2>

          <ol className="mt-5 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-baseline gap-2.5 rounded py-1.5 text-[15px] text-slate-700 transition-colors hover:text-blue-700"
                >
                  <span className="font-mono text-xs font-bold text-slate-400 tabular-nums">
                    {s.n}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          <section id="acceptance" className="scroll-mt-8">
            <SectionHeading n="01" title="Acceptance of terms" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              By using our platform to sell your books, CDs, DVDs, and games, you accept and agree to
              be bound by these terms. If you do not agree to these terms, please do not use our
              service.
            </p>
          </section>

          <section id="service" className="scroll-mt-8">
            <SectionHeading n="02" title="Our service" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              We operate a platform where you can sell your used books, CDs, DVDs, and games. Our
              service includes:
            </p>
            <List
              items={[
                "Item scanning and identification via barcode, ISBN, or UPC",
                "Manual search and Amazon ASIN lookup",
                "Free prepaid shipping labels",
                "Item inspection and condition verification",
                "PayPal payment processing for accepted items",
              ]}
            />
          </section>

          <section id="responsibilities" className="scroll-mt-8">
            <SectionHeading n="03" title="Seller responsibilities" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              As a seller on our platform, you agree to:
            </p>
            <List
              items={[
                "Provide accurate personal information, PayPal account details, and shipping address",
                <>
                  Only submit items in <strong>very good condition</strong> as defined in our
                  condition guide
                </>,
                "Ensure items have no writing, highlighting, markings, or damage",
                "Package items securely using appropriate materials",
                "Ship items within 30 days of receiving prepaid shipping labels",
                "Provide accurate package dimensions and weight information",
              ]}
            />
          </section>

          <section id="acceptance-rejection" className="scroll-mt-8">
            <SectionHeading n="04" title="Submission acceptance and rejection" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              We reserve the sole and absolute discretion to accept or reject any item submission for
              any reason or no reason at all. Our decisions regarding acceptance or rejection of
              submissions are final and binding.
            </p>
            <List
              items={[
                "We are under no obligation to accept any submitted items",
                "We may reject submissions based on market demand, inventory levels, condition concerns, or any other business considerations",
                "We are not required to provide reasons for rejection decisions",
                "Rejection decisions are final and non-appealable",
                "We reserve the right to change our acceptance criteria at any time without notice",
              ]}
            />
            <Callout tone="warn" label="Notice">
              Even if items meet our stated condition standards, we may still reject submissions based
              on other factors including but not limited to market saturation, inventory management,
              or business priorities.
            </Callout>
          </section>

          <section id="condition" className="scroll-mt-8">
            <SectionHeading n="05" title="Condition standards and inspection" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              All items are subject to our strict condition standards:
            </p>
            <List
              items={[
                "Items must be in very good condition with minimal wear",
                "No writing, highlighting, underlining, or markings of any kind",
                "No water damage, stains, odors, or structural damage",
                "All original components must be included (cases, covers, manuals, inserts)",
                "Items must function properly without defects",
              ]}
            />
            <Callout tone="danger" label="Important">
              Items that do not meet our condition standards will not be paid for and will be sent
              directly to recycling. We do not return rejected items under any circumstances.
            </Callout>
            <Link
              href="/condition-guidelines"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Full condition guidelines
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
          </section>

          <section id="no-returns" className="scroll-mt-8">
            <SectionHeading n="06" title="No returns policy" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              <strong>We do not accept returns of any kind.</strong> By using our service, you
              acknowledge and agree that:
            </p>
            <List
              items={[
                "Once items are shipped to us, they cannot be returned to you",
                "Items not meeting our condition standards will be recycled",
                "No payment will be made for recycled items",
                "All sales are final once items are processed",
              ]}
            />
          </section>

          <section id="payment" className="scroll-mt-8">
            <SectionHeading n="07" title="Payment terms" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              Payment processing works as follows:
            </p>
            <List
              items={[
                "Only items meeting our condition standards will be paid for",
                "Payments are processed via PayPal only",
                "You must provide a valid PayPal account email address",
                "Payments are typically processed within 2 business days after inspection",
                "No fees are charged to sellers for our service",
                "All payments are final and non-refundable",
              ]}
            />
          </section>

          <section id="shipping" className="scroll-mt-8">
            <SectionHeading n="08" title="Shipping and labels" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              Our shipping process includes:
            </p>
            <List
              items={[
                "Free prepaid shipping labels provided within 24 hours of submission approval",
                "Labels are valid for 30 days from issuance",
                "You are responsible for proper packaging and label attachment",
                "Tracking information is provided with all shipments",
                "Items must arrive at our facility within 30 days of label generation",
              ]}
            />
          </section>

          <section id="prohibited" className="scroll-mt-8">
          <SectionHeading n="09" title="What we don&rsquo;t buy" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              The following items are not accepted on our platform:
            </p>
            <List
              items={[
                "Items with writing, highlighting, or markings",
                "Damaged, broken, or non-functional items",
                "Water-damaged or moldy items",
                "Ex-library books or items with library markings",
                "Promotional, bootleg, or counterfeit items",
                "Items missing original components (cases, covers, manuals)",
                "Items with strong odors (smoke, mildew, and similar)",
              ]}
            />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              This is a summary. The complete list — including format exclusions such as VHS,
              cassettes, vinyl, and audiobook CDs, plus ex-library and ex-rental copies — is kept on
              our condition guidelines page.
            </p>
            <Link
              href="/condition-guidelines"
              className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Full condition guidelines
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
          </section>

          <section id="security" className="scroll-mt-8">
            <SectionHeading n="10" title="Account security" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              You are responsible for maintaining the security of your account and the accuracy of
              your information. This includes keeping your PayPal account information current and
              secure.
            </p>
          </section>

          <section id="liability" className="scroll-mt-8">
            <SectionHeading n="11" title="Limitation of liability" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              Our liability is limited to the value of accepted items only. We are not responsible for
              items lost in transit, items damaged due to improper packaging, or any indirect or
              consequential damages. Our maximum liability will not exceed the total amount paid for
              your accepted items.
            </p>
          </section>

          <section id="ip" className="scroll-mt-8">
            <SectionHeading n="12" title="Intellectual property" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              You represent that you own or have the right to sell all items submitted to our
              platform. You are responsible for ensuring that items do not infringe on any
              intellectual property rights.
            </p>
          </section>

          <section id="privacy" className="scroll-mt-8">
            <SectionHeading n="13" title="Privacy and data" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              We collect and use your personal information as described in our Privacy Policy. This
              includes your name, address, PayPal information, and shipping details necessary to
              process your sales.
            </p>
            <Link
              href="/privacy-policy"
              className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Privacy policy
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
          </section>

          <section id="modifications" className="scroll-mt-8">
            <SectionHeading n="14" title="Modifications and changes" />
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-slate-700">
              <p>
                We reserve the right to modify, suspend, or discontinue the platform (or any part
                thereof) and to modify these Terms of Service at any time, with or without notice to
                you. We will not be liable to you or any third party for any modification, suspension,
                or discontinuation of the platform or any changes to these terms.
              </p>
              <p>
                While we may provide notice of significant changes to these Terms of Service via email
                or website notice when feasible, we are not obligated to provide any prior notice. All
                changes to the platform itself, including but not limited to those listed below, may
                be implemented without prior notice at our sole discretion.
              </p>
              <p>
                We may also impose limits on certain features and services or restrict your access to
                parts or all of the platform without notice or liability. These changes may include,
                but are not limited to:
              </p>
            </div>
            <List
              items={[
                "Changing the types of items we accept",
                "Modifying pricing structures or payment terms",
                "Altering the inspection process or condition standards",
                "Updating shipping methods or carriers",
                "Modifying the user interface or functionality",
                "Discontinuing certain features or services entirely",
              ]}
            />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              By continuing to use our platform after any such changes, you agree to be bound by the
              modified terms and conditions. If you do not agree to any such changes, your sole
              recourse is to stop using the platform.
            </p>
          </section>

          <section id="law" className="scroll-mt-8">
            <SectionHeading n="15" title="Governing law" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              These terms are governed by the laws of the United States. Any disputes will be resolved
              through binding arbitration in accordance with the rules of the American Arbitration
              Association.
            </p>
          </section>

          <section id="contact" className="scroll-mt-8">
            <SectionHeading n="16" title="Contact information" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              If you have questions about these terms, please contact us:
            </p>
            <List
              items={[
                <>
                  Through our{" "}
                  <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-700">
                    contact form
                  </Link>
                </>,
                <>
                  By email at{" "}
                  <a
                    href="mailto:support@sellbookmedia.com"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    support@sellbookmedia.com
                  </a>
                </>,
              ]}
            />
          </section>
        </div>

        {/* ---------- Kapanis ---------- */}
        <div className="mt-14 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">
            Effective <time dateTime="2026-08-18">August 18, 2026</time>
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
            By submitting items to our platform, you acknowledge that you have read, understood, and
            agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}