// lib/firebase/orders.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types
export interface Order {
  id?: string;
  userId?: string; // Optional for guest users
  guestEmail?: string; // For guest users
  orderNumber: string;
  totalAmount: number;
  subtotal: number;
  shippingTotal: number;
  marketplaceFee: number;
  taxTotal: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  customerInfo: {
    email: string;
    fullName?: string;
    phone?: string;
  };
  items: OrderItem[];
  vendorBreakdown: VendorOrderBreakdown[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  sellerId: string;
  title: string;
  price: number;
  image?: string;
  shippingCost: number;
}

export interface VendorOrderBreakdown {
  sellerId: string;
  items: any[];
  subtotal: number;
  shippingCost: number;
  itemCount: number;
}

// Generate unique order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
}

const ORDERS_COLLECTION = 'orders';

// Create a new order
export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const order: Omit<Order, 'id'> = {
      ...orderData,
      orderNumber: generateOrderNumber(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), order);
    console.log('Order created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // FIXED: Safe date conversion
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw new Error('Failed to get order');
  }
}

// Get orders by user ID
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        // FIXED: Safe date conversion
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw new Error('Failed to get user orders');
  }
}

// Get orders by guest email
export async function getOrdersByGuestEmail(email: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('guestEmail', '==', email),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting guest orders:', error);
    throw new Error('Failed to get guest orders');
  }
}

// Get orders by seller ID (for vendor dashboard)
export async function getOrdersBySellerId(sellerId: string): Promise<Order[]> {
  try {
    // Note: This is a complex query, might need restructuring for better performance
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(100) // Limit to prevent large reads
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filter orders that contain this seller's items
      const hasSellerItems = data.vendorBreakdown?.some((vendor: VendorOrderBreakdown) => vendor.sellerId === sellerId);
      
      if (hasSellerItems) {
        orders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        } as Order);
      }
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting seller orders:', error);
    throw new Error('Failed to get seller orders');
  }
}

// Get all orders (for admin dashboard)
export async function getAllOrders(limitCount: number = 50): Promise<Order[]> {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw new Error('Failed to get all orders');
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    });
    console.log('Order status updated:', orderId, status);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
}