import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'spring-ai-theme'
type Theme = 'light' | 'dark'

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

/**
 * ThemeToggle - Switches between light and dark content themes.
 *
 * Implementation notes:
 * - The sidebar stays dark in both modes (it already reads well in both).
 * - The toggle mutates the `data-theme` attribute on <html>, which
 *   re-paints the page via CSS without a React re-render.
 * - Preference persists in localStorage.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => readInitialTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore quota / privacy errors.
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span className="theme-toggle-icon" aria-hidden>
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
      <span className="theme-toggle-label">
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}
