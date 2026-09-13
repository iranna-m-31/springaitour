import { useEffect, useState } from 'react'
import { fetchHealth } from '../api/health'
import type { HealthStatus } from '../api/health'

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)

  useEffect(() => {
    fetchHealth().then(setHealth)
  }, [])

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      {!health ? (
        <p>Loading config…</p>
      ) : (
        <>
          <p className="subtitle">Read-only view of the active configuration.</p>

          <table className="settings-table">
        <tbody>
          <tr>
            <th>Status</th>
            <td>
              <span className={`badge ${health.status === 'ready' ? 'badge-ok' : 'badge-warn'}`}>
                {health.status === 'ready' ? 'Ready' : 'Needs setup'}
              </span>
            </td>
          </tr>
          <tr>
            <th>API key</th>
            <td>
              {health.apiKeyConfigured ? (
                <code>{health.apiKeyPreview}</code>
              ) : (
                <em>Not configured — set OPENROUTER_API_KEY in .env</em>
              )}
            </td>
          </tr>
          <tr>
            <th>Base URL</th>
            <td><code>{health.baseUrl}</code></td>
          </tr>
          <tr>
            <th>Chat model</th>
            <td><code>{health.chatModel || '—'}</code></td>
          </tr>
          <tr>
            <th>Embedding model</th>
            <td><code>{health.embeddingModel || '—'}</code></td>
          </tr>
          <tr>
            <th>Vector store</th>
            <td><code>{health.vectorStore}</code></td>
          </tr>
          <tr>
            <th>Moderation</th>
            <td>{health.moderationEnabled ? 'enabled' : 'disabled'}</td>
          </tr>
          <tr>
            <th>Actuator</th>
            <td>{health.actuatorEnabled ? 'enabled' : 'disabled'}</td>
          </tr>
        </tbody>
      </table>

      <h3>To change config</h3>
      <pre className="code-block"><code>{`# Edit .env, then restart the server:
OPENROUTER_API_KEY=sk-or-v1-YOUR-KEY
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_CHAT_MODEL=minimax/minimax-m3:free

./gradlew bootRun`}</code></pre>
        </>
      )}
    </div>
  )
}
