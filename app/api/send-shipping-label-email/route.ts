// app/api/send-shipping-label-email/route.ts
// Satici onaylandiginda kargo etiketi maili
// NOT: Mobilde tasma olmamasi icin tek sutunlu yapi kullaniliyor.
//      Etiket ustte, deger altta - uzun tracking numaralari sigar.
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

    // Tek sutunlu satir: etiket ustte kucuk, deger altta buyuk
    const row = (label: string, value: string, mono = false) => `
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0;">
          <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">${label}</div>
          <div style="font-size:16px; color:#0f172a; font-weight:600; ${mono ? "font-family:'SF Mono',Consolas,monospace; word-break:break-all;" : ''}">${value}</div>
        </td>
      </tr>`;

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Ready to Ship</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Your prepaid shipping label is ready. Print it, pack your box, and drop it off.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:16px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

          <!-- Header -->
          <tr>
            <td style="background-color:#10b981; padding:32px 24px; text-align:center;">
              <div style="font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#d1fae5; margin-bottom:10px;">SellBook Media</div>
              <div style="font-size:24px; font-weight:700; color:#ffffff; line-height:1.3;">You're ready to ship</div>
              <div style="font-size:15px; color:#d1fae5; margin-top:8px;">Your prepaid label is enclosed.</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 24px 0 24px;">
              <p style="margin:0; font-size:16px; line-height:1.6; color:#334155;">
                You're all set to send us your items. Print your label, pack your box, and drop it off.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:12px; background-color:#10b981; text-align:center;">
                    <a href="${shippingLabelUrl}" target="_blank" style="display:block; padding:20px 16px; font-size:18px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:12px;">
                      View &amp; Print Shipping Label
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:10px; font-size:13px; color:#94a3b8; text-align:center;">Opens your prepaid label in a new tab</div>
            </td>
          </tr>

          <!-- Shipping -->
          <tr>
            <td style="padding:20px 24px 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:18px 20px 4px 20px;">
                    <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#10b981;">Shipping</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 12px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${row('Tracking Number', trackingNumber, true)}
                      <tr>
                        <td style="padding:12px 0;">
                          <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Carrier</div>
                          <div style="font-size:16px; color:#0f172a; font-weight:600;">${carrierUpper}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${(totalItems || packageDimensions) ? `
          <!-- Your Box -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:18px 20px 4px 20px;">
                    <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#10b981;">Your Box</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 12px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${totalItems ? row('Number of Items', String(totalItems)) : ''}
                      ${packageDimensions ? `
                        ${row('Box Size', `${packageDimensions.length} &times; ${packageDimensions.width} &times; ${packageDimensions.height} in`)}
                        <tr>
                          <td style="padding:12px 0;">
                            <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Weight</div>
                            <div style="font-size:16px; color:#0f172a; font-weight:600;">${packageDimensions.weight} lb</div>
                          </td>
                        </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>` : ''}

          <!-- Next Steps -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb; border-radius:12px; border:1px solid #fde68a;">
                <tr>
                  <td style="padding:20px;">
                    <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#92400e; margin-bottom:12px;">Next Steps</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px; color:#78350f; line-height:1.5;">
                      <tr><td style="padding:6px 0;"><strong>1.</strong>&nbsp;&nbsp;Print the label using the button above</td></tr>
                      <tr><td style="padding:6px 0;"><strong>2.</strong>&nbsp;&nbsp;Pack your items securely in a box</td></tr>
                      <tr><td style="padding:6px 0;"><strong>3.</strong>&nbsp;&nbsp;Attach the label to the package</td></tr>
                      <tr><td style="padding:6px 0;"><strong>4.</strong>&nbsp;&nbsp;Drop it off at ${carrierUpper}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment note -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff; border-radius:12px; border:1px solid #bfdbfe;">
                <tr>
                  <td style="padding:18px 20px; font-size:15px; color:#1e40af; line-height:1.5;">
                    <strong>Your payment:</strong> Once your items arrive and are checked, we'll send payment straight to your PayPal account.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:20px 24px 28px 24px;">
              <p style="margin:0; font-size:15px; line-height:1.6; color:#334155;">
                Questions? Just reply to this email &mdash; we're happy to help.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:20px 24px; text-align:center; border-top:1px solid #e2e8f0;">
              <div style="font-size:14px; font-weight:600; color:#475569;">SellBook Media</div>
              <div style="font-size:12px; color:#94a3b8; margin-top:6px;">Ref ${shortId} &nbsp;&middot;&nbsp; ${dateStr}</div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailText = `You're ready to ship

You're all set to send us your items. Print your label, pack your box, and drop it off.

Print your shipping label here:
${shippingLabelUrl}

SHIPPING
Tracking number: ${trackingNumber}
Carrier: ${carrierUpper}
${(totalItems || packageDimensions) ? `
YOUR BOX${totalItems ? `
Number of items: ${totalItems}` : ''}${packageDimensions ? `
Box size: ${packageDimensions.length} x ${packageDimensions.width} x ${packageDimensions.height} in
Weight: ${packageDimensions.weight} lb` : ''}
` : ''}
NEXT STEPS
1. Print the label
2. Pack your items securely in a box
3. Attach the label to the package
4. Drop it off at ${carrierUpper}

Your payment: Once your items arrive and are checked, we'll send payment straight to your PayPal account.

Questions? Just reply to this email.

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