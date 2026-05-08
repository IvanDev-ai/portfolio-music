import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BEATS } from '../data/beats'

export default function BeatDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const beat = BEATS.find(b => b.id === parseInt(id || '0'))

  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !beat) return
    audio.src = beat.src
    audio.volume = volume
    const update = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration)
        const m = Math.floor(audio.currentTime / 60)
        const s = Math.floor(audio.currentTime % 60).toString().padStart(2, '0')
        setCurrentTime(`${m}:${s}`)
      }
    }
    audio.addEventListener('timeupdate', update)
    return () => audio.removeEventListener('timeupdate', update)
  }, [beat])

  if (!beat) return null

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current
    const audio = audioRef.current
    if (!bar || !audio) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
    setProgress(ratio)
  }

  const handleVolume = (v: number) => {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
    setMuted(v === 0)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !muted
    setMuted(m => !m)
  }

  const totalSecs = beat.duration.split(':').reduce((a, b) => a * 60 + parseInt(b), 0)
  const remainSecs = Math.round(totalSecs * (1 - progress))
  const remainMin = Math.floor(remainSecs / 60)
  const remainSec = (remainSecs % 60).toString().padStart(2, '0')
  const isMobile = window.innerWidth < 768
 if (isMobile) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
    }}>

      {/* FONDO */}
      <div style={{
        position: 'absolute', inset: '-40px',
        backgroundImage: `url(${beat.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(80px) brightness(0.4) saturate(1.6)',
        transform: 'scale(1.1)', zIndex: 0,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 1 }} />

      {/* CONTENIDO — ocupa toda la pantalla con flex */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 32px 48px',
        height: '100%',
        gap: '28px',
      }}>

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: '16px', left: '20px',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', color: 'rgba(255,255,255,0.6)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          BEATS
        </button>

        {/* PORTADA — grande, ocupa el espacio superior */}
        <div style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        }}>
          <img src={beat.img} alt={beat.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* BLOQUE INFERIOR — info + controles */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* INFO + LICENSE */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                {beat.title}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
                {beat.artist}
              </div>
            </div>
            <a href="https://beatstars.com" target="_blank" rel="noopener noreferrer"
              style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                color: '#fff', background: 'linear-gradient(135deg, #c8002a, #8b0000)',
                padding: '8px 14px', borderRadius: '20px', flexShrink: 0, marginLeft: '12px',
                boxShadow: '0 4px 16px rgba(200,0,42,0.5)',
              }}
            >
              LICENSE →
            </a>
          </div>

          {/* PROGRESS BAR — más gruesa, sin bola */}
          <div>
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              style={{
                width: '100%', height: '4px',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '2px', cursor: 'pointer',
                position: 'relative', marginBottom: '8px',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0,
                height: '100%', width: `${progress * 100}%`,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '2px', transition: 'width 0.3s linear',
              }} />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: '11px', color: 'rgba(255,255,255,0.4)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              <span>{currentTime}</span>
              <span>-{remainMin}:{remainSec}</span>
            </div>
          </div>

          {/* CONTROLES */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
          }}>
            <button
              onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 15 }}
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                <text x="12" y="14" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="Inter">15</text>
              </svg>
            </button>

            <button onClick={togglePlay} style={{ color: 'white' }}>
              {playing ? (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            <button
              onClick={() => { if (audioRef.current) audioRef.current.currentTime += 15 }}
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                <text x="12" y="14" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="Inter">15</text>
              </svg>
            </button>
          </div>

          {/* VOLUMEN — sin bola, solo barra fina estilo Apple */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
            <div style={{ flex: 1, position: 'relative', height: '3px' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(255,255,255,0.25)', borderRadius: '2px',
              }} />
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: `${(muted ? 0 : volume) * 100}%`,
                background: 'rgba(255,255,255,0.85)', borderRadius: '2px',
              }} />
              <input
                type="range" min={0} max={1} step={0.01}
                value={muted ? 0 : volume}
                onChange={e => handleVolume(parseFloat(e.target.value))}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', opacity: 0, cursor: 'pointer',
                  height: '100%', margin: 0,
                }}
              />
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          </div>

          {/* METADATA */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '24px',
            fontSize: '11px', color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.06em',
          }}>
            <span>{beat.bpm} BPM</span>
            <span>{beat.key}</span>
            <span>{beat.duration}</span>
          </div>

        </div>
      </div>

      <audio ref={audioRef} onEnded={() => setPlaying(false)} />
    </div>
  )
}
  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
    }}>

      {/* FONDO */}
      <div style={{
        position: 'absolute', inset: '-40px',
        backgroundImage: `url(${beat.img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(60px) brightness(0.35) saturate(1.4)',
        transform: 'scale(1.1)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1,
      }} />

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute', top: '56px', left: '20px',
          zIndex: 10,
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.6)',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'white')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        BEATS
      </button>

      {/* CARD — columna central, 1/3 del ancho */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '33vw',
        minWidth: '320px',
        maxWidth: '480px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 8px',
      }}>

        {/* PORTADA — grande */}
        <div style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          marginBottom: '32px',
        }}>
          <img
            src={beat.img}
            alt={beat.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* INFO + BEATSTARS */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}>
          <div>
            <div style={{
              fontSize: '20px', fontWeight: 700,
              color: 'rgba(255,255,255,0.97)',
              marginBottom: '4px', letterSpacing: '-0.01em',
            }}>
              {beat.title}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>
              {beat.artist} · {beat.genre}
            </div>
          </div>

          <a
            href="https://beatstars.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.06em', color: '#fff',
              background: 'linear-gradient(135deg, #c8002a, #8b0000)',
              padding: '8px 16px', borderRadius: '20px',
              flexShrink: 0, marginLeft: '16px', marginTop: '4px',
              boxShadow: '0 4px 20px rgba(200,0,42,0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.04)'
              e.currentTarget.style.boxShadow = '0 6px 28px rgba(200,0,42,0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,0,42,0.4)'
            }}
          >
            LICENSE →
          </a>
        </div>

        {/* PROGRESS BAR */}
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          style={{
            width: '100%', height: '3px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px', cursor: 'pointer',
            position: 'relative', marginBottom: '8px',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0,
            height: '100%', width: `${progress * 100}%`,
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '2px', transition: 'width 0.3s linear',
          }} />
          {/* Thumb */}
          <div style={{
            position: 'absolute', top: '50%',
            left: `${progress * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '12px', height: '12px',
            borderRadius: '50%', background: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }} />
        </div>

        {/* TIEMPOS */}
        <div style={{
          width: '100%', display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px', color: 'rgba(255,255,255,0.4)',
          marginBottom: '32px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <span>{currentTime}</span>
          <span>-{remainMin}:{remainSec}</span>
        </div>

        {/* CONTROLES */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '40px',
          marginBottom: '36px', width: '100%',
        }}>

          {/* RETROCEDER 15s */}
          <button
            onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 15 }}
            style={{ color: 'rgba(255,255,255,0.75)', transition: 'color 0.15s', lineHeight: 1 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              <text x="12" y="14" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="Inter">15</text>
            </svg>
          </button>

          {/* PLAY / PAUSE — grande, sin círculo */}
          <button
            onClick={togglePlay}
            style={{ color: 'white', transition: 'opacity 0.15s', lineHeight: 1 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {playing ? (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* ADELANTAR 15s */}
          <button
            onClick={() => { if (audioRef.current) audioRef.current.currentTime += 15 }}
            style={{ color: 'rgba(255,255,255,0.75)', transition: 'color 0.15s', lineHeight: 1 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
              <text x="12" y="14" textAnchor="middle" fontSize="5" fill="currentColor" fontFamily="Inter">15</text>
            </svg>
          </button>
        </div>

        {/* VOLUMEN */}
        <div style={{
          width: '100%', display: 'flex',
          alignItems: 'center', gap: '12px',
        }}>
          {/* ICONO MUTE */}
          <button
            onClick={toggleMute}
            style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.15s', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            {muted || volume === 0 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-2L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : volume < 0.5 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>

          {/* BARRA CUSTOM */}
          <div style={{ flex: 1, position: 'relative', height: '3px' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '2px',
            }} />
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${(muted ? 0 : volume) * 100}%`,
              background: 'rgba(255,255,255,0.75)',
              borderRadius: '2px',
              transition: 'width 0.1s',
            }} />
            <input
              type="range" min={0} max={1} step={0.01}
              value={muted ? 0 : volume}
              onChange={e => handleVolume(parseFloat(e.target.value))}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer', margin: 0,
              }}
            />
          </div>

          {/* ICONO MAX */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }}>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </div>

        {/* METADATA */}
        <div style={{
          marginTop: '20px',
          display: 'flex', gap: '24px',
          fontSize: '11px', color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.06em',
        }}>
          <span>{beat.bpm} BPM</span>
          <span>{beat.key}</span>
          <span>{beat.duration}</span>
        </div>

      </div>

      <audio ref={audioRef} onEnded={() => setPlaying(false)} />
    </div>
  )
}