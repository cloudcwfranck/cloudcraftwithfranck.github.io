'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BicepEditor, DEFAULT_BICEP } from './BicepEditor';
import { ArmJsonViewer } from './ArmJsonViewer';
import { CompliancePanel } from './CompliancePanel';
import { PlaygroundToolbar } from './PlaygroundToolbar';

interface AnalysisResult {
  controlsCovered: unknown[];
  controlsPartial: unknown[];
  controlsMissing: unknown[];
  securityFindings: unknown[];
  overallScore: {
    score: number;
    fedrampReadiness: string;
    il4Ready: boolean;
    summary: string;
  };
}

interface ApiResponse {
  armJson?: string;
  analysis?: AnalysisResult;
  remainingRequests?: number;
  error?: string;
  retryAfterMinutes?: number;
}

export function BicepPlayground() {
  const [bicepCode, setBicepCode] = useState(DEFAULT_BICEP);
  const [armJson, setArmJson] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisTime, setAnalysisTime] = useState<number | null>(null);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDismissed, setMobileDismissed] = useState(false);
  const codeRef = useRef(bicepCode);

  useEffect(() => {
    codeRef.current = bicepCode;
  }, [bicepCode]);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // URL state: decode ?code= on mount, auto-analyze
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('code');
    if (encoded) {
      try {
        const decoded = atob(encoded);
        setBicepCode(decoded);
        // auto-analyze after a short tick so state settles
        setTimeout(() => handleAnalyze(decoded), 300);
      } catch {
        // ignore bad base64
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + Enter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isAnalyzing) handleAnalyze();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnalyzing]);

  const handleAnalyze = useCallback(async (codeOverride?: string) => {
    const code = codeOverride ?? codeRef.current;
    if (!code.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    const start = Date.now();

    try {
      const res = await fetch('/api/bicep-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bicepCode: code }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(
            `Rate limit reached. You can run ${data.retryAfterMinutes ?? '?'} more minutes until the next window. ` +
            `Subscribe to the newsletter for higher limits.`
          );
        } else {
          setError(data.error ?? 'Analysis failed. Please try again.');
        }
        return;
      }

      if (data.armJson) setArmJson(data.armJson);
      if (data.analysis) setAnalysis(data.analysis);
      if (data.remainingRequests !== undefined) setRemainingRequests(data.remainingRequests);
      setAnalysisTime(Date.now() - start);
    } catch {
      setError('Network error — please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing]);

  const handleExampleLoad = useCallback((code: string) => {
    setBicepCode(code);
    setArmJson(null);
    setAnalysis(null);
    setError(null);
    setAnalysisTime(null);
  }, []);

  const handleClear = useCallback(() => {
    setBicepCode('');
    setArmJson(null);
    setAnalysis(null);
    setError(null);
    setAnalysisTime(null);
  }, []);

  const handleShare = useCallback(async () => {
    const encoded = btoa(codeRef.current);
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    await navigator.clipboard.writeText(url);
  }, []);

  const handleCopyArm = useCallback(async () => {
    if (armJson) {
      let text = armJson;
      try {
        const parsed = typeof armJson === 'string' ? JSON.parse(armJson) : armJson;
        text = JSON.stringify(parsed, null, 2);
      } catch { /* keep raw */ }
      await navigator.clipboard.writeText(text);
    }
  }, [armJson]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <PlaygroundToolbar
        onAnalyze={() => handleAnalyze()}
        onExampleLoad={handleExampleLoad}
        onClear={handleClear}
        onShare={handleShare}
        onCopyArm={handleCopyArm}
        isAnalyzing={isAnalyzing}
        hasAnalysis={!!analysis}
        remainingRequests={remainingRequests}
      />

      {/* Mobile banner */}
      {isMobile && !mobileDismissed && (
        <div style={{
          background: 'rgba(99,102,241,0.15)',
          borderBottom: '1px solid rgba(99,102,241,0.25)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '13px', color: 'var(--neutral-on-background-weak)' }}>
            Best experienced on a desktop or tablet for the split-pane editor view.
          </span>
          <button
            onClick={() => setMobileDismissed(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--neutral-on-background-weak)',
              cursor: 'pointer',
              fontSize: '16px',
              lineHeight: 1,
              padding: '2px',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          borderBottom: '1px solid rgba(239,68,68,0.25)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '13px', color: '#ef4444' }}>
            {error}
            {error.includes('Rate limit') && (
              <a
                href="/blog"
                style={{ marginLeft: '8px', color: '#818cf8', textDecoration: 'underline' }}
              >
                Subscribe for more →
              </a>
            )}
          </span>
          <button
            onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px', flexShrink: 0 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Analysis time badge */}
      {analysisTime && !error && (
        <div style={{
          background: 'rgba(34,197,94,0.08)',
          borderBottom: '1px solid rgba(34,197,94,0.15)',
          padding: '5px 16px',
          fontSize: '12px',
          color: '#22c55e',
          flexShrink: 0,
        }}>
          Analysis complete in {(analysisTime / 1000).toFixed(1)}s
        </div>
      )}

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {/* Top pane: editor + ARM JSON */}
        <div style={{
          flex: '0 0 55%',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden',
          borderBottom: '1px solid var(--neutral-border-medium)',
          minHeight: 0,
        }}>
          {/* Left: Bicep editor */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRight: isMobile ? 'none' : '1px solid var(--neutral-border-medium)',
            minWidth: 0,
            minHeight: isMobile ? '300px' : 0,
          }}>
            <div style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--neutral-on-background-weak)',
              background: 'var(--neutral-background-medium)',
              borderBottom: '1px solid var(--neutral-border-medium)',
              flexShrink: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Bicep Input
            </div>
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
              <BicepEditor value={bicepCode} onChange={setBicepCode} />
            </div>
          </div>

          {/* Right: ARM JSON viewer */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
            minHeight: isMobile ? '300px' : 0,
          }}>
            <div style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--neutral-on-background-weak)',
              background: 'var(--neutral-background-medium)',
              borderBottom: '1px solid var(--neutral-border-medium)',
              flexShrink: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              ARM JSON Output
            </div>
            <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
              <ArmJsonViewer armJson={armJson} />
            </div>
          </div>
        </div>

        {/* Bottom pane: compliance panel */}
        <div style={{ flex: '0 0 45%', overflow: 'hidden', minHeight: 0 }}>
          <CompliancePanel analysis={analysis as Parameters<typeof CompliancePanel>[0]['analysis']} />
        </div>
      </div>
    </div>
  );
}
