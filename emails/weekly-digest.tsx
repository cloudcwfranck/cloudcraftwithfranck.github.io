import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface Post {
  title: string;
  slug: string;
  publishedAt: string;
}

interface WeeklyDigestProps {
  weekOf: string;
  newPosts: Post[];
  topContent: string;
  growthStats: string;
  didYouKnow: string;
  narrative: string;
}

export default function WeeklyDigest({
  weekOf,
  newPosts,
  topContent,
  growthStats,
  didYouKnow,
  narrative,
}: WeeklyDigestProps) {
  return (
    <Html>
      <Head />
      <Preview>CloudCraftWithFranck Weekly — {weekOf}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>CloudCraftWithFranck · Weekly Digest</Text>
          <Heading style={h1}>Week of {weekOf}</Heading>

          <Text style={text}>{narrative}</Text>

          {newPosts.length > 0 && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>New This Week</Heading>
              {newPosts.map((post) => (
                <Section key={post.slug} style={postCard}>
                  <Text style={postTitle}>{post.title}</Text>
                  <Text style={postMeta}>{post.publishedAt}</Text>
                  <Button
                    style={readBtn}
                    href={`https://cloudcraftwithfranck.org/blog/${post.slug}`}>
                    Read →
                  </Button>
                </Section>
              ))}
            </>
          )}

          {topContent && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Top Content</Heading>
              <Text style={text}>{topContent}</Text>
            </>
          )}

          {growthStats && (
            <>
              <Hr style={hr} />
              <Heading style={h2}>Growth This Week</Heading>
              <Text style={text}>{growthStats}</Text>
            </>
          )}

          {didYouKnow && (
            <>
              <Hr style={hr} />
              <Section style={factBox}>
                <Text style={factLabel}>DID YOU KNOW</Text>
                <Text style={factText}>{didYouKnow}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            You're receiving this because you subscribed to CloudCraftWithFranck.
            <br />
            <Link href="https://cloudcraftwithfranck.org" style={link}>cloudcraftwithfranck.org</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#0a0a0a', fontFamily: 'Inter, sans-serif' };
const container = { maxWidth: '560px', margin: '0 auto', padding: '40px 20px' };
const eyebrow = { color: '#10b981', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' as const, margin: '0 0 8px' };
const h1 = { color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: '0 0 24px' };
const h2 = { color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 16px' };
const text = { color: '#d4d4d4', fontSize: '15px', lineHeight: '24px', margin: '0 0 16px' };
const hr = { borderColor: '#262626', margin: '32px 0' };
const postCard = { backgroundColor: '#141414', borderRadius: '8px', padding: '16px', marginBottom: '12px' };
const postTitle = { color: '#ffffff', fontSize: '15px', fontWeight: '600', margin: '0 0 4px' };
const postMeta = { color: '#737373', fontSize: '12px', margin: '0 0 12px' };
const readBtn = { backgroundColor: 'transparent', border: '1px solid #10b981', borderRadius: '6px', color: '#10b981', fontSize: '13px', padding: '6px 14px', textDecoration: 'none' };
const factBox = { backgroundColor: '#0d1f17', border: '1px solid #10b981', borderRadius: '8px', padding: '20px' };
const factLabel = { color: '#10b981', fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', margin: '0 0 8px' };
const factText = { color: '#d4d4d4', fontSize: '14px', lineHeight: '22px', margin: 0 };
const footer = { color: '#525252', fontSize: '12px', lineHeight: '18px' };
const link = { color: '#10b981' };
