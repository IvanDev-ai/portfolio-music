import { useState, useRef, useEffect, useCallback } from 'react'
import { SCENES } from '../data/scenes'

const PROJECTS = SCENES
  .filter(s => s.featured)
  .map(s => ({
    id: s.id,
    title: s.title.toUpperCase(),
    type: `${s.category.toUpperCase()} · ${s.type.toUpperCase()}`,
    year: s.year,
    src: s.src,
    thumb: s.img,
  }))

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>
  muted: boolean
  paused: boolean
  onProgressChange: (p: number) => void
  progress: number
  isMobile: boolean
  onEnd?: () => void
}

export default function VideoHero({ videoRef, muted, paused, onProgressChange, progress, isMobile, onEnd }: Props) {
  const [current, setCurrent] = useState(0)
  const [hudVisible, setHudVisible] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const project = PROJECTS[current]
  const dim = 'rgba(255,255,255,0.45)'
  const full = 'rgba(255,255,255,0.85)'


  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted, videoRef])

  useEffect(() => {
    if (!videoRef.current) return
    paused ? videoRef.current.pause() : videoRef.current.play().catch(() => {})
  }, [paused, videoRef])

  const resetTimer = useCallback(() => {
    setHudVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setHudVisible(false), 2000)
  }, [])

  useEffect(() => {
    if (isMobile) return
    resetTimer()
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('click', resetTimer)
    return () => {
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('click', resetTimer)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [resetTimer, isMobile])

  useEffect(() => {
    if (!isMobile) return
    const container = listRef.current
    if (!container) return

    const items = container.querySelectorAll('[data-index]')
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const i = parseInt((entry.target as HTMLElement).dataset.index || '0')
          setCurrent(i)
          onProgressChange(0)
        }
      })
    }, { threshold: 0.6 })

    items.forEach(el => observer.observe(el))

    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartY - e.changedTouches[0].clientY
      // diff > 30 = swipe hacia abajo
      // current === último proyecto
      if (diff > 30 && current === PROJECTS.length - 1) {
        onEnd?.()
      }
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      observer.disconnect()
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, onProgressChange, onEnd, current])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current
    const video = videoRef.current
    if (!bar || !video) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    video.currentTime = ratio * video.duration
    onProgressChange(ratio)
  }

  const goTo = (index: number) => {
    setCurrent(index)
    onProgressChange(0)
  }

  const prev = () => goTo((current - 1 + PROJECTS.length) % PROJECTS.length)
  const next = () => goTo((current + 1) % PROJECTS.length)

  const hud: React.CSSProperties = {
    opacity: hudVisible ? 1 : 0,
    transition: 'opacity 0.5s ease',
    pointerEvents: hudVisible ? 'auto' : 'none',
  }

  // Dock scale — el hover expande el central y los adyacentes un poco
  const getScale = (i: number) => {
    if (hoveredIndex === null) return 1
    const dist = Math.abs(i - hoveredIndex)
    if (dist === 0) return 1.09
    if (dist === 1) return 1.06
    return 1
  }

  // ── MOBILE ──────────────────────────────────────────────
    // El bloque if (isMobile) — idéntico al tuyo que funcionaba:
  if (isMobile) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <video
          ref={videoRef}
          key={project.src}
          src={project.src}
          autoPlay loop muted={muted} playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* SCROLL HINT — derecha, centrado verticalmente */}
        <div style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          zIndex: 6,
          pointerEvents: 'none',
          animation: 'fadeUpDown 2s ease-in-out infinite',
        }}>
          <span style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'rgba(255, 255, 255, 0.64)',
            writingMode: 'vertical-rl',
          }}>
            SCROLL
          </span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>↓</span>
        </div>

        <div
          ref={listRef}
          style={{
            position: 'absolute', inset: 0,
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            zIndex: 5,
            scrollbarWidth: 'none',
          } as React.CSSProperties}
        >
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              data-index={i}
              onClick={() => goTo(i)}
              style={{
                height: '100vh', scrollSnapAlign: 'start',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end', padding: '0 20px 80px',
              }}
            >
              <div style={{ opacity: i === current ? 1 : 0.35, transition: 'opacity 0.4s' }}>
                <div style={{
                  fontSize: '10px', letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.5)', marginBottom: '4px',
                }}>
                  {p.type} · {p.year}
                </div>
                <div style={{
                  fontSize: '18px', fontWeight: 500,
                  letterSpacing: '0.02em', lineHeight: 1.2,
                  color: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                }}>
                  {p.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── DESKTOP ──────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>

      <video ref={videoRef} key={project.src} src={project.src}
        autoPlay loop muted={muted} playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* INFO TOP LEFT */}
      <div style={{ position: 'absolute', top: '52px', left: '16px', lineHeight: 1.7, zIndex: 10 }}>
        <div style={{ fontSize: '11px', color: full, fontWeight: 500 }}>{project.title}</div>
        <div style={{ fontSize: '10px', color: dim }}>{project.type}</div>
        <div style={{ fontSize: '10px', color: dim }}>{project.year}</div>
      </div>

      {/* FLECHAS */}
      <button onClick={prev} style={{
        ...hud, position: 'absolute', left: '16px', top: '50%',
        transform: 'translateY(-50%)', fontSize: '11px', color: dim, letterSpacing: '0.08em', zIndex: 10,
      }}
        onMouseEnter={e => (e.currentTarget.style.color = full)}
        onMouseLeave={e => (e.currentTarget.style.color = dim)}
      >← PREV</button>

      <button onClick={next} style={{
        ...hud, position: 'absolute', right: '16px', top: '50%',
        transform: 'translateY(-50%)', fontSize: '11px', color: dim, letterSpacing: '0.08em', zIndex: 10,
      }}
        onMouseEnter={e => (e.currentTarget.style.color = full)}
        onMouseLeave={e => (e.currentTarget.style.color = dim)}
      >NEXT →</button>

      {/* BOTTOM HUD */}
      <div style={{
        ...hud,
        position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 10, display: 'flex', flexDirection: 'column',
        alignItems: 'center', paddingBottom: '30px', gap: '10px',
      }}>

        {/* BARRA DE PROGRESO — pequeña, centrada, encima de los thumbs */}
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          style={{
            width: '500px', height: '2px',
            marginBottom: '20px',
            background: 'rgba(255,255,255,0.2)',
            cursor: 'pointer', position: 'relative', borderRadius: '2px',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0,
            height: '100%', width: `${progress * 100}%`,
            background: 'rgba(255,255,255,0.8)',
            transition: 'width 0.4s linear', borderRadius: '2px',
          }} />
        </div>

        {/* THUMBNAILS — dock style */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '150px',
        }}>
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transform: `scale(${getScale(i)})`,
                transformOrigin: 'bottom center',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <ThumbnailCard
                project={p}
                index={i}
                current={current}
                progress={progress}
                mainVideoRef={videoRef}
                onClick={() => goTo(i)}
              />

              {/* INFO A LA DERECHA del thumb */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '2px',
                opacity: i === current ? 1 : 0.4,
                transition: 'opacity 0.3s',
              }}>
                <div style={{ fontSize: '10px', color: full, fontWeight: 500, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  {p.title}
                </div>
                <div style={{ fontSize: '9px', color: dim, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {p.type}
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
                  {p.year}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function ThumbnailCard({
  project, index, current, progress, mainVideoRef, onClick
}: {
  project: typeof PROJECTS[0]
  index: number
  current: number
  progress: number
  mainVideoRef: React.RefObject<HTMLVideoElement>
  onClick: () => void
}) {
  const isActive = index === current
  const colorVidRef = useRef<HTMLVideoElement>(null)
  const bwVidRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const col = colorVidRef.current
    const bw = bwVidRef.current
    if (isActive) {
      col?.play().catch(() => {})
      bw?.play().catch(() => {})
    } else {
      if (col) { col.pause(); col.currentTime = 0 }
      if (bw) { bw.pause(); bw.currentTime = 0 }
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return
    const main = mainVideoRef.current
    const col = colorVidRef.current
    const bw = bwVidRef.current
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
      width: isActive ? '180px' : '120px',
      height: '72px',
      padding: 0,
      borderRadius: '8px',
      overflow: 'hidden',
      flexShrink: 0,
      transition: 'all 0.1s ease',
      position: 'relative',
      cursor: 'pointer',
      background: '#000',
    }}>

      {/* Video COLOR */}
      <video ref={colorVidRef} src={project.src} muted playsInline loop
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          borderRadius: '8px',
        }}
      />

      {/* Video B&W con blur — parte ya reproducida */}
      {isActive && (
        <video ref={bwVidRef} src={project.src} muted playsInline loop
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(1) blur(1px)',
            clipPath: `inset(0 ${100 - progress * 100}% 0 0 round 0px)`,
            borderRadius: '8px',
          }}
        />
      )}

      {/* Línea divisoria */}
      {isActive && (
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${progress * 100}%`,
          width: '1px', background: 'gray', zIndex: 2,
        }} />
      )}
    </button>
  )
}