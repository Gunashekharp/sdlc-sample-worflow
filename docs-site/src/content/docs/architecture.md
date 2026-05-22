---
title: Architecture
---

The Snabbit Agent Console is split into a React frontend (Vite SPA) and an
Express backend API, connected over a small REST surface, with a pluggable
CI/CD integration layer. Both packages live in one repository but build, test,
and run independently.

## Product design

![Snabbit 2.0 — product design](https://gunashekharp.github.io/sdlc-sample-worflow/figma/snabbit-2-0-overview.png)

The Snabbit 2.0 product design from Figma. The Agent Console dashboard comprises:
a collapsible left sidebar (workspace switcher, navigation items, recent sessions,
user footer); a top bar with a global ⌘K search palette and an environment
switcher; a four-tile KPI strip showing agent runs, PRs reviewed, mean time to
merge, and suite pass rate; a featured-agent hero card with a gradient accent
wash and a "Run agent" call to action; a live CI/CD pipeline table with status
indicators, branch chips, and duration; a scrollable agent grid with category
tabs, a sort select, and free-text filtering; and a multi-line prompt bar pinned
at the bottom with a model picker and Enter-to-send keyboard shortcut.

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
the **CI/CD pipelines panel** makes a live network call to the backend. The KPI
strip, featured agent, and agent grid all render from static seed data bundled
into the client at build time.

## Frontend

A Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4 SPA at the repository root.

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
  KpiCard --> IconTrend["IconTrendUp / IconTrendDown"]
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

An Express 5 + TypeScript API run with `tsx`, located in `server/`.

### Dependency-injection architecture

`createApp({ store, cicd })` in `server/src/app.ts` accepts its dependencies by
injection. The running server passes a Postgres store and the configured CI/CD
provider; tests pass an in-memory store and the mock provider. This means
`npm test` needs no database and no network.

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

  tests["api.test.ts"] -->|"test"| memoryStore
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
`kpis.trend` stores a JSON array of numbers (JSONB). `kpis.sort_order` preserves
display order; it is not part of the `Kpi` domain type.

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

The frontend (`src/data/`) and backend (`server/src/domain.ts`,
`server/src/seed.ts`) maintain structurally identical `Agent` and `Kpi` types
by hand — there is no shared package. The seed data is also duplicated in both
locations.

In Postgres the columns are `snake_case`; `postgresStore.ts` maps rows back to
the camelCase domain types. The KPI `trend` array is stored as JSONB.

## CORS and ports

The API enables CORS for all origins so the Vite dev server (port 5173) can
call it (port 3001). Both ports are configurable: the API port via `PORT`, the
frontend's API base URL via `VITE_API_URL`.
