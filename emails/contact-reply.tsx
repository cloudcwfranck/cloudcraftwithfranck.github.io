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

interface ContactReplyProps {
  name: string;
  subject: string;
}

export default function ContactReply({ name, subject }: ContactReplyProps) {
  return (
    <Html>
      <Head />
      <Preview>Got your message — I'll be in touch shortly.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Message Received</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thanks for reaching out regarding <strong style={{ color: '#ffffff' }}>{subject}</strong>.
            I've received your message and will get back to you within 1–2 business days.
          </Text>
          <Text style={text}>
            In the meantime, feel free to explore the blog or connect with me on LinkedIn or X.
          </Text>
          <Section style={btnContainer}>
            <Button style={btn} href="https://cloudcraftwithfranck.org/blog">
              Browse the Blog
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Franck Kengne · CloudCraftWithFranck
            <br />
            <Link href="https://cloudcraftwithfranck.org" style={link}>
              cloudcraftwithfranck.org
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#0a0a0a', fontFamily: 'Inter, sans-serif' };
const container = { maxWidth: '560px', margin: '0 auto', padding: '40px 20px' };
const h1 = { color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '24px' };
const text = { color: '#d4d4d4', fontSize: '16px', lineHeight: '24px', marginBottom: '16px' };
const btnContainer = { textAlign: 'center' as const, margin: '32px 0' };
const btn = {
  backgroundColor: '#10b981',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
};
const hr = { borderColor: '#262626', margin: '32px 0' };
const footer = { color: '#737373', fontSize: '12px', lineHeight: '18px' };
const link = { color: '#10b981' };
