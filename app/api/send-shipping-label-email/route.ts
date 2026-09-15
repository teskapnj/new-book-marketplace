// app/api/send-shipping-label-email/route.ts
// Satici onaylandiginda kargo etiketi maili
// NOT: Mobilde tasma olmamasi icin tek sutunlu yapi kullaniliyor.
//      Etiket ustte, deger altta - uzun tracking numaralari sigar.

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_LABEL_SIZE_BYTES = 10 * 1024 * 1024;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      email,
      sellerName,
      listingTitle,
      shippingLabelUrl,
      trackingNumber,
      carrier,
      listingId,
      totalItems,
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
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    const rawListingId = listingId ? String(listingId) : "";
    const shortId = /^SBM-\d{5}$/.test(rawListingId)
      ? rawListingId
      : rawListingId.substring(0, 8) || "n/a";

    const carrierUpper = String(carrier).toUpperCase();

    const dateStr = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    });

    // ------------------------------------------------------------
    // Shipping label attachment
    // Label Firebase Storage download URL'sinden server tarafinda indirilir.
    // Indirme basarisiz olursa email yine link ile gonderilir.
    // ------------------------------------------------------------
    let labelAttachment: {
      filename: string;
      content: Buffer;
      contentType: string;
    } | null = null;

    try {
      const labelResponse = await fetch(shippingLabelUrl, {
        cache: "no-store",
      });

      if (!labelResponse.ok) {
        throw new Error(
          `Shipping label download failed with status ${labelResponse.status}`,
        );
      }

      const contentLengthHeader = labelResponse.headers.get("content-length");

      if (contentLengthHeader) {
        const contentLength = Number(contentLengthHeader);

        if (
          Number.isFinite(contentLength) &&
          contentLength > MAX_LABEL_SIZE_BYTES
        ) {
          throw new Error("Shipping label exceeds maximum allowed size");
        }
      }

      const labelArrayBuffer = await labelResponse.arrayBuffer();

      if (labelArrayBuffer.byteLength > MAX_LABEL_SIZE_BYTES) {
        throw new Error("Shipping label exceeds maximum allowed size");
      }

      const labelBuffer = Buffer.from(labelArrayBuffer);

      if (labelBuffer.length > 0) {
        labelAttachment = {
          filename: `SellBookMedia-Shipping-Label-${shortId}.pdf`,
          content: labelBuffer,
          contentType: "application/pdf",
        };
      }
    } catch (attachmentError) {
      console.error(
        "Shipping label attachment could not be created:",
        attachmentError,
      );
    }

    // Tek sutunlu satir: etiket ustte kucuk, deger altta buyuk
    const row = (label: string, value: string, mono = false) => `
      <tr>
        <td style="padding:12px 0; border-bottom:1px solid #e2e8f0;">
          <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">${label}</div>
          <div style="font-size:16px; color:#0f172a; font-weight:600; ${
            mono
              ? "font-family:'SF Mono',Consolas,monospace; word-break:break-all;"
              : ""
          }">${value}</div>
        </td>
      </tr>`;

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
  <title>Ready to Ship</title>
</head>
<body style="margin:0;padding:0;background:#eef1f5;color:#172033;font-family:Arial,Helvetica,sans-serif;">

  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Your prepaid ${carrierUpper} shipping label for order ${shortId} is ready.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5;padding:24px 10px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:650px;background:#ffffff;border:1px solid #cfd7e4;">

          <!-- Design B — Postal / Utility header -->
          <tr>
            <td style="padding:22px 30px;background:#0b3b75;color:#ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-weight:800;font-size:20px;">SellBookMedia</td>
                  <td align="right" style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#d7e5f7;">
                    Prepaid ${carrierUpper} Shipment
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:34px 30px 30px;">

              <div style="display:inline-block;padding:6px 10px;border:1px solid #b8c9df;font-size:12px;font-weight:800;color:#0b3b75;letter-spacing:.08em;text-transform:uppercase;">
                Ready to ship
              </div>

              <div style="margin-top:18px;font-size:16px;font-weight:700;color:#344054;">
                Hi ${sellerName || "there"},
              </div>

              <h2 style="font-size:28px;margin:8px 0 8px;line-height:1.18;color:#172033;">
                Your shipping label is ready
              </h2>

              <div style="font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#0b3b75;margin-bottom:10px;">
                Order No: ${shortId}
              </div>

              <p style="margin:0;color:#5f6b7a;line-height:1.7;font-size:16px;">
                Your label has been created. Print it, attach it to the package, and hand the sealed box to ${carrierUpper}.
              </p>

              <!-- Postal / Utility shipment block -->
              <div style="margin-top:26px;border:2px solid #0b3b75;">
                <div style="padding:16px 18px;background:#eef5fb;border-bottom:1px solid #b8c9df;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <div style="font-size:12px;color:#53657a;text-transform:uppercase;">Service</div>
                        <div style="padding-top:5px;font-size:18px;font-weight:800;">
                          ${carrierUpper}${carrierUpper === "USPS" ? " Media Mail" : ""}
                        </div>
                      </td>
                      <td align="right">
                        <div style="font-size:12px;color:#53657a;text-transform:uppercase;">Items</div>
                        <div style="padding-top:5px;font-size:18px;font-weight:800;">
                          ${totalItems || "—"}
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>

                <div style="padding:20px 18px;">
                  <div style="font-size:12px;color:#667085;text-transform:uppercase;">Tracking number</div>
                  <div style="margin-top:5px;font-family:monospace;font-size:18px;font-weight:700;word-break:break-all;">
                    ${trackingNumber}
                  </div>
                </div>
              </div>

              <a
                href="${shippingLabelUrl}"
                target="_blank"
                style="display:block;margin-top:22px;text-align:center;background:#0b3b75;color:#ffffff;padding:15px 18px;font-weight:800;font-size:15px;text-decoration:none;"
              >
                OPEN &amp; PRINT SHIPPING LABEL
              </a>

              ${
                labelAttachment
                  ? `<div style="text-align:center;margin-top:9px;font-size:13px;color:#667085;">The PDF label is also attached.</div>`
                  : ""
              }

              <!-- Package requirements intentionally removed -->

              <div style="margin-top:28px;padding:18px;background:#f5f7fa;border-left:4px solid #0b3b75;">
                <div style="font-weight:800;">After drop-off</div>
                <div style="margin-top:5px;font-size:14px;line-height:1.7;color:#5f6b7a;">
                  Once ${carrierUpper} scans your package, tracking will begin. We'll email you again after your shipment arrives and is checked in.
                </div>
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

    const emailText = `READY TO SHIP

Hi ${sellerName || "there"},

Your shipping label is ready.
Order No: ${shortId}

SHIPPING
Carrier: ${carrierUpper}
Tracking number: ${trackingNumber}
${totalItems ? `Items: ${totalItems}\n` : ""}
OPEN & PRINT SHIPPING LABEL
${shippingLabelUrl}

${labelAttachment ? "A PDF copy of your shipping label is also attached to this email.\n" : ""}
AFTER DROP-OFF
Once ${carrierUpper} scans your package, tracking will begin. We'll email you again after your shipment arrives and is checked in.

Need help? support@sellbookmedia.com

SellBookMedia
Ref ${shortId}`;

    await transporter.sendMail({
      from: `"SellBook Media" <${process.env.GMAIL_USER}>`,
      to: email,
      replyTo: process.env.EMAIL_USER,
      subject: `You're ready to ship - your prepaid label is enclosed`,
      html: emailHtml,
      text: emailText,
      attachments: labelAttachment ? [labelAttachment] : [],
    });

    console.log(
      `Email sent to ${email} for listing ${listingId}${
        labelAttachment
          ? " with shipping label attachment"
          : " without shipping label attachment"
      }`,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    console.error("Email error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
