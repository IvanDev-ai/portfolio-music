import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Contacto({ theme = 'light' }: { theme?: 'dark' | 'light' }) {
  const navigate = useNavigate()
  const isMobile = window.innerWidth < 768

  const isLight = theme === 'light'
  const BG = isLight ? '#ffffff' : '#0a0a0a'
  const TEXT = isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.88)'
  const DIM = isLight ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.38)'
  const BOLD = isLight ? '#000000' : '#ffffff'
  const BORDER = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
  const INPUT_BG = isLight ? 'transparent' : 'transparent'

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    project: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const roles = [
    'Artist',
    'Film Director',
    'Music Supervisor',
    'Brand / Agency',
    'Independent Creator',
    'Label',
    'Other',
  ]

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return
    // Aquí conectarás tu backend/formspree/emailjs
    setSent(true)
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%',
    background: INPUT_BG,
    border: 'none',
    borderBottom: `1px solid ${focused === name ? BOLD : BORDER}`,
    color: TEXT,
    fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '14px',
    fontWeight: 300,
    padding: '10px 0',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  })

  const labelStyle: React.CSSProperties = {
    fontSize: '9px',
    letterSpacing: '0.18em',
    color: DIM,
    display: 'block',
    marginBottom: '6px',
  }

  if (sent) {
    return (
      <div style={{
        minHeight: '100vh', background: BG,
        fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        paddingTop: '44px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.2em', color: DIM, marginBottom: '20px' }}>
            MESSAGE SENT
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: TEXT, letterSpacing: '-0.02em', marginBottom: '16px' }}>
            I'll get back to you<br />within 48 hours.
          </div>
          <div style={{ fontSize: '13px', color: DIM, marginBottom: '40px' }}>
            In the meantime, explore the work.
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/beats')} style={{
              padding: '10px 24px', border: `1px solid ${BORDER}`,
              color: TEXT, fontSize: '11px', letterSpacing: '0.1em',
              background: 'transparent', borderRadius: '3px', cursor: 'pointer',
            }}>
              BEATS
            </button>
            <button onClick={() => navigate('/cine')} style={{
              padding: '10px 24px', border: `1px solid ${BORDER}`,
              color: TEXT, fontSize: '11px', letterSpacing: '0.1em',
              background: 'transparent', borderRadius: '3px', cursor: 'pointer',
            }}>
              CINE
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── MOBILE ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh', background: BG,
        fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        paddingTop: '48px', color: TEXT,
      }}>
        <div style={{ padding: '40px 24px 80px' }}>

          {/* HEADER */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: DIM, marginBottom: '12px' }}>
              CONTACT
            </div>
            <h1 style={{
              fontSize: '32px', fontWeight: 700,
              letterSpacing: '-0.02em', lineHeight: 1.1,
              color: BOLD, marginBottom: '16px',
            }}>
              Tell me what you're building.
            </h1>
            <p style={{ fontSize: '13px', color: DIM, lineHeight: 1.7, fontWeight: 300 }}>
              I don't do elevator pitches. If you have a project and need sound that serves it — let's talk.
            </p>
          </div>

          {/* FORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '32px' }}>
            <div>
              <label style={labelStyle}>YOUR NAME</label>
              <input
                type="text"
                placeholder="Abel Tesfaye"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                style={inputStyle('name')}
              />
            </div>

            <div>
              <label style={labelStyle}>EMAIL</label>
              <input
                type="email"
                placeholder="you@studio.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                style={inputStyle('email')}
              />
            </div>

            <div>
              <label style={labelStyle}>YOU ARE A...</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                onFocus={() => setFocused('role')}
                onBlur={() => setFocused(null)}
                style={{
                  ...inputStyle('role'),
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="" disabled style={{ background: BG }}>Select one</option>
                {roles.map(r => (
                  <option key={r} value={r} style={{ background: BG }}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>PROJECT</label>
              <input
                type="text"
                placeholder="Short film, album, campaign..."
                value={form.project}
                onChange={e => setForm({ ...form, project: e.target.value })}
                onFocus={() => setFocused('project')}
                onBlur={() => setFocused(null)}
                style={inputStyle('project')}
              />
            </div>

            <div>
              <label style={labelStyle}>MESSAGE</label>
              <textarea
                placeholder="What do you need? The more context, the better."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={5}
                style={{
                  ...inputStyle('message'),
                  resize: 'none',
                  lineHeight: 1.7,
                }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%', padding: '16px',
              background: form.name && form.email && form.message
                ? 'linear-gradient(135deg, #c8002a, #8b0000)'
                : isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
              color: form.name && form.email && form.message ? '#fff' : DIM,
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.12em', borderRadius: '4px',
              transition: 'all 0.2s',
              cursor: form.name && form.email && form.message ? 'pointer' : 'default',
              boxShadow: form.name && form.email && form.message
                ? '0 4px 20px rgba(200,0,42,0.3)' : 'none',
            }}
          >
            SEND IT →
          </button>

          {/* DIRECT CONTACT */}
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', color: DIM, marginBottom: '16px' }}>
              OR REACH DIRECTLY
            </div>
            <a href="mailto:hillsmckay.contact@gmail.com" style={{
              display: 'block', fontSize: '14px', fontWeight: 600,
              color: BOLD, marginBottom: '6px', textDecoration: 'none',
            }}>
              hillsmckay.contact@gmail.com
            </a>
            <span style={{ fontSize: '12px', color: DIM }}>Response within 48h.</span>
          </div>
        </div>
      </div>
    )
  }

  // ── DESKTOP ──────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: BG,
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      paddingTop: '44px', color: TEXT,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 44px)',
      }}>

        {/* IZQUIERDA — info */}
        <div style={{
          padding: '80px 72px',
          borderRight: `1px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '9px', letterSpacing: '0.22em', color: DIM, marginBottom: '20px' }}>
              CONTACT
            </div>
            <h1 style={{
              fontSize: '48px', fontWeight: 700,
              letterSpacing: '-0.03em', lineHeight: 1.05,
              color: BOLD, marginBottom: '32px',
            }}>
              Tell me what<br />you're building.
            </h1>
            <p style={{
              fontSize: '14px', fontWeight: 300,
              lineHeight: 1.85, color: DIM,
              maxWidth: '380px', marginBottom: '48px',
            }}>
              I don't do elevator pitches. If you have a project
              and need sound that serves it — not decorates it —
              let's talk. The more context you give me, the better
              I can help.
            </p>

            {/* DIRECT */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ fontSize: '9px', letterSpacing: '0.18em', color: DIM, marginBottom: '12px' }}>
                DIRECT
              </div>
              <a href="mailto:hillsmckay.contact@gmail.com" style={{
                display: 'block', fontSize: '16px', fontWeight: 600,
                color: BOLD, marginBottom: '6px', textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                hillsmckay.contact@gmail.com
              </a>
              <span style={{ fontSize: '12px', color: DIM }}>Response within 48h. I read everything.</span>
            </div>

            {/* RESPONSE TIME */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px',
            }}>
              {[
                { label: 'FOR BEATS', value: 'Beatstars → hillsmckay' },
                { label: 'FOR SYNC', value: 'Direct email preferred' },
                { label: 'FOR SESSIONS', value: 'Available remotely' },
                { label: 'SOCIAL', value: '@hillsmckay' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.14em', color: DIM, marginBottom: '4px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '12px', color: TEXT, fontWeight: 400 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '10px', color: DIM, letterSpacing: '0.06em' }}>
            © 2026 HILLS-McKAY · SOUND ARCHITECTURE
          </div>
        </div>

        {/* DERECHA — form */}
        <div style={{
          padding: '80px 72px',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* ROW 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label style={labelStyle}>YOUR NAME</label>
                <input
                  type="text"
                  placeholder="Abel Tesfaye"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('name')}
                />
              </div>
              <div>
                <label style={labelStyle}>EMAIL</label>
                <input
                  type="email"
                  placeholder="you@studio.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('email')}
                />
              </div>
            </div>

            {/* ROW 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <label style={labelStyle}>YOU ARE A...</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  onFocus={() => setFocused('role')}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...inputStyle('role'),
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                >
                  <option value="" disabled style={{ background: BG }}>Select one</option>
                  {roles.map(r => (
                    <option key={r} value={r} style={{ background: BG }}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>PROJECT</label>
                <input
                  type="text"
                  placeholder="Short film, album, campaign..."
                  value={form.project}
                  onChange={e => setForm({ ...form, project: e.target.value })}
                  onFocus={() => setFocused('project')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('project')}
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label style={labelStyle}>MESSAGE</label>
              <textarea
                placeholder="What do you need? The more context, the better."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                onFocus={() => setFocused('message')}
                onBlur={() => setFocused(null)}
                rows={6}
                style={{
                  ...inputStyle('message'),
                  resize: 'none',
                  lineHeight: 1.7,
                }}
              />
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              style={{
                width: '100%', padding: '14px',
                background: form.name && form.email && form.message
                  ? 'linear-gradient(135deg, #c8002a, #8b0000)'
                  : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
                color: form.name && form.email && form.message ? '#fff' : DIM,
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.12em', borderRadius: '3px',
                transition: 'all 0.2s',
                cursor: form.name && form.email && form.message ? 'pointer' : 'default',
                boxShadow: form.name && form.email && form.message
                  ? '0 4px 20px rgba(200,0,42,0.3)' : 'none',
              }}
              onMouseEnter={e => {
                if (form.name && form.email && form.message) {
                  e.currentTarget.style.transform = 'scale(1.01)'
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,0,42,0.5)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = form.name && form.email && form.message
                  ? '0 4px 20px rgba(200,0,42,0.3)' : 'none'
              }}
            >
              SEND IT →
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}