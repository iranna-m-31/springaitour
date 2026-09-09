import { useState } from 'react'
import CodeView from './CodeView'

interface APIInspectorProps {
  featureId?: string
  requestData?: {
    method: string
    url: string
    headers?: Record<string, string>
    body?: unknown
  }
  responseData?: {
    status: number
    body?: unknown
  }
}

interface RequestTab {
  label: string
  content: string
  language: string
}

export default function APIInspector({ featureId, requestData, responseData }: APIInspectorProps) {
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'flow'>('request')

  const tabs: RequestTab[] = [
    { label: 'Local Request', content: getLocalRequest(requestData), language: 'http' },
    { label: 'Spring AI Request', content: getSpringAIRequest(requestData), language: 'java' },
    { label: 'Model Response', content: getModelResponse(responseData), language: 'json' },
  ]

  return (
    <div className="api-inspector">
      <h2>🔍 API Inspector</h2>
      <p className="api-inspector-desc">
        Trace the request flow from your browser through Spring Boot to the LLM provider.
      </p>

      {/* Tab Navigation */}
      <div className="api-inspector-tabs" role="tablist">
        {tabs.map((tab) => {
          const tabKey = tab.label.toLowerCase().replace(' ', '-') as 'request' | 'response' | 'flow'
          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={activeTab === tabKey}
              className={`api-inspector-tab ${activeTab === tabKey ? 'active' : ''}`}
              onClick={() => setActiveTab(tabKey)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="api-inspector-content">
        {activeTab === 'request' && (
          <div className="api-inspector-panel" role="tabpanel">
            <CodeView code={tabs[0].content} filename={`${featureId || 'request'}.http`} />
          </div>
        )}
        {activeTab === 'response' && (
          <div className="api-inspector-panel" role="tabpanel">
            <CodeView code={tabs[2].content} filename="response.json" />
          </div>
        )}
        {activeTab === 'flow' && (
          <div className="api-inspector-panel api-inspector-flow" role="tabpanel">
            <div className="flow-step">
              <span className="flow-icon">🌐</span>
              <div className="flow-details">
                <strong>1. Browser Request</strong>
                <p>Your browser sends a POST request to the Spring Boot backend</p>
                <code className="flow-code">POST /api/tutor/chat</code>
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="flow-icon">⚙️</span>
              <div className="flow-details">
                <strong>2. Spring Boot Controller</strong>
                <p>Request is received and routed to the ChatController</p>
                <code className="flow-code">ChatController → ChatService</code>
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="flow-icon">🤖</span>
              <div className="flow-details">
                <strong>3. Spring AI ChatClient</strong>
                <p>ChatClient builds the prompt, applies advisors, and calls the model</p>
                <code className="flow-code">ChatClient.prompt().call().content()</code>
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="flow-icon">☁️</span>
              <div className="flow-details">
                <strong>4. LLM Provider</strong>
                <p>Spring AI abstraction sends the request to the LLM provider</p>
                <code className="flow-code">OpenAI / Ollama / Anthropic</code>
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">
              <span className="flow-icon">📥</span>
              <div className="flow-details">
                <strong>5. Response Returned</strong>
                <p>Response flows back through Spring AI to your browser</p>
                <code className="flow-code">Response content streamed via Flux</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getLocalRequest(data?: APIInspectorProps['requestData']): string {
  if (!data) {
    return `POST http://localhost:8080/api/tutor/chat
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "Hello, Spring AI!",
  "model": "openai:gpt-4o",
  "temperature": 0.7
}`
  }
  return `POST ${data.url}
Content-Type: application/json
Authorization: Bearer <token>

${JSON.stringify(data.body, null, 2)}`
}

function getSpringAIRequest(_data?: APIInspectorProps['requestData']): string {
  return `// ChatClient configuration
@Bean
public ChatClient chatClient(ChatModel chatModel) {
    return ChatClient.builder(chatModel)
        .defaultAdvisors(
            new SimpleLoggerAdvisor(),
            new QuestionAnswerAdvisor(vectorStore)
        )
        .build();
}

// Making a call
String response = chatClient.prompt()
    .user("Hello, Spring AI!")
    .call()
    .content();`
}

function getModelResponse(data?: APIInspectorProps['responseData']): string {
  if (!data) {
    return `{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1718784000,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Spring AI is a Spring project that provides..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 100,
    "total_tokens": 115
  }
}`
  }
  return JSON.stringify(data.body, null, 2)
}