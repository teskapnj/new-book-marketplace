import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { auth } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7).trim();

    let decodedToken;

    try {
      decodedToken = await auth.verifyIdToken(token, true);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const tokenEmail = decodedToken.email?.toLowerCase();

    if (!adminEmail || tokenEmail !== adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      email,
      listingTitle,
      paymentAmount,
      transactionId,
      listingId,
      sellerName,
      paypalAccount,
      paypalEmail,
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

    const rawPaymentAccount = String(paypalAccount || paypalEmail || '').trim();

    const isCheckPayment =
      rawPaymentAccount.toUpperCase() === 'CHECK BY MAIL';

    const isVenmoPayment =
      rawPaymentAccount.toUpperCase().startsWith('VENMO:') ||
      rawPaymentAccount.startsWith('@');

    const paymentMethodLabel = isCheckPayment
      ? 'Check by Mail'
      : isVenmoPayment
        ? 'Venmo'
        : 'PayPal';

    const paymentStatusMessage = isCheckPayment
      ? `Great news — we've received and checked your items, and your paper check for $${paymentAmount} will be mailed on the next business day to the shipping address on your order.`
      : `Great news — we've received and checked your items, and your payment has been sent via ${paymentMethodLabel}.`;

    const paymentNextStepsHtml = isCheckPayment
      ? `
                      <tr><td style="padding:5px 0;">&bull;&nbsp;&nbsp;Your paper check will be mailed on the next business day to the shipping address on your order</td></tr>
                      <tr><td style="padding:5px 0;">&bull;&nbsp;&nbsp;Delivery time will depend on USPS mail service</td></tr>
                      <tr><td style="padding:5px 0;">&bull;&nbsp;&nbsp;Keep this email for your records</td></tr>`
      : `
                      <tr><td style="padding:5px 0;">&bull;&nbsp;&nbsp;Check your ${paymentMethodLabel} account for the incoming payment</td></tr>
                      <tr><td style="padding:5px 0;">&bull;&nbsp;&nbsp;Keep this email for your records</td></tr>`;

    const paymentNextStepsText = isCheckPayment
      ? `- Your paper check will be mailed on the next business day to the shipping address on your order
- Delivery time will depend on USPS mail service
- Keep this email for your records`
      : `- Check your ${paymentMethodLabel} account for the incoming payment
- Keep this email for your records`;

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
    ${isCheckPayment ? `Your paper check for $${paymentAmount} is being mailed.` : `Your payment of $${paymentAmount} has been sent via ${paymentMethodLabel}.`}
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
              <div style="font-size:14px; color:#64748b; margin-bottom:6px;">Amount sent</div>
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
                ${paymentStatusMessage}
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
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Payment Method</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a; font-weight:600; text-align:right;">${paymentMethodLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Payment Transaction ID</td>
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
${paymentNextStepsHtml}
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
          <!-- Review request -->
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:24px 26px; text-align:center;">
                    <div style="font-size:16px; font-weight:700; color:#0f172a; margin-bottom:8px;">
                      How was your experience with SellBookMedia?
                    </div>
                    <div style="font-size:14px; color:#64748b; line-height:1.6; margin-bottom:18px;">
                      Your feedback helps other sellers know what to expect.
                    </div>
                    <a
                      href="https://www.trustpilot.com/evaluate/sellbookmedia.com"
                      target="_blank"
                      style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding:12px 22px; border-radius:8px;"
                    >
                      Leave a Review
                    </a>
                  </td>
                </tr>
              </table>
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

${paymentStatusMessage}

Payment Details:
- Listing: ${listingTitle}
- Amount: $${paymentAmount}
- Payment Method: ${paymentMethodLabel}
- Payment Transaction ID: ${transactionId}
- Listing ID: ${listingId}
${notes ? `- Note: ${notes}` : ''}

What's Next?
${paymentNextStepsText}

Thank you for selling with SellBook Media!

How was your experience with SellBookMedia?
Your feedback helps other sellers know what to expect.

Leave a review:
https://www.trustpilot.com/evaluate/sellbookmedia.com`
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