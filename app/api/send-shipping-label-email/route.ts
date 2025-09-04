import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, listingTitle, shippingLabelUrl, trackingNumber, carrier, listingId } = data;
    
    if (!email || !listingTitle || !shippingLabelUrl || !trackingNumber || !carrier) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .card { background: #f8fafc; padding: 20px; margin: 15px 0; border-left: 4px solid #10b981; border-radius: 5px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .label { font-weight: 500; color: #6b7280; }
        .value { font-weight: 600; color: #111827; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .tracking-info { background: #e5e7eb; padding: 15px; border-radius: 6px; font-family: monospace; border: 1px solid #d1d5db; }
        .label-preview { max-width: 100%; border: 1px dashed #d1d5db; padding: 10px; text-align: center; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Listing Approved</h1>
          <p>Your listing has been approved and is ready to ship</p>
        </div>
        
        <div class="content">
          <div class="card">
            <h3 style="margin-top: 0; color: #374151;">📦 Listing Information</h3>
            <div class="info-row">
              <span class="label">Title:</span>
              <span class="value">${listingTitle}</span>
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              <span class="value">Approved</span>
            </div>
            <div class="info-row">
              <span class="label">Listing ID:</span>
              <span class="value">#${listingId.substring(0, 8)}</span>
            </div>
          </div>
          
          <div class="card">
            <h3 style="margin-top: 0; color: #374151;">📬 Shipping Information</h3>
            <div class="tracking-info">
              <div class="info-row">
                <span class="label">Tracking Number:</span>
                <span class="value">${trackingNumber}</span>
              </div>
              <div class="info-row">
                <span class="label">Carrier:</span>
                <span class="value">${carrier.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${shippingLabelUrl}" target="_blank" class="button">
              View & Print Shipping Label
            </a>
          </div>
          
          <div class="card" style="background: #fef3c7; border-left-color: #f59e0b;">
            <h4 style="margin-top: 0; color: #92400e;">⚡ Next Steps</h4>
            <p style="margin: 0;">
              1. Print the shipping label using the button above<br>
              2. Package your items securely<br>
              3. Attach the shipping label to your package<br>
              4. Drop off the package at ${carrier.toUpperCase()}<br>
              5. Track your package using: ${trackingNumber}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/listings/${listingId}" style="display: inline-block; background: #f3f4f6; color: #10b981; padding: 10px 20px; text-decoration: none; border-radius: 6px; border: 1px solid #e5e7eb;">
              View Your Listing
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Shipping Label Notification</strong></p>
          <p>Listing: #${listingId.substring(0, 8)} | ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `✅ Your listing "${listingTitle}" has been approved! Shipping label inside`,
      html: emailHtml,
      text: `Your listing has been approved!
      
Listing: ${listingTitle}
Status: Approved
Tracking Number: ${trackingNumber}
Carrier: ${carrier.toUpperCase()}
      
Please print your shipping label here: ${shippingLabelUrl}
      
Next steps:
1. Print the shipping label
2. Package your items securely
3. Attach the shipping label to your package
4. Drop off the package at ${carrier.toUpperCase()}
5. Track your package using: ${trackingNumber}
      
View your listing: ${process.env.NEXT_PUBLIC_BASE_URL}/listings/${listingId}
      
Thank you for using our platform!`
    });
    
    console.log(`Email sent to ${email} for listing ${listingId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}