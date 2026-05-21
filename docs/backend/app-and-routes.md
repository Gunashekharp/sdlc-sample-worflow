# App & routes

The Express app is assembled in `server/src/app.ts` and its routes are registered
in `server/src/routes.ts`. Both take their data dependencies as arguments, which
keeps them testable.

## `createApp(deps)` (`app.ts`)

```ts
interface AppDeps { store: Store; cicd: CicdProvider }

export function createApp(deps: AppDeps) {
  const app = express()
  app.use(cors())
  app.use(express.json())
  registerRoutes(app, deps)
  app.use((err, _req, res, _next) => {
    console.error('Unhandled API error:', err)
    res.status(500).json({ error: 'Internal server error' })
  })
  return app
}
```

**Middleware order:**

1. `cors()` — permissive CORS so the Vite dev server (port 5173) can call the
   API (port 3001) cross-origin.
2. `express.json()` — JSON body parsing.
3. The application routes.
4. A **catch-all error handler** (four-arg signature) that logs and returns
   `500 { error: 'Internal server error' }`, so a throwing route yields JSON
   instead of crashing the process.

## `registerRoutes(app, deps)` (`routes.ts`)

All routes are `GET` and read-only. The handlers for store-backed routes are
`async` and `await` the store.

| Method & path         | Handler behaviour                                                     |
| --------------------- | --------------------------------------------------------------------- |
| `GET /api/health`     | Returns `{ status: 'ok', time: <ISO> }`.                              |
| `GET /api/agents`     | `res.json(await store.listAgents())` — the full catalogue.            |
| `GET /api/agents/:id` | `await store.getAgent(id)`; `404 { error: 'Agent not found' }` if null, else the agent. |
| `GET /api/kpis`       | `res.json(await store.listKpis())`.                                   |
| `GET /api/pipelines`  | Calls `cicd.listPipelines()`, then returns `{ provider, summary, pipelines }` where `summary = summarizePipelines(pipelines)`. |

### `/api/pipelines` assembly

```ts
const pipelines = await deps.cicd.listPipelines()
res.json({
  provider: deps.cicd.name,
  summary: summarizePipelines(pipelines),
  pipelines,
})
```

`provider` is the active provider's `name` (`'mock'` or `'github-actions'`),
`summary` is the aggregate from [`summarizePipelines`](cicd-integration.md#summarizepipelines),
and `pipelines` is the raw list.

See the [API reference](../api-reference.md) for full response shapes.

!!! note "No write or validation routes yet"
    Every route is a `GET`. Request validation, structured errors, and write
    endpoints (e.g. recording agent runs) are tracked in `BACKLOG.md`.
