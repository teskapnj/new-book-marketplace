'use client';

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how we collect, use, and protect your personal information when you sell items on our platform.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          <div className="prose prose-lg max-w-none">
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800">1. Information We Collect</h2>
            <p className="mb-4 text-gray-600">
              When you use our platform to sell your books, CDs, DVDs, and games, we collect the following information:
            </p>
            
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Personal Information</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Full name (first and last name)</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Shipping address (street address, city, state, ZIP code)</li>
              <li>PayPal account email address</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Item Information</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Scanned barcode data (ISBN, UPC codes)</li>
              <li>Amazon ASIN numbers (when provided)</li>
              <li>Item titles, authors, and descriptions</li>
              <li>Package dimensions and weight</li>
              <li>Photos of items (if uploaded for condition verification)</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Technical Information</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>IP address and browser information</li>
              <li>Device type and operating system</li>
              <li>Usage data and site interactions</li>
              <li>Camera access data (for barcode scanning)</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">2. How We Use Your Information</h2>
            <p className="mb-4 text-gray-600">
              We use your personal information for the following purposes:
            </p>
            
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Service Delivery</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Processing your item submissions and sales</li>
              <li>Generating and sending prepaid shipping labels</li>
              <li>Inspecting and evaluating submitted items</li>
              <li>Processing PayPal payments for accepted items</li>
              <li>Providing customer support and assistance</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Communication</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Sending shipping labels via email</li>
              <li>Notifying you about payment processing</li>
              <li>Providing updates on item inspection status</li>
              <li>Responding to your inquiries and support requests</li>
              <li>Sending important service announcements</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Platform Improvement</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Analyzing usage patterns to improve our service</li>
              <li>Enhancing barcode scanning functionality</li>
              <li>Optimizing the user experience</li>
              <li>Preventing fraud and maintaining security</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">3. Information Sharing</h2>
            <p className="mb-4 text-gray-600">
              We share your information only in the following limited circumstances:
            </p>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Payment Processing</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
              <li>PayPal receives your email address to process payments</li>
              <li>No financial account details are stored on our servers</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Shipping Services</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
              <li>Shipping carriers receive your address for label generation</li>
              <li>Package dimensions and weight for shipping calculations</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Legal Requirements</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>When required by law or legal process</li>
              <li>To protect our rights and prevent fraud</li>
              <li>In connection with business transfers or mergers</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                <strong>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</strong>
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">4. Data Security</h2>
            <p className="mb-4 text-gray-600">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>SSL encryption for all data transmission</li>
              <li>Secure data storage with limited access controls</li>
              <li>Regular security audits and updates</li>
              <li>No storage of complete financial account information</li>
              <li>Secure deletion of data when no longer needed</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">5. Data Retention</h2>
            <p className="mb-4 text-gray-600">
              We retain your information for the following periods:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li><strong>Account Information:</strong> As long as your account is active</li>
              <li><strong>Transaction Records:</strong> 7 years for tax and legal compliance</li>
              <li><strong>Item Data:</strong> Until processing is complete and payment is made</li>
              <li><strong>Support Communications:</strong> 3 years for service improvement</li>
              <li><strong>Technical Logs:</strong> 90 days for security and performance monitoring</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">6. Your Rights and Choices</h2>
            <p className="mb-4 text-gray-600">
              You have the following rights regarding your personal information:
            </p>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Access and Updates</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
              <li>View and update your account information</li>
              <li>Correct inaccurate personal data</li>
              <li>Update your PayPal email address</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Data Deletion</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
              <li>Request deletion of your account and associated data</li>
              <li>Note: Some information may be retained for legal compliance</li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-gray-700">Communication Preferences</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Opt out of promotional emails (service emails will continue)</li>
              <li>Choose your preferred communication methods</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">7. Cookies and Tracking</h2>
            <p className="mb-4 text-gray-600">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Remember your login status and preferences</li>
              <li>Improve website performance and functionality</li>
              <li>Analyze usage patterns for service improvement</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
            <p className="mb-6 text-gray-600">
              You can manage cookie preferences through your browser settings, though some functionality may be limited if cookies are disabled.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">8. Third-Party Services</h2>
            <p className="mb-4 text-gray-600">
              Our platform integrates with the following third-party services:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li><strong>PayPal:</strong> For payment processing (subject to PayPal's privacy policy)</li>
              <li><strong>Shipping Carriers:</strong> For label generation and package tracking</li>
              <li><strong>Barcode Databases:</strong> For item identification and pricing</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">9. Children's Privacy</h2>
            <p className="mb-6 text-gray-600">
              Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children. 
              If you are under 18, please do not use our service or provide any personal information.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">10. International Users</h2>
            <p className="mb-6 text-gray-600">
              Our service is primarily designed for users in the United States. If you access our service from outside the US, 
              your information may be transferred to and processed in the United States, where privacy laws may differ from your jurisdiction.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">11. Changes to This Policy</h2>
            <p className="mb-6 text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification to your registered email address</li>
              <li>Providing at least 30 days notice for significant changes</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-10 text-gray-800">12. Contact Us</h2>
            <p className="mb-4 text-gray-600">
              If you have questions about this Privacy Policy or your personal information, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
              <li>Through our contact form on the website</li>
              <li>By email using our support system</li>
              <li>Include "Privacy Policy Question" in your message subject</li>
            </ul>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-10">
              <p className="text-green-800 font-medium">
                <strong>Effective Date:</strong> January 1, 2025
              </p>
              <p className="text-green-700 mt-2">
                By using our service, you acknowledge that you have read and understood this Privacy Policy 
                and agree to the collection and use of your information as described herein.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}