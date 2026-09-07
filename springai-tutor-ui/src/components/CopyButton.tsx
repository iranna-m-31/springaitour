import { useClipboard } from '../hooks/useClipboard'

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
}

/**
 * A small button that copies the given text to the clipboard.
 * Shows "✓ Copied" for 2 seconds after a successful copy.
 *
 * Uses the .copy-btn / .copy-feedback styles already defined in app.css.
 */
export default function CopyButton({ value, label = 'Copy', className }: CopyButtonProps) {
  const { copy, copied, error } = useClipboard()

  return (
    <button
      type="button"
      className={`copy-btn ${className ?? ''}`.trim()}
      onClick={() => copy(value)}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? '✓ Copied' : error ? '✗ Failed' : `📋 ${label}`}
    </button>
  )
}
