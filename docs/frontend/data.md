# Data & types

`src/data/` holds the local seed data and the TypeScript types that flow through
the whole frontend. Today the agent grid, the featured agent, and the KPI strip
read from here rather than from the backend.

!!! note "Mirrored on the backend"
    The same shapes and seed rows exist on the server (`server/src/domain.ts`,
    `server/src/seed.ts`). The two copies are kept in sync by hand until the
    frontend is migrated to the API.

## `agents.ts`

### Types

```ts
type AgentStatus = 'running' | 'idle' | 'attention'
type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'

interface Agent {
  id: string
  name: string
  category: AgentCategory
  description: string
  status: AgentStatus
  runsPerWeek: number      // approximate runs over the last 7 days
  successRate: number      // 0–100
  avgDuration: string      // human-readable, e.g. "2m 40s"
  lastRun: string          // human-readable, e.g. "3m ago"
  lastRunMinutes: number   // orderable companion to lastRun
  popular: boolean         // appears under the "Popular" filter
}
```

`lastRun` is for display while `lastRunMinutes` is the numeric field that
[`sortAgents`](lib.md#sortagents) orders by for the "Recently run" sort.

### Exports

| Export              | Type              | Purpose                                          |
| ------------------- | ----------------- | ------------------------------------------------ |
| `AGENTS`            | `Agent[]`         | The 12-agent catalogue.                          |
| `FEATURED_AGENT_ID` | `string`          | `'pr-reviewer'` — surfaced in the featured slot. |
| `AGENT_CATEGORIES`  | `AgentCategory[]` | Category order: Review, Deploy, Reliability, Quality, Docs. |

### The catalogue

`AGENTS` contains 12 entries:

| id                  | name              | category    | status    | runs/wk | success |
| ------------------- | ----------------- | ----------- | --------- | ------: | ------: |
| `pr-reviewer`       | PR Reviewer       | Review      | running   | 342     | 96%     |
| `deploy-bot`        | Deploy Bot        | Deploy      | idle      | 57      | 99%     |
| `rca-analyst`       | RCA Analyst       | Reliability | attention | 14      | 88%     |
| `alert-triage`      | Alert Triage      | Reliability | running   | 410     | 94%     |
| `changelog-author`  | Changelog Author  | Docs        | idle      | 38      | 99%     |
| `e2e-verifier`      | E2E Verifier      | Quality     | running   | 122     | 91%     |
| `flaky-test-hunter` | Flaky Test Hunter | Quality     | idle      | 26      | 93%     |
| `migration-reviewer`| Migration Reviewer| Review      | idle      | 19      | 97%     |
| `dependency-bot`    | Dependency Bot    | Quality     | idle      | 64      | 95%     |
| `oncall-digest`     | On-call Digest    | Reliability | idle      | 7       | 100%    |
| `spec-author`       | Spec Author       | Docs        | idle      | 31      | 98%     |
| `coverage-guard`    | Coverage Guard    | Quality     | running   | 88      | 92%     |

`popular: true` is set on `pr-reviewer`, `deploy-bot`, `alert-triage`,
`e2e-verifier`, and `dependency-bot` — those five appear under the grid's
"Popular" tab.

## `kpis.ts`

### Type

```ts
interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean   // is the delta a good outcome, regardless of sign?
  hint: string
  trend: number[]     // 7-point series, oldest first, drawn as a sparkline
}
```

`positive` is independent of the delta's sign. A falling metric can still be
positive — e.g. mean time to merge dropping `-22%`. [`KpiStrip`](components.md#kpistrip)
uses the **sign** of `delta` for the arrow direction and `positive` for the color.

### The metrics

`KPIS` contains four entries, all `positive: true`:

| id                | label              | value   | delta  |
| ----------------- | ------------------ | ------- | ------ |
| `agent-runs`      | Agent runs · 7d    | 1,284   | +18%   |
| `prs-reviewed`    | PRs reviewed       | 342     | +9%    |
| `time-to-merge`   | Mean time to merge | 4h 12m  | -22%   |
| `suite-pass-rate` | Suite pass rate    | 97.4%   | +0.6%  |

Each carries a 7-point `trend` array used by the [`Sparkline`](components.md#sparkline).
