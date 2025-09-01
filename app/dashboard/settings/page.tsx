"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import PaymentSettings from "@/components/settings/PaymentSettings";
import { FiUser, FiShield, FiCreditCard, FiArrowLeft, FiSettings, FiCheck } from "react-icons/fi";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcı verilerini getir
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Sekme içeriği için bileşenleri belirle
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings userData={userData} userId={user?.uid} />;
      case "security":
        return <SecuritySettings userData={userData} userId={user?.uid} />;
      case "payment":
        return <PaymentSettings userData={userData} userId={user?.uid} />;
      default:
        return <ProfileSettings userData={userData} userId={user?.uid} />;
    }
  };

  // Sekme butonları için yapı
  const tabs = [
    { id: "profile", label: "Profile", icon: <FiUser className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <FiShield className="w-5 h-5" /> },
    { id: "payment", label: "Payment", icon: <FiCreditCard className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <Link 
              href="/dashboard"
              className="mr-4 p-2 rounded-lg bg-white shadow-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-500">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sol Navigasyon Paneli */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              {/* Kullanıcı Bilgileri */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 font-medium">
                      {userData?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
                <div className="ml-4 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              {/* Navigasyon Menüsü */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`mr-3 ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"}`}>
                      {tab.icon}
                    </span>
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="ml-auto bg-blue-600 text-white rounded-full p-1">
                        <FiCheck className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              
              {/* Bilgilendirme Kartı */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Need Help?</h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>Check our documentation or contact support if you have any questions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ İçerik Alanı */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Sekme Başlığı */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center">
                  <span className={`mr-3 p-2 rounded-lg ${
                    activeTab === "profile" ? "bg-blue-100 text-blue-600" : 
                    activeTab === "security" ? "bg-green-100 text-green-600" : 
                    "bg-purple-100 text-purple-600"
                  }`}>
                    {tabs.find(tab => tab.id === activeTab)?.icon}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                </div>
              </div>
              
              {/* Sekme İçeriği */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}