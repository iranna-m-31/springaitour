import { useState } from 'react'
import { fetchHealth, type HealthStatus } from '../api/health'
import SetupDoctor from './SetupDoctor'
import { Link } from 'react-router-dom'
import { features, modules } from '../data/features'

export default function LabPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [checking, setChecking] = useState(false)

  const runHealthCheck = async () => {
    setChecking(true)
    try {
      setHealth(await fetchHealth())
    } catch {
      setHealth(null)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="lab-page fade-in">
      <header className="lab-page-header">
        <span className="lab-page-icon">🧪</span>
        <div>
          <h1>Spring AI Lab</h1>
          <p>Verify your local environment and run hands-on demos against the live backend.</p>
        </div>
      </header>

      <section className="lab-page-card">
        <h2>Environment Health Check</h2>
        <p>
          Run a live check against your local Spring Boot server. The result is used by the Setup Doctor to recommend the next step.
        </p>
        <button className="btn btn-primary" onClick={runHealthCheck} disabled={checking}>
          {checking ? 'Checking environment...' : '🩺 Run Health Check'}
        </button>

        {health && (
          <div className="lab-health-result">
            <span className={`lab-health-status ${health.status === 'ready' ? 'pass' : 'warn'}`}>
              {health.status === 'ready' ? 'Connected' : 'Needs attention'}
            </span>
            <dl>
              <div>
                <dt>Server</dt>
                <dd>{health.status}</dd>
              </div>
              <div>
                <dt>API key</dt>
                <dd>{health.apiKeyConfigured ? 'Configured' : 'Not configured'}</dd>
              </div>
              <div>
                <dt>Embedding model</dt>
                <dd>{health.embeddingModel || 'Not configured'}</dd>
              </div>
              <div>
                <dt>Vector store</dt>
                <dd>{health.vectorStore || 'Not configured'}</dd>
              </div>
            </dl>
          </div>
        )}

        {checking && (
          <div className="lab-checking" style={{ marginTop: 'var(--space-4)' }}>
            <em>Connecting to your local server...</em>
          </div>
        )}
      </section>

      {/* ===== LAB FEATURES ===== */}
      <section className="lab-features-section" style={{ marginTop: 'var(--space-8)' }}>
        <h2>Lab Demos</h2>
        <p>Each lab demo includes an interactive API call you can run against your local server.</p>

        <div className="lab-features-grid">
          {modules.map((mod) => (
            <div key={mod.id} className="lab-module-group">
              <h3 className="lab-module-title">{mod.title}</h3>
              <p className="lab-module-desc">{mod.description}</p>
              <div className="lab-feature-list">
                {mod.features.map((fid) => {
                  const feature = features.find(f => f.id === fid)
                  if (!feature) return null
                  return (
                    <Link key={feature.id} to={`/feature/${feature.id}`} className="lab-feature-card">
                      <div className="lab-feature-header">
                        <span className="lab-feature-number">{feature.number}</span>
                        <span className="lab-feature-title">{feature.title}</span>
                        <div className="lab-feature-badges">
                          {feature.difficulty && (
                            <span className={`badge badge-${feature.difficulty}`}>
                              {feature.difficulty}
                            </span>
                          )}
                          {feature.estimatedTime && (
                            <span className="badge badge-time">
                              {feature.estimatedTime} min
                            </span>
                          )}
                          {feature.requiresDocker && (
                            <span className="badge badge-docker">🐳 Docker</span>
                          )}
                          {feature.requiresPaidKey && (
                            <span className="badge badge-paid">🔑 Paid</span>
                          )}
                        </div>
                      </div>
                      <p className="lab-feature-summary">{feature.summary || feature.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SetupDoctor />
    </div>
  )
}
