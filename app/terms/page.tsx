export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Please read these terms carefully before using our marketplace platform.
          </p>
        </div>
      </section>

      {/* Back to Home Button */}
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

      {/* Terms Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-8">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">2. Use License</h2>
            <p className="mb-6">
              Permission is granted to temporarily download one copy of the materials on MarketPlace's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose</li>
              <li>attempt to decompile or reverse engineer any software contained on MarketPlace's website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>

            <h2 className="text-3xl font-bold mb-8 mt-12">3. User Responsibilities</h2>
            <p className="mb-6">
              As a user of our platform, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
              <li>Not interfere with or disrupt the service or servers</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2 className="text-3xl font-bold mb-8 mt-12">4. Seller Responsibilities</h2>
            <p className="mb-6">
              Sellers on our platform must:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide accurate descriptions and images of items</li>
              <li>Ship items within 3 business days of purchase</li>
              <li>Respond to buyer inquiries within 24 hours</li>
              <li>Honor all valid return requests as per our return policy</li>
              <li>Not list prohibited items (see Section 7)</li>
              <li>Pay all applicable fees and taxes</li>
            </ul>

            <h2 className="text-3xl font-bold mb-8 mt-12">5. Buyer Responsibilities</h2>
            <p className="mb-6">
              Buyers on our platform must:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide accurate shipping information</li>
              <li>Pay for items promptly upon purchase</li>
              <li>Inspect items upon delivery and report issues within 3 days</li>
              <li>Not file fraudulent disputes or claims</li>
              <li>Provide honest feedback about sellers</li>
            </ul>

            <h2 className="text-3xl font-bold mb-8 mt-12">6. Fees and Payments</h2>
            <p className="mb-6">
              MarketPlace charges a marketplace fee of 8.5% on all transactions. This fee is automatically deducted from the seller's payment. Additional fees may apply for:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Shipping services (if selected through our platform)</li>
              <li>Premium listings or promotional features</li>
              <li>Currency conversion fees (if applicable)</li>
            </ul>
            <p className="mb-6">
              All fees are non-refundable except as expressly stated in these terms or our refund policy.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">7. Prohibited Items and Activities</h2>
            <p className="mb-6">
              The following items and activities are strictly prohibited on our platform:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Illegal items or services</li>
              <li>Counterfeit or pirated goods</li>
              <li>Stolen property</li>
              <li>Hazardous materials</li>
              <li>Items that infringe intellectual property rights</li>
              <li>Adult content or services</li>
              <li>Weapons and ammunition</li>
              <li>Alcohol and tobacco products</li>
              <li>Drugs and drug paraphernalia</li>
              <li>Items requiring special licenses (e.g., medical devices)</li>
              <li>Any item or activity that violates applicable laws</li>
            </ul>

            <h2 className="text-3xl font-bold mb-8 mt-12">8. Shipping and Delivery</h2>
            <p className="mb-6">
              Sellers are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Shipping items within 3 business days of purchase</li>
              <li>Providing valid tracking information</li>
              <li>Packaging items appropriately to prevent damage</li>
              <li>Complying with all shipping regulations</li>
            </ul>
            <p className="mb-6">
              If a seller fails to ship within 3 business days, the order will be automatically canceled and the buyer will receive a full refund.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">9. Returns and Refunds</h2>
            <p className="mb-6">
              Buyers have 3 days from the delivery date to initiate a return for items that are:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Not as described</li>
              <li>Damaged or defective</li>
              <li>Counterfeit or fake</li>
            </ul>
            <p className="mb-6">
              The return process requires buyers to:
            </p>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li>Contact the seller within 3 days of delivery</li>
              <li>Provide evidence of the issue (photos, description)</li>
              <li>Allow the seller 3 business days to respond</li>
              <li>If unresolved, escalate to MarketPlace support</li>
            </ol>
            <p className="mb-6">
              MarketPlace reserves the right to make final decisions on return disputes.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">10. Intellectual Property</h2>
            <p className="mb-6">
              All content on this website, including text, graphics, logos, images, and software, is the property of MarketPlace or its content suppliers and is protected by international copyright laws. The compilation of all content on this site is the exclusive property of MarketPlace.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">11. Disclaimer</h2>
            <p className="mb-6">
              The materials on MarketPlace's website are provided on an 'as is' basis. MarketPlace makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">12. Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall MarketPlace or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MarketPlace's website, even if MarketPlace or a MarketPlace authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">13. Indemnification</h2>
            <p className="mb-6">
              You agree to indemnify and hold MarketPlace and its affiliates, officers, agents, and employees harmless from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of your breach of these terms or your violation of any law or the rights of a third party.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">14. Governing Law</h2>
            <p className="mb-6">
              These terms and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the State of [Your State], United States.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">15. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-3xl font-bold mb-8 mt-12">16. Contact Information</h2>
            <p className="mb-6">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>By email: support@marketplace.com</li>
              <li>By visiting this page on our website: marketplace.com/contact</li>
              <li>By phone: +1 (555) 123-4567</li>
            </ul>
            <p className="mb-6">
              Effective Date: January 1, 2023
            </p>
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
    </div>
  );
}