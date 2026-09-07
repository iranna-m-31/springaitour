const BASE = typeof window !== 'undefined' ? window.location.origin : ''

export interface ApiError {
  status: number
  message: string
  path: string
}

export async function callApi(
  method: string,
  path: string,
  params: Record<string, string> = {}
): Promise<{ data: any; error: ApiError | null }> {
  try {
    // Construct full URL: use window.location.origin as base
    // If path starts with /, it's relative to origin
    const url = new URL(path, BASE)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '') {
        url.searchParams.set(key, value)
      }
    })

    const response = await fetch(url.toString(), { method })
    if (!response.ok) {
      const errorBody = await response.text()
      return {
        data: null,
        error: {
          status: response.status,
          message: errorBody || response.statusText,
          path: url.pathname,
        },
      }
    }

    const text = await response.text()
    try {
      const data = JSON.parse(text)
      return { data, error: null }
    } catch {
      return { data: text, error: null }
    }
  } catch (err) {
    return {
      data: null,
      error: {
        status: 0,
        message: err instanceof Error ? err.message : 'Network error',
        path,
      },
    }
  }
}

/**
 * Build a URL for a path + query params, using the same-origin convention
 * as callApi. Exposed so streaming helpers can reuse the URL-construction
 * logic without duplicating it.
 */
export function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(path, BASE)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '') url.searchParams.set(key, value)
  })
  return url.toString()
}

/**
 * Stream SSE/text-event-stream responses. Each `data: "<token>"\n\n` frame
 * triggers onToken. Returns an object with `abort()` to cancel the stream.
 *
 * The Spring Boot default Flux<String> serializer emits one frame per
 * emitted element with payload `data:"<token>"\n\n`, so the parser below
 * strips the surrounding quotes.
 */
export function streamChat(
  path: string,
  params: Record<string, string> = {},
  onToken: (token: string) => void
): { abort: () => void; done: Promise<string> } {
  const controller = new AbortController()
  const url = buildUrl(path, params)
  let buffer = ''
  let acc = ''

  const flushFrame = (frame: string): string | null => {
    const dataLines: string[] = []
    for (const line of frame.split('\n')) {
      if (line.startsWith('data:')) {
        let payload = line.slice(5).trimStart()
        if (payload.startsWith('"') && payload.endsWith('"')) {
          payload = payload.slice(1, -1)
        }
        dataLines.push(payload)
      }
    }
    return dataLines.length ? dataLines.join('\n') : null
  }

  const done = (async () => {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'text/event-stream' },
    })
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`)
    }
    if (!res.body) throw new Error('Response has no body')

    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    while (true) {
      const { done: d, value } = await reader.read()
      if (d) break
      buffer += decoder.decode(value, { stream: true })
      let boundary = buffer.indexOf('\n\n')
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        const token = flushFrame(frame)
        if (token !== null) {
          acc += token
          onToken(token)
        }
        boundary = buffer.indexOf('\n\n')
      }
    }
    if (buffer.trim()) {
      const token = flushFrame(buffer)
      if (token !== null) {
        acc += token
        onToken(token)
      }
    }
    return acc
  })()

  return {
    abort: () => controller.abort(),
    done,
  }
}
