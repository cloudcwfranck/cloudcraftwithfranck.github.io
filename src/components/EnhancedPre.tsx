import { CopyButton } from './CopyButton';
import React from 'react';

interface EnhancedPreProps extends React.HTMLAttributes<HTMLPreElement> {
  'data-language'?: string;
  'data-theme'?: string;
}

export function EnhancedPre({ children, 'data-language': lang, style, ...props }: EnhancedPreProps) {
  const rawText = extractText(children);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '10px',
        border: '1px solid var(--neutral-border-medium)',
        overflow: 'hidden',
        marginBlock: '1.5rem',
      }}
    >
      {lang && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            background: 'var(--neutral-background-strong)',
            borderBottom: '1px solid var(--neutral-border-medium)',
            fontSize: '12px',
            color: 'var(--neutral-on-background-weak)',
            fontFamily: 'var(--font-code, monospace)',
          }}
        >
          <span>{lang}</span>
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <CopyButton text={rawText} />
        <pre
          {...props}
          style={{
            margin: 0,
            padding: '1.25rem',
            overflowX: 'auto',
            fontSize: '13px',
            lineHeight: '1.6',
            background: 'var(--neutral-background-medium)',
            ...style,
          }}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) {
    const el = node as React.ReactElement<{ children?: React.ReactNode }>;
    return extractText(el.props.children);
  }
  return '';
}
