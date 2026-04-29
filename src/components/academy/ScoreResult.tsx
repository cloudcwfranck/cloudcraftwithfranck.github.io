"use client";

import { Flex, Text, Heading } from '@/once-ui/components';
import styles from '@/styles/academy.module.scss';

type RubricScore = {
    criterion: string;
    score: number;
    note: string;
};

type ScoreData = {
    overallScore: number;
    grade: string;
    rubricScores: RubricScore[];
    strengths: string[];
    gaps: string[];
    securityFindings: string[];
    recommendation: string;
    certReady: boolean;
    xpEarned?: number;
};

type Props = { data: ScoreData };

const CIRCUMFERENCE = 2 * Math.PI * 70;

function gradeClass(grade: string) {
    if (grade.startsWith('A')) return styles.gradeA;
    if (grade.startsWith('B')) return styles.gradeB;
    if (grade.startsWith('C')) return styles.gradeC;
    if (grade.startsWith('D')) return styles.gradeD;
    return styles.gradeF;
}

function scoreColor(score: number) {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#eab308';
    return '#ef4444';
}

export default function ScoreResult({ data }: Props) {
    const dashOffset = CIRCUMFERENCE - (data.overallScore / 100) * CIRCUMFERENCE;
    const color = scoreColor(data.overallScore);

    return (
        <Flex direction="column" gap="32" fillWidth>
            {/* Header row */}
            <Flex gap="24" alignItems="center" wrap>
                {/* Gauge */}
                <div className={styles.gaugeWrap}>
                    <svg className={styles.gaugeSvg} width="160" height="160" viewBox="0 0 160 160">
                        <circle className={styles.gaugeTrack} cx="80" cy="80" r="70" strokeWidth="10" />
                        <circle
                            className={styles.gaugeArc}
                            cx="80" cy="80" r="70"
                            strokeWidth="10"
                            stroke={color}
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={dashOffset}
                        />
                    </svg>
                    <div className={styles.gaugeLabel}>
                        <Text variant="display-strong-m" style={{ color }}>
                            {data.overallScore}
                        </Text>
                        <Text variant="label-default-xs" onBackground="neutral-weak">/ 100</Text>
                    </div>
                </div>

                <Flex direction="column" gap="12">
                    <Flex alignItems="center" gap="12">
                        <div className={`${styles.grade} ${gradeClass(data.grade)}`}>
                            {data.grade}
                        </div>
                        <Heading variant="heading-strong-m">Score Result</Heading>
                    </Flex>
                    {data.xpEarned !== undefined && (
                        <Text variant="label-default-s" onBackground="accent-weak">
                            +{data.xpEarned} XP earned
                        </Text>
                    )}
                    {data.certReady && (
                        <div className={styles.certReadyBanner}>
                            🏆 Certification Ready!
                        </div>
                    )}
                </Flex>
            </Flex>

            {/* Rubric breakdown */}
            <Flex direction="column" gap="12" fillWidth>
                <Heading as="h4" variant="heading-strong-xs">Rubric Breakdown</Heading>
                <div className={styles.rubricBars}>
                    {data.rubricScores.map((r, i) => (
                        <div key={i} className={styles.rubricBarRow}>
                            <Flex justifyContent="space-between">
                                <Text variant="label-default-s">{r.criterion}</Text>
                                <Text variant="label-default-s" onBackground="neutral-weak">{r.score}/100</Text>
                            </Flex>
                            <div className={styles.rubricBarOuter}>
                                <div className={styles.rubricBarInner} style={{ width: `${r.score}%` }} />
                            </div>
                            <Text variant="label-default-xs" onBackground="neutral-weak">{r.note}</Text>
                        </div>
                    ))}
                </div>
            </Flex>

            {/* Strengths */}
            {data.strengths.length > 0 && (
                <Flex direction="column" gap="8" fillWidth>
                    <Heading as="h4" variant="heading-strong-xs">Strengths</Heading>
                    {data.strengths.map((s, i) => (
                        <Flex key={i} gap="8" alignItems="flex-start">
                            <Text style={{ color: '#22c55e' }}>✓</Text>
                            <Text variant="body-default-s">{s}</Text>
                        </Flex>
                    ))}
                </Flex>
            )}

            {/* Gaps */}
            {data.gaps.length > 0 && (
                <Flex direction="column" gap="8" fillWidth>
                    <Heading as="h4" variant="heading-strong-xs">Gaps</Heading>
                    {data.gaps.map((g, i) => (
                        <Flex key={i} gap="8" alignItems="flex-start">
                            <Text style={{ color: '#f97316' }}>△</Text>
                            <Text variant="body-default-s">{g}</Text>
                        </Flex>
                    ))}
                </Flex>
            )}

            {/* Security findings */}
            {data.securityFindings.length > 0 && (
                <Flex direction="column" gap="8" fillWidth>
                    <Heading as="h4" variant="heading-strong-xs">Security Findings</Heading>
                    {data.securityFindings.map((f, i) => (
                        <Flex key={i} gap="8" alignItems="flex-start">
                            <Text style={{ color: '#ef4444' }}>⚠</Text>
                            <Text variant="body-default-s">{f}</Text>
                        </Flex>
                    ))}
                </Flex>
            )}

            {/* Recommendation */}
            <Flex
                direction="column"
                gap="8"
                padding="16"
                background="surface"
                border="neutral-medium"
                borderStyle="solid-1"
                radius="m"
                fillWidth
            >
                <Heading as="h4" variant="heading-strong-xs">Recommendation</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">
                    {data.recommendation}
                </Text>
            </Flex>
        </Flex>
    );
}
