import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/firebaseAdmin";
import { getTrackingStatus } from "@/lib/shippo";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_LABEL_SIZE_BYTES = 10 * 1024 * 1024;

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function getTimestampMs(value: any): number | null {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getSellerEmail(
  listing: any
): Promise<string | null> {
  if (
    typeof listing.vendorEmail === "string" &&
    listing.vendorEmail.trim()
  ) {
    return listing.vendorEmail.trim();
  }

  if (
    typeof listing.vendorId === "string" &&
    listing.vendorId.trim()
  ) {
    const userDoc = await db
      .collection("users")
      .doc(listing.vendorId)
      .get();

    const email = userDoc.data()?.email;

    if (
      typeof email === "string" &&
      email.trim()
    ) {
      return email.trim();
    }
  }

  return null;
}

function getSellerName(listing: any): string {
  const firstName =
    listing.shippingInfo?.firstName || "";

  const lastName =
    listing.shippingInfo?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    listing.vendorName ||
    "Seller"
  );
}

function getShortId(listingId: string): string {
  return listingId
    ? String(listingId).substring(0, 8)
    : "n/a";
}

type LabelAttachment = {
  filename: string;
  content: Buffer;
  contentType: string;
};

async function getShippingLabelAttachment(
  shippingLabelUrl: string,
  listingId: string,
  shippingLabelPreference: "pdf" | "qr"
): Promise<LabelAttachment | null> {
  if (!shippingLabelUrl) {
    return null;
  }

  const isQrCode =
    shippingLabelPreference === "qr";

  try {
    const url = new URL(shippingLabelUrl);

    const allowedHosts = [
      "firebasestorage.googleapis.com",
      "storage.googleapis.com",
    ];

    if (
      url.protocol !== "https:" ||
      !allowedHosts.includes(url.hostname)
    ) {
      console.warn(
        `Skipping shipping attachment for ${listingId}: invalid URL`
      );

      return null;
    }

    const response = await fetch(
      url.toString(),
      {
        cache: "no-store",
        redirect: "error",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Shipping attachment download failed with status ${response.status}`
      );
    }

    const contentLengthHeader =
      response.headers.get("content-length");

    if (contentLengthHeader) {
      const contentLength =
        Number(contentLengthHeader);

      if (
        Number.isFinite(contentLength) &&
        contentLength >
          MAX_LABEL_SIZE_BYTES
      ) {
        throw new Error(
          "Shipping attachment exceeds maximum allowed size"
        );
      }
    }

    const attachmentArrayBuffer =
      await response.arrayBuffer();

    if (
      attachmentArrayBuffer.byteLength >
      MAX_LABEL_SIZE_BYTES
    ) {
      throw new Error(
        "Shipping attachment exceeds maximum allowed size"
      );
    }

    const attachmentBuffer =
      Buffer.from(attachmentArrayBuffer);

    if (attachmentBuffer.length === 0) {
      throw new Error(
        "Shipping attachment is empty"
      );
    }

    const rawContentType =
      response.headers
        .get("content-type")
        ?.toLowerCase()
        .split(";")[0]
        .trim() || "";

    const pdfSignature =
      attachmentBuffer
        .subarray(0, 4)
        .toString("ascii");

    if (!isQrCode) {
      if (pdfSignature !== "%PDF") {
        throw new Error(
          "Shipping label is not a valid PDF"
        );
      }

      return {
        filename:
          `SellBookMedia-Shipping-Label-${getShortId(
            listingId
          )}.pdf`,
        content: attachmentBuffer,
        contentType: "application/pdf",
      };
    }

    // QR code admin tarafinda image veya PDF olarak yuklenebilir.
    if (pdfSignature === "%PDF") {
      return {
        filename:
          `SellBookMedia-USPS-QR-${getShortId(
            listingId
          )}.pdf`,
        content: attachmentBuffer,
        contentType: "application/pdf",
      };
    }

    let extension = "";
    let contentType = "";

    if (
      attachmentBuffer.length >= 8 &&
      attachmentBuffer
        .subarray(0, 8)
        .equals(
          Buffer.from([
            0x89, 0x50, 0x4e, 0x47,
            0x0d, 0x0a, 0x1a, 0x0a,
          ])
        )
    ) {
      extension = "png";
      contentType = "image/png";
    } else if (
      attachmentBuffer.length >= 3 &&
      attachmentBuffer[0] === 0xff &&
      attachmentBuffer[1] === 0xd8 &&
      attachmentBuffer[2] === 0xff
    ) {
      extension = "jpg";
      contentType = "image/jpeg";
    } else if (
      attachmentBuffer.length >= 12 &&
      attachmentBuffer
        .subarray(0, 4)
        .toString("ascii") === "RIFF" &&
      attachmentBuffer
        .subarray(8, 12)
        .toString("ascii") === "WEBP"
    ) {
      extension = "webp";
      contentType = "image/webp";
    } else if (
      attachmentBuffer.length >= 6 &&
      ["GIF87a", "GIF89a"].includes(
        attachmentBuffer
          .subarray(0, 6)
          .toString("ascii")
      )
    ) {
      extension = "gif";
      contentType = "image/gif";
    }

    if (!extension) {
      throw new Error(
        `Unsupported USPS QR attachment type: ${
          rawContentType || "unknown"
        }`
      );
    }

    return {
      filename:
        `SellBookMedia-USPS-QR-${getShortId(
          listingId
        )}.${extension}`,
      content: attachmentBuffer,
      contentType,
    };
  } catch (error) {
    console.error(
      `Shipping attachment could not be created for ${listingId}:`,
      error
    );

    return null;
  }
}

function shippingInfoBlock(
  trackingNumber: string,
  carrierUpper: string
) {
  return `
    <tr>
      <td style="padding:16px 24px 0 24px;">
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            background-color:#f8fafc;
            border-radius:12px;
            border:1px solid #e2e8f0;
          "
        >
          <tr>
            <td style="padding:18px 20px 4px 20px;">
              <div style="
                font-size:12px;
                font-weight:700;
                letter-spacing:1px;
                text-transform:uppercase;
                color:#10b981;
              ">
                Shipping
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 20px 12px 20px;">

              <div style="
                padding:12px 0;
                border-bottom:1px solid #e2e8f0;
              ">
                <div style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  letter-spacing:0.5px;
                  margin-bottom:4px;
                ">
                  Tracking Number
                </div>

                <div style="
                  font-size:16px;
                  color:#0f172a;
                  font-weight:600;
                  font-family:'SF Mono',Consolas,monospace;
                  word-break:break-all;
                ">
                  ${escapeHtml(trackingNumber)}
                </div>
              </div>

              <div style="padding:12px 0;">
                <div style="
                  font-size:12px;
                  color:#64748b;
                  text-transform:uppercase;
                  letter-spacing:0.5px;
                  margin-bottom:4px;
                ">
                  Carrier
                </div>

                <div style="
                  font-size:16px;
                  color:#0f172a;
                  font-weight:600;
                ">
                  ${escapeHtml(carrierUpper)}
                </div>
              </div>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function attachmentBlock(
  attachmentAvailable: boolean,
  isQrCode: boolean
) {
  if (!attachmentAvailable) {
    return "";
  }

  const heading =
    isQrCode
      ? "USPS QR Code Attached"
      : "Shipping Label Attached";

  const message =
    isQrCode
      ? `A copy of your USPS QR code is attached to this email.
         Open it on your phone and show it at a participating USPS location.
         No printer is needed.`
      : `A PDF copy of your prepaid shipping label is attached to this email.
         Open the attachment and print it before shipping your package.`;

  return `
    <tr>
      <td style="padding:16px 24px 0 24px;">
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            background-color:#ecfdf5;
            border-radius:12px;
            border:1px solid #a7f3d0;
          "
        >
          <tr>
            <td style="padding:20px;">
              <div style="
                font-size:12px;
                font-weight:700;
                letter-spacing:1px;
                text-transform:uppercase;
                color:#047857;
                margin-bottom:10px;
              ">
                ${heading}
              </div>

              <div style="
                font-size:16px;
                color:#065f46;
                line-height:1.6;
              ">
                ${message}
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function nextStepsBlock(
  carrierUpper: string,
  isQrCode: boolean
) {
  if (isQrCode) {
    return `
      <tr>
        <td style="padding:16px 24px 0 24px;">
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color:#fffbeb;
              border-radius:12px;
              border:1px solid #fde68a;
            "
          >
            <tr>
              <td style="padding:20px;">

                <div style="
                  font-size:12px;
                  font-weight:700;
                  letter-spacing:1px;
                  text-transform:uppercase;
                  color:#92400e;
                  margin-bottom:12px;
                ">
                  Next Steps
                </div>

                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    font-size:16px;
                    color:#78350f;
                    line-height:1.5;
                  "
                >
                  <tr>
                    <td style="padding:7px 0;">
                      <strong>1.</strong>&nbsp;&nbsp;Pack and seal your box
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:7px 0;">
                      <strong>2.</strong>&nbsp;&nbsp;Open your USPS QR code on your phone
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:7px 0;">
                      <strong>3.</strong>&nbsp;&nbsp;Show the QR code at a participating USPS location
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:7px 0;">
                      <strong>4.</strong>&nbsp;&nbsp;USPS can print the shipping label for you
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:7px 0;">
                      <strong>5.</strong>&nbsp;&nbsp;Hand over your sealed package
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  return `
    <tr>
      <td style="padding:16px 24px 0 24px;">
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            background-color:#fffbeb;
            border-radius:12px;
            border:1px solid #fde68a;
          "
        >
          <tr>
            <td style="padding:20px;">

              <div style="
                font-size:12px;
                font-weight:700;
                letter-spacing:1px;
                text-transform:uppercase;
                color:#92400e;
                margin-bottom:12px;
              ">
                Next Steps
              </div>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  font-size:16px;
                  color:#78350f;
                  line-height:1.5;
                "
              >
                <tr>
                  <td style="padding:7px 0;">
                    <strong>1.</strong>&nbsp;&nbsp;Open the attached shipping label
                  </td>
                </tr>

                <tr>
                  <td style="padding:7px 0;">
                    <strong>2.</strong>&nbsp;&nbsp;Print the label
                  </td>
                </tr>

                <tr>
                  <td style="padding:7px 0;">
                    <strong>3.</strong>&nbsp;&nbsp;Pack your items securely
                  </td>
                </tr>

                <tr>
                  <td style="padding:7px 0;">
                    <strong>4.</strong>&nbsp;&nbsp;Attach the label to your box
                  </td>
                </tr>

                <tr>
                  <td style="padding:7px 0;">
                    <strong>5.</strong>&nbsp;&nbsp;Drop it off at ${escapeHtml(
                      carrierUpper
                    )}
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function changedMindBlock() {
  return `
    <tr>
      <td style="padding:16px 24px 0 24px;">
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            background-color:#f8fafc;
            border-radius:12px;
            border:1px solid #e2e8f0;
          "
        >
          <tr>
            <td style="
              padding:18px 20px;
              font-size:15px;
              color:#475569;
              line-height:1.5;
            ">
              <strong>Changed your mind?</strong><br>
              If you no longer want to ship this order,
              simply reply to this email and let us know.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function alreadyShippedBlock() {
  return `
    <tr>
      <td style="padding:16px 24px 0 24px;">
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            background-color:#eff6ff;
            border-radius:12px;
            border:1px solid #bfdbfe;
          "
        >
          <tr>
            <td style="
              padding:18px 20px;
              font-size:15px;
              color:#1e40af;
              line-height:1.5;
            ">
              If you already dropped off your package recently,
              you can ignore this email while USPS updates
              the tracking information.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;
}

function footerBlock(
  shortId: string
) {
  return `
    <tr>
      <td style="padding:20px 24px 28px 24px;">
        <p style="
          margin:0;
          font-size:15px;
          line-height:1.6;
          color:#334155;
        ">
          Questions? Just reply to this email &mdash;
          we're happy to help.
        </p>
      </td>
    </tr>

    <tr>
      <td style="
        background-color:#f8fafc;
        padding:20px 24px;
        text-align:center;
        border-top:1px solid #e2e8f0;
      ">
        <div style="
          font-size:14px;
          font-weight:600;
          color:#475569;
        ">
          SellBook Media
        </div>

        <div style="
          font-size:12px;
          color:#94a3b8;
          margin-top:6px;
        ">
          Ref ${escapeHtml(shortId)}
        </div>
      </td>
    </tr>
  `;
}

async function sendFiveDayReminder({
  email,
  sellerName,
  trackingNumber,
  carrier,
  shippingLabelUrl,
  listingId,
  shippingLabelPreference,
}: {
  email: string;
  sellerName: string;
  trackingNumber: string;
  carrier: string;
  shippingLabelUrl: string;
  listingId: string;
  shippingLabelPreference: "pdf" | "qr";
}) {
  const safeSellerName =
    escapeHtml(sellerName);

  const carrierUpper =
    carrier.toUpperCase();

  const shortId =
    getShortId(listingId);

  const isQrCode =
    shippingLabelPreference === "qr";

  const labelAttachment =
    await getShippingLabelAttachment(
      shippingLabelUrl,
      listingId,
      shippingLabelPreference
    );

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
  <meta name="color-scheme" content="light">
  <title>Shipping Reminder</title>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#f1f5f9;
  -webkit-font-smoothing:antialiased;
">

  <div style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
    color:transparent;
  ">
    Just a quick reminder about your shipment.
  </div>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
      background-color:#f1f5f9;
      padding:16px 12px;
    "
  >
    <tr>
      <td align="center">

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:600px;
            background-color:#ffffff;
            border-radius:16px;
            overflow:hidden;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
          "
        >

          <!-- Header -->
          <tr>
            <td style="
              background-color:#10b981;
              padding:32px 24px;
              text-align:center;
            ">

              <div style="
                font-size:12px;
                font-weight:600;
                letter-spacing:1px;
                text-transform:uppercase;
                color:#d1fae5;
                margin-bottom:10px;
              ">
                SellBook Media
              </div>

              <div style="
                font-size:24px;
                font-weight:700;
                color:#ffffff;
                line-height:1.3;
              ">
                Shipping Reminder
              </div>

              <div style="
                font-size:15px;
                color:#d1fae5;
                margin-top:8px;
              ">
                Just a quick reminder about your shipment.
              </div>

            </td>
          </tr>

          <!-- Main message -->
          <tr>
            <td style="
              padding:28px 24px 0 24px;
            ">

              <p style="
                margin:0;
                font-size:17px;
                line-height:1.6;
                color:#334155;
              ">
                Hi ${safeSellerName},
              </p>

              <p style="
                margin:14px 0 0 0;
                font-size:16px;
                line-height:1.6;
                color:#334155;
              ">
                It looks like USPS has not scanned your package yet.
If you haven't had a chance to ship it, no worries.
              </p>

              <p style="
                margin:14px 0 0 0;
                font-size:16px;
                line-height:1.6;
                color:#334155;
              ">
              ${
                isQrCode
                  ? labelAttachment
                    ? `Your USPS QR code is attached to this email for your convenience.
                       Pack and seal your box, open the QR code on your phone,
                       and show it at a participating USPS location.
                       USPS can print the shipping label for you.`
                    : `Use the USPS QR code from your original shipping email.
                       Pack and seal your box, show the QR code on your phone
                       at a participating USPS location, and USPS can print the label for you.`
                  : labelAttachment
                    ? `Your prepaid shipping label is attached to this email for your convenience.
                       Whenever you're ready, simply print the attached PDF,
                       pack your items securely, attach the label to your box,
                       and drop it off at USPS.`
                    : `Whenever you're ready, simply pack your items securely
                       and drop your package off at USPS.`
              }
              </p>

            </td>
          </tr>

          ${shippingInfoBlock(
            trackingNumber,
            carrierUpper
          )}

          ${attachmentBlock(
            Boolean(labelAttachment),
            isQrCode
          )}

          ${
            isQrCode || labelAttachment
              ? nextStepsBlock(
                  carrierUpper,
                  isQrCode
                )
              : ""
          }

          ${changedMindBlock()}

          ${alreadyShippedBlock()}

          <!-- My Orders alternative label access -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <div style="padding:16px;background:#eef5fb;border:1px solid #d4e3f5;border-radius:8px;font-size:14px;line-height:1.6;color:#344054;">
                <strong>Need your shipping label or QR code again?</strong>
                <br>
                You can access your prepaid label or USPS QR code anytime in My Orders, along with tracking information.
                <br>
                <a href="https://www.sellbookmedia.com/my-orders" style="font-weight:800;color:#0b3b75;">
                  Open My Orders
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 0 24px;">
              <div style="
                padding:14px 16px;
                background-color:#f8fafc;
                border:1px solid #e2e8f0;
                border-radius:8px;
                font-size:13px;
                line-height:1.5;
                color:#64748b;
              ">
                If you have any questions, simply reply to this email or contact us at
<strong>support@sellbookmedia.com</strong>. We're happy to help.
<br><br>
<strong>Friendly reminder:</strong> If you're expecting emails from us,
please also check your spam or junk folder. Messages from
<strong>support@sellbookmedia.com</strong> may occasionally be filtered there by your email provider.
<br><br>
Thank you for using SellBook Media!

</div>
            </td>
          </tr>

          ${footerBlock(shortId)}

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

const emailText = `Shipping Reminder

Hi ${sellerName},

Just a quick reminder about your SellBook Media shipment.

It looks like USPS has not scanned your package yet. If you haven't had a chance to ship it, no worries.

${
  isQrCode
    ? labelAttachment
      ? `Your USPS QR code is attached to this email for your convenience.

Pack and seal your box, open the QR code on your phone, and show it at a participating USPS location. USPS can print the shipping label for you.`
      : `Use the USPS QR code from your original shipping email.

Pack and seal your box, show the QR code on your phone at a participating USPS location, and USPS can print the shipping label for you.`
    : labelAttachment
      ? `Your prepaid shipping label is attached to this email for your convenience.

Whenever you're ready, simply print the attached PDF, pack your items securely, attach the label to your box, and drop it off at USPS.`
      : `Whenever you're ready, simply pack your items securely and drop your package off at USPS.`
}

SHIPPING
Tracking number: ${trackingNumber}
Carrier: ${carrierUpper}

${
  isQrCode
    ? `NEXT STEPS
1. Pack and seal your box
2. Open your USPS QR code on your phone
3. Show the QR code at a participating USPS location
4. USPS can print the shipping label for you
5. Hand over your sealed package

`
    : labelAttachment
      ? `NEXT STEPS
1. Open the attached shipping label
2. Print the label
3. Pack your items securely
4. Attach the label to your box
5. Drop it off at ${carrierUpper}

`
      : ""
}CHANGED YOUR MIND?
That's okay too. Simply reply to this email and let us know.

ALREADY SHIPPED?
You can ignore this message. Sometimes USPS tracking takes a little time to update after a package is dropped off.

MY ORDERS
Need your shipping label or QR code again?
Access it here, along with tracking information:
https://www.sellbookmedia.com/my-orders

If you have any questions, simply reply to this email or contact us at support@sellbookmedia.com. We're happy to help.

Friendly reminder: If you're expecting emails from us, please also check your spam or junk folder. Messages from support@sellbookmedia.com may occasionally be filtered there by your email provider.

Thank you for using SellBook Media!

SellBook Media
Ref ${shortId}`;

  await gmailTransporter.sendMail({
    from: `"SellBook Media" <${process.env.GMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to: email,
    subject:
      "Reminder: USPS has not scanned your package yet",
    html: emailHtml,
    text: emailText,
    attachments: labelAttachment
      ? [labelAttachment]
      : [],
  });
}

async function sendTenDayReminder({
  email,
  sellerName,
  trackingNumber,
  carrier,
  shippingLabelUrl,
  listingId,
  shippingLabelPreference,
}: {
  email: string;
  sellerName: string;
  trackingNumber: string;
  carrier: string;
  shippingLabelUrl: string;
  listingId: string;
  shippingLabelPreference: "pdf" | "qr";
}) {
  const safeSellerName =
    escapeHtml(sellerName);

  const carrierUpper =
    carrier.toUpperCase();

  const shortId =
    getShortId(listingId);

  const isQrCode =
    shippingLabelPreference === "qr";

  const labelAttachment =
    await getShippingLabelAttachment(
      shippingLabelUrl,
      listingId,
      shippingLabelPreference
    );

  const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
  <meta name="color-scheme" content="light">
  <title>Final Shipping Reminder</title>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#f1f5f9;
  -webkit-font-smoothing:antialiased;
">

  <div style="
    display:none;
    max-height:0;
    overflow:hidden;
    opacity:0;
    color:transparent;
  ">
    A friendly final reminder about your SellBook Media shipment.
  </div>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="
      background-color:#f1f5f9;
      padding:16px 12px;
    "
  >
    <tr>
      <td align="center">

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:600px;
            background-color:#ffffff;
            border-radius:16px;
            overflow:hidden;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
          "
        >

          <!-- Header -->
          <tr>
            <td style="
              background-color:#f59e0b;
              padding:32px 24px;
              text-align:center;
            ">

              <div style="
                font-size:12px;
                font-weight:600;
                letter-spacing:1px;
                text-transform:uppercase;
                color:#fef3c7;
                margin-bottom:10px;
              ">
                SellBook Media
              </div>

              <div style="
                font-size:24px;
                font-weight:700;
                color:#ffffff;
                line-height:1.3;
              ">
                Final Shipping Reminder
              </div>

              <div style="
                font-size:17px;
                font-weight:700;
                color:#fef3c7;
                margin-top:8px;
              ">
                5 Days Remaining
              </div>

            </td>
          </tr>

          <!-- Main message -->
          <tr>
            <td style="
              padding:28px 24px 0 24px;
            ">

              <p style="
                margin:0;
                font-size:17px;
                line-height:1.6;
                color:#334155;
              ">
                Hi ${safeSellerName},
              </p>

              <p style="
                margin:14px 0 0 0;
                font-size:16px;
                line-height:1.6;
                color:#334155;
              ">
                Just a friendly final reminder about your SellBook Media shipment.
              </p>

              <p style="
                margin:14px 0 0 0;
                font-size:16px;
                line-height:1.6;
                color:#334155;
              ">
                It looks like USPS still hasn't scanned your package.
                You have <strong>5 days remaining</strong> to send it.
              </p>

              <p style="
                margin:14px 0 0 0;
                font-size:16px;
                line-height:1.6;
                color:#334155;
              ">
                ${
                  isQrCode
                    ? labelAttachment
                      ? `Your USPS QR code is attached to this email again for your convenience.
                         Pack and seal your box, open the QR code on your phone,
                         and show it at a participating USPS location.
                         USPS can print the shipping label for you.`
                      : `Use the USPS QR code from your original shipping email.
                         Pack and seal your box and show the QR code on your phone
                         at a participating USPS location within the next 5 days.`
                    : labelAttachment
                      ? `Your prepaid shipping label is attached to this email again for your convenience.
                         When you're ready, simply print the attached PDF,
                         pack your items securely, attach the label to your box,
                         and drop it off at USPS.`
                      : `When you're ready, simply pack your items securely
                         and drop your package off at USPS within the next 5 days.`
                }
              </p>

            </td>
          </tr>

          <!-- Important -->
          <tr>
            <td style="
              padding:18px 24px 0 24px;
            ">

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  background-color:#fffbeb;
                  border-radius:12px;
                  border:1px solid #fde68a;
                "
              >
                <tr>
                  <td style="padding:20px;">

                    <div style="
                      font-size:12px;
                      font-weight:700;
                      letter-spacing:1px;
                      text-transform:uppercase;
                      color:#92400e;
                      margin-bottom:10px;
                    ">
                      5 Days Remaining
                    </div>

                    <div style="
                      font-size:16px;
                      color:#78350f;
                      line-height:1.6;
                    ">
                      Your shipping window is still open.
                      Please send your package within the next
                      <strong>5 days</strong>.
                    </div>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          ${shippingInfoBlock(
            trackingNumber,
            carrierUpper
          )}

          ${attachmentBlock(
            Boolean(labelAttachment),
            isQrCode
          )}

          ${
            isQrCode || labelAttachment
              ? nextStepsBlock(
                  carrierUpper,
                  isQrCode
                )
              : ""
          }

          ${changedMindBlock()}

          ${alreadyShippedBlock()}

          <!-- My Orders alternative label access -->
          <tr>
            <td style="padding:16px 24px 0 24px;">
              <div style="padding:16px;background:#eef5fb;border:1px solid #d4e3f5;border-radius:8px;font-size:14px;line-height:1.6;color:#344054;">
                <strong>Need your shipping label or QR code again?</strong>
                <br>
                You can access your prepaid label or USPS QR code anytime in My Orders, along with tracking information.
                <br>
                <a href="https://www.sellbookmedia.com/my-orders" style="font-weight:800;color:#0b3b75;">
                  Open My Orders
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 0 24px;">
              <div style="
                padding:14px 16px;
                background-color:#f8fafc;
                border:1px solid #e2e8f0;
                border-radius:8px;
                font-size:13px;
                line-height:1.5;
                color:#64748b;
              ">
                If you have any questions, simply reply to this email or contact us at
                <strong>support@sellbookmedia.com</strong>. We're happy to help.
                <br><br>
                <strong>Friendly reminder:</strong> If you're expecting emails from us,
                please also check your spam or junk folder. Messages from
                <strong>support@sellbookmedia.com</strong> may occasionally be filtered there by your email provider.
                <br><br>
                Thank you for using SellBook Media!
              </div>
            </td>
          </tr>

          ${footerBlock(shortId)}

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

  const emailText = `Final Shipping Reminder

Hi ${sellerName},

Just a friendly final reminder about your SellBook Media shipment.

It looks like USPS still hasn't scanned your package. You have 5 days remaining to send it.

${
  isQrCode
    ? labelAttachment
      ? `Your USPS QR code is attached to this email again for your convenience.

Pack and seal your box, open the QR code on your phone, and show it at a participating USPS location. USPS can print the shipping label for you.`
      : `Use the USPS QR code from your original shipping email.

Pack and seal your box and show the QR code on your phone at a participating USPS location within the next 5 days.`
    : labelAttachment
      ? `Your prepaid shipping label is attached to this email again for your convenience.

When you're ready, simply print the attached PDF, pack your items securely, attach the label to your box, and drop it off at USPS.`
      : `When you're ready, simply pack your items securely and drop your package off at USPS within the next 5 days.`
}

5 DAYS REMAINING
Your shipping window is still open. Please send your package within the next 5 days.

SHIPPING
Tracking number: ${trackingNumber}
Carrier: ${carrierUpper}

${
  isQrCode
    ? `NEXT STEPS
1. Pack and seal your box
2. Open your USPS QR code on your phone
3. Show the QR code at a participating USPS location
4. USPS can print the shipping label for you
5. Hand over your sealed package

`
    : labelAttachment
      ? `NEXT STEPS
1. Open the attached shipping label
2. Print the label
3. Pack your items securely
4. Attach the label to your box
5. Drop it off at ${carrierUpper}

`
      : ""
}CHANGED YOUR MIND?
That's okay too. Simply reply to this email and let us know.

ALREADY SHIPPED?
You can ignore this message. Sometimes USPS tracking takes a little time to update after a package is dropped off.

MY ORDERS
Need your shipping label or QR code again?
Access it here, along with tracking information:
https://www.sellbookmedia.com/my-orders

If you have any questions, simply reply to this email or contact us at support@sellbookmedia.com. We're happy to help.

Friendly reminder: If you're expecting emails from us, please also check your spam or junk folder. Messages from support@sellbookmedia.com may occasionally be filtered there by your email provider.

Thank you for using SellBook Media!

SellBook Media
Ref ${shortId}`;

  await transporter.sendMail({
    from: `"SellBook Media" <${process.env.EMAIL_USER}>`,
    to: email,
    replyTo: process.env.EMAIL_USER,
    subject:
      "Final Shipping Reminder - 5 Days Remaining",
    html: emailHtml,
    text: emailText,
    attachments: labelAttachment
      ? [labelAttachment]
      : [],
  });
}

// PRE_TRANSIT = label created, carrier has not accepted/scanned package.
// UNKNOWN is not treated as proof that USPS has not received it.
function hasNotBeenAcceptedByCarrier(
  status: string
): boolean {
  return status === "PRE_TRANSIT";
}

function carrierHasAcceptedPackage(
  status: string
): boolean {
  return [
    "TRANSIT",
    "DELIVERED",
    "RETURNED",
  ].includes(status);
}

export async function GET(
  request: NextRequest
) {
  const authHeader =
    request.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !==
      `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const results = {
    checked5Day: 0,
    checked10Day: 0,
    reminder5Sent: 0,
    reminder10Sent: 0,
    carrierAccepted: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    const snapshot = await db
      .collection("listings")
      .where(
        "status",
        "==",
        "shipped_to_seller"
      )
      .get();

    const now = Date.now();

    for (const doc of snapshot.docs) {
      const listing =
        doc.data();

      const listingRef =
        doc.ref;

      const sentAtMs =
        getTimestampMs(
          listing.shippingLabelSentAt
        );

      // Eski listingler bu alana sahip olmadigi icin
      // otomatik reminder sistemine dahil edilmez.
      if (!sentAtMs) {
        results.skipped++;
        continue;
      }

      const ageDays =
        (now - sentAtMs) / DAY_MS;

      const trackingNumber =
        typeof listing.trackingNumber ===
        "string"
          ? listing.trackingNumber.trim()
          : "";

      const carrier =
        typeof listing.carrier === "string"
          ? listing.carrier
              .trim()
              .toLowerCase()
          : "usps";

      const shippingLabelUrl =
        typeof listing.shippingLabelUrl ===
        "string"
          ? listing.shippingLabelUrl.trim()
          : "";

      const shippingLabelPreference:
        "pdf" | "qr" =
          listing.shippingInfo
            ?.shippingLabelPreference === "qr"
            ? "qr"
            : "pdf";

      if (!trackingNumber) {
        results.skipped++;
        continue;
      }

      // Reminder metinleri USPS icin yazildi.
      // Baska carrier varsa yanlis email gondermeyelim.
      if (carrier !== "usps") {
        results.skipped++;
        continue;
      }

      try {
        // =================================================
        // 10 DAY CHECK
        // =================================================
        // 10 gun kontrolu once gelir.
        // Cron herhangi bir nedenle 5. gunu kacirdiysa
        // 10+ gunluk listing'e iki email birden gitmez.
        if (
          ageDays >= 10 &&
          listing.shippingCheck10Done !== true
        ) {
          const tracking =
            await getTrackingStatus(
              trackingNumber,
              carrier
            );

          const trackingStatus =
            String(
              tracking?.tracking_status
                ?.status || "UNKNOWN"
            ).toUpperCase();

          const statusDetails =
            String(
              tracking?.tracking_status
                ?.status_details || ""
            );

          results.checked10Day++;

          let reminderSent = false;

          if (
            hasNotBeenAcceptedByCarrier(
              trackingStatus
            )
          ) {
            const email =
              await getSellerEmail(
                listing
              );

            if (email) {
              await sendTenDayReminder({
                email,
                sellerName:
                  getSellerName(listing),
                trackingNumber,
                carrier,
                shippingLabelUrl,
                listingId: doc.id,
                shippingLabelPreference,
              });

              console.log(
                `10-day shipping reminder sent | Tracking: ${trackingNumber}`
              );

              reminderSent = true;
              results.reminder10Sent++;
            }
          }

          await listingRef.update({
            shippingCheck10Done: true,
            shippingCheck10At:
              FieldValue.serverTimestamp(),
            shippingCheck10Status:
              trackingStatus,
            shippingCheck10StatusDetails:
              statusDetails,
            shippingReminder10Sent:
              reminderSent,
            ...(reminderSent
              ? {
                  shippingReminder10SentAt:
                    FieldValue.serverTimestamp(),
                }
              : {}),
          });

          continue;
        }

        // =================================================
        // 5 DAY CHECK
        // =================================================
        if (
          ageDays >= 5 &&
          ageDays < 10 &&
          listing.shippingCheck5Done !== true
        ) {
          const tracking =
            await getTrackingStatus(
              trackingNumber,
              carrier
            );

          const trackingStatus =
            String(
              tracking?.tracking_status
                ?.status || "UNKNOWN"
            ).toUpperCase();

          const statusDetails =
            String(
              tracking?.tracking_status
                ?.status_details || ""
            );

          results.checked5Day++;

          let reminderSent = false;

          if (
            hasNotBeenAcceptedByCarrier(
              trackingStatus
            )
          ) {
            const email =
              await getSellerEmail(
                listing
              );

            if (email) {
              await sendFiveDayReminder({
                email,
                sellerName:
                  getSellerName(listing),
                trackingNumber,
                carrier,
                shippingLabelUrl,
                listingId: doc.id,
                shippingLabelPreference,
              });

              console.log(
                `5-day shipping reminder sent | Tracking: ${trackingNumber}`
              );

              reminderSent = true;
              results.reminder5Sent++;
            }
          }

          const updateData: Record<
            string,
            any
          > = {
            shippingCheck5Done: true,
            shippingCheck5At:
              FieldValue.serverTimestamp(),
            shippingCheck5Status:
              trackingStatus,
            shippingCheck5StatusDetails:
              statusDetails,
            shippingReminder5Sent:
              reminderSent,
          };

          if (reminderSent) {
            updateData.shippingReminder5SentAt =
              FieldValue.serverTimestamp();
          }

          // USPS 5. gun kontrolunde paketi zaten kabul ettiyse
          // 10. gun Shippo'ya tekrar sorgu yapma.
          if (
            carrierHasAcceptedPackage(
              trackingStatus
            )
          ) {
            updateData.shippingCarrierAccepted =
              true;

            updateData.shippingCarrierAcceptedAt =
              FieldValue.serverTimestamp();

            updateData.shippingCheck10Done =
              true;

            updateData.shippingCheck10SkippedReason =
              "Carrier already accepted package at 5-day check";

            results.carrierAccepted++;
          }

          await listingRef.update(
            updateData
          );
        }
      } catch (error) {
        results.errors++;

        console.error(
          `Shipping reminder check failed for listing ${doc.id}:`,
          error
        );

        // Hata halinde checkDone yazilmiyor.
        // Boylece sonraki cron calismasinda tekrar denenebilir.
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error(
      "Shipping reminder cron failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Shipping reminder cron failed",
      },
      {
        status: 500,
      }
    );
  }
}