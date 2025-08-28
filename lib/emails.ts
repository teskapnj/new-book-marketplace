// lib/emails.ts
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface TrackingEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
}

interface OrderConfirmationData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  shippingAddress: any;
}

interface DeliveryConfirmationData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  deliveredDate: string;
  trackingNumber: string;
}

// Send order confirmation email (when order is purchased)
export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  try {
    await addDoc(collection(db, 'mail'), {
      to: data.customerEmail,
      subject: `Order Confirmed - ${data.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Order Confirmed!</h2>
          
          <p>Hi ${data.customerName},</p>
          
          <p>Thank you for your order! We've received your payment and are preparing your items for shipment.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Total:</strong> ${data.totalAmount.toFixed(2)}</p>
            <p><strong>Items:</strong> ${data.items.length} item(s)</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <p>Your order is being processed and will be shipped within 1-2 business days. We'll send you tracking information once shipped.</p>
          </div>
          
          <p>Thank you for choosing our marketplace!</p>
        </div>
      `,
      createdAt: serverTimestamp()
    });

    console.log('Order confirmation email queued for:', data.customerEmail);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

// Send tracking notification email (when order is shipped)
export async function sendTrackingEmail(data: TrackingEmailData) {
  try {
    await addDoc(collection(db, 'mail'), {
      to: data.customerEmail,
      subject: `Your order has shipped - ${data.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Order is On Its Way!</h2>
          
          <p>Hi ${data.customerName},</p>
          
          <p>Great news! Your order <strong>${data.orderNumber}</strong> has been shipped.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Tracking Information</h3>
            <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
            <p><strong>Carrier:</strong> ${data.carrier.toUpperCase()}</p>
            <p style="margin-top: 20px;">
              <a href="${data.trackingUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Track Your Package</a>
            </p>
          </div>
          
          <p>You can track your package using the link above.</p>
          
          <p>Thank you for your business!</p>
        </div>
      `,
      createdAt: serverTimestamp()
    });

    console.log('Tracking email queued for:', data.customerEmail);
  } catch (error) {
    console.error('Error sending tracking email:', error);
    throw error;
  }
}

// Send delivery confirmation email (when order is delivered)
export async function sendDeliveryConfirmationEmail(data: DeliveryConfirmationData) {
  try {
    await addDoc(collection(db, 'mail'), {
      to: data.customerEmail,
      subject: `Your order has been delivered - ${data.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Package Delivered!</h2>
          
          <p>Hi ${data.customerName},</p>
          
          <p>Your order <strong>${data.orderNumber}</strong> has been successfully delivered on ${data.deliveredDate}.</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Delivery Confirmation</h3>
            <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
            <p><strong>Delivered:</strong> ${data.deliveredDate}</p>
            <p style="color: #059669; font-weight: bold;">✓ Package delivered successfully</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">How was your experience?</h3>
            <p>We'd love to hear about your experience. Consider leaving a review to help other customers!</p>
          </div>
          
          <p>If you have any issues with your order, please contact us within 7 days.</p>
          
          <p>Thank you for choosing our marketplace!</p>
        </div>
      `,
      createdAt: serverTimestamp()
    });

    console.log('Delivery confirmation email queued for:', data.customerEmail);
  } catch (error) {
    console.error('Error sending delivery confirmation email:', error);
    throw error;
  }
}

// Email integration points:

// 1. Order confirmation - Call this when order is paid
// Usage: await sendOrderConfirmationEmail({
//   customerEmail: orderData.customerInfo.email,
//   customerName: orderData.customerInfo.fullName || 'Customer',
//   orderNumber: orderData.orderNumber,
//   items: orderData.items,
//   totalAmount: orderData.totalAmount,
//   shippingAddress: orderData.shippingAddress
// });

// 2. Shipping notification - Call this when admin adds tracking (already implemented in add-tracking API)
// Usage: await sendTrackingEmail({
//   customerEmail: orderData.customerInfo.email,
//   customerName: orderData.customerInfo.fullName || 'Customer',
//   orderNumber: orderData.orderNumber,
//   trackingNumber: trackingNumber,
//   carrier: carrier,
//   trackingUrl: getTrackingUrl(carrier, trackingNumber)
// });

// 3. Delivery confirmation - Call this in webhook when status becomes 'DELIVERED'
// Usage: await sendDeliveryConfirmationEmail({
//   customerEmail: orderData.customerInfo.email,
//   customerName: orderData.customerInfo.fullName || 'Customer',
//   orderNumber: orderData.orderNumber,
//   deliveredDate: new Date().toLocaleDateString(),
//   trackingNumber: trackingData.tracking_number
// });