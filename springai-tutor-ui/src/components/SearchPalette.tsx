import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { features } from '../data/features'

interface SearchResult {
  id: string
  number: number
  title: string
  description: string
  href: string
}

const ALL_RESULTS: SearchResult[] = [
  { id: 'home', number: 0, title: 'Home', description: 'Quick start and server health check', href: '/' },
  { id: 'introduction', number: 0, title: 'Introduction', description: 'What this app does and how to use it', href: '/introduction' },
  { id: 'playground', number: 0, title: 'Playground', description: 'Freeform chat with personas and memory', href: '/playground' },
  { id: 'settings', number: 0, title: 'Settings', description: 'Configuration and feature flags', href: '/settings' },
  { id: 'call-log', number: 0, title: 'Call Log', description: 'History of API calls and responses', href: '/call-log' },
  { id: 'download', number: 0, title: 'Download Project', description: 'Download the full Spring AI project as a ZIP', href: '/download' },
  ...features.map((f) => ({
    id: f.id,
    number: f.number,
    title: f.title,
    description: f.description,
    href: `/feature/${f.id}`,
  })),
]

/**
 * SearchPalette - Cmd+K / Ctrl+K command palette for navigating features.
 *
 * Filters the full list of features + auxiliary pages by simple substring
 * match on title and description. Arrow keys navigate, Enter selects,
 * Escape closes. Renders nothing when closed.
 *
 * Mount this component once at the layout level (AppLayout).
 */
export default function SearchPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Global keyboard shortcut: Cmd+K (mac) or Ctrl+K (other).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key === 'k' || e.key === 'K'
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Focus the input when the palette opens, reset on close.
  useEffect(() => {
    if (open) {
      setQuery('')
      setHighlight(0)
      // Defer to next tick so the input is mounted.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const filtered = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALL_RESULTS
    return ALL_RESULTS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        String(r.number).includes(q)
    )
  }, [query])

  const choose = useCallback(
    (r: SearchResult) => {
      setOpen(false)
      navigate(r.href)
    },
    [navigate]
  )

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const r = filtered[highlight]
      if (r) choose(r)
    }
  }

  if (!open) return null

  return (
    <div
      className="search-palette-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Search features"
      onClick={() => setOpen(false)}
    >
      <div className="search-palette" onClick={(e) => e.stopPropagation()}>
        <div className="search-palette-header">
          <span className="search-palette-icon" aria-hidden>🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="search-palette-input"
            placeholder="Search features, pages, or jump to…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setHighlight(0)
            }}
            onKeyDown={onInputKey}
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="search-palette-kbd">ESC</kbd>
        </div>

        <ul className="search-palette-results" role="listbox">
          {filtered.length === 0 && (
            <li className="search-palette-empty">No matches for “{query}”</li>
          )}
          {filtered.map((r, i) => (
            <li
              key={r.id}
              role="option"
              aria-selected={i === highlight}
              className={`search-palette-result ${i === highlight ? 'active' : ''}`.trim()}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => choose(r)}
            >
              <span className="search-palette-num">{r.number > 0 ? r.number : '·'}</span>
              <span className="search-palette-text">
                <span className="search-palette-title">{r.title}</span>
                <span className="search-palette-desc">{r.description}</span>
              </span>
              <span className="search-palette-href">{r.href}</span>
            </li>
          ))}
        </ul>

        <div className="search-palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
