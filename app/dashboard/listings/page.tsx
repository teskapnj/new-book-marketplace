// app/dashboard/listings/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { FiHome, FiPlus, FiSearch, FiFilter, FiEdit, FiTrash2, FiEye, FiPackage } from "react-icons/fi";
import Link from "next/link";

// Örnek paket listeleme verileri
const sampleBundleListings = [
  {
    id: "1",
    title: "Classic Book Collection",
    category: "book",
    price: 24.99,
    condition: "good",
    itemCount: 12,
    image: "https://via.placeholder.com/150x200?text=Book+Bundle",
    dateAdded: "2023-10-15"
  },
  {
    id: "2",
    title: "Music CD Collection",
    category: "cd",
    price: 19.99,
    condition: "like-new",
    itemCount: 15,
    image: "https://via.placeholder.com/150x200?text=CD+Bundle",
    dateAdded: "2023-10-10"
  },
  {
    id: "3",
    title: "Movie DVD Collection",
    category: "dvd",
    price: 29.99,
    condition: "excellent",
    itemCount: 10,
    image: "https://via.placeholder.com/150x200?text=DVD+Bundle",
    dateAdded: "2023-10-05"
  },
  {
    id: "4",
    title: "Media Lover's Bundle",
    category: "mix",
    price: 34.99,
    condition: "good",
    itemCount: 18,
    image: "https://via.placeholder.com/150x200?text=Mix+Bundle",
    dateAdded: "2023-10-01"
  }
];

export default function ListingsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [listings, setListings] = useState(sampleBundleListings);
  const [filteredListings, setFilteredListings] = useState(sampleBundleListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Arama ve filtreleme işlemleri
    let result = listings;
    
    if (searchTerm) {
      result = result.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      result = result.filter(listing => listing.category === selectedCategory);
    }
    
    setFilteredListings(result);
  }, [listings, searchTerm, selectedCategory]);

  const handleDeleteListing = (id: string) => {
    // Gerçek bir uygulamada burada API çağrısı yapılır
    setListings(prev => prev.filter(listing => listing.id !== id));
    setShowDeleteModal(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Back to Dashboard Link */}
          <div className="mb-6">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              <FiHome className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Bundle Listings</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your marketplace bundle listings</p>
            </div>
            <Link
              href="/dashboard/listings/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Create New Bundle
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search by bundle title"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="book">Book Bundles</option>
                    <option value="cd">CD Collections</option>
                    <option value="dvd">DVD Collections</option>
                    <option value="game">Game Collections</option>
                    <option value="mix">Mixed Media Bundles</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiPackage className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No bundle listings found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "Get started by creating your first bundle listing"}
              </p>
              <Link
                href="/dashboard/listings/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Create Your First Bundle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-3 aspect-h-4 bg-gray-200">
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">{listing.title}</h3>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            listing.category === 'book' ? 'bg-blue-100 text-blue-800' :
                            listing.category === 'cd' ? 'bg-green-100 text-green-800' :
                            listing.category === 'dvd' ? 'bg-purple-100 text-purple-800' :
                            listing.category === 'game' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                          </span>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {listing.itemCount} items
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-gray-900">${listing.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <span className="text-xs text-gray-500">Added: {listing.dateAdded}</span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => setShowDeleteModal(listing.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Bundle Listing
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this bundle listing? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => handleDeleteListing(showDeleteModal)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(null)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}