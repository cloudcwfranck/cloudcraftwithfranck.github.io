'use client';

import { useState } from 'react';
import { Flex, Heading, Text, Input, Button } from '@/once-ui/components';

const PROJECT_TYPES = [
  { value: 'consulting', label: 'Cloud Consulting' },
  { value: 'speaking', label: 'Speaking Engagement' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    budget: '',
    projectType: 'consulting',
    website: '', // honeypot
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <Flex direction="column" gap="m" padding="l" background="surface" radius="l" border="neutral-medium" borderStyle="solid-1">
        <Heading variant="display-strong-xs">Message sent!</Heading>
        <Text onBackground="neutral-weak">
          Thanks for reaching out. I'll be in touch within 1–2 business days. Check your inbox for a confirmation.
        </Text>
      </Flex>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ display: 'none' }} aria-hidden="true">
        <input name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
      </div>
      <Flex direction="column" gap="m">
        <Input id="contact-name" name="name" label="Full Name" value={form.name} onChange={handleChange} required />
        <Input id="contact-email" name="email" type="email" label="Email Address" value={form.email} onChange={handleChange} required />
        <Input id="contact-subject" name="subject" label="Subject" value={form.subject} onChange={handleChange} required />
        <Flex direction="column" gap="4">
          <Text variant="label-default-s" onBackground="neutral-weak">Project Type</Text>
          <select
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            style={{
              background: 'var(--neutral-background-medium)',
              color: 'var(--neutral-on-background-strong)',
              border: '1px solid var(--neutral-border-medium)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              width: '100%',
              outline: 'none',
            }}
          >
            {PROJECT_TYPES.map((pt) => (
              <option key={pt.value} value={pt.value}>{pt.label}</option>
            ))}
          </select>
        </Flex>
        <Input id="contact-budget" name="budget" label="Budget (optional)" value={form.budget} onChange={handleChange} />
        <Flex direction="column" gap="4">
          <Text variant="label-default-s" onBackground="neutral-weak">Message</Text>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Describe your project or question..."
            style={{
              background: 'var(--neutral-background-medium)',
              color: 'var(--neutral-on-background-strong)',
              border: '1px solid var(--neutral-border-medium)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              width: '100%',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </Flex>
        {status === 'error' && (
          <Text variant="body-default-s" style={{ color: 'var(--danger-on-background-strong)' }}>
            {errorMsg}
          </Text>
        )}
        <Button type="submit" size="m" disabled={status === 'sending'} fillWidth>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </Button>
      </Flex>
    </form>
  );
}
