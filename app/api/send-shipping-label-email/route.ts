import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, listingTitle, shippingLabelUrl, trackingNumber, carrier, listingId, totalItems, packageDimensions } = data;

    if (!email || !listingTitle || !shippingLabelUrl || !trackingNumber || !carrier) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const shortId = listingId.substring(0, 8);
    const carrierUpper = carrier.toUpperCase();
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Listing Approved</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; -webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Your listing is approved and ready to ship. Your shipping label is enclosed.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:24px 0;">
    <tr>
      <td align="center">

        <!-- Card container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

          <!-- Header -->
          <tr>
            <td style="background-color:#10b981; padding:36px 40px; text-align:center;">
              <div style="font-size:13px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#d1fae5; margin-bottom:12px;">SellBook Media</div>
              <div style="font-size:26px; font-weight:700; color:#ffffff; line-height:1.3;">Your listing is approved</div>
              <div style="font-size:15px; color:#d1fae5; margin-top:8px;">It's all set and ready to ship.</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 8px 40px;">
              <p style="margin:0; font-size:16px; line-height:1.6; color:#334155;">
                Good news — your submission has been reviewed and approved. Everything you need to send it off is below. Just print the label, pack your items, and drop it off.
              </p>
            </td>
          </tr>

          <!-- Listing Information -->
          <tr>
            <td style="padding:16px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px 24px 8px 24px;">
                    <div style="font-size:13px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:#10b981;">Listing Details</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 16px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Item Type</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a; font-weight:600; text-align:right;">Very Good Condition Media Items</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Status</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; text-align:right;">
                          <span style="display:inline-block; background-color:#dcfce7; color:#15803d; font-size:13px; font-weight:600; padding:3px 12px; border-radius:999px;">Approved</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; ${totalItems || packageDimensions ? 'border-bottom:1px solid #e2e8f0;' : ''} font-size:14px; color:#64748b;">Listing ID</td>
                        <td style="padding:10px 0; ${totalItems || packageDimensions ? 'border-bottom:1px solid #e2e8f0;' : ''} font-size:14px; color:#0f172a; font-weight:600; text-align:right; font-family:monospace;">#${shortId}</td>
                      </tr>
                      ${totalItems ? `
                      <tr>
                        <td style="padding:10px 0; ${packageDimensions ? 'border-bottom:1px solid #e2e8f0;' : ''} font-size:14px; color:#64748b;">Number of Items</td>
                        <td style="padding:10px 0; ${packageDimensions ? 'border-bottom:1px solid #e2e8f0;' : ''} font-size:14px; color:#0f172a; font-weight:600; text-align:right;">${totalItems}</td>
                      </tr>` : ''}
                      ${packageDimensions ? `
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Box Size</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a; font-weight:600; text-align:right;">${packageDimensions.length} × ${packageDimensions.width} × ${packageDimensions.height} in</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; font-size:14px; color:#64748b;">Weight</td>
                        <td style="padding:10px 0; font-size:14px; color:#0f172a; font-weight:600; text-align:right;">${packageDimensions.weight} lb</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Information -->
          <tr>
            <td style="padding:0 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px 24px 8px 24px;">
                    <div style="font-size:13px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:#10b981;">Shipping</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Tracking Number</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a; font-weight:600; text-align:right; font-family:monospace;">${trackingNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; font-size:14px; color:#64748b;">Carrier</td>
                        <td style="padding:10px 0; font-size:14px; color:#0f172a; font-weight:600; text-align:right;">${carrierUpper}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:24px 40px; text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="border-radius:10px; background-color:#10b981;">
                    <a href="${shippingLabelUrl}" target="_blank" style="display:inline-block; padding:15px 40px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px;">
                      View &amp; Print Shipping Label
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:12px; font-size:13px; color:#94a3b8;">Opens your prepaid label in a new tab</div>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding:8px 40px 32px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb; border-radius:12px; border:1px solid #fde68a;">
                <tr>
                  <td style="padding:22px 26px;">
                    <div style="font-size:14px; font-weight:700; color:#92400e; margin-bottom:14px;">Next Steps</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#78350f; line-height:1.5;">
                      <tr><td style="padding:5px 0;"><strong>1.</strong>&nbsp;&nbsp;Print the shipping label using the button above</td></tr>
                      <tr><td style="padding:5px 0;"><strong>2.</strong>&nbsp;&nbsp;Pack your items securely in a box</td></tr>
                      <tr><td style="padding:5px 0;"><strong>3.</strong>&nbsp;&nbsp;Attach the shipping label to the package</td></tr>
                      <tr><td style="padding:5px 0;"><strong>4.</strong>&nbsp;&nbsp;Drop it off at ${carrierUpper}</td></tr>
                      <tr><td style="padding:5px 0;"><strong>5.</strong>&nbsp;&nbsp;Track your package with <span style="font-family:monospace; font-weight:600;">${trackingNumber}</span></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <p style="margin:0; font-size:15px; line-height:1.6; color:#334155;">
                Thanks for choosing SellBook Media. If you have any questions, just reply to this email — we're happy to help.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:24px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <div style="font-size:14px; font-weight:600; color:#475569;">SellBook Media</div>
              <div style="font-size:12px; color:#94a3b8; margin-top:6px;">Listing #${shortId} &nbsp;·&nbsp; ${dateStr}</div>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"SellBook Media" <${process.env.EMAIL_USER}>`, // Görünen ad eklendi
      to: email,
      subject: `Your submission has been approved - shipping label enclosed`, // Emoji kaldırıldı
      html: emailHtml,
      text: `Your listing has been approved!

Item Type: Very Good Condition Media Items
Status: Approved
Tracking Number: ${trackingNumber}
Carrier: ${carrierUpper}

Please print your shipping label here: ${shippingLabelUrl}

Next steps:
1. Print the shipping label
2. Package your items securely
3. Attach the shipping label to your package
4. Drop off the package at ${carrierUpper}
5. Track your package using: ${trackingNumber}

View your listing: ${process.env.NEXT_PUBLIC_BASE_URL}/listings/${listingId}

Thank you for using SellBook Media!`
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