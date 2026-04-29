import { notFound } from 'next/navigation';
import { Flex, Heading, Text, Button, Tag } from '@/once-ui/components';
import { createClient } from '@/lib/supabase/server';
import SubmissionEditor from '@/components/academy/SubmissionEditor';
import SignIn from '@/components/auth/SignIn';
import styles from '@/styles/academy.module.scss';

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

type Track = {
    id: string;
    name: string;
    icon: string;
    accent: string;
};

export default async function AssignmentPage({
    params,
}: {
    params: Promise<{ locale: string; trackId: string; assignmentId: string }>;
}) {
    const { locale, trackId, assignmentId } = await params;
    const supabase = await createClient();

    const [{ data: track, error: trackError }, { data: assignment, error: assignError }] =
        await Promise.all([
            supabase.from('tracks').select('id, name, icon, accent').eq('id', trackId).single(),
            supabase.from('assignments').select('*').eq('id', assignmentId).eq('track_id', trackId).single(),
        ]);

    if (trackError || !track || assignError || !assignment) notFound();

    const t = track as Track;
    const a = assignment as Assignment;
    const rubric: string[] = Array.isArray(a.rubric)
        ? a.rubric
        : JSON.parse(a.rubric as unknown as string ?? '[]');

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <Flex fillWidth maxWidth="xl" direction="column" gap="32" paddingX="l" paddingY="xl">
            <Flex gap="8" alignItems="center">
                <Button
                    variant="tertiary"
                    size="s"
                    label={`← ${t.name}`}
                    href={`/${locale}/academy/${trackId}`}
                />
            </Flex>

            <Flex direction="column" gap="8">
                <Flex gap="12" alignItems="center" wrap>
                    <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                    <Heading variant="display-strong-m">{a.title}</Heading>
                    <Flex gap="8" alignItems="center">
                        <Tag size="s">{a.level}</Tag>
                        <Text variant="label-default-s" style={{ color: t.accent }}>
                            {a.xp} XP
                        </Text>
                    </Flex>
                </Flex>
                <div style={{ height: '3px', borderRadius: '2px', background: t.accent, width: '100%', marginTop: '4px' }} />
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
                            {a.description}
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
                            {rubric.map((criterion, i) => (
                                <Flex key={i} gap="8" alignItems="flex-start">
                                    <Text
                                        variant="label-default-s"
                                        style={{ color: t.accent, fontWeight: 700, flexShrink: 0 }}
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
                    {user ? (
                        <SubmissionEditor
                            assignmentId={a.id}
                            trackName={t.name}
                            assignmentTitle={a.title}
                            rubric={rubric}
                            placeholder={a.placeholder}
                        />
                    ) : (
                        <SignIn redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/${locale}/academy/${trackId}/${assignmentId}`} />
                    )}
                </Flex>
            </div>
        </Flex>
    );
}
