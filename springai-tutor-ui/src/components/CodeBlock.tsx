
import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark'
import CopyButton from './CopyButton'

interface CodeBlockProps {
  language: string
  value: string
  showCopy?: boolean
}

export default function CodeBlock({
  language,
  value,
  showCopy = true,
}: CodeBlockProps) {
  return (
    <div className="code-block not-prose">
      <div className="code-block-toolbar">
        <span className="code-block-lang">
          {language}
        </span>

        {showCopy && (
          <CopyButton
            value={value}
            label="Copy"
          />
        )}
      </div>

      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          background: '#0d1117',
          color: '#ffffff',
          padding: '1rem',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
