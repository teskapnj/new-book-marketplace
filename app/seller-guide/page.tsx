'use client';

import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

const SellerGuidePage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Scan & Add Items",
      icon: "📱",
      description: "Use your phone to scan barcodes or search manually"
    },
    {
      id: 2,
      title: "Enter Your Details",
      icon: "📝",
      description: "Provide your contact and payment information"
    },
    {
      id: 3,
      title: "Get Shipping Labels",
      icon: "📦",
      description: "Receive a prepaid label once your bundle is approved"
    },
    {
      id: 4,
      title: "Ship & Get Paid",
      icon: "💰",
      description: "Send your items and receive payment"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button + Nav Links */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Home
          </Link>

          <Link
            href="/create-listing"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-700"
          >
            Start Scanning
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Seller Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sell your books, CDs, DVDs, and games in four easy steps. 
            Follow this guide to get started and receive payment quickly.
          </p>
        </div>

        {/* Process Overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div 
                  onClick={() => setActiveStep(step.id)}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 ${
                    activeStep === step.id 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-4xl mb-3 ${activeStep === step.id ? 'scale-110' : ''} transition-transform duration-200`}>
                      {step.icon}
                    </div>
                    <div className={`w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold ${
                      activeStep === step.id ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                      {step.id}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-12">
          
          {/* Step 1: Scan & Add Items */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-500 text-white p-6">
              <div className="flex items-center">
                <span className="text-3xl mr-4">📱</span>
                <div>
                  <h2 className="text-2xl font-bold">Step 1: Scan & Add Items</h2>
                  <p className="text-blue-100">Use your phone camera to scan barcodes or search manually</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Scanning Methods</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">📷 Camera Scan (Recommended)</h4>
                      <p className="text-gray-600 text-sm">Point your phone camera at the barcode (ISBN/UPC) and we'll automatically identify your item.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">🔍 Manual Search</h4>
                      <p className="text-gray-600 text-sm">Type the title, author, or barcode number to search our database.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">🏷️ Amazon ASIN</h4>
                      <p className="text-gray-600 text-sm">Enter the Amazon ASIN number if available for quick identification.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What We Accept</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-800 mb-2">✅ Accepted Items</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Books (Fiction, Non-fiction, Textbooks)</li>
                      <li>• Music CDs</li>
                      <li>• DVD Movies</li>
                      <li>• Video Games (All platforms)</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">📋 Quick Tips</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Items appear in your list only if we accept them</li>
                      <li>• If an item doesn't appear, we don't currently buy it</li>
                      <li>• Check our condition guide before adding items</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Enter Details */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-green-500 text-white p-6">
              <div className="flex items-center">
                <span className="text-3xl mr-4">📝</span>
                <div>
                  <h2 className="text-2xl font-bold">Step 2: Enter Your Details</h2>
                  <p className="text-green-100">Provide your information for payment and shipping</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Required Information</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">👤 Personal Details</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Full Name (First &amp; Last)</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">💳 Payment Information</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• PayPal Account Email</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">📍 Shipping Address</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Complete Street Address</li>
                        <li>• City, State, ZIP Code</li>
                        <li>• Country</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Package Information</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">📦 Package Details</h4>
                    <p className="text-blue-700 text-sm mb-2">Provide accurate measurements for proper shipping labels:</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Package Weight (up to 50 lbs)</li>
                      <li>• Length, Width, Height (up to 18&quot; x 16&quot; x 16&quot;)</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Notes</h4>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Double-check your PayPal email address</li>
                      <li>• Accurate package dimensions are crucial</li>
                      <li>• All fields are required to proceed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Get Shipping Labels */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-purple-500 text-white p-6">
              <div className="flex items-center">
                <span className="text-3xl mr-4">📦</span>
                <div>
                  <h2 className="text-2xl font-bold">Step 3: Get Shipping Labels</h2>
                  <p className="text-purple-100">Receive a prepaid shipping label once your bundle is approved</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">After Submission</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-medium text-gray-800">Confirmation Email</h4>
                        <p className="text-gray-600 text-sm">You'll receive an immediate confirmation that we've received your submission.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-medium text-gray-800">We Review Your Bundle</h4>
                        <p className="text-gray-600 text-sm">Our team reviews your submitted items, typically within 24 hours.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-medium text-gray-800">Label Sent If Approved</h4>
                        <p className="text-gray-600 text-sm">Once approved, you'll receive an email with your free prepaid shipping label.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Included</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-800 mb-2">📄 Shipping Package</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Prepaid shipping label (PDF format)</li>
                      <li>• Packing instructions</li>
                      <li>• Tracking information setup</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">💡 Pro Tips</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Print labels on standard 8.5" x 11" paper</li>
                      <li>• Use clear tape to secure labels</li>
                      <li>• Keep confirmation emails for your records</li>
                      <li>• Check your spam/junk folder if you don't see it</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Ship & Get Paid */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-orange-500 text-white p-6">
              <div className="flex items-center">
                <span className="text-3xl mr-4">💰</span>
                <div>
                  <h2 className="text-2xl font-bold">Step 4: Ship & Get Paid</h2>
                  <p className="text-orange-100">Package your items and receive payment after inspection</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Packaging & Shipping</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">📦 Packing Instructions</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Use a sturdy box or padded envelope</li>
                        <li>• Include all items from your submission</li>
                        <li>• No extra packing materials needed inside</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">🚚 Shipping Process</h4>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• Attach the prepaid label securely</li>
                        <li>• Drop off at designated shipping location</li>
                        <li>• Keep tracking number for reference</li>
                        <li>• No shipping costs - completely free!</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Process</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-green-800 mb-2">💳 How You Get Paid</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Items inspected upon arrival</li>
                      <li>• Qualifying items processed for payment</li>
                      <li>• Payment sent to your PayPal account</li>
                      <li>• Email confirmation with payment details</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">⚠️ Important Reminders</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Only items meeting our condition guide are paid</li>
                      <li>• Non-qualifying items are recycled (not returned)</li>
                      <li>• No payment for items that don't meet standards</li>
                      <li>• Review condition guide before shipping</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "How long does the entire process take?",
                answer: "After you submit your bundle, our team reviews it within 24 hours. Once approved and we receive your shipped items, payment is typically sent within 2 business days."
              },
              {
                question: "What if some of my items aren't accepted?",
                answer: "Only qualifying items receive payment. Non-qualifying items are responsibly recycled."
              },
              {
                question: "Can I track my package?",
                answer: "Yes! Your prepaid shipping label includes tracking information that you can monitor online."
              },
              {
                question: "What if I made a mistake in my submission?",
                answer: "Contact our support team as soon as possible. Changes may be possible before your shipping label is generated."
              },
              {
                question: "Are there any shipping fees?",
                answer: "No, shipping is completely free — we email you a prepaid label once your bundle is approved."
              },
              {
                question: "What payment methods do you offer?",
                answer: "Currently, we only offer PayPal payments for fast and secure transactions."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
           ))}
           </div>
         </div>
 
         {/* Bottom CTA */}
         <div className="mt-16 text-center">
           <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start?</h2>
           <p className="text-gray-600 mb-6">Scan your first item and get an instant cash offer.</p>
           <div className="flex flex-wrap justify-center gap-4">
             <Link
               href="/create-listing"
               className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition font-medium"
             >
               Start Scanning
             </Link>
             <Link
               href="/"
               className="inline-flex items-center justify-center bg-white text-gray-700 border border-gray-300 py-3 px-8 rounded-lg hover:bg-gray-50 transition font-medium"
             >
               Back to Home
             </Link>
           </div>
         </div>
       </div>
     </div>
   );
 };

export default SellerGuidePage;