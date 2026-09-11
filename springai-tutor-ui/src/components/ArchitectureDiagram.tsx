import { useState } from 'react'

interface ArchitectureDiagramProps {
  /** The components/nodes in the architecture */
  components: Array<{
    id: string
    label: string
    type: 'java' | 'ai' | 'inspector' | 'llm' | 'client' | 'app' | 'spring'
    description: string
  }>

  /** Connections between components */
  connections: Array<{ from: string; to: string; label?: string }>

  /** Optional on-click handler for component clicks */
  onComponentClick?: (id: string) => void
}

const typeIcons: Record<string, string> = {
  java: '⚙️',
  ai: '🤖',
  inspector: '🔍',
  llm: '🧠',
  client: '📱',
  app: '🏠',
  spring: '🌿',
}

const typeColors: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  java:      { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.5)',  text: '#3b82f6', accent: '#dbeafe' },
  ai:        { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.5)',  text: '#ef4444', accent: '#fee2e2' },
  inspector: { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.5)',  text: '#22c55e', accent: '#dcfce7' },
  llm:       { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.5)', text: '#8b5cf6', accent: '#ede9fe' },
  client:    { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.5)', text: '#f59e0b', accent: '#fef3c7' },
  app:       { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.5)', text: '#10b981', accent: '#d1fae5' },
  spring:    { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.5)', text: '#ec4899', accent: '#fce7f3' },
}

/**
 * Interactive architecture diagram showing the Spring AI request lifecycle.
 *
 * Visualizes the flow:
 *   User → ChatClient → Advisor Chain → VectorStore → ChatModel → LLM → Response
 */
export default function ArchitectureDiagram({ components, connections, onComponentClick }: ArchitectureDiagramProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (id: string) => {
    setSelected(id)
    onComponentClick?.(id)
  }

  return (
    <div className="architecture-diagram" aria-label="Spring AI request lifecycle">
      <div className="architecture-diagram-container" style={{ position: 'relative', padding: 'var(--space-4)', minHeight: '200px' }}>
        {/* SVG-based connections */}
        <svg className="architecture-connections" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          {connections.map(conn => {
            const fromComp = components.find(c => c.id === conn.from)
            const toComp = components.find(c => c.id === conn.to)
            return (
              <line
                key={`${conn.from}-${conn.to}`}
                x1={fromComp ? 80 : 0}
                y1={fromComp ? 40 : 0}
                x2={toComp ? 80 : 0}
                y2={toComp ? 40 : 0}
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            )
          })}
        </svg>

        {/* Component boxes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          {components.map(comp => {
            const colors = typeColors[comp.type] || typeColors.java
            const isSelected = selected === comp.id
            return (
              <div
                key={comp.id}
                className="architecture-component"
                onClick={() => handleClick(comp.id)}
                role="button"
                tabIndex={0}
                aria-label={comp.label}
                style={{
                  background: colors.bg,
                  border: `2px solid ${isSelected ? colors.text : colors.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  width: '160px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 0 3px ${colors.accent}` : '0 1px 3px rgba(0,0,0,0.1)',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                  {typeIcons[comp.type] || '📦'}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: colors.text, marginBottom: '4px' }}>
                  {comp.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {comp.description}
                </div>
                <div style={{
                  marginTop: '6px',
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.6rem',
                  background: colors.accent,
                  color: colors.text,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}>
                  {comp.type}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected component info */}
      {selected && (
        <div className="architecture-component-info" style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)' }}>
          <h4 className="architecture-info-header" style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            {components.find(c => c.id === selected)?.label}
          </h4>
          <p className="architecture-info-desc" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {components.find(c => c.id === selected)?.description}
          </p>
        </div>
      )}
    </div>
  )
}