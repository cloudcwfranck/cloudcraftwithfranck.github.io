import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactNotificationProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  projectType: string;
}

export default function ContactNotification({
  name,
  email,
  subject,
  message,
  budget,
  projectType,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Section style={card}>
            <Row label="Name" value={name} />
            <Row label="Email" value={email} />
            <Row label="Subject" value={subject} />
            <Row label="Project Type" value={projectType} />
            {budget && <Row label="Budget" value={budget} />}
          </Section>
          <Hr style={hr} />
          <Text style={label}>Message</Text>
          <Text style={messageStyle}>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <Text style={labelStyle}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </div>
  );
}

const main = { backgroundColor: '#0a0a0a', fontFamily: 'Inter, sans-serif' };
const container = { maxWidth: '560px', margin: '0 auto', padding: '40px 20px' };
const h1 = { color: '#ffffff', fontSize: '22px', fontWeight: '700', marginBottom: '24px' };
const card = { backgroundColor: '#141414', borderRadius: '8px', padding: '20px', marginBottom: '24px' };
const hr = { borderColor: '#262626', margin: '24px 0' };
const label = { color: '#737373', fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 4px' };
const labelStyle = { color: '#737373', fontSize: '11px', margin: '0 0 2px', textTransform: 'uppercase' as const };
const valueStyle = { color: '#d4d4d4', fontSize: '15px', margin: '0 0 12px' };
const messageStyle = { color: '#d4d4d4', fontSize: '15px', lineHeight: '22px', whiteSpace: 'pre-wrap' as const };
