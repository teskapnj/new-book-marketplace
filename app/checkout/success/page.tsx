"use client";
import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

// useSearchParams kullanan component
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const rawOrderId = searchParams.get('orderId');
  const orderId = rawOrderId && /^[a-zA-Z0-9-_]{10,50}$/.test(rawOrderId)
    ? DOMPurify.sanitize(rawOrderId)
    : null;

  const [countdown, setCountdown] = useState(10);
  const emailSentRef = useRef(false);

  const sendOrderConfirmation = useCallback(async (orderIdParam: string) => {
    if (emailSentRef.current) {
      console.log('Email already sent, skipping...');
      return;
    }

    try {
      console.log('Sending order confirmation email for:', orderIdParam);
      emailSentRef.current = true;

      if (!orderIdParam || !/^[a-zA-Z0-9-_]{10,50}$/.test(orderIdParam)) {
        console.error('Invalid order ID format');
        return;
      }

      const sanitizedOrderId = DOMPurify.sanitize(orderIdParam);

      const response = await fetch(`/api/orders/${sanitizedOrderId}/send-confirmation`, {
        method: 'POST'
      });

      if (response.ok) {
        console.log('Order confirmation email sent successfully');
      } else {
        emailSentRef.current = false;
        console.error('Failed to send confirmation email:', response.status);
      }
    } catch (error) {
      emailSentRef.current = false;
      console.error('Failed to send confirmation email:', error);
    }
  }, []);

  useEffect(() => {
    if (!orderId || emailSentRef.current) {
      return;
    }
    sendOrderConfirmation(orderId);
  }, [orderId, sendOrderConfirmation]);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            router.push('/');
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, router]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Order Placed Successfully!
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for your order! We've received your order and will begin processing it shortly.
          </p>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Order ID:</span>
                <span className="font-mono text-sm text-blue-600">
                  {orderId ? `${DOMPurify.sanitize(orderId.slice(0, 8))}...` : 'Invalid'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Pending
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Payment:</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Completed (Demo)
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Confirmation Email:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${emailSentRef.current
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {emailSentRef.current ? 'Sent' : 'Sending...'}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-blue-900 mb-3">What happens next?</h3>
            <div className="text-left space-y-2 text-blue-800">
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <span>We'll send you an email confirmation shortly</span>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span>Our sellers will prepare your items for shipping</span>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <span>You'll receive tracking information once shipped</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Continue Shopping
            </Link>

            <button
              onClick={() => {
                if (orderId && /^[a-zA-Z0-9-_]{10,50}$/.test(orderId)) {
                  navigator.clipboard.writeText(DOMPurify.sanitize(orderId));
                  alert('Order ID copied to clipboard!');
                } else {
                  alert('Invalid order ID');
                }
              }}
              className="inline-flex items-center px-6 py-4 bg-white text-gray-700 font-medium rounded-2xl border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012-2v1"></path>
              </svg>
              Copy Order ID
            </button>
          </div>

          {/* Auto redirect notice */}
          <div className="mt-8 text-gray-500 text-sm">
            Automatically redirecting to home page in {countdown} seconds
          </div>
        </div>
      </div>
    </div>
  );
}

// Ana component - Suspense ile sarılmış
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}