import { Link } from 'react-router-dom'
import {  modules } from '../data/features'

export default function IntroductionPage() {
  return (
    <div className="intro-page fade-in">
      <section className="intro-hero">
        <div className="spring-badge">Spring AI 2.0.1</div>
        <h1>Spring AI Interactive Tutorial</h1>
        <p className="intro-tagline">
          A hands-on guide to building AI-powered applications with Spring AI.
          Each feature includes live demos, source code, and official documentation links.
        </p>
      </section>

      <section className="intro-section">
        <h2>📖 What is Spring AI?</h2>
        <p>
          Spring AI provides a portable API for AI operations across multiple LLM providers.
          It abstracts away vendor-specific details while giving you access to the full power of
          modern AI models.
        </p>
        <ul>
          <li><strong>Portable API</strong> — Same code works with OpenAI, Anthropic, Azure, Ollama, and more</li>
          <li><strong>ChatClient</strong> — Fluent, testable API for LLM interactions</li>
          <li><strong>Advisors</strong> — Cross-cutting concerns like logging, memory, RAG, safety</li>
          <li><strong>RAG Support</strong> — Vector stores, document readers, similarity search</li>
          <li><strong>Tool Calling</strong> — Let the LLM decide when to use your Java methods</li>
        </ul>
      </section>

      <section className="intro-section">
        <h2>🎯 Learning Path</h2>
        <p>Follow these modules in order for the best learning experience:</p>
        <div className="module-grid" style={{ marginTop: 'var(--space-6)' }}>
          {modules.map((m) => (
            <Link key={m.id} to={`/feature/${m.features[0]}`} className="module-card">
              <div className="module-card-header">
                <div className={`module-icon ${m.iconType}`}>{m.icon}</div>
                <h3>{m.title}</h3>
              </div>
              <p>{m.description}</p>
              <span className="feature-count">{m.features.length} features</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="intro-section">
        <h2>🔧 Prerequisites</h2>
        <ul>
          <li>Java 21+ and Spring Boot 4.1.x</li>
          <li>An OpenRouter API key (or any OpenAI-compatible provider)</li>
          <li>Basic familiarity with Spring Boot and REST APIs</li>
          <li>Docker (optional, for vector store demos)</li>
        </ul>
      </section>

      <section className="intro-section">
        <h2>🚀 Quick Start</h2>
        <div className="concept-card">
          <h3>1. Start the server</h3>
          <code className="concept-code">./gradlew bootRun</code>
        </div>
        <div className="concept-card">
          <h3>2. Open the tutorial</h3>
          <code className="concept-code">http://localhost:8080</code>
        </div>
        <div className="concept-card">
          <h3>3. Follow the learning path</h3>
          <p>Start with "Plain Chat" in the Foundations module and work through each feature.</p>
        </div>
      </section>

      <section className="intro-section">
        <h2>📚 Documentation</h2>
        <ul>
          <li><a href="https://docs.spring.io/spring-ai/reference/index.html" target="_blank" rel="noreferrer">Spring AI 2.0.1 Reference →</a></li>
          <li><a href="https://docs.spring.io/spring-ai/reference/api/chatclient.html" target="_blank" rel="noreferrer">ChatClient API →</a></li>
          <li><a href="https://docs.spring.io/spring-ai/reference/model/overview.html" target="_blank" rel="noreferrer">Models Overview →</a></li>
        </ul>
      </section>

      <section className="intro-section" style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
        <Link to="/feature/plain-chat" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: 'var(--space-4) var(--space-8)' }}>
          🚀 Start Tutorial →
        </Link>
        <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Begins with <strong>Plain Chat</strong> (Feature 1 of 16)
        </p>
      </section>
    </div>
  )
}
