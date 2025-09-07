'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using our book, CD, DVD, and game selling platform.
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800">1. Acceptance of Terms</h2>
            <p className="mb-6 text-gray-600">
              By using our platform to sell your books, CDs, DVDs, and games, you accept and agree to be bound by these terms. 
              If you do not agree to these terms, please do not use our service.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">2. Our Service</h2>
            <p className="mb-4 text-gray-600">
              We operate a platform where you can sell your used books, CDs, DVDs, and games. Our service includes:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Item scanning and identification via barcode/ISBN/UPC</li>
              <li>Manual search and Amazon ASIN lookup</li>
              <li>Free prepaid shipping labels</li>
              <li>Item inspection and condition verification</li>
              <li>PayPal payment processing for accepted items</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">3. Seller Responsibilities</h2>
            <p className="mb-4 text-gray-600">
              As a seller on our platform, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Provide accurate personal information, PayPal account details, and shipping address</li>
              <li>Only submit items in <strong>very good condition</strong> as defined in our condition guide</li>
              <li>Ensure items have no writing, highlighting, markings, or damage</li>
              <li>Package items securely using appropriate materials</li>
              <li>Ship items within 30 days of receiving prepaid shipping labels</li>
              <li>Provide accurate package dimensions and weight information</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">4. Condition Standards & Inspection</h2>
            <p className="mb-4 text-gray-600">
              All items are subject to our strict condition standards:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Items must be in very good condition with minimal wear</li>
              <li>No writing, highlighting, underlining, or markings of any kind</li>
              <li>No water damage, stains, odors, or structural damage</li>
              <li>All original components must be included (cases, covers, manuals, inserts)</li>
              <li>Items must function properly without defects</li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-medium">
                <strong>Important:</strong> Items that do not meet our condition standards will NOT be paid for and will be sent directly to recycling. 
                We do not return rejected items under any circumstances.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">5. No Returns Policy</h2>
            <p className="mb-4 text-gray-600">
              <strong>We do not accept returns of any kind.</strong> By using our service, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Once items are shipped to us, they cannot be returned to you</li>
              <li>Items not meeting our condition standards will be recycled</li>
              <li>No payment will be made for recycled items</li>
              <li>All sales are final once items are processed</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">6. Payment Terms</h2>
            <p className="mb-4 text-gray-600">
              Payment processing works as follows:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Only items meeting our condition standards will be paid for</li>
              <li>Payments are processed via PayPal only</li>
              <li>You must provide a valid PayPal account email address</li>
              <li>Payments are typically processed within 5-7 business days after inspection</li>
              <li>No fees are charged to sellers for our service</li>
              <li>All payments are final and non-refundable</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">7. Shipping & Labels</h2>
            <p className="mb-4 text-gray-600">
              Our shipping process includes:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Free prepaid shipping labels provided within 24 hours of submission</li>
              <li>Labels are valid for 30 days from issuance</li>
              <li>You are responsible for proper packaging and label attachment</li>
              <li>Tracking information is provided with all shipments</li>
              <li>Items must arrive at our facility within 30 days of label generation</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">8. Prohibited Items</h2>
            <p className="mb-4 text-gray-600">
              The following items are not accepted on our platform:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Items with writing, highlighting, or markings</li>
              <li>Damaged, broken, or non-functional items</li>
              <li>Water-damaged or moldy items</li>
              <li>Ex-library books or items with library markings</li>
              <li>Promotional, bootleg, or counterfeit items</li>
              <li>Items missing original components (cases, covers, manuals)</li>
              <li>Items with strong odors (smoke, mildew, etc.)</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">9. Account Security</h2>
            <p className="mb-6 text-gray-600">
              You are responsible for maintaining the security of your account and the accuracy of your information. 
              This includes keeping your PayPal account information current and secure.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">10. Limitation of Liability</h2>
            <p className="mb-6 text-gray-600">
              Our liability is limited to the value of accepted items only. We are not responsible for items lost in transit, 
              items damaged due to improper packaging, or any indirect or consequential damages. Our maximum liability 
              will not exceed the total amount paid for your accepted items.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">11. Intellectual Property</h2>
            <p className="mb-6 text-gray-600">
              You represent that you own or have the right to sell all items submitted to our platform. 
              You are responsible for ensuring that items do not infringe on any intellectual property rights.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">12. Privacy & Data</h2>
            <p className="mb-6 text-gray-600">
              We collect and use your personal information as described in our Privacy Policy. 
              This includes your name, address, PayPal information, and shipping details necessary to process your sales.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">13. Modification of Terms</h2>
            <p className="mb-6 text-gray-600">
              We reserve the right to modify these terms at any time. Material changes will be communicated via email 
              or website notice at least 30 days before taking effect. Continued use of our service constitutes acceptance of modified terms.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">14. Governing Law</h2>
            <p className="mb-6 text-gray-600">
              These terms are governed by the laws of the United States. Any disputes will be resolved through binding arbitration 
              in accordance with the rules of the American Arbitration Association.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">15. Contact Information</h2>
            <p className="mb-4 text-gray-600">
              If you have questions about these terms, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Through our contact form on the website</li>
              <li>By email using our support system</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-10">
              <p className="text-blue-800 font-medium">
                <strong>Effective Date:</strong> January 1, 2025
              </p>
              <p className="text-blue-700 mt-2">
                By submitting items to our platform, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}