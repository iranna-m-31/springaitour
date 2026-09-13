import { useState } from 'react'
import { callApi } from '../api/client'
import MarkdownViewer from './MarkdownViewer'

const personas = [
  { id: 'tutor', label: 'Tutor', system: 'You are a Spring AI tutor. Be concise, give Java code examples.' },
  { id: 'pirate', label: 'Pirate', system: 'You are a friendly pirate. Answer in pirate voice. Keep it short.' },
  { id: 'memory', label: 'With Memory', system: 'You are a helpful assistant. Remember our conversation.' },
]

export default function PlaygroundPage() {
  const [persona, setPersona] = useState('tutor')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<Array<{role: string, content: string}>>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    setLoading(true)
    setHistory((h) => [...h, { role: 'user', content: input }])

    try {
      const { data } = await callApi('GET', `/ai/chat`, {
        conversationId: 'playground',
        userInput: input
      })
      setHistory((h) => [...h, { role: 'assistant', content: data || 'No response' }])
    } catch (err: any) {
      const errorMsg = err.message || err.error?.message || 'An unexpected error occurred'
      setHistory((h) => [...h, { role: 'assistant', content: `Error: ${errorMsg}` }])
    } finally {
      setLoading(false)
      setInput('')
    }
  }

  return (
    <div className="playground-page">
      <h2>Playground</h2>
      <p className="subtitle">
        Freeform chat. Try different personas, continue the conversation.
      </p>

      <div className="persona-selector">
        {personas.map((p) => (
          <button
            key={p.id}
            className={`persona-btn ${persona === p.id ? 'active' : ''}`}
            onClick={() => {
              setPersona(p.id)
              setHistory([])
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="chat-history">
        {history.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}</strong>
            <MarkdownViewer text={msg.content} />
          </div>
        ))}
        {loading && (
          <div key="loading" className="chat-message assistant">
            <em>Assistant is thinking...</em>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="playground-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}