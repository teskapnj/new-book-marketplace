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
  <title>We've received your submission</title>
</head>
<body style="margin:0;padding:0;background:#eef1f5;color:#172033;font-family:Arial,Helvetica,sans-serif;">

  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    We've received your SellBookMedia submission ${submissionId}.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5;padding:24px 10px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:650px;background:#ffffff;border:1px solid #cfd7e4;">

          <tr>
            <td style="padding:22px 30px;background:#0b3b75;color:#ffffff;font-weight:800;font-size:20px;">
              SellBookMedia
            </td>
          </tr>

          <tr>
            <td style="padding:34px 30px 30px;">

              <div style="font-size:16px;font-weight:700;color:#344054;">
                Hi ${sellerName || "there"},
              </div>

              <h2 style="font-size:28px;margin:8px 0 8px;line-height:1.18;color:#172033;">
                We've received your submission
              </h2>

              <div style="font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#0b3b75;margin-bottom:10px;">
                Submission No: ${submissionId}
              </div>

              <p style="margin:0;color:#5f6b7a;line-height:1.7;font-size:16px;">
                Thanks for submitting your items. We'll email your free prepaid shipping label within 24 hours.
              </p>

              <div style="margin-top:26px;border:2px solid #0b3b75;">
                <div style="padding:16px 18px;background:#eef5fb;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <div style="font-size:12px;color:#53657a;text-transform:uppercase;">Items</div>
                        <div style="padding-top:5px;font-size:18px;font-weight:800;">
                          ${totalItems}
                        </div>
                      </td>
                      <td align="right">
                        <div style="font-size:12px;color:#53657a;text-transform:uppercase;">Estimated Value</div>
                        <div style="padding-top:5px;font-size:18px;font-weight:800;">
                          $${Number(totalValue).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <div style="margin-top:28px;padding:18px;background:#f5f7fa;border-left:4px solid #0b3b75;">
                <div style="font-weight:800;">What happens next</div>
                <div style="margin-top:7px;font-size:14px;line-height:1.8;color:#5f6b7a;">
                  <strong>1.</strong> We'll email your prepaid shipping label within 24 hours.<br>
                  <strong>2.</strong> Pack your items securely and drop off the package.<br>
                  <strong>3.</strong> After we receive and inspect your items, we'll process payment using the method you selected at checkout.
                </div>
                <div style="margin-top:10px;font-size:13px;line-height:1.6;color:#667085;">
                  Please check your inbox and spam folder for the shipping label email.
                </div>
              </div>

              <div style="margin-top:30px;border-top:1px solid #dbe1e8;padding-top:24px;">
                <div style="font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#344054;">
                  Submitted Items
                </div>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                  ${itemRows}
                  <tr>
                    <td style="padding:10px 0 0;border-top:2px solid #344054;font-size:13px;font-weight:800;color:#172033;">
                      Total Offer
                    </td>
                    <td align="right" style="padding:10px 0 0;border-top:2px solid #344054;font-size:13px;font-weight:800;color:#172033;">
                      $${Number(totalValue).toFixed(2)}
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <tr>
            <td style="padding:20px 30px;border-top:1px solid #dbe1e8;font-size:13px;color:#667085;">
              Need help? <strong style="color:#344054;">support@sellbookmedia.com</strong>
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
      subject: "We've received your submission - SellBook Media",
      html: emailHtml,
      text: `Hi ${sellerName || "there"},

We've received your submission.
Submission No: ${submissionId}

Thanks for submitting your items. We'll email your free prepaid shipping label within 24 hours.

Submission Details:
- Total Items: ${totalItems}
- Estimated Value: $${Number(totalValue).toFixed(2)}

What happens next?
1. We'll email your prepaid shipping label within 24 hours.
2. Pack your items securely and drop off the package.
3. After we receive and inspect your items, we'll process payment using the method you selected at checkout.

Please check your inbox and spam folder for the shipping label email.

Need help? support@sellbookmedia.com

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
