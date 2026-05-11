import { useRef, useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SCENES } from '../data/scenes'

export default function SceneDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const scene = SCENES.find(s => s.id === parseInt(id || '0'))

  const [muted, setMuted] = useState(true)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hudVisible, setHudVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const isMobile = window.innerWidth < 768

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const resetTimer = useCallback(() => {
    setHudVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setHudVisible(false), 3500)
  }, [])

  useEffect(() => {
    resetTimer()
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('touchstart', resetTimer)
    return () => {
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('touchstart', resetTimer)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [resetTimer])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const update = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration)
        setCurrentTime(formatTime(video.currentTime))
        setDuration(formatTime(video.duration))
      }
    }
    video.addEventListener('timeupdate', update)
    video.addEventListener('loadedmetadata', update)
    return () => {
      video.removeEventListener('timeupdate', update)
      video.removeEventListener('loadedmetadata', update)
    }
  }, [id])

  useEffect(() => {
    if (!videoRef.current) return
    paused ? videoRef.current.pause() : videoRef.current.play().catch(() => {})
  }, [paused])

  // Fullscreen API
  const toggleFullscreen = async () => {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current
    const video = videoRef.current
    if (!bar || !video) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    video.currentTime = ratio * video.duration
  }

  if (!scene) return null

  const hud: React.CSSProperties = {
    opacity: hudVisible ? 1 : 0,
    transition: 'opacity 0.4s ease',
    pointerEvents: hudVisible ? 'auto' : 'none',
  }

  // SVG Icons limpios estilo Apple
  const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
  const PauseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  )
  const MuteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM19 12c0 3.02-1.69 5.64-4.17 7.01L13 17.17A5.987 5.987 0 0017 12c0-2.43-1.44-4.54-3.54-5.57L15 4.69A8.01 8.01 0 0119 12zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-2L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>
  )
  const UnmuteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  )
  const FullscreenIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
  )
  const ExitFullscreenIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
    </svg>
  )
  const BackIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  )

  const dim = 'rgba(255,255,255,0.55)'
  const full = 'rgba(255,255,255,0.92)'

  const ControlBtn = ({ onClick, children, style }: {
    onClick: () => void
    children: React.ReactNode
    style?: React.CSSProperties
  }) => (
    <button
      onClick={onClick}
      style={{
        color: dim,
        transition: 'color 0.15s, transform 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = full
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = dim
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {children}
    </button>
  )

  // ── MOBILE ──────────────────────────────────────────────
  if (isMobile) {
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        background: '#000',
        fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
        display: 'flex', flexDirection: 'column',
      }}
      onClick={resetTimer}
    >
      {/* VIDEO — ocupa el tercio superior */}
      <video
        ref={videoRef}
        key={scene.src}
        src={scene.src}
        autoPlay loop muted={muted} playsInline
        style={{
          width: '100%',
          height: isFullscreen ? '100vh' : '60vh',
          objectFit: 'cover',
          flexShrink: 0,
          zIndex: 1,
        }}
      />

      {/* OVERLAY fullscreen */}
      {isFullscreen && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 40%)',
          pointerEvents: 'none', zIndex: 2,
        }} />
      )}

      {/* CONTROLES FULLSCREEN */}
      {isFullscreen && (
        <div style={{
          ...hud,
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => { document.exitFullscreen(); navigate('/cine') }}
              style={{ color: dim, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', letterSpacing: '0.06em' }}
            >
              <BackIcon /> CINE
            </button>
            <div style={{ fontSize: '14px', fontWeight: 600, color: full }}>{scene.title}</div>
            <div style={{ width: '60px' }} />
          </div>
          <div>
            <div ref={progressBarRef} onClick={handleSeek}
              style={{ width: '100%', height: '20px', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '8px' }}
            >
              <div style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress * 100}%`, background: 'rgba(255,255,255,0.85)', borderRadius: '2px', transition: 'width 0.3s linear' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <ControlBtn onClick={() => setPaused(p => !p)}>
                  {paused ? <PlayIcon /> : <PauseIcon />}
                </ControlBtn>
                <ControlBtn onClick={() => { if (videoRef.current) videoRef.current.muted = !muted; setMuted(m => !m) }}>
                  {muted ? <MuteIcon /> : <UnmuteIcon />}
                </ControlBtn>
                <span style={{ fontSize: '11px', color: dim, fontVariantNumeric: 'tabular-nums' }}>
                  {currentTime} / {duration}
                </span>
              </div>
              <ControlBtn onClick={toggleFullscreen}><ExitFullscreenIcon /></ControlBtn>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLES NORMALES — debajo del video, no encima */}
      {!isFullscreen && (
        <div style={{
          flex: 1,
          background: '#0a0a0a',
          display: 'flex', flexDirection: 'column',
          padding: '24px 20px 32px',
          overflowY: 'auto',
          zIndex: 2,
        }}>

          {/* TITLE + BACK */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <button onClick={() => navigate('/cine')} style={{ color: dim, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <BackIcon />
            </button>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: full, letterSpacing: '-0.01em' }}>
                {scene.title}
              </div>
              <div style={{ fontSize: '11px', color: dim }}>{scene.type} · {scene.category}</div>
            </div>
          </div>

          {/* PROGRESS */}
          <div
            ref={progressBarRef}
            onClick={handleSeek}
            style={{
              width: '100%', height: '20px',
              cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center',
              marginBottom: '4px',
            }}
          >
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '2px',
              background: 'rgba(255,255,255,0.2)', borderRadius: '1px',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0,
                height: '100%', width: `${progress * 100}%`,
                background: 'rgba(255,255,255,0.85)', borderRadius: '1px',
                transition: 'width 0.3s linear',
              }} />
            </div>
          </div>

          {/* TIEMPOS */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '10px', color: dim,
            marginBottom: '28px', fontVariantNumeric: 'tabular-nums',
          }}>
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>

          {/* BOTONES */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '0 8px',
            marginBottom: '32px',
          }}>
            <ControlBtn onClick={() => { if (videoRef.current) videoRef.current.muted = !muted; setMuted(m => !m) }}>
              {muted ? <MuteIcon /> : <UnmuteIcon />}
            </ControlBtn>
            <ControlBtn onClick={() => setPaused(p => !p)} style={{ transform: 'scale(1.6)' }}>
              {paused ? <PlayIcon /> : <PauseIcon />}
            </ControlBtn>
            <ControlBtn onClick={toggleFullscreen}>
              <FullscreenIcon />
            </ControlBtn>
          </div>

          {/* CONTACTO */}
          <button
            onClick={() => navigate('/contacto')}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #c8002a, #8b0000)',
              color: '#fff', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.1em', borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(200,0,42,0.35)',
            }}
          >
            CONTACT →
          </button>
        </div>
      )}
    </div>
  )
}

  // ── DESKTOP ──────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 0 }}
      onClick={resetTimer}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        key={scene.src}
        src={scene.src}
        autoPlay loop muted={muted} playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* OVERLAY */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 45%)',
        pointerEvents: 'none',
      }} />

      {/* INFO TOP LEFT */}
      <div style={{ ...hud, position: 'absolute', top: '56px', left: '32px', zIndex: 10, lineHeight: 1.7 }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: '2px' }}>
          {scene.category.toUpperCase()} · {scene.year}
        </div>
        <div style={{ fontSize: '20px', fontWeight: 600, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em' }}>
          {scene.title}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{scene.type}</div>
      </div>

      {/* BACK — izquierda centro */}
      <button
        onClick={() => navigate('/cine')}
        style={{
          ...hud,
          position: 'absolute', left: '32px', top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '11px', letterSpacing: '0.08em',
          color: dim, transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = full)}
        onMouseLeave={e => (e.currentTarget.style.color = dim)}
      >
        <BackIcon />
        CINE
      </button>

      {/* CONTACTO — derecha centro */}
      <button
        onClick={() => navigate('/contacto')}
        style={{
          ...hud,
          position: 'absolute', right: '32px', top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.1em', color: '#fff',
          background: 'linear-gradient(135deg, #c8002a, #8b0000)',
          padding: '10px 20px', borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(200,0,42,0.4)',
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.04)'
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,0,42,0.6)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,0,42,0.4)'
        }}
      >
        CONTACT →
      </button>

      {/* BOTTOM — progress + controles */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>

        {/* PROGRESS BAR */}
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          style={{
            width: '100%', height: '3px',
            background: 'rgba(255,255,255,0.15)',
            cursor: 'pointer', position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0,
            height: '100%', width: `${progress * 100}%`,
            background: 'rgba(255,255,255,0.8)',
            transition: 'width 0.3s linear',
          }} />
        </div>

        {/* CONTROLES */}
        <div style={{
          ...hud,
          display: 'flex', alignItems: 'center',
          padding: '12px 24px', gap: '20px',
        }}>

          {/* PLAY/PAUSE */}
          <ControlBtn onClick={() => setPaused(p => !p)}>
            {paused ? <PlayIcon /> : <PauseIcon />}
          </ControlBtn>

          {/* TIEMPO */}
          <span style={{ fontSize: '11px', color: dim, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>
            {currentTime} / {duration}
          </span>

          <div style={{ flex: 1 }} />

          {/* MUTE */}
          <ControlBtn onClick={() => { if (videoRef.current) videoRef.current.muted = !muted; setMuted(m => !m) }}>
            {muted ? <MuteIcon /> : <UnmuteIcon />}
          </ControlBtn>

          {/* FULLSCREEN */}
          <ControlBtn onClick={toggleFullscreen}>
            {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
          </ControlBtn>

        </div>
      </div>
    </div>
  )
}