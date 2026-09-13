import CodeBlock from './CodeBlock'

interface CodeDiffProps {
  before?: string
  after: string
  beforeTitle?: string
  afterTitle?: string
  language?: string
}

/**
 * Code diff view showing "Before Spring AI" vs "After Spring AI".
 * Uses two CodeBlock components side by side.
 */
export default function CodeDiff({ before, after, beforeTitle, afterTitle, language = 'java' }: CodeDiffProps) {
  return (
    <div className="code-diff">
      <h4 className="code-diff-title">Before / After</h4>
      <div className="code-diff-container">
        {before ? (
          <div className="code-diff-before">
            {beforeTitle && <span className="code-diff-label">{beforeTitle}</span>}
            <CodeBlock language={language} value={before} showCopy={false} />
          </div>
        ) : null}
        <div className="code-diff-after">
          {afterTitle && <span className="code-diff-label">{afterTitle}</span>}
          <CodeBlock language={language} value={after} />
        </div>
      </div>
    </div>
  )
}