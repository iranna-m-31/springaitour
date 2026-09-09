import { Link } from 'react-router-dom'
import { useProgress } from './HomePage'
import { lessons, getPhaseProgress, getOverallStats } from '../data/lessons'

export default function CompletionPage() {
  const { completed, percent, total } = useProgress()
  const phaseProgress = getPhaseProgress(completed)
  const overallStats = getOverallStats(completed)
  const overallPercent = overallStats.percent
  const totalLessons = overallStats.total

  const handleReset = () => {
    if (window.confirm('Reset all progress tracking? This will clear your completion marks.')) {
      localStorage.removeItem('spring-ai-tutor-progress')
      window.location.reload()
    }
  }

  return (
    <div className="completion-page fade-in">
      <section className="completion-hero">
        <div className="completion-badge">🎓</div>
        <h1>Congratulations!</h1>
        <p className="completion-tagline">
          You've completed all {total} features in the Spring AI Tutorial.
        </p>
        <div className="completion-progress">
          <span>{completed.size} / {total} features</span>
          <div className="progress-bar" style={{ height: '10px', maxWidth: '300px', margin: 'var(--space-4) auto 0' }}>
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      <section className="completion-section">
        <h2>🏁 What You've Learned</h2>
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

      <section className="completion-section">
        <h2>🚀 What's Next?</h2>
        <div className="next-steps">
          <Link to="/playground" className="next-step-card">
            <div className="next-step-icon">🧪</div>
            <div>
              <h3>Playground</h3>
              <p>Experiment freely with any model, parameters, and prompts in a sandbox.</p>
            </div>
          </Link>
          <Link to="/call-log" className="next-step-card">
            <div className="next-step-icon">📋</div>
            <div>
              <h3>Call Log</h3>
              <p>Review your API call history, inspect requests/responses, debug issues.</p>
            </div>
          </Link>
          <Link to="/settings" className="next-step-card">
            <div className="next-step-icon">⚙️</div>
            <div>
              <h3>Settings</h3>
              <p>Configure models, API keys, and toggle advanced features.</p>
            </div>
          </Link>
          <a href="https://docs.spring.io/spring-ai/reference/index.html" target="_blank" rel="noreferrer" className="next-step-card external">
            <div className="next-step-icon">📚</div>
            <div>
              <h3>Official Docs</h3>
              <p>Deep-dive into Spring AI reference documentation for production patterns.</p>
            </div>
          </a>
        </div>
      </section>

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

        <div className="assessment-results">
          <div className="assessment-summary">
            <div className="assessment-header">
              <span className="assessment-title">Mastery by Phase</span>
              <div className="assessment-progress">
                {phaseProgress.map(p => (
                  <div key={p.phaseId} className="assessment-phase-bar">
                    <span className="assessment-phase-name">{p.phaseTitle}</span>
                    <div className="assessment-phase-fill" style={{ width: `${p.percent}%` }} />
                    <span className="assessment-phase-text">{p.completed}/{p.total} ({p.percent}%)</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overall-score">
              <h3>Overall Score: {overallPercent}%</h3>
              <p>{completed.size} / {totalLessons} lessons completed</p>
            </div>
          </div>

          <div className="assessment-details">
            {phaseProgress.map((p) => (
              <div key={p.phaseId} className="assessment-phase-detail">
                <h4>{p.phaseTitle}</h4>
                <p>{p.completed} of {p.total} lessons completed</p>
                <div className="assessment-progress-bar">
                  <div className="assessment-progress-fill" style={{ width: `${p.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={() => alert('Final knowledge assessment would be launched here. Attempt 10 questions testing all phases.')}>
          Take Final Knowledge Assessment
        </button>

        {completed.size >= lessons.length * 0.8 && (
          <div className="assessment-eligible">
            <p>🎓 You're eligible for the final capstone! Your mastery exceeds 80% across all phases.</p>
            <Link to="/capstone" className="btn btn-success btn-block">
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