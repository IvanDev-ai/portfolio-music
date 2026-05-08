import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SCENES, SCENE_CATEGORIES } from '../data/scenes'

const ALL_TYPES = ['Orchestral', 'Epic', 'Ambient', 'Alt RnB', 'Synth Pop', 'Dark Ambient']
const ALL_MOODS = ['Atmospheric', 'Euphoric', 'Tense', 'Cinematic', 'Emotional']

export default function SceneCategory({ theme = 'light' }: { theme?: 'dark' | 'light' }) {
  const { cat } = useParams()
  const navigate = useNavigate()
  const label = decodeURIComponent(cat || '')
  const isAll = label === 'ALL'
  const isMobile = window.innerWidth < 768

  const isLight = theme === 'light'
  const BG = isLight ? '#ffffff' : '#141414'
  const TEXT = isLight ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.88)'
  const DIM = isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.38)'
  const BORDER = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'

  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterType, setFilterType] = useState('ALL')
  const [filterMood, setFilterMood] = useState('ALL')
  const [filterFormat, setFilterFormat] = useState('ALL')
  const [openDrop, setOpenDrop] = useState<string | null>(null)
  const [mobileCols, setMobileCols] = useState(1)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const scenes = SCENES.filter(s => {
    if (!isAll && s.category !== label) return false
    if (isAll && filterCategory !== 'ALL' && s.category !== filterCategory) return false
    if (filterType !== 'ALL' && !s.type.includes(filterType)) return false
    return true
  })

  const toggleDrop = (name: string) => setOpenDrop(o => o === name ? null : name)
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
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 32px 0',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => navigate('/cine')}
            style={{ fontSize: '11px', letterSpacing: '0.06em', color: DIM, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
            onMouseLeave={e => (e.currentTarget.style.color = DIM)}
          >
            ← CINE
          </button>
          <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', color: TEXT }}>
            {label}
          </span>
        </div>

        {/* TOGGLE COLS — mobile */}
        {isMobile && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2].map(n => (
              <button
                key={n}
                onClick={() => setMobileCols(n)}
                style={{
                  width: '32px', height: '32px',
                  border: `1px solid ${mobileCols === n ? TEXT : BORDER}`,
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '2px',
                }}
              >
                {Array.from({ length: n }).map((_, i) => (
                  <div key={i} style={{
                    width: n === 1 ? '14px' : '6px', height: '14px',
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
          display: 'flex', gap: '10px',
          padding: '20px 32px 0', flexWrap: 'wrap',
        }}>
          <Dropdown
            label="Category"
            value={filterCategory}
            options={['ALL', ...SCENE_CATEGORIES]}
            isOpen={openDrop === 'category'}
            onToggle={() => toggleDrop('category')}
            onSelect={v => { setFilterCategory(v); setOpenDrop(null) }}
            TEXT={TEXT} DIM={DIM} isLight={isLight}
          />
          <Dropdown
            label="Type"
            value={filterType}
            options={['ALL', ...ALL_TYPES]}
            isOpen={openDrop === 'type'}
            onToggle={() => toggleDrop('type')}
            onSelect={v => { setFilterType(v); setOpenDrop(null) }}
            TEXT={TEXT} DIM={DIM} isLight={isLight}
          />
          <Dropdown
            label="Mood"
            value={filterMood}
            options={['ALL', ...ALL_MOODS]}
            isOpen={openDrop === 'mood'}
            onToggle={() => toggleDrop('mood')}
            onSelect={v => { setFilterMood(v); setOpenDrop(null) }}
            TEXT={TEXT} DIM={DIM} isLight={isLight}
          />
          <Dropdown
            label="Format"
            value={filterFormat}
            options={['ALL', ...ALL_FORMATS]}
            isOpen={openDrop === 'format'}
            onToggle={() => toggleDrop('format')}
            onSelect={v => { setFilterFormat(v); setOpenDrop(null) }}
            TEXT={TEXT} DIM={DIM} isLight={isLight}
          />
        </div>
      )}
      {label === 'AI Generated' && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          padding: '12px 16px',
          background: 'rgba(200,0,42,0.06)',
          border: '1px solid rgba(200,0,42,0.15)',
          borderRadius: '6px',
          margin: '20px 32px 0',
        }}>
          <span style={{ fontSize: '14px', flexShrink: 0 }}>✦</span>
          <span style={{ fontSize: '11px', color: DIM, lineHeight: 1.6, letterSpacing: '0.02em' }}>
            These visuals are AI-generated. Currently working without a visual collaborator,
            and real footage is limited by copyright. The music and composition are original —
            the imagery is a placeholder for the atmosphere.
          </span>
        </div>
      )}
      {/* GRID 9/16 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: isMobile ? '12px' : '20px',
        padding: isMobile ? '20px 16px 80px' : '24px 32px 80px',
      }}>
        {scenes.map(scene => (
          <div
            key={scene.id}
            onClick={() => navigate(`/cine/${scene.id}`)}
            onMouseEnter={() => setHoveredId(scene.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{
              width: '100%', aspectRatio: '9/16',
              borderRadius: '6px', overflow: 'hidden',
              marginBottom: '10px',
            }}>
              <img
                src={scene.img} alt={scene.title}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                  transition: 'transform 0.5s ease, filter 0.3s ease',
                  transform: hoveredId === scene.id ? 'scale(1.04)' : 'scale(1)',
                  filter: hoveredId === scene.id ? 'brightness(0.7)' : 'brightness(0.9)',
                }}
              />
            </div>
            <div style={{
              fontSize: '12px', fontWeight: 500, color: TEXT,
              marginBottom: '3px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {scene.title}
            </div>
            <div style={{ fontSize: '10px', color: DIM }}>{scene.type}</div>
            <div style={{ fontSize: '10px', color: DIM, marginTop: '2px' }}>
              {scene.category} · {scene.year}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

function Dropdown({ label, value, options, isOpen, onToggle, onSelect, TEXT, DIM, isLight }: {
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
  const isActive = value !== 'ALL'

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          fontSize: '10px', letterSpacing: '0.08em',
          padding: '6px 12px',
          border: `1px solid ${isActive ? TEXT : (isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)')}`,
          borderRadius: '2px',
          color: isActive ? TEXT : DIM,
          background: isActive ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)') : 'transparent',
          transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
      >
        {label}: {value === 'ALL' ? '—' : value}
        <span style={{ opacity: 0.5, fontSize: '8px' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)', left: 0,
          background: isLight ? '#f5f5f5' : '#1e1e1e',
          border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '2px',
          zIndex: 50, minWidth: '160px', overflow: 'hidden',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 14px', fontSize: '11px',
                color: value === opt ? TEXT : DIM,
                background: value === opt
                  ? (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)')
                  : 'transparent',
                letterSpacing: '0.04em', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = value === opt ? (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)') : 'transparent')}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}