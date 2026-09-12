import { Link, useLocation, useNavigate } from 'react-router-dom'
import InPageNav from './InPageNav'
import SetupBanner from './SetupBanner'
import CodeDiff from './CodeDiff'
import Checkpoint from './Checkpoint'
import PrerequisitePanel from './PrerequisitePanel'
import APIInspector from './APIInspector'
import RuntimeTimeline from './RuntimeTimeline'
import { useProgress } from './HomePage'
import { lessons } from '../data/lessons'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface LessonPageProps {
  lesson: typeof lessons[0]
}

export default function LessonPage({ lesson }: LessonPageProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { completed, toggle } = useProgress()
  const isCompleted = completed.has(lesson.id)
  const currentLessonIndex = lessons.findIndex(l => l.id === lesson.id)
  const prevLesson = lessons[currentLessonIndex - 1]
  const nextLesson = lessons[currentLessonIndex + 1]

  // Get current phase info
  const currentPhase = lesson.phase
  const phaseLessons = lessons.filter(l => l.phase === currentPhase)
  const phaseCompleted = phaseLessons.filter(l => completed.has(l.id)).length
  const phasePercent = phaseLessons.length > 0 ? Math.round((phaseCompleted / phaseLessons.length) * 100) : 0

  // Tabs for the lesson content
  const tabs = [
    { id: 'concept', label: 'Concept' },
    { id: 'api', label: 'API' },
    { id: 'code', label: 'Code' },
    { id: 'runtime', label: 'Runtime' },
  ]

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [
      { label: 'Home', path: '/' },
      { label: 'Learn', path: '/introduction' },
    ]

    // Add phase
    const phaseObj = [
      { id: 'prerequisites', title: 'Prerequisites' },
      { id: 'fundamentals', title: 'Fundamentals' },
      { id: 'models', title: 'Models' },
      { id: 'data', title: 'Data' },
      { id: 'rag', title: 'RAG' },
      { id: 'memory', title: 'Memory' },
      { id: 'tools', title: 'Tools' },
      { id: 'agents', title: 'Agents' },
      { id: 'mcp', title: 'MCP' },
      { id: 'production', title: 'Production' },
      { id: 'capstone', title: 'Capstone' }
    ].find(p => p.id === lesson.phase)

    if (phaseObj) {
      crumbs.push({ label: phaseObj.title, path: '' })
    }

    crumbs.push({ label: lesson.title, path: location.pathname })
    return crumbs
  }

  // Check prerequisites
  const checkPrerequisites = () => {
    for (const prereq of lesson.prerequisites) {
      if (!completed.has(prereq.lessonId)) {
        return false
      }
    }
    return true
  }

  const prereqsMet = checkPrerequisites()

  return (
    <div className="lesson-page">
      <SetupBanner />

      {/* Breadcrumbs */}
      <nav className="lesson-breadcrumbs" aria-label="Breadcrumb">
        <ol>
          {getBreadcrumbs().map((crumb, index) => (
            <li key={index} className={crumb.path ? '' : 'breadcrumb-item--current'}>
              {crumb.path ? (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-label">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Lesson Header */}
      <header className="lesson-header">
        <div className="lesson-header-content">
          <div className="lesson-meta">
            <div className="lesson-number">{lesson.number}</div>
            <div>
              <h1>{lesson.title}</h1>
              <div className="lesson-tags">
                <span className="tag difficulty">
                  {lesson.difficulty === 'beginner' ? 'Beginner' :
                   lesson.difficulty === 'intermediate' ? 'Intermediate' :
                   lesson.difficulty === 'advanced' ? 'Advanced' : 'Expert'}
                </span>
                <span className="tag duration">
                  {lesson.estimatedTime} min
                </span>
                <span className="tag type">
                  {lesson.interactive.showSplitPane ? 'Interactive' : 'Conceptual'}
                </span>
              </div>
            </div>
          </div>
          {lesson.featureId && (
            <div className="lesson-feature-badge">
              Maps to Feature: {lesson.featureId}
            </div>
          )}
        </div>

        {/* Prerequisites Panel */}
        {!prereqsMet && (
          <PrerequisitePanel
            lessonId={lesson.id}
            prerequisites={lesson.prerequisites.map(p => ({
              lessonId: p.lessonId,
              description: p.description
            }))}
          />
        )}
      </header>

      {/* Lesson Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <section className="lesson-objectives" id="concept">
          <h2>Learning Objectives</h2>
          <ul className="objectives-list">
            {lesson.objectives.map((obj, index) => (
              <li key={index}>
                <span className="objective-check">◉</span>
                <span className="objective-text">{obj}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Java/Spring Analogies */}
      {lesson.analogies && lesson.analogies.length > 0 && (
        <section className="lesson-analogies">
          <h2>Java & Spring Analogies</h2>
          <div className="analogies-grid">
            {lesson.analogies.map((analogy, index) => (
              <div key={index} className="analogy-card">
                <h3>{analogy.springConcept}</h3>
                <p><strong>Spring AI Concept:</strong> {analogy.aiConcept}</p>
                <p>{analogy.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab Navigation */}
      <InPageNav tabs={tabs} />

      {/* Tab Content */}
      <section id="concept" className="lesson-tab-content">
        <h2>Concept Explanation</h2>
        <p>
          This lesson covers the fundamental concepts of {lesson.title.toLowerCase()}.
          Understanding this concept is essential for building Spring AI applications.
        </p>

        {/* Show related concept tags from the lesson metadata */}
        {lesson.relatedLessons.length > 0 && (
          <div className="concept-tag-list" style={{ marginTop: 'var(--space-4)' }}>
            {lesson.relatedLessons.map((relatedId) => {
              const relatedLesson = lessons.find(l => l.id === relatedId)
              return relatedLesson ? (
                <span key={relatedId} className="concept-tag">{relatedLesson.title}</span>
              ) : null
            })}
          </div>
        )}
      </section>

      <section id="api" className="lesson-tab-content">
        <h2>Spring AI API</h2>
        <p>
          Learn how to implement {lesson.title.toLowerCase()} using Spring AI's abstractions.
          This section shows the key classes, interfaces, and configuration options.
        </p>

        {/* API Inspector */}
        <APIInspector
          featureId={lesson.featureId}
          requestData={{
            method: 'POST',
            url: '/api/tutor/chat',
            headers: { 'Content-Type': 'application/json' },
            body: {
              message: 'Explain Spring AI',
              model: 'openai:gpt-4o',
              temperature: 0.7
            }
          }}
          responseData={{
            status: 200,
            body: {
              choices: [{ message: { content: 'Spring AI is a framework...' }, finish_reason: 'stop' }],
              usage: { promptTokens: 15, completionTokens: 100, totalTokens: 115 }
            }
          }}
        />
      </section>

      <section id="code" className="lesson-tab-content">
        <h2>Code Implementation</h2>
        <p>
          See the practical Java implementation of {lesson.title.toLowerCase()}.
          This section includes before/after comparisons and code examples.
        </p>

        {/* Code examples from lesson.mdxFiles */}
        {lesson.interactive.showCodeDiff && (
          <div className="code-example-section" style={{ marginTop: 'var(--space-6)' }}>
            <h3>Before Spring AI vs With Spring AI</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              See how Spring AI simplifies the implementation compared to manual approaches.
            </p>
            <CodeDiff
              before={`// Manual implementation\n// Complex HTTP client setup\n// Manual JSON parsing\n// Error handling boilerplate`}
              after={`// Spring AI implementation\nChatClient.create()\n  .prompt()\n  .user("What is Spring AI?")\n  .call()\n  .content()`}
              beforeTitle="Manual Approach"
              afterTitle="With Spring AI"
              language="java"
            />
          </div>
        )}

        {/* Show source code if available */}
        {lesson.interactive.showCodeDiff === false && (
          <div className="code-placeholder" style={{
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--card-bg)',
            border: '1px dashed var(--card-border)',
            borderRadius: 'var(--radius-md)'
          }}>
            <p>Code examples would be displayed here from the lesson materials</p>
          </div>
        )}
      </section>

      <section id="runtime" className="lesson-tab-content">
        <h2>Runtime Behavior</h2>
        <p>
          Understand what happens when the application runs.
          This section shows the execution flow and runtime timelines.
        </p>

        {/* Architecture */}
        {lesson.interactive.showArchitectureDiagram && (
          <div className="architecture-section" style={{ marginTop: 'var(--space-6)' }}>
            <h3>System Architecture</h3>
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
                {`### ${lesson.title} — System Architecture

The core flow for this concept follows the Spring AI request lifecycle:

**Request Lifecycle:**

1. **Application** — Your Spring Boot application receives the request via a controller or service method.
2. **ChatClient** — Spring AI's fluent API constructs the prompt, applies advisors, and calls the model.
3. **LLM Provider** — OpenAI, Ollama, Azure, or another provider generates the response.

**Flow:**

\`\`\`
Application → ChatClient → LLM Provider → Response → Application → User
\`\`\`

The ChatClient is the central hub: it handles prompt building, parameter serialization, streaming, tool calling, and response parsing. By using ChatClient, your application is decoupled from any specific LLM provider — you can switch providers by changing configuration alone.

See the [Spring AI ChatClient documentation](https://docs.spring.io/spring-ai/reference/api/chatclient.html) for details.`}
              </Markdown>
            </div>
          </div>
        )}

        {/* Runtime Timeline */}
        <RuntimeTimeline showAdvanced={true} />
      </section>

      {/* Checkpoint */}
      {/* For now, using a placeholder checkpoint since real checkpoints would be in MDX */}
      {lesson.interactive.showCheckpoint && (
        <section className="checkpoint-section" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)' }}>
          <h2>Check Your Understanding</h2>
          <p>Test your knowledge of {lesson.title}</p>
          <Checkpoint
            type="multiple-choice"
            question={`What is the primary purpose of ${lesson.title.toLowerCase()} in Spring AI?`}
            options={[
              { label: `To provide ${lesson.title} functionality`, value: 'functionality' },
              { label: 'To replace Spring Boot', value: 'replace' },
              { label: 'To add database connectivity', value: 'database' },
              { label: 'To configure web servers', value: 'servers' }
            ]}
            answer="functionality"
            explanation={`${lesson.title} provides the core functionality for working with AI in Spring applications.`}
          />
        </section>
      )}

      {/* Related Concepts */}
      {lesson.relatedLessons && lesson.relatedLessons.length > 0 && (
        <section className="lesson-related" style={{ marginTop: 'var(--space-8)' }}>
          <h2>Related Concepts</h2>
          <div className="related-tags">
            {lesson.relatedLessons.map((relatedId) => {
              const relatedLesson = lessons.find(l => l.id === relatedId)
              return relatedLesson ? (
                <Link
                  key={relatedId}
                  to={`/lesson/${relatedId}`}
                  className="related-tag"
                >
                  {relatedLesson.title}
                </Link>
              ) : null
            })}
          </div>
        </section>
      )}

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <section className="lesson-resources" style={{ marginTop: 'var(--space-8)' }}>
          <h2>Resources & Further Reading</h2>
          <div className="resources-grid">
            {lesson.resources.map((resource, index) => (
              <div key={index} className="resource-card">
                <h3>{resource.title}</h3>
                <p>{resource.type === 'documentation' ? 'Official Documentation' :
                   resource.type === 'video' ? 'Video Tutorial' :
                   resource.type === 'article' ? 'Technical Article' : 'Reference Guide'}
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="resource-link"
                >
                  Open Resource →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lesson Progress */}
      <section className="lesson-progress" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)' }}>
        <h3 style={{ fontSize: '0.875rem', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
          Lesson Progress
        </h3>
        <p style={{ fontSize: '0.75rem', marginBottom: 'var(--space-3)', color: 'var(--text-muted)' }}>
          Part of the {currentPhase} phase
        </p>
        <div className="progress-bar" style={{ height: '6px' }}>
          <div className="progress-fill" style={{ width: `${phasePercent}%` }} />
        </div>
        <p style={{ fontSize: '0.75rem', marginTop: 'var(--space-2)', color: 'var(--text-muted)' }}>
          {phaseCompleted} / {phaseLessons.length} lessons in this phase
        </p>
      </section>

      {/* Bottom navigation bar */}
      <nav className="lesson-nav-bottom" aria-label="Lesson navigation">
        <div className="lesson-nav-bottom-left">
          <label className="mark-complete-check">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => toggle(lesson.id)}
            />
            <span>Mark as complete</span>
          </label>
        </div>
        <div className="lesson-nav-bottom-right">
          {prevLesson && (
            <button
              type="button"
              className="nav-prev"
              onClick={() => {
                if (!prereqsMet) {
                  alert('Please complete prerequisites before accessing this lesson')
                } else {
                  toggle(lesson.id);
                  navigate(`/lesson/${prevLesson.id}`)
                }
              }}
            >
              ← {currentLessonIndex === 0 ? 'Start' : 'Previous'}
            </button>
          )}
          {nextLesson && (
            <button
              type="button"
              className="nav-next"
              onClick={() => {
                toggle(lesson.id);
                navigate(`/lesson/${nextLesson.id}`)
              }}
            >
              {currentLessonIndex === lessons.length - 1 ? 'Completion' : 'Next'} →
            </button>
          )}
          {!nextLesson && (
            <button
              type="button"
              className="nav-next nav-next--completed"
              onClick={() => {
                toggle(lesson.id);
                navigate('/completion')
              }}
            >
              🎓 Go to Completion
            </button>
          )}
        </div>
      </nav>
    </div>
  )
}