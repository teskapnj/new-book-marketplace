'use client';

import { NextPage } from 'next';
import Link from 'next/link';

const ReturnsPolicyPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Geri Dön
          </button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Return Policy & Product Condition Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please carefully review our condition guide before sending your products to us.
            Items that don't meet our standards will not be paid for and will be sent for recycling.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-8">
            {/* Critical Warning Section */}
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800 mb-2">
                    IMPORTANT: Please DO NOT send products without reviewing our condition guide!
                  </h3>
                  <p className="text-red-700">
                    Items that do not meet our condition standards will not be paid for and will be sent directly to recycling.
                    We do not offer returns - please ensure your items meet our criteria before shipping.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Policy Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Policy</h2>
              
              <div className="prose prose-lg text-gray-600 mb-8">
                <p className="mb-4">
                  We <strong>do not accept returns</strong> of any kind. All items sent to us are processed according to our strict condition standards.
                </p>
                <p className="mb-4">
                  Items that meet our condition guide will be processed for payment. Items that do not meet our standards will:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li><strong>Not be paid for</strong></li>
                  <li><strong>Be sent directly to recycling</strong> - they will not be returned to you</li>
                  <li>Result in no compensation to the sender</li>
                </ul>
                <p>
                  By sending us your items, you acknowledge and accept this policy.
                </p>
              </div>

              {/* Condition Standards */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">General Condition Standards</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-5 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-3 flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Acceptable Conditions
                    </h4>
                    <ul className="space-y-2 text-green-700 text-sm">
                      <li>• Items in good working condition</li>
                      <li>• Minor wear from normal use</li>
                      <li>• Complete with original components (cases, covers, manuals)</li>
                      <li>• Clean and odor-free</li>
                      <li>• Fully functional without defects</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-5 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-3 flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Unacceptable Conditions (Will Be Recycled)
                    </h4>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• Any writing, highlighting, or marker stains</li>
                      <li>• Pen marks, underlining, or annotations</li>
                      <li>• Damaged, broken, or non-functional items</li>
                      <li>• Water damage, stains, or mold</li>
                      <li>• Strong odors (smoke, mildew, etc.)</li>
                      <li>• Missing essential components</li>
                      <li>• Excessive wear that affects functionality</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Inspection Process */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">What Happens When We Receive Your Items</h3>
                <div className="text-blue-700">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li><strong>Inspection:</strong> All items are thoroughly inspected against our condition standards</li>
                    <li><strong>Sorting:</strong> Items are separated into "acceptable" and "unacceptable" categories</li>
                    <li><strong>Payment:</strong> Only items meeting our standards are processed for payment</li>
                    <li><strong>Recycling:</strong> Items that don't meet standards are sent directly to recycling facilities</li>
                    <li><strong>Final Processing:</strong> No items are returned to senders under any circumstances</li>
                  </ol>
                </div>
              </div>

              {/* Final Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-yellow-800 mb-2">
                      Final Reminder
                    </h4>
                    <p className="text-yellow-700">
                      Once you ship your items to us, you cannot get them back. Items that don't meet our condition guide will be recycled, not returned. 
                      Please be absolutely certain your items meet our standards before shipping.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Questions About Our Policy?</h3>
              <p className="text-gray-600 mb-6">
                If you're unsure whether your items meet our condition standards, 
                please contact our support team before shipping to avoid disappointment.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicyPage;