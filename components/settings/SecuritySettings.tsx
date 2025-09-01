"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiLock, FiEye, FiEyeOff, FiAlertTriangle, FiTrash2, FiShield, FiCheck, FiInfo, FiUserX } from "react-icons/fi";

export default function SecuritySettings({ userData, userId }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }
    
    setLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage({ text: "User not found. Please login again.", type: "error" });
        setLoading(false);
        return;
      }
      
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      
      // Kullanıcıyı yeniden doğrula
      await reauthenticateWithCredential(user, credential);
      
      // Şifreyi güncelle
      await updatePassword(user, newPassword);
      
      // Firestore'da son şifre değiştirme tarihini güncelle
      await updateDoc(doc(db, "users", userId), {
        updatedAt: new Date(),
        updatedBy: userData.email,
        // Güvenlik bilgilerini yeni alan olarak ekle veya güncelle
        security: {
          lastPasswordChange: new Date(),
          updatedAt: new Date()
        }
      });
      
      setMessage({ text: "Password updated successfully", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      
      // Hata mesajlarını kullanıcı dostu hale getir
      switch (error.code) {
        case "auth/wrong-password":
          setMessage({ text: "Current password is incorrect. Please try again.", type: "error" });
          break;
        case "auth/too-many-requests":
          setMessage({ text: "Too many failed attempts. Please try again later.", type: "error" });
          break;
        default:
          setMessage({ text: `Error: ${error.message}`, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    try {
      setLoading(true);
      
      const user = auth.currentUser;
      if (!user) {
        setMessage({ text: "User not found. Please login again.", type: "error" });
        setLoading(false);
        return;
      }
      
      // Firestore'dan kullanıcı belgesini sil
      await deleteDoc(doc(db, "users", userId));
      
      // Firebase Authentication'dan kullanıcıyı sil
      await user.delete();
      
      // Kullanıcıyı çıkış yap ve giriş sayfasına yönlendir
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      
      // Hata mesajlarını kullanıcı dostu hale getir
      switch (error.code) {
        case "auth/requires-recent-login":
          setMessage({ text: "For security reasons, please login again before deleting your account.", type: "error" });
          break;
        default:
          setMessage({ text: `Error: ${error.message}`, type: "error" });
      }
      
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Açıklama */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your password and account security preferences.
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
      
      {/* Şifre Değiştirme Kartı */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        {/* Kart Başlığı */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 mr-3">
              <FiShield className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          </div>
        </div>
        
        {/* Kart İçeriği */}
        <div className="p-5">
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showCurrentPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showNewPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="mt-1.5 flex items-start">
                <FiInfo className="flex-shrink-0 h-4 w-4 text-gray-400 mt-0.5 mr-1.5" />
                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters long.
                </p>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
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
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Hesap Silme Kartı */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        {/* Kart Başlığı */}
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-100 mr-3">
              <FiUserX className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Delete Account</h3>
          </div>
        </div>
        
        {/* Kart İçeriği */}
        <div className="p-5">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </div>
          
          {showDeleteConfirm ? (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Are you absolutely sure?
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      {loading ? "Deleting..." : "Yes, delete my account"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={loading}
                className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                {loading ? "Processing..." : "Delete Account"}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Güvenlik İpuçları Kartı */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Security Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Use a strong password with a mix of letters, numbers, and symbols</li>
                <li>Never share your password with anyone</li>
                <li>Change your password regularly</li>
                <li>Use two-factor authentication when available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}