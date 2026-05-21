import type { Express } from 'express'
import type { AppDeps } from './app'
import { summarizePipelines } from './integrations/cicd'

/** Register all REST routes on the given Express app. */
export function registerRoutes(app: Express, deps: AppDeps): void {
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() })
  })

  app.get('/api/agents', async (_req, res) => {
    res.json(await deps.store.listAgents())
  })

  app.get('/api/agents/:id', async (req, res) => {
    const agent = await deps.store.getAgent(req.params.id)
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' })
      return
    }
    res.json(agent)
  })

  app.get('/api/kpis', async (_req, res) => {
    res.json(await deps.store.listKpis())
  })

  app.get('/api/pipelines', async (_req, res) => {
    const pipelines = await deps.cicd.listPipelines()
    res.json({
      provider: deps.cicd.name,
      summary: summarizePipelines(pipelines),
      pipelines,
    })
  })
}
