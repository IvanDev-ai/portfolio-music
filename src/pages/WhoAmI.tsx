import { useNavigate } from 'react-router-dom'

export default function WhoAmI({ theme = 'light' }: { theme?: 'dark' | 'light' }) {
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 768

  const isLight = theme === 'light'
  const BG = isLight ? '#ffffff' : '#0a0a0a'
  const TEXT = isLight ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.85)'
  const DIM = isLight ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.38)'
  const BOLD = isLight ? '#000000' : '#ffffff'

  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh', background: BG,
        fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        paddingTop: '48px', color: TEXT,
      }}>

        {/* IMAGEN ARRIBA */}
        <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img
            src="/assets/img/whoami.jpg"
            alt="Hills-McKay"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: isLight ? 'none' : 'brightness(0.85)' }}
          />
        </div>

        {/* CONTENIDO */}
        <div style={{ padding: '40px 24px 80px' }}>

          {/* BIO */}
          <p style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.6, color: BOLD, marginBottom: '16px' }}>
            Hills-McKay is an independent music producer and sound designer based in Spain, operating at the intersection of high-fidelity music production and audiovisual storytelling.
          </p>
          <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.75, color: DIM, marginBottom: '8px' }}>
            Originally pursuing a degree in Robotics Engineering, a shift happened three years ago — music production became the only thing that felt necessary. That clarity has shaped everything since.
          </p>
          <p style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.75, color: DIM, marginBottom: '40px' }}>
            Working across Dark Pop, Alt RnB, Orchestral and cinematic scoring, Hills-McKay produces for artists who need something that doesn't sound like everything else, and for directors who understand that music is architecture, not decoration.
          </p>

          {/* CONTACT */}
          <div style={{ marginBottom: '40px' }}>
            <a href="mailto:contact@hillsmckay.com" style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: BOLD, marginBottom: '6px' }}>
              contact@hillsmckay.com
            </a>
            <span style={{ fontSize: '13px', color: DIM }}>@hillsmckay</span>
          </div>

          {/* SERVICES */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: DIM, marginBottom: '16px' }}>SERVICES</div>
            {['Beats & Licensing', 'Sync Licensing', 'Custom Scoring', 'Artist Collaboration'].map((s, i, arr) => (
              <div key={s} style={{
                fontSize: '13px', color: TEXT, padding: '12px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}` : 'none',
              }}>
                {s}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/contacto')}
            style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #c8002a, #8b0000)',
              color: '#fff', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.12em', borderRadius: '4px',
              boxShadow: '0 4px 20px rgba(200,0,42,0.3)',
            }}
          >
            GET IN TOUCH →
          </button>
        </div>
      </div>
    )
  }

  // ── DESKTOP ──────────────────────────────────────────────
  return (
    <div style={{
      height: '100vh', background: BG,
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      paddingTop: '44px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      overflow: 'hidden',
    }}>

      {/* COLUMNA IZQUIERDA — texto */}
      <div style={{
        padding: '64px 72px',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
      }}>

        {/* BIO */}
        <div>
          <p style={{
            fontSize: '15px', fontWeight: 700,
            lineHeight: 1.7, color: BOLD,
            marginBottom: '24px',
            maxWidth: '480px',
          }}>
            Hills-McKay is an independent music producer and sound designer based in Spain, operating at the intersection of high-fidelity music production and audiovisual storytelling.
          </p>
          <p style={{
            fontSize: '13px', fontWeight: 300,
            lineHeight: 1.85, color: DIM,
            marginBottom: '16px', maxWidth: '480px',
          }}>
            Originally pursuing a degree in Robotics Engineering, a shift happened three years ago — music production became the only thing that felt necessary. That clarity has shaped everything since.
          </p>
          <p style={{
            fontSize: '13px', fontWeight: 300,
            lineHeight: 1.85, color: DIM,
            maxWidth: '480px',
          }}>
            Working across Dark Pop, Alt RnB, Orchestral and cinematic scoring, Hills-McKay produces for artists who need something that doesn't sound like everything else, and for directors who understand that music is architecture, not decoration.
          </p>
        </div>

        {/* MIDDLE — info columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', margin: '48px 0' }}>

          {/* LEFT INFO */}
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: DIM, marginBottom: '16px' }}>
              · CONTACT
            </div>
            <a href="mailto:contact@hillsmckay.com" style={{
              display: 'block', fontSize: '13px',
              fontWeight: 700, color: BOLD, marginBottom: '6px',
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              contact@hillsmckay.com
            </a>
            <span style={{ fontSize: '12px', color: DIM }}>@hillsmckay</span>
          </div>

          {/* RIGHT INFO — services */}
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: DIM, marginBottom: '16px' }}>
              · SERVICES
            </div>
            {['Beats & Licensing', 'Sync Licensing', 'Custom Scoring', 'Artist Collaboration'].map(s => (
              <div key={s} style={{ fontSize: '12px', color: DIM, marginBottom: '6px', lineHeight: 1.5 }}>
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM — copyright */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '24px',
          borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}`,
        }}>
          <span style={{ fontSize: '10px', color: DIM, letterSpacing: '0.06em' }}>
            © 2024 HILLS-McKAY
          </span>
          <button
            onClick={() => navigate('/contacto')}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #c8002a, #8b0000)',
              color: '#fff', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.12em', borderRadius: '3px',
              boxShadow: '0 2px 12px rgba(200,0,42,0.3)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.03)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,0,42,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(200,0,42,0.3)'
            }}
          >
            GET IN TOUCH →
          </button>
        </div>
      </div>

      {/* COLUMNA DERECHA — imagen */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}>
        <img
          src="/assets/img/whoami.jpg"
          alt="Hills-McKay"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            filter: isLight ? 'none' : 'brightness(0.8)',
          }}
        />
      </div>

    </div>
  )
}