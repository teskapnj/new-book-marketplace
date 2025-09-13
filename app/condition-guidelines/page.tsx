'use client';

import Link from "next/link";

export default function ConditionGuidelines() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        <div className="mb-8 flex flex-wrap gap-3 justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          
          <Link href="/">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Product Condition Guidelines
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We only accept items in <strong>very good condition</strong>.
            Please review these simple criteria carefully before sending your items.
          </p>
        </div>

        {/* Main Guidelines */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-8">

            {/* Quality Standard */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">
                    Our Quality Standard: VERY GOOD CONDITION
                  </h3>
                  <p className="text-blue-700">
                    All items must be in very good condition with minimal wear from normal use only.
                  </p>
                </div>
              </div>
            </div>

            {/* Unified Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

              {/* What We Accept */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  What We Accept
                </h3>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✓</span>
                    <span>Items that play/function perfectly without issues</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✓</span>
                    <span>Minor surface wear or light scuffs that don't affect function</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✓</span>
                    <span>Original case/cover with minor wear acceptable</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✓</span>
                    <span>Complete with all original inserts, artwork, and manuals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✓</span>
                    <span>Clean, readable, and odor-free</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✓</span>
                    <span>removable Price stickers </span>
                  </li>
                </ul>
              </div>

              {/* What We Don't Accept */}
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                  <svg className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  What We Don't Accept
                </h3>
                <ul className="space-y-3 text-red-700">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✗</span>
                    <span><strong>Any writing, highlighting, underlining, or annotations</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✗</span>
                    <span><strong>Deep scratches that affect playback/reading</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✗</span>
                    <span>Cracked, broken, or badly damaged items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✗</span>
                    <span>Water damage, stains, mold, or warped items</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✗</span>
                    <span>Missing original case, cover art, inserts, or manuals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✗</span>
                    <span>Strong odors (smoke, mildew, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">✗</span>
                    <span>Ex-library books, promotional copies, or bootleg items</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Special Emphasis */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-yellow-800 mb-2">
                    Important: No Writing or Markings
                  </h4>
                  <p className="text-yellow-700">
                    We do not accept any items with writing, highlighting, underlining, marker stains, or any kind of markings.
                    This is strictly enforced for all product categories.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Product Categories We Accept</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Books', icon: '📚' },
                  { name: 'CDs', icon: '💿' },
                  { name: 'DVDs', icon: '📀' },
                  { name: 'Games', icon: '🎮' }
                ].map((category) => (
                  <div key={category.name} className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="font-medium text-gray-800">{category.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Process */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Simple Process</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                  <span>Check your items against our condition guide</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                  <span>Send only items in very good condition</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                  <span>We inspect and pay for qualifying items</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
                  <span>Non-qualifying items are recycled (not returned)</span>
                </div>
              </div>
            </div>

            {/* Final Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-lg font-medium text-red-800 mb-2">
                    Remember: No Returns!
                  </h4>
                  <p className="text-red-700">
                    Items that don't meet our very good condition standard will be recycled and not returned to you.
                    Please check your items carefully before sending.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Questions About Item Condition?</h3>
          <p className="text-gray-600 mb-6">
            If you're unsure whether your items meet our very good condition standard,
            please contact us before sending them.
          </p>
          <Link href="/contact">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}