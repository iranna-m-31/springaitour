import { useRef, useState } from 'react'
import { fetchSource, type SourceResponse } from '../api/source'
import CodeView from './CodeView'
import DemoPanel from './DemoPanel'
import SetupBanner from './SetupBanner'
import InPageNav from './InPageNav'
import Skeleton from './Skeleton'
import { modules } from '../data/features'
import type { Feature } from '../data/features'

interface FeaturePageProps {
  feature: Feature
}

export default function FeaturePage({ feature }: FeaturePageProps) {
  const [source, setSource] = useState<SourceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleLoadSource = async () => {
    if (!feature.sourceFiles || feature.sourceFiles.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSource(feature.id)
      // Use the first file's content for the viewer
      if (data && data.length > 0) {
        setSource(data[0])
      }
    } catch (err) {
      setError('Failed to load source code')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'source', label: 'Source' },
    { id: 'demo', label: 'Try It' },
    { id: 'docs', label: 'Docs' },
  ]

  const isFirstFeature = feature.number === 1
  const module = modules.find(m => m.id === feature.module)

  return (
    <div className="feature-page" ref={contentRef}>
      <SetupBanner />

      <section className="feature-page-hero" id="overview-top">
        <div className="feature-page-header">
          <span className="feature-page-number">{feature.number}</span>
          <h1>{feature.title}</h1>
        </div>
        <p className="feature-page-endpoint">{feature.endpoint}</p>
      </section>

      <InPageNav tabs={tabs} />

      <section id="overview" className="feature-page-explanation">
        <h2>What is this?</h2>
        <p>{feature.description}</p>
        {feature.concepts && feature.concepts.length > 0 && (
          <div className="concept-tag-list">
            {feature.concepts.map((c) => (
              <span key={c} className="concept-tag">{c}</span>
            ))}
          </div>
        )}

        {/* Module context if this has one */}
        {module && (
          <div className="module-context">
            <span className="feature-page-endpoint" style={{ marginTop: 'var(--space-3)' }}>
              <strong>Part of:</strong> {module.title}
            </span>
          </div>
        )}
      </section>

      <section id="source" className="feature-page-source">
        <h2>Implementation (with Line Numbers)</h2>
        <p className="feature-page-source-desc">
          View the actual Spring AI source code behind this feature.
          Key implementation lines are highlighted in blue.
        </p>
        <button className="source-load-btn" onClick={handleLoadSource} disabled={loading}>
          {loading ? 'Loading source...' : '📄 View Source Code'}
        </button>
        {error && <p className="error-box">{error}</p>}
        {loading && !source && <Skeleton lines={8} />}
        {source && (
          <CodeView code={source.content} filename={source.file} />
        )}
      </section>

      <section id="demo" className="feature-page-demo">
        <h2>Try It Live</h2>
        <p>Configure the parameters below and click "Try It" to call the real Spring AI backend.</p>
        <DemoPanel key={feature.id} feature={feature} />
      </section>

      <section id="docs" className="feature-page-docs">
        <h2>Official Documentation</h2>
        <ul className="docs-list">
          <li>
            <a href="https://docs.spring.io/spring-ai/reference/index.html" target="_blank" rel="noreferrer">
              Spring AI 2.0.1 Reference Documentation →
            </a>
          </li>
          <li>
            <a href="https://docs.spring.io/spring-ai/reference/api/chatclient.html" target="_blank" rel="noreferrer">
              ChatClient API →
            </a>
          </li>
          <li>
            <a href="https://docs.spring.io/spring-ai/reference/model/overview.html" target="_blank" rel="noreferrer">
              Models Overview →
            </a>
          </li>
        </ul>
        <p className="docs-note">
          The official Spring AI documentation provides comprehensive guides, configuration options,
          and detailed examples. Use the links above to dive deeper into each topic.
        </p>
      </section>

      {/* Progress indicator at bottom if not first feature */}
      {!isFirstFeature && feature.module && (
        <section className="module-progress" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6) var(--space-4)', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)', marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontSize: '0.875rem', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
            Learning Progress
          </h3>
          <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-3)', color: 'var(--text-muted)' }}>
            Move through the modules:
            <span style={{ color: 'var(--spring-green)', fontWeight: 500 }}>
              {module?.id === 'foundations' ? 'Foundations → Core → Advanced → Specialized' : ''}
            </span>
          </p>
          <div className="progress-bar" style={{ height: '6px' }}>
            <div className="progress-fill" style={{ width: '100%' }} />
          </div>
        </section>
      )}
    </div>
  )
}