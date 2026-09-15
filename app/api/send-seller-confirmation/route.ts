import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const {
      sellerName,
      sellerEmail,
      totalItems,
      totalValue,
      submissionId,
      items = [],
    } = await request.json();

    // Namecheap için transporter yapılandırması
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const itemRows = Array.isArray(items)
      ? items
          .map((item: any) => {
            const title =
              item?.amazonData?.title ||
              `${item?.category || "Item"} ${item?.isbn || ""}`.trim();

            const barcode = item?.isbn || "";
            const offer = Number(item?.price || 0);

            return `
        <tr>
          <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
            <div style="font-size:13px;font-weight:600;color:#0f172a;line-height:1.4;">
              ${title}
            </div>
            <div style="margin-top:2px;font-size:11px;color:#64748b;text-decoration:none;">
              ${barcode ? `ISBN/UPC: ${barcode}` : ""}
            </div>
          </td>
          <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;font-size:12px;font-weight:700;color:#0f172a;text-align:right;white-space:nowrap;">
            $${offer.toFixed(2)}
          </td>
        </tr>
      `;
          })
          .join("")
      : "";

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
  <style>
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
    }
  </style>
  <title>Submission Received</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; -webkit-font-smoothing:antialiased;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    We received your submission. Your prepaid shipping label will be emailed within 24 hours.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:24px 0;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

          <!-- Header -->
          <tr>
            <td style="background-color:#10b981; padding:30px 40px; text-align:center;">
              <div style="font-size:18px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:#d1fae5; margin-bottom:10px;">SellBook Media</div>
              <div style="font-size:24px; font-weight:700; color:#ffffff; line-height:1.3;">We received your submission</div>
              <div style="font-size:21px; color:#d1fae5; margin-top:7px;">Thanks for your submission.</div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:26px 40px 8px 40px;">
              <p style="margin:0 0 14px 0; font-size:22.5px; line-height:1.6; color:#334155;">
                Hi ${sellerName},
              </p>
              <p style="margin:0; font-size:22.5px; line-height:1.6; color:#334155;">
                We've received your submission. We'll email your free prepaid shipping label within 24 hours.
              </p>
            </td>
          </tr>

          <!-- Submission Details -->
          <tr>
            <td style="padding:16px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:18px 24px 8px 24px;">
                    <div style="font-size:18px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:#10b981;">Submission Details</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 24px 16px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:19.5px; color:#64748b;">Total Items</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:19.5px; color:#0f172a; font-weight:600; text-align:right;">${totalItems}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:19.5px; color:#64748b;">Estimated Value</td>
                        <td style="padding:10px 0; border-bottom:1px solid #e2e8f0; font-size:19.5px; color:#0f172a; font-weight:600; text-align:right;">$${totalValue.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0; font-size:19.5px; color:#64748b;">Submission ID</td>
                        <td style="padding:10px 0; font-size:19.5px; color:#0f172a; font-weight:600; text-align:right; font-family:monospace;">${submissionId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td style="padding:8px 40px 16px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:12px; border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:22px 26px;">
                    <div style="font-size:18px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:#10b981; margin-bottom:12px;">What Happens Next</div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:19.5px; color:#334155; line-height:1.5;">
                      <tr><td style="padding:6px 0;"><strong>1.</strong>&nbsp;&nbsp;We'll email your prepaid shipping label within 24 hours</td></tr>
                      <tr><td style="padding:6px 0;"><strong>2.</strong>&nbsp;&nbsp;Pack your items securely and attach the label</td></tr>
                      <tr><td style="padding:6px 0;"><strong>3.</strong>&nbsp;&nbsp;Drop off your package</td></tr>
                      <tr><td style="padding:6px 0;"><strong>4.</strong>&nbsp;&nbsp;Once we receive and inspect your items, we'll process payment using the method you selected at checkout — PayPal, Venmo, or check by mail</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important note -->
          <tr>
            <td style="padding:8px 40px 16px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb; border-radius:12px; border:1px solid #fde68a;">
                <tr>
                  <td style="padding:16px 22px; font-size:19.5px; color:#78350f; line-height:1.5;">
                    <strong>Important:</strong> Your shipping label will arrive in a separate email. Please check your inbox (and your spam folder, just in case) for it.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:8px 40px 26px 40px;">
              <p style="margin:0; font-size:21px; line-height:1.6; color:#334155;">
                If you have any questions, just reply to this email — we're happy to help.
              </p>
            </td>
          </tr>

          <!-- Submitted Items -->
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:18px 0 8px 0;">
                    <div style="font-size:15px;font-weight:700;color:#0f172a;">
                      Submitted Items
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${itemRows}
                      <tr>
                        <td style="padding:10px 0 0;border-top:2px solid #334155;font-size:13px;font-weight:700;color:#0f172a;">
                          Total Offer
                        </td>
                        <td style="padding:10px 0 0;border-top:2px solid #334155;font-size:13px;font-weight:700;color:#0f172a;text-align:right;">
                          $${totalValue.toFixed(2)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; padding:24px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <div style="font-size:19.5px; font-weight:600; color:#475569;">SellBook Media</div>
              <div style="font-size:16.5px; color:#94a3b8; margin-top:5px;">Submission ${submissionId} &nbsp;·&nbsp; ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

    const mailOptions = {
      from: `"SellBook Media" <${process.env.GMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to: sellerEmail,
      subject: "We received your submission - SellBook Media",
      html: emailHtml,
      text: `Thank you for your submission!

Hi ${sellerName},

We've received your submission. We'll email your free prepaid shipping label within 24 hours.

Submission Details:
- Total Items: ${totalItems}
- Estimated Value: $${totalValue.toFixed(2)}
- Submission ID: ${submissionId}

What happens next?
1. We'll email your prepaid shipping label within 24 hours
2. Pack your items securely and attach the label
3. Drop off your package
4. Once we receive and inspect your items, we'll process payment using the method you selected at checkout — PayPal, Venmo, or check by mail

Important: Please check your email (including your spam folder) for the shipping label in a separate email.

If you have any questions, just reply to this email.

Best regards,
SellBook Media Team`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending seller confirmation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 },
    );
  }
}
