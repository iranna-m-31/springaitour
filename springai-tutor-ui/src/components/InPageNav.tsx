import { useEffect, useRef, useState } from 'react'

export interface InPageTab {
  id: string
  label: string
}

interface InPageNavProps {
  tabs: InPageTab[]
}

/**
 * InPageNav - Sticky horizontal tab bar that scrolls to anchored sections
 * and highlights the currently visible one via IntersectionObserver.
 *
 * The tabs are anchored to <section id={tab.id}> elements that the parent
 * provides. The bar is sticky-positioned to the top of its scroll container
 * (the page main element). On mobile widths (<640px) it collapses to a
 * <select> dropdown.
 */
export default function InPageNav({ tabs }: InPageNavProps) {
  const [active, setActive] = useState<string>(tabs[0]?.id ?? '')
  const containerRef = useRef<HTMLElement | null>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Find the page's main scroll container.
  useEffect(() => {
    containerRef.current = document.querySelector('.feature-content')
  }, [])

  // Observe each section. The most-visible one wins.
  useEffect(() => {
    const elements = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio that's intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      {
        // Section counts as "active" when its top edge is in the upper third
        // of the viewport, which feels right for a sticky tab.
        root: containerRef.current,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [tabs])

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // Use a manual scroll so we can account for the sticky tab bar height.
    const tabBarHeight = 56 // matches .in-page-nav min-height
    const top = el.getBoundingClientRect().top + window.scrollY - tabBarHeight - 8
    window.scrollTo({ top, behavior: 'smooth' })
    setActive(id)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = tabs[(idx + 1) % tabs.length]
      handleClick(next.id)
      tabRefs.current[next.id]?.focus()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length]
      handleClick(prev.id)
      tabRefs.current[prev.id]?.focus()
    }
  }

  return (
    <nav className="in-page-nav" role="tablist" aria-label="Page sections">
      {/* Mobile dropdown */}
      <select
        className="in-page-nav-select"
        value={active}
        onChange={(e) => handleClick(e.target.value)}
        aria-label="Jump to section"
      >
        {tabs.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Desktop tabs */}
      <div className="in-page-nav-tabs" role="presentation">
        {tabs.map((t, idx) => {
          const isActive = t.id === active
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={t.id}
              className={`in-page-nav-tab ${isActive ? 'active' : ''}`.trim()}
              onClick={() => handleClick(t.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
