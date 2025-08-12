export default function HowToBuyPage() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How to Buy on MarketPlace</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Follow these simple steps to purchase used books, CDs, DVDs, games, and mix bundles with confidence.
            </p>
          </div>
        </section>
  
        {/* Back to Home Button - Top */}
        <div className="py-6 bg-white border-b">
          <div className="max-w-4xl mx-auto text-center">
            <a 
              href="/" 
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
          </div>
        </div>
  
        {/* Steps Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Buying Process</h2>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Browse and Find Items</h3>
                  <p className="text-gray-700 mb-4">
                    Explore our marketplace to find the items you're looking for. You can:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Search by title, author, ISBN, or keywords</li>
                    <li>Browse by category (Books, CDs, DVDs, Games, Mix Bundles)</li>
                    <li>Filter by condition, price range, and seller ratings</li>
                    <li>Save items to your wishlist for later</li>
                  </ul>
                </div>
              </div>
  
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Review Item Details</h3>
                  <p className="text-gray-700 mb-4">
                    Before making a purchase, carefully review the item details:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Read the full description and condition notes</li>
                    <li>Check all photos for any signs of wear</li>
                    <li>Verify the seller's rating and reviews</li>
                    <li>Review shipping costs and estimated delivery times</li>
                  </ul>
                </div>
              </div>
  
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Add to Cart and Checkout</h3>
                  <p className="text-gray-700 mb-4">
                    When you're ready to purchase:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Add items to your cart</li>
                    <li>Review your order in the cart</li>
                    <li>Proceed to secure checkout</li>
                    <li>Enter your shipping and payment information</li>
                    <li>Confirm your order</li>
                  </ul>
                </div>
              </div>
  
              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Track Your Order</h3>
                  <p className="text-gray-700 mb-4">
                    After your purchase:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Receive order confirmation via email</li>
                    <li>Get notified when the seller ships your item</li>
                    <li>Track your package with the provided tracking number</li>
                    <li>Contact the seller if you have any questions</li>
                  </ul>
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                      <strong>Important:</strong> Sellers are required to ship items within 3 business days. If the seller fails to ship within this timeframe, your order will be automatically canceled and a full refund will be processed.
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Step 5 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-blue-600">5</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Receive and Review</h3>
                  <p className="text-gray-700 mb-4">
                    Once your item arrives:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Inspect the item to ensure it matches the description</li>
                    <li>Confirm receipt in your account</li>
                    <li>Leave a review for the seller</li>
                    <li>Rate your buying experience</li>
                  </ul>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800">
                      <strong>Return Window:</strong> You have 3 days from the delivery date to initiate a return if there are any issues with the product. Please contact us immediately if you encounter any problems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Payment & Shipping Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Payment & Shipping</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-600">Payment Options</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Secure Payments</h4>
                      <p className="text-gray-700">All payments are processed securely through our platform. We never share your payment information with sellers.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Multiple Methods</h4>
                      <p className="text-gray-700">We accept credit/debit cards, PayPal, and other popular payment methods.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Marketplace Fee</h4>
                      <p className="text-gray-700">A marketplace fee of 8.5% is applied to all purchases. This fee helps us maintain the platform and provide buyer protection services.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Buyer Protection</h4>
                      <p className="text-gray-700">Your purchase is protected. If an item doesn't arrive or isn't as described, we'll help you get a refund.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-600">Shipping Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Shipping Costs</h4>
                      <p className="text-gray-700">Shipping costs are clearly displayed before you complete your purchase. Sellers set their own shipping rates.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Delivery Times</h4>
                      <p className="text-gray-700">Estimated delivery times are provided for each item. Most items are shipped within 1-3 business days.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Tracking</h4>
                      <p className="text-gray-700">Once your item ships, you'll receive a tracking number to monitor your package's progress.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
  
        {/* Returns Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Returns & Refunds</h2>
            
            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Our Return Policy</h3>
              <p className="text-gray-700 mb-6">
                We want you to be completely satisfied with your purchase. If you're not happy with an item, you may be eligible for a return or refund under the following conditions:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold mb-4">Eligible Returns</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Item not as described</li>
                    <li>Item arrived damaged</li>
                    <li>Wrong item was sent</li>
                    <li>Item doesn't match photos</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold mb-4">Return Process</h4>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>Contact the seller within 3 days of delivery</li>
                    <li>Provide photos and description of the issue</li>
                    <li>Seller has 3 business days to respond</li>
                    <li>If unresolved, open a case with our support team</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                  <strong>Note:</strong> Some items may not be eligible for return if clearly marked as "final sale" or if the buyer changes their mind. Always check the item description before purchasing.
                </p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Back to Home Button - Bottom */}
        <div className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <a 
              href="/" 
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
          </div>
        </div>
  
        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Shopping?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Browse thousands of used books, CDs, DVDs, games, and mix bundles at great prices.
            </p>
            <a 
              href="/browse" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block"
            >
              Browse All Items
            </a>
          </div>
        </section>
      </div>
    );
  }