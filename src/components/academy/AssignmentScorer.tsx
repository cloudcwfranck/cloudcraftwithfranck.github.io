'use client'
import { useState } from 'react'

export default function AssignmentScorer({ track, assignment }: { track: any; assignment: any }) {
  const [submission, setSubmission] = useState(assignment.placeholder || '')
  const [scoring, setScoring] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleScore() {
    setScoring(true)
    setError(null)
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackName: track.name,
          assignmentTitle: assignment.title,
          rubric: assignment.rubric,
          submission,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scoring failed')
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setScoring(false)
    }
  }

  const scoreColor = (s: number) => s >= 85 ? '#00FF87' : s >= 60 ? '#FFD700' : s >= 40 ? '#FF6B00' : '#FF3B3B'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <a href={`/academy/${track.id}`} style={{ fontFamily: 'monospace', fontSize: '12px', color: '#5a6a8a', textDecoration: 'none' }}>← Back to {track.name}</a>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Left — brief */}
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a5a8a', marginBottom: '8px' }}>{assignment.level} · {assignment.lang.toUpperCase()} · {assignment.xp} XP</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{assignment.title}</h1>
          <p style={{ color: '#6a7a9a', fontSize: '13px', lineHeight: 1.7, marginBottom: '24px' }}>{assignment.description}</p>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3a5a8a', marginBottom: '12px', letterSpacing: '1px' }}>RUBRIC CRITERIA</div>
          {assignment.rubric.map((r: string, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: track.accent, fontFamily: 'monospace', fontSize: '11px', flexShrink: 0, marginTop: '1px' }}>{'0' + (i + 1)}</span>
              <span style={{ fontSize: '13px', color: '#8a9abb' }}>{r}</span>
            </div>
          ))}
        </div>

        {/* Right — editor + result */}
        <div>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3a5a8a', marginBottom: '8px', letterSpacing: '1px' }}>YOUR SUBMISSION</div>
          <textarea
            value={submission}
            onChange={e => setSubmission(e.target.value)}
            style={{ width: '100%', minHeight: '260px', background: '#060c1a', border: '1px solid #1a2a4a', borderRadius: '8px', padding: '14px', color: '#8af0c8', fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.7, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button onClick={handleScore} disabled={scoring || !submission.trim()}
              style={{ flex: 1, padding: '12px', background: scoring ? '#1a2a4a' : `linear-gradient(135deg, ${track.color}, ${track.color}88)`, border: `1px solid ${track.color}`, borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, cursor: scoring ? 'not-allowed' : 'pointer', letterSpacing: '1px' }}>
              {scoring ? '⟳ SCORING...' : '▶ SUBMIT FOR SCORING'}
            </button>
            <button onClick={() => { setSubmission(assignment.placeholder || ''); setResult(null) }}
              style={{ padding: '12px 16px', background: 'transparent', border: '1px solid #1a2a4a', borderRadius: '8px', color: '#5a6a8a', fontFamily: 'monospace', fontSize: '12px', cursor: 'pointer' }}>
              RESET
            </button>
          </div>

          {error && <div style={{ marginTop: '12px', padding: '12px', background: '#1a0808', border: '1px solid #4a1a1a', borderRadius: '8px', color: '#FF6B6B', fontFamily: 'monospace', fontSize: '12px' }}>{error}</div>}

          {result && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Score */}
              <div style={{ background: '#0d1526', border: '1px solid #1a2a4a', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'monospace', color: scoreColor(result.overallScore), lineHeight: 1 }}>{result.grade}</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'monospace', color: scoreColor(result.overallScore) }}>{result.overallScore}</div>
                  <div style={{ fontSize: '10px', color: '#3a5a8a', fontFamily: 'monospace' }}>/ 100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: '#6a8aba', lineHeight: 1.6, margin: 0 }}>{result.recommendation}</p>
                  {result.certReady && <div style={{ marginTop: '8px', display: 'inline-block', background: '#00FF8711', border: '1px solid #00FF8733', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontFamily: 'monospace', color: '#00FF87' }}>🏆 CERT READY</div>}
                </div>
              </div>

              {/* Rubric bars */}
              <div style={{ background: '#0d1526', border: '1px solid #1a2a4a', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3a5a8a', marginBottom: '12px', letterSpacing: '1px' }}>RUBRIC BREAKDOWN</div>
                {result.rubricScores?.map((r: any, i: number) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11px', color: '#6a7a9a', fontFamily: 'monospace' }}>{r.criterion}</span>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: scoreColor(r.score) }}>{r.score}</span>
                    </div>
                    <div style={{ height: '3px', background: '#1a2a4a', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${r.score}%`, background: scoreColor(r.score), borderRadius: '2px', transition: 'width 0.8s ease' }} />
                    </div>
                    {r.note && <div style={{ fontSize: '10px', color: '#4a6a8a', fontFamily: 'monospace', marginTop: '2px' }}>↳ {r.note}</div>}
                  </div>
                ))}
              </div>

              {/* Strengths + Gaps */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#0a1e14', border: '1px solid #00FF8722', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00FF87', marginBottom: '8px' }}>✓ STRENGTHS</div>
                  {result.strengths?.map((s: string, i: number) => <div key={i} style={{ fontSize: '11px', color: '#5a8a6a', fontFamily: 'monospace', marginBottom: '4px' }}>→ {s}</div>)}
                </div>
                <div style={{ background: '#1a100a', border: '1px solid #FF6B0022', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#FF6B00', marginBottom: '8px' }}>⚠ GAPS</div>
                  {result.gaps?.map((g: string, i: number) => <div key={i} style={{ fontSize: '11px', color: '#8a5a3a', fontFamily: 'monospace', marginBottom: '4px' }}>→ {g}</div>)}
                </div>
              </div>

              {result.securityFindings?.length > 0 && (
                <div style={{ background: '#1a0808', border: '1px solid #FF3B3B44', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#FF3B3B', marginBottom: '8px' }}>🔴 SECURITY FINDINGS</div>
                  {result.securityFindings.map((f: string, i: number) => <div key={i} style={{ fontSize: '11px', color: '#aa4a4a', fontFamily: 'monospace', marginBottom: '4px' }}>⚑ {f}</div>)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
