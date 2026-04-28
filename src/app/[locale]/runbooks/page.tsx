import { Flex, Heading, Text, SmartLink } from '@/once-ui/components';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getPosts } from '@/app/utils/utils';

export function generateMetadata() {
  const title = 'Runbooks — GovCloud Automation Scripts';
  const description = 'Production-ready automation runbooks for FedRAMP compliance, Azure GovCloud deployments, AKS hardening, Platform One onboarding, and DoD IL4/IL5 cloud operations.';
  const ogImage = `https://www.cloudcraftwithfranck.org/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    keywords: ['FedRAMP runbook', 'Azure GovCloud automation', 'AKS hardening', 'DoD IL4', 'NIST 800-53 compliance', 'Platform One', 'DevSecOps automation'],
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://www.cloudcraftwithfranck.org/runbooks',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: 'https://www.cloudcraftwithfranck.org/runbooks' },
  };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'var(--success-on-background-weak)',
  intermediate: 'var(--warning-on-background-weak)',
  advanced: 'var(--danger-on-background-weak)',
};

export default function RunbooksPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  let runbooks: ReturnType<typeof getPosts> = [];
  try {
    runbooks = getPosts(['src', 'content', 'runbooks']);
  } catch {
    runbooks = [];
  }

  return (
    <Flex fillWidth maxWidth="m" direction="column" gap="xl" paddingY="xl">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            headline: 'Runbooks — GovCloud Automation Scripts',
            description: 'Production-ready automation runbooks for FedRAMP, Azure GovCloud, and DoD cloud operations.',
            url: 'https://www.cloudcraftwithfranck.org/runbooks',
            author: {
              '@type': 'Person',
              name: 'Franck Kengne',
              jobTitle: 'Principal Cloud & DevSecOps Architect',
              url: 'https://www.cloudcraftwithfranck.org',
            },
          }),
        }}
      />
      <Flex direction="column" gap="s">
        <Heading variant="display-strong-m">Runbooks</Heading>
        <Text onBackground="neutral-weak" variant="body-default-l">
          Production-ready automation scripts for FedRAMP compliance, Azure GovCloud deployments, and DoD cloud operations. Each runbook is battle-tested and includes estimated completion time.
        </Text>
      </Flex>

      {runbooks.length === 0 ? (
        <Text onBackground="neutral-weak">No runbooks published yet. Check back soon.</Text>
      ) : (
        <Flex direction="column" gap="m">
          {runbooks.map((runbook) => {
            const difficulty = (runbook.metadata as any).difficulty as string | undefined;
            const estimatedTime = (runbook.metadata as any).estimatedTime as string | undefined;
            const tags = (runbook.metadata as any).tags as string[] | undefined;

            return (
              <SmartLink key={runbook.slug} href={`/${locale}/runbooks/${runbook.slug}`} style={{ textDecoration: 'none' }}>
                <Flex
                  direction="column"
                  gap="s"
                  padding="l"
                  background="surface"
                  radius="l"
                  border="neutral-medium"
                  borderStyle="solid-1"
                >
                  <Flex gap="s" alignItems="center" wrap>
                    {difficulty && (
                      <Text
                        variant="label-default-xs"
                        style={{
                          color: DIFFICULTY_COLORS[difficulty] ?? 'var(--neutral-on-background-weak)',
                          textTransform: 'capitalize',
                        }}
                      >
                        {difficulty}
                      </Text>
                    )}
                    {estimatedTime && (
                      <Text variant="label-default-xs" onBackground="neutral-weak">
                        {estimatedTime}
                      </Text>
                    )}
                  </Flex>
                  <Heading variant="display-strong-xs">{runbook.metadata.title}</Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {runbook.metadata.summary}
                  </Text>
                  {tags && tags.length > 0 && (
                    <Flex gap="4" wrap>
                      {tags.map((tag) => (
                        <Text
                          key={tag}
                          variant="label-default-xs"
                          style={{
                            background: 'var(--neutral-background-strong)',
                            color: 'var(--neutral-on-background-weak)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {tag}
                        </Text>
                      ))}
                    </Flex>
                  )}
                </Flex>
              </SmartLink>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}
