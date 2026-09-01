// app/api/send-contact-email/route.ts
// Contact Us formundan gelen mesajlari support emailine iletir.

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createHmac } from 'crypto';
import { db } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_REQUEST_BYTES = 10_000;

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ''
    )
    .trim()
    .substring(0, maxLength);
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');

  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

function getRateLimitId(ip: string): string {
  const secret =
    process.env.RATE_LIMIT_SECRET ||
    process.env.EMAIL_PASS ||
    'sellbookmedia-contact-rate-limit';

  return createHmac('sha256', secret)
    .update(ip)
    .digest('hex');
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const rateLimitId = getRateLimitId(ip);

  const rateLimitRef = db
    .collection('contact_rate_limits')
    .doc(rateLimitId);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(rateLimitRef);

    const now = Date.now();

    if (!snapshot.exists) {
      transaction.set(rateLimitRef, {
        count: 1,
        windowStartedAt: new Date(now),
        lastAttemptAt: new Date(now)
      });

      return true;
    }

    const data = snapshot.data();

    const windowStartedAt =
      data?.windowStartedAt &&
      typeof data.windowStartedAt.toDate === 'function'
        ? data.windowStartedAt.toDate()
        : null;

    if (
      !windowStartedAt ||
      now - windowStartedAt.getTime() >= RATE_LIMIT_WINDOW_MS
    ) {
      transaction.set(rateLimitRef, {
        count: 1,
        windowStartedAt: new Date(now),
        lastAttemptAt: new Date(now)
      });

      return true;
    }

    const currentCount =
      typeof data?.count === 'number'
        ? data.count
        : 0;

    if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    transaction.update(rateLimitRef, {
      count: currentCount + 1,
      lastAttemptAt: new Date(now)
    });

    return true;
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType =
      request.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request'
        },
        { status: 415 }
      );
    }

    const contentLengthHeader =
      request.headers.get('content-length');

    if (contentLengthHeader) {
      const contentLength =
        Number(contentLengthHeader);

      if (
        Number.isFinite(contentLength) &&
        contentLength > MAX_REQUEST_BYTES
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Request too large'
          },
          { status: 413 }
        );
      }
    }

    const clientIp = getClientIp(request);

    const allowed = await checkRateLimit(clientIp);

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Too many messages. Please wait a few minutes and try again.'
        },
        {
          status: 429,
          headers: {
            'Retry-After': '600'
          }
        }
      );
    }

    const rawBody = await request.text();

    if (
      Buffer.byteLength(rawBody, 'utf8') >
      MAX_REQUEST_BYTES
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Request too large'
        },
        { status: 413 }
      );
    }

    let data: unknown;

    try {
      data = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request'
        },
        { status: 400 }
      );
    }

    if (
      !data ||
      typeof data !== 'object' ||
      Array.isArray(data)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request'
        },
        { status: 400 }
      );
    }

    const body = data as Record<string, unknown>;

    const name = cleanText(body.name, 100);

    const email = cleanText(
      body.email,
      254
    ).toLowerCase();

    const subject = cleanText(body.subject, 200)
      .replace(/[\r\n]+/g, ' ')
      .trim();

    const message = cleanText(
      body.message,
      1000
    );

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address'
        },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Message must be at least 10 characters long'
        },
        { status: 400 }
      );
    }

    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS
    ) {
      console.error(
        'Contact email configuration is missing'
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to send message'
        },
        { status: 500 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);

    const safeMessage = escapeHtml(message)
      .replace(/\n/g, '<br>');

    const dateStr = new Date().toLocaleString(
      'en-US',
      {
        timeZone: 'America/New_York'
      }
    );

    await db.collection('contact_messages').add({
      name,
      email,
      subject,
      message,
      status: 'unread',
      createdAt: new Date(),
      userAgent: cleanText(
        request.headers.get('user-agent'),
        500
      ),
      replied: false,
      source: 'contact_page'
    });

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; padding:20px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:14px; overflow:hidden; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

          <tr>
            <td style="padding:24px 24px 10px 24px;">
              <div style="font-size:20px; font-weight:700; color:#0f172a;">
                ${safeSubject}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:10px 24px 20px 24px;">
              <div style="font-size:15px; color:#475569; line-height:1.6;">
                <strong>${safeName}</strong><br>
                <a href="mailto:${safeEmail}" style="color:#2563eb; text-decoration:none;">
                  ${safeEmail}
                </a>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 24px 24px 24px;">
              <div style="font-size:16px; line-height:1.7; color:#1e293b; white-space:normal;">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px 22px 24px; border-top:1px solid #e2e8f0;">
              <div style="font-size:12px; color:#94a3b8;">
                Sent via SellBookMedia Contact Form
                <br>
                ${dateStr} EST
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailText = `${subject}

${name}
${email}

${message}

------------------------------
Sent via SellBookMedia Contact Form
${dateStr} EST`;

    await transporter.sendMail({
      from: `"SellBookMedia Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject,
      html: emailHtml,
      text: emailText
    });

    console.log('Contact email sent successfully');

    return NextResponse.json({
      success: true
    });

  } catch (error: unknown) {
    console.error(
      'Contact email error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          'Unable to send your message. Please try again later.'
      },
      { status: 500 }
    );
  }
}