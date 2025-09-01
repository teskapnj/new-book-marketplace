// File: /components/SellerManagement.tsx
"use client";
import { useState, useEffect, useRef } from "react";
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
  where,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  writeBatch,
  orderBy
} from "firebase/firestore";
import { FiHome, FiMail, FiPhone, FiMapPin, FiDollarSign, FiPackage, FiEye, FiEdit, FiTrash2, FiLock, FiUnlock, FiUserCheck, FiUserX, FiMessageSquare, FiX, FiRefreshCw } from "react-icons/fi";
import Link from "next/link";

// Seller Interface
interface Seller {
  id: string;
  userId: string;
  name?: string;
  businessName: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: "active" | "suspended" | "pending";
  totalSales: number;
  totalOrders: number;
  totalListings: number;
  commissionRate: number;
  balance: number;
  createdAt: any;
  lastLogin?: any;
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  documents?: {
    businessLicense?: string;
    taxId?: string;
  };
}

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ 
  seller, 
  onClose, 
  onDelete 
}: { 
  seller: Seller; 
  onClose: () => void;
  onDelete: () => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const handleDelete = () => {
    setIsProcessing(true);
    onDelete();
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Delete Seller</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Are you sure you want to delete <strong>{seller.name || seller.businessName}</strong>?
          </p>
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-800 text-sm">
              This action cannot be undone. The seller will lose access to their account and all their data will be permanently deleted.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isProcessing}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Deleting..." : "Delete Seller"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Seller Message Indicator Component
const SellerMessageIndicator = ({ sellerId, onOpenChat }: { 
  sellerId: string; 
  onOpenChat: () => void;
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const conversationsRef = collection(db, 'conversations');
    const q = query(conversationsRef, where('participants', 'array-contains', sellerId));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.empty) {
        setUnreadCount(0);
        setLoading(false);
        return;
      }
      
      // For each conversation, check for unread messages
      let totalUnread = 0;
      
      for (const docSnapshot of querySnapshot.docs) {
        const conversationId = docSnapshot.id;
        const conversationData = docSnapshot.data();
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const messagesQuery = query(
          messagesRef, 
          where('senderRole', '==', 'seller'),
          where('senderId', '==', sellerId)
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        
        // Count unread messages (messages without admin replies)
        messagesSnapshot.forEach(messageDoc => {
          const messageData = messageDoc.data();
          // Check if there's an admin reply after this message
          const nextMessagesQuery = query(
            messagesRef,
            where('createdAt', '>', messageData.createdAt),
            where('senderRole', '==', 'admin')
          );
          
          // This is a simplified approach - in a real app you might want to track read status
          // For now, we'll count all seller messages as unread until there's an admin reply
          totalUnread += 1;
        });
      }
      
      setUnreadCount(totalUnread);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [sellerId]);

  if (loading) {
    return <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  return (
    <button
      onClick={onOpenChat}
      className="relative inline-flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      title={`${unreadCount} unread messages`}
    >
      <FiMessageSquare className="w-5 h-5" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full min-w-[18px]">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

// Seller Chat Modal Component
const SellerChatModal = ({ 
  seller, 
  onClose,
  onMarkAsRead
}: { 
  seller: Seller; 
  onClose: () => void;
  onMarkAsRead: () => void;
}) => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find or create conversation
  useEffect(() => {
    if (!user || !seller) return;
    
    const findOrCreateConversation = async () => {
      setIsLoadingConversation(true);
      try {
        // Check if conversation exists
        const conversationsRef = collection(db, 'conversations');
        const q = query(
          conversationsRef, 
          where('participants', 'array-contains', seller.id)
        );
        const querySnapshot = await getDocs(q);
        
        let currentConversationId: string | null = null;
        
        if (!querySnapshot.empty) {
          // Conversation found
          currentConversationId = querySnapshot.docs[0].id;
        } else {
          // Create new conversation
          const newConversationRef = doc(conversationsRef);
          await setDoc(newConversationRef, {
            participants: [seller.id, 'admin'],
            lastMessage: '',
            lastUpdated: serverTimestamp(),
          });
          currentConversationId = newConversationRef.id;
        }
        
        setConversationId(currentConversationId);
        
        // Mark conversation as read when opened
        if (currentConversationId) {
          onMarkAsRead();
        }
      } catch (err) {
        console.error('Error finding/creating conversation:', err);
      } finally {
        setIsLoadingConversation(false);
      }
    };
    
    findOrCreateConversation();
  }, [user, seller, onMarkAsRead]);

  // Load messages
  useEffect(() => {
    if (!conversationId) return;
    
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedMessages.push({
          id: doc.id,
          text: data.text,
          senderId: data.senderId,
          senderRole: data.senderRole,
          createdAt: data.createdAt,
        });
      });
      setMessages(fetchedMessages);
    });
    
    return () => unsubscribe();
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !conversationId || !newMessage.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      
      // Add new message
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderRole: 'admin',
        createdAt: serverTimestamp(),
      });
      
      // Update conversation document
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: newMessage,
        lastUpdated: serverTimestamp(),
      });
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    if (!conversationId) return;
    
    setIsClearing(true);
    
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const messagesQuery = query(messagesRef);
      const querySnapshot = await getDocs(messagesQuery);
      
      if (querySnapshot.empty) {
        setMessages([]);
        setIsClearing(false);
        return;
      }
      
      // Create a batch to delete all messages
      const batch = writeBatch(db);
      
      // Add all message documents to the batch for deletion
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Update the conversation document to clear last message
      const conversationRef = doc(db, 'conversations', conversationId);
      batch.update(conversationRef, {
        lastMessage: '',
        lastUpdated: serverTimestamp()
      });
      
      // Commit the batch
      await batch.commit();
      
      // Clear local state
      setMessages([]);
      
      console.log('Chat cleared successfully from Firestore');
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('Failed to clear chat. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative mx-auto p-5 border w-11/12 max-w-3xl shadow-2xl rounded-lg bg-white flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Chat with {seller.name || seller.businessName}
            </h3>
            <p className="text-sm text-gray-500">{seller.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearChat}
              disabled={isClearing || messages.length === 0}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear all messages from chat"
            >
              {isClearing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Clearing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="w-4 h-4 mr-1" />
                  Clear
                </>
              )}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              <FiX />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 mb-4">
          {isLoadingConversation ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-4 flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderRole === 'admin' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-gray-300 text-gray-800 rounded-bl-none'}`}
                >
                  <div className="text-sm">{msg.text}</div>
                  <div className={`text-xs mt-1 ${msg.senderRole === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isSending || isLoadingConversation}
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim() || isLoadingConversation}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg font-medium disabled:bg-blue-400 hover:bg-blue-700 transition-colors"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

const SellerManagement = () => {
  const [user] = useAuthState(auth);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [chatSeller, setChatSeller] = useState<Seller | null>(null);
  const [messageIndicators, setMessageIndicators] = useState<{[key: string]: number}>({});
  
  // Mevcut kullanıcının rolünü kontrol et
  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const unsubscribeUser = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setCurrentUserRole(doc.data().role);
        }
      });
      return () => unsubscribeUser();
    } else {
      setCurrentUserRole(null);
    }
  }, [user]);
  
  // Fetch sellers data
  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "seller"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sellersData: Seller[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        sellersData.push({
          id: docSnapshot.id,
          userId: docSnapshot.id,
          name: data.name || "",
          businessName: data.businessName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: ""
          },
          status: data.status || "pending",
          totalSales: data.totalSales || 0,
          totalOrders: data.totalOrders || 0,
          totalListings: data.totalListings || 0,
          commissionRate: data.commissionRate || 10,
          balance: data.balance || 0,
          createdAt: data.createdAt,
          lastLogin: data.lastLogin,
          bankAccount: data.bankAccount,
          documents: data.documents
        });
      });
      
      // Verileri createdAt'e göre sırala
      sellersData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toDate() - a.createdAt.toDate();
        }
        return 0;
      });
      
      setSellers(sellersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching sellers:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // İzin kontrolü için yardımcı fonksiyon
  const hasAdminPermission = () => {
    return currentUserRole === "admin";
  };
  
  // Filter sellers
  let filteredSellers = sellers;
  
  if (filterStatus !== "all") {
    filteredSellers = filteredSellers.filter(seller => seller.status === filterStatus);
  }
  
  if (searchTerm) {
    filteredSellers = filteredSellers.filter(seller => 
      (seller.name && seller.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSellers.slice(indexOfFirstItem, indexOfLastItem);
  
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredSellers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  
  // Seller actions
  const toggleSellerStatus = async (sellerId: string, currentStatus: string) => {
    if (!hasAdminPermission()) {
      alert("You don't have permission to perform this action");
      return;
    }
    
    setIsProcessing(true);
    try {
      const userRef = doc(db, "users", sellerId);
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      
      await updateDoc(userRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email
      });
      
      alert(`Seller ${newStatus === "active" ? "activated" : "suspended"} successfully!`);
    } catch (error) {
      console.error("Error updating seller status:", error);
      alert("Failed to update seller status");
    }
    setIsProcessing(false);
  };
  
  const deleteSeller = async () => {
    if (!hasAdminPermission()) {
      alert("You don't have permission to perform this action");
      return;
    }
    
    if (!selectedSeller) return;
    
    try {
      await updateDoc(doc(db, "users", selectedSeller.id), {
        status: "deleted",
        deletedAt: serverTimestamp(),
        deletedBy: user?.email
      });
      
      alert("Seller deleted successfully!");
      setShowDeleteConfirm(false);
      setSelectedSeller(null);
    } catch (error) {
      console.error("Error deleting seller:", error);
      alert("Failed to delete seller");
    }
    setIsProcessing(false);
  };

  // Mark conversation as read
  const markConversationAsRead = async (sellerId: string) => {
    try {
      const conversationsRef = collection(db, 'conversations');
      const q = query(conversationsRef, where('participants', 'array-contains', sellerId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const conversationId = querySnapshot.docs[0].id;
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, {
          readByAdmin: true,
          readAt: serverTimestamp()
        });
        
        // Update message indicators
        setMessageIndicators(prev => ({
          ...prev,
          [sellerId]: 0
        }));
      }
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800 border-green-200",
      suspended: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    
    const icons = {
      active: <FiUserCheck className="w-4 h-4" />,
      suspended: <FiUserX className="w-4 h-4" />,
      pending: <FiEye className="w-4 h-4" />
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };
  
  // Seller Detail Modal
  const SellerDetailModal = ({ seller, onClose }: { seller: Seller; onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<"info" | "financial" | "documents">("info");
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div className="relative mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Seller Details: {seller.name || seller.businessName}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ✕
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "info"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Information
                </button>
                <button
                  onClick={() => setActiveTab("financial")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "financial"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Financial
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "documents"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Documents
                </button>
              </nav>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeTab === "info" && (
              <>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Business Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p><strong>Name:</strong> {seller.name || "Not provided"}</p>
                      <p><strong>Business Name:</strong> {seller.businessName}</p>
                      <p><strong>Email:</strong> {seller.email}</p>
                      <p><strong>Phone:</strong> {seller.phone || "Not provided"}</p>
                      <p><strong>Status:</strong> {getStatusBadge(seller.status)}</p>
                      <p><strong>Seller ID:</strong> {seller.id}</p>
                      <p><strong>User ID:</strong> {seller.userId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Address</h4>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="text-sm text-gray-700">
                        {seller.address.street}<br />
                        {seller.address.city}, {seller.address.state} {seller.address.zip}<br />
                        {seller.address.country}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Statistics</h4>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Total Sales</p>
                          <p className="text-lg font-bold text-blue-600">${seller.totalSales.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="font-medium">Total Orders</p>
                          <p className="text-lg font-bold text-blue-600">{seller.totalOrders}</p>
                        </div>
                        <div>
                          <p className="font-medium">Total Listings</p>
                          <p className="text-lg font-bold text-blue-600">{seller.totalListings}</p>
                        </div>
                        <div>
                          <p className="font-medium">Commission Rate</p>
                          <p className="text-lg font-bold text-blue-600">{seller.commissionRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Account Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <p><strong>Created:</strong> {seller.createdAt?.toDate().toLocaleDateString()}</p>
                      <p><strong>Last Login:</strong> {seller.lastLogin?.toDate().toLocaleDateString() || "Never"}</p>
                      <p><strong>Current Balance:</strong> ${seller.balance.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === "financial" && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Bank Account Information</h4>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  {seller.bankAccount ? (
                    <div className="space-y-2 text-sm">
                      <p><strong>Bank Name:</strong> {seller.bankAccount.bankName}</p>
                      <p><strong>Account Number:</strong> ****{seller.bankAccount.accountNumber.slice(-4)}</p>
                      <p><strong>Routing Number:</strong> {seller.bankAccount.routingNumber}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No bank account information provided</p>
                  )}
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Financial Summary</h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium">Total Revenue</p>
                        <p className="text-xl font-bold text-blue-600">${seller.totalSales.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Commission Earned</p>
                        <p className="text-xl font-bold text-green-600">${(seller.totalSales * seller.commissionRate / 100).toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Available Balance</p>
                        <p className="text-xl font-bold text-purple-600">${seller.balance.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "documents" && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Business Documents</h4>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  {seller.documents ? (
                    <div className="space-y-3">
                      {seller.documents.businessLicense && (
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <p className="font-medium text-sm">Business License</p>
                            <p className="text-xs text-gray-500">Uploaded document</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                          </button>
                        </div>
                      )}
                      {seller.documents.taxId && (
                        <div className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <p className="font-medium text-sm">Tax ID</p>
                            <p className="text-xs text-gray-500">{seller.documents.taxId}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                          </button>
                        </div>
                      )}
                      {!seller.documents.businessLicense && !seller.documents.taxId && (
                        <p className="text-sm text-gray-500">No documents uploaded</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                {hasAdminPermission() && (
                  <>
                    <button
                      onClick={() => toggleSellerStatus(seller.id, seller.status)}
                      disabled={isProcessing}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        seller.status === "active"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      } disabled:opacity-50`}
                    >
                      {isProcessing ? "Processing..." : seller.status === "active" ? "Suspend" : "Activate"}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FiTrash2 className="w-4 h-4 mr-1 inline" />
                      Delete
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Yetki kontrolü */}
      {!hasAdminPermission() && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                You don't have permission to manage sellers. Please contact an administrator.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Sellers</label>
            <input
              type="text"
              placeholder="Search by name, business name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status ({sellers.length})</option>
              <option value="active">Active ({sellers.filter(s => s.status === "active").length})</option>
              <option value="suspended">Suspended ({sellers.filter(s => s.status === "suspended").length})</option>
              <option value="pending">Pending ({sellers.filter(s => s.status === "pending").length})</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-400">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👤</div>
            <div>
              <p className="text-2xl font-bold text-green-600">{sellers.filter(s => s.status === "active").length}</p>
              <p className="text-sm text-gray-600">Active Sellers</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-400">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🚫</div>
            <div>
              <p className="text-2xl font-bold text-red-600">{sellers.filter(s => s.status === "suspended").length}</p>
              <p className="text-sm text-gray-600">Suspended</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-400">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                ${sellers.reduce((sum, seller) => sum + seller.totalSales, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Sales</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-400">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📦</div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {sellers.reduce((sum, seller) => sum + seller.totalListings, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Listings</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Sellers ({filteredSellers.length})
          </h3>
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSellers.length)} of {filteredSellers.length}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                {hasAdminPermission() && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {seller.name || seller.businessName}
                      </div>
                      {seller.name && seller.businessName && (
                        <div className="text-sm text-gray-500">
                          {seller.businessName}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        ID: {seller.id}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <FiMail className="w-4 h-4 mr-1 text-gray-400" />
                        {seller.email}
                      </div>
                      {seller.phone && (
                        <div className="flex items-center mt-1">
                          <FiPhone className="w-4 h-4 mr-1 text-gray-400" />
                          {seller.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <FiDollarSign className="w-4 h-4 mr-1 text-gray-400" />
                        ${seller.totalSales.toFixed(2)}
                      </div>
                      <div className="flex items-center mt-1">
                        <FiPackage className="w-4 h-4 mr-1 text-gray-400" />
                        {seller.totalListings} listings
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {getStatusBadge(seller.status)}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      ${seller.balance.toFixed(2)}
                    </div>
                  </td>
                  
                  {hasAdminPermission() && (
                    <>
                      <td className="px-6 py-4">
                        <SellerMessageIndicator 
                          sellerId={seller.id} 
                          onOpenChat={() => setChatSeller(seller)} 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedSeller(seller)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                          >
                            <FiEye className="w-3 h-3 mr-1" />
                            View
                          </button>
                          
                          <button
                            onClick={() => toggleSellerStatus(seller.id, seller.status)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md ${
                              seller.status === "active"
                                ? "text-red-600 bg-red-50 hover:bg-red-100"
                                : "text-green-600 bg-green-50 hover:bg-green-100"
                            }`}
                          >
                            {seller.status === "active" ? (
                              <FiUserX className="w-3 h-3 mr-1" />
                            ) : (
                              <FiUserCheck className="w-3 h-3 mr-1" />
                            )}
                            {seller.status === "active" ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state */}
        {filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No sellers have registered yet."
              }
            </p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredSellers.length > itemsPerPage && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(pageNumbers.length, currentPage + 1))}
                disabled={currentPage === pageNumbers.length}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredSellers.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredSellers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    ←
                  </button>
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(pageNumbers.length, currentPage + 1))}
                    disabled={currentPage === pageNumbers.length}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    →
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {selectedSeller && !showDeleteConfirm && (
        <SellerDetailModal 
          seller={selectedSeller} 
          onClose={() => setSelectedSeller(null)} 
        />
      )}
      
      {selectedSeller && showDeleteConfirm && (
        <DeleteConfirmModal 
          seller={selectedSeller} 
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedSeller(null);
          }}
          onDelete={deleteSeller}
        />
      )}
      
      {chatSeller && (
        <SellerChatModal 
          seller={chatSeller} 
          onClose={() => setChatSeller(null)} 
          onMarkAsRead={() => markConversationAsRead(chatSeller.id)}
        />
      )}
    </div>
  );
};

export default SellerManagement;