// pages/api/webhooks/shippo-tracking.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, serverTimestamp, Timestamp, addDoc } from 'firebase/firestore';

// TypeScript arayüz tanımlamaları
interface TrackingStatus {
  status: string;
  status_details?: string;
}

interface TrackingHistoryItem {
  status: string;
  status_details?: string;
  status_date: string;
  location?: {
    city?: string;
    state?: string;
  };
}

interface TrackingData {
  tracking_number: string;
  tracking_status?: TrackingStatus;
  tracking_history?: TrackingHistoryItem[];
}

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  isbn?: string;
  condition?: string;
  category?: string;
}

interface VendorBreakdown {
  sellerId: string;
  subtotal: number;
  shippingCost: number;
  items: OrderItem[];
}

interface OrderData {
  status: string;
  vendorBreakdown?: VendorBreakdown[];
  orderNumber?: string;
  customerInfo?: {
    email?: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { event, data } = req.body;
    
    console.log('Received Shippo webhook:', { event, tracking_number: data?.tracking_number });
    
    if (event === 'track_updated') {
      await handleTrackingUpdate(data as TrackingData);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleTrackingUpdate(trackingData: TrackingData) {
  const { tracking_number, tracking_status, tracking_history } = trackingData;
  
  if (!tracking_number) {
    console.error('No tracking number in webhook data');
    return;
  }

  try {
    // Find order by tracking number
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('trackingNumber', '==', tracking_number));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No order found for tracking number: ${tracking_number}`);
      return;
    }

    // Process each matching order
    for (const orderDoc of querySnapshot.docs) {
      const currentOrderData = orderDoc.data() as OrderData;
      
      const updateData: Record<string, unknown> = {
        trackingStatus: tracking_status?.status || 'UNKNOWN',
        trackingHistory: tracking_history?.map((item: TrackingHistoryItem) => ({
          status: item.status,
          message: item.status_details || item.status,
          timestamp: item.status_date ? Timestamp.fromDate(new Date(item.status_date)) : serverTimestamp(),
          location: item.location ? `${item.location.city || ''}, ${item.location.state || ''}`.trim() : undefined
        })) || [],
        lastTracked: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Handle specific status changes
      const status = tracking_status?.status;
      
      if (status === 'DELIVERED') {
        updateData.status = 'delivered';
        updateData.deliveredAt = serverTimestamp();
        
        console.log(`Order ${orderDoc.id} marked as delivered`);
        
        // Schedule vendor payout
        await scheduleVendorPayout(orderDoc.id, currentOrderData);
        
      } else if (status === 'TRANSIT' || status === 'IN_TRANSIT') {
        if (currentOrderData.status !== 'delivered') {
          updateData.status = 'shipped';
        }
        
      } else if (status === 'OUT_FOR_DELIVERY') {
        updateData.status = 'shipped';
        updateData.outForDelivery = true;
        
      } else if (status === 'EXCEPTION' || status === 'FAILURE') {
        updateData.exception = true;
        updateData.exceptionMessage = tracking_status?.status_details || 'Delivery exception';
        console.log(`Tracking exception for order ${orderDoc.id}: ${tracking_status?.status_details}`);
      }

      // Update the order
      await updateDoc(orderDoc.ref, updateData);
      
      console.log(`Order ${orderDoc.id} updated with tracking status: ${status}`);
    }
  } catch (error) {
    console.error('Error handling tracking update:', error);
    throw error;
  }
}

async function scheduleVendorPayout(orderId: string, orderData: OrderData) {
  try {
    // Check if payout already exists
    const existingPayout = await getDocs(
      query(collection(db, 'vendor_payouts'), where('orderId', '==', orderId))
    );
    
    if (!existingPayout.empty) {
      console.log(`Payout already scheduled for order: ${orderId}`);
      return;
    }
    
    // Calculate payout date (7 days after delivery)
    const payoutDate = new Date();
    payoutDate.setDate(payoutDate.getDate() + 7);
    
    // Extract vendor information
    const vendors = orderData.vendorBreakdown || [];
    
    if (vendors.length === 0) {
      console.log('No vendor breakdown found for order:', orderId);
      return;
    }
    
    // Create payout records for each vendor
    for (const vendor of vendors) {
      const payoutData = {
        orderId,
        vendorId: vendor.sellerId,
        orderNumber: orderData.orderNumber || orderId,
        amount: vendor.subtotal || 0,
        shippingAmount: vendor.shippingCost || 0,
        totalPayout: (vendor.subtotal || 0) + (vendor.shippingCost || 0),
        status: 'scheduled',
        scheduledAt: Timestamp.fromDate(payoutDate),
        createdAt: serverTimestamp(),
        deliveredAt: serverTimestamp(),
        customerEmail: orderData.customerInfo?.email,
        items: vendor.items || []
      };
      
      // Add to vendor_payouts collection
      await addDoc(collection(db, 'vendor_payouts'), payoutData);
    }
    
    console.log(`Vendor payouts scheduled for ${vendors.length} vendors, order: ${orderId}`);
  } catch (error) {
    console.error('Error scheduling vendor payout:', error);
    throw error;
  }
}