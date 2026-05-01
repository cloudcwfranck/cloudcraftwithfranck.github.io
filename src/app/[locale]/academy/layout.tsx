export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080d1a',
      color: '#c8d8f0',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <nav style={{
        borderBottom: '1px solid #1a2a4a',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#080d1acc',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '15px', letterSpacing: '1px' }}>
            ☁ CloudCraft<span style={{ color: '#00FF87' }}>WithFranck</span>
          </a>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['/', '/about', '/work', '/blog'].map((href, i) => (
              <a key={href} href={href} style={{ color: '#5a6a8a', textDecoration: 'none', fontSize: '13px' }}>
                {['Home','About','Work','Blog'][i]}
              </a>
            ))}
            <a href="/academy" style={{ color: '#00FF87', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
              Academy
            </a>
          </div>
        </div>
      </nav>
      {children}
      <footer style={{ borderTop: '1px solid #1a2a4a', padding: '24px', textAlign: 'center', color: '#3a5a8a', fontSize: '12px', fontFamily: 'monospace' }}>
        © 2026 / Franck Kengne / CloudCraftWithFranck
      </footer>
    </div>
  )
}
