"use client";

import { useState } from 'react';
import { Flex, Text, Button } from '@/once-ui/components';
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

    if (sent) {
        return (
            <Flex
                direction="column"
                gap="8"
                padding="24"
                background="surface"
                border="neutral-medium"
                borderStyle="solid-1"
                radius="l"
                alignItems="center"
            >
                <Text variant="heading-strong-s">📬 Check your inbox</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">
                    We sent a magic link to <strong>{email}</strong>
                </Text>
            </Flex>
        );
    }

    return (
        <Flex
            as="form"
            direction="column"
            gap="12"
            padding="24"
            background="surface"
            border="neutral-medium"
            borderStyle="solid-1"
            radius="l"
            onSubmit={handleSignIn as any}
        >
            <Text variant="heading-strong-s">Sign in to CloudCert Academy</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
                Enter your email — we'll send you a magic link.
            </Text>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                    background: 'var(--neutral-background-strong)',
                    color: 'var(--neutral-on-background-strong)',
                    border: '1px solid var(--neutral-border-medium)',
                    borderRadius: 'var(--radius-m)',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    outline: 'none',
                    width: '100%',
                }}
            />
            {error && (
                <Text variant="label-default-s" style={{ color: '#ef4444' }}>{error}</Text>
            )}
            <Button
                type="submit"
                variant="primary"
                size="m"
                label={loading ? 'Sending…' : 'Send Magic Link'}
                disabled={loading}
            />
        </Flex>
    );
}
