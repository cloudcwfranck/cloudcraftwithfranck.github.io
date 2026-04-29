import { Flex, Heading, Text, Button } from '@/once-ui/components';
import { createClient } from '@/lib/supabase/server';
import TrackCard from '@/components/academy/TrackCard';
import XPProgressBar from '@/components/academy/XPProgressBar';
import CertBadge from '@/components/academy/CertBadge';
import SignIn from '@/components/auth/SignIn';
import styles from '@/styles/academy.module.scss';

type Track = {
    id: string;
    name: string;
    icon: string;
    color: string;
    accent: string;
    description: string;
    order_index: number;
};

type Assignment = { track_id: string; xp: number };

export const metadata = {
    title: 'CloudCert Academy',
    description: 'AI-scored labs for Azure, FedRAMP, AKS, DevSecOps & SecOps',
};

export default async function AcademyPage() {
    const supabase = await createClient();

    const [{ data: tracks }, { data: assignments }] = await Promise.all([
        supabase.from('tracks').select('*').order('order_index'),
        supabase.from('assignments').select('track_id, xp'),
    ]);

    const { data: { user } } = await supabase.auth.getUser();

    let profile: { total_xp: number; cert_level: string | null } | null = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('total_xp, cert_level')
            .eq('id', user.id)
            .single();
        profile = data;

        if (!data) {
            await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name ?? null,
            });
        }
    }

    const trackList: Track[] = tracks ?? [];
    const assignmentList: Assignment[] = assignments ?? [];

    const tracksWithStats = trackList.map((t) => {
        const ta = assignmentList.filter((a) => a.track_id === t.id);
        return {
            ...t,
            assignmentCount: ta.length,
            maxXp: ta.reduce((sum, a) => sum + a.xp, 0),
        };
    });

    return (
        <Flex fillWidth maxWidth="l" direction="column" gap="48" paddingX="l" paddingY="xl">
            {/* Hero */}
            <Flex direction="column" gap="16" alignItems="center" style={{ textAlign: 'center' }}>
                <Heading variant="display-strong-xl">CloudCert Academy</Heading>
                <Text variant="display-default-s" onBackground="neutral-weak" style={{ maxWidth: '600px' }}>
                    AI-scored labs for Azure, FedRAMP, AKS, DevSecOps &amp; SecOps — evaluated against
                    NIST 800-53, CIS Benchmarks, and DoD STIGs.
                </Text>
            </Flex>

            {/* Auth / XP section */}
            {user && profile ? (
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
                        <Flex direction="column" gap="4">
                            <Text variant="heading-strong-s">Welcome back</Text>
                            <Text variant="body-default-s" onBackground="neutral-weak">{user.email}</Text>
                        </Flex>
                        {profile.cert_level && <CertBadge level={profile.cert_level} size="l" />}
                    </Flex>
                    <XPProgressBar totalXp={profile.total_xp} certLevel={profile.cert_level} />
                    <Button
                        variant="tertiary"
                        size="s"
                        label="View Certifications"
                        href="/academy/certifications"
                    />
                </Flex>
            ) : (
                <Flex justifyContent="center" fillWidth>
                    <Flex style={{ maxWidth: '420px', width: '100%' }}>
                        <SignIn />
                    </Flex>
                </Flex>
            )}

            {/* Tracks */}
            <Flex direction="column" gap="24" fillWidth>
                <Heading as="h2" variant="heading-strong-l">Learning Tracks</Heading>
                <div className={styles.trackGrid}>
                    {tracksWithStats.map((track) => (
                        <TrackCard key={track.id} track={track} />
                    ))}
                </div>
            </Flex>
        </Flex>
    );
}
