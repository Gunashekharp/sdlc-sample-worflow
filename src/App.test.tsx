import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// App mounts PipelinesPanel, which fetches on render — keep the test hermetic.
const emptyPipelines = {
  provider: 'mock',
  summary: { total: 0, passing: 0, failing: 0, running: 0, passRate: 0 },
  pipelines: [],
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => emptyPipelines }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('<App />', () => {
  it('renders the featured agent', () => {
    render(<App />)
    expect(screen.getByText('Featured agent')).toBeInTheDocument()
    expect(screen.getByText('PR Reviewer')).toBeInTheDocument()
  })

  it('renders the KPI strip', () => {
    render(<App />)
    expect(
      screen.getByRole('region', { name: /key metrics/i }),
    ).toBeInTheDocument()
  })

  it('renders agents in the grid', () => {
    render(<App />)
    expect(screen.getByText('Deploy Bot')).toBeInTheDocument()
    expect(screen.getByText('Alert Triage')).toBeInTheDocument()
  })

  it('renders the prompt input', () => {
    render(<App />)
    expect(screen.getByLabelText('Prompt input')).toBeInTheDocument()
  })
})
