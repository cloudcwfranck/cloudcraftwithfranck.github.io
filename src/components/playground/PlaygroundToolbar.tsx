'use client';

import { useState, useRef } from 'react';
import { Flex, Text } from '@/once-ui/components';
import { EXAMPLES } from './BicepEditor';

interface PlaygroundToolbarProps {
  onAnalyze: () => void;
  onExampleLoad: (code: string) => void;
  onClear: () => void;
  onShare: () => void;
  onCopyArm: () => void;
  isAnalyzing: boolean;
  hasAnalysis: boolean;
  remainingRequests: number | null;
}

export function PlaygroundToolbar({
  onAnalyze,
  onExampleLoad,
  onClear,
  onShare,
  onCopyArm,
  isAnalyzing,
  hasAnalysis,
  remainingRequests,
}: PlaygroundToolbarProps) {
  const [showExamples, setShowExamples] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [armCopied, setArmCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const btnBase: React.CSSProperties = {
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid var(--neutral-border-medium)',
    background: 'var(--neutral-background-medium)',
    color: 'var(--neutral-on-background-strong)',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  };

  const handleShare = async () => {
    await onShare();
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleCopyArm = async () => {
    await onCopyArm();
    setArmCopied(true);
    setTimeout(() => setArmCopied(false), 2000);
  };

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Banner strip */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(34,197,94,0.1) 100%)',
        borderBottom: '1px solid rgba(99,102,241,0.2)',
        padding: '6px 16px',
        fontSize: '12px',
        color: 'var(--neutral-on-background-weak)',
        textAlign: 'center',
      }}>
        ⚡ AI-powered — Bicep → ARM JSON + NIST 800-53 compliance in seconds
        {remainingRequests !== null && (
          <span style={{ marginLeft: '16px', opacity: 0.7 }}>
            {remainingRequests} analyses remaining this hour
          </span>
        )}
      </div>

      {/* Main toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'var(--neutral-background-medium)',
        borderBottom: '1px solid var(--neutral-border-medium)',
        overflowX: 'auto',
      }}>
        {/* Left: wordmark */}
        <Flex alignItems="center" gap="8" style={{ flexShrink: 0 }}>
          <span style={{ fontSize: '16px', lineHeight: 1 }}>⬡</span>
          <Text variant="label-default-s" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
            Bicep Playground
          </Text>
          <span style={{
            background: 'rgba(99,102,241,0.2)',
            color: '#818cf8',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '4px',
            padding: '1px 6px',
            fontSize: '10px',
            fontWeight: 700,
          }}>
            beta
          </span>
        </Flex>

        <div style={{ flex: 1 }} />

        {/* Center: examples + clear */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            style={btnBase}
            onClick={() => setShowExamples(!showExamples)}
            onBlur={(e) => {
              if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
                setShowExamples(false);
              }
            }}
          >
            Examples ▾
          </button>
          {showExamples && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              background: 'var(--neutral-background-medium)',
              border: '1px solid var(--neutral-border-medium)',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              zIndex: 100,
              minWidth: '200px',
              overflow: 'hidden',
            }}>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--neutral-border-medium)',
                    color: 'var(--neutral-on-background-strong)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'var(--neutral-background-strong)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; }}
                  onMouseDown={() => {
                    onExampleLoad(ex.code);
                    setShowExamples(false);
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button style={btnBase} onClick={onClear}>Clear</button>

        <div style={{ width: '1px', height: '20px', background: 'var(--neutral-border-medium)', flexShrink: 0 }} />

        {/* Right: actions */}
        <button
          style={{ ...btnBase, opacity: hasAnalysis ? 1 : 0.4 }}
          disabled={!hasAnalysis}
          onClick={handleCopyArm}
          title="Copy ARM JSON to clipboard"
        >
          {armCopied ? '✓ Copied' : 'Copy ARM'}
        </button>

        <button
          style={{ ...btnBase, opacity: hasAnalysis ? 1 : 0.4 }}
          disabled={!hasAnalysis}
          onClick={handleShare}
          title="Share this analysis"
        >
          {shareCopied ? '✓ Link copied!' : 'Share'}
        </button>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          style={{
            ...btnBase,
            background: isAnalyzing ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.9)',
            borderColor: '#6366f1',
            color: '#fff',
            fontWeight: 600,
            paddingLeft: '20px',
            paddingRight: '20px',
          }}
          title="Analyze Bicep (Ctrl+Enter)"
        >
          {isAnalyzing ? (
            <Flex alignItems="center" gap="8">
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
              Analyzing…
            </Flex>
          ) : (
            '▶ Analyze'
          )}
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
