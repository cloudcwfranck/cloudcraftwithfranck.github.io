import { Flex, Heading, Text } from '@/once-ui/components';
import { getPosts } from '@/app/utils/utils';
import { baseURL } from '@/app/resources';
import Anthropic from '@anthropic-ai/sdk';

async function getPostHogTopPages(): Promise<{ url: string; count: number }[]> {
  const key = process.env.POSTHOG_KEY;
  if (!key) return [];
  try {
    const projectId = process.env.POSTHOG_PROJECT_ID;
    if (!projectId) return [];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const res = await fetch(
      `https://us.i.posthog.com/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=${sevenDaysAgo}`,
      { headers: { Authorization: `Bearer ${key}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results: { url: string; count: number }[] = (data.result ?? [])
      .slice(0, 5)
      .map((r: { breakdown_value?: string; count?: number }) => ({
        url: r.breakdown_value ?? 'unknown',
        count: r.count ?? 0,
      }));
    return results;
  } catch {
    return [];
  }
}

async function getResendSubscriberCount(): Promise<number | null> {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId) return null;
  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.length ?? null;
  } catch {
    return null;
  }
}

async function getAIInsight(topPages: { url: string; count: number }[], subscriberCount: number | null): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return 'Set ANTHROPIC_API_KEY to enable AI insights.';
  try {
    const client = new Anthropic({ apiKey });
    const context = [
      `Top pages this week: ${topPages.map((p) => `${p.url} (${p.count} views)`).join(', ') || 'no data'}`,
      subscriberCount !== null ? `Newsletter subscribers: ${subscriberCount}` : '',
    ].filter(Boolean).join('\n');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `You are Franck Kengne's site analytics advisor. Based on the following data, give 3 specific content opportunities for next week. Be concise and actionable.\n\n${context}`,
      }],
    });
    return message.content[0].type === 'text' ? message.content[0].text : 'No insight available.';
  } catch {
    return 'AI insight unavailable.';
  }
}

export default async function DashboardPage() {
  const [topPages, subscriberCount, recentPosts] = await Promise.all([
    getPostHogTopPages(),
    getResendSubscriberCount(),
    Promise.resolve(getPosts(['src', 'app', '[locale]', 'blog', 'posts', 'en']).slice(0, 5)),
  ]);

  const aiInsight = await getAIInsight(topPages, subscriberCount);

  return (
    <Flex maxWidth="m" fillWidth direction="column" gap="xl" paddingY="xl">
      <Heading variant="display-strong-m">Intelligence Dashboard</Heading>

      <Flex direction="column" gap="m">
        <Heading as="h2" variant="display-strong-xs">Newsletter</Heading>
        <Flex background="surface" radius="l" padding="l" border="neutral-medium" borderStyle="solid-1">
          <Text variant="display-default-m">
            {subscriberCount !== null ? `${subscriberCount} subscribers` : 'Data unavailable — set RESEND_API_KEY + RESEND_AUDIENCE_ID'}
          </Text>
        </Flex>
      </Flex>

      <Flex direction="column" gap="m">
        <Heading as="h2" variant="display-strong-xs">Top Pages This Week</Heading>
        <Flex direction="column" gap="8">
          {topPages.length > 0 ? topPages.map((page, i) => (
            <Flex key={i} background="surface" radius="m" padding="m" border="neutral-medium" borderStyle="solid-1" justifyContent="space-between" alignItems="center">
              <Text variant="body-default-s" onBackground="neutral-weak" style={{ wordBreak: 'break-all' }}>{page.url}</Text>
              <Text variant="body-strong-s">{page.count} views</Text>
            </Flex>
          )) : (
            <Text onBackground="neutral-weak">No PostHog data — set POSTHOG_KEY + POSTHOG_PROJECT_ID</Text>
          )}
        </Flex>
      </Flex>

      <Flex direction="column" gap="m">
        <Heading as="h2" variant="display-strong-xs">AI Weekly Insight</Heading>
        <Flex background="surface" radius="l" padding="l" border="brand-medium" borderStyle="solid-1">
          <Text variant="body-default-m" style={{ whiteSpace: 'pre-wrap' }}>{aiInsight}</Text>
        </Flex>
      </Flex>

      <Flex direction="column" gap="m">
        <Heading as="h2" variant="display-strong-xs">Recent Posts</Heading>
        <Flex direction="column" gap="8">
          {recentPosts.map((post) => (
            <Flex key={post.slug} background="surface" radius="m" padding="m" border="neutral-medium" borderStyle="solid-1" justifyContent="space-between" alignItems="center">
              <Flex direction="column" gap="4">
                <Text variant="body-strong-s">{post.metadata.title}</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">{post.metadata.publishedAt}</Text>
              </Flex>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {(post.metadata as Record<string, unknown>).metaDescription ? '✓ SEO enriched' : '○ Not enriched'}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
