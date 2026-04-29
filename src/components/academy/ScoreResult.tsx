'use client';

type RubricScore = {
    criterion: string;
    score: number;
    note: string;
};

type ScoreData = {
    overallScore: number;
    grade: string;
    rubricScores: RubricScore[];
    strengths: string[];
    gaps: string[];
    securityFindings: string[];
    recommendation: string;
    certReady: boolean;
    xpEarned?: number;
};

type Props = { data: ScoreData };

const CIRCUMFERENCE = 2 * Math.PI * 70;

function scoreColor(score: number) {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#eab308';
    return '#ef4444';
}

function gradeColor(grade: string) {
    if (grade.startsWith('A')) return '#22c55e';
    if (grade.startsWith('B')) return '#3b82f6';
    if (grade.startsWith('C')) return '#eab308';
    if (grade.startsWith('D')) return '#f97316';
    return '#ef4444';
}

export default function ScoreResult({ data }: Props) {
    const dashOffset = CIRCUMFERENCE - (data.overallScore / 100) * CIRCUMFERENCE;
    const color = scoreColor(data.overallScore);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
            {/* Header row */}
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Gauge */}
                <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
                    <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                            cx="80" cy="80" r="70"
                            fill="none"
                            stroke="var(--neutral-border-medium, #333)"
                            strokeWidth="10"
                        />
                        <circle
                            cx="80" cy="80" r="70"
                            fill="none"
                            stroke={color}
                            strokeWidth="10"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: '2rem', fontWeight: 700, color }}>{data.overallScore}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--neutral-on-background-weak, #888)' }}>/ 100</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '44px', height: '44px',
                            borderRadius: '8px',
                            background: gradeColor(data.grade),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.25rem', fontWeight: 700, color: '#fff',
                        }}>
                            {data.grade}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Score Result</h3>
                    </div>
                    {data.xpEarned !== undefined && (
                        <span style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600 }}>
                            +{data.xpEarned} XP earned
                        </span>
                    )}
                    {data.certReady && (
                        <div style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: 'rgba(234, 179, 8, 0.15)',
                            color: '#eab308',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                        }}>
                            🏆 Certification Ready!
                        </div>
                    )}
                </div>
            </div>

            {/* Rubric breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Rubric Breakdown
                </h4>
                {data.rubricScores.map((r, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.875rem' }}>{r.criterion}</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--neutral-on-background-weak, #888)' }}>{r.score}/100</span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--neutral-border-medium, #333)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${r.score}%`, background: scoreColor(r.score), borderRadius: '3px', transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--neutral-on-background-weak, #888)' }}>{r.note}</span>
                    </div>
                ))}
            </div>

            {/* Strengths */}
            {data.strengths.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strengths</h4>
                    {data.strengths.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                            <span style={{ fontSize: '0.875rem' }}>{s}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Gaps */}
            {data.gaps.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gaps</h4>
                    {data.gaps.map((g, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ color: '#f97316', flexShrink: 0 }}>△</span>
                            <span style={{ fontSize: '0.875rem' }}>{g}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Security findings */}
            {data.securityFindings.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Findings</h4>
                    {data.securityFindings.map((f, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ color: '#ef4444', flexShrink: 0 }}>⚠</span>
                            <span style={{ fontSize: '0.875rem' }}>{f}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Recommendation */}
            <div style={{
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid var(--neutral-border-medium, #333)',
                background: 'var(--neutral-background-strong, #1a1a1a)',
                display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommendation</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--neutral-on-background-weak, #888)' }}>
                    {data.recommendation}
                </p>
            </div>
        </div>
    );
}
