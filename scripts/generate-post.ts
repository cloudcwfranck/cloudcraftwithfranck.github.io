#!/usr/bin/env ts-node
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const POSTS_DIR = path.join(__dirname, '..', 'src', 'app', '[locale]', 'blog', 'posts', 'en');
const QUEUE_FILE = path.join(__dirname, 'topic-queue.json');

interface TopicQueue {
  topics: string[];
  published: string[];
}

function loadQueue(): TopicQueue {
  const raw = fs.readFileSync(QUEUE_FILE, 'utf-8');
  return JSON.parse(raw);
}

function saveQueue(queue: TopicQueue): void {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

function getNextTopic(queue: TopicQueue): string | null {
  const remaining = queue.topics.filter((t) => !queue.published.includes(t));
  return remaining.length > 0 ? remaining[0] : null;
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function deriveTag(slug: string): string {
  if (slug.includes('fedramp')) return 'FedRAMP';
  if (slug.includes('nist')) return 'NIST';
  if (slug.includes('aks') || slug.includes('kubernetes')) return 'Kubernetes';
  if (slug.includes('azure')) return 'Azure';
  if (slug.includes('devsecops') || slug.includes('pipeline')) return 'DevSecOps';
  if (slug.includes('oscal')) return 'OSCAL';
  if (slug.includes('cmmc')) return 'CMMC';
  if (slug.includes('zero-trust')) return 'ZeroTrust';
  return 'Cloud';
}

async function generatePost(slug: string): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  const client = new Anthropic({ apiKey });
  const title = slugToTitle(slug);
  const tag = deriveTag(slug);

  console.log(`Generating post: ${slug}`);

  const systemPrompt = `You are Franck Kengne, a 6X Azure and 4X AWS certified Senior Cloud Architect
and Security Engineer based in the United States. You specialize in FedRAMP, NIST 800-53,
DoD IL4/IL5, Azure Government (GCC High), AKS hardening, DevSecOps, and cloud compliance automation.

Write in first-person, technical, authoritative voice. Assume the reader is an experienced
cloud engineer or DevSecOps practitioner. Use concrete commands, real configuration examples,
and reference actual Azure/NIST/FedRAMP documentation accurately. Never hallucinate citations
or tool names. Use proper MDX formatting with headers, code blocks, and numbered steps.

The MDX output must:
- Start directly with the body content (NO frontmatter — that will be added separately)
- Use ## for main sections, ### for subsections
- Include at least 3 code blocks using the existing CodeBlock MDX component format:
  <CodeBlock className="custom-code-block" liveEditor codeInstances={[{ code: \`...\`, label: "...", language: "bash" }]} copyButton />
- Be 1500–2500 words
- End with a practical "Next Steps" or "Conclusion" section
- Sign off with: CloudCraftWithFranck | Building the future of Cloud Engineering, one line of code at a time.`;

  const userPrompt = `Write a comprehensive technical blog post titled: "${title}"

Topic slug: ${slug}

Cover:
1. What this technology/practice is and why it matters for GovCloud/FedRAMP environments
2. Step-by-step implementation with real Azure CLI / Bicep / PowerShell / KQL commands
3. Key NIST 800-53 or FedRAMP controls this addresses
4. Common pitfalls and how to avoid them
5. How this fits into a broader DevSecOps or compliance automation pipeline

Make it immediately actionable for a senior cloud engineer working in a DoD or federal civilian environment.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude API');
  }

  const body = content.text.trim();

  const frontmatter = `---
title: "${title}"
publishedAt: "${today()}"
summary: "A deep-dive into ${title.toLowerCase()} for FedRAMP and DoD environments — covering implementation, compliance controls, and DevSecOps integration."
tag: "${tag}"
---

`;

  const outputPath = path.join(POSTS_DIR, `${slug}.mdx`);
  fs.writeFileSync(outputPath, frontmatter + body);
  console.log(`Wrote: ${outputPath}`);
}

async function main(): Promise<void> {
  const slugArg = process.argv[2];

  if (slugArg) {
    await generatePost(slugArg);
    return;
  }

  const queue = loadQueue();
  const next = getNextTopic(queue);

  if (!next) {
    console.log('Topic queue is empty — all topics have been published.');
    process.exit(0);
  }

  await generatePost(next);

  queue.published.push(next);
  saveQueue(queue);
  console.log(`Marked "${next}" as published. ${queue.topics.filter((t) => !queue.published.includes(t)).length} topics remaining.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
