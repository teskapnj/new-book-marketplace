"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { useRouter } from "next/navigation";

// Admin Messages Management Component
const AdminMessagesManagement = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, 'contact_messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messageList.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      setMessages(messageList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return msg.status === 'unread';
    if (filter === 'replied') return msg.replied === true;
    return true;
  });

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, 'contact_messages', messageId), {
        status: 'read',
        readAt: serverTimestamp(),
        readBy: user?.email
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSending(true);
    try {
      // Firebase'e reply kaydet
      await updateDoc(doc(db, 'contact_messages', selectedMessage.id), {
        replied: true,
        replyMessage: replyText,
        repliedAt: serverTimestamp(),
        repliedBy: user?.email,
        status: 'replied'
      });

      // Email'i clipboard'a kopyala (manuel email için)
      await navigator.clipboard.writeText(selectedMessage.email);

      setReplyText('');
      setSelectedMessage(null);
      
      alert(`✅ Reply saved successfully!\n\n📧 User email copied to clipboard: ${selectedMessage.email}\n\nYou can now send them a manual email with your reply.`);
      
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('❌ Failed to save reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteDoc(doc(db, 'contact_messages', messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      alert('🗑️ Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('❌ Failed to delete message.');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'unread'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread ({messages.filter(m => m.status === 'unread').length})
            </button>
            <button
              onClick={() => setFilter('replied')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'replied'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Replied ({messages.filter(m => m.replied).length})
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-gray-50 px-6 py-3 border-b">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">
              {messages.filter(m => m.status === 'unread').length}
            </div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {messages.filter(m => m.replied).length}
            </div>
            <div className="text-sm text-gray-600">Replied</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((messages.filter(m => m.replied).length / Math.max(messages.length, 1)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
              message.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => {
              setSelectedMessage(message);
              if (message.status === 'unread') {
                markAsRead(message.id);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {message.subject}
                  </h3>
                  {message.status === 'unread' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      🆕 New
                    </span>
                  )}
                  {message.replied && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✅ Replied
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  <p className="text-sm font-medium text-gray-900">
                    📧 {message.name} ({message.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    📅 {formatDate(message.createdAt)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {message.message}
                </p>
              </div>
              <div className="ml-4 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMessage(message);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  👁️ View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMessage(message.id);
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m4 0V4h4v1"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'No contact messages yet.' 
                : `No ${filter} messages found.`}
            </p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  📧 Message Details
                </h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Message Content */}
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">👤 Name</label>
                    <p className="mt-1 text-sm text-gray-900 font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">📧 Email</label>
                    <p className="mt-1 text-sm text-gray-900 font-medium">{selectedMessage.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">📋 Subject</label>
                  <p className="mt-1 text-sm text-gray-900 font-medium">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">📅 Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedMessage.createdAt)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">💬 Message</label>
                  <div className="mt-1 p-4 bg-gray-50 border rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {selectedMessage.replied && selectedMessage.replyMessage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">✅ Previous Reply</label>
                    <div className="mt-1 p-4 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedMessage.replyMessage}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        📤 Sent: {formatDate(selectedMessage.repliedAt)} by {selectedMessage.repliedBy}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reply Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💌 Compose Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your reply here... (This will be saved to Firebase and the user's email will be copied to clipboard for manual sending)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: After saving, the user's email will be copied to your clipboard so you can send them a manual email.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex space-x-2">
                  {selectedMessage.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                    >
                      👁️ Mark as Read
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim() || sending}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? '⏳ Saving...' : '💌 Save Reply & Copy Email'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Ana Sayfa Bileşeni - Temizlenmiş Admin Messages Page
export default function AdminMessagesPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // 🔐 Admin Authentication Check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    
    // Admin access check - you can make this stricter
    if (user && !user.email?.includes("admin")) {
      // Uncomment for stricter admin access
      // alert("❌ Admin access required!");
      // router.push("/");
      // return;
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin messages...</p>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please login to access admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        
        {/* 🏠 Navigation Header */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
            <Link 
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            >
              ← Back to Admin Dashboard
            </Link>
          </div>
          
          {/* 👤 Admin info display */}
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-medium">{user?.email}</span>
          </div>
        </div>
        
        {/* 📊 Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 Contact Messages Management</h1>
          <p className="text-gray-600">View, respond to, and manage contact messages from users</p>
        </div>

        {/* Messages Management */}
        <AdminMessagesManagement />
        
        {/* 📊 Real-time connection indicator */}
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-green-100 border border-green-200 rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center text-sm text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Connected to Firebase
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}