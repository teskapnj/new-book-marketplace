import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      listingTitle, 
      paymentAmount, 
      transactionId, 
      listingId, 
      sellerName, 
      notes 
    } = body;
    
    // Nodemailer transporter setup for Namecheap
    const transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com', // Namecheap Private Email SMTP sunucusu
      port: 465, // SSL için port
      secure: true, // SSL kullanımı için true
      auth: {
        user: process.env.EMAIL_USER, // Namecheap e-posta adresiniz
        pass: process.env.EMAIL_PASS  // Namecheap e-posta şifreniz
      }
    });
    
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Payment Sent!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your BookHub payment has been processed</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
              Hi <strong>${sellerName}</strong>,
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Great news! We've successfully sent your payment for the approved listing. The funds should appear in your PayPal account within a few minutes.
            </p>
            
            <!-- Payment Details Box -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin: 25px 0;">
              <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">Payment Details:</h3>
              
              <div style="margin-bottom: 10px;">
                <strong style="color: #166534;">Listing:</strong>
                <span style="color: #374151;"> ${listingTitle}</span>
              </div>
              
              <div style="margin-bottom: 10px;">
                <strong style="color: #166534;">Amount:</strong>
                <span style="color: #374151; font-size: 18px; font-weight: bold;"> $${paymentAmount}</span>
              </div>
              
              <div style="margin-bottom: 10px;">
                <strong style="color: #166534;">PayPal Transaction ID:</strong>
                <span style="color: #374151; font-family: monospace;"> ${transactionId}</span>
              </div>
              
              <div style="margin-bottom: 10px;">
                <strong style="color: #166534;">Listing ID:</strong>
                <span style="color: #374151; font-family: monospace;"> ${listingId}</span>
              </div>
              
              ${notes ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #bbf7d0;">
                  <strong style="color: #166534;">Admin Notes:</strong>
                  <p style="color: #374151; margin: 5px 0 0 0;">${notes}</p>
                </div>
              ` : ''}
            </div>
            
            <!-- Important Info Box -->
            <div style="background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h4 style="color: #92400e; margin: 0 0 10px 0;">What's Next?</h4>
              <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                <li>Check your PayPal account for the incoming payment</li>
                <li>Payment typically appears within 5-10 minutes</li>
                <li>Keep this email for your records</li>
              </ul>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 25px;">
              Thank you for selling with BookHub! We appreciate your business and look forward to working with you again.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              This email was sent from BookHub Admin Panel<br>
              © 2025 BookHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Namecheap e-posta adresiniz
      to: email,
      subject: `Payment Sent - $${paymentAmount} for "${listingTitle}"`,
      html: emailHTML
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Payment notification email sent to: ${email}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment notification email sent successfully' 
    });
  } catch (error: any) {
    console.error('Error sending payment notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send payment notification: ' + error.message 
    }, { status: 500 });
  }
}