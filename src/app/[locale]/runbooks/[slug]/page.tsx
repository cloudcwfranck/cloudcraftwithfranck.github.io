import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';
import { getPosts } from '@/app/utils/utils';
import { Button, Flex, Heading, Text } from '@/once-ui/components';
import { unstable_setRequestLocale } from 'next-intl/server';

interface RunbookParams {
  params: { slug: string; locale: string };
}

export function generateStaticParams(): { slug: string; locale: string }[] {
  let runbooks: ReturnType<typeof getPosts> = [];
  try {
    runbooks = getPosts(['src', 'content', 'runbooks']);
  } catch {
    return [];
  }
  return runbooks.map((r) => ({ slug: r.slug, locale: 'en' }));
}

export function generateMetadata({ params: { slug } }: RunbookParams) {
  let runbooks: ReturnType<typeof getPosts> = [];
  try {
    runbooks = getPosts(['src', 'content', 'runbooks']);
  } catch {
    return { title: 'Runbook Not Found' };
  }

  const post = runbooks.find((r) => r.slug === slug);
  if (!post) return { title: 'Runbook Not Found' };

  const { title, summary: description } = post.metadata;
  const ogImage = `https://www.cloudcraftwithfranck.org/og?title=${encodeURIComponent(title)}`;
  const tags = (post.metadata as any).tags as string[] | undefined;

  return {
    title,
    description,
    keywords: tags ?? [],
    authors: [{ name: 'Franck Kengne' }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://www.cloudcraftwithfranck.org/runbooks/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: `https://www.cloudcraftwithfranck.org/runbooks/${slug}` },
  };
}

export default function RunbookPage({ params }: RunbookParams) {
  unstable_setRequestLocale(params.locale);

  let runbooks: ReturnType<typeof getPosts> = [];
  try {
    runbooks = getPosts(['src', 'content', 'runbooks']);
  } catch {
    notFound();
  }

  const post = runbooks.find((r) => r.slug === params.slug);
  if (!post) notFound();

  const difficulty = (post.metadata as any).difficulty as string | undefined;
  const estimatedTime = (post.metadata as any).estimatedTime as string | undefined;
  const tags = (post.metadata as any).tags as string[] | undefined;

  return (
    <Flex as="section" fillWidth maxWidth="m" direction="column" alignItems="center" gap="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            description: post.metadata.summary,
            keywords: tags ? tags.join(', ') : '',
            url: `https://www.cloudcraftwithfranck.org/runbooks/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Franck Kengne',
              jobTitle: 'Principal Cloud & DevSecOps Architect',
              url: 'https://www.cloudcraftwithfranck.org',
            },
          }),
        }}
      />
      <Flex fillWidth maxWidth="xs" gap="16" direction="column">
        <Button href={`/${params.locale}/runbooks`} variant="tertiary" size="s" prefixIcon="chevronLeft">
          Runbooks
        </Button>
        <Flex gap="s" alignItems="center" wrap>
          {difficulty && (
            <Text variant="label-default-xs" style={{ textTransform: 'capitalize', opacity: 0.7 }}>
              {difficulty}
            </Text>
          )}
          {estimatedTime && (
            <Text variant="label-default-xs" onBackground="neutral-weak">
              {estimatedTime}
            </Text>
          )}
        </Flex>
        <Heading variant="display-strong-s">{post.metadata.title}</Heading>
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
      <Flex style={{ margin: 'auto' }} as="article" maxWidth="xs" fillWidth direction="column">
        <CustomMDX source={post.content} />
      </Flex>
    </Flex>
  );
}
