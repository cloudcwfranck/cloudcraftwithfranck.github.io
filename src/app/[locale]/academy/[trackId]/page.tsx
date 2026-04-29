import { notFound } from 'next/navigation';
import { Flex, Heading, Text, Button } from '@/once-ui/components';
import { createClient } from '@/lib/supabase/server';
import AssignmentCard from '@/components/academy/AssignmentCard';

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

type Track = {
    id: string;
    name: string;
    icon: string;
    color: string;
    accent: string;
    description: string;
};

export default async function TrackPage({
    params,
}: {
    params: Promise<{ locale: string; trackId: string }>;
}) {
    const { trackId } = await params;
    const supabase = await createClient();

    const [{ data: track, error: trackError }, { data: assignments }] = await Promise.all([
        supabase.from('tracks').select('*').eq('id', trackId).single(),
        supabase.from('assignments').select('*').eq('track_id', trackId).order('order_index'),
    ]);

    if (trackError || !track) notFound();

    const { data: { user } } = await supabase.auth.getUser();

    let completedIds: Set<string> = new Set();
    let bestScores: Record<string, { score: number; grade: string }> = {};

    if (user) {
        const { data: subs } = await supabase
            .from('submissions')
            .select('assignment_id, score, grade')
            .eq('user_id', user.id)
            .in('assignment_id', (assignments ?? []).map((a: Assignment) => a.id));

        (subs ?? []).forEach((s: any) => {
            completedIds.add(s.assignment_id);
            if (!bestScores[s.assignment_id] || s.score > bestScores[s.assignment_id].score) {
                bestScores[s.assignment_id] = { score: s.score, grade: s.grade };
            }
        });
    }

    const t = track as Track;
    const assignmentList: Assignment[] = (assignments ?? []).map((a: Assignment) => ({
        ...a,
        rubric: Array.isArray(a.rubric) ? a.rubric : JSON.parse(a.rubric as unknown as string ?? '[]'),
        bestScore: bestScores[a.id]?.score,
        bestGrade: bestScores[a.id]?.grade,
    }));

    return (
        <Flex fillWidth maxWidth="l" direction="column" gap="40" paddingX="l" paddingY="xl">
            <Button
                variant="tertiary"
                size="s"
                label="← Back to Academy"
                href="/academy"
            />

            {/* Track header */}
            <Flex direction="column" gap="12">
                <Flex alignItems="center" gap="16">
                    <span style={{ fontSize: '2.5rem' }}>{t.icon}</span>
                    <Flex direction="column" gap="4">
                        <Heading variant="display-strong-m">{t.name}</Heading>
                        <Text variant="body-default-m" onBackground="neutral-weak">{t.description}</Text>
                    </Flex>
                </Flex>
                <div
                    style={{
                        height: '3px',
                        borderRadius: '2px',
                        background: t.accent,
                        width: '100%',
                        marginTop: '8px',
                    }}
                />
            </Flex>

            {/* Assignments */}
            <Flex direction="column" gap="16" fillWidth>
                <Heading as="h2" variant="heading-strong-m">Assignments</Heading>
                {assignmentList.length === 0 ? (
                    <Text onBackground="neutral-weak">No assignments available for this track yet.</Text>
                ) : (
                    assignmentList.map((assignment) => (
                        <AssignmentCard
                            key={assignment.id}
                            assignment={assignment}
                            completed={completedIds.has(assignment.id)}
                        />
                    ))
                )}
            </Flex>
        </Flex>
    );
}
