import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark'

interface MarkdownViewerProps {
  text: string
}

export default function MarkdownViewer({ text }: MarkdownViewerProps) {
  if (!text || text.trim() === '') {
    return <p className="text-muted">No response</p>
  }

  return (
    <div className="markdown-viewer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            if (match && typeof children === 'string') {
              return (
                <div className="code-block">
                  <SyntaxHighlighter
                    language={match[1]}
                    style={atomOneDark}
                    customStyle={{ margin: 0 }}
                  >
                    {children}
                  </SyntaxHighlighter>
                </div>
              )
            }
            return <code className={className} {...props}>{children}</code>
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}