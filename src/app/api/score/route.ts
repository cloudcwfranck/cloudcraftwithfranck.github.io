import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetInMs: WINDOW_MS };
  }
  if (entry.count >= RATE_LIMIT) {
    const resetInMs = WINDOW_MS - (now - entry.windowStart);
    return { allowed: false, remaining: 0, resetInMs };
  }
  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetInMs: WINDOW_MS - (now - entry.windowStart) };
}

setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  Array.from(rateLimitMap.keys()).forEach((key) => {
    const entry = rateLimitMap.get(key);
    if (entry && entry.windowStart < cutoff) rateLimitMap.delete(key);
  });
}, WINDOW_MS);

const SYSTEM_PROMPT = `You are an expert cloud security instructor and senior architect specializing in Azure, FedRAMP/NIST 800-53, AKS/EKS, DevSecOps CI/CD, and SecOps/SIEM. You score student lab submissions against professional rubrics used in DoD and federal cloud programs.

Score each rubric criterion on a 0-100 scale based on technical correctness, completeness, and security posture. Be rigorous but fair. A score ≥85 overall means the student is ready for a certification-level challenge.

Always respond with valid JSON matching the exact schema provided. Never add markdown fences or explanation outside the JSON.`;

const USER_PROMPT_TEMPLATE = (
  trackName: string,
  assignmentTitle: string,
  rubric: string[],
  submission: string,
) => `Score this student submission for the academy assignment below.

Track: ${trackName}
Assignment: ${assignmentTitle}

Rubric criteria (score each 0-100):
${rubric.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Student submission:
\`\`\`
${submission}
\`\`\`

Return a JSON object matching this exact schema:
{
  "overallScore": <number 0-100, weighted average of rubric scores>,
  "grade": <"A+" | "A" | "B" | "C" | "D" | "F">,
  "certReady": <boolean, true if overallScore >= 85>,
  "recommendation": <string, 1-2 sentence coaching note>,
  "rubricScores": [
    {
      "criterion": <string, criterion text>,
      "score": <number 0-100>,
      "note": <string, specific feedback, max 20 words>
    }
  ],
  "strengths": [<string>, ...],
  "gaps": [<string>, ...],
  "securityFindings": [<string>, ...]
}

Return only the JSON. No markdown. No explanation outside the JSON.`;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    const resetMinutes = Math.ceil(rateLimit.resetInMs / 60000);
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${resetMinutes} minute${resetMinutes !== 1 ? 's' : ''}.` },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const { trackName, assignmentTitle, rubric, submission } = body;

    if (!submission || typeof submission !== 'string' || !submission.trim()) {
      return NextResponse.json({ error: 'submission is required' }, { status: 400 });
    }
    if (!Array.isArray(rubric) || rubric.length === 0) {
      return NextResponse.json({ error: 'rubric is required' }, { status: 400 });
    }
    if (submission.length > 20000) {
      return NextResponse.json({ error: 'Submission too long (max 20,000 characters)' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: USER_PROMPT_TEMPLATE(trackName, assignmentTitle, rubric, submission),
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleanJson = responseText
      .replace(/^```json\s*/m, '')
      .replace(/^```\s*/m, '')
      .replace(/```\s*$/m, '')
      .trim();

    const result = JSON.parse(cleanJson);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Scoring error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'AI service rate limit reached. Please try again shortly.' }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Scoring failed. Please try again.' }, { status: 500 });
  }
}
