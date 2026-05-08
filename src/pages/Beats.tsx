import { useState,useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDragScroll } from '../hooks/useDragScroll'
import { BEATS, BEAT_GENRES } from '../data/beats'

const SECTIONS = [
  { label: 'ALL', genre: 'ALL', beats: BEATS.slice(0, 5) },
  ...BEAT_GENRES.map(genre => ({
    label: genre.toUpperCase(),
    genre,
    beats: BEATS.filter(b => b.genre === genre).slice(0, 5),
  })).filter(s => s.beats.length > 0),
]


export default function Beats({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const navigate = useNavigate()
  const BG = theme === 'light' ? '#ffffff' : '#141414'
  const TEXT = theme === 'light' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.88)'
  const DIM = theme === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.38)'

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      paddingTop: '44px',
      color: TEXT,
    }}>
       
      {SECTIONS.map(section => (
        <div key={section.label} style={{ marginBottom: '56px' }}>

          {/* HEADER */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '32px 32px 0',
          }}>
            <span style={{
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.1em', color: DIM,
            }}>
              · {section.label}
            </span>
            <button
              onClick={() => navigate(`/beats/category/${encodeURIComponent(section.genre)}`)}
              style={{
                fontSize: '12px', letterSpacing: '0.01em',
                color: DIM, transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
              onMouseLeave={e => (e.currentTarget.style.color = DIM)}
            >
              See all →
            </button>
          </div>

          {/* FILA LAFOUR — info arriba, imagen grande */}
          <DraggableRow
            beats={section.beats}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onClickBeat={id => navigate(`/beats/${id}`)}
            TEXT={TEXT}
            DIM={DIM}
          />

        </div>
      ))}
      <div style={{ height: '80px' }} />
    </div>
  )
}

function DraggableRow({ beats, hoveredId, onHover, onClickBeat, TEXT, DIM}: {
  beats: typeof BEATS
  hoveredId: number | null
  onHover: (id: number | null) => void
  onClickBeat: (id: number) => void
  TEXT: string
  DIM: string
}) {
  const { ref: rowRef, wasDragged } = useDragScroll()
  const animRef = useRef<number | null>(null)
  const isHoveringRow = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = window.innerWidth < 768

  const setRef = (el: HTMLDivElement | null) => {
    ;(rowRef as React.MutableRefObject<HTMLDivElement | null>).current = el
    ;(scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }

  useEffect(() => {
    if (isMobile) return

    let scrolling = false

    const smoothScrollTo = (el: HTMLDivElement, target: number, duration: number) => {
        scrolling = true
        const start = el.scrollLeft
        const diff = target - start
        const startTime = performance.now()
        const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
        if (scrollRef.current) scrollRef.current.scrollLeft = start + diff * ease
        if (progress < 1) requestAnimationFrame(step)
        else scrolling = false
        }
        requestAnimationFrame(step)
    }

    const tick = () => {
        const el = scrollRef.current
        if (el && isHoveringRow.current && !scrolling) {
        el.scrollLeft += 0.3
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
            smoothScrollTo(el, 0, 1400)
        }
        }
        animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
    }, [isMobile])


  // Ancho de cada card según pantalla
  const cardWidth = isMobile
    ? '85vw'      // mobile: 1 card visible + asoma el siguiente
    : '31vw'   // desktop: 3 cards visibles

  return (
    <div
      ref={setRef}
      onPointerEnter={() => { isHoveringRow.current = true }}
      onPointerLeave={() => { isHoveringRow.current = false }}
      style={{
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        userSelect: 'none',
        scrollSnapType: isMobile ? 'x mandatory' : 'none',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}
    >
      {beats.map((beat, i) => (
        <div
          key={beat.id}
          onClick={() => { if (!wasDragged()) onClickBeat(beat.id) }}
          onMouseEnter={() => onHover(beat.id)}
          onMouseLeave={() => onHover(null)}
          style={{
            flexShrink: 0,
            width: cardWidth,
            cursor: 'pointer',
            scrollSnapAlign: isMobile ? 'start' : 'none',
            paddingLeft: isMobile && i === 0 ? '16px' : '5px',
          }}
        >
          {/* INFO ARRIBA */}
          <div style={{
            padding: isMobile ? '14px 16px 10px' : '16px 20px 10px',
          }}>
            <div style={{
              fontSize: isMobile ? '12px' : '1.2rem',
              fontWeight: 500,
              color: hoveredId === beat.id ? TEXT : `${TEXT.slice(0, -4)}0.45)`,
              marginBottom: '3px',
              letterSpacing: '0.02em',
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              · {beat.title} — {beat.artist}
            </div>
            <div style={{
              fontSize: '10px',
              color: DIM,
              letterSpacing: '0.03em',
            }}>
              {beat.genre} · {beat.bpm} BPM · {beat.key}
            </div>
          </div>

          {/* IMAGEN */}
          <div style={{
            width: '100%',
            aspectRatio:'4/3' ,
            overflow: 'hidden',
          }}>
            <img
              src={beat.img}
              alt={beat.title}
              draggable={false}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                transition: 'transform 0.5s ease, filter 0.3s ease',
                transform: hoveredId === beat.id ? 'scale(1.03)' : 'scale(1)',
                filter: hoveredId === beat.id ? 'brightness(0.85)' : 'brightness(1)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      ))}

      <div style={{ flexShrink: 0, width: isMobile ? '16px' : '32px' }} />
    </div>
  )
}
