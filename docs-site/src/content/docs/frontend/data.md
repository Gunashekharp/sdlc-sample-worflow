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

| Field            | Type            | Notes                                          |
| ---------------- | --------------- | ---------------------------------------------- |
| `id`             | `string`        | Stable identifier (e.g. `pr-reviewer`)         |
| `name`           | `string`        | Display name                                   |
| `category`       | `AgentCategory` | One of the five categories                     |
| `description`    | `string`        | One-line summary                               |
| `status`         | `AgentStatus`   | Drives the `StatusDot`                         |
| `runsPerWeek`    | `number`        | Approximate runs over the last 7 days          |
| `successRate`    | `number`        | Successful-run percentage, 0–100               |
| `avgDuration`    | `string`        | Human-readable, e.g. `2m 40s`                  |
| `lastRun`        | `string`        | Human-readable, e.g. `3m ago`                  |
| `lastRunMinutes` | `number`        | Orderable companion to `lastRun`               |
| `popular`        | `boolean`       | Whether it appears under the "Popular" filter  |

### Exports

- `AGENTS` — the catalogue of 12 agents (PR Reviewer, Deploy Bot, RCA Analyst,
  Alert Triage, Changelog Author, E2E Verifier, Flaky Test Hunter, Migration
  Reviewer, Dependency Bot, On-call Digest, Spec Author, Coverage Guard).
- `FEATURED_AGENT_ID` — `'pr-reviewer'`, the agent shown in the featured slot.
- `AGENT_CATEGORIES` — the five categories in display order, used to build the
  grid's tab list.

## KPIs (`kpis.ts`)

The `Kpi` interface:

| Field      | Type       | Notes                                                       |
| ---------- | ---------- | ----------------------------------------------------------- |
| `id`       | `string`   | Stable identifier                                           |
| `label`    | `string`   | Metric name                                                 |
| `value`    | `string`   | Pre-formatted display value (e.g. `4h 12m`)                 |
| `delta`    | `string`   | Pre-formatted change (e.g. `-22%`)                          |
| `positive` | `boolean`  | Whether the delta is a **good** outcome, regardless of sign |
| `hint`     | `string`   | Sub-label shown under the sparkline                         |
| `trend`    | `number[]` | 7-point series, oldest first, rendered as a sparkline       |

`positive` is decoupled from the delta's sign on purpose — a falling
time-to-merge (`-22%`) is still a positive outcome, so its delta renders green.

### Exports

- `KPIS` — four metrics: Agent runs · 7d, PRs reviewed, Mean time to merge,
  Suite pass rate.
