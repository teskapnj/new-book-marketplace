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

    // Admin notundaki satır atlamalarini maile <br> olarak yansit (kabul edilmeyen urunler alt alta gorunsun)
    const notesHtml = notes
      ? String(notes)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\r?\n/g, '<br>')
      : '';

    // Namecheap için transporter yapılandırması
    const transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com', // Namecheap Private Email SMTP sunucusu
      port: 465, // SSL için port
      secure: true, // SSL kullanımı için true
      auth: {
        user: process.env.EMAIL_USER, // Namecheap e-posta adresiniz
        pass: process.env.EMAIL_PASS  // Namecheap e-posta şifreniz
      }
    });

    const emailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Payment Sent</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Your payment of $${paymentAmount} has been sent to your PayPal account.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:24px 0;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

          <!-- Header -->
          <tr>
            <td style="background-color:#10b981; padding:36px 40px; text-align:center;">
              <div style="font-size:13px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#d1fae5; margin-bottom:12px;">SellBook Media</div>
              <div style="font-size:26px; font-weight:700; color:#ffffff; line-height:1.3;">Payment sent</div>
              <div style="font-size:15px; color:#d1fae5; margin-top:8px;">Your items are in and your payment is on the way.</div>
            </td>
          </tr>

          <!-- Amount highlight -->
          <tr>
            <td style="padding:32px 40px 8px 40px; text-align:center;">
              <div style="font-size:14px; color:#64748b; margin-bottom:6px;">Amount sent to your PayPal</div>
              <div style="font-size:40px; font-weight:800; color:#10b981; line-height:1.1;">$${paymentAmount}</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:16px 40px 8px 40px;">
              <p style="margin:0 0 16px 0; font-size:16px; line-height:1.6; color:#334155;">
                Hi ${sellerName},
              </p>
              <p style="margin:0; font-size:16px; line-height:1.6; color:#334155;">
                Great news — we've received and checked your items, and your payment has been sent. The funds should appear in your PayPal account within a few minutes.
              </p>
            </td>
          </tr>

          <!-- Payment Details -->
          <tr>
            <td style="padding:16px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px 24px 8px 24px;">
                    <div style="font-size:13px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:#10b981;">Payment Details</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 16px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Listing</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a; font-weight:600; text-align:right;">${listingTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Amount</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a; font-weight:600; text-align:right;">$${paymentAmount}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">PayPal Transaction ID</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a; font-weight:600; text-align:right; font-family:monospace;">${transactionId}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; font-size:14px; color:#64748b;">Listing ID</td>
                        <td style="padding:10px 0; font-size:14px; color:#0f172a; font-weight:600; text-align:right; font-family:monospace;">${listingId}</td>
                      </tr>
                    </table>
                    ${notesHtml ? `
                    <div style="margin-top:16px; padding-top:16px; border-top:1px solid #e2e8f0;">
                      <div style="font-size:13px; font-weight:600; color:#64748b; margin-bottom:6px;">Adjustments &amp; Notes</div>
                      <div style="font-size:14px; color:#334155; line-height:1.6;">${notesHtml}</div>
                    </div>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's next -->
          <tr>
            <td style="padding:8px 40px 16px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb; border-radius:12px; border:1px solid #fde68a;">
                <tr>
                  <td style="padding:22px 26px;">
                    <div style="font-size:14px; font-weight:700; color:#92400e; margin-bottom:12px;">What's Next</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#78350f; line-height:1.5;">
                      <tr><td style="padding:5px 0;">&bull;&nbsp;&nbsp;Check your PayPal account for the incoming payment</td></tr>
                      <tr><td style="padding:5px 0;">&bull;&nbsp;&nbsp;Payment typically appears within 5-10 minutes</td></tr>
                      <tr><td style="padding:5px 0;">&bull;&nbsp;&nbsp;Keep this email for your records</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:8px 40px 32px 40px;">
              <p style="margin:0; font-size:15px; line-height:1.6; color:#334155;">
                Thank you for selling with SellBook Media. We appreciate your business and look forward to working with you again.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:24px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <div style="font-size:14px; font-weight:600; color:#475569;">SellBook Media</div>
              <div style="font-size:12px; color:#94a3b8; margin-top:6px;">&copy; ${new Date().getFullYear()} SellBook Media. All rights reserved.</div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

    const mailOptions = {
      from: `"SellBook Media" <${process.env.EMAIL_USER}>`, // Görünen ad eklendi
      to: email,
      subject: `Payment sent - $${paymentAmount} for "${listingTitle}"`,
      html: emailHTML,
      text: `Payment Sent!

Hi ${sellerName},

Great news! We've successfully sent your payment for the approved listing. The funds should appear in your PayPal account within a few minutes.

Payment Details:
- Listing: ${listingTitle}
- Amount: $${paymentAmount}
- PayPal Transaction ID: ${transactionId}
- Listing ID: ${listingId}
${notes ? `- Note: ${notes}` : ''}

What's Next?
- Check your PayPal account for the incoming payment
- Payment typically appears within 5-10 minutes
- Keep this email for your records

Thank you for selling with SellBook Media!`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Payment notification email sent to: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Payment notification email sent successfully'
    });
  } catch (error: unknown) {
    console.error('Error sending payment notification:', error);

    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to send payment notification: ' + errorMessage
    }, { status: 500 });
  }
}