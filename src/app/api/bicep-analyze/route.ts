import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting: 10 requests per IP per hour
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

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

// Clean up old entries periodically
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  Array.from(rateLimitMap.keys()).forEach((key) => {
    const entry = rateLimitMap.get(key);
    if (entry && entry.windowStart < cutoff) rateLimitMap.delete(key);
  });
}, WINDOW_MS);

const SYSTEM_PROMPT = `You are an expert Azure cloud architect and FedRAMP compliance specialist with deep knowledge of:
- Bicep IaC syntax and ARM JSON structure
- NIST 800-53 Rev 5 controls and Azure implementation patterns
- FedRAMP Moderate and High baselines
- DoD IL4/IL5 requirements
- Azure security best practices (CIS, STIG)

When given Bicep code, you:
1. Convert it accurately to ARM JSON (deployments schema 2023-07-01 or latest appropriate)
2. Identify which NIST 800-53 Rev 5 controls the resources address
3. Identify which controls are missing or partially addressed
4. Provide specific, actionable remediation for each gap
5. Flag any Azure security misconfigurations

Always respond with valid JSON matching the exact schema provided. Never add markdown fences or explanation outside the JSON structure.`;

const USER_PROMPT_TEMPLATE = (bicepCode: string) => `
Analyze this Bicep code and return a JSON response matching this exact schema:

{
  "armJson": "string — the complete valid ARM JSON template as a string",
  "resourcesSummary": [
    {
      "resourceType": "string — e.g. Microsoft.KeyVault/vaults",
      "name": "string — the resource name expression",
      "apiVersion": "string"
    }
  ],
  "controlsCovered": [
    {
      "controlId": "string — e.g. SC-28",
      "controlName": "string — e.g. Protection of Information at Rest",
      "family": "string — e.g. System and Communications Protection",
      "coverage": "full | partial",
      "explanation": "string — specific explanation of how this Bicep resource addresses the control",
      "azureService": "string — the Azure service providing coverage"
    }
  ],
  "controlsPartial": [
    {
      "controlId": "string",
      "controlName": "string",
      "family": "string",
      "gap": "string — what specifically is missing or not configured",
      "remediation": "string — exact Bicep property or configuration needed",
      "bicepSnippet": "string — the specific Bicep code to add",
      "severity": "critical | high | medium | low"
    }
  ],
  "controlsMissing": [
    {
      "controlId": "string",
      "controlName": "string",
      "family": "string",
      "reason": "string — why this control is relevant to these resource types",
      "remediation": "string — what Azure resource or config would address it",
      "bicepSnippet": "string — example Bicep code to address the gap",
      "severity": "critical | high | medium | low"
    }
  ],
  "securityFindings": [
    {
      "finding": "string — specific misconfiguration or risk",
      "severity": "critical | high | medium | low",
      "affectedResource": "string",
      "fix": "string — exact remediation",
      "bicepSnippet": "string — corrected Bicep snippet"
    }
  ],
  "overallScore": {
    "score": 0,
    "fedrampReadiness": "not-ready | partial | moderate-ready | high-ready",
    "il4Ready": false,
    "summary": "string — 2 sentence executive summary of compliance posture"
  }
}

Bicep code to analyze:
\`\`\`bicep
${bicepCode}
\`\`\`

Return only the JSON. No markdown. No explanation outside the JSON.`;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    const resetMinutes = Math.ceil(rateLimit.resetInMs / 60000);
    return NextResponse.json(
      {
        error: `Rate limit exceeded. Try again in ${resetMinutes} minute${resetMinutes !== 1 ? 's' : ''}.`,
        resetInMs: rateLimit.resetInMs,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + rateLimit.resetInMs),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { bicepCode } = body;

    if (!bicepCode || typeof bicepCode !== 'string') {
      return NextResponse.json({ error: 'bicepCode is required' }, { status: 400 });
    }

    if (bicepCode.trim().length === 0) {
      return NextResponse.json({ error: 'bicepCode cannot be empty' }, { status: 400 });
    }

    if (bicepCode.length > 10000) {
      return NextResponse.json({ error: 'Bicep code too long (max 10,000 characters)' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: USER_PROMPT_TEMPLATE(bicepCode) }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Strip any accidental markdown fences
    const cleanJson = responseText
      .replace(/^```json\s*/m, '')
      .replace(/^```\s*/m, '')
      .replace(/```\s*$/m, '')
      .trim();

    const analysis = JSON.parse(cleanJson);

    return NextResponse.json(analysis, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error('Bicep analysis error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'AI service rate limit reached. Please try again shortly.' }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: 'AI service error. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
