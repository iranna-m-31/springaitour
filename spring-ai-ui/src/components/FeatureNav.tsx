import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { features, modules } from '../data/features'
import ThemeToggle from './ThemeToggle'

export default function FeatureNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname
  const isActive = (path: string) => currentPath === path

  const goToFeature = (id: string) => {
    navigate(`/feature/${id}`)
  }

  const goToPage = (path: string) => {
    navigate(path)
  }

  // Detect platform for the keyboard shortcut hint.
  const [isMac, setIsMac] = useState(false)
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform))
    }
  }, [])

  const openSearch = () => {
    // Dispatch a synthetic Cmd+K so SearchPalette (mounted in AppLayout) hears it.
    const ev = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: !isMac,
      metaKey: isMac,
      bubbles: true,
    })
    window.dispatchEvent(ev)
  }

  return (
    <nav className="feature-nav">
      <div className="sidebar-logo">
        <h2><span className="spring-icon">⬢</span>Spring AI Tutor</h2>
        <div className="sidebar-logo-actions">
          <button
            type="button"
            className="sidebar-search-trigger"
            onClick={openSearch}
            aria-label="Open search palette"
            title="Search features (⌘K)"
          >
            <span>🔍 Search</span>
            <kbd className="sidebar-search-kbd">{isMac ? '⌘' : 'Ctrl'}K</kbd>
          </button>
          <button
            type="button"
            className="sidebar-settings-trigger"
            onClick={() => goToPage('/settings')}
            aria-label="Settings"
            title="Settings (⌘,)"
          >
            ⚙️
          </button>
        </div>
      </div>

      <div className="sidebar-nav">
        <ul>
          {/* Introduction link always first */}
          <li
            className={isActive('/introduction') ? 'active' : ''}
            onClick={() => goToPage('/introduction')}
          >
            <span className="feature-number">★</span>
            <span className="feature-title">Introduction</span>
          </li>

          {/* Modules with features */}
          {modules.map((module) => (
            <React.Fragment key={module.id}>
              <li className="module-section">
                <h3>{module.title}</h3>
              </li>
              {module.features.map((fid) => {
                const feature = features.find(f => f.id === fid)
                if (!feature) return null
                return (
                  <li
                    key={feature.id}
                    className={isActive(`/feature/${feature.id}`) ? 'active' : ''}
                    onClick={() => goToFeature(feature.id)}
                  >
                    <span className="feature-number">{feature.number}</span>
                    <span className="feature-title">{feature.title}</span>
                    <span className="feature-badges">
                      {feature.dockerOptional && <span className="badge badge-docker-optional">🐳 Docker (opt.)</span>}
                      {feature.requiresDocker && !feature.dockerOptional && <span className="badge badge-docker">🐳 Docker</span>}
                      {feature.requiresPaidKey && <span className="badge badge-paid">🔑 Paid</span>}
                    </span>
                  </li>
                )
              })}
            </React.Fragment>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="nav-divider" />

        <button
          className={`nav-link${isActive('/playground') ? ' active' : ''}`}
          onClick={() => goToPage('/playground')}
        >
          🧪 Playground
        </button>
        <button
          className={`nav-link${isActive('/call-log') ? ' active' : ''}`}
          onClick={() => goToPage('/call-log')}
        >
          📋 Call Log
        </button>
        <button
          className={`nav-link${isActive('/completion') ? ' active' : ''}`}
          onClick={() => goToPage('/completion')}
        >
          🎓 Completion
        </button>
        <button
          className={`nav-link nav-download${isActive('/download') ? ' active' : ''}`}
          onClick={() => goToPage('/download')}
        >
          📦 Download Project
        </button>

        <div className="nav-divider" />
        <ThemeToggle />
      </div>
    </nav>
  )
}