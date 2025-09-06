// /app/returns-policy/page.tsx
'use client';

import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

const ReturnsPolicyPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'books' | 'cds' | 'dvds' | 'games'>('books');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Return Policy & Condition Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            To preserve the value of your second-hand items and ensure customer satisfaction, 
            please carefully review our condition guide before sending your products to us.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-8">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Return Policy</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important Notice:</strong> Unfortunately, we cannot accept items that do not meet our condition guide. 
                      Such items will be returned to the sender. Please review our condition guide carefully before shipping your items.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-lg text-gray-600">
                <p>
                  The second-hand items you offer for sale on our platform (books, CDs, DVDs, games) 
                  must meet specific standards. These standards are crucial for preserving the value of the items 
                  and meeting buyer expectations.
                </p>
                <p>
                  Your shipped items will be inspected by our expert team based on the criteria outlined below. 
                  Items that do not comply with our condition guide will not be paid for and will be returned to you. 
                  In such cases, the sender is responsible for any shipping costs incurred.
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Item Condition Guide</h2>
              
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('books')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'books' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Books
                  </button>
                  <button
                    onClick={() => setActiveTab('cds')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'cds' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    CDs
                  </button>
                  <button
                    onClick={() => setActiveTab('dvds')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dvds' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    DVDs
                  </button>
                  <button
                    onClick={() => setActiveTab('games')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'games' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Game Discs
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="bg-gray-50 rounded-xl p-6">
                {/* Books Tab */}
                {activeTab === 'books' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">Book Condition Standards</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-5 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-3">Acceptable Conditions</h4>
                        <ul className="space-y-2 text-green-700">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Read but well-cared for</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Minor wear on cover and pages</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Slight yellowing of pages (age-related)</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Minimal writing or notes (less than 10% of pages)</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Library stickers (removable)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 p-5 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-3">Unacceptable Conditions</h4>
                        <ul className="space-y-2 text-red-700">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Water damage, stained or moldy pages</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Torn, ripped, or missing pages</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Detached front or back cover</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Extensive writing, notes, or highlighting</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Strong odors (smoke, mildew, etc.)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* CDs Tab */}
                {activeTab === 'cds' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">CD Condition Standards</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-5 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-3">Acceptable Conditions</h4>
                        <ul className="space-y-2 text-green-700">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Disc plays perfectly without skipping</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Minor surface scuffs or hairline scratches</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Original case with minor wear</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Inserts/liner notes included (may have minor wear)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 p-5 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-3">Unacceptable Conditions</h4>
                        <ul className="space-y-2 text-red-700">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Deep scratches that affect playback</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cracked or badly damaged disc</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Warped or misshapen disc</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Broken or cracked jewel case</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Missing original artwork or inserts</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* DVDs Tab */}
                {activeTab === 'dvds' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">DVD Condition Standards</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-5 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-3">Acceptable Conditions</h4>
                        <ul className="space-y-2 text-green-700">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Disc plays perfectly without freezing or skipping</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Minor surface scuffs or hairline scratches</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Original case with minor wear</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Inserts/cover art included (may have minor wear)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 p-5 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-3">Unacceptable Conditions</h4>
                        <ul className="space-y-2 text-red-700">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Deep scratches that affect playback</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cracked or badly damaged disc</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Warped or misshapen disc</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Broken or cracked case</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Missing original artwork or inserts</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Games Tab */}
                {activeTab === 'games' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">Game Disc Condition Standards</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-5 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-3">Acceptable Conditions</h4>
                        <ul className="space-y-2 text-green-700">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Disc plays perfectly without errors</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Minor surface scuffs or hairline scratches</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Original case with minor wear</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Manual included (may have minor wear)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 p-5 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-3">Unacceptable Conditions</h4>
                        <ul className="space-y-2 text-red-700">
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Deep scratches that affect gameplay</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Cracked or badly damaged disc</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Warped or misshapen disc</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Broken or cracked case</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>Missing manual or essential inserts</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-10">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">Our Inspection Process</h3>
              <div className="text-blue-700">
                <p className="mb-3">
                  When we receive your items, they undergo a thorough inspection process:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Items are checked against our condition guide standards</li>
                  <li>Discs are tested for playback quality</li>
                  <li>Books are inspected for damage, writing, and odors</li>
                  <li>Cases and artwork are checked for completeness and condition</li>
                  <li>Items that meet our standards are processed for payment</li>
                  <li>Items that do not meet our standards are set aside for return</li>
                </ol>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Have Questions?</h3>
              <p className="text-gray-600 mb-6">
                If you're unsure about the condition of your items or have any questions about our policy, 
                please don't hesitate to contact our support team before shipping.
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