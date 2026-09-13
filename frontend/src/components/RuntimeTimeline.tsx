import { useState } from 'react'

interface TimelineEvent {
  id: string
  timestamp: string
  phase: 'request' | 'advisor' | 'model' | 'response'
  label: string
  description: string
  details?: string
  duration?: string
}

interface RuntimeTimelineProps {
  showAdvanced?: boolean
}

export default function RuntimeTimeline({ showAdvanced = false }: RuntimeTimelineProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  const timelineEvents: TimelineEvent[] = [
    {
      id: 'request',
      timestamp: '00:00:00.000',
      phase: 'request',
      label: 'Request Received',
      description: 'HTTP POST /api/tutor/chat received by Spring Boot controller',
      details: `{
  "message": "Explain Spring AI",
  "model": "openai:gpt-4o",
  "temperature": 0.7
}`,
      duration: '1ms'
    },
    {
      id: 'advisor-chain',
      timestamp: '00:00:00.001',
      phase: 'advisor',
      label: 'Advisor Chain Executed',
      description: 'Before advisors process the request (logging, RAG, memory)',
      details: `Advisors executed in order:
1. SimpleLoggerAdvisor - Logging request details
2. QuestionAnswerAdvisor - Augmenting with RAG context
3. ChatMemoryAdvisor - Adding conversation history`,
      duration: '2ms'
    },
    {
      id: 'chat-model',
      timestamp: '00:00:00.003',
      phase: 'model',
      label: 'ChatModel Invoked',
      description: 'Spring AI abstraction calls the LLM provider',
      details: `ChatModel.call(Prompt) → LLM Provider
- Prompt contains: user message + augmented context
- Model: openai:gpt-4o
- Temperature: 0.7
- Max tokens: 4096`,
      duration: '500ms'
    },
    {
      id: 'response',
      timestamp: '00:00:00.503',
      phase: 'response',
      label: 'Response Received',
      description: 'LLM response flows back through the advisor chain',
      details: `{
  "content": "Spring AI is a Spring project that...",
  "metadata": {
    "usage": { "totalTokens": 4235 },
    "model": "gpt-4o"
  }
}`,
      duration: '1ms'
    },
    {
      id: 'advisor-after',
      timestamp: '00:00:00.504',
      phase: 'advisor',
      label: 'After Advisors Executed',
      description: 'Post-processing: logging response, updating memory',
      details: `After advisors:
1. SimpleLoggerAdvisor - Logging response details
2. ChatMemoryAdvisor - Storing conversation for context
3. Response filters applied`,
      duration: '1ms'
    },
    {
      id: 'return',
      timestamp: '00:00:00.505',
      phase: 'response',
      label: 'Response Returned',
      description: 'Complete response sent back to the browser',
      details: `HTTP 200 OK
Content-Type: text/event-stream

data: ${JSON.stringify({ content: "Spring AI..." })}`,
      duration: '0ms'
    }
  ]

  const phaseColors = {
    request: '#3b82f6',
    advisor: '#8b5cf6',
    model: '#f59e0b',
    response: '#10b981'
  }

  const toggleEvent = (id: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="runtime-timeline">
      <h2>⏱️ Runtime Timeline</h2>
      <p className="runtime-timeline-desc">
        Visual representation of what happens when the application makes an LLM call.
        {showAdvanced && ' Click events to expand details.'}
      </p>

      <div className="timeline-container">
        {/* Timeline line */}
        <div className="timeline-line" />

        {/* Events */}
        {timelineEvents.map((event, index) => {
          const isExpanded = expandedEvents.has(event.id)
          const color = phaseColors[event.phase]

          return (
            <div
              key={event.id}
              className={`timeline-event ${isExpanded ? 'timeline-event--expanded' : ''}`}
              style={{ marginLeft: `${20 + index * 20}px` }}
            >
              {/* Event marker */}
              <div
                className="timeline-marker"
                style={{ background: color }}
                onClick={() => showAdvanced && toggleEvent(event.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <span className="timeline-dot" />
              </div>

              {/* Event content */}
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-phase" style={{ color }}>
                    {event.phase}
                  </span>
                  <span className="timeline-time">{event.timestamp}</span>
                  {event.duration && (
                    <span className="timeline-duration">{event.duration}</span>
                  )}
                </div>
                <h4 className="timeline-label">{event.label}</h4>
                <p className="timeline-description">{event.description}</p>

                {/* Expandable details */}
                {isExpanded && event.details && (
                  <div className="timeline-details">
                    <pre className="timeline-details-code">{event.details}</pre>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="timeline-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: phaseColors.request }} /> Request
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: phaseColors.advisor }} /> Advisor
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: phaseColors.model }} /> Model
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: phaseColors.response }} /> Response
        </span>
      </div>
    </div>
  )
}