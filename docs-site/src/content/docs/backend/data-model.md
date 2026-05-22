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

`seed.ts` exports `SEED_AGENTS` (12 agents) and `SEED_KPIS` (4 KPIs). This
data is:

- loaded into Postgres by `npm run db:setup`, and
- used directly by the in-memory store in tests.

The values match the frontend's `src/data/` copy exactly.

### Seed agents

| ID | Name | Category | Status | Runs/wk | Success |
| ------------------- | ------------------- | ----------- | --------- | ------- | ------- |
| `pr-reviewer` | PR Reviewer | Review | running | 342 | 96% |
| `deploy-bot` | Deploy Bot | Deploy | idle | 57 | 99% |
| `rca-analyst` | RCA Analyst | Reliability | attention | 14 | 88% |
| `alert-triage` | Alert Triage | Reliability | running | 410 | 94% |
| `changelog-author` | Changelog Author | Docs | idle | 38 | 99% |
| `e2e-verifier` | E2E Verifier | Quality | running | 122 | 91% |
| `flaky-test-hunter` | Flaky Test Hunter | Quality | idle | 26 | 93% |
| `migration-reviewer`| Migration Reviewer | Review | idle | 19 | 97% |
| `dependency-bot` | Dependency Bot | Quality | idle | 64 | 95% |
| `oncall-digest` | On-call Digest | Reliability | idle | 7 | 100% |
| `spec-author` | Spec Author | Docs | idle | 31 | 98% |
| `coverage-guard` | Coverage Guard | Quality | running | 88 | 92% |

### Seed KPIs

| ID | Label | Value | Delta | Trend (7 pts, oldest → newest) |
| ----------------- | -------------------- | ------- | ------ | ----------------------------------------- |
| `agent-runs` | Agent runs · 7d | 1,284 | +18% | 980, 1010, 1060, 1040, 1120, 1180, 1284 |
| `prs-reviewed` | PRs reviewed | 342 | +9% | 290, 300, 285, 310, 320, 330, 342 |
| `time-to-merge` | Mean time to merge | 4h 12m | −22% | 340, 330, 318, 300, 285, 270, 252 |
| `suite-pass-rate` | Suite pass rate | 97.4% | +0.6% | 96.2, 96.5, 96.8, 96.6, 97.0, 97.1, 97.4 |

All four KPIs have `positive: true`. The time-to-merge delta is negative but
still positive because a falling merge time is a good outcome — the `positive`
flag drives color, not the sign of `delta`.

## Persistence mapping

The Postgres tables use `snake_case` columns; `postgresStore.ts` maps rows back
to the camelCase domain types via `rowToAgent` and `rowToKpi` helper functions.
The KPI `trend` array is stored as `JSONB` and parsed back automatically.

| Domain field (Agent) | Postgres column |
| -------------------- | --------------- |
| `runsPerWeek` | `runs_per_week` |
| `successRate` | `success_rate` |
| `avgDuration` | `avg_duration` |
| `lastRun` | `last_run` |
| `lastRunMinutes` | `last_run_minutes` |

The `kpis` table has an extra `sort_order` column (not present on the domain
type) used to preserve display order when rows are returned from
`SELECT * FROM kpis ORDER BY sort_order ASC`.

See [Stores & database](/sdlc-sample-worflow/backend/stores/) for the full
schema and row-mapping functions.
