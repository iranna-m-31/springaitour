import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer-page" style={{ marginTop: 'var(--space-16)' }}>
      <div className="footer-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="footer-section">
          <h3>Spring AI Tour</h3>
          <p>Interactive tutorial for Java/Spring Boot developers learning Spring AI.</p>
          <div className="footer-links">
            <Link to="/home" className="footer-link">Home</Link>
            <Link to="/introduction" className="footer-link">Learn</Link>
            <Link to="/lab" className="footer-link">Lab</Link>
            <Link to="/playground" className="footer-link">Playground</Link>
          </div>
        </div>

        <div className="footer-section">
          <h3>Resources</h3>
          <ul className="footer-resources">
            <li>
              <Link to="https://docs.spring.io/spring-ai/reference/index.html" target="_blank" rel="noreferrer" className="footer-link">
                Spring AI Documentation
              </Link>
            </li>
            <li>
              <Link to="https://github.com/spring-projects/spring-ai" target="_blank" rel="noreferrer" className="footer-link">
                Spring AI on GitHub
              </Link>
            </li>
            <li>
              <Link to="https://spring.io" target="_blank" rel="noreferrer" className="footer-link">
                Spring.io
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Community</h3>
          <ul className="footer-community">
            <li>
              <a href="https://spring.io/community" target="_blank" rel="noreferrer" className="footer-link">
                Spring Community
              </a>
            </li>
            <li>
              <a href="https://discord.gg/spring-ai" target="_blank" rel="noreferrer" className="footer-link">
                Discord
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul className="footer-legal">
            <li>
              <a href="#" className="footer-link">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="footer-link">Terms of Use</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom" style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--card-border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Spring AI Tour v2.0.1 · Built with React & Vite
      </div>
    </footer>
  )
}