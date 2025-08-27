// lib/firebase/listings.ts
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  doc,
  getDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase'; // @/lib/firebase yerine ../firebase kullanın

// Types
export type ListingStatus = 'active' | 'sold' | 'archived' | 'draft';

export interface Listing {
  id?: string;
  title: string;
  price: number;
  vendorId: string;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Sold fields (added when status = 'sold')
  soldAt?: Date;
  buyerId?: string;
  soldInOrder?: string;
  
  // Other listing fields
  description?: string;
  images?: string[];
  category?: string;
  condition?: string;
  shippingInfo?: any;
}

// Get active listings only (for main page)
export async function getActiveListings(): Promise<Listing[]> {
  try {
    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Listing;
    });
  } catch (error) {
    console.error('Error getting active listings:', error);
    throw new Error('Failed to get active listings');
  }
}

// Get all listings for admin (active + sold)
export async function getAllListings(): Promise<Listing[]> {
  try {
    const q = query(
      collection(db, 'listings'),
      where('status', 'in', ['active', 'sold']),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Listing;
    });
  } catch (error) {
    console.error('Error getting all listings:', error);
    throw new Error('Failed to get all listings');
  }
}

// Get vendor's listings (active + sold)
export async function getVendorListings(vendorId: string): Promise<Listing[]> {
  try {
    const q = query(
      collection(db, 'listings'),
      where('vendorId', '==', vendorId),
      where('status', 'in', ['active', 'sold']),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as Listing;
    });
  } catch (error) {
    console.error('Error getting vendor listings:', error);
    throw new Error('Failed to get vendor listings');
  }
}

// Get single listing by ID
export async function getListingById(listingId: string): Promise<Listing | null> {
  try {
    const docRef = doc(db, 'listings', listingId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        soldAt: data.soldAt instanceof Timestamp ? data.soldAt.toDate() : data.soldAt
      } as Listing;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting listing by ID:', error);
    throw new Error('Failed to get listing');
  }
}

// Mark listing as sold - GÜNCELLENDİ
export async function markListingAsSold(
  listingId: string, 
  buyerId: string | null, 
  orderId: string
): Promise<void> {
  try {
    console.log(`Attempting to mark listing ${listingId} as sold...`);
    console.log(`Buyer ID: ${buyerId}, Order ID: ${orderId}`);
    
    const listingRef = doc(db, 'listings', listingId);
    
    // Önce mevcut belgeyi kontrol et
    const docSnap = await getDoc(listingRef);
    if (!docSnap.exists()) {
      throw new Error(`Listing with ID ${listingId} not found`);
    }
    
    const currentData = docSnap.data();
    console.log('Current listing data:', currentData);
    
    // Güncelleme verilerini hazırla
    const updateData: any = {
      status: 'sold',
      soldAt: new Date(),
      soldInOrder: orderId,
      updatedAt: new Date()
    };
    
    // Sadece authenticated kullanıcılar için buyerId ekle
    if (buyerId) {
      updateData.buyerId = buyerId;
    }
    
    console.log('Update data:', updateData);
    
    // Güncellemeyi gerçekleştir
    await updateDoc(listingRef, updateData);
    console.log(`Successfully marked listing ${listingId} as sold`);
    
    // Güncelleme sonrası kontrol
    const updatedDoc = await getDoc(listingRef);
    console.log('Updated listing data:', updatedDoc.data());
    
  } catch (error: any) {
    console.error(`Error marking listing ${listingId} as sold:`, error);
    
    // Firebase hatası detayları
    if (error.code === 'permission-denied') {
      console.error('Permission denied. User:', buyerId, 'Listing:', listingId);
      throw new Error('Permission denied. You do not have permission to update this listing.');
    } else if (error.code === 'not-found') {
      console.error('Listing not found:', listingId);
      throw new Error('Listing not found.');
    } else {
      console.error('Unknown error:', error);
      throw new Error(`Failed to mark listing as sold: ${error.message || 'Unknown error'}`);
    }
  }
}

// Get sold listings (for analytics/reports)
export async function getSoldListings(): Promise<Listing[]> {
  try {
    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'sold'),
      orderBy('soldAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        soldAt: data.soldAt instanceof Timestamp ? data.soldAt.toDate() : data.soldAt
      } as Listing;
    });
  } catch (error) {
    console.error('Error getting sold listings:', error);
    throw new Error('Failed to get sold listings');
  }
}