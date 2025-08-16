"use client";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function SellerListingsPage() {
  const { listings } = useStore();
  const [selectedListing, setSelectedListing] = useState<any>(null);

  const pendingCount = listings.filter(l => l.status === "pending").length;
  const approvedCount = listings.filter(l => l.status === "approved").length;
  const rejectedCount = listings.filter(l => l.status === "rejected").length;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200", 
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    const icons = { pending: "⏳", approved: "✅", rejected: "❌" };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]} <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const getStatusMessage = (status: string) => {
    const messages = {
      pending: "Your listing is under review. We'll notify you once it's approved.",
      approved: "Your listing is live and visible to buyers!",
      rejected: "Your listing was rejected. Please review the feedback and try again."
    };
    return messages[status as keyof typeof messages] || "";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      book: "📚",
      cd: "💿",
      dvd: "📀", 
      game: "🎮",
      mix: "📦"
    };
    return icons[category as keyof typeof icons] || "📦";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-1">Track your submitted listings ({listings.length} total)</p>
          </div>
          <Link 
            href="/dashboard/listings/create"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ➕ Create New Listing
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{listings.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Empty State */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Create your first bundle listing to get started selling.</p>
            <Link 
              href="/dashboard/listings/create"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          /* Listings */
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg border p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(listing.status)}
                    <span className="text-sm text-gray-500">ID: {listing.id}</span>
                  </div>
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    👁️ View Details
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {listing.title}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                  <div>📦 {listing.totalItems} items</div>
                  <div>💰 ${listing.totalValue.toFixed(2)}</div>
                  <div>📅 {listing.submittedDate}</div>
                </div>
                
                <div className={`p-3 rounded-lg border-l-4 ${
                  listing.status === 'pending' ? 'bg-yellow-50 border-yellow-400' :
                  listing.status === 'approved' ? 'bg-green-50 border-green-400' :
                  'bg-red-50 border-red-400'
                }`}>
                  <p className={`text-sm font-medium ${
                    listing.status === 'pending' ? 'text-yellow-800' :
                    listing.status === 'approved' ? 'text-green-800' :
                    'text-red-800'
                  }`}>
                    {getStatusMessage(listing.status)}
                  </p>
                  {listing.status === 'rejected' && listing.rejectionReason && (
                    <p className="text-sm text-red-700 mt-2">
                      <strong>Reason:</strong> {listing.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Modal with Bundle Items Table */}
        {selectedListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Listing Details</h3>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Basic Info */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Title:</span>
                        <span className="text-gray-900">{selectedListing.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Status:</span>
                        {getStatusBadge(selectedListing.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Total Items:</span>
                        <span className="text-gray-900">{selectedListing.totalItems}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Total Value:</span>
                        <span className="text-gray-900 font-semibold">${selectedListing.totalValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Submitted:</span>
                        <span className="text-gray-900">{selectedListing.submittedDate}</span>
                      </div>
                      {selectedListing.reviewedDate && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">Reviewed:</span>
                          <span className="text-gray-900">{selectedListing.reviewedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bundle Items Table */}
                {selectedListing.bundleItems && selectedListing.bundleItems.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Bundle Items ({selectedListing.bundleItems.length})
                    </h4>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ISBN
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Condition
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedListing.bundleItems.map((item: any, index: number) => (
                              <tr key={item.id || index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <span className="text-lg mr-2">{getCategoryIcon(item.category)}</span>
                                    <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-mono">{item.isbn}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item.condition === 'like-new' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {item.condition === 'like-new' ? 'Like New' : 'Good'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 text-center font-medium">{item.quantity}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-medium">${item.price.toFixed(2)}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan={5} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                Total:
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                {selectedListing.bundleItems.reduce((sum: number, item: any) => sum + item.quantity, 0)} items
                              </td>
                              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                ${selectedListing.totalValue.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {selectedListing.rejectionReason && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Rejection Feedback</h4>
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Reason:</strong> {selectedListing.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

                {selectedListing.adminNotes && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Admin Notes</h4>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedListing.adminNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>
                {selectedListing.status === 'rejected' && (
                  <Link
                    href="/dashboard/listings/create"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Create New Listing
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}