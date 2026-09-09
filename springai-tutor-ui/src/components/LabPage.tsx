import { useState } from 'react'
import { fetchHealth, type HealthStatus } from '../api/health'
import SetupDoctor from './SetupDoctor'

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
          <p>Verify your local environment and run the guided setup checks.</p>
        </div>
      </header>

      <section className="lab-page-card">
        <h2>Environment Health Check</h2>
        <p>
          Run a live check against your local Spring Boot server. The result is used by the Setup Doctor to recommend the next step.
        </p>
        <button className="btn btn-primary" onClick={runHealthCheck} disabled={checking}>
          {checking ? 'Checking environment...' : 'Run Health Check'}
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
      </section>

      <SetupDoctor />
    </div>
  )
}
