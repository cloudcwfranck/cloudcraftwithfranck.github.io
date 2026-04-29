import { redirect } from 'next/navigation';
import { Flex, Heading, Text, Button } from '@/once-ui/components';
import { createClient } from '@/lib/supabase/server';
import CertBadge from '@/components/academy/CertBadge';
import XPProgressBar from '@/components/academy/XPProgressBar';
import styles from '@/styles/academy.module.scss';

type Certification = {
    id: string;
    level: string;
    cert_number: string;
    issued_at: string;
};

const LEVEL_ORDER = ['bronze', 'silver', 'gold', 'platinum'];

export const metadata = {
    title: 'My Certifications — CloudCert Academy',
};

export default async function CertificationsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/academy`);

    const [{ data: profile }, { data: certs }] = await Promise.all([
        supabase.from('profiles').select('total_xp, cert_level, full_name, email').eq('id', user.id).single(),
        supabase.from('certifications').select('*').eq('user_id', user.id).order('issued_at', { ascending: false }),
    ]);

    const totalXp: number = profile?.total_xp ?? 0;
    const certLevel: string | null = profile?.cert_level ?? null;
    const certList: Certification[] = certs ?? [];

    const THRESHOLDS = [
        { level: 'bronze',   xp: 150  },
        { level: 'silver',   xp: 450  },
        { level: 'gold',     xp: 900  },
        { level: 'platinum', xp: 1500 },
    ];

    return (
        <Flex fillWidth maxWidth="l" direction="column" gap="40" paddingX="l" paddingY="xl">
            <Button variant="tertiary" size="s" label="← Back to Academy" href={`/${locale}/academy`} />

            <Flex direction="column" gap="8">
                <Heading variant="display-strong-l">My Certifications</Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                    {profile?.full_name ?? profile?.email ?? user.email}
                </Text>
            </Flex>

            {/* XP progress */}
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
                <Flex justifyContent="space-between" alignItems="center" wrap gap="12">
                    <Heading as="h3" variant="heading-strong-s">XP Progress</Heading>
                    {certLevel && <CertBadge level={certLevel} size="l" />}
                </Flex>
                <XPProgressBar totalXp={totalXp} certLevel={certLevel} />

                {/* Level milestone grid */}
                <Flex gap="12" wrap>
                    {THRESHOLDS.map(({ level, xp }) => (
                        <Flex
                            key={level}
                            direction="column"
                            gap="4"
                            alignItems="center"
                            padding="12"
                            background="surface"
                            border="neutral-medium"
                            borderStyle="solid-1"
                            radius="m"
                            style={{ opacity: totalXp >= xp ? 1 : 0.4, minWidth: '90px' }}
                        >
                            <CertBadge level={level} size="s" />
                            <Text variant="label-default-xs" onBackground="neutral-weak">{xp} XP</Text>
                        </Flex>
                    ))}
                </Flex>
            </Flex>

            {/* Cert cards */}
            <Flex direction="column" gap="16" fillWidth>
                <Heading as="h2" variant="heading-strong-m">Earned Certificates</Heading>

                {certList.length === 0 ? (
                    <Flex
                        direction="column"
                        gap="12"
                        padding="32"
                        background="surface"
                        border="neutral-medium"
                        borderStyle="solid-1"
                        radius="l"
                        alignItems="center"
                    >
                        <Text variant="heading-strong-s">No certifications yet</Text>
                        <Text variant="body-default-s" onBackground="neutral-weak">
                            Complete assignments to earn XP and unlock Bronze (150 XP), Silver (450 XP),
                            Gold (900 XP), and Platinum (1500 XP) certifications.
                        </Text>
                        <Button variant="primary" size="s" label="Start learning" href={`/${locale}/academy`} />
                    </Flex>
                ) : (
                    certList.map((cert) => (
                        <div key={cert.id} className={styles.certCard}>
                            <Flex justifyContent="space-between" alignItems="flex-start" wrap gap="16">
                                <Flex direction="column" gap="8">
                                    <Flex alignItems="center" gap="12">
                                        <CertBadge level={cert.level} size="l" />
                                        <Heading as="h3" variant="heading-strong-m">
                                            CloudCert {cert.level.charAt(0).toUpperCase() + cert.level.slice(1)}
                                        </Heading>
                                    </Flex>
                                    <Text variant="body-default-s" onBackground="neutral-weak">
                                        Awarded to: <strong>{profile?.full_name ?? profile?.email ?? user.email}</strong>
                                    </Text>
                                    <Text variant="label-default-s" onBackground="neutral-weak">
                                        Certificate #{cert.cert_number}
                                    </Text>
                                    <Text variant="label-default-xs" onBackground="neutral-weak">
                                        Issued {new Date(cert.issued_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                        })}
                                    </Text>
                                </Flex>
                                <Button
                                    variant="secondary"
                                    size="s"
                                    label="Print Certificate"
                                    onClick={() => window.print()}
                                />
                            </Flex>
                        </div>
                    ))
                )}
            </Flex>
        </Flex>
    );
}
