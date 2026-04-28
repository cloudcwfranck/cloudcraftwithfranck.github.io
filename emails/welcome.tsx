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

interface WelcomeEmailProps {
  firstName?: string;
}

export default function WelcomeEmail({ firstName = 'there' }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to CloudCraftWithFranck — cloud engineering insights every week.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to CloudCraftWithFranck</Heading>
          <Text style={text}>
            Hey {firstName},
          </Text>
          <Text style={text}>
            Thanks for subscribing. You're now part of a community of cloud engineers focused on
            Azure, FedRAMP, DevSecOps, and everything in between.
          </Text>
          <Text style={text}>
            Every week I share deep technical content on topics like AKS hardening, FedRAMP ATO
            automation, NIST 800-53 policy-as-code, and real-world GovCloud architecture patterns.
          </Text>
          <Section style={btnContainer}>
            <Button style={btn} href="https://cloudcraftwithfranck.org/blog">
              Read the Latest Posts
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            CloudCraftWithFranck · Building the future of Cloud Engineering, one line of code at a time.
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
