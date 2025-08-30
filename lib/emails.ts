// lib/emails.ts - SIMPLE & EFFECTIVE EMAIL TEMPLATES
import { db } from './firebaseAdmin';

interface OrderConfirmationData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  shippingAddress: any;
}

interface TrackingEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
}

interface DeliveryConfirmationData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  deliveredDate: string;
  trackingNumber: string;
}

// Basit ve uyumlu email stil
const getEmailTemplate = (content: string, primaryColor: string = '#4f46e5') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 20px;
      background: #f8fafc;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header { 
      background: ${primaryColor}; 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 600; 
    }
    .content { 
      padding: 30px; 
    }
    .card { 
      background: #f8fafc; 
      padding: 20px; 
      border-radius: 6px; 
      margin: 20px 0;
      border-left: 4px solid ${primaryColor};
    }
    .info-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px 0; 
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child { border-bottom: none; }
    .label { font-weight: 500; color: #6b7280; }
    .value { font-weight: 600; color: #111827; }
    .button { 
      display: inline-block; 
      background: ${primaryColor}; 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: 500;
      margin: 20px 0;
    }
    .steps { 
      background: #fef3c7; 
      padding: 20px; 
      border-radius: 6px; 
      margin: 20px 0;
    }
    .step { 
      display: flex; 
      align-items: center; 
      margin: 12px 0;
    }
    .step-number { 
      background: #f59e0b; 
      color: white; 
      width: 24px; 
      height: 24px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 12px; 
      font-weight: bold; 
      margin-right: 12px;
    }
    .footer { 
      background: #f9fafb; 
      padding: 20px; 
      text-align: center; 
      color: #6b7280; 
      font-size: 14px;
    }
    @media (max-width: 600px) {
      .container { margin: 0; border-radius: 0; }
      .content { padding: 20px; }
      .info-row { flex-direction: column; }
      .value { margin-top: 4px; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
`;

export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  try {
    // Email zaten gönderilmiş mi kontrol et
    const existingEmails = await db.collection('mail')
      .where('to', '==', data.customerEmail)
      .where('orderNumber', '==', data.orderNumber)
      .where('emailType', '==', 'order_confirmation')
      .limit(1)
      .get();

    if (!existingEmails.empty) {
      console.log(`Email already exists for order: ${data.orderNumber}`);
      return { success: true, alreadyExists: true };
    }

    const emailContent = `
      <div class="header">
        <h1>🎉 Order Confirmed!</h1>
        <p>Hi ${data.customerName}, thank you for your order!</p>
      </div>
      
      <div class="content">
        <p>We've received your payment and are preparing your items for shipment.</p>
        
        <div class="card">
          <h3 style="margin-top: 0; color: #374151;">📦 Order Details</h3>
          <div class="info-row">
            <span class="label">Order Number:</span>
            <span class="value">#${data.orderNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Total Amount:</span>
            <span class="value">$${data.totalAmount.toFixed(2)}</span>
          </div>
          <div class="info-row">
            <span class="label">Items:</span>
            <span class="value">${data.items.length} item(s)</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value" style="color: #059669;">✅ Payment Received</span>
          </div>
        </div>

        <div class="steps">
          <h4 style="margin-top: 0; color: #92400e;">🚀 What's Next?</h4>
          <div class="step">
            <div class="step-number">1</div>
            <span>We're preparing your items with care</span>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <span>Shipping within 1-2 business days</span>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <span>You'll receive tracking information</span>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="mailto:support@yourstore.com" class="button">Contact Support</a>
        </div>
      </div>

      <div class="footer">
        <p><strong>Thank you for choosing our marketplace! 💙</strong></p>
        <p>Questions? Reply to this email or contact support@yourstore.com</p>
      </div>
    `;

    await db.collection('mail').add({
      to: data.customerEmail,
      orderNumber: data.orderNumber,
      emailType: 'order_confirmation',
      createdAt: new Date(),
      status: 'pending',
      message: {
        subject: `🎉 Order Confirmed - ${data.orderNumber}`,
        html: getEmailTemplate(emailContent, '#059669'),
        text: `Order Confirmed - ${data.orderNumber}

Hi ${data.customerName},

Thank you for your order! We've received your payment and are preparing your items for shipment.

Order Details:
• Order Number: #${data.orderNumber}
• Total: $${data.totalAmount.toFixed(2)}
• Items: ${data.items.length} item(s)
• Status: ✅ Payment Received

What's Next?
1. We're preparing your items with care
2. Shipping within 1-2 business days  
3. You'll receive tracking information

Questions? Contact support@yourstore.com`
      }
    });
    
    console.log(`Order confirmation email queued for: ${data.customerEmail}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

export async function sendTrackingEmail(data: TrackingEmailData) {
  try {
    const existingEmails = await db.collection('mail')
      .where('to', '==', data.customerEmail)
      .where('orderNumber', '==', data.orderNumber)
      .where('emailType', '==', 'tracking_notification')
      .limit(1)
      .get();

    if (!existingEmails.empty) {
      console.log(`Tracking email already exists for order: ${data.orderNumber}`);
      return { success: true, alreadyExists: true };
    }

    const emailContent = `
      <div class="header">
        <h1>🚚 Package Shipped!</h1>
        <p>Hi ${data.customerName}, your order is on its way!</p>
      </div>
      
      <div class="content">
        <p>Great news! Your order <strong>#${data.orderNumber}</strong> has been shipped and is now on its way to you.</p>
        
        <div class="card">
          <h3 style="margin-top: 0; color: #374151;">📍 Tracking Information</h3>
          <div class="info-row">
            <span class="label">Order Number:</span>
            <span class="value">#${data.orderNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Tracking Number:</span>
            <span class="value">${data.trackingNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Carrier:</span>
            <span class="value">${data.carrier.toUpperCase()}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value" style="color: #2563eb;">🚚 In Transit</span>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${data.trackingUrl}" class="button">Track Your Package</a>
        </div>

        <div class="steps">
          <h4 style="margin-top: 0; color: #92400e;">⏱️ Delivery Timeline</h4>
          <div class="step">
            <div class="step-number">✓</div>
            <span>Package picked up and in transit</span>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <span>Arriving at local facility</span>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <span>Out for delivery & delivered!</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <p><strong>Questions about your shipment?</strong></p>
        <p>Tracking: ${data.trackingNumber} | Contact: support@yourstore.com</p>
      </div>
    `;

    await db.collection('mail').add({
      to: data.customerEmail,
      orderNumber: data.orderNumber,
      trackingNumber: data.trackingNumber,
      emailType: 'tracking_notification',
      createdAt: new Date(),
      status: 'pending',
      message: {
        subject: `🚚 Package Shipped - ${data.orderNumber}`,
        html: getEmailTemplate(emailContent, '#2563eb'),
        text: `Package Shipped - ${data.orderNumber}

Hi ${data.customerName},

Your order #${data.orderNumber} has been shipped!

Tracking Info:
• Tracking: ${data.trackingNumber}
• Carrier: ${data.carrier.toUpperCase()}
• Status: 🚚 In Transit

Track: ${data.trackingUrl}

Timeline:
✓ Package in transit
2. Arriving at local facility
3. Out for delivery & delivered!

Questions? Contact support@yourstore.com`
      }
    });
    
    console.log(`Tracking email queued for: ${data.customerEmail}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error sending tracking email:', error);
    throw error;
  }
}

export async function sendDeliveryConfirmationEmail(data: DeliveryConfirmationData) {
  try {
    const existingEmails = await db.collection('mail')
      .where('to', '==', data.customerEmail)
      .where('orderNumber', '==', data.orderNumber)
      .where('emailType', '==', 'delivery_confirmation')
      .limit(1)
      .get();

    if (!existingEmails.empty) {
      console.log(`Delivery email already exists for order: ${data.orderNumber}`);
      return { success: true, alreadyExists: true };
    }

    const emailContent = `
      <div class="header">
        <h1>🎁 Package Delivered!</h1>
        <p>Hi ${data.customerName}, your order has arrived!</p>
      </div>
      
      <div class="content">
        <p>Your order <strong>#${data.orderNumber}</strong> has been successfully delivered. Time to enjoy your purchase!</p>
        
        <div class="card">
          <h3 style="margin-top: 0; color: #374151;">✅ Delivery Confirmation</h3>
          <div class="info-row">
            <span class="label">Order Number:</span>
            <span class="value">#${data.orderNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Tracking Number:</span>
            <span class="value">${data.trackingNumber}</span>
          </div>
          <div class="info-row">
            <span class="label">Delivered Date:</span>
            <span class="value">${data.deliveredDate}</span>
          </div>
          <div class="info-row">
            <span class="label">Status:</span>
            <span class="value" style="color: #059669;">✅ Delivered Successfully</span>
          </div>
        </div>

        <div class="steps" style="background: #ecfdf5; border-left-color: #10b981;">
          <h4 style="margin-top: 0; color: #047857;">💚 How was your experience?</h4>
          <div class="step">
            <div class="step-number" style="background: #10b981;">⭐</div>
            <span>Leave a review to help other customers</span>
          </div>
          <div class="step">
            <div class="step-number" style="background: #10b981;">📷</div>
            <span>Share on social media</span>
          </div>
          <div class="step">
            <div class="step-number" style="background: #10b981;">💬</div>
            <span>Contact us within 7 days for any issues</span>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="#" class="button" style="background: #10b981;">Leave a Review</a>
        </div>
      </div>

      <div class="footer">
        <p><strong>Thank you for choosing us! 💚</strong></p>
        <p>Order: #${data.orderNumber} | Need help? support@yourstore.com</p>
      </div>
    `;

    await db.collection('mail').add({
      to: data.customerEmail,
      orderNumber: data.orderNumber,
      trackingNumber: data.trackingNumber,
      emailType: 'delivery_confirmation',
      createdAt: new Date(),
      status: 'pending',
      message: {
        subject: `🎁 Package Delivered - ${data.orderNumber}`,
        html: getEmailTemplate(emailContent, '#10b981'),
        text: `Package Delivered - ${data.orderNumber}

Hi ${data.customerName},

Your order #${data.orderNumber} has been delivered successfully!

Delivery Info:
• Tracking: ${data.trackingNumber}
• Delivered: ${data.deliveredDate}
• Status: ✅ Delivered Successfully

How was your experience?
⭐ Leave a review
📷 Share on social media  
💬 Contact us within 7 days for issues

Thank you for choosing us! 💚
Questions? support@yourstore.com`
      }
    });
    
    console.log(`Delivery confirmation email queued for: ${data.customerEmail}`);
    return { success: true };
    
  } catch (error) {
    console.error('Error sending delivery confirmation email:', error);
    throw error;
  }
}