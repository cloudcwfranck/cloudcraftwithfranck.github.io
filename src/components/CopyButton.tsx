'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy code'}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: 'var(--neutral-background-strong)',
        color: 'var(--neutral-on-background-weak)',
        border: '1px solid var(--neutral-border-medium)',
        borderRadius: '6px',
        padding: '4px 10px',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'color 0.15s, border-color 0.15s',
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}
