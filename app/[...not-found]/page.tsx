// app/[...not-found]/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CatchAll() {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  // Analyze the URL
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || '';
  
  // Create suggestions
  const suggestions = [
    { text: "Go to homepage", href: "/" },
    { text: "View all products", href: "/browse" },
    { text: "Check your cart", href: "/cart" },
    { text: "Get help", href: "/help" },
  ];

  // If something similar to a product ID exists
  if (/^\d+$/.test(lastSegment)) {
    suggestions.unshift({ text: "View products", href: "/browse" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Error visual */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🚫</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            <code className="bg-gray-800 text-white px-2 py-1 rounded">
              {pathname}
            </code>
          </p>
          <p className="text-gray-600">
            The page you are looking for does not exist or there may be an error in the URL.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            What would you like to do?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion, index) => (
              <Link
                key={index}
                href={suggestion.href}
                className="bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition text-center font-medium"
              >
                {suggestion.text}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Search
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search for a product, category, or seller..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">10K+</div>
            <p className="text-gray-600">Products</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">500+</div>
            <p className="text-gray-600">Sellers</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">50+</div>
            <p className="text-gray-600">Categories</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-red-600 mb-1">24/7</div>
            <p className="text-gray-600">Support</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Still need help?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
