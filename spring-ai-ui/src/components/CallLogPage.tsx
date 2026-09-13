import { useEffect, useState } from 'react'
import { fetchCallLog } from '../api/health'

interface CallEntry {
  endpoint: string
  method: string
  latencyMs: number
  statusCode: number
  inputTokens?: number
  outputTokens?: number
  requestPreview?: string
  responsePreview?: string
  error?: string
  timestamp: string
}

export default function CallLogPage() {
  const [calls, setCalls] = useState<CallEntry[]>([])

  useEffect(() => {
    const load = () => fetchCallLog().then(setCalls)
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="call-log-page">
      <h2>Call Log</h2>
      <p className="subtitle">Last 50 LLM calls. Auto-refreshes every 3 seconds.</p>

      {calls.length === 0 && <p>No calls yet. Try a feature!</p>}

      {calls.length > 0 && (
        <table className="call-log-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Endpoint</th>
              <th>Status</th>
              <th>Latency</th>
              <th>Tokens</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {calls.slice().reverse().map((c, i) => (
              <tr key={i}>
                <td>{new Date(c.timestamp).toLocaleTimeString()}</td>
                <td><code>{c.endpoint}</code></td>
                <td>
                  <span className={`badge ${c.statusCode === 200 ? 'badge-ok' : 'badge-warn'}`}>
                    {c.statusCode}
                  </span>
                </td>
                <td>{c.latencyMs}ms</td>
                <td>
                  {c.inputTokens != null && `${c.inputTokens} in / ${c.outputTokens || 0} out`}
                </td>
                <td className="response-preview">{c.responsePreview || c.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}