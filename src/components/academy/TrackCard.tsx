"use client";

import { useRouter } from 'next/navigation';
import { Flex, Text, Heading, Button } from '@/once-ui/components';
import styles from '@/styles/academy.module.scss';

type Track = {
    id: string;
    name: string;
    icon: string;
    color: string;
    accent: string;
    description: string;
    assignmentCount?: number;
    maxXp?: number;
};

type Props = {
    track: Track;
    locale: string;
};

export default function TrackCard({ track, locale }: Props) {
    const router = useRouter();

    return (
        <div
            className={styles.trackCard}
            onClick={() => router.push(`/${locale}/academy/${track.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`/${locale}/academy/${track.id}`)}
        >
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
                <div className={styles.trackColorBar} style={{ background: track.accent }} />
                <Flex alignItems="center" gap="12">
                    <span className={styles.trackIcon}>{track.icon}</span>
                    <Heading as="h3" variant="heading-strong-s">
                        {track.name}
                    </Heading>
                </Flex>
                <Text variant="body-default-s" onBackground="neutral-weak">
                    {track.description}
                </Text>
                <Flex justifyContent="space-between" alignItems="center">
                    {track.assignmentCount != null && (
                        <Text variant="label-default-s" onBackground="neutral-weak">
                            {track.assignmentCount} assignment{track.assignmentCount !== 1 ? 's' : ''}
                        </Text>
                    )}
                    {track.maxXp != null && (
                        <Text variant="label-default-s" style={{ color: track.accent }}>
                            Up to {track.maxXp} XP
                        </Text>
                    )}
                </Flex>
                <Button
                    variant="secondary"
                    size="s"
                    label="Start Track"
                    href={`/${locale}/academy/${track.id}`}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
            </Flex>
        </div>
    );
}
