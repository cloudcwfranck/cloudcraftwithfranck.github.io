'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Flex, Heading, Text, Button } from '@/once-ui/components';
import AssignmentCard from '@/components/academy/AssignmentCard';

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
    rubric: string[];
    placeholder: string;
    order_index: number;
};

export default function TrackPage({
    params,
}: {
    params: { locale: string; trackId: string };
}) {
    // Destructure to primitives so useEffect deps are always stable strings
    const { trackId } = params;

    const [mounted, setMounted] = useState(false);
    const [track, setTrack] = useState<Track | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mount guard — runs once, prevents any SSR output
    useEffect(() => {
        setMounted(true);
    }, []);

    // Data fetch — only after mount, keyed to the stable trackId string
    useEffect(() => {
        if (!mounted) return;

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
                // Batch both state updates together (React 18 auto-batches in async)
                setTrack(tracks[0] ?? null);
                setAssignments(
                    (assigns ?? []).map((a) => ({
                        ...a,
                        rubric: Array.isArray(a.rubric)
                            ? a.rubric
                            : JSON.parse((a.rubric as unknown as string) ?? '[]'),
                    })),
                );
                setLoading(false);
            })
            .catch((e) => {
                setError(String(e));
                setLoading(false);
            });
    }, [mounted, trackId]); // stable primitive — no object reference churn

    // No SSR output — avoids hydration mismatch
    if (!mounted) return null;

    if (loading) {
        return (
            <Flex fillWidth maxWidth="l" direction="column" gap="16" paddingX="l" paddingY="xl" alignItems="center">
                <Text onBackground="neutral-weak">Loading track…</Text>
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex fillWidth maxWidth="l" direction="column" gap="16" paddingX="l" paddingY="xl">
                <Button variant="tertiary" size="s" label="← Back to Academy" href="/academy" />
                <Text style={{ color: '#ef4444' }}>{error}</Text>
            </Flex>
        );
    }

    if (!track) {
        return (
            <Flex fillWidth maxWidth="l" direction="column" gap="16" paddingX="l" paddingY="xl">
                <Button variant="tertiary" size="s" label="← Back to Academy" href="/academy" />
                <Text onBackground="neutral-weak">Track not found: {trackId}</Text>
            </Flex>
        );
    }

    return (
        <Flex fillWidth maxWidth="l" direction="column" gap="40" paddingX="l" paddingY="xl">
            <Button variant="tertiary" size="s" label="← Back to Academy" href="/academy" />

            <Flex direction="column" gap="12">
                <Flex alignItems="center" gap="16">
                    <span style={{ fontSize: '2.5rem' }}>{track.icon}</span>
                    <Flex direction="column" gap="4">
                        <Heading variant="display-strong-m">{track.name}</Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">{track.description}</Text>
                    </Flex>
                </Flex>
                <div style={{ height: '3px', borderRadius: '2px', background: track.accent, width: '100%', marginTop: '8px' }} />
            </Flex>

            <Flex direction="column" gap="16" fillWidth>
                <Heading as="h2" variant="heading-strong-m">Assignments</Heading>
                {assignments.length === 0 ? (
                    <Text onBackground="neutral-weak">No assignments available for this track yet.</Text>
                ) : (
                    assignments.map((assignment) => (
                        <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))
                )}
            </Flex>
        </Flex>
    );
}
