"use client";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX, FiCheck, FiInfo } from "react-icons/fi";

export default function ProfileSettings({ userData, userId }) {
  const [name, setName] = useState(userData?.name || "");
  const [phone, setPhone] = useState(userData?.profile?.phone || "");
  const [address, setAddress] = useState(userData?.profile?.address || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      // Firestore'da profil bilgilerini güncelle
      await updateDoc(doc(db, "users", userId), {
        name: name, // Mevcut name alanını güncelle
        updatedAt: new Date(), // Mevcut updatedAt alanını güncelle
        updatedBy: userData.email, // Mevcut updatedBy alanını güncelle
        // Profil bilgilerini yeni alan olarak ekle veya güncelle
        profile: {
          phone: phone,
          address: address,
          updatedAt: new Date()
        }
      });
      
      setMessage({ text: "Profile updated successfully", type: "success" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: `Error: ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Değişiklikleri geri al
    setName(userData?.name || "");
    setPhone(userData?.profile?.phone || "");
    setAddress(userData?.profile?.address || "");
    setIsEditing(false);
    setMessage({ text: "", type: "" });
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Açıklama */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your account's profile information and preferences.
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
      
      {/* Profil Kartı */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        {/* Kart Başlığı */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiEdit2 className="mr-1.5 h-4 w-4" />
                Edit Profile
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
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:gap-5 sm:grid-cols-2">
              {/* Ad Alanı */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      isEditing ? 'border-gray-300' : 'border-gray-200'
                    } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                </div>
              </div>
              
              {/* E-posta Alanı */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={userData?.email || ""}
                    disabled
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm bg-gray-50 text-gray-600 sm:text-sm"
                  />
                </div>
                <div className="mt-1.5 flex items-start">
                  <FiInfo className="flex-shrink-0 h-4 w-4 text-gray-400 mt-0.5 mr-1.5" />
                  <p className="text-xs text-gray-500">
                    Your email address cannot be changed. Contact support if you need to update it.
                  </p>
                </div>
              </div>
              
              {/* Telefon Alanı */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      isEditing ? 'border-gray-300' : 'border-gray-200'
                    } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                </div>
              </div>
              
              {/* Adres Alanı */}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      isEditing ? 'border-gray-300' : 'border-gray-200'
                    } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      !isEditing ? "bg-gray-50 text-gray-600" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            
            {/* Kaydet Butonu */}
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
        </div>
      </div>
    </div>
  );
}