/*
 * Typed client for the Snabbit Agent Console API.
 * The base URL can be overridden with the VITE_API_URL env var.
 */

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type PipelineStatus = 'passing' | 'failing' | 'running'

export interface Pipeline {
  id: string
  name: string
  provider: 'github-actions' | 'jenkins'
  branch: string
  status: PipelineStatus
  durationSeconds: number
  triggeredBy: string
  updatedAt: string
}

export interface PipelineSummary {
  total: number
  passing: number
  failing: number
  running: number
  passRate: number
}

export interface PipelinesResponse {
  provider: string
  summary: PipelineSummary
  pipelines: Pipeline[]
}

export async function fetchPipelines(
  signal?: AbortSignal,
): Promise<PipelinesResponse> {
  const res = await fetch(`${API_URL}/api/pipelines`, { signal })
  if (!res.ok) {
    throw new Error(`API responded ${res.status}`)
  }
  return res.json() as Promise<PipelinesResponse>
}
