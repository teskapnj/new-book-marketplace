// app/api/orders/[id]/send-confirmation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebaseAdmin';
import nodemailer from 'nodemailer';

// Create a nodemailer transporter for Namecheap
const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com', // Namecheap Private Email SMTP sunucusu
  port: 465, // SSL için port
  secure: true, // SSL kullanımı için true
  auth: {
    user: process.env.EMAIL_USER, // Namecheap e-posta adresiniz
    pass: process.env.EMAIL_PASS  // Namecheap e-posta şifreniz
  }
});

// Function to send order confirmation email using nodemailer
async function sendOrderConfirmationEmail({
  customerEmail,
  customerName,
  orderNumber,
  items,
  totalAmount,
  shippingAddress
}: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  shippingAddress: any;
}) {
  try {
    // Format items for the email
    const itemsList = items.map((item: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.title || 'Item'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity || 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${(item.price || 0).toFixed(2)}</td>
      </tr>
    `).join('');
    
    // Safely extract shipping address information with fallbacks
    // Updated to match the actual property names in the data
    const safeShippingAddress = {
      fullName: shippingAddress?.fullName || shippingAddress?.name || customerName || 'Customer',
      addressLine1: shippingAddress?.street1 || shippingAddress?.addressLine1 || shippingAddress?.address || shippingAddress?.street || '',
      addressLine2: shippingAddress?.street2 || shippingAddress?.addressLine2 || shippingAddress?.address2 || '',
      city: shippingAddress?.city || '',
      state: shippingAddress?.state || '',
      zipCode: shippingAddress?.zip || shippingAddress?.zipCode || shippingAddress?.postalCode || '',
      country: shippingAddress?.country || 'USA'
    };
    
    // Email content
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .card { background: #f8fafc; padding: 20px; margin: 15px 0; border-left: 4px solid #4f46e5; border-radius: 5px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .label { font-weight: 500; color: #6b7280; }
        .value { font-weight: 600; color: #111827; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background-color: #f8fafc; }
        .total-row { font-weight: bold; background-color: #f8fafc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div class="content">
          <div class="card">
            <h3 style="margin-top: 0; color: #374151;">Order Information</h3>
            <div class="info-row">
              <span class="label">Order Number:</span>
              <span class="value">#${orderNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Customer:</span>
              <span class="value">${customerName}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${customerEmail}</span>
            </div>
          </div>
          
          <div class="card">
            <h3 style="margin-top: 0; color: #374151;">Order Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
                <tr class="total-row">
                  <td colspan="2">Total:</td>
                  <td>$${totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="card">
            <h3 style="margin-top: 0; color: #374151;">🚚 Shipping Address</h3>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; font-family: monospace; border: 1px solid #d1d5db;">
              ${safeShippingAddress.fullName}<br>
              ${safeShippingAddress.addressLine1}<br>
              ${safeShippingAddress.addressLine2 ? `${safeShippingAddress.addressLine2}<br>` : ''}
              ${safeShippingAddress.city}, ${safeShippingAddress.state} ${safeShippingAddress.zipCode}<br>
              ${safeShippingAddress.country}
            </div>
          </div>
          
          <div class="card" style="background: #fef3c7; border-left-color: #f59e0b;">
            <h4 style="margin-top: 0; color: #92400e;">⚡ What's Next?</h4>
            <p style="margin: 0;">
              1. Your order is being processed<br>
              2. You'll receive a shipping notification when your order ships<br>
              3. Track your package with the tracking number in the shipping email<br>
              4. Enjoy your items when they arrive!
            </p>
          </div>
        </div>
        
        <div class="footer">
  <p><strong>SellBook Media</strong></p>
  <p>Order: #${orderNumber} | ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
  <p>Questions? Contact our support team</p>
</div>
      </div>
    </body>
    </html>
    `;
    
    // Send the email
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Namecheap e-posta adresiniz
      to: customerEmail,
      subject: `Order Confirmation #${orderNumber}`,
      html: emailHtml,
      text: `Order Confirmation
    
Thank you for your order, ${customerName}!
Your order #${orderNumber} has been confirmed.
Order Details:
${items.map((item: any) => `- ${item.title || 'Item'} (Qty: ${item.quantity || 1}) - $${(item.price || 0).toFixed(2)}`).join('\n')}
Total: $${totalAmount.toFixed(2)}
Shipping Address:
${safeShippingAddress.fullName}
${safeShippingAddress.addressLine1}
${safeShippingAddress.addressLine2 ? `${safeShippingAddress.addressLine2}\n` : ''}
${safeShippingAddress.city}, ${safeShippingAddress.state} ${safeShippingAddress.zipCode}
${safeShippingAddress.country}
If you have any questions about your order, please contact our support team.
Thank you for shopping with SellBook Media!`
    });
    
    console.log(`Order confirmation email sent to ${customerEmail} for order #${orderNumber}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log(`Processing email confirmation request for order: ${id}`);
    
    // Önce order'ı kontrol et
    const orderDoc = await db.collection('orders').doc(id).get();
    
    if (!orderDoc.exists) {
      console.log(`Order not found: ${id}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const orderData = orderDoc.data();
    const orderNumber = orderData?.orderNumber || id;
    const customerEmail = orderData?.customerInfo?.email || '';
    
    if (!customerEmail) {
      console.log(`No customer email found for order: ${id}`);
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 });
    }
    
    // Log the shipping address for debugging
    console.log('Shipping address data:', orderData?.shippingAddress);
    
    // Bu order için daha önce email gönderilmiş mi kontrol et
    const existingEmails = await db.collection('mail')
      .where('to', '==', customerEmail)
      .where('orderNumber', '==', orderNumber)
      .where('emailType', '==', 'order_confirmation')
      .limit(1)
      .get();
      
    if (!existingEmails.empty) {
      console.log(`Email already sent for order: ${orderNumber}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Email already sent',
        alreadySent: true 
      });
    }
    
    // Alternatif olarak order document'inde email status kontrol et
    if (orderData?.emailStatus?.confirmationSent) {
      console.log(`Email status already marked as sent for order: ${orderNumber}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Email already sent (status check)',
        alreadySent: true 
      });
    }
    
    console.log(`Sending new email for order: ${orderNumber} to: ${customerEmail}`);
    
    // Email gönder
    await sendOrderConfirmationEmail({
      customerEmail,
      customerName: orderData?.customerInfo?.fullName || 'Customer',
      orderNumber,
      items: orderData?.items || [],
      totalAmount: orderData?.totalAmount || 0,
      shippingAddress: orderData?.shippingAddress || {}
    });
    
    // Order document'inde email gönderildi olarak işaretle
    await db.collection('orders').doc(id).update({
      'emailStatus.confirmationSent': true,
      'emailStatus.confirmationSentAt': new Date(),
      'emailStatus.confirmationEmail': customerEmail
    });
    
    console.log(`Email confirmation successfully queued for order: ${orderNumber}`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Email sent successfully',
      orderNumber,
      customerEmail
    });
    
  } catch (error) {
    console.error('Error in send-confirmation endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}