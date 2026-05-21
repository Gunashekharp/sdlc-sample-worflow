import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import type { Store } from './store'
import type { CicdProvider } from './integrations/cicd'
import { registerRoutes } from './routes'

export interface AppDeps {
  store: Store
  cicd: CicdProvider
}

/**
 * Build the Express app from injected dependencies.
 * Tests pass an in-memory store + mock CI/CD provider; the running server
 * passes the Postgres store and the configured provider.
 */
export function createApp(deps: AppDeps) {
  const app = express()
  app.use(cors())
  app.use(express.json())

  registerRoutes(app, deps)

  // Catch-all error handler so a failed route returns JSON, not a crash.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled API error:', err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}
