import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function DownloadSection() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch('/download')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'springai-tour.zip'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        alert('Download failed — make sure the server is running.')
      }
    } catch {
      alert('Download failed — make sure the server is running.')
    }
    setDownloading(false)
  }

  return (
    <div className="download-section">
      <h2>Download the Full Project</h2>
      <p>
        Get everything you need to run the Spring AI tutor locally — the
        Spring Boot backend, all 16 feature demos, and the documentation.
      </p>

      <button className="download-btn" onClick={handleDownload} disabled={downloading}>
        {downloading ? 'Generating...' : '📦 Download ZIP'}
      </button>

      <h3>How to get started</h3>
      <CodeBlock
        language="bash"
        value={`# 1. Extract the downloaded zip
unzip springai-tour.zip
cd springai

# 2. Make sure your OpenRouter API key is set in
#    src/main/resources/application.properties

# 3. Start the server (one command starts everything)
./gradlew bootRun

# 4. Open your browser
http://localhost:8080`}
      />

      <h3>What's inside</h3>
      <ul>
        <li>Spring Boot backend with all 16 feature endpoints</li>
        <li>React + TypeScript tutorial UI</li>
        <li>OpenRouter API key configuration</li>
        <li>START_GUIDE.md — step-by-step start instructions</li>
        <li>TEST_GUIDE.md — every feature tested with curl</li>
        <li>SimpleVectorStore with sample docs for RAG demos</li>
      </ul>

      <h3>Requirements</h3>
      <ul>
        <li>Java 25+ and Gradle</li>
        <li>OpenRouter API key (free tier works for most features)</li>
        <li>A browser</li>
      </ul>
    </div>
  )
}
