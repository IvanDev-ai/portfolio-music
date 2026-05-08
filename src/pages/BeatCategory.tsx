import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BEATS, BEAT_GENRES, BEAT_ARTISTS, BEAT_KEYS, BPM_RANGES } from '../data/beats'

const ALL_GENRES = BEAT_GENRES
const ALL_ARTISTS = BEAT_ARTISTS
const ALL_KEYS = BEAT_KEYS



export default function BeatCategory({ theme = 'light' }: { theme?: 'dark' | 'light' }) {
  const { genre } = useParams()
  const navigate = useNavigate()
  const label = decodeURIComponent(genre || '')
  const isAll = label === 'ALL'
  const isMobile = window.innerWidth < 768
  const BG = theme === 'light' ? '#ffffff' : '#141414'
  const TEXT = theme === 'light' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.88)'
  const DIM = theme === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255, 255, 255, 0.75)'

  // Filtros — solo en ALL
  const [filterGenre, setFilterGenre] = useState('ALL')
  const [filterArtist, setFilterArtist] = useState('ALL')
  const [filterKey, setFilterKey] = useState('ALL')
  const [filterBpm, setFilterBpm] = useState(0)

  // Grid cols en mobile
  const [mobileCols, setMobileCols] = useState(1)

  // Dropdowns abiertos
  const [openDrop, setOpenDrop] = useState<string | null>(null)

  const bpmRange = BPM_RANGES[filterBpm]

  const beats = BEATS.filter(b => {
    if (!isAll && b.genre !== label) return false
    if (isAll && filterGenre !== 'ALL' && b.genre !== filterGenre) return false
    if (isAll && filterArtist !== 'ALL' && b.artist !== filterArtist) return false
    if (isAll && filterKey !== 'ALL' && b.key !== filterKey) return false
    if (isAll && (b.bpm < bpmRange.min || b.bpm > bpmRange.max)) return false
    return true
  })

  const displayedBeats = [...beats].sort((a, b) => b.id - a.id)
  const toggleDrop = (name: string) =>
    setOpenDrop(o => o === name ? null : name)

  const cols = isMobile ? mobileCols : 4

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
      paddingTop: '44px',
      color: TEXT,
    }}>

      {/* HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 32px 0',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/beats')}
            style={{ fontSize: '11px', letterSpacing: '0.06em', color: DIM, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = DIM)}
          >
            ← BEATS
          </button>
          <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', color: TEXT }}>
            {label}
          </span>
        </div>

        {/* TOGGLE COLS — solo mobile */}
        {isMobile && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2].map(n => (
              <button
                key={n}
                onClick={() => setMobileCols(n)}
                style={{
                  width: '32px', height: '32px',
                  border: `1px solid ${mobileCols === n ? TEXT : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '2px', flexDirection: 'row',
                }}
              >
                {Array.from({ length: n }).map((_, i) => (
                  <div key={i} style={{
                    width: n === 1 ? '14px' : '6px',
                    height: '14px',
                    background: mobileCols === n ? TEXT : DIM,
                    borderRadius: '1px',
                  }} />
                ))}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FILTROS — solo en ALL */}
      {isAll && (
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '20px 32px 0',
          flexWrap: 'wrap',
        }}>
          {/* GÉNERO */}
          <Dropdown
            label="Genre"
            value={filterGenre}
            options={['ALL', ...ALL_GENRES]}
            isOpen={openDrop === 'genre'}
            onToggle={() => toggleDrop('genre')}
            onSelect={v => { setFilterGenre(v); setOpenDrop(null) }}
            TEXT={TEXT}
            DIM={DIM}
            isLight={theme === 'light'}
          />
          {/* ARTISTA */}
          <Dropdown
            label="Artist"
            value={filterArtist}
            options={['ALL', ...ALL_ARTISTS]}
            isOpen={openDrop === 'artist'}
            onToggle={() => toggleDrop('artist')}
            onSelect={v => { setFilterArtist(v); setOpenDrop(null) }}
            TEXT={TEXT}
            DIM={DIM}
            isLight={theme === 'light'} 
          />
          {/* KEY */}
          <Dropdown
            label="Key"
            value={filterKey}
            options={['ALL', ...ALL_KEYS]}
            isOpen={openDrop === 'key'}
            onToggle={() => toggleDrop('key')}
            onSelect={v => { setFilterKey(v); setOpenDrop(null) }}
            TEXT={TEXT}
            DIM={DIM}
            isLight={theme === 'light'}
          />
          {/* BPM */}
          <Dropdown
            label="BPM"
            value={bpmRange.label}
            options={BPM_RANGES.map(r => r.label)}
            isOpen={openDrop === 'bpm'}
            onToggle={() => toggleDrop('bpm')}
            onSelect={v => {
              setFilterBpm(BPM_RANGES.findIndex(r => r.label === v))
              setOpenDrop(null)
            }}
            TEXT={TEXT}
            DIM={DIM}
            isLight={theme === 'light'}
          />
        </div>
      )}

      {/* GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: isMobile ? '12px' : '24px',
        padding: isMobile ? '20px 16px 80px' : '24px 32px 80px',
      }}>
        {displayedBeats.map(beat => (
          <BeatCard
            key={beat.id}
            beat={beat}
            onClick={() => navigate(`/beats/${beat.id}`)}
            TEXT={TEXT}
            DIM={DIM}
          />
        ))}
      </div>

    </div>
  )
}

function Dropdown({ label, value, options, isOpen, onToggle, onSelect, TEXT, DIM, isLight  }: {
  label: string
  value: string
  options: string[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (v: string) => void
  TEXT: string
  DIM: string
  isLight: boolean
  
}) {
  const isActive = value !== 'ALL' && value !== 'All BPM'
  
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          fontSize: '10px',
          letterSpacing: '0.08em',
          padding: '6px 12px',
          border: `1px solid ${isActive ? (isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)') : (isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)')}`,
          borderRadius: '2px',
          color: isActive ? TEXT : DIM,
          background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
          transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        {label}: {value === 'ALL' || value === 'All BPM' ? '—' : value}
        <span style={{ opacity: 0.5, fontSize: '8px' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          background: isLight ? '#f5f5f5' : '#1e1e1e',
          border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '2px',
          zIndex: 50,
          minWidth: '160px',
          overflow: 'hidden',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '8px 14px',
                fontSize: '11px',
                color: value === opt ? TEXT : DIM,
                background: value === opt ? (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)') : 'transparent',
                letterSpacing: '0.04em',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = value === opt ? 'rgba(255,255,255,0.05)' : 'transparent')}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function BeatCard({ beat, onClick, TEXT, DIM }: { beat: typeof BEATS[0],TEXT: string, DIM: string, onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <div style={{
        aspectRatio: '2/3',
        overflow: 'hidden',
        borderRadius: '4px',
        marginBottom: '10px',
      }}>
        <img
          src={beat.img}
          alt={beat.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
            transition: 'transform 0.5s ease, filter 0.3s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            filter: hovered ? 'brightness(0.7)' : 'brightness(0.9)',
          }}
        />
      </div>
      <div style={{
        fontSize: '12px', fontWeight: 500,
        color: TEXT, marginBottom: '3px',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {beat.title}
      </div>
      <div style={{ fontSize: '11px', color: DIM }}>{beat.artist}</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', marginTop: '2px' }}>
        {beat.bpm} BPM · {beat.key}
      </div>
    </div>
  )
}