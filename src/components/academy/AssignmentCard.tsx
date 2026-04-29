"use client";

import { Flex, Text, Heading, Button, Tag } from '@/once-ui/components';

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
    bestScore?: number;
    bestGrade?: string;
};

type Props = {
    assignment: Assignment;
    completed?: boolean;
};

export default function AssignmentCard({ assignment, completed }: Props) {
    return (
        <Flex
            direction="column"
            gap="16"
            padding="24"
            background="surface"
            border="neutral-medium"
            borderStyle="solid-1"
            radius="l"
            fillWidth
        >
            <Flex justifyContent="space-between" alignItems="flex-start" gap="12">
                <Heading as="h3" variant="heading-strong-s">
                    {assignment.title}
                </Heading>
                <Flex gap="8" alignItems="center" style={{ flexShrink: 0 }}>
                    <Tag size="s">{assignment.level}</Tag>
                    <Text variant="label-default-s" onBackground="accent-weak">
                        {assignment.xp} XP
                    </Text>
                </Flex>
            </Flex>

            <Text variant="body-default-s" onBackground="neutral-weak">
                {assignment.description}
            </Text>

            <Flex gap="8" wrap>
                {assignment.rubric.slice(0, 3).map((criterion, i) => (
                    <Tag key={i} size="s" variant="neutral">
                        {criterion.length > 30 ? criterion.slice(0, 30) + '…' : criterion}
                    </Tag>
                ))}
                {assignment.rubric.length > 3 && (
                    <Tag size="s" variant="neutral">+{assignment.rubric.length - 3} more</Tag>
                )}
            </Flex>

            <Flex justifyContent="space-between" alignItems="center">
                {completed && assignment.bestGrade && (
                    <Text variant="label-default-s" onBackground="neutral-weak">
                        Best: {assignment.bestGrade} ({assignment.bestScore}/100)
                    </Text>
                )}
                <Button
                    variant={completed ? 'tertiary' : 'primary'}
                    size="s"
                    label={completed ? 'Resubmit' : 'Start Assignment'}
                    href={`/academy/${assignment.track_id}/${assignment.id}`}
                />
            </Flex>
        </Flex>
    );
}
