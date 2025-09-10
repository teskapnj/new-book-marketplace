import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Namecheap için transporter yapılandırması
const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com', // Namecheap Private Email SMTP sunucusu
  port: 465, // SSL için port
  secure: true, // SSL kullanımı için true
  auth: {
    user: process.env.EMAIL_USER, // Namecheap e-posta adresiniz (örn: yourname@yourdomain.com)
    pass: process.env.EMAIL_PASS  // Namecheap e-posta şifreniz
  }
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // HTML içeriği aynı kalabilir
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .card { background: #f8fafc; padding: 20px; margin: 15px 0; border-left: 4px solid #f59e0b; border-radius: 5px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .label { font-weight: 500; color: #6b7280; }
        .value { font-weight: 600; color: #111827; }
        .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
        .address { background: #f3f4f6; padding: 15px; border-radius: 6px; font-family: monospace; border: 1px solid #d1d5db; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 New Seller Submission</h1>
          <p>A seller has submitted items for review</p>
        </div>
        
        <div class="content">
          <div class="card">
            <h3 style="margin-top: 0; color: #374151;">👤 Seller Information</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${data.sellerName}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">${data.sellerEmail}</span>
            </div>
          </div>
          <div class="card">
            <h3 style="margin-top: 0; color: #374151;">📊 Submission Summary</h3>
            <div class="info-row">
              <span class="label">Total Items:</span>
              <span class="value">${data.totalItems} items</span>
            </div>
            <div class="info-row">
              <span class="label">Estimated Value:</span>
              <span class="value">$${data.totalValue.toFixed(2)}</span>
            </div>
            <div class="info-row">
              <span class="label">Average per Item:</span>
              <span class="value">$${(data.totalValue / data.totalItems).toFixed(2)}</span>
            </div>
            <div class="info-row">
              <span class="label">Submission ID:</span>
              <span class="value">#${data.submissionId.substring(0, 8)}</span>
            </div>
          </div>
          ${data.shippingInfo ? `
          <div class="card">
            <h3 style="margin-top: 0; color: #374151;">🚚 Shpping/Pickup Address</h3>
            <div class="address">
              ${data.shippingInfo.firstName} ${data.shippingInfo.lastName}<br>
              ${data.shippingInfo.address.street}<br>
              ${data.shippingInfo.address.city}, ${data.shippingInfo.address.state} ${data.shippingInfo.address.zip}<br>
              ${data.shippingInfo.address.country}
            </div>
            <div style="margin-top: 15px; background: #e5e7eb; padding: 10px; border-radius: 4px;">
              <strong>Package Dimensions:</strong><br>
              ${data.shippingInfo.packageDimensions.length}" × ${data.shippingInfo.packageDimensions.width}" × ${data.shippingInfo.packageDimensions.height}" | ${data.shippingInfo.packageDimensions.weight} lbs
            </div>
          </div>
          ` : ''}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.dashboardUrl}" class="button">
              Review in Admin Dashboard
            </a>
          </div>
          <div class="card" style="background: #fef3c7; border-left-color: #f59e0b;">
            <h4 style="margin-top: 0; color: #92400e;">⚡ Next Steps</h4>
            <p style="margin: 0;">
              1. Review items in admin dashboard<br>
              2. Approve/reject the submission<br>
              3. If approved, send shipping label<br>
              4. Process items when received
            </p>
          </div>
        </div>
        <div class="footer">
          <p><strong>Seller Submission Notification</strong></p>
          <p>Submission: #${data.submissionId.substring(0, 8)} | ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Namecheap e-posta adresiniz
      to: process.env.ADMIN_EMAIL,
      subject: `📦 NEW SUBMISSION - ${data.totalItems} items - $${data.totalValue.toFixed(2)} - ${data.sellerName}`,
      html: emailHtml,
      text: `New Seller Submission
Seller: ${data.sellerName} (${data.sellerEmail})
Items: ${data.totalItems}
Value: $${data.totalValue.toFixed(2)}
Average: $${(data.totalValue / data.totalItems).toFixed(2)} per item
Submission ID: #${data.submissionId.substring(0, 8)}
Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
Review: ${data.dashboardUrl}`
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}