---
title: Backend overview
---

The backend is an **Express 5 + TypeScript** API, run with `tsx`. It serves the
agent catalogue, KPIs and CI/CD pipelines, backed by PostgreSQL and a pluggable
CI/CD integration. It lives in `server/`.

## App factory and dependency injection

The app is built by a factory that takes its dependencies by injection
(`app.ts`):

```ts
export interface AppDeps {
  store: Store
  cicd: CicdProvider
}

export function createApp(deps: AppDeps) {
  const app = express()
  app.use(cors())
  app.use(express.json())
  registerRoutes(app, deps)
  // Catch-all error handler so a failed route returns JSON, not a crash.
  app.use((err, _req, res, _next) => {
    console.error('Unhandled API error:', err)
    res.status(500).json({ error: 'Internal server error' })
  })
  return app
}
```

Injecting `store` and `cicd` is what lets tests run with an in-memory store and
a mock CI/CD provider while the running server uses Postgres and the configured
provider. CORS is enabled for all origins so the Vite dev server (port 5173)
can call the API (port 3001).

## Server bootstrap

`index.ts` wires the real dependencies and starts listening:

```ts
const pool = new Pool({ connectionString: config.databaseUrl })
const store = createPostgresStore(pool)
const cicd = getCicdProvider({
  githubToken: config.githubToken,
  githubRepo: config.githubRepo,
})
const app = createApp({ store, cicd })
app.listen(config.port, () => { /* log */ })
```

## Configuration (`config.ts`)

Runtime config is read from environment variables with local-friendly
defaults:

| Field         | Env var        | Default                                  |
| ------------- | -------------- | ---------------------------------------- |
| `port`        | `PORT`         | `3001`                                   |
| `databaseUrl` | `DATABASE_URL` | `postgres://localhost:5432/snabbit_dash` |
| `githubToken` | `GITHUB_TOKEN` | `''`                                     |
| `githubRepo`  | `GITHUB_REPO`  | `''`                                     |

When `githubToken` and `githubRepo` are both set, the CI/CD adapter switches
from the mock to the live GitHub Actions provider.

## Source structure

| Path                       | Contents                                            |
| -------------------------- | --------------------------------------------------- |
| `src/index.ts`             | Server bootstrap                                    |
| `src/app.ts`               | `createApp` factory + error handler                 |
| `src/routes.ts`            | REST route registration                             |
| `src/config.ts`            | Environment configuration                           |
| `src/domain.ts`            | `Agent` / `Kpi` domain types                        |
| `src/store.ts`             | Store interfaces + in-memory store                  |
| `src/postgresStore.ts`     | Postgres-backed store                               |
| `src/seed.ts`              | Seed agents and KPIs                                |
| `src/db/schema.ts`         | `CREATE TABLE` SQL                                  |
| `src/db/setup.ts`          | `db:setup` script                                   |
| `src/integrations/cicd.ts` | CI/CD adapter (mock + GitHub Actions)               |
| `src/__tests__/`           | Vitest suites                                       |

## See also

- [REST API](/sdlc-sample-worflow/backend/api/)
- [Data model](/sdlc-sample-worflow/backend/data-model/)
- [Stores & database](/sdlc-sample-worflow/backend/stores/)
- [CI/CD integration](/sdlc-sample-worflow/backend/cicd-integration/)
