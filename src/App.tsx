import { useState, useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import './index.css'
import Nav from './components/Nav'
import VideoHero from './components/VideoHero'
import Cine from './pages/Cine'
import Beats from './pages/Beats'
import BeatDetail from './pages/BeatDetail'
import { useLocation } from 'react-router-dom'
import BeatCategory from './pages/BeatCategory'
import SceneDetail from './pages/SceneDetail'
import SceneCategory from './pages/SceneCategory'
import WhoAmI from './pages/WhoAmI'
import Contacto from './pages/Contacto'

function AppContent() {
  const [muted, setMuted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const videoRef = useRef<HTMLVideoElement>(null!)
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  useEffect(() => {
  document.body.style.background = theme === 'light' ? '#fff' : '#080808'
  document.body.style.color = theme === 'light' ? '#0a0a0a' : '#f0ede8'
}, [theme])
  useEffect(() => {
    if (location.pathname === '/') {
      document.body.classList.add('is-main')
    } else {
      document.body.classList.remove('is-main')
    }
  }, [location.pathname])
    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 768)
      window.addEventListener('resize', check)
      return () => window.removeEventListener('resize', check)
    }, [])

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !muted
    setMuted(m => !m)
  }

  const togglePause = () => {
    if (videoRef.current) {
      paused ? videoRef.current.play() : videoRef.current.pause()
    }
    setPaused(p => !p)
  }

  const handleVolume = (v: number) => {
    setVolume(v)
    if (videoRef.current) {
      videoRef.current.volume = v
      videoRef.current.muted = v === 0
    }
    setMuted(v === 0)
  }
  return (
    <>
      <Nav
        onMuteToggle={toggleMute}
        muted={muted}
        paused={paused}
        onPauseToggle={togglePause}
        volume={volume}
        onVolumeChange={handleVolume}
        isMobile={isMobile}
        theme={theme}  
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />
      <Routes>
        <Route path="/" element={
          <VideoHero
            videoRef={videoRef}
            muted={muted}
            paused={paused}
            onProgressChange={setProgress}
            progress={progress}
            isMobile={isMobile}
            onEnd={() => navigate('/cine')}
          />
        } />
        <Route path="/beats" element={<Beats theme={theme} />} />
        <Route path="/beats/category/:genre" element={<BeatCategory theme={theme} />} />
        <Route path="/beats/:id" element={<BeatDetail />} />
        <Route path="/cine" element={<Cine theme={theme} />} />
        <Route path="/cine/category/:cat" element={<SceneCategory theme={theme} />} />
        <Route path="/cine/:id" element={<SceneDetail />} />
        <Route path="/whoami" element={<WhoAmI theme={theme} />} />
        <Route path="/contacto" element={<Contacto theme={theme} />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}