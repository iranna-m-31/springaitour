const BASE = ''

export interface SourceResponse {
  file: string
  content: string
  size: number
}

export async function fetchSource(featureId: string): Promise<SourceResponse[]> {
  const response = await fetch(`${BASE}/api/tutor/source/${featureId}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch source: ${response.status}`)
  }
  return response.json()
}
