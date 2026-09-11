import { Link, useNavigate } from 'react-router-dom'
import { features, modules } from '../data/features'
import { fetchHealth } from '../api/health'
import { useState, useCallback } from 'react'
import type { HealthStatus } from '../api/health'
import Skeleton from './Skeleton'

/** Simple progress tracker using localStorage */
export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('spring-ai-tutor-progress')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  const toggle = useCallback((id: string) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem('spring-ai-tutor-progress', JSON.stringify([...next]))
      return next
    })
  }, [])

  const percent = features.length > 0 ? Math.round((completed.size / features.length) * 100) : 0
  return { completed, toggle, percent, total: features.length }
}

export default function HomePage() {
  const navigate = useNavigate()
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const { completed, percent, total } = useProgress()

  const handleCheck = async () => {
    setLoading(true)
    try {
      const data = await fetchHealth()
      setHealth(data)
    } catch { setHealth(null) } finally { setLoading(false); setChecked(true) }
  }

  const isReady = health?.status === 'ready'

  return (
    <div className="home-page">
      {/* ===== HERO ===== */}
      <section className="hero fade-in">
        <div className="spring-badge">Spring AI 2.0.1</div>
        <h1>Interactive Spring AI Tutorial</h1>
        <p className="subtitle">
          16 hands-on demos — each with live API calls, real responses, and the actual Java source behind them.
          Follow the learning path from first chat call to production-ready RAG.
        </p>
        <p className="hero-tagline">Learn AI, RAG, embeddings, and more with Spring AI</p>
      </section>

      {/* ===== WHAT IS SPRING AI? ===== */}
      <section className="intro-section fade-in" style={{ marginTop: 'var(--space-10)' }}>
        <h2>📖 What is Spring AI?</h2>
        <p>
          Spring AI provides a portable API for AI operations across multiple LLM providers.
          It abstracts away vendor-specific details while giving you access to the full power of
          modern AI models.
        </p>
        <ul style={{ marginRight: '2rem' }}>
          <li><strong>Portable API</strong> — Same code works with OpenAI, Anthropic, Azure, Ollama, and more</li>
          <li><strong>ChatClient</strong> — Fluent, testable API for LLM interactions</li>
          <li><strong>Advisors</strong> — Cross-cutting concerns like logging, memory, RAG, safety</li>
          <li><strong>RAG Support</strong> — Vector stores, document readers, similarity search</li>
          <li><strong>Tool Calling</strong> — Let the LLM decide when to use your Java methods</li>
        </ul>
      </section>

      {/* ===== LEARNING PATH OVERVIEW ===== */}
      <section className="learning-path fade-in">
        <h2>Learning Path</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          Follow these 4 modules in order. Each builds on the previous. Click any module to jump in.
        </p>

        <div className="module-grid">
          {modules.map((m) => {
            const moduleFeatures = m.features
            const completedCount = moduleFeatures.filter(id => completed.has(id)).length
            const modulePercent = Math.round((completedCount / moduleFeatures.length) * 100)

            return (
              <Link
                key={m.id}
                to={`/feature/${moduleFeatures[0]}`}
                className="module-card"
              >
                <div className="module-card-header">
                  <div className={`module-icon ${m.iconType}`}>{m.icon}</div>
                  <div>
                    <h3>{m.title}</h3>
                    <span className="feature-count">{moduleFeatures.length} features · {completedCount} completed</span>
                  </div>
                </div>
                <p>{m.description}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${modulePercent}%` }} />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Overall progress */}
        <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4) var(--space-6)', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <strong style={{ fontSize: '0.875rem' }}>Overall Progress</strong>
            <span style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{completed.size} / {total} features</span>
          </div>
          <div className="progress-bar" style={{ height: '8px' }}>
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      {/* ===== QUICK START ===== */}
      {/* ===== PREQUISITES ===== */}
      <section className="intro-section fade-in" style={{ marginTop: 'var(--space-10)' }}>
        <h2>🔧 Prerequisites</h2>
        <ul>
          <li>Java 21+ and Spring Boot 4.1.x</li>
          <li>An OpenRouter API key (or any OpenAI-compatible provider)</li>
          <li>Basic familiarity with Spring Boot and REST APIs</li>
          <li>Docker (optional, for vector store demos)</li>
        </ul>
      </section>

      {/* ===== QUICK START ===== */}
      <section className="quick-start fade-in" style={{ marginTop: 'var(--space-12)' }}>
        <h2>🚀 Quick Start</h2>
        <ol>
          <li>Clone the repo and <code>cd springai</code></li>
          <li>Configure your OpenRouter API key in <code>.env</code></li>
          <li>Start the server: <code>./gradlew bootRun</code></li>
          <li>Open <code>http://localhost:8080</code></li>
          <li>Complete the Health Check below</li>
        </ol>
        <p className="hint">No Node.js, no Docker required for sections 1–11. Sections 12–16 may require Docker for vector stores or paid API keys.</p>
      </section>

      {/* ===== HEALTH CHECK ===== */}
      <section className="health-verification" id="health-check" style={{ marginTop: 'var(--space-8)' }}>
        <h2>🩺 Server Health Check</h2>
        <p>Verify the server is running and properly configured before exploring features.</p>

        <div className="health-check-box">
          <button className="health-check-btn" onClick={handleCheck} disabled={loading}>
            {loading ? 'Checking...' : '🩺 Check Server Health'}
          </button>

          {checked && health && (
            <div className="health-details">
              <p>Status: <strong style={{ color: isReady ? 'var(--spring-green)' : 'var(--spring-amber)' }}>
                {isReady ? '✅ Ready' : '⚠️ Needs setup'}
              </strong></p>
              <p>API Key: <code>{health.apiKeyConfigured ? health.apiKeyPreview : 'Not configured'}</code></p>
              <p>Chat Model: <code>{health.chatModel || 'not set'}</code></p>
              <p>Embedding Model: <code>{health.embeddingModel || 'not set'}</code></p>
              <p>Vector Store: <code>{health.vectorStore}</code></p>
              <p>Moderation: {health.moderationEnabled ? '✅ enabled' : '❌ disabled'}</p>
              <p>Actuator: {health.actuatorEnabled ? '✅ enabled' : '❌ disabled'}</p>
              {health.status === 'ready' && (
                <p style={{ color: 'var(--spring-green)', marginTop: '0.5rem' }}>✅ Server is healthy. You can now explore features.</p>
              )}
              {health.status !== 'ready' && (
                <p style={{ color: 'var(--spring-amber)', marginTop: '0.5rem' }}>⚠️ API key not configured. LLM calls will fail until you add a key.</p>
              )}
            </div>
          )}

          {loading && <div className="health-details"><Skeleton lines={5} lastWidth="70%" /></div>}

          {checked && !health && (
            <div className="setup-warning">
              <p>❌ Server is not reachable. Make sure you have started it with: <code>./gradlew bootRun</code></p>
            </div>
          )}

          <div className="health-actions" style={{ marginTop: 'var(--space-4)' }}>
            <button className="health-btn health-btn-primary" onClick={() => window.location.href = '/api/tutor/health'}>
              Check /api/tutor/health directly
            </button>
            <button className="health-btn health-btn-primary" onClick={() => navigate('/feature/plain-chat')}>
              → Try Plain Chat demo
            </button>
          </div>
        </div>
      </section>

      {/* ===== DOCUMENTATION ===== */}
      <section className="intro-section fade-in" style={{ marginTop: 'var(--space-10)' }}>
        <h2>📚 Documentation</h2>
        <ul>
          <li><a href="https://docs.spring.io/spring-ai/reference/index.html" target="_blank" rel="noreferrer">Spring AI 2.0.1 Reference →</a></li>
          <li><a href="https://docs.spring.io/spring-ai/reference/chat/chat-client.html" target="_blank" rel="noreferrer">ChatClient API →</a></li>
          <li><a href="https://docs.spring.io/spring-ai/reference/model/model-index.html" target="_blank" rel="noreferrer">Models Overview →</a></li>
        </ul>
      </section>

      {/* ===== START TUTORIAL CTA ===== */}
      <section className="intro-section" style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
        <Link to="/feature/plain-chat" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: 'var(--space-4) var(--space-8)' }}>
          🚀 Start Tutorial →
        </Link>
        <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Begins with <strong>Plain Chat</strong> (Feature 1 of 16)
        </p>
      </section>
    </div>
  )
}
