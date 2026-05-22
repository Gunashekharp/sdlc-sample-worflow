---
title: Data & types
---

`src/data/` holds the frontend's local seed data and the core domain types it
renders.

:::note
This is static seed data bundled into the frontend. A real deployment would
load agents and KPIs from the backend; that migration is the top backlog item.
The backend keeps its own matching copy in `server/src/seed.ts`.
:::

## Agents (`agents.ts`)

### Types

```ts
type AgentStatus = 'running' | 'idle' | 'attention'
type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'
```

The `Agent` interface:

| Field | Type | Notes |
| ---------------- | --------------- | ----------------------------------------------- |
| `id` | `string` | Stable slug identifier (e.g. `pr-reviewer`) |
| `name` | `string` | Display name |
| `category` | `AgentCategory` | One of the five categories |
| `description` | `string` | One-line summary |
| `status` | `AgentStatus` | Drives the `StatusDot` color |
| `runsPerWeek` | `number` | Approximate runs over the last 7 days |
| `successRate` | `number` | Successful-run percentage, 0–100 |
| `avgDuration` | `string` | Human-readable, e.g. `2m 40s` |
| `lastRun` | `string` | Human-readable, e.g. `3m ago` |
| `lastRunMinutes` | `number` | Orderable companion to `lastRun` (minutes) |
| `popular` | `boolean` | Whether the agent appears under the "Popular" tab |

### Exports

- `AGENTS` — the catalogue of 12 agents (see table below).
- `FEATURED_AGENT_ID` — `'pr-reviewer'`, the agent shown in the featured card.
- `AGENT_CATEGORIES` — `['Review', 'Deploy', 'Reliability', 'Quality', 'Docs']`
  in display order, used to build the grid's category tabs.

### Agent catalogue

| ID | Name | Category | Status | Runs/wk | Success | Popular |
| ------------------- | ------------------- | ----------- | --------- | ------- | ------- | ------- |
| `pr-reviewer` | PR Reviewer | Review | running | 342 | 96% | Yes |
| `deploy-bot` | Deploy Bot | Deploy | idle | 57 | 99% | Yes |
| `rca-analyst` | RCA Analyst | Reliability | attention | 14 | 88% | No |
| `alert-triage` | Alert Triage | Reliability | running | 410 | 94% | Yes |
| `changelog-author` | Changelog Author | Docs | idle | 38 | 99% | No |
| `e2e-verifier` | E2E Verifier | Quality | running | 122 | 91% | Yes |
| `flaky-test-hunter` | Flaky Test Hunter | Quality | idle | 26 | 93% | No |
| `migration-reviewer`| Migration Reviewer | Review | idle | 19 | 97% | No |
| `dependency-bot` | Dependency Bot | Quality | idle | 64 | 95% | Yes |
| `oncall-digest` | On-call Digest | Reliability | idle | 7 | 100% | No |
| `spec-author` | Spec Author | Docs | idle | 31 | 98% | No |
| `coverage-guard` | Coverage Guard | Quality | running | 88 | 92% | No |

`FEATURED_AGENT_ID` is `'pr-reviewer'`. The featured agent is excluded from the
props passed to `AgentGrid` — `App.tsx` filters it out and renders it on the
`FeaturedAgent` card.

## KPIs (`kpis.ts`)

The `Kpi` interface:

| Field | Type | Notes |
| --------- | ---------- | ------------------------------------------------------------ |
| `id` | `string` | Stable identifier |
| `label` | `string` | Metric name |
| `value` | `string` | Pre-formatted display value (e.g. `4h 12m`) |
| `delta` | `string` | Pre-formatted change (e.g. `-22%`) |
| `positive` | `boolean` | Whether the delta is a **good** outcome, regardless of sign |
| `hint` | `string` | Sub-label shown under the sparkline |
| `trend` | `number[]` | 7-point series, oldest first, rendered as a `Sparkline` |

`positive` is decoupled from the delta's sign on purpose — a falling
time-to-merge (`-22%`) is still a positive outcome, so its sparkline and delta
render green (`--color-ok`).

### KPI catalogue

| ID | Label | Value | Delta | Positive | Trend (oldest → newest) |
| ----------------- | -------------------- | ------- | ------ | -------- | ----------------------------------- |
| `agent-runs` | Agent runs · 7d | 1,284 | +18% | Yes | 980, 1010, 1060, 1040, 1120, 1180, 1284 |
| `prs-reviewed` | PRs reviewed | 342 | +9% | Yes | 290, 300, 285, 310, 320, 330, 342 |
| `time-to-merge` | Mean time to merge | 4h 12m | -22% | Yes | 340, 330, 318, 300, 285, 270, 252 |
| `suite-pass-rate` | Suite pass rate | 97.4% | +0.6% | Yes | 96.2, 96.5, 96.8, 96.6, 97.0, 97.1, 97.4 |

The `time-to-merge` trend values are in minutes; the `suite-pass-rate` values
are percentages. All four metrics are currently positive — a falling
time-to-merge is a good thing, as reflected in `positive: true`.
