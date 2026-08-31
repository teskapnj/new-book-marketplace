// app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  const suggestions = [
    { text: "Go to homepage", href: "/" },
    { text: "Sell books for cash", href: "/sell-books-for-cash" },
    { text: "Seller guide", href: "/seller-guide" },
    { text: "Get help", href: "/help" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full mx-auto text-center">
        <div className="mb-8">
          <div className="text-7xl mb-4">🚫</div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">
            404 Error
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>

          <p className="text-gray-600 max-w-xl mx-auto">
            The page you are looking for does not exist or the URL may be
            incorrect.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            What would you like to do?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((suggestion) => (
              <Link
                key={suggestion.href}
                href={suggestion.href}
                className="bg-blue-50 text-blue-700 p-4 rounded-lg hover:bg-blue-100 transition text-center font-medium"
              >
                {suggestion.text}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sell your media for cash
          </h2>

          <p className="text-gray-600 mb-5">
            Scan the barcode on your books, CDs, DVDs, Blu-rays, or video games
            to see if we can make you an offer.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Scan a Barcode
          </Link>

          <p className="mt-4 text-sm text-gray-500">
            Instant offers • Free prepaid shipping • PayPal payments
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            Need help?{" "}
            <Link href="/help" className="text-blue-600 hover:underline">
              Visit our Help Center
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}