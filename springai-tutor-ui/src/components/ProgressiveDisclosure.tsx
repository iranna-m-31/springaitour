import { useState } from 'react'

interface DisclosureSection {
  level: 'basic' | 'advanced' | 'internals'
  title: string
  description: string
  content: React.ReactNode
  defaultOpen?: boolean
}

interface ProgressiveDisclosureProps {
  sections: DisclosureSection[]
  defaultLevel?: 'basic' | 'advanced' | 'internals'
}

export default function ProgressiveDisclosure({ sections, defaultLevel = 'basic' }: ProgressiveDisclosureProps) {
  const [openLevel, setOpenLevel] = useState<'basic' | 'advanced' | 'internals'>(defaultLevel)

  return (
    <div className="progressive-disclosure">
      <div className="disclosure-controls">
        {[
          { level: 'basic', label: 'Basic', icon: '🟢' },
          { level: 'advanced', label: 'Advanced', icon: '🟡' },
          { level: 'internals', label: 'Internals', icon: '🔴' }
        ].map(ctrl => (
          <button
            key={ctrl.level}
            type="button"
            className={`disclosure-level-btn ${openLevel === ctrl.level ? 'active' : ''}`}
            onClick={() => setOpenLevel(ctrl.level as 'basic' | 'advanced' | 'internals')}
          >
            <span className="disclosure-icon">{ctrl.icon}</span>
            <span className="disclosure-label">{ctrl.label}</span>
          </button>
        ))}
      </div>

      <div className="disclosure-content">
        {sections
          .filter(s => {
            if (openLevel === 'basic') return s.level === 'basic'
            if (openLevel === 'advanced') return s.level === 'basic' || s.level === 'advanced'
            return true // internals shows all
          })
          .map((section, idx) => (
            <div
              key={section.level}
              className={`disclosure-section disclosure-section--${section.level}`}
            >
              <h4 className={`disclosure-section-title ${section.level === 'basic' ? '' : section.level === 'advanced' ? 'disclosure-section--advanced' : 'disclosure-section--internals'}`}>
                {section.level === 'basic' && 'Basic'}
                {section.level === 'advanced' && 'Advanced'}
                {section.level === 'internals' && 'Internals'}
              </h4>
              <p className="disclosure-section-desc">{section.description}</p>
              <div className="disclosure-section-content">
                {section.content}
              </div>
              {idx < sections.length - 1 && (
                <div className="disclosure-divider" />
              )}
            </div>
          ))
        }
      </div>
    </div>
  )
}