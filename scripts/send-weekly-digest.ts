#!/usr/bin/env ts-node
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import * as React from 'react';
import { render } from '@react-email/components';
import WeeklyDigest from '../emails/weekly-digest';

const POSTS_DIR = path.join(__dirname, '..', 'src', 'app', '[locale]', 'blog', 'posts', 'en');

interface PostMeta {
  title: string;
  publishedAt: string;
  summary: string;
}

function getPostsPublishedThisWeek(): { title: string; slug: string; publishedAt: string }[] {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      const { data } = matter(raw);
      return {
        title: (data as PostMeta).title,
        slug: path.basename(file, '.mdx'),
        publishedAt: (data as PostMeta).publishedAt,
      };
    })
    .filter((p) => new Date(p.publishedAt) >= cutoff);
}

async function getPostHogStats(): Promise<string> {
  const key = process.env.POSTHOG_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  if (!key || !projectId) return '';
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const res = await fetch(
      `https://us.i.posthog.com/api/projects/${projectId}/insights/trend/?events=[{"id":"$pageview"}]&date_from=${sevenDaysAgo}`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return '';
    const data = await res.json() as { result?: Array<{ breakdown_value?: string; count?: number }> };
    const top = (data.result ?? []).slice(0, 3);
    return top.map((r) => `${r.breakdown_value}: ${r.count} views`).join(', ');
  } catch {
    return '';
  }
}

async function getSubscriberCount(): Promise<number> {
  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audienceId) return 0;
  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return 0;
    const data = await res.json() as { data?: unknown[] };
    return data.data?.length ?? 0;
  } catch {
    return 0;
  }
}

async function buildNarrative(
  newPosts: { title: string }[],
  topContent: string,
  subscriberCount: number
): Promise<{ narrative: string; didYouKnow: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { narrative: 'Another week of cloud engineering content from CloudCraftWithFranck.', didYouKnow: '' };

  const client = new Anthropic({ apiKey });
  const context = [
    newPosts.length > 0 ? `New posts: ${newPosts.map((p) => p.title).join(', ')}` : 'No new posts this week.',
    topContent ? `Top content: ${topContent}` : '',
    subscriberCount > 0 ? `Subscriber count: ${subscriberCount}` : '',
  ].filter(Boolean).join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `You are Franck Kengne, cloud advocate and instructor at CloudCraftWithFranck.
Write a warm, personal weekly digest intro (2–3 sentences) and a "Did You Know" FedRAMP/GovCloud/Azure fact.

Data:
${context}

Return JSON only:
{"narrative": "...", "didYouKnow": "..."}`,
    }],
  });

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('no json');
    const parsed = JSON.parse(match[0]) as { narrative?: string; didYouKnow?: string };
    return { narrative: parsed.narrative ?? '', didYouKnow: parsed.didYouKnow ?? '' };
  } catch {
    return { narrative: 'Another week of cloud engineering content from CloudCraftWithFranck.', didYouKnow: '' };
  }
}

async function main(): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@cloudcraftwithfranck.org';

  if (!resendKey || !audienceId) {
    console.error('RESEND_API_KEY and RESEND_AUDIENCE_ID are required.');
    process.exit(1);
  }

  const resend = new Resend(resendKey);
  const weekOf = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const newPosts = getPostsPublishedThisWeek();
  const [topContent, subscriberCount] = await Promise.all([getPostHogStats(), getSubscriberCount()]);
  const { narrative, didYouKnow } = await buildNarrative(newPosts, topContent, subscriberCount);

  const growthStats = subscriberCount > 0 ? `${subscriberCount} total subscribers` : '';

  const html = await render(
    React.createElement(WeeklyDigest, { weekOf, newPosts, topContent, growthStats, didYouKnow, narrative })
  );

  const { data, error } = await resend.broadcasts.create({
    audienceId,
    from: `Franck Kengne <${fromEmail}>`,
    subject: `CloudCraftWithFranck Weekly — ${weekOf}`,
    html,
  });

  if (error) {
    console.error('Failed to create broadcast:', error);
    process.exit(1);
  }

  console.log(`Broadcast created: ${data?.id}`);

  if (data?.id) {
    await resend.broadcasts.send(data.id);
    console.log('Broadcast sent.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
