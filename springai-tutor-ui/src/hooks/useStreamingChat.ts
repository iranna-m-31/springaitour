import { useCallback, useRef, useState } from 'react'

export interface StreamOptions {
  /** URL path (e.g. "/ai/stream") */
  path: string
  /** Query parameters */
  params?: Record<string, string>
  /** Called for each token received from the server */
  onToken: (token: string) => void
  /** Called once the stream completes successfully */
  onDone?: (fullText: string) => void
  /** Called if the stream errors or is aborted */
  onError?: (error: Error) => void
}

export interface StreamHandle {
  /** Begin streaming. Returns a promise that resolves when done. */
  start: () => Promise<void>
  /** Abort the in-flight stream */
  abort: () => void
  /** Whether a stream is currently active */
  streaming: boolean
  /** The full text accumulated so far */
  text: string
}

/**
 * useStreamingChat - Consume a Server-Sent-Events (text/event-stream) endpoint
 * that emits one `data: "token"\n\n` frame per token. Compatible with the
 * Spring Boot default Flux<String> serialization.
 *
 * Tokens are delivered via the onToken callback as they arrive. The hook
 * itself tracks the running total in `text` so callers don't need their own
 * accumulator.
 *
 * @example
 *   const stream = useStreamingChat()
 *   <button onClick={() => stream.start({ path: '/ai/stream', params, onToken: append })}>
 *     Start
 *   </button>
 */
export function useStreamingChat() {
  const [streaming, setStreaming] = useState(false)
  const [text, setText] = useState('')
  const controllerRef = useRef<AbortController | null>(null)

  const abort = useCallback(() => {
    controllerRef.current?.abort()
    controllerRef.current = null
  }, [])

  const start = useCallback(
    async (opts: StreamOptions) => {
      // Build the URL identically to client.ts: same-origin + searchParams.
      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const url = new URL(opts.path, base)
      Object.entries(opts.params ?? {}).forEach(([k, v]) => {
        if (v !== '') url.searchParams.set(k, v)
      })

      // Reset state and create a fresh AbortController.
      setText('')
      setStreaming(true)
      const controller = new AbortController()
      controllerRef.current = controller

      let buffer = ''
      let acc = ''

      const flushFrame = (frame: string): string | null => {
        // An SSE event may span multiple lines; the payload is on the line
        // starting with "data:". Empty line terminates the event.
        const dataLines: string[] = []
        for (const line of frame.split('\n')) {
          if (line.startsWith('data:')) {
            // The Spring serializer emits data:"<token>" — strip the prefix
            // and the surrounding quotes. We accept both with and without
            // quotes for robustness.
            let payload = line.slice(5).trimStart()
            if (payload.startsWith('"') && payload.endsWith('"')) {
              payload = payload.slice(1, -1)
            }
            dataLines.push(payload)
          }
        }
        if (dataLines.length === 0) return null
        // Tokens are typically one per frame; join just in case.
        return dataLines.join('\n')
      }

      try {
        const res = await fetch(url.toString(), {
          method: 'GET',
          signal: controller.signal,
          headers: { Accept: 'text/event-stream' },
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`)
        }
        if (!res.body) {
          throw new Error('Response has no body')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')

        // Read loop. Each iteration receives a chunk; we append it to a
        // buffer, then split on \n\n (event boundary) and process any
        // complete frames. Remaining partial frame stays in the buffer.
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          let boundary = buffer.indexOf('\n\n')
          while (boundary !== -1) {
            const frame = buffer.slice(0, boundary)
            buffer = buffer.slice(boundary + 2)
            const token = flushFrame(frame)
            if (token !== null) {
              acc += token
              setText(acc)
              opts.onToken(token)
            }
            boundary = buffer.indexOf('\n\n')
          }
        }

        // Drain any final buffered frame.
        if (buffer.trim().length > 0) {
          const token = flushFrame(buffer)
          if (token !== null) {
            acc += token
            setText(acc)
            opts.onToken(token)
          }
        }

        opts.onDone?.(acc)
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // Caller-initiated abort; surface as text we already have.
          opts.onDone?.(acc)
        } else {
          const e = err instanceof Error ? err : new Error(String(err))
          opts.onError?.(e)
        }
      } finally {
        setStreaming(false)
        if (controllerRef.current === controller) {
          controllerRef.current = null
        }
      }
    },
    []
  )

  return { start, abort, streaming, text }
}
