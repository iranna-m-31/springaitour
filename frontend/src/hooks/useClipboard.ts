import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useClipboard - Copy text to the clipboard with transient "copied" feedback.
 *
 * Falls back to a hidden textarea + document.execCommand('copy') when the
 * async Clipboard API is unavailable (e.g. insecure contexts, older browsers).
 *
 * @example
 *   const { copy, copied, error } = useClipboard()
 *   <button onClick={() => copy(code)}>{copied ? '✓ Copied' : 'Copy'}</button>
 */
export function useClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const copy = useCallback(
    async (text: string) => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }

      const writeViaApi = async () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
          return
        }
        // Legacy fallback for non-secure contexts.
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        ta.style.pointerEvents = 'none'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        if (!ok) {
          throw new Error('execCommand copy failed')
        }
      }

      try {
        await writeViaApi()
        setError(null)
        setCopied(true)
        timerRef.current = window.setTimeout(() => setCopied(false), timeoutMs)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Copy failed'
        setError(msg)
        setCopied(false)
      }
    },
    [timeoutMs]
  )

  return { copy, copied, error }
}
