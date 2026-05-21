import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PipelinesPanel from './PipelinesPanel'

const sampleResponse = {
  provider: 'mock',
  summary: { total: 2, passing: 1, failing: 0, running: 1, passRate: 100 },
  pipelines: [
    {
      id: 'p1',
      name: 'CI · build & test',
      provider: 'github-actions',
      branch: 'main',
      status: 'passing',
      durationSeconds: 95,
      triggeredBy: 'guna',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      name: 'E2E suite',
      provider: 'github-actions',
      branch: 'feat/x',
      status: 'running',
      durationSeconds: 240,
      triggeredBy: 'ci-bot',
      updatedAt: new Date().toISOString(),
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('<PipelinesPanel />', () => {
  it('renders pipelines returned by the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => sampleResponse }),
    )
    render(<PipelinesPanel />)
    expect(await screen.findByText('CI · build & test')).toBeInTheDocument()
    expect(screen.getByText('E2E suite')).toBeInTheDocument()
  })

  it('shows an error state when the API is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down')),
    )
    render(<PipelinesPanel />)
    expect(
      await screen.findByText(/could not reach the api/i),
    ).toBeInTheDocument()
  })
})
