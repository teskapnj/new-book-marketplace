"use client";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiDollarSign, FiSave, FiInfo, FiEdit2, FiX, FiCheck, FiCreditCard, FiShield, FiTrendingUp, FiPackage, FiShoppingBag } from "react-icons/fi";
import { FaPaypal } from "react-icons/fa";

export default function PaymentSettings({ userData, userId }) {
  const [paypalEmail, setPaypalEmail] = useState(userData?.payment?.paypalEmail || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    
    if (!paypalEmail) {
      setMessage({ text: "PayPal email is required", type: "error" });
      return;
    }
    
    // Basit bir email doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paypalEmail)) {
      setMessage({ text: "Please enter a valid email address", type: "error" });
      return;
    }
    
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      // Firestore'da ödeme bilgilerini güncelle
      await updateDoc(doc(db, "users", userId), {
        updatedAt: new Date(),
        updatedBy: userData.email,
        // Ödeme bilgilerini yeni alan olarak ekle veya güncelle
        payment: {
          paypalEmail: paypalEmail,
          paymentMethod: "paypal",
          updatedAt: new Date()
        }
      });
      
      setMessage({ text: "Payment settings updated successfully", type: "success" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating payment settings:", error);
      setMessage({ text: `Error: ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Değişiklikleri geri al
    setPaypalEmail(userData?.payment?.paypalEmail || "");
    setIsEditing(false);
    setMessage({ text: "", type: "" });
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Açıklama */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-900">Payment Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your payment methods and view your financial information.
        </p>
      </div>
      
      {/* Mesaj Bildirimi */}
      {message.text && (
        <div className={`rounded-lg p-4 ${
          message.type === "error" 
            ? "bg-red-50 text-red-700 border border-red-200" 
            : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${
              message.type === "error" ? "text-red-400" : "text-green-400"
            }`}>
              {message.type === "error" ? (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* PayPal Hesabı Kartı */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        {/* Kart Başlığı */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 mr-3">
                <FaPaypal className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">PayPal Account</h3>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiEdit2 className="mr-1.5 h-4 w-4" />
                {userData?.payment?.paypalEmail ? "Edit" : "Add"}
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FiX className="mr-1.5 h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Kart İçeriği */}
        <div className="p-5">
          {userData?.payment?.paypalEmail && !isEditing ? (
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <FaPaypal className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">PayPal Email</h4>
                <p className="text-sm text-gray-600">{userData.payment.paypalEmail}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSavePaymentSettings} className="space-y-5">
              <div>
                <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  PayPal Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPaypal className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="paypalEmail"
                    name="paypalEmail"
                    type="email"
                    required
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="your-paypal-email@example.com"
                  />
                </div>
                <div className="mt-1.5 flex items-start">
                  <FiInfo className="flex-shrink-0 h-4 w-4 text-gray-400 mt-0.5 mr-1.5" />
                  <p className="text-xs text-gray-500">
                    This email will be used to send your payments. Make sure it's linked to your PayPal account.
                  </p>
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V8a8 8 0 018-0z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      
      {/* Sales Statistics Card */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 mr-3">
              <FiTrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Sales Statistics</h3>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Total Sales</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                ${userData?.totalSales?.toFixed(2) || "0.00"}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Number of Sales</div>
              <div className="text-xl font-bold text-gray-900 mt-1">
                {userData?.numberOfSales || "0"}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bilgilendirme Kartı */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Payment Security</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>We use PayPal to process all payments securely. Your financial information is never shared with us.</p>
              <p className="mt-2">Payments are typically processed within 1-2 business days after a transaction is completed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}