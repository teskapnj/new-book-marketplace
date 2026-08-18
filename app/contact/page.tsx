"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import DOMPurify from "isomorphic-dompurify";

// ---------------------------------------------------------------------------
// Iletisim formu - Firebase kaydi. Mantik degismedi.
// ---------------------------------------------------------------------------
function ContactForm() {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Girdi temizleme + alan bazli uzunluk siniri
    let sanitizedValue = DOMPurify.sanitize(value);

    if (name === "name") {
      sanitizedValue = sanitizedValue.substring(0, 100);
    } else if (name === "email") {
      sanitizedValue = sanitizedValue.substring(0, 254);
    } else if (name === "subject") {
      sanitizedValue = sanitizedValue.substring(0, 200);
    } else if (name === "message") {
      sanitizedValue = sanitizedValue.substring(0, 1000);
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Kullanici yazmaya baslayinca eski uyari temizlenir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const messagesRef = collection(db, "contact_messages");

      await addDoc(messagesRef, {
        name: DOMPurify.sanitize(formData.name).substring(0, 100),
        email: DOMPurify.sanitize(formData.email).substring(0, 254),
        subject: DOMPurify.sanitize(formData.subject).substring(0, 200),
        message: DOMPurify.sanitize(formData.message).substring(0, 1000),
        status: "unread",
        createdAt: serverTimestamp(),
        userId: user?.uid || null,
        userAgent: DOMPurify.sanitize(navigator.userAgent).substring(0, 500),
        replied: false,
        source: "contact_page",
      });

      setSubmitStatus({
        type: "success",
        message:
          "Thanks — your message is with us. We'll reply by email within 24 hours.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error submitting message:", error);
      }
      setSubmitStatus({
        type: "error",
        message: "Couldn't send your message. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full rounded-lg border px-4 py-3 text-base text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-slate-900">Send us a message</h2>

      {submitStatus && (
        <div
          className={`mt-5 rounded-lg border-l-4 p-4 ${
            submitStatus.type === "success"
              ? "border-emerald-500 bg-emerald-50"
              : "border-rose-500 bg-rose-50"
          }`}
        >
          <p
            className={`text-[15px] font-medium ${
              submitStatus.type === "success" ? "text-emerald-800" : "text-rose-800"
            }`}
          >
            {submitStatus.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`${inputBase} ${errors.name ? "border-rose-500" : "border-slate-300"}`}
            placeholder="Your name"
            disabled={isSubmitting}
          />
          {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${inputBase} ${errors.email ? "border-rose-500" : "border-slate-300"}`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`${inputBase} ${errors.subject ? "border-rose-500" : "border-slate-300"}`}
            placeholder="What's this about?"
            disabled={isSubmitting}
          />
          {errors.subject && <p className="mt-1 text-sm text-rose-600">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className={`${inputBase} resize-none ${
              errors.message ? "border-rose-500" : "border-slate-300"
            }`}
            placeholder="Tell us what you need — the more detail, the faster we can help."
            disabled={isSubmitting}
            maxLength={1000}
          />
          {errors.message && <p className="mt-1 text-sm text-rose-600">{errors.message}</p>}
          <p className="mt-1 text-sm text-slate-500">
            {formData.message.length}/1000 characters, minimum 10
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3.5 px-6 text-base font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sending
            </>
          ) : (
            "Send message"
          )}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===================== BASLIK BANDI ===================== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.25),transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-200 transition-colors hover:text-white"
          >
            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Contact
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Get in touch
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-blue-100">
            Questions about an order, an item, or how any of this works? Send us a message and
            we&rsquo;ll reply within 24 hours.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-5 md:items-start">
          {/* Form */}
          <div className="md:col-span-3">
            <ContactForm />
          </div>

          {/* Yan bilgi */}
          <div className="space-y-4 md:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-slate-900">Email us directly</h2>
              <a
                href="mailto:support@sellbookmedia.com"
                className="mt-2 block break-words font-medium text-blue-600 hover:text-blue-700"
              >
                support@sellbookmedia.com
              </a>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                Either way reaches the same inbox. We answer within 24 hours.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-slate-900">When we&rsquo;re around</h2>
              <dl className="mt-3 space-y-2 text-[15px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Mon &ndash; Fri</dt>
                  <dd className="font-medium text-slate-800">9AM &ndash; 5PM EST</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Saturday</dt>
                  <dd className="font-medium text-slate-800">10AM &ndash; 2PM EST</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Sunday</dt>
                  <dd className="font-medium text-slate-800">Closed</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-slate-900">Faster than asking</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                Most questions are already answered on these pages.
              </p>
              <ul className="mt-4 space-y-2 text-[15px]">
                {[
                  { href: "/help", label: "Help center" },
                  { href: "/condition-guidelines", label: "Condition guidelines" },
                  { href: "/returns-policy", label: "Returns policy" },
                  { href: "/seller-guide", label: "Seller guide" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
                    >
                      {link.label}
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- CTA ---------- */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-10 text-center sm:px-10">
          <h2 className="font-serif text-2xl font-bold text-white">
            Just want to see what your items are worth?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-blue-100">
            Scan a barcode and get an instant offer. No account required to start.
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