import { TRACKS } from '@/lib/academy/tracks'
import Link from 'next/link'

export default function AcademyPage() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '16px' }}>
          CloudCert Academy
        </h1>
        <p style={{ fontSize: '18px', color: '#6a7a9a', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          AI-scored labs for Azure, FedRAMP, AKS, DevSecOps & SecOps —
          evaluated against NIST 800-53, CIS Benchmarks, and DoD STIGs.
        </p>
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#5a6a8a', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
        Learning Tracks
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {TRACKS.map(track => (
          <div key={track.id} style={{ background: '#0d1526', border: `1px solid ${track.color}33`, borderRadius: '12px', padding: '24px', borderTop: `3px solid ${track.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>{track.icon}</span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{track.name}</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#6a7a9a', marginBottom: '16px', lineHeight: 1.6 }}>{track.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#5a6a8a', fontFamily: 'monospace' }}>{track.assignments.length} assignment{track.assignments.length !== 1 ? 's' : ''}</span>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: track.accent }}>Up to {Math.max(...track.assignments.map(a => a.xp))} XP</span>
            </div>
            <Link href={`/academy/${track.id}`} style={{ display: 'inline-block', padding: '8px 20px', border: `1px solid ${track.color}66`, borderRadius: '6px', fontSize: '13px', color: '#c8d8f0', textDecoration: 'none', fontFamily: 'monospace' }}>
              Start Track →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
