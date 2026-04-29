"use client";

import styles from '@/styles/academy.module.scss';

type Props = {
    level: string;
    size?: 's' | 'm' | 'l';
};

const ICONS: Record<string, string> = {
    bronze:   '🥉',
    silver:   '🥈',
    gold:     '🥇',
    platinum: '💎',
};

export default function CertBadge({ level, size = 'm' }: Props) {
    const key = level.toLowerCase() as keyof typeof styles;
    const fontSize = size === 's' ? '0.7rem' : size === 'l' ? '0.9rem' : '0.8rem';

    return (
        <span
            className={`${styles.certBadge} ${styles[key] ?? ''}`}
            style={{ fontSize }}
        >
            <span>{ICONS[key] ?? '🏅'}</span>
            <span>{level}</span>
        </span>
    );
}
