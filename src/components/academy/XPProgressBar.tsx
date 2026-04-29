"use client";

import { Flex, Text } from '@/once-ui/components';
import styles from '@/styles/academy.module.scss';

type Props = {
    totalXp: number;
    certLevel: string | null;
};

const LEVELS = [
    { label: 'Bronze',   threshold: 150,  next: 450  },
    { label: 'Silver',   threshold: 450,  next: 900  },
    { label: 'Gold',     threshold: 900,  next: 1500 },
    { label: 'Platinum', threshold: 1500, next: 1500 },
];

export default function XPProgressBar({ totalXp, certLevel }: Props) {
    const current = LEVELS.find((l) => totalXp >= l.threshold) ?? { label: 'Unranked', threshold: 0, next: 150 };
    const nextLevel = LEVELS.find((l) => l.threshold > totalXp);
    const pct = nextLevel
        ? Math.min(100, Math.round(((totalXp - current.threshold) / (nextLevel.threshold - current.threshold)) * 100))
        : 100;

    return (
        <Flex direction="column" gap="8" fillWidth>
            <Flex justifyContent="space-between" fillWidth>
                <Text variant="label-default-s" onBackground="neutral-weak">
                    {totalXp} XP — {current.label}
                </Text>
                {nextLevel && (
                    <Text variant="label-default-s" onBackground="neutral-weak">
                        {nextLevel.threshold - totalXp} XP to {nextLevel.label}
                    </Text>
                )}
            </Flex>
            <div className={styles.xpBarOuter}>
                <div className={styles.xpBarInner} style={{ width: `${pct}%` }} />
            </div>
        </Flex>
    );
}
