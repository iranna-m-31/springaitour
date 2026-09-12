import type { Feature } from '../data/features'
import { callApi, streamChat } from '../api/client'
import { useEffect, useRef, useState } from 'react'
import CodeBlock from './CodeBlock'
import MarkdownViewer from './MarkdownViewer'
import Skeleton from './Skeleton'
import CopyButton from './CopyButton'

interface DemoPanelProps {
  feature: Feature
}

/** True if the given feature's endpoint exposes a Server-Sent-Events stream. */
function isStreamingFeature(feature: Feature): boolean {
  if (feature.id === 'streaming') return true
  return /\/stream\b|Flux<|text\/event-stream/.test(feature.endpoint)
}

/** True if the feature is chat-memory (two-step guided flow). */
function isChatMemory(feature: Feature): boolean {
  return feature.id === 'chat-memory'
}

/** True if the feature has paramGroups (multiple endpoint groups, e.g. embeddings). */
function hasParamGroups(feature: Feature): boolean {
  return !!(feature.paramGroups && feature.paramGroups.length > 0)
}

/** Resolve the first concrete endpoint from a feature's "A | B | C" endpoint string. */
function primaryEndpoint(endpoint: string): string {
  return endpoint.split('|')[0]?.trim().split(/\s+/).pop() ?? endpoint
}

/** True if the feature has no live endpoint (configuration-based). */
function isConfigOnly(feature: Feature): boolean {
  return feature.method === 'N/A'
}

function generateConversationId(): string {
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function DemoPanel({ feature }: DemoPanelProps) {
  const [params, setParams] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    feature.params.forEach((p) => {
      initial[p.name] = p.defaultValue
    })
    return initial
  })
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [activeParamGroup, setActiveParamGroup] = useState<string | null>(null)
  const streamAbortRef = useRef<(() => void) | null>(null)

  // Reset state when the active feature changes.
  useEffect(() => {
    const initial: Record<string, string> = {}
    feature.params.forEach((p) => {
      initial[p.name] = p.defaultValue
    })
    if (isChatMemory(feature)) {
      initial.conversationId = generateConversationId()
    }
    setParams(initial)
    setResponse(null)
    setError(null)
    setLoading(false)
    setStreaming(false)
    setActiveParamGroup(null)
    streamAbortRef.current?.()
    streamAbortRef.current = null
  }, [feature.id])

  // Clean up any in-flight stream on unmount.
  useEffect(() => {
    return () => {
      streamAbortRef.current?.()
    }
  }, [])

  const handleChange = (name: string, value: string) => {
    setParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleTry = async () => {
    if (isConfigOnly(feature)) return
    setLoading(true)
    setResponse(null)
    setError(null)

    const endpoint = primaryEndpoint(feature.endpoint)

    if (isStreamingFeature(feature)) {
      // ----- Streaming path -----
      setStreaming(true)
      setResponse('')
      const handle = streamChat(
        endpoint,
        params,
        (token) => {
          // Append tokens one at a time. setResponse is called many times;
          // this is intentional so users see the cursor "▌" advancing.
          setResponse((prev) => (prev ?? '') + token)
        }
      )
      streamAbortRef.current = handle.abort
      try {
        await handle.done
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Stream failed'
        setError(msg)
        setResponse(null)
      } finally {
        setLoading(false)
        setStreaming(false)
        streamAbortRef.current = null
      }
      return
    }

    // ----- Non-streaming path -----
    const { data, error: apiError } = await callApi(feature.method, endpoint, params)
    if (apiError) {
      // Distinguish between network errors and API errors
      if (!apiError.status || apiError.status >= 500) {
        // Likely network/connection error or server error
        setError(`Connection error: Unable to reach the backend server. Please ensure the Spring Boot application is running.`)
      } else {
        // Actual API error from the endpoint
        const fullMsg = apiError.message || `HTTP ${apiError.status}`
        setError(fullMsg)
      }
    } else {
      setResponse(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    }
    setLoading(false)
  }

  const handleStop = () => {
    streamAbortRef.current?.()
    streamAbortRef.current = null
  }

  /**
   * Handle the two-step chat memory flow:
   * - Step 1: userInput - state a fact
   * - Step 2: followUp - test recall
   */
  const handleStep = async (step: 'first' | 'second') => {
    if (isConfigOnly(feature)) return
    if (!isChatMemoryFeature) return

    setLoading(true)
    setResponse(null)
    setError(null)

    const endpoint = primaryEndpoint(feature.endpoint)
    const { data, error: apiError } = step === 'first'
      ? await callApi(feature.method, endpoint, { conversationId: params.conversationId, userInput: params.userInput })
      : await callApi(feature.method, endpoint, { conversationId: params.conversationId, userInput: params.followUp ?? '' })

    if (apiError) {
      const fullMsg = apiError.message || `HTTP ${apiError.status}`
      setError(fullMsg)
    } else if (data) {
      setResponse(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    }
    setLoading(false)
  }

  /**
   * Handle a call from a paramGroup (e.g. embeddings single/similarity/faq).
   * Sends only the specified params to the group's endpoint.
   */
  const handleParamGroupCall = async (group: { label: string; endpoint: string; paramNames: string[]; description: string }) => {
    if (isConfigOnly(feature)) return
    setLoading(true)
    setError(null)
    setResponse(null)
    setActiveParamGroup(group.label)

    const groupParams: Record<string, string> = {}
    group.paramNames.forEach((name) => {
      groupParams[name] = params[name] ?? ''
    })

    const { data, error: apiError } = await callApi(feature.method, group.endpoint, groupParams)
    if (apiError) {
      const fullMsg = apiError.message || `HTTP ${apiError.status}`
      setError(fullMsg)
    } else if (data) {
      setResponse(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    }
    setLoading(false)
    setActiveParamGroup(null)
  }

  const isConfigOnlyFeature = isConfigOnly(feature)
  const isChatMemoryFeature = isChatMemory(feature)
  const hasParamGroupsFeature = hasParamGroups(feature)
  const queryString = new URLSearchParams(params).toString()
  const baseEndpoint = primaryEndpoint(feature.endpoint)
  const fullUrl = `${baseEndpoint}?${queryString}`

  const showEmptyState =
    !loading && !error && !response && !isConfigOnlyFeature
  const showStreamingResponse = streaming && response !== null

  return (
    <div className="demo-panel">
      <h3>Try It</h3>
      <div className="demo-form">
        {feature.params.map((p) => {
          const kind = p.kind ?? 'text'
          return (
            <div key={p.name} className="form-field">
              <label htmlFor={`param-${p.name}`}>
                {p.label}
                {kind === 'select' && p.options && p.options.length > 0 && (
                  <span className="form-field-hint"> — choose</span>
                )}
              </label>

              {kind === 'select' && p.options ? (
                <select
                  id={`param-${p.name}`}
                  value={params[p.name]}
                  onChange={(e) => handleChange(p.name, e.target.value)}
                >
                  {p.options.map((label, i) => {
                    const value = p.optionValues?.[i] ?? label
                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  })}
                </select>
              ) : kind === 'textarea' ? (
                <textarea
                  id={`param-${p.name}`}
                  value={params[p.name]}
                  onChange={(e) => handleChange(p.name, e.target.value)}
                  placeholder={p.placeholder}
                  rows={3}
                />
              ) : (
                <input
                  id={`param-${p.name}`}
                  type="text"
                  value={params[p.name]}
                  onChange={(e) => handleChange(p.name, e.target.value)}
                  placeholder={p.placeholder}
                />
              )}

              {p.description && <span className="form-field-hint">{p.description}</span>}
            </div>
          )
        })}

        {isConfigOnlyFeature && (
          <div className="config-only-notice">
            <p>No live API call for this topic — see the code above.</p>
          </div>
        )}

        {isChatMemoryFeature && (
          <div className="demo-form-actions">
            <button
              type="button"
              className="try-btn"
              onClick={() => handleStep('first')}
              disabled={loading}
            >
              {loading ? 'Sending fact...' : 'Step 1: Send Fact'}
            </button>
            <button
              type="button"
              className="try-btn"
              onClick={() => handleStep('second')}
              disabled={loading}
            >
              {loading ? 'Asking follow-up...' : 'Step 2: Ask Follow-up'}
            </button>
          </div>
        )}
        {hasParamGroupsFeature && feature.paramGroups && (
          <div className="demo-form-actions demo-form-actions--grouped">
            {feature.paramGroups.map((group, idx) => (
              <button
                key={idx}
                type="button"
                className="try-btn"
                onClick={() => handleParamGroupCall(group)}
                disabled={loading}
              >
                {loading && activeParamGroup === group.label ? 'Loading...' : group.label}
              </button>
            ))}
          </div>
        )}
        {!isConfigOnlyFeature && !isChatMemoryFeature && !hasParamGroupsFeature && (
          <div className="demo-form-actions">
            {streaming ? (
              <button
                type="button"
                className="try-btn try-btn--stop"
                onClick={handleStop}
              >
                ◼ Stop
              </button>
            ) : (
              <button
                type="button"
                className="try-btn"
                onClick={handleTry}
                disabled={loading}
              >
                {loading ? 'Loading...' : '▶ Try It'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="demo-result">
        {!isConfigOnlyFeature && <h4>Request</h4>}
        {!isConfigOnlyFeature && <CodeBlock language="bash" value={fullUrl} />}

        {loading && !response && <Skeleton lines={4} lastWidth="80%" />}

        {error && (
          <div className="error-box error-box--rich" role="alert">
            <h4>⚠️ API Error</h4>
            <p>The server returned an error. See details below.</p>
            <details>
              <summary>Show error details</summary>
              <pre>{error}</pre>
            </details>
            <CopyButton value={error} label="Copy error" />
          </div>
        )}

        {showEmptyState && (
          <div className="empty-state">
            <div className="empty-state-icon">▶</div>
            <div className="empty-state-title">Ready to call the API</div>
            <div className="empty-state-desc">
              Click <strong>Try It</strong> to send a request to <code>{baseEndpoint}</code>.
            </div>
          </div>
        )}

        {response !== null && (
          <>
            <h4>Response {streaming && <span className="streaming-pill">streaming…</span>}</h4>
            <div className={streaming ? 'markdown-viewer streaming-active' : 'markdown-viewer'}>
              <MarkdownViewer text={response} />
              {showStreamingResponse && <span className="streaming-cursor" aria-hidden />}
            </div>
          </>
        )}
      </div>

      {feature.example && !isConfigOnlyFeature && (
        <div className="demo-example">
          <h4>Example (curl)</h4>
          <CodeBlock language="bash" value={feature.example} />
        </div>
      )}

      {feature.example && isConfigOnlyFeature && (
        <div className="demo-example demo-example--reference">
          <h4>Reference (not runnable)</h4>
          <CodeBlock language="bash" value={feature.example} showCopy={false} />
        </div>
      )}

      {feature.notes && (
        <div className="demo-notes-top">
          <strong>Note:</strong> {feature.notes}
        </div>
      )}

      <div className="demo-notes-bottom" style={{display: 'none'}}>
        <div className="demo-notes">
          <strong>Note:</strong> {feature.notes}
        </div>
      </div>
    </div>
  )
}
