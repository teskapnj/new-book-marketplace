'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState('selling');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'selling',
      name: 'Selling Items',
      icon: '💰',
      description: 'Learn how to sell your books, CDs, DVDs, and games',
      articles: [
        { title: 'How to scan and add items', slug: 'scan-items', description: 'Use your phone camera to scan barcodes or search manually' },
        { title: 'Understanding our condition standards', slug: 'condition-guide', description: 'What condition we accept and what we don\'t' },
        { title: 'Getting paid via PayPal', slug: 'paypal-payments', description: 'How and when you receive your payments' },
        { title: 'Shipping your items to us', slug: 'shipping-guide', description: 'Free prepaid labels and packaging instructions' }
      ]
    },
    {
      id: 'account',
      name: 'Account & Profile',
      icon: '👤',
      description: 'Manage your account settings and information',
      articles: [
        { title: 'Creating your seller account', slug: 'create-account', description: 'Sign up and set up your profile' },
        { title: 'Updating your PayPal information', slug: 'update-paypal', description: 'Change your payment details safely' },
        { title: 'Managing your shipping address', slug: 'shipping-address', description: 'Update where we send shipping labels' },
        { title: 'Account security and privacy', slug: 'account-security', description: 'Keep your account safe and secure' }
      ]
    },
    {
      id: 'process',
      name: 'Our Process',
      icon: '🔄',
      description: 'How we handle your items from receipt to payment',
      articles: [
        { title: 'What happens after you ship', slug: 'after-shipping', description: 'Our inspection and payment process' },
        { title: 'Why some items aren\'t accepted', slug: 'rejected-items', description: 'Understanding our quality standards' },
        { title: 'Payment timeline and processing', slug: 'payment-timeline', description: 'When to expect your PayPal payment' },
        { title: 'Items that go to recycling', slug: 'recycling-policy', description: 'What happens to non-qualifying items' }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Support',
      icon: '🔧',
      description: 'Help with scanning, searching, and technical issues',
      articles: [
        { title: 'Barcode scanning troubleshooting', slug: 'barcode-issues', description: 'Fix common camera and scanning problems' },
        { title: 'Manual search and Amazon ASIN', slug: 'manual-search', description: 'Alternative ways to find your items' },
        { title: 'Browser and device compatibility', slug: 'compatibility', description: 'Supported devices and browsers' },
        { title: 'Account login problems', slug: 'login-issues', description: 'Resolve sign-in difficulties' }
      ]
    }
  ];

  const quickHelp = [
    { 
      question: 'How do I start selling?', 
      answer: 'Simply scan your first item using your phone camera or search manually. If we accept it, it will appear in your list.',
      category: 'selling' 
    },
    { 
      question: 'What condition do you accept?', 
      answer: 'We only accept items in very good condition with no writing, highlighting, or damage. Check our condition guide.',
      category: 'selling' 
    },
    { 
      question: 'How do I get paid?', 
      answer: 'Payment is sent to your PayPal account after we inspect and approve your items.',
      category: 'process' 
    },
    { 
      question: 'Do you return rejected items?', 
      answer: 'No, we do not return items. Non-qualifying items are responsibly recycled.',
      category: 'process' 
    },
    { 
      question: 'How long until I get shipping labels?', 
      answer: 'You\'ll receive prepaid shipping labels via email within 24 hours of submission.',
      category: 'selling' 
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  const filteredQuickHelp = quickHelp.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to your questions about selling books, CDs, DVDs, and games
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full py-4 px-6 pr-12 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Quick Help Section */}
        {searchQuery === '' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Answers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickHelp.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">{item.question}</h3>
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Results */}
            {searchQuery !== '' && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  Search Results for "{searchQuery}"
                </h2>
                
                {filteredCategories.length === 0 && filteredQuickHelp.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try different keywords or browse our categories below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Quick Help Results */}
                    {filteredQuickHelp.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold mb-4">Quick Answers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredQuickHelp.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-medium mb-2">{item.question}</h4>
                              <p className="text-gray-600 text-sm">{item.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Article Results */}
                    {filteredCategories.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                          <span className="text-xl mr-2">{category.icon}</span>
                          {category.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.articles.map((article, index) => (
                            <div
                              key={index}
                              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition cursor-pointer"
                            >
                              <h4 className="font-medium mb-1">{article.title}</h4>
                              <p className="text-gray-600 text-sm">{article.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Category */}
            {searchQuery === '' && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <span className="text-2xl">{categories.find(c => c.id === activeCategory)?.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {categories.find(c => c.id === activeCategory)?.name}
                    </h2>
                    <p className="text-gray-600">
                      {categories.find(c => c.id === activeCategory)?.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories
                    .find(c => c.id === activeCategory)
                    ?.articles.map((article, index) => (
                      <div
                        key={index}
                        className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition cursor-pointer"
                      >
                        <h3 className="font-medium text-lg mb-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{article.description}</p>
                        <p className="text-blue-600 text-sm font-medium">Learn more →</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Still Need Help?</h2>
              <p className="text-gray-600 mb-8">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Contact Support</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    Have a question? Send us a message and we'll respond within 24 hours.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Important Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold mb-4">Important Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/condition-guidelines" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                    <span className="text-lg mr-3">📋</span>
                    <div>
                      <h4 className="font-medium">Condition Guidelines</h4>
                      <p className="text-gray-600 text-sm">What we accept and reject</p>
                    </div>
                  </Link>
                  <Link href="/returns-policy" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                    <span className="text-lg mr-3">🔄</span>
                    <div>
                      <h4 className="font-medium">Return Policy</h4>
                      <p className="text-gray-600 text-sm">No returns - recycling policy</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}