import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeEmail from '../../../../emails/welcome';

const rateLimitMap = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const last = rateLimitMap.get(ip);
  if (!last) return false;
  return Date.now() - last < 60 * 60 * 1000;
}

function markSubmission(ip: string): void {
  rateLimitMap.set(ip, Date.now());
  if (rateLimitMap.size > 1000) {
    const cutoff = Date.now() - 60 * 60 * 1000;
    Array.from(rateLimitMap.keys()).forEach((key) => {
      if ((rateLimitMap.get(key) ?? 0) < cutoff) rateLimitMap.delete(key);
    });
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, website } = body as { email?: string; website?: string };

  // Honeypot
  if (website) {
    return NextResponse.json({ success: true });
  }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 320) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@cloudcraftwithfranck.org';
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');

  try {
    if (audienceId) {
      await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
    }

    await resend.emails.send({
      from: `Franck Kengne <${fromEmail}>`,
      to: email,
      subject: 'Welcome to CloudCraftWithFranck',
      react: WelcomeEmail({ firstName: email.split('@')[0] }),
    });

    markSubmission(ip);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
}
