
import { useMemo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark'
import CopyButton from './CopyButton'

export interface CodeViewProps {
  /** The source code to display */
  code: string
  /** The filename for display + language detection */
  filename: string
  /** Optional: line numbers to highlight (1-based) */
  highlightLines?: number[]
}

/** Map a filename to a syntax-highlighter language id. */
function languageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''

  const map: Record<string, string> = {
    java: 'java',
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    json: 'json',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    html: 'html',
    css: 'css',
    scss: 'scss',
    md: 'markdown',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    py: 'python',
    properties: 'properties',
    kts: 'kotlin',
    kt: 'kotlin',
    gradle: 'groovy',
  }

  return map[ext] ?? 'text'
}

/**
 * A syntax-highlighted, line-numbered, copyable code viewer.
 *
 * Uses react-syntax-highlighter with the atomOneDark theme.
 */
export default function CodeView({
  code,
  filename,
  highlightLines,
}: CodeViewProps) {
  const language = useMemo(
    () => languageFromFilename(filename),
    [filename]
  )

  const lineCount = useMemo(
    () => code.split(/\r\n|\r|\n/).length,
    [code]
  )

  return (
    <div className="code-view">
      <div className="code-view-header">
        <div className="code-view-dots">
          <span className="dot-red"></span>
          <span className="dot-yellow"></span>
          <span className="dot-green"></span>
        </div>

        <span className="code-filename">{filename}</span>

        <span className="code-view-meta">
          {lineCount} lines
        </span>

        <div className="code-view-actions">
          <CopyButton value={code} />
        </div>
      </div>

      <div className="code-container">
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          showLineNumbers
          wrapLines
          lineNumberStyle={{
            color: '#484f58',
            minWidth: '2.5em',
            paddingRight: '1em',
            userSelect: 'none',
          }}
          customStyle={{
            margin: 0,
            padding: '1rem 0',
            background: '#0d1117',
            color: '#ffffff',
            fontSize: '0.8125rem',
            flex: 1,
            overflow: 'auto',
          }}
          lineProps={(lineNumber: number) => {
            const isHighlighted =
              highlightLines?.includes(lineNumber)

            return isHighlighted
              ? {
                  style: {
                    background: 'rgba(59, 130, 246, 0.18)',
                  },
                }
              : {}
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
