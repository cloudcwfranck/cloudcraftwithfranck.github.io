import { TRACKS, getTrack } from '@/lib/academy/tracks'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return TRACKS.map(t => ({ trackId: t.id }))
}

export default function TrackPage({ params }: { params: { trackId: string } }) {
  const track = getTrack(params.trackId)
  if (!track) notFound()

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/academy" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#5a6a8a', textDecoration: 'none' }}>← Back to Academy</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0 8px' }}>
        <span style={{ fontSize: '32px' }}>{track.icon}</span>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0 }}>{track.name}</h1>
      </div>
      <p style={{ color: '#6a7a9a', marginBottom: '40px', fontSize: '14px' }}>{track.description}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {track.assignments.map(a => (
          <div key={a.id} style={{ background: '#0d1526', border: '1px solid #1a2a4a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a5a8a', marginBottom: '8px' }}>
                  {a.level} · {a.lang.toUpperCase()}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px' }}>{a.title}</h3>
                <p style={{ color: '#6a7a9a', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>{a.description}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#FFD700', fontFamily: 'monospace' }}>{a.xp}</div>
                <div style={{ fontSize: '10px', color: '#3a5a8a', fontFamily: 'monospace' }}>MAX XP</div>
              </div>
            </div>
            <Link href={`/academy/${track.id}/${a.id}`} style={{ display: 'inline-block', marginTop: '16px', padding: '8px 20px', border: `1px solid ${track.color}66`, borderRadius: '6px', fontFamily: 'monospace', fontSize: '12px', color: '#c8d8f0', textDecoration: 'none' }}>
              Start Assignment →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
