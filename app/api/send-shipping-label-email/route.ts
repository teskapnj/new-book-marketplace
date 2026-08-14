// app/api/send-shipping-label-email/route.ts
// Satici onaylandiginda kargo etiketi maili
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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

    const shortId = listingId ? String(listingId).substring(0, 8) : 'n/a';
    const carrierUpper = String(carrier).toUpperCase();
    const dateStr = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Ready to Ship</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; -webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Your prepaid shipping label is ready. Print it, pack your box, and drop it off.
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
              <div style="font-size:26px; font-weight:700; color:#ffffff; line-height:1.3;">You're ready to ship!</div>
              <div style="font-size:15px; color:#d1fae5; margin-top:8px;">Your prepaid label is enclosed.</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 8px 40px;">
              <p style="margin:0; font-size:16px; line-height:1.6; color:#334155;">
                Good news &mdash; you're all set to send us your items. Everything you need is right here. Just print your label, pack your box, and drop it off.
              </p>
            </td>
          </tr>

          <!-- CTA Button - once gelsin, en onemli aksiyon bu -->
          <tr>
            <td style="padding:24px 40px 8px 40px; text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:12px; background-color:#10b981; text-align:center;">
                    <a href="${shippingLabelUrl}" target="_blank" style="display:block; padding:20px 24px; font-size:18px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:12px;">
                      View &amp; Print Shipping Label
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:12px; font-size:13px; color:#94a3b8;">Opens your prepaid label in a new tab</div>
            </td>
          </tr>

          <!-- Your Box -->
          <tr>
            <td style="padding:16px 40px 8px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px 24px 8px 24px;">
                    <div style="font-size:13px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:#10b981;">Your Box</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 16px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${totalItems ? `
                      <tr>
                        <td style="padding:10px 0; ${packageDimensions ? 'border-bottom:1px solid #e2e8f0;' : ''} font-size:14px; color:#64748b;">Number of Items</td>
                        <td style="padding:10px 0; ${packageDimensions ? 'border-bottom:1px solid #e2e8f0;' : ''} font-size:14px; color:#0f172a; font-weight:600; text-align:right;">${totalItems}</td>
                      </tr>` : ''}
                      ${packageDimensions ? `
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#64748b;">Box Size</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:14px; color:#0f172a; font-weight:600; text-align:right;">${packageDimensions.length} &times; ${packageDimensions.width} &times; ${packageDimensions.height} in</td>
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

          <!-- Next Steps -->
          <tr>
            <td style="padding:16px 40px 16px 40px;">
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

          <!-- Payment note -->
          <tr>
            <td style="padding:0 40px 16px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff; border-radius:12px; border:1px solid #bfdbfe;">
                <tr>
                  <td style="padding:18px 24px; font-size:14px; color:#1e40af; line-height:1.5;">
                    <strong>About your payment:</strong> Once your items arrive at our facility and are checked, we'll send your payment straight to your PayPal account.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <p style="margin:0; font-size:15px; line-height:1.6; color:#334155;">
                Thanks for choosing SellBook Media. If you have any questions, just reply to this email &mdash; we're happy to help.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:24px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <div style="font-size:14px; font-weight:600; color:#475569;">SellBook Media</div>
              <div style="font-size:12px; color:#94a3b8; margin-top:6px;">Ref ${shortId} &nbsp;&middot;&nbsp; ${dateStr}</div>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailText = `You're ready to ship!

Good news - you're all set to send us your items. Everything you need is right here.

Print your shipping label here:
${shippingLabelUrl}

YOUR BOX${totalItems ? `
Number of items: ${totalItems}` : ''}${packageDimensions ? `
Box size: ${packageDimensions.length} x ${packageDimensions.width} x ${packageDimensions.height} in
Weight: ${packageDimensions.weight} lb` : ''}

SHIPPING
Tracking number: ${trackingNumber}
Carrier: ${carrierUpper}

NEXT STEPS
1. Print the shipping label
2. Pack your items securely in a box
3. Attach the shipping label to the package
4. Drop it off at ${carrierUpper}
5. Track your package with ${trackingNumber}

About your payment: Once your items arrive at our facility and are checked, we'll send your payment straight to your PayPal account.

Thanks for choosing SellBook Media. If you have any questions, just reply to this email.

Ref ${shortId}`;

    await transporter.sendMail({
      from: `"SellBook Media" <${process.env.EMAIL_USER}>`,
      to: email,
      replyTo: process.env.EMAIL_USER,
      subject: `You're ready to ship - your prepaid label is enclosed`,
      html: emailHtml,
      text: emailText
    });

    console.log(`Email sent to ${email} for listing ${listingId}`);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Email error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}