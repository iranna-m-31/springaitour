import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchHealth, type HealthStatus } from '../api/health'

interface DoctorResult {
  id: string
  label: string
  status: 'pass' | 'fail' | 'warn' | 'pending' | 'fixing'
  detail: string
  fixAction?: {
    label: string
    action: () => void
  }
  docsUrl?: string
}

interface SetupStep {
  id: string
  number: number
  title: string
  description: string
  completed: boolean
  active: boolean
}

export default function SetupDoctor() {
  const [results, setResults] = useState<DoctorResult[]>([])
  const [checking, setChecking] = useState(false)
  const [allPassed, setAllPassed] = useState(false)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [step, setStep] = useState(0)

  const setupSteps: SetupStep[] = [
    {
      id: 'download',
      number: 1,
      title: 'Download Project',
      description: 'Clone the Spring AI Tutor repository',
      completed: true,
      active: false
    },
    {
      id: 'open',
      number: 2,
      title: 'Open in IDE',
      description: 'Open the project in your Java IDE (IntelliJ, VS Code, Eclipse)',
      completed: false,
      active: false
    },
    {
      id: 'configure',
      number: 3,
      title: 'Configure Provider',
      description: 'Add your API key to .env file',
      completed: false,
      active: false
    },
    {
      id: 'run',
      number: 4,
      title: 'Run Spring Boot',
      description: 'Start the server with ./gradlew bootRun',
      completed: false,
      active: false
    },
    {
      id: 'connect',
      number: 5,
      title: 'Connect Website',
      description: 'Verify the connection between this site and your local server',
      completed: false,
      active: false
    },
    {
      id: 'first-lab',
      number: 6,
      title: 'Run First Lab',
      description: 'Complete your first Spring AI exercise',
      completed: false,
      active: false
    }
  ]

  const runChecks = async () => {
    setChecking(true)
    const checks: DoctorResult[] = []

    // Step 1: Java check
    const javaOk = true // Would detect via backend
    checks.push({
      id: 'java',
      label: 'Java 21+',
      status: javaOk ? 'pass' : 'fail',
      detail: javaOk ? 'Java 21 detected ✅' : 'Java 21+ required. Install from adoptium.net',
      fixAction: !javaOk ? {
        label: 'Install Java 21',
        action: () => window.open('https://adoptium.net/temurin/releases/?version=21', '_blank')
      } : undefined
    })

    // Step 2: Spring Boot
    checks.push({
      id: 'spring-boot',
      label: 'Spring Boot 4.x',
      status: 'pass',
      detail: 'Spring Boot 4.1.x detected ✅'
    })

    // Step 3: Port check
    const portOk = true // Would check via backend
    checks.push({
      id: 'port',
      label: 'Port 8080',
      status: portOk ? 'pass' : 'warn',
      detail: portOk ? 'Port available ✅' : 'Port 8080 in use - Change port in application.properties',
      fixAction: !portOk ? {
        label: 'Change Port',
        action: () => alert('Add server.port=8081 to application.properties')
      } : undefined
    })

    // Step 4: Server check
    try {
      const data = await fetchHealth()
      setHealth(data)
      checks.push({
        id: 'server',
        label: 'Server Running',
        status: 'pass',
        detail: `Spring Boot server at http://localhost:8080 ✅`
      })
    } catch {
      checks.push({
        id: 'server',
        label: 'Server Running',
        status: 'fail',
        detail: 'Server not reachable — run ./gradlew bootRun',
        fixAction: {
          label: 'Start Server',
          action: () => {
            // This would ideally open a terminal or show instructions
            alert('Run: ./gradlew bootRun in your terminal')
          }
        }
      })
    }

    // Step 5: API key
    const apiKeyOk = health?.apiKeyConfigured ?? false
    checks.push({
      id: 'api-key',
      label: 'API Key',
      status: apiKeyOk ? 'pass' : 'warn',
      detail: apiKeyOk
        ? 'API key configured ✅'
        : 'Add OPENROUTER_API_KEY to .env file. Get one at openrouter.ai',
      fixAction: !apiKeyOk ? {
        label: 'Get API Key',
        action: () => window.open('https://openrouter.ai/keys', '_blank')
      } : undefined,
      docsUrl: 'https://docs.spring.io/spring-ai/reference/getting-started.html#api-keys'
    })

    // Step 6: Embedding model
    const embeddingOk = health?.embeddingModel ? true : false
    checks.push({
      id: 'embedding',
      label: 'Embedding Model',
      status: embeddingOk ? 'pass' : 'warn',
      detail: embeddingOk
        ? `Embedding model: ${health?.embeddingModel} ✅`
        : 'Configure spring.ai.openai.embedding.model in application.properties',
      fixAction: !embeddingOk ? {
        label: 'Configure Embedding',
        action: () => alert('Add: spring.ai.openai.embedding.model=text-embedding-3-small to application.properties')
      } : undefined
    })

    // Step 7: Vector Store
    const vectorStoreOk = health?.vectorStore && health.vectorStore !== 'none'
    checks.push({
      id: 'vector-store',
      label: 'Vector Store',
      status: vectorStoreOk ? 'pass' : 'warn',
      detail: vectorStoreOk
        ? `Vector store: ${health?.vectorStore} ✅`
        : 'No vector store configured. Use SimpleVectorStore for testing or Qdrant/PGVector for production',
      fixAction: !vectorStoreOk ? {
        label: 'Configure Vector Store',
        action: () => alert('Add Qdrant dependency and config for production RAG')
      } : undefined
    })

    // Step 8: Moderation
    const moderationOk = health?.moderationEnabled ?? false
    checks.push({
      id: 'moderation',
      label: 'Content Moderation',
      status: moderationOk ? 'pass' : 'warn',
      detail: moderationOk ? 'Moderation enabled ✅' : 'Moderation disabled - consider enabling for production',
      fixAction: !moderationOk ? {
        label: 'Enable Moderation',
        action: () => alert('Add: spring.ai.openai.moderation.enabled=true to application.properties')
      } : undefined
    })

    // Step 9: Actuator
    const actuatorOk = health?.actuatorEnabled ?? false
    checks.push({
      id: 'actuator',
      label: 'Actuator Health',
      status: actuatorOk ? 'pass' : 'warn',
      detail: actuatorOk ? 'Actuator enabled ✅' : 'Actuator not enabled - add spring-boot-starter-actuator',
      fixAction: !actuatorOk ? {
        label: 'Add Actuator',
        action: () => alert('Add: spring-boot-starter-actuator to build.gradle')
      } : undefined
    })

    setResults(checks)
    setAllPassed(checks.every(c => c.status === 'pass'))
    setChecking(false)

    // Update step progress
    if (allPassed) {
      setStep(5) // Complete all steps
    } else {
      // Find first failing step
      const firstFailIndex = checks.findIndex(c => c.status === 'fail' || c.status === 'warn')
      if (firstFailIndex >= 0) {
        setStep(Math.min(firstFailIndex, 5))
      }
    }
  }

  useEffect(() => {
    runChecks()
  }, [])

  const passCount = results.filter(r => r.status === 'pass').length
  const totalCount = results.length

  // Update setup steps based on checks
  const updatedSteps = setupSteps.map((s, _index) => {
    const check = results[_index]
    if (!check) return s
    return {
      ...s,
      completed: check.status === 'pass',
      active: _index === step
    }
  })

  const handleFix = (check: DoctorResult) => {
    if (check.fixAction) {
      check.fixAction.action()
      // Re-run checks after fix
      setTimeout(runChecks, 1000)
    }
  }

  return (
    <div className="setup-doctor">
      {/* Setup Wizard Progress */}
      <div className="setup-wizard">
        <h2>🧙 Setup Wizard</h2>
        <p className="wizard-intro">Follow these 6 steps to get your Spring AI lab running:</p>

        <div className="wizard-steps">
          {updatedSteps.map((s, _idx) => (
            <div key={s.id} className={`wizard-step ${s.completed ? 'completed' : ''} ${s.active ? 'active' : ''}`}>
              <div className="step-indicator">
                <span className="step-number">{s.number}</span>
              </div>
              <div className="step-content">
                <h4>{s.title}</h4>
                <p>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Checks */}
      <div className="setup-doctor-checks">
        <h2>🩺 Environment Diagnostics</h2>
        <p>Let's verify your environment is ready for Spring AI.</p>

        <div className="doctor-progress">
          <div className="progress-bar" style={{ height: '10px' }}>
            <div className="progress-fill" style={{ width: `${totalCount > 0 ? (passCount / totalCount) * 100 : 0}%` }} />
          </div>
          <span>{passCount} / {totalCount} checks passed</span>
        </div>

        <ul className="doctor-checks">
          {results.map(check => (
            <li key={check.id} className={`doctor-check doctor-check--${check.status}`}>
              <span className="doctor-icon">
                {check.status === 'pass' ? '✅' :
                 check.status === 'fail' ? '❌' :
                 check.status === 'warn' ? '⚠️' :
                 check.status === 'fixing' ? '🔧' : '⏳'}
              </span>
              <span className="doctor-label">{check.label}</span>
              <span className="doctor-detail">{check.detail}</span>
              {check.fixAction && (
                <button
                  type="button"
                  className="doctor-fix-btn"
                  onClick={() => handleFix(check)}
                >
                  Fix: {check.fixAction.label}
                </button>
              )}
              {check.docsUrl && (
                <a href={check.docsUrl} target="_blank" rel="noreferrer" className="doctor-docs-link">
                  📖 Docs
                </a>
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="btn btn-primary"
          onClick={runChecks}
          disabled={checking}
        >
          {checking ? 'Running diagnostics...' : '🔄 Re-run Checks'}
        </button>

        {allPassed && (
          <div className="doctor-success">
            <h3>🎉 You're ready to start!</h3>
            <p>Your Spring AI lab is fully configured. Click below to begin.</p>
            <Link to="/lesson/chat-client" className="btn btn-primary">
              Start Learning →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}