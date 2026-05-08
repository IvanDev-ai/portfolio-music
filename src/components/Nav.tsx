import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'MAIN', path: '/' },
  { label: 'SCENES', path: '/cine' },
  { label: 'BEATS', path: '/beats' },
  { label: 'CONTACT', path: '/contacto' },
  { label: 'WHO AM I', path: '/whoami' },
]

interface NavProps {
  onMuteToggle: () => void
  muted: boolean
  paused: boolean
  onPauseToggle: () => void
  volume: number
  onVolumeChange: (v: number) => void
  isMobile: boolean
  theme: 'dark' | 'light'
  onThemeToggle: () => void
}

export default function Nav({
  onMuteToggle, muted, paused, onPauseToggle,
  volume, onVolumeChange, isMobile, theme, onThemeToggle
}: NavProps) {
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const hideThemeToggle = location.pathname === '/' || location.pathname.match(/^\/beats\/\d+$/) || location.pathname.match(/^\/cine\/\d+$/)
  const isMain = location.pathname === '/'
  const isLight = theme === 'light'
  const menuTextColor = isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)'
  const menuDimColor = isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)'
  const isBeatDetail = location.pathname.match(/^\/beats\/\d+$/)
  const activePath = isBeatDetail ? '/beats' : location.pathname
  const isSceneDetail = !!location.pathname.match(/^\/cine\/\d+$/)


  const textColor = isMain || isSceneDetail
  ? 'rgba(255,255,255,0.75)'
  : isBeatDetail ? 'rgb(255, 255, 255)'  
  : isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)'
  const dimColor = isMain
    ? 'rgba(255,255,255,0.45)'
    : isBeatDetail ? 'rgb(167, 167, 167)' 
    : isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)'
  const pillBg = isMain
    ? 'rgba(255,255,255,0.08)'
    : isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
  const pillBorder = isMain
    ? 'rgba(255,255,255,0.1)'
    : isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'
  const navBg = isMain || isSceneDetail
    ? 'transparent'
    : isLight ? '#ffffff' : '#141414'

  const reset = useCallback(() => {
    setVisible(true)
    if (timer.current) clearTimeout(timer.current)
    if (isMain) timer.current = setTimeout(() => setVisible(false), 2000)
  }, [isMain])

  useEffect(() => {
    setVisible(true)
    if (timer.current) clearTimeout(timer.current)
    if (isMain) timer.current = setTimeout(() => setVisible(false), 2000)
  }, [isMain])

  useEffect(() => {
    if (!isMain) return
    reset()
    window.addEventListener('mousemove', reset)
    window.addEventListener('click', reset)
    return () => {
      window.removeEventListener('mousemove', reset)
      window.removeEventListener('click', reset)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [reset, isMain])

  const ThemeToggle = () => (
    <button
      onClick={() => {
        console.log('toggle clicked, theme before:', theme)
        onThemeToggle()
      }}
      title={isLight ? 'Dark mode' : 'Light mode'}
      style={{
        padding: '2px 8px',
        display: 'flex', alignItems: 'center',
        flexShrink: 0,
      }}
    >
      <span style={{
        width: '28px', height: '16px',
        background: isLight ? '#0a0a0a' : 'rgba(255,255,255,0.25)',
        borderRadius: '8px', position: 'relative',
        transition: 'background 0.3s',
        display: 'inline-block', flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute', top: '3px',
          left: isLight ? '15px' : '3px',
          width: '10px', height: '10px',
          borderRadius: '50%', background: '#fff',
          transition: 'left 0.3s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </span>
    </button>
  )

  // ── MOBILE ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <nav style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 200,
          background: isMain ? 'transparent' : navBg,
          backdropFilter: isMain ? 'none' : 'blur(12px)',
        }}>
          <span onClick={() => navigate('/')} style={{
            fontWeight: 500, fontSize: '12px',
            letterSpacing: '0.02em', color: textColor, cursor: 'pointer',
          }}>
            HILLS-MCKAY
          </span>

          {/* MENU BUTTON — derecha */}
          <button onClick={() => setMenuOpen(o => !o)} style={{
            display: 'flex', flexDirection: 'column',
            gap: '5px', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: '18px', height: '1px',
                background: textColor , transition: 'all 0.3s',
                transform: menuOpen
                  ? i === 0 ? 'translateY(6px) rotate(45deg)'
                  : i === 2 ? 'translateY(-6px) rotate(-45deg)' : 'none'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </nav>

        <div style={{
          position: 'fixed', inset: 0, zIndex: 150,
          background: isLight ? 'rgba(255,255,255,0.96)' : 'rgba(0,0,0,0.92)',
          backdropFilter: menuOpen ? 'blur(20px)' : 'none',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          padding: '60px 32px',
        }}>

          {NAV_LINKS.map((link, i) => (
            <button key={link.label}
              onClick={() => { navigate(link.path); setMenuOpen(false) }}
              style={{
                fontSize: '36px', fontWeight: 400,
                letterSpacing: '-0.01em',
                color: location.pathname === link.path ? menuTextColor  : menuDimColor,
                padding: '14px 0', width: '100%', textAlign: 'left',
                transition: 'color 0.2s',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              {link.label}
            </button>
          ))}
          {!hideThemeToggle && (
            <>
              <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThemeToggle />
                <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: menuDimColor }}>
                  {isLight ? 'LIGHT MODE' : 'DARK MODE'}
                </span>
              </div>
            </>
          )}

          <div style={{
            position: 'absolute', bottom: '32px', left: '32px',
            fontSize: '10px', letterSpacing: '0.15em', color: menuDimColor,
          }}>
            SOUND ARCHITECTURE · MMXXIV
          </div>
        </div>
      </>
    )
  }

  // ── DESKTOP ──────────────────────────────────────────────
  // En main: grid 1fr auto 1fr (pill centrado)
  // En otras: grid auto 1fr auto (logo+pill izq, frase centro, controles der)
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: '44px',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      padding: '0 20px',
      gap: '20px',
      zIndex: 100,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease',
      pointerEvents: visible ? 'auto' : 'none',
      background: navBg,
      backdropFilter: isMain ? 'none' : 'blur(12px)'
    }}>

      {/* COL 1 — NOMBRE siempre izquierda */}
<span onClick={() => navigate('/')} style={{
  fontWeight: 600, fontSize: '16px',
  letterSpacing: '0.02em', color: textColor, cursor: 'pointer',
  flexShrink: 0,
}}>
  HILLS-MCKAY
</span>

{/* COL 2 — CENTRO en main: pill. En otras: frase centrada */}
<div style={{
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}>
  {isMain ? (
    // Main: pill centrado
    <div style={{
      display: 'flex', gap: '2px', alignItems: 'center',
      background: pillBg,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '6px 10px',
      border: `1px solid ${pillBorder}`,
    }}>
      {NAV_LINKS.map(link => (
        <button key={link.label} onClick={() => navigate(link.path)} style={{
          fontSize: '11px', letterSpacing: '0.08em',
          color: location.pathname === link.path ? textColor : dimColor,
          padding: '2px 8px', transition: 'color 0.2s'
        }}
          onMouseEnter={e => (e.currentTarget.style.color = textColor)}
          onMouseLeave={e => {
            e.currentTarget.style.color = location.pathname === link.path ? textColor : dimColor
          }}
        >
          {link.label}
        </button>
      ))}
      {!hideThemeToggle && (
        <>
          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />
          <ThemeToggle />
        </>
      )}
    </div>
  ) : (
    // Otras: frase centrada
    <span style={{
      fontSize: '12px', color: textColor,
      letterSpacing: '0.001em', fontWeight: 800,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      textAlign: 'center',
    }}>
      AUDIOVISUAL DESIGNER; CINEMATIC EXPERIENCES AND HIGH-FIDELITY SOUND
    </span>
  )}
</div>

{/* COL 3 — DERECHA: controles en main, pill en otras */}
<div style={{
  display: 'flex', gap: '14px',
  alignItems: 'center', justifyContent: 'flex-end',
}}>
  {isMain ? (
    <>
      <input
        type="range" min={0} max={1} step={0.01}
        value={muted ? 0 : volume}
        onChange={e => onVolumeChange(parseFloat(e.target.value))}
        style={{ width: '64px', accentColor: 'rgba(255,255,255,0.8)', opacity: 0.6 }}
      />
      <button onClick={onPauseToggle}
        style={{ fontSize: '11px', color: dimColor, letterSpacing: '0.08em' }}
        onMouseEnter={e => (e.currentTarget.style.color = textColor)}
        onMouseLeave={e => (e.currentTarget.style.color = dimColor)}
      >
        {paused ? '▶' : '⏸'}
      </button>
      <button onClick={onMuteToggle}
        style={{ fontSize: '11px', color: dimColor, letterSpacing: '0.08em' }}
        onMouseEnter={e => (e.currentTarget.style.color = textColor)}
        onMouseLeave={e => (e.currentTarget.style.color = dimColor)}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </>
  ) : (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0',
      }}>
        {NAV_LINKS.map((link, i) => (
          <div key={link.label} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <span style={{
                width: '4px', height: '4px',
                background: activePath === link.path ? textColor : dimColor,
                display: 'inline-block',
                margin: '0 10px',
                flexShrink: 0,
              }} />
            )}
            <button onClick={() => navigate(link.path)} style={{
              fontSize: '11px', letterSpacing: '0.08em',
              color: activePath === link.path ? textColor : dimColor,
              padding: '2px 0',
              transition: 'color 0.2s',
              fontWeight: location.pathname === link.path ? 500 : 300,
              borderBottom: location.pathname === link.path
                ? `1px solid ${isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)'}`
                : '1px solid transparent',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = textColor)}
              onMouseLeave={e => {
                e.currentTarget.style.color = activePath === link.path ? textColor : dimColor
              }}
            >
              {link.label}
            </button>
          </div>
        ))}
        {!hideThemeToggle && (
          <span style={{
            width: '1px', height: '14px',
            background: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)',
            margin: '0 8px 0 12px',
          }} />
        )}
        {!hideThemeToggle && <ThemeToggle />}
      </div>
    )}
</div>

    </nav>
  )
}