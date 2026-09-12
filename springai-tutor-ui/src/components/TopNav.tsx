import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchHealth, type HealthStatus } from '../api/health'
import ThemeToggle from './ThemeToggle'

export default function TopNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [checking, setChecking] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleHealthCheck = async () => {
    setChecking(true)
    try {
      setHealth(await fetchHealth())
    } catch {
      setHealth(null)
    } finally {
      setChecking(false)
    }
  }

  const handleGo = (path: string) => {
    setMenuOpen(false)
    navigate(path)
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <Link to="/" className="top-nav-logo" aria-label="Spring AI Tour home">
          <span className="top-nav-leaf" aria-hidden="true">◒</span>
          <span>Spring AI Tour</span>
        </Link>

        <nav className="top-nav-links" aria-label="Primary">
          <button type="button" className={`top-nav-link ${isActive('/') || isActive('/home') ? 'active' : ''}`} onClick={() => handleGo('/')}>Home</button>
          <button type="button" className={`top-nav-link ${isActive('/introduction') || location.pathname.startsWith('/feature/') ? 'active' : ''}`} onClick={() => handleGo('/introduction')}>Learn</button>
          <button type="button" className={`top-nav-link ${isActive('/playground') || isActive('/lab') ? 'active' : ''}`} onClick={() => handleGo('/lab')}>Lab</button>
          <button type="button" className="top-nav-link" onClick={() => window.open('https://docs.spring.io/spring-ai/reference/', '_blank', 'noopener,noreferrer')}>Docs</button>
          <button type="button" className="top-nav-link" onClick={() => window.open('https://github.com/spring-projects/spring-ai', '_blank', 'noopener,noreferrer')}>GitHub</button>
        </nav>

        <div className="top-nav-right">
          <button
            type="button"
            className={`health-pill ${health?.status === 'ready' ? 'health-pill--ready' : ''}`}
            onClick={handleHealthCheck}
            disabled={checking}
            title="Check local server status"
          >
            <span className={`health-dot ${health?.status === 'ready' ? 'health-dot--on' : ''}`} />
            {checking ? 'Checking…' : health?.status === 'ready' ? 'Connected' : 'Local Lab'}
          </button>
          <button type="button" className="btn btn-primary btn-sm top-nav-cta" onClick={() => handleGo('/introduction')}>
            Get Started
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="top-nav-mobile-menu">
          <button type="button" className={isActive('/') || isActive('/home') ? 'active' : ''} onClick={() => handleGo('/')}>Home</button>
          <button type="button" className={isActive('/introduction') || location.pathname.startsWith('/feature/') ? 'active' : ''} onClick={() => handleGo('/introduction')}>Learn</button>
          <button type="button" className={isActive('/playground') || isActive('/lab') ? 'active' : ''} onClick={() => handleGo('/lab')}>Lab</button>
          <button type="button" onClick={() => window.open('https://docs.spring.io/spring-ai/reference/', '_blank', 'noopener,noreferrer')}>Docs</button>
          <button type="button" onClick={() => window.open('https://github.com/spring-projects/spring-ai', '_blank', 'noopener,noreferrer')}>GitHub</button>
          <button type="button" className={isActive('/settings') ? 'active' : ''} onClick={() => handleGo('/settings')}>Settings</button>
        </div>
      )}
    </header>
  )
}
