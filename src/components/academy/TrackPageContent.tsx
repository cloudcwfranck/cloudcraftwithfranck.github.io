'use client';

import { useEffect, useState } from 'react';

type Track = {
    id: string;
    name: string;
    icon: string;
    color: string;
    accent: string;
    description: string;
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
    order_index: number;
};

type Props = { trackId: string };

export default function TrackPageContent({ trackId }: Props) {
    const [track, setTrack] = useState<Track | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
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
            fetch(`${url}/rest/v1/tracks?id=eq.${trackId}&select=*`, { headers }),
            fetch(`${url}/rest/v1/assignments?track_id=eq.${trackId}&select=*&order=order_index`, { headers }),
        ])
            .then(async ([tr, ar]) => {
                const tracks: Track[] = await tr.json();
                const assigns: Assignment[] = await ar.json();
                setTrack(tracks[0] ?? null);
                setAssignments(assigns ?? []);
                setLoading(false);
            })
            .catch((e) => {
                setError(String(e));
                setLoading(false);
            });
    }, [trackId]);

    const containerStyle: React.CSSProperties = {
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <p style={{ color: 'var(--neutral-on-background-weak, #888)', margin: 0 }}>Loading track…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <a href="/academy" style={{ color: 'var(--neutral-on-background-weak, #888)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    ← Back to Academy
                </a>
                <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>
            </div>
        );
    }

    if (!track) {
        return (
            <div style={containerStyle}>
                <a href="/academy" style={{ color: 'var(--neutral-on-background-weak, #888)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    ← Back to Academy
                </a>
                <p style={{ color: 'var(--neutral-on-background-weak, #888)', margin: 0 }}>Track not found: {trackId}</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <a
                href="/academy"
                style={{ color: 'var(--neutral-on-background-weak, #888)', textDecoration: 'none', fontSize: '0.875rem' }}
            >
                ← Back to Academy
            </a>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '2.5rem' }}>{track.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>{track.name}</h1>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--neutral-on-background-weak, #888)' }}>
                            {track.description}
                        </p>
                    </div>
                </div>
                <div style={{ height: '3px', borderRadius: '2px', background: track.accent, width: '100%', marginTop: '8px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Assignments</h2>
                {assignments.length === 0 ? (
                    <p style={{ color: 'var(--neutral-on-background-weak, #888)', margin: 0 }}>
                        No assignments available for this track yet.
                    </p>
                ) : (
                    assignments.map((assignment) => (
                        <a
                            key={assignment.id}
                            href={`/academy/${trackId}/${assignment.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div
                                style={{
                                    padding: '20px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--neutral-border-medium, #333)',
                                    background: 'var(--neutral-background-strong, #1a1a1a)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = track.accent;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--neutral-border-medium, #333)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{assignment.title}</h3>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: 'var(--neutral-background-medium, #222)',
                                                color: 'var(--neutral-on-background-weak, #888)',
                                            }}
                                        >
                                            {assignment.level}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: track.accent }}>
                                            {assignment.xp} XP
                                        </span>
                                    </div>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--neutral-on-background-weak, #888)' }}>
                                    {assignment.description}
                                </p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span
                                        style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            background: 'var(--neutral-background-medium, #222)',
                                            color: 'var(--neutral-on-background-weak, #888)',
                                        }}
                                    >
                                        {assignment.type}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            background: 'var(--neutral-background-medium, #222)',
                                            color: 'var(--neutral-on-background-weak, #888)',
                                        }}
                                    >
                                        {assignment.lang}
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
