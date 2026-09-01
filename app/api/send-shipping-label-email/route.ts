// app/api/send-shipping-label-email/route.ts
// Satici onaylandiginda kargo etiketi maili
// NOT: Mobilde tasma olmamasi icin tek sutunlu yapi kullaniliyor.
//      Etiket ustte, deger altta - uzun tracking numaralari sigar.

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const MAX_LABEL_SIZE_BYTES = 10 * 1024 * 1024;

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

    const {
      email,
      listingTitle,
      shippingLabelUrl,
      trackingNumber,
      carrier,
      listingId,
      totalItems,
      packageDimensions
    } = data;

    if (
      !email ||
      !listingTitle ||
      !shippingLabelUrl ||
      !trackingNumber ||
      !carrier
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    const shortId = listingId
      ? String(listingId).substring(0, 8)
      : 'n/a';

    const carrierUpper = String(carrier).toUpperCase();

    const dateStr = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York'
    });

    // ------------------------------------------------------------
    // Shipping label attachment
    // Label Firebase Storage download URL'sinden server tarafinda indirilir.
    // Indirme basarisiz olursa email yine link ile gonderilir.
    // ------------------------------------------------------------
    let labelAttachment:
      | {
          filename: string;
          content: Buffer;
          contentType: string;
        }
      | null = null;

    try {
      const labelResponse = await fetch(shippingLabelUrl, {
        cache: 'no-store'
      });

      if (!labelResponse.ok) {
        throw new Error(
          `Shipping label download failed with status ${labelResponse.status}`
        );
      }

      const contentLengthHeader =
        labelResponse.headers.get('content-length');

      if (contentLengthHeader) {
        const contentLength = Number(contentLengthHeader);

        if (
          Number.isFinite(contentLength) &&
          contentLength > MAX_LABEL_SIZE_BYTES
        ) {
          throw new Error('Shipping label exceeds maximum allowed size');
        }
      }

      const labelArrayBuffer =
        await labelResponse.arrayBuffer();

      if (
        labelArrayBuffer.byteLength >
        MAX_LABEL_SIZE_BYTES
      ) {
        throw new Error('Shipping label exceeds maximum allowed size');
      }

      const labelBuffer = Buffer.from(
        labelArrayBuffer
      );

      if (labelBuffer.length > 0) {
        labelAttachment = {
          filename: `SellBookMedia-Shipping-Label-${shortId}.pdf`,
          content: labelBuffer,
          contentType: 'application/pdf'
        };
      }
    } catch (attachmentError) {
      console.error(
        'Shipping label attachment could not be created:',
        attachmentError
      );
    }

    // Tek sutunlu satir: etiket ustte kucuk, deger altta buyuk
    const row = (
      label: string,
      value: string,
      mono = false
    ) => `
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0;">
          <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">${label}</div>
          <div style="font-size:16px; color:#0f172a; font-weight:600; ${
            mono
              ? "font-family:'SF Mono',Consolas,monospace; word-break:break-all;"
              : ''
          }">${value}</div>
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

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background-color:#f1f5f9; padding:16px 12px;"
  >
    <tr>
      <td align="center">

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
        >

          <!-- Header -->
          <tr>
            <td style="background-color:#10b981; padding:32px 24px; text-align:center;">
              <div style="font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#d1fae5; margin-bottom:10px;">
                SellBook Media
              </div>

              <div style="font-size:24px; font-weight:700; color:#ffffff; line-height:1.3;">
                You're ready to ship
              </div>

              <div style="font-size:15px; color:#d1fae5; margin-top:8px;">
                Your prepaid label is enclosed.
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 24px 0 24px;">
              <p style="margin:0; font-size:17px; line-height:1.6; color:#334155;">
                Your prepaid shipping label is ready.
                Start by printing the label using the large green button below.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:24px 24px 8px 24px;">

              <div style="font-size:22px; font-weight:800; color:#0f172a; text-align:center; margin-bottom:8px;">
                Step 1 &mdash; Print Your Shipping Label
              </div>

              <div style="font-size:16px; line-height:1.6; color:#475569; text-align:center; margin-bottom:18px;">
                Click the green button below to open your prepaid shipping label.
                Then choose <strong>Print</strong> on your phone or computer.
              </div>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
              >
                <tr>
                  <td style="border-radius:12px; background-color:#10b981; text-align:center; box-shadow:0 8px 18px rgba(16,185,129,0.28); border:2px solid #059669;">
  <a
    href="${shippingLabelUrl}"
    target="_blank"
    style="display:block; padding:24px 18px; font-size:20px; font-weight:800; color:#ffffff; text-decoration:none; border-radius:12px;"
  >
    OPEN &amp; PRINT YOUR SHIPPING LABEL
  </a>
</td>
                </tr>
              </table>

              ${
                labelAttachment
                  ? `
              <div style="margin-top:14px; font-size:14px; line-height:1.5; color:#475569; text-align:center;">
                We also attached a copy of your shipping label to this email.
              </div>
              `
                  : ''
              }

            </td>
          </tr>

          <!-- Shipping -->
          <tr>
            <td style="padding:20px 24px 0 24px;">
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;"
              >
                <tr>
                  <td style="padding:18px 20px 4px 20px;">
                    <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#10b981;">
                      Shipping
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 20px 12px 20px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      ${row(
                        'Tracking Number',
                        trackingNumber,
                        true
                      )}

                      <tr>
                        <td style="padding:12px 0;">
                          <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">
                            Carrier
                          </div>

                          <div style="font-size:16px; color:#0f172a; font-weight:600;">
                            ${carrierUpper}
                          </div>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          ${
            totalItems || packageDimensions
              ? `
          <!-- Your Box -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;"
              >
                <tr>
                  <td style="padding:18px 20px 4px 20px;">
                    <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#10b981;">
                      Your Box
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 20px 12px 20px;">
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                    >

                      ${
                        totalItems
                          ? row(
                              'Number of Items',
                              String(totalItems)
                            )
                          : ''
                      }

                      ${
                        packageDimensions
                          ? `
                        ${row(
                          'Box Size',
                          `${packageDimensions.length} &times; ${packageDimensions.width} &times; ${packageDimensions.height} in`
                        )}

                        <tr>
                          <td style="padding:12px 0;">
                            <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">
                              Weight
                            </div>

                            <div style="font-size:16px; color:#0f172a; font-weight:600;">
                              ${packageDimensions.weight} lb
                            </div>
                          </td>
                        </tr>
                        `
                          : ''
                      }

                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Next Steps -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="background-color:#fffbeb; border-radius:12px; border:1px solid #fde68a;"
              >
                <tr>
                  <td style="padding:20px;">

                    <div style="font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#92400e; margin-bottom:12px;">
                      Next Steps
                    </div>

                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="font-size:16px; color:#78350f; line-height:1.5;"
                    >
                      <tr>
                        <td style="padding:7px 0;">
                          <strong>1.</strong>&nbsp;&nbsp;<strong>Open and print your shipping label</strong>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:7px 0;">
                          <strong>2.</strong>&nbsp;&nbsp;Pack your items securely in a box
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:7px 0;">
                          <strong>3.</strong>&nbsp;&nbsp;Attach the printed label to the package
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:7px 0;">
                          <strong>4.</strong>&nbsp;&nbsp;Drop it off at ${carrierUpper}
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment note -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="background-color:#eff6ff; border-radius:12px; border:1px solid #bfdbfe;"
              >
                <tr>
                  <td style="padding:18px 20px; font-size:15px; color:#1e40af; line-height:1.5;">
                    <strong>Your payment:</strong>
                    Once your items arrive and are checked, we'll send payment straight to your PayPal account.
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
              <div style="font-size:14px; font-weight:600; color:#475569;">
                SellBook Media
              </div>

              <div style="font-size:12px; color:#94a3b8; margin-top:6px;">
                Ref ${shortId} &nbsp;&middot;&nbsp; ${dateStr}
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

    const emailText = `You're ready to ship

Your prepaid shipping label is ready.

STEP 1 - PRINT YOUR SHIPPING LABEL

Open your shipping label here:
${shippingLabelUrl}

${labelAttachment ? 'A PDF copy of your shipping label is also attached to this email.\n' : ''}
SHIPPING
Tracking number: ${trackingNumber}
Carrier: ${carrierUpper}

${
  totalItems || packageDimensions
    ? `
YOUR BOX${
        totalItems
          ? `
Number of items: ${totalItems}`
          : ''
      }${
        packageDimensions
          ? `
Box size: ${packageDimensions.length} x ${packageDimensions.width} x ${packageDimensions.height} in
Weight: ${packageDimensions.weight} lb`
          : ''
      }
`
    : ''
}
NEXT STEPS
1. Open and print your shipping label
2. Pack your items securely in a box
3. Attach the printed label to the package
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
      text: emailText,
      attachments: labelAttachment
        ? [labelAttachment]
        : []
    });

    console.log(
      `Email sent to ${email} for listing ${listingId}${
        labelAttachment
          ? ' with shipping label attachment'
          : ' without shipping label attachment'
      }`
    );

    return NextResponse.json({
      success: true
    });

  } catch (error: unknown) {
    console.error('Email error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  }
}