'use client';

import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  setDoc,
  DocumentData,
  getDocs,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

// Mesaj tipi
interface Message {
  id: string;
  text: string;
  senderId: string;
  senderRole: 'seller' | 'admin';
  createdAt: any; // Firestore timestamp
}

const SellerMessageWidget = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Widget açıldığında konuşmayı bul veya oluştur
  useEffect(() => {
    if (!user || !isOpen) {
      setConversationId(null);
      setMessages([]);
      setIsLoadingConversation(false);
      return;
    }

    const findOrCreateConversation = async () => {
      setIsLoadingConversation(true);
      try {
        // 1. Önce bu satıcı için bir konuşma var mı diye kontrol et
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, where('participants', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);

        let currentConversationId: string | null = null;

        if (!querySnapshot.empty) {
          // Konuşma bulundu, ID'sini al
          currentConversationId = querySnapshot.docs[0].id;
        } else {
          // Konuşma bulunamadı, yenisini oluştur
          const newConversationRef = doc(conversationsRef);
          await setDoc(newConversationRef, {
            participants: [user.uid, 'admin'], // Admini de katılımcı olarak ekle
            lastMessage: '',
            lastUpdated: serverTimestamp(),
          });
          currentConversationId = newConversationRef.id;
        }
        
        setConversationId(currentConversationId);
      } catch (err) {
        console.error('Konuşma bulunurken/oluşturulurken hata:', err);
      } finally {
        setIsLoadingConversation(false);
      }
    };

    findOrCreateConversation();
  }, [user, isOpen]);

  // Konuşma ID'si belirlendiğinde mesajları dinle
  useEffect(() => {
    if (!conversationId) return;

    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = [];
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

  // Yeni mesaj gelince veya gönderilince aşağı kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !conversationId || !newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      
      // 1. Yeni mesajı ekle
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: user.uid,
        senderRole: 'seller',
        createdAt: serverTimestamp(),
      });

      // 2. Üst düzey konuşma belgesini güncelle (son mesaj ve zamanı)
      const conversationRef = doc(db, 'conversations', conversationId);
      await setDoc(
        conversationRef,
        {
          lastMessage: newMessage,
          lastUpdated: serverTimestamp(),
        },
        { merge: true } // Sadece belirtilen alanları güncellemek için
      );

      setNewMessage('');
    } catch (err) {
      console.error('Mesaj gönderilirken hata oluştu: ', err);
      alert('Mesaj gönderilemedi.');
    } finally {
      setIsSending(false);
    }
  };

  // Kullanıcı yükleniyorsa veya oturum açmamışsa hiçbir şey gösterme
  if (loading || !user || error) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col transition-all duration-300 ease-out">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Admin ile Sohbet</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-3 h-64 overflow-y-auto bg-gray-50">
            {isLoadingConversation ? (
              <p className="text-gray-500 text-center text-sm">Sohbet yükleniyor...</p>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">Henüz bir mesaj yok. İlk mesajı siz gönderin.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`mb-3 flex ${msg.senderRole === 'seller' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${msg.senderRole === 'seller' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-gray-300 text-gray-800 rounded-bl-none'}`}>
                    {msg.text}
                    <div className={`text-xs mt-1 block ${msg.senderRole === 'seller' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isSending || isLoadingConversation}
            />
            <button
              type="submit"
              disabled={isSending || !newMessage.trim() || isLoadingConversation}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium disabled:bg-blue-400 hover:bg-blue-700 transition-colors"
            >
              {isSending ? '...' : 'Gönder'}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-2xl transition-transform hover:scale-110"
        aria-label={isOpen ? "Sohbeti kapat" : "Admin ile sohbet et"}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default SellerMessageWidget;