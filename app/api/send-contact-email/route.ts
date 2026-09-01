// app/api/send-contact-email/route.ts
// Contact Us formundan gelen mesajlari support emailine iletir.

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const name = String(data?.name || '').trim().substring(0, 100);
    const email = String(data?.email || '').trim().substring(0, 254);
    const subject = String(data?.subject || '')
      .replace(/[\r\n]+/g, ' ')
      .trim()
      .substring(0, 200);
    const message = String(data?.message || '').trim().substring(0, 1000);

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address'
        },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Contact email configuration is missing');
      return NextResponse.json(
        {
          success: false,
          error: 'Email configuration error'
        },
        { status: 500 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const dateStr = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York'
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

    console.log(`Contact email sent from ${email}`);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Contact email error:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  }
}