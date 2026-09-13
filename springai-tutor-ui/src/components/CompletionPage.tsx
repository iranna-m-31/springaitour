import { Link } from 'react-router-dom'
import { useProgress } from './HomePage'
import { modules } from '../data/features'
import { getPhaseProgress, getOverallStats } from '../data/lessons'

export default function CompletionPage() {
  const { completed, percent, total } = useProgress()
  const phaseProgress = getPhaseProgress(completed)
  const overallStats = getOverallStats(completed)
  const overallPercent = overallStats.percent
  const totalLessons = overallStats.total

  const allDone = completed.size >= total

  const handleReset = () => {
    if (window.confirm('Reset all progress tracking? This will clear your completion marks.')) {
      localStorage.removeItem('spring-ai-tutor-progress')
      window.location.reload()
    }
  }

  return (
    <div className="completion-page fade-in">
      {/* ===== HERO ===== */}
      <section className="completion-hero">
        <div className="spring-badge">{allDone ? '🎓' : '📚'} Spring AI Tutorial</div>
        <h1>{allDone ? 'Congratulations!' : 'Keep Going!'}</h1>
        <p className="completion-tagline">
          {allDone
            ? "You've completed all {total} features in the Spring AI Tutorial. You're ready for production."
            : 'You\'re making great progress. Keep going — each feature brings you closer to mastering Spring AI.'}
        </p>
        <div className="completion-progress">
          <span>{completed.size} / {total} features ({percent}%)</span>
          <div className="progress-bar" style={{ height: '10px', maxWidth: '400px', margin: 'var(--space-3) auto 0' }}>
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU'VE LEARNED ===== */}
      <section className="completion-section">
        <h2>🏁 What You\'ve Learned</h2>
        <div className="skills-grid">
          <div className="skill-card">
            <div className="skill-icon">💬</div>
            <h3>Chat & Streaming</h3>
            <p>ChatClient, streaming responses, system prompts, templates</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon">🧠</div>
            <h3>Memory & Tools</h3>
            <p>Conversation memory, function calling, structured output</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon">🔍</div>
            <h3>RAG & Embeddings</h3>
            <p>Vector stores, similarity search, filtered retrieval, multimodal</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon">🛡️</div>
            <h3>Safety & Observability</h3>
            <p>Moderation, evaluation (LLM-as-a-Judge), metrics, MCP</p>
          </div>
        </div>
      </section>

      {/* ===== LEARNING PATH PROGRESS ===== */}
      <section className="completion-section">
        <h2>📊 Learning Path Progress</h2>
        <div className="module-grid">
          {modules.map((m) => {
            const moduleFeatures = m.features
            const completedCount = moduleFeatures.filter(id => completed.has(id)).length
            const modulePercent = Math.round((completedCount / moduleFeatures.length) * 100)
            return (
              <div key={m.id} className="module-card" style={{ textDecoration: 'none' }}>
                <div className="module-card-header">
                  <div className={`module-icon ${m.iconType}`}>{m.icon}</div>
                  <div>
                    <h3>{m.title}</h3>
                    <div className="module-card-badges">
                      <span className="feature-count">{completedCount}/{moduleFeatures.length} features</span>
                    </div>
                  </div>
                </div>
                <div className="progress-bar" style={{ marginTop: 'var(--space-2)' }}>
                  <div className="progress-fill" style={{ width: `${modulePercent}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== LESSON PHASE PROGRESS ===== */}
      <section className="completion-section">
        <h2>🧭 Phase Progress</h2>
        <div className="assessment-summary">
          {phaseProgress.map(p => (
            <div key={p.phaseId} className="assessment-phase-detail" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
              <h4>{p.phaseIcon} {p.phaseTitle}</h4>
              <p>{p.completed} of {p.total} lessons completed</p>
              <div className="assessment-progress-bar" style={{ marginTop: 'var(--space-2)' }}>
                <div className="assessment-progress-fill" style={{ width: `${p.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="overall-score" style={{ marginTop: 'var(--space-4)', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 'var(--space-2)' }}>
            Overall: {overallPercent}%
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>{completed.size} / {totalLessons} lessons • {completed.size}/{total} features</p>
        </div>
      </section>

      {/* ===== PRODUCTION CHECKLIST ===== */}
      <section className="completion-section">
        <h2>🔧 Production Checklist</h2>
        <ul className="checklist">
          <li>✅ Swap OpenRouter for your preferred provider (Azure, Ollama, Vertex, etc.)</li>
          <li>✅ Add Spring Security + OAuth2 for authentication</li>
          <li>✅ Configure distributed tracing (Micrometer + Zipkin/Prometheus)</li>
          <li>✅ Set up vector store persistence (PGVector, Redis, Weaviate, etc.)</li>
          <li>✅ Add circuit breakers & retry policies via Resilience4j</li>
          <li>✅ Implement structured logging with correlation IDs</li>
          <li>✅ Add automated eval pipelines for regression testing</li>
          <li>✅ Configure MCP server for external tool integration</li>
        </ul>
      </section>

      {/* Knowledge Assessment */}
      <section className="completion-assessment">
        <h2>📝 Knowledge Assessment</h2>
        <p>Test your understanding of Spring AI concepts. Ready to attempt the final challenge?</p>

        <button
          className="btn btn-primary btn-block"
          style={{ marginBottom: 'var(--space-6)' }}
          onClick={() => alert('Final knowledge assessment would be launched here. Attempt 10 questions testing all phases.')}>
          Take Final Knowledge Assessment
        </button>

        {allDone && (
          <div className="assessment-eligible">
            <p>🎓 You\'re eligible for the final capstone! Your mastery is complete across all phases.</p>
            <Link to="/capstone" className="btn btn-success btn-block" style={{ display: 'inline-flex', marginTop: 'var(--space-2)' }}>
              Start Capstone Project →
            </Link>
          </div>
        )}
      </section>

      <section className="completion-section">
        <div className="completion-actions">
          <Link to="/introduction" className="btn btn-outline">← Back to Introduction</Link>
          <Link to="/" className="btn btn-secondary">🏠 View All Features</Link>
          <Link to="/feature/plain-chat" className="btn btn-primary">🔁 Restart Tutorial</Link>
          <button className="btn btn-secondary" onClick={handleReset}>🔄 Reset Progress</button>
          <a href="https://github.com/iranna-m-31/springaitour" target="_blank" rel="noreferrer" className="btn btn-outline">⭐ Star on GitHub</a>
        </div>
      </section>

      <section className="completion-footer">
        <p>Built with Spring AI 2.0.1 • Spring Boot 4.1 • React + TypeScript</p>
        <p>Feedback? <a href="https://github.com/iranna-m-31/springaitour/issues" target="_blank" rel="noreferrer">Open an issue</a> or <a href="https://github.com/iranna-m-31/springaitour/discussions" target="_blank" rel="noreferrer">start a discussion</a></p>
      </section>
    </div>
  )
}
