import SyntaxHighlighter from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark'
import CopyButton from './CopyButton'

interface CodeBlockProps {
  language: string
  value: string
}

export default function CodeBlock({ language, value }: CodeBlockProps) {
  return (
    <div className="code-block">
      <div className="code-block-toolbar">
        <span className="code-block-lang">{language}</span>
        <CopyButton value={value} label="Copy" />
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        customStyle={{ margin: 0, background: 'transparent' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
