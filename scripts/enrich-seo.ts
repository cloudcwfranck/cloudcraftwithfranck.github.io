#!/usr/bin/env ts-node
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(__dirname, '..', 'src', 'app', '[locale]', 'blog', 'posts', 'en');

interface EnrichedMeta {
  metaDescription: string;
  keywords: string[];
  internalLinks: string[];
  twitterThread: string[];
  tldr: string;
}

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
}

function needsEnrichment(frontmatter: Record<string, unknown>): boolean {
  return !frontmatter.metaDescription;
}

async function enrichPost(filePath: string, allSlugs: string[], client: Anthropic): Promise<void> {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  if (!needsEnrichment(data)) {
    console.log(`  skip (already enriched): ${path.basename(filePath)}`);
    return;
  }

  console.log(`  enriching: ${path.basename(filePath)}`);

  const otherSlugs = allSlugs.filter((s) => s !== path.basename(filePath, '.mdx'));

  const prompt = `You are an SEO specialist for a technical cloud engineering blog (cloudcraftwithfranck.org).
Given the following blog post content, generate enriched SEO metadata.

Post title: ${data.title}
Post body (first 2000 chars):
${content.slice(0, 2000)}

Other posts available for internal linking (slugs):
${otherSlugs.slice(0, 10).join('\n')}

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "metaDescription": "string ≤155 chars summarizing the post for search results",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "internalLinks": ["slug-of-related-post-1", "slug-of-related-post-2"],
  "twitterThread": ["tweet1 (≤280 chars)", "tweet2", "tweet3", "tweet4", "tweet5"],
  "tldr": "Two sentence plain-English summary of the post."
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

  let enriched: EnrichedMeta;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    enriched = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error(`  failed to parse enrichment for ${path.basename(filePath)}:`, e);
    return;
  }

  const updatedFrontmatter = {
    ...data,
    metaDescription: enriched.metaDescription,
    keywords: enriched.keywords,
    internalLinks: enriched.internalLinks,
    twitterThread: enriched.twitterThread,
    tldr: enriched.tldr,
  };

  const updated = matter.stringify(content, updatedFrontmatter);
  fs.writeFileSync(filePath, updated);
  console.log(`  wrote enriched frontmatter: ${path.basename(filePath)}`);
}

async function main(): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set — skipping SEO enrichment.');
    process.exit(0);
  }

  const client = new Anthropic({ apiKey });
  const files = getMdxFiles(POSTS_DIR);

  if (files.length === 0) {
    console.log('No MDX posts found — nothing to enrich.');
    return;
  }

  const allSlugs = files.map((f) => path.basename(f, '.mdx'));
  console.log(`Enriching ${files.length} posts...`);

  for (const file of files) {
    await enrichPost(path.join(POSTS_DIR, file), allSlugs, client);
  }

  console.log('SEO enrichment complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
