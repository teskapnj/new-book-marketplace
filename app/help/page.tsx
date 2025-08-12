"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchIcon, BookOpenIcon, UserIcon, ShoppingCartIcon, CreditCardIcon, TruckIcon, ChatIcon, MailIcon, PhoneIcon } from "./icons";

export default function HelpCenterPage() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: BookOpenIcon,
      description: "Learn the basics of using our marketplace",
      articles: [
        { title: "How to create an account", slug: "create-account" },
        { title: "Setting up your profile", slug: "setup-profile" },
        { title: "Navigating the marketplace", slug: "navigation" },
        { title: "Understanding user roles", slug: "user-roles" }
      ]
    },
    {
      id: "account",
      name: "Account Management",
      icon: UserIcon,
      description: "Manage your account settings and preferences",
      articles: [
        { title: "Updating your profile", slug: "update-profile" },
        { title: "Changing your password", slug: "change-password" },
        { title: "Managing notifications", slug: "manage-notifications" },
        { title: "Account security", slug: "account-security" }
      ]
    },
    {
      id: "orders",
      name: "Orders",
      icon: ShoppingCartIcon,
      description: "Everything about buying and tracking orders",
      articles: [
        { title: "How to place an order", slug: "place-order" },
        { title: "Tracking your order", slug: "track-order" },
        { title: "Order status explained", slug: "order-status" },
        { title: "Canceling an order", slug: "cancel-order" },
        { title: "Returns and refunds", slug: "returns-refunds" }
      ]
    },
    {
      id: "payments",
      name: "Payments",
      icon: CreditCardIcon,
      description: "Payment methods and billing information",
      articles: [
        { title: "Accepted payment methods", slug: "payment-methods" },
        { title: "Adding a payment method", slug: "add-payment" },
        { title: "Understanding fees", slug: "understanding-fees" },
        { title: "Billing issues", slug: "billing-issues" }
      ]
    },
    {
      id: "shipping",
      name: "Shipping",
      icon: TruckIcon,
      description: "Shipping options and delivery information",
      articles: [
        { title: "Shipping options", slug: "shipping-options" },
        { title: "Packaging guidelines", slug: "packaging" },
        { title: "International shipping", slug: "international-shipping" },
        { title: "Shipping delays", slug: "shipping-delays" }
      ]
    },
    {
      id: "selling",
      name: "Selling",
      icon: BookOpenIcon,
      description: "Learn how to sell on our marketplace",
      articles: [
        { title: "Becoming a seller", slug: "become-seller" },
        { title: "Listing your first item", slug: "first-item" },
        { title: "Pricing your items", slug: "pricing-items" },
        { title: "Managing your inventory", slug: "inventory" },
        { title: "Seller fees", slug: "seller-fees" }
      ]
    }
  ];

  const popularArticles = [
    { title: "How do I reset my password?", category: "account", slug: "reset-password" },
    { title: "What is your return policy?", category: "orders", slug: "return-policy" },
    { title: "How long does shipping take?", category: "shipping", slug: "shipping-time" },
    { title: "How do I become a seller?", category: "selling", slug: "become-seller" },
    { title: "What payment methods do you accept?", category: "payments", slug: "payment-methods" }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: ChatIcon,
      action: "Start Chat",
      available: true
    },
    {
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      icon: MailIcon,
      action: "Send Email",
      available: true
    },
    {
      title: "Phone Support",
      description: "Call us for immediate assistance",
      icon: PhoneIcon,
      action: "Call Now",
      available: false,
      hours: "Mon-Fri 9AM-5PM EST"
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Find answers to your questions and get the support you need
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full py-4 px-6 pr-12 rounded-lg text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home Button */}
      <div className="py-6 bg-white border-b">
        <div className="max-w-6xl mx-auto text-center">
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

      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      activeCategory === category.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className="flex items-center">
                      <category.icon className="w-5 h-5 mr-3" />
                      <span>{category.name}</span>
                    </div>
                  </button>
                ))}
              </nav>

              {/* Popular Articles */}
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Popular Articles</h3>
                <ul className="space-y-3">
                  {popularArticles.map((article, index) => (
                    <li key={index}>
                      <Link 
                        href={`/help/${article.category}/${article.slug}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Selected Category */}
            {searchQuery === "" && (
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    {categories.find(c => c.id === activeCategory)?.icon({ className: "w-8 h-8 text-blue-600" })}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories
                    .find(c => c.id === activeCategory)
                    ?.articles.map((article, index) => (
                      <Link
                        key={index}
                        href={`/help/${activeCategory}/${article.slug}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
                      >
                        <h3 className="font-medium text-lg mb-1">{article.title}</h3>
                        <p className="text-gray-600 text-sm">Learn more →</p>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery !== "" && (
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  Search Results for "{searchQuery}"
                </h2>
                
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      We couldn't find any articles matching your search. Try different keywords or browse our categories.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredCategories.map((category) => (
                      <div key={category.id}>
                        <h3 className="text-lg font-bold mb-3 flex items-center">
                          <category.icon className="w-5 h-5 mr-2 text-blue-600" />
                          {category.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.articles.map((article, index) => (
                            <Link
                              key={index}
                              href={`/help/${category.id}/${article.slug}`}
                              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
                            >
                              <h4 className="font-medium mb-1">{article.title}</h4>
                              <p className="text-gray-600 text-sm">Learn more →</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">Still need help?</h2>
              <p className="text-gray-600 mb-8">
                Our support team is ready to help you with any questions or issues you might have.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactOptions.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg mr-3 ${
                        option.available ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        <option.icon className={`w-6 h-6 ${
                          option.available ? "text-blue-600" : "text-gray-600"
                        }`} />
                      </div>
                      <h3 className="font-bold">{option.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{option.description}</p>
                    {option.available ? (
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                        {option.action}
                      </button>
                    ) : (
                      <div>
                        <button className="w-full bg-gray-200 text-gray-600 py-2 px-4 rounded-lg cursor-not-allowed mb-2" disabled>
                          {option.action}
                        </button>
                        <p className="text-xs text-gray-500">{option.hours}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">How long does it take to get a response?</h4>
                    <p className="text-gray-600 text-sm">
                      We typically respond to emails within 24 hours. Live chat is available during business hours for immediate assistance.
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium mb-2">What information should I include in my support request?</h4>
                    <p className="text-gray-600 text-sm">
                      Please include your order number, a detailed description of the issue, and any relevant screenshots or documents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home Button - Bottom */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
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