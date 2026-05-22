---
title: Data model
---

The backend's domain types live in `server/src/domain.ts` and mirror the shapes
the frontend expects. They are kept structurally in sync with the frontend
types by hand — there is no shared package.

## Agent

```ts
type AgentStatus = 'running' | 'idle' | 'attention'
type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'

interface Agent {
  id: string
  name: string
  category: AgentCategory
  description: string
  status: AgentStatus
  runsPerWeek: number
  successRate: number
  avgDuration: string
  lastRun: string
  lastRunMinutes: number
  popular: boolean
}
```

## Kpi

```ts
interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}
```

## Seed data (`seed.ts`)

`seed.ts` exports `SEED_AGENTS` (12 agents) and `SEED_KPIS` (4 KPIs). This data
is:

- loaded into Postgres by `npm run db:setup`, and
- used directly by the in-memory store in tests.

The seed values match the frontend's `src/data/` copy.

## Persistence mapping

The Postgres tables use `snake_case` columns; `postgresStore.ts` maps rows back
to the camelCase domain types. The KPI `trend` array is stored as JSONB.

| Domain field (Agent) | Column             |
| -------------------- | ------------------ |
| `runsPerWeek`        | `runs_per_week`    |
| `successRate`        | `success_rate`     |
| `avgDuration`        | `avg_duration`     |
| `lastRun`            | `last_run`         |
| `lastRunMinutes`     | `last_run_minutes` |

See [Stores & database](/sdlc-sample-worflow/backend/stores/) for the schema
and the row-mapping functions.
