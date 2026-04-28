import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import ContactNotification from '../../../../emails/contact-notification';
import ContactReply from '../../../../emails/contact-reply';

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

const PROJECT_TYPES = ['consulting', 'speaking', 'partnership', 'other'] as const;
type ProjectType = typeof PROJECT_TYPES[number];

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

  const { name, email, subject, message, budget, projectType, website } = body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    budget?: string;
    projectType?: string;
    website?: string;
  };

  // Honeypot
  if (website) {
    return NextResponse.json({ success: true });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return NextResponse.json({ error: 'Name is required (2–100 chars)' }, { status: 400 });
  }
  if (!email || !emailRegex.test(email) || email.length > 320) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }
  if (!subject || typeof subject !== 'string' || subject.trim().length < 3 || subject.length > 200) {
    return NextResponse.json({ error: 'Subject is required (3–200 chars)' }, { status: 400 });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) {
    return NextResponse.json({ error: 'Message is required (10–5000 chars)' }, { status: 400 });
  }
  if (!projectType || !(PROJECT_TYPES as readonly string[]).includes(projectType)) {
    return NextResponse.json({ error: 'Valid project type is required' }, { status: 400 });
  }

  const ownerEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@cloudcraftwithfranck.org';
  const resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');

  try {
    await Promise.all([
      resend.emails.send({
        from: `CloudCraftWithFranck <${ownerEmail}>`,
        to: ownerEmail,
        subject: `[Contact] ${subject}`,
        react: ContactNotification({
          name: name.trim(),
          email,
          subject: subject.trim(),
          message: message.trim(),
          budget: budget?.trim(),
          projectType: projectType as ProjectType,
        }),
      }),
      resend.emails.send({
        from: `Franck Kengne <${ownerEmail}>`,
        to: email,
        subject: `Re: ${subject.trim()}`,
        react: ContactReply({ name: name.trim(), subject: subject.trim() }),
      }),
    ]);

    markSubmission(ip);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
