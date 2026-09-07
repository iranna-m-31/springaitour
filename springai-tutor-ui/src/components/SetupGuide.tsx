import { useState } from 'react'
import { fetchHealth } from '../api/health'
import type { HealthStatus } from '../api/health'

export default function SetupGuide() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState<Record<string, boolean>>({})

  const handleCheck = async () => {
    setLoading(true)
    try {
      const data = await fetchHealth()
      setHealth(data)
    } catch {
      setHealth(null)
    } finally {
      setLoading(false)
      setChecked(true)
    }
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopyFeedback(prev => {
          const newPrev = { ...prev }
          delete newPrev[key]
          return newPrev
        })
      }, 2000)
    })
  }

  const isReady = health?.status === 'ready'

  return (
    <section className="setup-section">
      <h2>📦 Repository Setup</h2>

      <div className="setup-steps">
        <div className="setup-step">
          <span className="step-number">1</span>
          <div className="step-content">
            <h3>Clone the repository</h3>
            <div className="copy-button-wrapper">
              <button
                className="copy-btn"
                onClick={() => handleCopy('git clone &lt;repo-url&gt;', 'clone')}
                title="Copy to clipboard"
              >
                {copyFeedback['clone'] ? '✅ Copied!' : '📋 Copy'}
              </button>
              <span className="copy-feedback">{copyFeedback['clone'] ? 'Copied!' : ''}</span>
            </div>
            <pre className="code-block"><code>git clone &lt;repo-url&gt;
cd springai</code></pre>
          </div>
        </div>

        <div className="setup-step">
          <span className="step-number">2</span>
          <div className="step-content">
            <h3>Configure your API key</h3>
            <p>
              Copy the provided <code>.env.example</code> and add your OpenRouter API key.
            </p>
            <div className="copy-button-wrapper">
              <button
                className="copy-btn"
                onClick={() => handleCopy('cp .env.example .env', 'copy-env')}
                title="Copy command"
              >
                {copyFeedback['copy-env'] ? '✅ Copied!' : '📋 Copy'}
              </button>
              <span className="copy-feedback">{copyFeedback['copy-env'] ? 'Copied!' : ''}</span>
            </div>
            <pre className="code-block"><code>cp .env.example .env
# Edit .env and add your API key:
OPENROUTER_API_KEY=sk-or-v1-YOUR-KEY</code></pre>
          </div>
        </div>

        <div className="setup-step">
          <span className="step-number">3</span>
          <div className="step-content">
            <h3>Build and start the server</h3>
            <p>
              One command starts everything — Spring Boot + the embedded React UI.
            </p>
            <div className="copy-button-wrapper">
              <button
                className="copy-btn"
                onClick={() => handleCopy('./gradlew bootRun', 'build')}
                title="Copy command"
              >
                {copyFeedback['build'] ? '✅ Copied!' : '📋 Copy'}
              </button>
              <span className="copy-feedback">{copyFeedback['build'] ? 'Copied!' : ''}</span>
            </div>
            <pre className="code-block"><code>./gradlew bootRun</code></pre>
          </div>
        </div>

        <div className="setup-step">
          <span className="step-number">4</span>
          <div className="step-content">
            <h3>Verify the server is running</h3>
            <p>
              Open <code>http://localhost:8080</code> in your browser.
              Before exploring features, verify the server is healthy.
            </p>
            <button
              className={`health-btn${isReady ? ' health-btn--ready' : ''}${checked && !isReady ? ' health-btn--error' : ''}`}
              onClick={handleCheck}
              disabled={loading}
            >
              {loading
                ? 'Checking...'
                : checked && isReady
                  ? '✅ Server is healthy'
                  : checked
                    ? '❌ Server not ready'
                    : '🩺 Check Health'}
            </button>
            {health && (
              <div className="health-details">
                <p>
                  Status: <strong>{health.status === 'ready' ? '✅ Ready' : '⚠️ Needs setup'}</strong>
                </p>
                <p>
                  Model: <code>{health.chatModel || 'not configured'}</code>
                </p>
                <p>
                  Base URL: <code>{health.baseUrl}</code>
                </p>
                <p>
                  Vector Store: <code>{health.vectorStore}</code>
                </p>
                {health.apiKeyConfigured && (
                  <p>
                    API Key: <code>{health.apiKeyPreview}</code> ✓
                  </p>
                )}
                {!health.apiKeyConfigured && (
                  <p>
                    ⚠️ No API key configured. Add <code>OPENROUTER_API_KEY</code> to <code>.env</code> and restart.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {checked && !isReady && (
        <div className="setup-warning">
          <p>
            ⚠️ The server is running but the API key is not configured.
            You can still browse feature explanations and source code.
            LLM calls (the "Try It" demos) will not work until the key is added.
          </p>
        </div>
      )}
    </section>
  )
}