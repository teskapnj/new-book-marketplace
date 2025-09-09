import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { 
      sellerName, 
      sellerEmail, 
      totalItems, 
      totalValue, 
      submissionId 
    } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sellerEmail,
      subject: 'Your Items Submitted Successfully - SecondLife Media',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for submitting your items!</h2>
          
          <p>Hi ${sellerName},</p>
          
          <p>We've received your submission and our team will review your items and send free shipping label within 24 hours.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Submission Details:</h3>
            <ul>
              <li><strong>Total Items:</strong> ${totalItems}</li>
              <li><strong>Total Value:</strong> $${totalValue.toFixed(2)}</li>
              <li><strong>Submission ID:</strong> ${submissionId}</li>
            </ul>
          </div>
          
          <h3>What happens next?</h3>
          <ol>
            <li>Our team reviews your submission (within 24 hours)</li>
            <li>You'll receive a FREE shipping label via email</li>
            <li>Package your items securely</li>
            <li>Attach the shipping label and drop off at any authorized location</li>
            <li>We'll process your items and send payment to your PayPal account when we received your items</li>
          </ol>
          
          <p><strong>Important:</strong> Please check your email (including spam folder) for the shipping label next email.</p>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <p>Best regards,<br>SecondLife Media Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending seller confirmation:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}