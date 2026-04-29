import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CERT_LEVELS = [
    { level: 'platinum', threshold: 1500 },
    { level: 'gold', threshold: 900 },
    { level: 'silver', threshold: 450 },
    { level: 'bronze', threshold: 150 },
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { assignmentId, trackName, assignmentTitle, rubric, submission } = body as {
            assignmentId: string;
            trackName: string;
            assignmentTitle: string;
            rubric: string[];
            submission: string;
        };

        if (!assignmentId || !submission || !rubric?.length) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const rubricList = rubric.map((r, i) => `${i + 1}. ${r}`).join('\n');

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            system: `You are CloudCert — an elite cloud infrastructure & DevSecOps assessment engine.
You score submissions against NIST 800-53, FedRAMP Moderate/High, CIS Benchmarks, DoD IL4/IL5 STIGs,
Chainguard/Iron Bank hardening standards, AKS secure baseline, Azure Landing Zone CAF, GitOps, and supply chain security.
Evaluate against these rubric criteria:
${rubricList}
Return ONLY valid JSON, no markdown, no preamble:
{
  "overallScore": number (0-100),
  "grade": string (A+|A|B+|B|C|D|F),
  "rubricScores": [{ "criterion": string, "score": number, "note": string (max 15 words) }],
  "strengths": string[],
  "gaps": string[],
  "securityFindings": string[],
  "recommendation": string (2 sentences),
  "certReady": boolean
}`,
            messages: [
                {
                    role: 'user',
                    content: `Track: ${trackName}\nAssignment: ${assignmentTitle}\n\nSubmission:\n${submission}`,
                },
            ],
        });

        const raw = message.content[0].type === 'text' ? message.content[0].text : '';
        const result = JSON.parse(raw);

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const xpEarned = result.certReady ? Math.round(result.overallScore * 5) : Math.round(result.overallScore * 2);

            const { error: subError } = await supabase.from('submissions').insert({
                user_id: user.id,
                assignment_id: assignmentId,
                content: submission,
                score: result.overallScore,
                grade: result.grade,
                rubric_scores: result.rubricScores,
                strengths: result.strengths,
                gaps: result.gaps,
                security_findings: result.securityFindings,
                recommendation: result.recommendation,
                cert_ready: result.certReady,
                xp_earned: xpEarned,
            });

            if (!subError) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('total_xp')
                    .eq('id', user.id)
                    .single();

                const newXp = (profile?.total_xp ?? 0) + xpEarned;
                const certLevel = CERT_LEVELS.find((l) => newXp >= l.threshold)?.level ?? null;

                await supabase
                    .from('profiles')
                    .upsert({ id: user.id, total_xp: newXp, cert_level: certLevel });
            }

            return NextResponse.json({ ...result, xpEarned });
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error('Score API error:', err);
        return NextResponse.json({ error: 'Scoring failed' }, { status: 500 });
    }
}
