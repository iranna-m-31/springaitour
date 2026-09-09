import { Link, useNavigate } from 'react-router-dom'
import { useProgress } from './HomePage'
import { lessons } from '../data/lessons'
import ArchitectureDiagram from './ArchitectureDiagram'
import Checkpoint from './Checkpoint'
import ProgressiveDisclosure from './ProgressiveDisclosure'

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

        <ArchitectureDiagram
          components={[
            { id: 'ui', label: 'User Interface', type: 'client', description: 'Web UI for chat interactions' },
            { id: 'chat-client', label: 'Spring AI ChatClient', type: 'spring', description: 'Fluent API for LLM calls' },
            { id: 'rag', label: 'RAG Pipeline', type: 'ai', description: 'Vector store retrieval pipeline' },
            { id: 'tools', label: 'Tool Executor', type: 'java', description: '@Tool annotated Spring services' },
            { id: 'memory', label: 'Conversation Memory', type: 'app', description: 'VectorStore-backed history' },
            { id: 'mcp', label: 'MCP Client/Server', type: 'spring', description: 'Standard MCP protocol integration' },
            { id: 'observability', label: 'Observability & Metrics', type: 'inspector', description: 'Micrometer + OpenTelemetry' },
            { id: 'eval', label: 'Evaluation Framework', type: 'ai', description: 'LLM-as-a-Judge evaluation' }
          ]}
          connections={[
            { from: 'User Interface', to: 'Spring AI ChatClient' },
            { from: 'Spring AI ChatClient', to: 'RAG Pipeline' },
            { from: 'Spring AI ChatClient', to: 'Tool Executor' },
            { from: 'Spring AI ChatClient', to: 'Conversation Memory' },
            { from: 'Spring AI ChatClient', to: 'MCP Client/Server' },
            { from: 'Spring AI ChatClient', to: 'Observability & Metrics' },
            { from: 'Spring AI ChatClient', to: 'Evaluation Framework' }
          ]}
        />
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