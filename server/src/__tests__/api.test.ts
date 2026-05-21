import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { createMemoryStore } from '../store'
import { createMockCicdProvider } from '../integrations/cicd'
import { SEED_AGENTS, SEED_KPIS } from '../seed'

function testApp() {
  return createApp({
    store: createMemoryStore(SEED_AGENTS, SEED_KPIS),
    cicd: createMockCicdProvider(),
  })
}

describe('REST API', () => {
  it('GET /api/health reports ok', async () => {
    const res = await request(testApp()).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('GET /api/agents returns the full catalogue', async () => {
    const res = await request(testApp()).get('/api/agents')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(SEED_AGENTS.length)
  })

  it('GET /api/agents/:id returns a single agent', async () => {
    const res = await request(testApp()).get('/api/agents/pr-reviewer')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('PR Reviewer')
  })

  it('GET /api/agents/:id returns 404 for an unknown id', async () => {
    const res = await request(testApp()).get('/api/agents/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })

  it('GET /api/kpis returns the KPI list', async () => {
    const res = await request(testApp()).get('/api/kpis')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(SEED_KPIS.length)
  })

  it('GET /api/pipelines returns pipelines with a matching summary', async () => {
    const res = await request(testApp()).get('/api/pipelines')
    expect(res.status).toBe(200)
    expect(res.body.provider).toBe('mock')
    expect(res.body.pipelines.length).toBeGreaterThan(0)
    expect(res.body.summary.total).toBe(res.body.pipelines.length)
  })
})
