import { NextRequest, NextResponse } from 'next/server';

interface ResendWebhookEvent {
  type: string;
  data: {
    email_id?: string;
    to?: string[];
    subject?: string;
  };
}

export async function POST(request: NextRequest) {
  let event: ResendWebhookEvent;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { type, data } = event;

  switch (type) {
    case 'email.delivered':
      console.log(`[Resend] Delivered: ${data.email_id} to ${data.to?.[0]}`);
      break;
    case 'email.bounced':
      console.warn(`[Resend] Bounced: ${data.email_id} to ${data.to?.[0]}`);
      break;
    case 'email.complained':
      console.warn(`[Resend] Spam complaint: ${data.email_id} from ${data.to?.[0]}`);
      break;
    default:
      console.log(`[Resend] Unhandled event: ${type}`);
  }

  return NextResponse.json({ received: true });
}
