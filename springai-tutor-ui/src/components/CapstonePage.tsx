import { Link, useNavigate } from 'react-router-dom'
import { useProgress } from './HomePage'
import { lessons } from '../data/lessons'
import Checkpoint from './Checkpoint'
import ProgressiveDisclosure from './ProgressiveDisclosure'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function CapstonePage() {
  const { completed } = useProgress()
  const navigate = useNavigate()

  const isCapstoneCompleted = completed.has('capstone-support-assistant')

  // Calculate overall progress
  const totalLessons = lessons.length
  const completedCount = completed.size
  const overallPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="capstone-page fade-in">
      {/* Capstone Header */}
      <header className="capstone-header">
        <div className="capstone-badge">🏆</div>
        <h1>Capstone Project: Spring AI Support Assistant</h1>
        <p className="capstone-tagline">
          Build a complete Spring AI application integrating all learned concepts
        </p>

        {/* Progress */}
        <div className="capstone-progress">
          <span>{completedCount} / {totalLessons} lessons completed</span>
          <div className="progress-bar" style={{ height: '10px', maxWidth: '400px', margin: 'var(--space-4) auto 0' }}>
            <div className="progress-fill" style={{ width: `${overallPercent}%` }} />
          </div>
        </div>
      </header>

      {/* Capstone Overview */}
      <section className="capstone-section">
        <h2>🎯 Project Overview</h2>
        <p>
          The Spring AI Support Assistant is a complete application that demonstrates mastery of all
          Spring AI concepts covered in this tutorial. You'll build an intelligent support agent that
          can answer questions about Spring AI, execute tools, maintain conversation memory, and
          integrate with external systems via MCP.
        </p>

        <div className="capstone-objectives">
          <h3>What You'll Build:</h3>
          <ul className="objectives-list">
            <li>
              <span className="objective-check">◉</span>
              <span className="objective-text">RAG-powered knowledge base for Spring AI documentation</span>
            </li>
            <li>
              <span className="objective-check">◉</span>
              <span className="objective-text">Tool calling for executing Spring Boot operations</span>
            </li>
            <li>
              <span className="objective-check">◉</span>
              <span className="objective-text">Conversation memory for context-aware interactions</span>
            </li>
            <li>
              <span className="objective-check">◉</span>
              <span className="objective-text">MCP integration for external tool discovery</span>
            </li>
            <li>
              <span className="objective-check">◉</span>
              <span className="objective-text">Structured output for consistent responses</span>
            </li>
            <li>
              <span className="objective-check">◉</span>
              <span className="objective-text">Observability and evaluation for production readiness</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Capstone Architecture */}
      <section className="capstone-section">
        <h2>🏗️ System Architecture</h2>
        <p>
          The Support Assistant combines all Spring AI features into a cohesive architecture:
        </p>
        <div
          className="architecture-markdown"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
          }}
        >
          <Markdown remarkPlugins={[remarkGfm]}>
            {`### Support Assistant Architecture

The Support Assistant is a complete Spring AI application that integrates every concept covered in this tutorial. Here is how the components fit together:

**Request Lifecycle:**

1. **User Interface** — The web UI sends a chat message to the backend.
2. **Spring AI ChatClient** — Receives the request and orchestrates the full pipeline. This is the central hub; every other component hangs off the advisor chain.
3. **RAG Pipeline** — Before the LLM call, the query is embedded and a similarity search retrieves the top-k relevant chunks from the vector store. These chunks augment the prompt so the LLM answers from your own documentation.
4. **Tool Executor** — If the user's request requires an action (e.g. "check health"), the LLM decides to call a \`@Tool\`-annotated Spring service. The tool runs, and the result is fed back into the conversation.
5. **Conversation Memory** — Each request is stored in a vector-backed ChatMemory so the assistant remembers previous turns within the same session.
6. **MCP Client/Server** — External tools are exposed through the Model Context Protocol, a standard interface for discovering and invoking services without custom integration code.
7. **Observability & Metrics** — Micrometer + OpenTelemetry instrument every LLM call, exposing traces and metrics through Actuator endpoints.
8. **Evaluation Framework** — An LLM-as-a-Judge evaluates responses for relevancy and factuality, returning a PASS/FAIL verdict.

**Data Flow:**

\`\`\`
User → UI → ChatClient → [RAG → Vector Store] → [Tools → @Tool Methods]
                              → [Memory → ChatMemory]
                              → [MCP → External Servers]
                              → [Observability → Micrometer → Actuator]
                              → [Evaluation → LLM-as-a-Judge]
                              → Response → User
\`\`\`

**Key Insight:** The ChatClient is the only component the user talks to. Everything else (RAG, tools, memory, MCP, observability, evaluation) runs through the advisor chain — Spring AI handles the wiring, so your application code stays clean and focused on business logic.

See the [Spring AI Capstone Guide](https://docs.spring.io/spring-ai/reference/getting-started.html) for details.`}
          </Markdown>
        </div>
      </section>

      {/* Interactive Capstone Demo */}
      <section className="capstone-section">
        <h2>🧪 Interactive Demonstration</h2>
        <p>
          Explore how each component works together in the capstone project:
        </p>

        <ProgressiveDisclosure
          sections={[
            {
              level: 'basic',
              title: 'RAG Knowledge Base',
              description: 'Vector store containing Spring AI documentation for accurate, context-aware responses',
              content: (
                <div>
                  <p><strong>Key Components:</strong> DocumentReader, TextSplitter, EmbeddingModel, VectorStore</p>
                  <p><strong>Functionality:</strong> Retrieves relevant documentation to augment LLM prompts</p>
                  <p><strong>Files:</strong> concepts/61-capstone-concept.mdx</p>
                </div>
              )
            },
            {
              level: 'advanced',
              title: 'Tool Calling System',
              description: 'Execute Spring Boot operations through natural language commands',
              content: (
                <div>
                  <p><strong>Sample Tools:</strong> Health check, Configuration reload, Log level adjustment</p>
                  <p><strong>Annotations:</strong> @Tool, @ToolParam for automatic exposure</p>
                  <p><strong>Files:</strong> concepts/61-capstone-code.mdx</p>
                </div>
              )
            },
            {
              level: 'internals',
              title: 'Memory & MCP Integration',
              description: 'Long-term conversation context and external tool discovery via MCP',
              content: (
                <div>
                  <p><strong>Memory:</strong> VectorStore-backed conversation history</p>
                  <p><strong>MCP:</strong> Standard protocol for discovering and invoking external tools</p>
                  <p><strong>Benefit:</strong> Seamless integration with existing enterprise systems</p>
                  <p><strong>Files:</strong> concepts/61-capstone-interactive.mdx</p>
                </div>
              )
            }
          ]}
          defaultLevel="basic"
        />
      </section>

      {/* Capstone Checkpoint */}
      <section className="capstone-section">
        <h2>✅ Capstone Validation</h2>
        <p>
          Test your understanding of how the components integrate:
        </p>

        <Checkpoint
          type="multiple-choice"
          question="Which Spring AI feature enables the Support Assistant to discover and use external tools through a standard protocol?"
          options={[
            { label: 'RAG Retrieval', value: 'rag' },
            { label: 'Tool Calling', value: 'tools' },
            { label: 'MCP (Model Context Protocol)', value: 'mcp' },
            { label: 'Conversation Memory', value: 'memory' }
          ]}
          answer="mcp"
          explanation="MCP provides a standard interface for AI tools, allowing the assistant to discover and invoke external services without custom integration code."
        />

        <Checkpoint
          type="multiple-choice"
          question="What is the primary benefit of combining RAG with tool calling in the Support Assistant?"
          options={[
            { label: 'Faster response times', value: 'speed' },
            { label: 'Ability to both retrieve information and take actions', value: 'retrieve-and-act' },
            { label: 'Reduced memory usage', value: 'memory' },
            { label: 'Simplified deployment', value: 'deployment' }
          ]}
          answer="retrieve-and-act"
          explanation="RAG provides knowledge retrieval while tool calling enables action execution - together they create a complete agent that can inform and act."
        />
      </section>

      {/* Resources & Next Steps */}
      <section className="capstone-section">
        <h2>📚 Resources & Next Steps</h2>

        <div className="capstone-resources">
          <div className="resource-card">
            <h3>Capstone Source Code</h3>
            <p>Complete implementation of the Spring AI Support Assistant</p>
            <a
              href="https://github.com/spring-projects-experimental/spring-ai-capstone-support-assistant"
              target="_blank"
              rel="noreferrer"
              className="resource-link"
            >
              View on GitHub →
            </a>
          </div>

          <div className="resource-card">
            <h3>Production Deployment Guide</h3>
            <p>Deploy your capstone to Kubernetes, Cloud Foundry, or traditional VMs</p>
            <a
              href="https://docs.spring.io/spring-ai/reference/deployment.html"
              target="_blank"
              rel="noreferrer"
              className="resource-link"
            >
              Deployment Guide →
            </a>
          </div>

          <div className="resource-card">
            <h3>Advanced Topics</h3>
            <p>Explore fine-tuning, custom models, and enterprise integrations</p>
            <a
              href="https://docs.spring.io/spring-ai/reference/advanced.html"
              target="_blank"
              rel="noreferrer"
              className="resource-link"
            >
              Advanced Topics →
            </a>
          </div>
        </div>

        <div className="capstone-actions">
          {!isCapstoneCompleted && (
            <button
              className="btn btn-success btn-block"
              onClick={() => {
                // Mark capstone as complete
                // In a real app, this would save progress
                alert('Congratulations! You have completed the Spring AI Support Assistant capstone project.');
                navigate('/completion');
              }}
            >
              Mark Capstone as Complete
            </button>
          )}

          <Link to="/" className="btn btn-outline btn-block">
            🏠 Return to Home
          </Link>

          <Link to="/introduction" className="btn btn-outline btn-block">
            ← Back to Introduction
          </Link>
        </div>
      </section>

      {/* Completion CTA */}
      {isCapstoneCompleted && (
        <section className="capstone-section completion-cta">
          <h2>🎉 Capstone Complete!</h2>
          <p>
            You've successfully built the Spring AI Support Assistant, demonstrating mastery of
            all Spring AI concepts covered in this tutorial.
          </p>
          <Link
            to="/completion"
            className="btn btn-primary btn-block"
          >
            View Full Completion Certificate →
          </Link>
        </section>
      )}
    </div>
  )
}