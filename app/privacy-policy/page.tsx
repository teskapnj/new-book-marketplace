'use client';

import Link from "next/link";

const SECTIONS = [
  { id: "collect", n: "01", title: "Information we collect" },
  { id: "use", n: "02", title: "How we use your information" },
  { id: "sharing", n: "03", title: "Information sharing" },
  { id: "security", n: "04", title: "Data security" },
  { id: "retention", n: "05", title: "Data retention" },
  { id: "rights", n: "06", title: "Your rights and choices" },
  { id: "cookies", n: "07", title: "Cookies and tracking" },
  { id: "third-party", n: "08", title: "Third-party services" },
  { id: "children", n: "09", title: "Children's privacy" },
  { id: "international", n: "10", title: "International users" },
  { id: "changes", n: "11", title: "Changes to this policy" },
  { id: "contact", n: "12", title: "Contact us" },
];

function SectionHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-slate-200 pb-3">
      <span className="font-mono text-sm font-bold text-blue-600 tabular-nums">{n}</span>
      <h2 className="font-serif text-2xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </h3>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2.5 text-[16px] leading-relaxed text-slate-700">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
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
            Privacy policy
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-blue-100">
            How we collect, use, and protect your personal information when you sell items through our
            platform.
          </p>

          <p className="mt-8 border-t border-white/15 pt-5 text-sm text-blue-200">
            Effective <time dateTime="2026-08-18">August 18, 2026</time>
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        {/* ---------- Icindekiler ---------- */}
        <nav aria-label="Contents" className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Jump to</p>
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
          <section id="collect" className="scroll-mt-8">
            <SectionHeading n="01" title="Information we collect" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              When you use our platform to sell your books, CDs, DVDs, and games, we collect the
              following information.
            </p>

            <SubHeading>Personal information</SubHeading>
            <List
              items={[
                "Full name (first and last name)",
                "Email address",
                "Shipping address (street address, city, state, ZIP code)",
                "PayPal account email address",
              ]}
            />

            <SubHeading>Item information</SubHeading>
            <List
              items={[
                "Scanned barcode data (ISBN, UPC codes)",
                "Amazon ASIN numbers (when provided)",
                "Item titles, authors, and descriptions",
                "Package dimensions and weight",
              ]}
            />

            <SubHeading>Technical information</SubHeading>
            <List
              items={[
                "IP address and browser information",
                "Device type and operating system",
                "Usage data and site interactions",
                "Camera access data (for barcode scanning)",
              ]}
            />
          </section>

          <section id="use" className="scroll-mt-8">
            <SectionHeading n="02" title="How we use your information" />

            <SubHeading>Service delivery</SubHeading>
            <List
              items={[
                "Processing your item submissions and sales",
                "Generating and sending prepaid shipping labels",
                "Inspecting and evaluating submitted items",
                "Processing PayPal payments for accepted items",
                "Providing customer support and assistance",
              ]}
            />

            <SubHeading>Communication</SubHeading>
            <List
              items={[
                "Sending shipping labels via email",
                "Notifying you about payment processing",
                "Providing updates on item inspection status",
                "Responding to your inquiries and support requests",
                "Sending important service announcements",
              ]}
            />

            <SubHeading>Platform improvement</SubHeading>
            <List
              items={[
                "Analyzing usage patterns to improve our service",
                "Enhancing barcode scanning functionality",
                "Optimizing the user experience",
                "Preventing fraud and maintaining security",
              ]}
            />
          </section>

          <section id="sharing" className="scroll-mt-8">
            <SectionHeading n="03" title="Information sharing" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              We share your information only in the following limited circumstances.
            </p>

            <SubHeading>Payment processing</SubHeading>
            <List
              items={[
                "PayPal receives your email address to process payments",
                "No financial account details are stored on our servers",
              ]}
            />

            <SubHeading>Shipping services</SubHeading>
            <List
              items={[
                "Shipping carriers receive your address for label generation",
                "Package dimensions and weight for shipping calculations",
              ]}
            />

            <SubHeading>Legal requirements</SubHeading>
            <List
              items={[
                "When required by law or legal process",
                "To protect our rights and prevent fraud",
                "In connection with business transfers or mergers",
              ]}
            />

            <div className="mt-6 rounded-xl border-l-4 border-emerald-500 bg-white px-5 py-4 shadow-sm">
              <p className="text-[16px] font-semibold leading-relaxed text-slate-900">
                We do not sell, rent, or trade your personal information to third parties for
                marketing purposes.
              </p>
            </div>
          </section>

          <section id="security" className="scroll-mt-8">
            <SectionHeading n="04" title="Data security" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              We implement appropriate security measures to protect your personal information:
            </p>
            <List
              items={[
                "SSL encryption for all data transmission",
                "Secure data storage with limited access controls",
                "Keeping our platform and dependencies up to date",
                "No storage of complete financial account information",
                "Secure deletion of data when no longer needed",
              ]}
            />
          </section>

          <section id="retention" className="scroll-mt-8">
            <SectionHeading n="05" title="Data retention" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              We retain your information for the following periods:
            </p>

            <dl className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {[
                ["Account information", "As long as your account is active"],
                ["Transaction records", "7 years, for tax and legal compliance"],
                ["Item data", "Until processing is complete and payment is made"],
                ["Support communications", "3 years, for service improvement"],
                ["Technical logs", "90 days, for security and performance monitoring"],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
                  <dt className="w-52 flex-shrink-0 text-sm font-semibold text-slate-500">{label}</dt>
                  <dd className="text-[16px] text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="rights" className="scroll-mt-8">
            <SectionHeading n="06" title="Your rights and choices" />

            <SubHeading>Access and updates</SubHeading>
            <List
              items={[
                "View and update your account information",
                "Correct inaccurate personal data",
                "Update your PayPal email address",
              ]}
            />

            <SubHeading>Data deletion</SubHeading>
            <List
              items={[
                "Request deletion of your account and associated data",
                "Some information may be retained for legal compliance",
              ]}
            />

            <SubHeading>Communication preferences</SubHeading>
            <List
              items={[
                "Opt out of promotional emails — service emails will continue",
                "Choose your preferred communication methods",
              ]}
            />
          </section>

          <section id="cookies" className="scroll-mt-8">
            <SectionHeading n="07" title="Cookies and tracking" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              We use cookies and similar technologies to:
            </p>
            <List
              items={[
                "Remember your login status and preferences",
                "Improve website performance and functionality",
                "Analyze usage patterns for service improvement",
                "Ensure security and prevent fraud",
              ]}
            />
                        <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              Some of these cookies are set by Google Analytics and Google Ads, which we use to
              understand how the site is performing and to measure our advertising. Those cookies are
              governed by Google&rsquo;s own privacy policy.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              You can manage cookie preferences through your browser settings, though some
              functionality may be limited if cookies are disabled.
            </p>
          </section>

          <section id="third-party" className="scroll-mt-8">
            <SectionHeading n="08" title="Third-party services" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              Our platform integrates with the following third-party services:
            </p>
            <List
              items={[
                <>
                  <strong>PayPal</strong> — for payment processing, subject to PayPal&rsquo;s own
                  privacy policy
                </>,
                <>
                  <strong>Shipping carriers</strong> — for label generation and package tracking
                </>,
                                <>
                                <strong>Barcode databases</strong> — for item identification and pricing
                              </>,
                              <>
                                <strong>Google Firebase</strong> — for account authentication and secure storage of
                                your account and order data
                              </>,
                              <>
                                <strong>Google Analytics and Google Ads</strong> — to understand how the site is used
                                and to measure our advertising, subject to Google&rsquo;s own privacy policy
                              </>,
                            ]}
                          />
          </section>

          <section id="children" className="scroll-mt-8">
            <SectionHeading n="09" title="Children's privacy" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              Our service is not intended for children under 18 years of age. We do not knowingly
              collect personal information from children. If you are under 18, please do not use our
              service or provide any personal information.
            </p>
          </section>

          <section id="international" className="scroll-mt-8">
            <SectionHeading n="10" title="International users" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              Our service is primarily designed for users in the United States. If you access our
              service from outside the US, your information may be transferred to and processed in the
              United States, where privacy laws may differ from your jurisdiction.
            </p>
          </section>

          <section id="changes" className="scroll-mt-8">
            <SectionHeading n="11" title="Changes to this policy" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by:
            </p>
            <List
              items={[
                "Posting the updated policy on our website",
                "Sending an email notification to your registered email address",
                "Providing at least 30 days notice for significant changes",
              ]}
            />
          </section>

          <section id="contact" className="scroll-mt-8">
            <SectionHeading n="12" title="Contact us" />
            <p className="mt-4 text-[16px] leading-relaxed text-slate-700">
              If you have questions about this Privacy Policy or your personal information, please
              contact us:
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
                <>
                  Please include <strong>&ldquo;Privacy Policy Question&rdquo;</strong> in your
                  subject line
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
            By using our service, you acknowledge that you have read and understood this Privacy
            Policy and agree to the collection and use of your information as described here.
          </p>
          <Link
            href="/terms"
            className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Terms of service
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
      </div>
    </div>
  );
}