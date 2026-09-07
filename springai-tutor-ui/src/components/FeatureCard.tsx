import type { Feature } from '../data/features'
import DemoPanel from './DemoPanel'
import SetupBanner from './SetupBanner'

interface FeatureCardProps {
  feature: Feature
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <SetupBanner />

      <h2>
        {feature.number}. {feature.title}
        {feature.requiresDocker && <span className="badge badge-docker" style={{ marginLeft: '1rem', fontSize: '0.7rem' }}>🐳 Docker required</span>}
        {feature.requiresPaidKey && <span className="badge badge-paid" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>🔑 Paid key</span>}
      </h2>
      <p className="endpoint">{feature.endpoint}</p>

      <section className="description">
        <h3>What it does</h3>
        <p>{feature.description}</p>
      </section>

      {feature.concepts && feature.concepts.length > 0 && (
        <section className="concepts">
          <h3>Concepts covered</h3>
          <div className="concept-tag-list">
            {feature.concepts.map((c) => (
              <span key={c} className="concept-tag">{c}</span>
            ))}
          </div>
        </section>
      )}

      <DemoPanel feature={feature} />

      {feature.responseHint && (
        <section className="response-hint">
          <h3>Expected Response</h3>
          <p>{feature.responseHint}</p>
        </section>
      )}
    </div>
  )
}