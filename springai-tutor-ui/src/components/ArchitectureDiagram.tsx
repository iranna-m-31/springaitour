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

  const componentStyle = (id: string) => {
    const comp = components.find(c => c.id === id)
    if (!comp) return {}
    const base = {
      padding: '12px',
      borderRadius: '8px',
      margin: '8px',
      fontSize: '0.75rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    }
    const typeStyles: Record<string, Record<string, string>> = {
      java: { background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' },
      ai: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
      inspector: { background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' },
      llm: { background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' },
      client: { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' },
    }
    const style = typeStyles[comp.type] || {}
    return { ...base, ...style }
  }

  return (
    <div className="architecture-diagram" aria-label="Spring AI request lifecycle">
      <div className="architecture-diagram-container">
        {/* Draw connections first (behind components) */}
        <div className="architecture-connections">
          {connections.map(conn => (
            <div
              key={conn.from}
              className="architecture-connection"
              style={{
                position: 'absolute',
                stroke: '#94a3b8',
                strokeWidth: 2,
                fill: '#94a3b8',
              }}
            >
              {/* Simple line representation */}
              {/** In a full implementation, this would use an SVG path library **/}
            </div>
          ))}
        </div>

        {/* Then the components */}
        {components.map(comp => (
          <div
            key={comp.id}
            className="architecture-component"
            onClick={() => handleClick(comp.id)}
            style={componentStyle(comp.id)}
            role="button"
            tabIndex={0}
            aria-label={comp.label}
          >
            <div className="architecture-comp-type" style={{ fontSize: '0.7rem', marginBottom: '4px' }}>
              {comp.type}
            </div>
            <div className="architecture-comp-label">{comp.label}</div>
            <div className="architecture-comp-desc" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {comp.description}
            </div>
          </div>
        ))}
      </div>

      {/* Selected component info */}
      {selected && (
        <div className="architecture-component-info">
          <h4 className="architecture-info-header">{selected}</h4>
          <p className="architecture-info-desc">
            Click a component above to explore its role in the Spring AI request lifecycle.
          </p>
        </div>
      )}
    </div>
  )
}