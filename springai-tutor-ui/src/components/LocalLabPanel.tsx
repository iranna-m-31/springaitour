import { useState, useEffect, useCallback } from 'react'
import { fetchHealth, type HealthStatus } from '../api/health'

interface LocalLabPanelProps {
  compact?: boolean
}

export default function LocalLabPanel({ compact = false }: LocalLabPanelProps) {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkHealth = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchHealth()
      setHealth(data)
      setLastChecked(new Date())
    } catch (e) {
      setError('Server unreachable')
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  const isReady = health?.status === 'ready'

  return (
    <div className={`local-lab-panel${compact ? ' local-lab-panel--compact' : ''}`}>
      <div className="local-lab-header">
        <span className="local-lab-icon">🧪</span>
        <span className="local-lab-title">Local Spring AI Lab</span>
        <span className={`local-lab-status ${isReady ? 'local-lab-status--ready' : 'local-lab-status--disconnected'}`}>
          {isReady ? '● Connected' : '○ Disconnected'}
        </span>
      </div>

      {!compact && (
        <div className="local-lab-details">
          <div className="local-lab-row">
            <span className="local-lab-label">Server:</span>
            <code className="local-lab-code">http://localhost:8080</code>
          </div>
          {health && (
            <div className="local-lab-diagnostics">
              <div className="lab-diagnostic">
                <span>Chat Model:</span> <code>{health.chatModel || 'not set'}</code>
              </div>
              <div className="lab-diagnostic">
                <span>API Key:</span>{' '}
                <code className={health.apiKeyConfigured ? 'text-green' : 'text-amber'}>
                  {health.apiKeyConfigured ? health.apiKeyPreview : 'not configured'}
                </code>
              </div>
              <div className="lab-diagnostic">
                <span>Embedding Model:</span> <code>{health.embeddingModel || 'not set'}</code>
              </div>
              <div className="lab-diagnostic">
                <span>Vector Store:</span> <code>{health.vectorStore}</code>
              </div>
              <div className="lab-diagnostic">
                <span>Moderation:</span>{' '}
                <code>{health.moderationEnabled ? '✅ enabled' : '❌ disabled'}</code>
              </div>
              <div className="lab-diagnostic">
                <span>Actuator:</span> <code>{health.actuatorEnabled ? '✅ enabled' : '❌ disabled'}</code>
              </div>
            </div>
          )}

          {error && (
            <div className="local-lab-error">
              <p>❌ {error}</p>
              <p className="local-lab-error-hint">
                Start the server with: <code>./mvnw spring-boot:run</code> or <code>./gradlew bootRun</code>
              </p>
            </div>
          )}

          <div className="local-lab-actions">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={checkHealth}
              disabled={loading}
            >
              {loading ? 'Checking...' : '🔄 Test Connection'}
            </button>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => window.open('/api/tutor/health', '_blank')}>
              Health API
            </button>
          </div>

          {lastChecked && (
            <p className="local-lab-timestamp">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}