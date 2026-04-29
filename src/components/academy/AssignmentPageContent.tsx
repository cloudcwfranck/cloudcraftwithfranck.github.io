'use client';

import { useEffect, useState } from 'react';
import SubmissionEditor from './SubmissionEditor';
import SignIn from '@/components/auth/SignIn';

type Track = {
    id: string;
    name: string;
    icon: string;
    accent: string;
};

type Assignment = {
    id: string;
    track_id: string;
    title: string;
    level: string;
    xp: number;
    type: string;
    lang: string;
    description: string;
    rubric: string[];
    placeholder: string;
};

type Props = { trackId: string; assignmentId: string };

export default function AssignmentPageContent({ trackId, assignmentId }: Props) {
    const [track, setTrack] = useState<Track | null>(null);
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            setError('Supabase environment variables are not configured.');
            setLoading(false);
            return;
        }

        const headers = { apikey: key, Authorization: `Bearer ${key}` };

        Promise.all([
            fetch(`${url}/rest/v1/tracks?id=eq.${trackId}&select=id,name,icon,accent`, { headers }),
            fetch(`${url}/rest/v1/assignments?id=eq.${assignmentId}&track_id=eq.${trackId}&select=*`, { headers }),
            fetch(`${url}/auth/v1/user`, {
                headers: { ...headers, 'Content-Type': 'application/json' },
                credentials: 'include',
            }),
        ])
            .then(async ([tr, ar, ur]) => {
                const tracks: Track[] = await tr.json();
                const assigns: Assignment[] = await ar.json();
                const a = assigns[0] ?? null;

                setTrack(tracks[0] ?? null);
                setAssignment(
                    a
                        ? {
                              ...a,
                              rubric: Array.isArray(a.rubric)
                                  ? a.rubric
                                  : JSON.parse((a.rubric as unknown as string) ?? '[]'),
                          }
                        : null,
                );

                if (ur.ok) {
                    const user = await ur.json();
                    setUserId(user?.id ?? null);
                }

                setLoading(false);
            })
            .catch((e) => {
                setError(String(e));
                setLoading(false);
            });
    }, [trackId, assignmentId]);

    const containerStyle: React.CSSProperties = {
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <p style={{ color: 'var(--neutral-on-background-weak, #888)', margin: 0 }}>Loading assignment…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <a href={`/academy/${trackId}`} style={{ color: 'var(--neutral-on-background-weak, #888)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    ← Back
                </a>
                <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>
            </div>
        );
    }

    if (!track || !assignment) {
        return (
            <div style={containerStyle}>
                <a href={`/academy/${trackId}`} style={{ color: 'var(--neutral-on-background-weak, #888)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    ← Back
                </a>
                <p style={{ color: 'var(--neutral-on-background-weak, #888)', margin: 0 }}>Assignment not found.</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <a
                href={`/academy/${trackId}`}
                style={{ color: 'var(--neutral-on-background-weak, #888)', textDecoration: 'none', fontSize: '0.875rem' }}
            >
                ← {track.name}
            </a>

            {/* Title bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.5rem' }}>{track.icon}</span>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{assignment.title}</h1>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'var(--neutral-background-medium, #222)',
                            color: 'var(--neutral-on-background-weak, #888)',
                        }}>
                            {assignment.level}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: track.accent }}>
                            {assignment.xp} XP
                        </span>
                    </div>
                </div>
                <div style={{ height: '3px', borderRadius: '2px', background: track.accent, width: '100%', marginTop: '4px' }} />
            </div>

            {/* Two-column layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
                alignItems: 'start',
            }}>
                {/* Left: brief + rubric */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid var(--neutral-border-medium, #333)',
                        background: 'var(--neutral-background-strong, #1a1a1a)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Assignment Brief
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--neutral-on-background-weak, #aaa)', lineHeight: 1.6 }}>
                            {assignment.description}
                        </p>
                    </div>

                    <div style={{
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid var(--neutral-border-medium, #333)',
                        background: 'var(--neutral-background-strong, #1a1a1a)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Rubric Criteria
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {assignment.rubric.map((criterion, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <span style={{ color: track.accent, fontWeight: 700, flexShrink: 0, fontSize: '0.875rem' }}>
                                        {i + 1}.
                                    </span>
                                    <span style={{ fontSize: '0.875rem' }}>{criterion}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: editor / sign-in */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {userId ? (
                        <SubmissionEditor
                            assignmentId={assignment.id}
                            trackName={track.name}
                            assignmentTitle={assignment.title}
                            rubric={assignment.rubric}
                            placeholder={assignment.placeholder}
                        />
                    ) : (
                        <SignIn
                            redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/academy/${trackId}/${assignmentId}`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
