---
title: Data & types
description: Static seed data and domain types in src/data/.
---

`src/data/` holds the frontend's local seed data and the core domain types it
renders.

:::note
This is static seed data bundled into the frontend at build time. A real
deployment would load agents and KPIs from the backend; that migration is the
top backlog item. The backend keeps its own matching copy in `server/src/seed.ts`.
:::

## Files

| File | Purpose |
|------|---------|
| [agents.ts](/sdlc-sample-worflow/frontend/data/agents/) | `Agent` type, 12-agent catalogue, `FEATURED_AGENT_ID`, `AGENT_CATEGORIES` |
| [kpis.ts](/sdlc-sample-worflow/frontend/data/kpis/) | `Kpi` type, 4-KPI catalogue |

## Types

### `Agent` (from `agents.ts`)

```ts
type AgentStatus   = 'running' | 'idle' | 'attention'
type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'

interface Agent {
  id: string           // stable kebab slug
  name: string
  category: AgentCategory
  description: string
  status: AgentStatus
  runsPerWeek: number  // ~7d execution count
  successRate: number  // 0–100
  avgDuration: string  // e.g. "2m 40s"
  lastRun: string      // e.g. "3m ago"
  lastRunMinutes: number  // numeric for sorting
  popular: boolean
}
```

### `Kpi` (from `kpis.ts`)

```ts
interface Kpi {
  id: string
  label: string
  value: string        // pre-formatted, e.g. "4h 12m"
  delta: string        // pre-formatted, e.g. "-22%"
  positive: boolean    // good outcome regardless of sign
  hint: string
  trend: number[]      // 7-point series, oldest first
}
```

## Key exports

| Export | File | Used by |
|--------|------|---------|
| `AGENTS` | `agents.ts` | `App.tsx`, `AgentGrid`, tests |
| `FEATURED_AGENT_ID` | `agents.ts` | `App.tsx` |
| `AGENT_CATEGORIES` | `agents.ts` | `AgentGrid` (builds tab list) |
| `KPIS` | `kpis.ts` | `KpiStrip` |

## Agent catalogue summary

12 agents across 5 categories:

| Category | Agents |
|----------|--------|
| Review | PR Reviewer, Migration Reviewer |
| Deploy | Deploy Bot |
| Reliability | RCA Analyst, Alert Triage, On-call Digest |
| Quality | E2E Verifier, Flaky Test Hunter, Dependency Bot, Coverage Guard |
| Docs | Changelog Author, Spec Author |

Currently active (status `running`): PR Reviewer, Alert Triage, E2E Verifier,
Coverage Guard.
