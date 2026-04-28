import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/app/utils/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'slug parameter is required' }, { status: 400 });
  }

  const posts = getPosts(['src', 'app', '[locale]', 'blog', 'posts', 'en']);
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return NextResponse.json({ error: `Post "${slug}" not found` }, { status: 404 });
  }

  const { title, summary, tag, publishedAt } = post.metadata as Record<string, unknown> & {
    title: string;
    summary: string;
    tag?: string;
    publishedAt: string;
    metaDescription?: string;
    keywords?: string[];
    internalLinks?: string[];
    twitterThread?: string[];
    tldr?: string;
  };

  return NextResponse.json({
    slug,
    title,
    summary,
    tag,
    publishedAt,
    metaDescription: (post.metadata as Record<string, unknown>).metaDescription ?? null,
    keywords: (post.metadata as Record<string, unknown>).keywords ?? null,
    internalLinks: (post.metadata as Record<string, unknown>).internalLinks ?? null,
    twitterThread: (post.metadata as Record<string, unknown>).twitterThread ?? null,
    tldr: (post.metadata as Record<string, unknown>).tldr ?? null,
  });
}
