/*
 * CI/CD integration adapter.
 *
 * `createMockCicdProvider` returns deterministic data and needs no
 * credentials — the default. `createGithubActionsProvider` makes real calls
 * to the GitHub Actions API and is selected automatically when both
 * GITHUB_TOKEN and GITHUB_REPO are set.
 */

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
  /** Pass rate over finished (passing + failing) pipelines, 0–100. */
  passRate: number
}

export interface CicdProvider {
  readonly name: string
  listPipelines(): Promise<Pipeline[]>
}

/** Aggregate pipeline statuses into a summary. Pure. */
export function summarizePipelines(pipelines: Pipeline[]): PipelineSummary {
  const passing = pipelines.filter((p) => p.status === 'passing').length
  const failing = pipelines.filter((p) => p.status === 'failing').length
  const running = pipelines.filter((p) => p.status === 'running').length
  const finished = passing + failing
  return {
    total: pipelines.length,
    passing,
    failing,
    running,
    passRate: finished === 0 ? 0 : Math.round((passing / finished) * 100),
  }
}

// --- Mock provider -------------------------------------------------------

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function buildMockPipelines(): Pipeline[] {
  return [
    { id: 'p-1041', name: 'CI · build & test', provider: 'github-actions', branch: 'main', status: 'passing', durationSeconds: 184, triggeredBy: 'a.kapoor', updatedAt: minutesAgo(6) },
    { id: 'p-1040', name: 'E2E suite', provider: 'github-actions', branch: 'main', status: 'running', durationSeconds: 312, triggeredBy: 'ci-bot', updatedAt: minutesAgo(2) },
    { id: 'p-1039', name: 'Deploy · staging', provider: 'github-actions', branch: 'release/4.19', status: 'passing', durationSeconds: 96, triggeredBy: 'deploy-bot', updatedAt: minutesAgo(24) },
    { id: 'p-1038', name: 'Lint & typecheck', provider: 'github-actions', branch: 'feat/agent-drawer', status: 'failing', durationSeconds: 47, triggeredBy: 'guna', updatedAt: minutesAgo(38) },
    { id: 'p-1037', name: 'Docker image', provider: 'jenkins', branch: 'main', status: 'passing', durationSeconds: 268, triggeredBy: 'ci-bot', updatedAt: minutesAgo(51) },
    { id: 'p-1036', name: 'DB migration check', provider: 'github-actions', branch: 'feat/pg-store', status: 'passing', durationSeconds: 38, triggeredBy: 'm.silva', updatedAt: minutesAgo(72) },
    { id: 'p-1035', name: 'Nightly regression', provider: 'jenkins', branch: 'main', status: 'failing', durationSeconds: 904, triggeredBy: 'scheduler', updatedAt: minutesAgo(143) },
    { id: 'p-1034', name: 'Release · production', provider: 'github-actions', branch: 'release/4.19', status: 'running', durationSeconds: 140, triggeredBy: 'deploy-bot', updatedAt: minutesAgo(4) },
  ]
}

export function createMockCicdProvider(): CicdProvider {
  return {
    name: 'mock',
    async listPipelines() {
      return buildMockPipelines()
    },
  }
}

// --- Live provider: GitHub Actions --------------------------------------

interface GithubRun {
  id: number
  name: string | null
  display_title: string
  head_branch: string | null
  status: string
  conclusion: string | null
  run_started_at: string | null
  updated_at: string
  actor?: { login: string }
}

interface GithubRunsResponse {
  workflow_runs: GithubRun[]
}

function githubRunToPipeline(run: GithubRun): Pipeline {
  const status: PipelineStatus =
    run.status !== 'completed'
      ? 'running'
      : run.conclusion === 'success'
        ? 'passing'
        : 'failing'

  const started = run.run_started_at
    ? Date.parse(run.run_started_at)
    : Date.parse(run.updated_at)
  const durationSeconds = Math.max(
    0,
    Math.round((Date.parse(run.updated_at) - started) / 1000),
  )

  return {
    id: String(run.id),
    name: run.name ?? run.display_title,
    provider: 'github-actions',
    branch: run.head_branch ?? 'unknown',
    status,
    durationSeconds,
    triggeredBy: run.actor?.login ?? 'unknown',
    updatedAt: run.updated_at,
  }
}

export function createGithubActionsProvider(
  token: string,
  repo: string,
): CicdProvider {
  return {
    name: 'github-actions',
    async listPipelines() {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/actions/runs?per_page=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      )
      if (!res.ok) {
        throw new Error(`GitHub Actions API responded ${res.status}`)
      }
      const data = (await res.json()) as GithubRunsResponse
      return data.workflow_runs.map(githubRunToPipeline)
    },
  }
}

/** Pick the live provider when credentials are present, else the mock. */
export function getCicdProvider(env: {
  githubToken: string
  githubRepo?: string
}): CicdProvider {
  if (env.githubToken && env.githubRepo) {
    return createGithubActionsProvider(env.githubToken, env.githubRepo)
  }
  return createMockCicdProvider()
}
