import { describe, it, expect } from 'vitest'
import {
  createMockCicdProvider,
  getCicdProvider,
  summarizePipelines,
} from '../integrations/cicd'
import type { Pipeline, PipelineStatus } from '../integrations/cicd'

function pipe(status: PipelineStatus): Pipeline {
  return {
    id: 'p',
    name: 'pipeline',
    provider: 'github-actions',
    branch: 'main',
    status,
    durationSeconds: 30,
    triggeredBy: 'tester',
    updatedAt: new Date().toISOString(),
  }
}

describe('summarizePipelines', () => {
  it('counts each status', () => {
    const s = summarizePipelines([
      pipe('passing'),
      pipe('passing'),
      pipe('failing'),
      pipe('running'),
    ])
    expect(s.total).toBe(4)
    expect(s.passing).toBe(2)
    expect(s.failing).toBe(1)
    expect(s.running).toBe(1)
  })

  it('computes pass rate over finished pipelines only', () => {
    // 2 passing, 1 failing, 1 running -> 2/3 finished -> 67%
    const s = summarizePipelines([
      pipe('passing'),
      pipe('passing'),
      pipe('failing'),
      pipe('running'),
    ])
    expect(s.passRate).toBe(67)
  })

  it('handles an empty list', () => {
    expect(summarizePipelines([])).toEqual({
      total: 0,
      passing: 0,
      failing: 0,
      running: 0,
      passRate: 0,
    })
  })
})

describe('getCicdProvider', () => {
  it('falls back to the mock provider without credentials', () => {
    expect(getCicdProvider({ githubToken: '' }).name).toBe('mock')
  })

  it('selects the GitHub provider when token and repo are present', () => {
    expect(
      getCicdProvider({ githubToken: 'tok', githubRepo: 'snabbit/app' }).name,
    ).toBe('github-actions')
  })
})

describe('mock CI/CD provider', () => {
  it('returns a non-empty, well-formed pipeline list', async () => {
    const pipelines = await createMockCicdProvider().listPipelines()
    expect(pipelines.length).toBeGreaterThan(0)
    for (const p of pipelines) {
      expect(p.id).toBeTruthy()
      expect(['passing', 'failing', 'running']).toContain(p.status)
    }
  })
})
