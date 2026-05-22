---
title: Architecture
---

The console is split into a React frontend and an Express backend, connected
over a REST API, with a pluggable CI/CD integration on the backend.

## Component map

```
Browser
  └─ React app (Vite)            repo root, src/
       ├─ App.tsx                 dashboard layout
       ├─ components/             UI: KPI strip, agent grid, pipelines panel…
       ├─ lib/                    API client, hooks, pure logic
       └─ data/                   local seed data + types
                │
                │  fetch  GET /api/pipelines
                ▼
Express API (tsx)                 server/src/
  ├─ app.ts                       app factory (DI of store + cicd)
  ├─ routes.ts                    REST endpoints
  ├─ store.ts / postgresStore.ts  data access (in-memory / Postgres)
  ├─ integrations/cicd.ts         CI/CD adapter (mock / GitHub Actions)
  └─ db/                          schema + seed setup
       │
       ├─ pg ──► PostgreSQL       agents, kpis tables
       └─ fetch ──► GitHub Actions API (when credentials set)
```

## Frontend

A single-page dashboard built with **Vite + React 19 + TypeScript + Tailwind
CSS v4**. The root `App` component composes a fixed sidebar, top bar and prompt
bar around a scrollable main column containing the KPI strip, featured agent,
CI/CD pipelines panel and agent grid.

Logic is kept out of components where possible: `src/lib/` holds the typed API
client, the `useFetch` and `usePersistentState` hooks, and the pure
`sortAgents` / `filterAgents` functions, all unit-tested independently.

See the **Frontend** section for module detail.

## Backend

An **Express 5** app assembled by a factory, `createApp(deps)`, that takes its
dependencies — a data `Store` and a `CicdProvider` — by injection. This is what
lets the test suite run with an in-memory store and a mock CI/CD provider while
the real server (`index.ts`) wires in a Postgres store and the configured
provider.

Routes are thin: each handler reads from the injected store or CI/CD provider
and returns JSON. A catch-all error handler ensures failures return JSON rather
than crashing.

See the **Backend** section for module detail.

## Data flow

1. The browser loads the React app; the agent grid and KPI strip render from
   the **local seed copy** in `src/data/`.
2. The `PipelinesPanel` calls `GET /api/pipelines` on mount via `useFetch`.
3. The backend's `/api/pipelines` handler asks the configured `CicdProvider`
   for pipelines, computes a summary, and returns both.
4. The CI/CD provider returns either deterministic mock data or live GitHub
   Actions runs depending on whether credentials are configured.

:::caution
`GET /api/agents` and `GET /api/kpis` exist on the backend and read from
Postgres, but the frontend does not call them yet — the agent grid and KPI
strip use bundled seed data. Wiring those panels to the API is tracked in the
project backlog.
:::

## Shared shapes

The frontend (`src/data/`, `src/lib/api.ts`) and backend (`server/src/domain.ts`,
`server/src/integrations/cicd.ts`) define matching `Agent`, `Kpi` and
`Pipeline` types independently. They are kept structurally in sync by hand —
there is no shared package.
