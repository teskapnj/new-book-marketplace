// app/api/send-seller-notification/route.ts
// Admin bildirim maili - Namecheap Private Email (SMTP) uzerinden
// NOT: Outlook/Hotmail flexbox desteklemedigi icin tum yerlesim tablo bazli.
//      Emoji, BUYUK HARF ve konu satirinda dolar tutari spam filtresini tetikledigi
//      icin kaldirildi.
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

    // Guvenli degerler - eksik alan gelirse mail patlamasin
    const sellerName = data.sellerName || 'Unknown seller';
    const sellerEmail = data.sellerEmail || '';
    const paypalEmail = data.paypalEmail || '';
    const totalItems = Number(data.totalItems) || 0;
    const totalValue = Number(data.totalValue) || 0;
    const avgPerItem = totalItems > 0 ? totalValue / totalItems : 0;
    const shortId = data.submissionId ? String(data.submissionId).substring(0, 8) : 'n/a';
    const dashboardUrl = data.dashboardUrl || 'https://www.sellbookmedia.com/admin/listings';
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    const ship = data.shippingInfo;
    const dims = ship?.packageDimensions;

    // Tekrar eden satir yapisi
    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b7280;">${label}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;font-weight:bold;text-align:right;">${value}</td>
      </tr>`;

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New submission</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f5f7;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">

          <!-- Baslik -->
          <tr>
            <td style="background-color:#1d4ed8;padding:24px;border-radius:8px 8px 0 0;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#ffffff;">New seller submission</p>
              <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#dbeafe;">Submission #${shortId} &middot; ${submittedAt}</p>
            </td>
          </tr>

          <!-- Ozet -->
          <tr>
            <td style="padding:24px 24px 8px;">
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#111827;">Summary</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${row('Total items', String(totalItems))}
                ${row('Estimated value', '$' + totalValue.toFixed(2))}
                ${row('Average per item', '$' + avgPerItem.toFixed(2))}
              </table>
            </td>
          </tr>

          <!-- Satici -->
          <tr>
            <td style="padding:16px 24px 8px;">
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#111827;">Seller</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${row('Name', sellerName)}
                ${row('Account email', sellerEmail)}
                ${paypalEmail ? row('PayPal email', paypalEmail) : ''}
              </table>
            </td>
          </tr>

          ${ship ? `
          <!-- Adres -->
          <tr>
            <td style="padding:16px 24px 8px;">
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#111827;">Return address</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;">
                <tr>
                  <td style="padding:14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;line-height:1.6;">
                    ${ship.firstName || ''} ${ship.lastName || ''}<br>
                    ${ship.address?.street || ''}<br>
                    ${ship.address?.city || ''}, ${ship.address?.state || ''} ${ship.address?.zip || ''}<br>
                    ${ship.address?.country || 'US'}
                  </td>
                </tr>
              </table>
              ${dims ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">
                ${row('Package size', `${dims.length} x ${dims.width} x ${dims.height} in`)}
                ${row('Package weight', `${dims.weight} lbs`)}
              </table>` : ''}
            </td>
          </tr>` : ''}

          <!-- Buton -->
          <tr>
            <td align="center" style="padding:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#1d4ed8;border-radius:6px;">
                    <a href="${dashboardUrl}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">Review in admin dashboard</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sonraki adimlar -->
          <tr>
            <td style="padding:0 24px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;border-left:3px solid #1d4ed8;border-radius:4px;">
                <tr>
                  <td style="padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;line-height:1.7;">
                    <strong style="color:#111827;">Next steps</strong><br>
                    1. Review the items in the admin dashboard<br>
                    2. Approve or reject the submission<br>
                    3. If approved, send the shipping label<br>
                    4. Process the items once received
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alt bilgi -->
          <tr>
            <td style="padding:18px 24px;background-color:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;text-align:center;">
                SellBook Media &middot; Internal notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailText = `New seller submission

Submission: #${shortId}
Submitted: ${submittedAt}

SUMMARY
Total items: ${totalItems}
Estimated value: $${totalValue.toFixed(2)}
Average per item: $${avgPerItem.toFixed(2)}

SELLER
Name: ${sellerName}
Account email: ${sellerEmail}${paypalEmail ? `\nPayPal email: ${paypalEmail}` : ''}
${ship ? `
RETURN ADDRESS
${ship.firstName || ''} ${ship.lastName || ''}
${ship.address?.street || ''}
${ship.address?.city || ''}, ${ship.address?.state || ''} ${ship.address?.zip || ''}
${ship.address?.country || 'US'}
${dims ? `
Package size: ${dims.length} x ${dims.width} x ${dims.height} in
Package weight: ${dims.weight} lbs` : ''}` : ''}

Review: ${dashboardUrl}`;

    await transporter.sendMail({
      // Gorunen ad eklendi - ham adres yerine "SellBook Media" gorunur
      from: `"SellBook Media" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      // Bildirime cevap verince dogrudan saticiya gider
      replyTo: sellerEmail || process.env.EMAIL_USER,
      // Emoji / BUYUK HARF / dolar tutari kaldirildi
      subject: `New submission from ${sellerName} (${totalItems} items)`,
      html: emailHtml,
      text: emailText
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Email error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message });
  }
}