import { useRef, useState } from 'react'
import { fetchSource, type SourceResponse } from '../api/source'
import CodeView from './CodeView'
import DemoPanel from './DemoPanel'
import SetupBanner from './SetupBanner'
import InPageNav from './InPageNav'
import Skeleton from './Skeleton'
import CodeDiff from './CodeDiff'
import ArchitectureDiagram from './ArchitectureDiagram'
import Checkpoint from './Checkpoint'
import PrerequisitePanel from './PrerequisitePanel'
import { features, modules } from '../data/features'
import type { Feature } from '../data/features'
import { useProgress } from './HomePage'

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
  const isLastFeature = feature.number === 16
  const module = modules.find(m => m.id === feature.module)

  // Progress tracking + adjacent feature navigation
  const { completed, toggle, percent, total } = useProgress()
  const allFeatures = features
  const prevFeature = allFeatures.find(f => f.number === feature.number - 1)
  const nextFeature = allFeatures.find(f => f.number === feature.number + 1)
  const isCompleted = completed.has(feature.id)

  return (
    <div className="feature-page" ref={contentRef}>
      <SetupBanner />

      {/* Prerequisite awareness panel - shows before starting if prerequisites not met */}
      <PrerequisitePanel lessonId={feature.id} prerequisites={[]} />

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

        {/* Architecture Diagram */}
        {feature.architectureDiagram && (
          <section className="architecture-section" style={{ marginTop: 'var(--space-8)' }}>
            <h2>Architecture</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Visualizing the Spring AI request lifecycle for this feature.
              Click components to learn more about their role.
            </p>
            <ArchitectureDiagram
              components={feature.architectureDiagram.components}
              connections={feature.architectureDiagram.connections}
              docImage={feature.architectureDiagram?.docImage}
/>
          </section>
        )}

        {/* Code Diff: Before Spring AI vs With Spring AI */}
        {feature.codeDiff && (
          <section className="code-diff-section" style={{ marginTop: 'var(--space-8)' }}>
            <h2>Before Spring AI vs With Spring AI</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              See how Spring AI simplifies the implementation compared to manual HTTP calls.
            </p>
            <CodeDiff
              before={feature.codeDiff.before}
              after={feature.codeDiff.after}
              beforeTitle={feature.codeDiff.beforeTitle}
              afterTitle={feature.codeDiff.afterTitle}
              language="java"
            />
          </section>
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
            <a href="https://docs.spring.io/spring-ai/reference/concepts.html" target="_blank" rel="noreferrer">
              AI Concepts Overview →
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
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <p style={{ fontSize: '0.7rem', marginTop: 'var(--space-2)', color: 'var(--text-muted)' }}>
            {completed.size} / {total} features completed
          </p>
        </section>
      )}

      {/* Checkpoint - Test understanding at the end of each feature */}
      {feature.checkpoint && (
        <section className="checkpoint-section" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)' }}>
          <h2>Check Your Understanding</h2>
          <Checkpoint
            type={feature.checkpoint.type}
            question={feature.checkpoint.question}
            options={feature.checkpoint.options?.map(opt => ({ label: opt, value: opt })) ?? []}
            answer={feature.checkpoint.answer}
            explanation={feature.checkpoint.explanation}
          />
        </section>
      )}

      {/* Bottom navigation bar */}
      <nav className="feature-nav-bottom" aria-label="Feature navigation">
        <div className="feature-nav-bottom-left">
          <label className="mark-complete-check">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => toggle(feature.id)}
            />
            <span>Mark as complete</span>
          </label>
        </div>
        <div className="feature-nav-bottom-right">
          <button
            type="button"
            className="nav-prev"
            disabled={isFirstFeature}
            onClick={() => { if (prevFeature) window.location.href = `/feature/${prevFeature.id}` }}
          >
            ← {isFirstFeature ? 'Start' : 'Previous'}
          </button>
          {!isLastFeature ? (
            <button
              type="button"
              className="nav-next"
              onClick={() => { toggle(feature.id); window.location.href = `/feature/${nextFeature!.id}` }}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="nav-next nav-next--completed"
              onClick={() => { toggle(feature.id); window.location.href = '/completion' }}
            >
              🎓 Go to Completion
            </button>
          )}
        </div>
      </nav>
    </div>
  )
}