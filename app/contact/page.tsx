"use client";

import { useState } from "react";

// FAQ verilerini ayrı bir dosyadan import etmek daha iyi olur
const faqs = [
  {
    question: "How do I create an account?",
    answer: "You can create an account by clicking on the 'Register' button in the top right corner of our homepage. Fill in your details including name, email address, and password. After submitting, you'll receive a verification email. Click the link in the email to activate your account."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are securely processed through our encrypted payment system."
  },
  {
    question: "How long does shipping take?",
    answer: "Sellers are required to ship items within 3 business days of purchase. Delivery times vary based on the shipping method selected: Standard shipping takes 3-5 business days, while expedited shipping takes 1-2 business days. You'll receive tracking information once your item ships."
  },
  {
    question: "What is your return policy?",
    answer: "You have 3 days from the delivery date to initiate a return for items that are not as described, damaged, or defective. To start a return, contact the seller through your account dashboard. If the seller doesn't resolve the issue within 3 business days, you can escalate to our support team for assistance."
  },
  {
    question: "How do I sell an item?",
    answer: "To sell an item, click the 'Sell Items' button in the header. You'll need to create an account if you haven't already. Then, fill in the item details including title, description, condition, price, and upload clear photos. Set your shipping preferences and list your item. We charge an 8.5% marketplace fee on successful sales."
  },
  {
    question: "How do I track my order?",
    answer: "Once your item ships, you'll receive a tracking number via email. You can also track your order by logging into your account and going to 'My Orders'. Click on the specific order to view tracking information and estimated delivery date."
  },
  {
    question: "What if my item doesn't arrive?",
    answer: "If your item doesn't arrive within the estimated delivery time, first contact the seller through our messaging system. If the seller doesn't resolve the issue or if the item is significantly delayed, you can open a dispute with our support team. We'll investigate and arrange a refund if necessary."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support team by filling out the contact form on this page, emailing us at support@marketplace.com, or calling +1 (555) 123-4567 during business hours (Mon-Fri 9AM-5PM EST). We typically respond to emails within 24 hours."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take the security of your personal information very seriously. We use industry-standard encryption and security measures to protect your data. We never share your payment information with sellers, and we comply with all applicable privacy laws and regulations."
  },
  {
    question: "What are the marketplace fees?",
    answer: "We charge an 8.5% marketplace fee on all successful transactions. This fee is automatically deducted from the seller's payment. There are no hidden fees or charges for buyers. Additional fees may apply for optional services like featured listings or expedited shipping."
  }
];

// FAQ Bileşeni
const FAQItem = ({ 
  question, 
  answer, 
  isOpen, 
  onClick 
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void; 
}) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <button
      className="w-full flex justify-between items-center p-6 text-left font-medium text-lg hover:bg-gray-50 transition"
      onClick={onClick}
    >
      <span>{question}</span>
      <svg
        className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    {isOpen && (
      <div className="p-6 pt-0 bg-gray-50 border-t border-gray-200">
        <p className="text-gray-700">{answer}</p>
      </div>
    )}
  </div>
);

// Sosyal Medya İkonları Bileşeni
const SocialMediaIcons = () => (
  <div className="flex space-x-4">
    <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
    <a href="#" className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    </a>
    <a href="#" className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
      </svg>
    </a>
    <a href="#" className="bg-red-700 text-white p-3 rounded-full hover:bg-red-800 transition">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Email</h3>
          <p className="text-gray-700">support@marketplace.com</p>
          <p className="text-gray-700">info@marketplace.com</p>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Phone</h3>
          <p className="text-gray-700">+1 (555) 123-4567</p>
          <p className="text-gray-700">Mon-Fri 9AM-5PM EST</p>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">Office</h3>
          <p className="text-gray-700">123 Market Street</p>
          <p className="text-gray-700">Suite 100</p>
          <p className="text-gray-700">New York, NY 10001</p>
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

// İletişim Formu Bileşeni
const ContactForm = () => (
  <div>
    <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
    <form className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
        <input
          type="text"
          id="name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your name"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="your.email@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
        <input
          type="text"
          id="subject"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="How can we help?"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
        <textarea
          id="message"
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your message..."
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Send Message
      </button>
    </form>
  </div>
);

// FAQ Bölümü Bileşeni
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
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
            Have questions or feedback? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Back to Home Button */}
      <div className="py-6 bg-white border-b">
        <div className="max-w-4xl mx-auto text-center">
          <a 
            href="/" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
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

      {/* Map Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Find Us</h2>
          <div className="bg-gray-300 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-gray-600">Interactive map will be displayed here</p>
              <p className="text-gray-500 text-sm mt-2">123 Market Street, New York, NY 10001</p>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Back to Home Button - Bottom */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <a 
            href="/" 
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}