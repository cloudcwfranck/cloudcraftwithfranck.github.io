'use client';

import { useEffect, useState } from 'react';
import { Flex, Heading, Text, Button, Tag } from '@/once-ui/components';
import SubmissionEditor from '@/components/academy/SubmissionEditor';
import SignIn from '@/components/auth/SignIn';
import styles from '@/styles/academy.module.scss';

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

export default function AssignmentPage({
    params,
}: {
    params: { locale: string; trackId: string; assignmentId: string };
}) {
    const [mounted, setMounted] = useState(false);
    const [track, setTrack] = useState<Track | null>(null);
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

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

        // Fetch track + assignment data and check auth session in parallel
        Promise.all([
            fetch(`${url}/rest/v1/tracks?id=eq.${params.trackId}&select=id,name,icon,accent`, { headers }),
            fetch(`${url}/rest/v1/assignments?id=eq.${params.assignmentId}&track_id=eq.${params.trackId}&select=*`, { headers }),
            fetch(`${url}/auth/v1/user`, {
                headers: { ...headers, 'Content-Type': 'application/json' },
                credentials: 'include',
            }),
        ])
            .then(async ([tr, ar, ur]) => {
                const tracks: Track[] = await tr.json();
                const assigns: Assignment[] = await ar.json();

                setTrack(tracks[0] ?? null);
                const a = assigns[0] ?? null;
                if (a) {
                    setAssignment({
                        ...a,
                        rubric: Array.isArray(a.rubric)
                            ? a.rubric
                            : JSON.parse((a.rubric as unknown as string) ?? '[]'),
                    });
                }

                if (ur.ok) {
                    const user = await ur.json();
                    setUserId(user?.id ?? null);
                }
            })
            .catch((e) => setError(String(e)))
            .finally(() => setLoading(false));
    }, [mounted, params.trackId, params.assignmentId]);

    if (!mounted) return null;

    if (loading) {
        return (
            <Flex fillWidth maxWidth="xl" direction="column" alignItems="center" paddingY="xl">
                <Text onBackground="neutral-weak">Loading assignment…</Text>
            </Flex>
        );
    }

    if (error) {
        return (
            <Flex fillWidth maxWidth="xl" direction="column" gap="16" paddingX="l" paddingY="xl">
                <Button variant="tertiary" size="s" label={`← Back`} href={`/academy/${params.trackId}`} />
                <Text style={{ color: '#ef4444' }}>{error}</Text>
            </Flex>
        );
    }

    if (!track || !assignment) {
        return (
            <Flex fillWidth maxWidth="xl" direction="column" gap="16" paddingX="l" paddingY="xl">
                <Button variant="tertiary" size="s" label={`← Back`} href={`/academy/${params.trackId}`} />
                <Text onBackground="neutral-weak">Assignment not found.</Text>
            </Flex>
        );
    }

    return (
        <Flex fillWidth maxWidth="xl" direction="column" gap="32" paddingX="l" paddingY="xl">
            <Flex gap="8" alignItems="center">
                <Button
                    variant="tertiary"
                    size="s"
                    label={`← ${track.name}`}
                    href={`/academy/${params.trackId}`}
                />
            </Flex>

            <Flex direction="column" gap="8">
                <Flex gap="12" alignItems="center" wrap>
                    <span style={{ fontSize: '1.5rem' }}>{track.icon}</span>
                    <Heading variant="display-strong-m">{assignment.title}</Heading>
                    <Flex gap="8" alignItems="center">
                        <Tag size="s">{assignment.level}</Tag>
                        <Text variant="label-default-s" style={{ color: track.accent }}>
                            {assignment.xp} XP
                        </Text>
                    </Flex>
                </Flex>
                <div style={{ height: '3px', borderRadius: '2px', background: track.accent, width: '100%', marginTop: '4px' }} />
            </Flex>

            <div className={styles.editorLayout}>
                {/* Left: brief + rubric */}
                <Flex direction="column" gap="24">
                    <Flex
                        direction="column"
                        gap="12"
                        padding="20"
                        background="surface"
                        border="neutral-medium"
                        borderStyle="solid-1"
                        radius="l"
                    >
                        <Heading as="h3" variant="heading-strong-s">Assignment Brief</Heading>
                        <Text variant="body-default-s" onBackground="neutral-weak">
                            {assignment.description}
                        </Text>
                    </Flex>

                    <Flex
                        direction="column"
                        gap="12"
                        padding="20"
                        background="surface"
                        border="neutral-medium"
                        borderStyle="solid-1"
                        radius="l"
                    >
                        <Heading as="h3" variant="heading-strong-s">Rubric Criteria</Heading>
                        <Flex direction="column" gap="8">
                            {assignment.rubric.map((criterion, i) => (
                                <Flex key={i} gap="8" alignItems="flex-start">
                                    <Text
                                        variant="label-default-s"
                                        style={{ color: track.accent, fontWeight: 700, flexShrink: 0 }}
                                    >
                                        {i + 1}.
                                    </Text>
                                    <Text variant="body-default-s">{criterion}</Text>
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                </Flex>

                {/* Right: submission editor or sign-in */}
                <Flex direction="column" gap="16">
                    {userId ? (
                        <SubmissionEditor
                            assignmentId={assignment.id}
                            trackName={track.name}
                            assignmentTitle={assignment.title}
                            rubric={assignment.rubric}
                            placeholder={assignment.placeholder}
                        />
                    ) : (
                        <SignIn redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/academy/${params.trackId}/${params.assignmentId}`} />
                    )}
                </Flex>
            </div>
        </Flex>
    );
}
