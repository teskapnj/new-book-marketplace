"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import DOMPurify from 'isomorphic-dompurify';

// Sosyal Medya İkonları Bileşeni
const SocialMediaIcons = () => (
  <div className="flex space-x-4">
    <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </a>
    <a href="#" className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    </a>
    <a href="#" className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
      </svg>
    </a>
    <a href="#" className="bg-red-700 text-white p-3 rounded-full hover:bg-red-800 transition">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    </a>
  </div>
);

// İletişim Bilgileri Bileşeni
const ContactInfo = () => (
  <div>
    <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
    <div className="space-y-6">
      <div className="flex items-start">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Internal Messaging</h3>
          <p className="text-gray-700">Send us a message through our contact form</p>
          <p className="text-gray-700">We typically respond within 24 hours</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Email</h3>
          <p className="text-gray-700">support@sellbookmedia.com</p>
          <p className="text-gray-700">We respond within 24 hours</p>
        </div>
      </div>

      <div className="flex items-start">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Business Hours</h3>
          <p className="text-gray-700">Monday - Friday: 9AM - 5PM EST</p>
          <p className="text-gray-700">Saturday: 10AM - 2PM EST</p>
          <p className="text-gray-700">Sunday: Closed</p>
        </div>
      </div>
    </div>

    <div className="mt-10">
      <h3 className="font-bold text-lg mb-4">Follow Us</h3>
      <SocialMediaIcons />
    </div>
  </div>
);

// İletişim Formu Bileşeni - Firebase Entegrasyon
const ContactForm = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // GÜVENLİ
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Input sanitization ve field-specific validation
    let sanitizedValue = DOMPurify.sanitize(value);

    // Field-specific length limits
    if (name === 'name') {
      sanitizedValue = sanitizedValue.substring(0, 100);
    } else if (name === 'email') {
      sanitizedValue = sanitizedValue.substring(0, 254);
    } else if (name === 'subject') {
      sanitizedValue = sanitizedValue.substring(0, 200);
    } else if (name === 'message') {
      sanitizedValue = sanitizedValue.substring(0, 1000);
    }

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Firebase'e mesaj kaydet
      const messagesRef = collection(db, "contact_messages");

      // GÜVENLİ
      await addDoc(messagesRef, {
        name: DOMPurify.sanitize(formData.name).substring(0, 100),
        email: DOMPurify.sanitize(formData.email).substring(0, 254),
        subject: DOMPurify.sanitize(formData.subject).substring(0, 200),
        message: DOMPurify.sanitize(formData.message).substring(0, 1000),
        status: 'unread',
        createdAt: serverTimestamp(),
        userId: user?.uid || null,
        userAgent: DOMPurify.sanitize(navigator.userAgent).substring(0, 500),
        replied: false,
        source: 'contact_page'
      });

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! Our team will review it and respond through our internal messaging system within 24 hours.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error submitting message:", error);
      }
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Send us a message</h2>

      {/* Success/Error Messages */}
      {submitStatus && (
        <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
          <div className="flex items-center">
            {submitStatus.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{submitStatus.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Your name"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="How can we help?"
            disabled={isSubmitting}
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Your message..."
            disabled={isSubmitting}
            maxLength={1000}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          <p className="text-gray-500 text-sm mt-1">
            {formData.message.length}/1000 characters (minimum 10)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium transition ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending message...
            </div>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
};

// Ana Sayfa Bileşeni
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you. Send us a message through our internal messaging system.
          </p>
        </div>
      </section>

      {/* Back to Home Button */}
      <div className="py-6 bg-white border-b">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Contact Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-bold">John Doe</h4>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &ldquo;Great customer service! They responded to my message within a few hours and resolved my issue quickly.&rdquo;
              </p>
              <div className="flex items-center mt-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="text-gray-600 text-sm ml-2">5.0</span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">SM</span>
                </div>
                <div>
                  <h4 className="font-bold">Sarah Miller</h4>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &ldquo;The internal messaging system makes communication so easy. No need for external emails!&rdquo;
              </p>
              <div className="flex items-center mt-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="text-gray-600 text-sm ml-2">5.0</span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">MJ</span>
                </div>
                <div>
                  <h4 className="font-bold">Mike Johnson</h4>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &ldquo;Professional and responsive support team. They helped me understand the platform better.&rdquo;
              </p>
              <div className="flex items-center mt-4">
                <div className="flex text-yellow-400">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="text-gray-600 text-sm ml-2">5.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home Button - Bottom */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}