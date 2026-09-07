export interface HealthStatus {
  apiKeyConfigured: boolean
  apiKeyPreview: string
  baseUrl: string
  chatModel: string
  embeddingModel: string
  vectorStore: string
  moderationEnabled: boolean
  actuatorEnabled: boolean
  status: 'ready' | 'needs-setup'
}

const BASE = ''

export async function fetchHealth(): Promise<HealthStatus | null> {
  try {
    const response = await fetch(BASE + '/api/tutor/health')
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function fetchCallLog(): Promise<any[]> {
  try {
    const response = await fetch(BASE + '/api/tutor/calls/recent')
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}