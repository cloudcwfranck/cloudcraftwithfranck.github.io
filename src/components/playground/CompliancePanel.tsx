'use client';

import { useState } from 'react';
import { Flex, Text, Heading } from '@/once-ui/components';
import { ControlBadge, type ControlData } from './ControlBadge';
import { CopyButton } from '@/components/CopyButton';

interface SecurityFinding {
  finding: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedResource: string;
  fix: string;
  bicepSnippet?: string;
}

interface OverallScore {
  score: number;
  fedrampReadiness: 'not-ready' | 'partial' | 'moderate-ready' | 'high-ready';
  il4Ready: boolean;
  summary: string;
}

interface AnalysisResult {
  controlsCovered: ControlData[];
  controlsPartial: ControlData[];
  controlsMissing: ControlData[];
  securityFindings: SecurityFinding[];
  overallScore: OverallScore;
}

interface CompliancePanelProps {
  analysis: AnalysisResult | null;
}

type TabId = 'compliance' | 'findings' | 'score';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

const FEDRAMP_LABELS: Record<string, { label: string; color: string }> = {
  'not-ready': { label: 'Not Ready', color: '#ef4444' },
  'partial': { label: 'Partial', color: '#f97316' },
  'moderate-ready': { label: 'FedRAMP Moderate Ready', color: '#eab308' },
  'high-ready': { label: 'FedRAMP High Ready', color: '#22c55e' },
};

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 90 ? '#22c55e' : score >= 71 ? '#eab308' : score >= 41 ? '#f97316' : '#ef4444';
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--neutral-background-strong)" strokeWidth="12" />
      <circle
        cx="64" cy="64" r={r} fill="none"
        stroke={color} strokeWidth="12"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
      <text x="64" y="60" textAnchor="middle" fill={color} fontSize="26" fontWeight="700" fontFamily="inherit">
        {score}
      </text>
      <text x="64" y="78" textAnchor="middle" fill="var(--neutral-on-background-weak)" fontSize="11" fontFamily="inherit">
        / 100
      </text>
    </svg>
  );
}

export function CompliancePanel({ analysis }: CompliancePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('compliance');
  const [expandedFindings, setExpandedFindings] = useState<Set<number>>(new Set());

  const tabs: { id: TabId; label: string; count?: number }[] = [
    {
      id: 'compliance',
      label: 'Compliance Coverage',
      count: analysis ? analysis.controlsCovered.length + analysis.controlsPartial.length + analysis.controlsMissing.length : undefined,
    },
    {
      id: 'findings',
      label: 'Security Findings',
      count: analysis?.securityFindings?.length,
    },
    { id: 'score', label: 'Score & Readiness' },
  ];

  const tabStyle = (active: boolean) => ({
    padding: '8px 16px',
    background: active ? 'var(--neutral-background-strong)' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid var(--brand-border-strong)' : '2px solid transparent',
    color: active ? 'var(--neutral-on-background-strong)' : 'var(--neutral-on-background-weak)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  });

  const emptyState = (
    <Flex direction="column" alignItems="center" justifyContent="center" style={{ padding: '40px 20px', opacity: 0.5 }}>
      <Text variant="body-default-m" onBackground="neutral-weak">Run analysis to see results</Text>
    </Flex>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--neutral-border-medium)',
        background: 'var(--neutral-background-medium)',
        overflowX: 'auto',
        flexShrink: 0,
      }}>
        {tabs.map((tab) => (
          <button key={tab.id} style={tabStyle(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span style={{
                marginLeft: '6px',
                background: 'var(--neutral-background-strong)',
                borderRadius: '10px',
                padding: '1px 7px',
                fontSize: '11px',
                fontWeight: 600,
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeTab === 'compliance' && (
          !analysis ? emptyState : (
            <Flex direction="column" gap="16">
              {/* Covered */}
              {analysis.controlsCovered.length > 0 && (
                <div>
                  <Flex alignItems="center" gap="8" style={{ marginBottom: '10px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                    <Text variant="label-default-s" style={{ color: '#22c55e', fontWeight: 600 }}>
                      Controls Addressed ({analysis.controlsCovered.length})
                    </Text>
                  </Flex>
                  <Flex direction="column" gap="8">
                    {analysis.controlsCovered.map((c) => (
                      <ControlBadge key={c.controlId} control={{ ...c, coverage: 'full' }} />
                    ))}
                  </Flex>
                </div>
              )}

              {/* Partial */}
              {analysis.controlsPartial.length > 0 && (
                <div>
                  <Flex alignItems="center" gap="8" style={{ marginBottom: '10px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }} />
                    <Text variant="label-default-s" style={{ color: '#eab308', fontWeight: 600 }}>
                      Partially Addressed — Gaps Present ({analysis.controlsPartial.length})
                    </Text>
                  </Flex>
                  <Flex direction="column" gap="8">
                    {analysis.controlsPartial.map((c) => (
                      <ControlBadge key={c.controlId} control={{ ...c, coverage: 'partial' }} />
                    ))}
                  </Flex>
                </div>
              )}

              {/* Missing */}
              {analysis.controlsMissing.length > 0 && (
                <div>
                  <Flex alignItems="center" gap="8" style={{ marginBottom: '10px' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <Text variant="label-default-s" style={{ color: '#ef4444', fontWeight: 600 }}>
                      Missing Controls ({analysis.controlsMissing.length})
                    </Text>
                  </Flex>
                  <Flex direction="column" gap="8">
                    {analysis.controlsMissing.map((c) => (
                      <ControlBadge key={c.controlId} control={{ ...c, coverage: 'missing' }} />
                    ))}
                  </Flex>
                </div>
              )}
            </Flex>
          )
        )}

        {activeTab === 'findings' && (
          !analysis ? emptyState : (
            analysis.securityFindings.length === 0 ? (
              <Flex direction="column" alignItems="center" justifyContent="center" style={{ padding: '40px 20px' }}>
                <Text variant="body-default-m" style={{ color: '#22c55e' }}>No security findings — looking good!</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="8">
                {analysis.securityFindings.map((finding, i) => {
                  const isExpanded = expandedFindings.has(i);
                  return (
                    <div
                      key={i}
                      style={{
                        background: 'var(--neutral-background-medium)',
                        border: '1px solid var(--neutral-border-medium)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        onClick={() => {
                          const next = new Set(expandedFindings);
                          if (isExpanded) next.delete(i); else next.add(i);
                          setExpandedFindings(next);
                        }}
                        style={{ padding: '12px', cursor: 'pointer' }}
                      >
                        <Flex alignItems="center" gap="8">
                          <span style={{
                            background: SEVERITY_COLORS[finding.severity] + '22',
                            color: SEVERITY_COLORS[finding.severity],
                            border: `1px solid ${SEVERITY_COLORS[finding.severity]}44`,
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            flexShrink: 0,
                          }}>
                            {finding.severity}
                          </span>
                          <Text variant="label-default-s" style={{ flex: 1 }}>{finding.finding}</Text>
                          <Text variant="label-default-xs" onBackground="neutral-weak">{isExpanded ? '▲' : '▼'}</Text>
                        </Flex>
                        <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginTop: '4px', paddingLeft: '2px' }}>
                          Affected: {finding.affectedResource}
                        </Text>
                      </div>
                      {isExpanded && (
                        <div style={{ padding: '0 12px 12px', borderTop: '1px solid var(--neutral-border-medium)', paddingTop: '12px' }}>
                          <Text variant="label-default-xs" style={{ color: '#22c55e', marginBottom: '4px' }}>Fix</Text>
                          <Text variant="body-default-s" onBackground="neutral-medium" style={{ marginBottom: '10px' }}>
                            {finding.fix}
                          </Text>
                          {finding.bicepSnippet && (
                            <div style={{ position: 'relative' }}>
                              <div style={{ position: 'absolute', top: '4px', right: '4px', zIndex: 1 }}>
                                <CopyButton text={finding.bicepSnippet} />
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
                                {finding.bicepSnippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Flex>
            )
          )
        )}

        {activeTab === 'score' && (
          !analysis ? emptyState : (
            <Flex direction="column" alignItems="center" gap="24" style={{ paddingTop: '8px' }}>
              <ScoreCircle score={analysis.overallScore.score} />

              <Flex direction="column" gap="12" fillWidth>
                {/* FedRAMP readiness */}
                <div style={{
                  background: 'var(--neutral-background-medium)',
                  border: '1px solid var(--neutral-border-medium)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                }}>
                  <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginBottom: '6px' }}>
                    FedRAMP Readiness
                  </Text>
                  <Flex alignItems="center" gap="8">
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: FEDRAMP_LABELS[analysis.overallScore.fedrampReadiness]?.color ?? '#6b7280',
                      flexShrink: 0,
                    }} />
                    <Text variant="label-default-s" style={{
                      color: FEDRAMP_LABELS[analysis.overallScore.fedrampReadiness]?.color ?? '#6b7280',
                      fontWeight: 600,
                    }}>
                      {FEDRAMP_LABELS[analysis.overallScore.fedrampReadiness]?.label ?? analysis.overallScore.fedrampReadiness}
                    </Text>
                  </Flex>
                </div>

                {/* IL4 readiness */}
                <div style={{
                  background: 'var(--neutral-background-medium)',
                  border: '1px solid var(--neutral-border-medium)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                }}>
                  <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginBottom: '6px' }}>
                    DoD IL4 Ready
                  </Text>
                  <Flex alignItems="center" gap="8">
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: analysis.overallScore.il4Ready ? '#22c55e' : '#ef4444',
                      flexShrink: 0,
                    }} />
                    <Text variant="label-default-s" style={{
                      color: analysis.overallScore.il4Ready ? '#22c55e' : '#ef4444',
                      fontWeight: 600,
                    }}>
                      {analysis.overallScore.il4Ready ? 'Yes' : 'Not Yet'}
                    </Text>
                  </Flex>
                </div>

                {/* Summary */}
                <div style={{
                  background: 'var(--neutral-background-medium)',
                  border: '1px solid var(--neutral-border-medium)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                }}>
                  <Text variant="label-default-xs" onBackground="neutral-weak" style={{ marginBottom: '6px' }}>
                    Executive Summary
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-medium">
                    {analysis.overallScore.summary}
                  </Text>
                </div>
              </Flex>
            </Flex>
          )
        )}
      </div>
    </div>
  );
}
