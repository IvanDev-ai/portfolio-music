import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { SCENES, SCENE_CATEGORIES, SCENE_MOODS, SIDEBAR_ITEMS } from '../data/scenes'
import { useDragScroll } from '../hooks/useDragScroll'
const FEATURED = SCENES.filter(s => s.featured)

export default function Cine({ theme = 'light' }: { theme?: 'dark' | 'light' }) {
  const navigate = useNavigate()
  const isLight = theme === 'light'
  const BG = isLight ? '#ffffff' : '#0a0a0a'
  const TEXT = isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.88)'
  const DIM = isLight ? 'rgba(10, 10, 10, 0.75)' : 'rgba(255,255,255,0.38)'
  const BORDER = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const SURFACE = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'

  const [current, setCurrent] = useState(0)
  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hudVisible, setHudVisible] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeFilter, setActiveFilter] = useState<{ group: string, label: string }>({ group: 'LIBRARY', label: 'All' })
  const videoRef = useRef<HTMLVideoElement>(null!)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const isMobile = window.innerWidth < 768

  const scene = FEATURED[current]

  const resetTimer = useCallback(() => {
    setHudVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setHudVisible(false), 4000)
  }, [])

  useEffect(() => {
    resetTimer()
    window.addEventListener('mousemove', resetTimer)
    return () => {
      window.removeEventListener('mousemove', resetTimer)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [resetTimer])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const update = () => {
      if (video.duration) setProgress(video.currentTime / video.duration)
    }
    video.addEventListener('timeupdate', update)
    video.load()
    video.play().catch(() => {})
    return () => video.removeEventListener('timeupdate', update)
  }, [current])

  useEffect(() => {
    if (!videoRef.current) return
    paused ? videoRef.current.pause() : videoRef.current.play().catch(() => {})
  }, [paused])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current
    const video = videoRef.current
    if (!bar || !video) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    video.currentTime = ratio * video.duration
  }

  const goTo = (i: number) => { setCurrent(i); setProgress(0) }

  const hud: React.CSSProperties = {
    opacity: hudVisible ? 1 : 0,
    transition: 'opacity 0.5s ease',
    pointerEvents: hudVisible ? 'auto' : 'none',
  }

  // Lógica de filtrado según selección del sidebar
  const getContent = () => {
    const { group, label } = activeFilter

    // LIBRARY — vista plana sin filas
    if (group === 'LIBRARY') {
      if (label === 'All') {
        const rows = [
          { label: 'ALL', scenes: SCENES },
          ...SCENE_CATEGORIES
            .map(cat => ({ label: cat, scenes: SCENES.filter(s => s.category === cat) }))
            .filter(r => r.scenes.length > 0)
        ]
        return { mode: 'rows' as const, rows }
      }
      if (label === 'Recently Added') return { mode: 'flat' as const, scenes: SCENES.filter(s => s.recent) }
    }

    // CATEGORY seleccionada — filas por mood
    if (group === 'CATEGORY') {
      const filtered = SCENES.filter(s => s.category === label)
      const rows = SCENE_MOODS
        .map(mood => ({ label: mood, scenes: filtered.filter(s => s.mood === mood) }))
        .filter(r => r.scenes.length > 0)
      return { mode: 'rows' as const, rows, title: label }
    }

    // MOOD seleccionado — filas por category
    if (group === 'MOOD') {
      const filtered = SCENES.filter(s => s.mood === label)
      const rows = SCENE_CATEGORIES
        .map(cat => ({ label: cat, scenes: filtered.filter(s => s.category === cat) }))
        .filter(r => r.scenes.length > 0)
      return { mode: 'rows' as const, rows, title: label }
    }

    // Default — todas las categorías
    const rows = SCENE_CATEGORIES
      .map(cat => ({ label: cat, scenes: SCENES.filter(s => s.category === cat) }))
      .filter(r => r.scenes.length > 0)
    return { mode: 'rows' as const, rows }
  }

  const content = getContent()



  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif', paddingTop: '48px' }}>
        <div style={{ position: 'relative', height: '55vh', overflow: 'hidden', background: '#000' }}>
          <video ref={videoRef} key={scene.src} src={scene.src} autoPlay loop muted={muted} playsInline
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '64px', left: '20px', lineHeight: 1.5 }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: '4px' }}>{scene.category.toUpperCase()} · {scene.year}</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>{scene.title}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{scene.type}</div>
          </div>
          <div style={{ position: 'absolute', bottom: '48px', left: 0, right: 0 }}>
            <div ref={progressBarRef} onClick={handleSeek}
              style={{ width: '100%', height: '20px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.15)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress * 100}%`, background: 'rgba(255,255,255,0.7)', transition: 'width 0.3s linear' }} />
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: '8px', padding: '6px 16px', alignItems: 'center' }}>
            {FEATURED.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i)} style={{ flexShrink: 0, width: i === current ? '80px' : '52px', height: '36px', border: i === current ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', overflow: 'hidden', background: '#000', transition: 'all 0.3s', cursor: 'pointer' }}>
                <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
            <button onClick={() => { if (videoRef.current) videoRef.current.muted = !muted; setMuted(m => !m) }} style={{ marginLeft: 'auto', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
        <div style={{ padding: '24px 16px 0' }}>
          {content.mode === 'flat' ? (
            <FlatGrid scenes={content.scenes} navigate={navigate} TEXT={TEXT} DIM={DIM} />
          ) : (
            content.rows.map(row => (
              <SceneRow key={row.label} label={row.label} scenes={row.scenes} navigate={navigate} TEXT={TEXT} DIM={DIM} />
            ))
          )}
          <div style={{ height: '80px' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif', paddingTop: '44px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* COLUMNA IZQUIERDA */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* HERO */}
          <div style={{ position: 'relative', height: 'calc(70vh - 44px)', overflow: 'hidden', background: '#000' }}>
            <video ref={videoRef} key={scene.src} src={scene.src} autoPlay loop muted={muted} playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 50%)', pointerEvents: 'none' }} />

            <div style={{ position: 'absolute', top: '20px', left: '24px', zIndex: 5, lineHeight: 1.6 }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', marginBottom: '4px' }}>{scene.category.toUpperCase()} · {scene.year}</div>
              <div style={{ fontSize: '22px', fontWeight: 600, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em' }}>{scene.title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{scene.type}</div>
            </div>

            <div style={{ ...hud, position: 'absolute', top: '20px', right: '20px', zIndex: 5, display: 'flex', gap: '16px' }}>
              <button onClick={() => setPaused(p => !p)} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                {paused ? '▶' : '⏸'}
              </button>
              <button onClick={() => { if (videoRef.current) videoRef.current.muted = !muted; setMuted(m => !m) }}
                style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                {muted ? '🔇' : '🔊'}
              </button>
            </div>

            <button onClick={() => goTo((current - 1 + FEATURED.length) % FEATURED.length)}
              style={{ ...hud, position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', zIndex: 5 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              ← PREV
            </button>
            <button onClick={() => goTo((current + 1) % FEATURED.length)}
              style={{ ...hud, position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', zIndex: 5 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              NEXT →
            </button>

            {/* PROGRESS */}
            <div style={{ position: 'absolute', bottom: '60px', left: 0, right: 0, zIndex: 5 }}>
              <div ref={progressBarRef} onClick={handleSeek}
                style={{ width: '100%', height: '20px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.15)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress * 100}%`, background: 'rgba(255,255,255,0.7)', transition: 'width 0.3s linear' }} />
                </div>
              </div>
            </div>

            {/* DOCK */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, display: 'flex', alignItems: 'center', padding: '8px 24px', gap: '12px' }}>
              {FEATURED.map((s, i) => (
                <FeaturedThumb key={s.id} scene={s} isActive={i === current} progress={progress} mainVideoRef={videoRef} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>

          {/* CONTENIDO FILTRADO */}
          <div style={{ padding: '40px 24px 80px' }}>

            {/* Título del filtro activo */}
            {activeFilter.label !== 'All' && (
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: DIM, letterSpacing: '0.1em' }}>
                  {activeFilter.group} · </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: TEXT }}>
                  {activeFilter.label}
                </span>
              </div>
            )}

            {content.mode === 'flat' ? (
              <FlatGrid scenes={content.scenes} navigate={navigate} TEXT={TEXT} DIM={DIM} />
            ) : (
              content.rows.map(row => (
                <SceneRow key={row.label} label={row.label} scenes={row.scenes} navigate={navigate} TEXT={TEXT} DIM={DIM} />
              ))
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{
          width: sidebarOpen ? '300px' : '0px',
          minWidth: sidebarOpen ? '300px' : '0px',
          overflow: 'hidden',
          transition: 'width 0.3s ease, min-width 0.3s ease',
          borderLeft: `1px solid ${BORDER}`,
          background: isLight ? '#f8f8f8' : '#111111',
          position: 'sticky', top: '44px',
          height: 'calc(100vh - 44px)',
          overflowY: 'auto', flexShrink: 0,
        }}>
          <div style={{ padding: '20px 0', opacity: sidebarOpen ? 1 : 0, transition: 'opacity 0.2s ease', minWidth: '200px' }}>
            {SIDEBAR_ITEMS.map((group, gi) => (
              <div key={group.group}>
                {gi > 0 && <div style={{ height: '1px', background: BORDER, margin: '8px 16px' }} />}
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: DIM, fontWeight: 1000, padding: '8px 16px 6px' }}>
                  {group.group}
                </div>
                {group.items.map(item => {
                  const isActive = activeFilter.group === group.group && activeFilter.label === item.label
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveFilter({ group: group.group, label: item.label })}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        width: '100%', padding: '8px 16px',
                        borderRadius: '8px',
                        background: isActive ? SURFACE : 'transparent',
                        transition: 'background 0.15s', cursor: 'pointer', margin: '1px 0',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ fontSize: '13px', color: isActive ? TEXT : DIM, flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ fontSize: '12px', color: isActive ? TEXT : DIM, fontWeight: isActive ? 500 : 300, letterSpacing: '0.02em', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            position: 'fixed', right: sidebarOpen ? '290px' : '8px', top: '50%',
            transform: 'translateY(-50%)', zIndex: 50,
            width: '20px', height: '48px',
            background: isLight ? '#f0f0f0' : '#1a1a1a',
            border: `1px solid ${BORDER}`, borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: DIM, fontSize: '10px',
            transition: 'right 0.3s ease, color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
          onMouseLeave={e => (e.currentTarget.style.color = DIM)}
        >
          {sidebarOpen ? '›' : '‹'}
        </button>

      </div>
    </div>
  )
}

// GRID PLANO — para Library
function FlatGrid({ scenes, navigate, TEXT, DIM }: {
  scenes: typeof SCENES
  navigate: ReturnType<typeof useNavigate>
  TEXT: string
  DIM: string
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '20px',
    }}>
      {scenes.map(scene => (
        <div key={scene.id}
          onClick={() => navigate(`/cine/${scene.id}`)}
          onMouseEnter={() => setHoveredId(scene.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ width: '100%', aspectRatio: '9/16', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
            <img src={scene.img} alt={scene.title} style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform 0.5s ease, filter 0.3s ease',
              transform: hoveredId === scene.id ? 'scale(1.04)' : 'scale(1)',
              filter: hoveredId === scene.id ? 'brightness(0.7)' : 'brightness(0.9)',
            }} />
          </div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: TEXT, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scene.title}</div>
          <div style={{ fontSize: '10px', color: DIM }}>{scene.category} · {scene.mood}</div>
        </div>
      ))}
    </div>
  )
}

// FILA
function SceneRow({ label, scenes, navigate, TEXT, DIM }: {
  label: string
  scenes: typeof SCENES
  navigate: ReturnType<typeof useNavigate>
  TEXT: string
  DIM: string
}) {
  const { ref, wasDragged } = useDragScroll()
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const isAI = label === 'AI Generated Visuals'

  // ←←← Aquí invertimos el orden (última a primera)
  const reversedScenes = [...scenes].reverse()

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: DIM }}>· {label}</span>
        <button 
          onClick={() => navigate(`/cine/category/${encodeURIComponent(label)}`)}
          style={{ fontSize: '10px', color: DIM, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
          onMouseLeave={e => (e.currentTarget.style.color = DIM)}
        >
          See all →
        </button>
      </div>

      {isAI && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          padding: '10px 14px',
          background: 'rgba(200,0,42,0.06)',
          border: '1px solid rgba(200,0,42,0.15)',
          borderRadius: '6px', 
          marginBottom: '14px',
        }}>
          <span style={{ fontSize: '12px', flexShrink: 0 }}>✦</span>
          <span style={{ fontSize: '11px', color: DIM, lineHeight: 1.6 }}>
            These visuals are AI-generated. Currently working without a visual collaborator — real footage is limited by copyright. Music and composition are original.
          </span>
        </div>
      )}

      <div 
        ref={ref} 
        style={{ 
          display: 'flex', 
          gap: '12px', 
          overflowX: 'auto', 
          scrollbarWidth: 'none', 
          userSelect: 'none' 
        } as React.CSSProperties}
      >
        {reversedScenes.map(scene => (
          <div 
            key={scene.id}
            onClick={() => { if (!wasDragged()) navigate(`/cine/${scene.id}`) }}
            onMouseEnter={() => setHoveredId(scene.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ flexShrink: 0, width: '160px', cursor: 'pointer' }}
          >
            <div style={{ 
              width: '100%', 
              aspectRatio: '9/16', 
              borderRadius: '6px', 
              overflow: 'hidden', 
              marginBottom: '10px' 
            }}>
              <img 
                src={scene.img} 
                alt={scene.title} 
                draggable={false} 
                style={{
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  display: 'block',
                  transition: 'transform 0.5s ease, filter 0.3s ease',
                  transform: hoveredId === scene.id ? 'scale(1.04)' : 'scale(1)',
                  filter: hoveredId === scene.id ? 'brightness(0.7)' : 'brightness(0.9)',
                  pointerEvents: 'none',
                }} 
              />
            </div>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 500, 
              color: TEXT, 
              marginBottom: '3px', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {scene.title}
            </div>
            <div style={{ fontSize: '10px', color: DIM }}>{scene.type}</div>
          </div>
        ))}
        
        <div style={{ flexShrink: 0, width: '8px' }} />
      </div>
    </div>
  )
}

function FeaturedThumb({ scene, isActive, progress, mainVideoRef, onClick }: {
  scene: typeof SCENES[0]
  isActive: boolean
  progress: number
  mainVideoRef: React.RefObject<HTMLVideoElement>
  onClick: () => void
}) {
  const colorRef = useRef<HTMLVideoElement>(null)
  const bwRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const col = colorRef.current
    const bw = bwRef.current
    if (isActive) { col?.play().catch(() => {}); bw?.play().catch(() => {}) }
    else {
      if (col) { col.pause(); col.currentTime = 0 }
      if (bw) { bw.pause(); bw.currentTime = 0 }
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return
    const main = mainVideoRef.current
    const col = colorRef.current
    const bw = bwRef.current
    if (!main || !col || !bw) return
    const sync = () => {
      if (Math.abs(col.currentTime - main.currentTime) > 0.5) {
        col.currentTime = main.currentTime
        bw.currentTime = main.currentTime
      }
    }
    main.addEventListener('timeupdate', sync)
    return () => main.removeEventListener('timeupdate', sync)
  }, [isActive, mainVideoRef])

  return (
    <button onClick={onClick} style={{
      flexShrink: 0, width: isActive ? '140px' : '90px', height: '52px',
      border: isActive ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.15)',
      borderRadius: '4px', overflow: 'hidden', position: 'relative',
      transition: 'all 0.3s ease', background: '#000', cursor: 'pointer',
    }}>
      <video ref={colorRef} src={scene.src} muted playsInline loop
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {isActive && (
        <video ref={bwRef} src={scene.src} muted playsInline loop
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) blur(1px)', clipPath: `inset(0 ${100 - progress * 100}% 0 0)` }} />
      )}
      {isActive && (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${progress * 100}%`, width: '1px', background: 'white', zIndex: 2 }} />
      )}
    </button>
  )
}