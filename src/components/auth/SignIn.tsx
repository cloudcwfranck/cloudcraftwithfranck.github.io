'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
    redirectTo?: string;
};

export default function SignIn({ redirectTo }: Props) {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setError('');
        const supabase = createClient();
        const { error: err } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectTo ?? (typeof window !== 'undefined' ? window.location.href : undefined),
            },
        });
        setLoading(false);
        if (err) {
            setError(err.message);
        } else {
            setSent(true);
        }
    }

    const cardStyle: React.CSSProperties = {
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid var(--neutral-border-medium, #333)',
        background: 'var(--neutral-background-strong, #1a1a1a)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    };

    if (sent) {
        return (
            <div style={{ ...cardStyle, alignItems: 'center', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>📬 Check your inbox</p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--neutral-on-background-weak, #888)' }}>
                    We sent a magic link to <strong>{email}</strong>
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSignIn} style={cardStyle}>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Sign in to CloudCert Academy</p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--neutral-on-background-weak, #888)' }}>
                Enter your email — we'll send you a magic link.
            </p>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                    background: 'var(--neutral-background-medium, #111)',
                    color: 'var(--neutral-on-background-strong, #f0f0f0)',
                    border: '1px solid var(--neutral-border-medium, #333)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            />
            {error && (
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#ef4444' }}>{error}</p>
            )}
            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: loading ? 'var(--neutral-border-medium, #444)' : 'var(--brand-background-strong, #3b82f6)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? 'Sending…' : 'Send Magic Link'}
            </button>
        </form>
    );
}
