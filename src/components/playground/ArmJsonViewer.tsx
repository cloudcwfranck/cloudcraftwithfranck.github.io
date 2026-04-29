'use client';

import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ArmJsonViewerProps {
  armJson: string | null;
}

export function ArmJsonViewer({ armJson }: ArmJsonViewerProps) {
  if (!armJson) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1e1e1e',
        color: '#6b7280',
        gap: '12px',
      }}>
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} opacity={0.4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span style={{ fontSize: '13px', fontFamily: 'monospace', opacity: 0.6 }}>
          Run analysis to generate ARM JSON →
        </span>
      </div>
    );
  }

  // Pretty-print the JSON
  let displayJson = armJson;
  try {
    const parsed = typeof armJson === 'string' ? JSON.parse(armJson) : armJson;
    displayJson = JSON.stringify(parsed, null, 2);
  } catch {
    // already a string
  }

  return (
    <MonacoEditor
      height="100%"
      language="json"
      theme="vs-dark"
      value={displayJson}
      options={{
        readOnly: true,
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 12 },
        scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
        overviewRulerLanes: 0,
      }}
    />
  );
}
