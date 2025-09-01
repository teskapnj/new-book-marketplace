// lib/userMigration.ts
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    doc, 
    setDoc, 
    deleteDoc,
    serverTimestamp,
    deleteField,
    DocumentData,
    QuerySnapshot,
    DocumentSnapshot,
    FieldValue
  } from "firebase/firestore";
  import { db } from "./firebase";
  import { User } from "firebase/auth";
  
  interface MigrationResult {
    migrated: boolean;
    message: string;
    oldUID?: string;
    restoredData?: {
      totalSales: number;
      totalOrders: number;
      totalListings: number;
    };
    error?: string;
  }
  
  interface UserData {
    uid: string;
    email: string;
    name?: string;
    businessName?: string;
    status: string;
    totalSales: number;
    totalOrders: number;
    totalListings: number;
    balance: number;
    role: string;
    createdAt?: any;
    lastLogin?: any;
    deletedAt?: any;
    deletedBy?: string;
    [key: string]: any;
  }
  
  export const migrateUserDataByEmail = async (email: string, newUID: string): Promise<MigrationResult> => {
    try {
      console.log(`Checking for existing user data for email: ${email}`);
      
      // Aynı email'li mevcut user var mı kontrol et
      const existingUserQuery = query(
        collection(db, "users"), 
        where("email", "==", email)
      );
      
      const existingUserSnapshot: QuerySnapshot<DocumentData> = await getDocs(existingUserQuery);
      
      if (existingUserSnapshot.empty) {
        console.log("No existing user data found");
        return { migrated: false, message: "No previous data found" };
      }
      
      // Birden fazla eşleşme varsa (veri tutarsızlığı durumu)
      if (existingUserSnapshot.size > 1) {
        console.warn("Multiple users found with same email - data inconsistency!");
      }
      
      const existingDoc: DocumentSnapshot<DocumentData> = existingUserSnapshot.docs[0];
      const existingData = existingDoc.data() as UserData;
      const oldUID: string = existingDoc.id;
      
      // Eğer yeni UID zaten mevcutsa, migration'a gerek yok
      if (oldUID === newUID) {
        console.log("User already has correct UID");
        return { migrated: false, message: "User data already current" };
      }
      
      console.log(`Migrating user data from ${oldUID} to ${newUID}`);
      
      // Eski user'ın verilerini yeni UID'ye taşı
      const migratedData: any = {
        ...existingData,
        uid: newUID, // UID'yi güncelle
        status: "active", // Yeniden aktif et
        restoredAt: serverTimestamp(), // Restore zamanını kaydet
        migratedFrom: oldUID, // Hangi UID'den geldiğini kaydet
        // Delete flag'lerini temizle
        deletedAt: deleteField(),
        deletedBy: deleteField(),
        // Update timestamp'ini güncelle
        updatedAt: serverTimestamp()
      };
      
      // Yeni UID ile dokümanı oluştur
      await setDoc(doc(db, "users", newUID), migratedData);
      
      // Eski dokümanı sil
      await deleteDoc(doc(db, "users", oldUID));
      
      // Related collections'ları da güncelle (listings, orders, etc.)
      await updateRelatedCollections(oldUID, newUID);
      
      console.log(`Successfully migrated user data from ${oldUID} to ${newUID}`);
      
      return { 
        migrated: true, 
        message: "Your previous account data has been successfully restored!",
        oldUID,
        restoredData: {
          totalSales: existingData.totalSales || 0,
          totalOrders: existingData.totalOrders || 0,
          totalListings: existingData.totalListings || 0
        }
      };
      
    } catch (error: any) {
      console.error("Error migrating user data:", error);
      return { 
        migrated: false, 
        message: "Error restoring previous data", 
        error: error.message 
      };
    }
  };
  
  // Related collections'ları güncelle (listings, orders, etc.)
  const updateRelatedCollections = async (oldUID: string, newUID: string): Promise<void> => {
    try {
      // Listings collection'ı güncelle
      const listingsQuery = query(
        collection(db, "listings"), 
        where("sellerId", "==", oldUID)
      );
      const listingsSnapshot: QuerySnapshot<DocumentData> = await getDocs(listingsQuery);
      
      const listingUpdates = listingsSnapshot.docs.map(async (listingDoc) => {
        const listingData = listingDoc.data();
        await setDoc(doc(db, "listings", listingDoc.id), {
          ...listingData,
          sellerId: newUID,
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(listingUpdates);
      console.log(`Updated ${listingsSnapshot.size} listings`);
      
      // Orders collection'ı güncelle (seller olarak)
      const ordersQuery = query(
        collection(db, "orders"), 
        where("sellerId", "==", oldUID)
      );
      const ordersSnapshot: QuerySnapshot<DocumentData> = await getDocs(ordersQuery);
      
      const orderUpdates = ordersSnapshot.docs.map(async (orderDoc) => {
        const orderData = orderDoc.data();
        await setDoc(doc(db, "orders", orderDoc.id), {
          ...orderData,
          sellerId: newUID,
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(orderUpdates);
      console.log(`Updated ${ordersSnapshot.size} orders`);
      
      // Messages collection'ı güncelle
      const messagesQuery = query(
        collection(db, "messages"), 
        where("userId", "==", oldUID)
      );
      const messagesSnapshot: QuerySnapshot<DocumentData> = await getDocs(messagesQuery);
      
      const messageUpdates = messagesSnapshot.docs.map(async (messageDoc) => {
        const messageData = messageDoc.data();
        await setDoc(doc(db, "messages", messageDoc.id), {
          ...messageData,
          userId: newUID,
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(messageUpdates);
      console.log(`Updated ${messagesSnapshot.size} messages`);
      
    } catch (error: any) {
      console.error("Error updating related collections:", error);
      // Bu hata migration'ı durdurmamalı, sadece log'lanmalı
    }
  };
  
  // Register/Login sırasında kullanılacak helper function
  export const handleUserMigrationOnAuth = async (user: User): Promise<MigrationResult | null> => {
    if (!user || !user.email) return null;
    
    try {
      const result: MigrationResult = await migrateUserDataByEmail(user.email, user.uid);
      
      if (result.migrated) {
        console.log("User data migration completed:", result);
        return result;
      }
      
      return null;
    } catch (error: any) {
      console.error("Migration check failed:", error);
      return null;
    }
  };