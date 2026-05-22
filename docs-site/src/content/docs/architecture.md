---
title: Architecture
description: How the Snabbit Agent Console fits together — with diagrams.
---

The console is split into a React frontend and an Express backend, connected
over a REST API, with a pluggable CI/CD integration. Both packages live in one
repository but build, test and run independently.

## System overview

```mermaid
flowchart TD
  subgraph Browser
    SPA["React SPA\nsrc/App.tsx"]
    LocalData["Local seed data\nsrc/data/"]
    SPA --> LocalData
  end

  subgraph Frontend["Vite dev server :5173"]
    SPA
  end

  subgraph Backend["Express API :3001\nserver/src/app.ts"]
    Routes["routes.ts"]
    Store["Store interface\nstore.ts"]
    CicdProvider["CicdProvider\nintegrations/cicd.ts"]
    Routes --> Store
    Routes --> CicdProvider
  end

  subgraph Persistence
    PG["PostgreSQL\nsnabbit_dash"]
    MockCI["Mock provider\n(default)"]
    GH["GitHub Actions API\n(when credentials set)"]
  end

  SPA -->|"GET /api/pipelines"| Routes
  Store -->|"agents, KPIs"| PG
  CicdProvider -->|listPipelines| MockCI
  CicdProvider -->|"listPipelines\nGITHUB_TOKEN + GITHUB_REPO"| GH
```

The frontend is a fully self-contained SPA. Of its four dashboard panels, only
the **CI/CD pipelines panel** makes a network call to the backend. The KPI
strip, featured agent, and agent grid all render from static seed data bundled
into the client at build time.

## Frontend

A Vite + React 19 + TypeScript + Tailwind CSS v4 SPA at the repository root.

### Component tree

```mermaid
flowchart TD
  App["App\nsrc/App.tsx"]
  Sidebar["Sidebar"]
  TopBar["TopBar"]
  KpiStrip["KpiStrip"]
  FeaturedAgent["FeaturedAgent"]
  PipelinesPanel["PipelinesPanel"]
  AgentGrid["AgentGrid"]
  PromptBar["PromptBar"]

  App --> Sidebar
  App --> TopBar
  App --> KpiStrip
  App --> FeaturedAgent
  App --> PipelinesPanel
  App --> AgentGrid
  App --> PromptBar

  KpiStrip -->|"4× KpiCard"| KpiCard["KpiCard (internal)"]
  KpiCard --> Sparkline["Sparkline"]
  KpiCard --> IconTrendUp["IconTrendUp / IconTrendDown"]
  FeaturedAgent --> StatusDot["StatusDot"]
  FeaturedAgent -->|"Stat (internal)"| Stat["Stat (internal)"]
  PipelinesPanel -->|"N× PipelineRow"| PipelineRow["PipelineRow (internal)"]
  AgentGrid -->|"N× AgentCard"| AgentCard["AgentCard"]
  AgentCard --> StatusDot
```

### Data flow (frontend)

```mermaid
flowchart LR
  agents_ts["src/data/agents.ts\nAGENTS, FEATURED_AGENT_ID"]
  kpis_ts["src/data/kpis.ts\nKPIS"]
  api_ts["src/lib/api.ts\nfetchPipelines()"]
  useFetch["useFetch hook"]
  filterAgents["filterAgents()"]
  sortAgents["sortAgents()"]
  usePersistent["usePersistentState hook"]

  agents_ts -->|"featured + rest"| App_tsx["App.tsx"]
  kpis_ts --> KpiStrip
  api_ts --> useFetch
  useFetch --> PipelinesPanel

  usePersistent -->|"category, sort"| AgentGrid
  filterAgents --> AgentGrid
  sortAgents --> AgentGrid
  agents_ts --> AgentGrid
```

## Backend

An Express 5 + TypeScript API run with `tsx`, in `server/`.

### Dependency-injection architecture

The critical architectural decision: `createApp({ store, cicd })` accepts its
dependencies by injection (`server/src/app.ts`). The running server passes a
Postgres store and the configured CI/CD provider; tests pass an in-memory store
and the mock provider. This means `npm test` needs no database, no network.

```mermaid
flowchart TD
  index["index.ts\n(server bootstrap)"]
  createApp["createApp(deps)\napp.ts"]
  registerRoutes["registerRoutes(app, deps)\nroutes.ts"]
  postgresStore["createPostgresStore(pool)\npostgresStore.ts"]
  memoryStore["createMemoryStore(agents, kpis)\nstore.ts"]
  getCicd["getCicdProvider(env)\ncicd.ts"]
  mockCicd["createMockCicdProvider()"]
  githubCicd["createGithubActionsProvider(token, repo)"]

  index -->|"runtime"| postgresStore
  index -->|"runtime"| getCicd
  getCicd -->|"no token"| mockCicd
  getCicd -->|"GITHUB_TOKEN + GITHUB_REPO"| githubCicd
  index --> createApp
  createApp --> registerRoutes

  tests["test suite\napi.test.ts"] -->|"test"| memoryStore
  tests -->|"test"| mockCicd
  tests --> createApp
```

### Request flow: pipelines panel

The only live end-to-end path in the app today:

```mermaid
sequenceDiagram
  participant Panel as PipelinesPanel
  participant Hook as useFetch
  participant Client as fetchPipelines (api.ts)
  participant Express as GET /api/pipelines
  participant Provider as CicdProvider

  Panel->>Hook: useFetch(fetchPipelines) on mount
  Hook->>Client: fetcher(signal)
  Client->>Express: GET http://localhost:3001/api/pipelines
  Express->>Provider: cicd.listPipelines()
  Provider-->>Express: Pipeline[]
  Express->>Express: summarizePipelines(pipelines)
  Express-->>Client: { provider, summary, pipelines }
  Client-->>Hook: PipelinesResponse
  Hook-->>Panel: { data, loading:false, error:null }
  Note over Panel: Renders pipeline rows

  Panel->>Hook: reload() on Refresh click
  Hook->>Hook: increment nonce → re-run effect
  Hook->>Client: fetcher(signal)
```

If the backend is unreachable the fetch rejects, `useFetch` sets `error`, and
the panel shows "Could not reach the API…" while the rest of the dashboard
(running from local data) is unaffected.

## Database schema

```mermaid
erDiagram
  agents {
    TEXT id PK
    TEXT name
    TEXT category
    TEXT description
    TEXT status
    INTEGER runs_per_week
    INTEGER success_rate
    TEXT avg_duration
    TEXT last_run
    INTEGER last_run_minutes
    BOOLEAN popular
  }

  kpis {
    TEXT id PK
    INTEGER sort_order
    TEXT label
    TEXT value
    TEXT delta
    BOOLEAN positive
    TEXT hint
    JSONB trend
  }
```

`agents` and `kpis` are independent tables with no foreign-key relationship.
The `kpis.trend` column stores a JSON array of numbers (`JSONB`). The extra
`sort_order` column on `kpis` preserves display order; it is not present on the
`Kpi` domain type.

## CI/CD provider selection

```mermaid
flowchart TD
  env{"GITHUB_TOKEN\n+ GITHUB_REPO\nboth set?"}
  mock["createMockCicdProvider()\nname: 'mock'"]
  live["createGithubActionsProvider(token, repo)\nname: 'github-actions'"]

  env -->|"No"| mock
  env -->|"Yes"| live
```

## The data boundary

The frontend (`src/data/`) and backend (`server/src/domain.ts`, `server/src/seed.ts`)
maintain structurally identical `Agent` and `Kpi` types by hand — there is no
shared package. The seed data is also duplicated.

In Postgres the columns are `snake_case`; `postgresStore.ts` maps rows back to
the camelCase domain types. The KPI `trend` array is stored as JSONB.

## CORS and ports

The API enables CORS for all origins so the Vite dev server (port 5173) can
call it (port 3001). Both ports are configurable: the API port via `PORT`, the
frontend's API base via `VITE_API_URL`.
