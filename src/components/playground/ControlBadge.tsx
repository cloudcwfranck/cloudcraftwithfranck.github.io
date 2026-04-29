'use client';

import { useState } from 'react';
import { Text, Flex } from '@/once-ui/components';
import { CopyButton } from '@/components/CopyButton';

export type ControlCoverage = 'full' | 'partial' | 'missing';

export interface ControlData {
  controlId: string;
  controlName: string;
  family: string;
  coverage: ControlCoverage;
  explanation?: string;
  gap?: string;
  remediation?: string;
  bicepSnippet?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  azureService?: string;
}

const FAMILY_COLORS: Record<string, string> = {
  'Access Control': '#3b82f6',
  'Audit and Accountability': '#8b5cf6',
  'Configuration Management': '#f97316',
  'Identification and Authentication': '#14b8a6',
  'System and Communications Protection': '#22c55e',
  'System and Information Integrity': '#ef4444',
  'Contingency Planning': '#eab308',
  'Risk Assessment': '#6b7280',
  'System and Services Acquisition': '#6366f1',
  'Incident Response': '#ec4899',
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

const COVERAGE_STYLES: Record<ControlCoverage, { bg: string; border: string; dot: string }> = {
  full: { bg: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.3)', dot: '#22c55e' },
  partial: { bg: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.3)', dot: '#eab308' },
  missing: { bg: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', dot: '#ef4444' },
};

function getFamilyColor(family: string): string {
  for (const [key, color] of Object.entries(FAMILY_COLORS)) {
    if (family.includes(key.split(' ')[0])) return color;
  }
  return '#6b7280';
}

interface ControlBadgeProps {
  control: ControlData;
}

export function ControlBadge({ control }: ControlBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const style = COVERAGE_STYLES[control.coverage];
  const familyColor = getFamilyColor(control.family);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: style.bg,
        border: style.border,
        borderRadius: '8px',
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        userSelect: 'none',
      }}
    >
      <Flex alignItems="center" gap="8">
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: style.dot, flexShrink: 0 }} />
        <div
          style={{
            background: familyColor + '22',
            color: familyColor,
            border: `1px solid ${familyColor}44`,
            borderRadius: '4px',
            padding: '1px 6px',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'var(--font-code, monospace)',
            flexShrink: 0,
          }}
        >
          {control.controlId}
        </div>
        <Text variant="label-default-s" style={{ flex: 1, minWidth: 0 }}>
          {control.controlName}
        </Text>
        {control.severity && (
          <div
            style={{
              color: SEVERITY_COLORS[control.severity],
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {control.severity}
          </div>
        )}
        <Text variant="label-default-xs" onBackground="neutral-weak" style={{ flexShrink: 0 }}>
          {expanded ? '▲' : '▼'}
        </Text>
      </Flex>

      {expanded && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: style.border }}>
          <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginBottom: '4px' }}>
            {control.family}
          </Text>
          {control.explanation && (
            <Text variant="body-default-s" onBackground="neutral-medium" style={{ marginBottom: '8px' }}>
              {control.explanation}
            </Text>
          )}
          {control.gap && (
            <div style={{ marginBottom: '8px' }}>
              <Text variant="label-default-xs" style={{ color: '#ef4444', marginBottom: '2px' }}>Gap</Text>
              <Text variant="body-default-s" onBackground="neutral-medium">{control.gap}</Text>
            </div>
          )}
          {control.remediation && (
            <div style={{ marginBottom: '8px' }}>
              <Text variant="label-default-xs" style={{ color: '#22c55e', marginBottom: '2px' }}>Remediation</Text>
              <Text variant="body-default-s" onBackground="neutral-medium">{control.remediation}</Text>
            </div>
          )}
          {control.bicepSnippet && (
            <div style={{ position: 'relative', marginTop: '8px' }}>
              <div style={{ position: 'absolute', top: '4px', right: '4px', zIndex: 1 }}>
                <CopyButton text={control.bicepSnippet} />
              </div>
              <pre style={{
                background: 'var(--neutral-background-strong)',
                border: '1px solid var(--neutral-border-medium)',
                borderRadius: '6px',
                padding: '10px 12px',
                paddingRight: '80px',
                fontSize: '12px',
                overflowX: 'auto',
                margin: 0,
                fontFamily: 'var(--font-code, monospace)',
                color: 'var(--neutral-on-background-strong)',
              }}>
                {control.bicepSnippet}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
