---
title: kpis.ts
description: Frontend KPI catalogue — types and seed data.
---

**File:** `src/data/kpis.ts`

The frontend's static KPI (key performance indicator) catalogue. Four metrics
for the dashboard header strip.

## Types

### `Kpi`

```ts
export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Stable identifier (e.g. `'agent-runs'`) |
| `label` | `string` | Metric name shown above the value |
| `value` | `string` | Pre-formatted current value (e.g. `'1,284'`, `'4h 12m'`, `'97.4%'`) |
| `delta` | `string` | Pre-formatted period-over-period change (e.g. `'+18%'`, `'-22%'`) |
| `positive` | `boolean` | Whether the delta represents a **good** outcome, regardless of its arithmetic sign |
| `hint` | `string` | Descriptive sub-label shown below the sparkline |
| `trend` | `number[]` | 7-point time series, **oldest first**, rendered as a `Sparkline` |

### The `positive` flag

`positive` is deliberately decoupled from the sign of `delta`. A falling metric
can be a good thing:

```
time-to-merge: delta = '-22%', positive = true  → green sparkline
```

All four current KPIs have `positive: true`. The flag drives the sparkline
color (`--color-ok` green vs `--color-err` red) and the delta text color in
`KpiCard`.

## `KPIS` export

```ts
export const KPIS: Kpi[] = [ /* 4 KPIs */ ]
```

### KPI catalogue

| ID | Label | Value | Delta | Trend (oldest → newest) |
|----|-------|-------|-------|------------------------|
| `agent-runs` | Agent runs · 7d | `1,284` | `+18%` | 980, 1010, 1060, 1040, 1120, 1180, 1284 |
| `prs-reviewed` | PRs reviewed | `342` | `+9%` | 290, 300, 285, 310, 320, 330, 342 |
| `time-to-merge` | Mean time to merge | `4h 12m` | `-22%` | 340, 330, 318, 300, 285, 270, 252 |
| `suite-pass-rate` | Suite pass rate | `97.4%` | `+0.6%` | 96.2, 96.5, 96.8, 96.6, 97.0, 97.1, 97.4 |

Notes on the trend data:
- `agent-runs`: raw execution counts. Minor dip on day 4 (1,040 vs 1,060) then
  steady growth.
- `prs-reviewed`: counts; dip on day 3 (285) suggests a lighter review week.
- `time-to-merge`: values in **minutes** (e.g. 340 = 5h 40m, 252 = 4h 12m).
  The downward trend reflects the `-22%` delta; the sparkline renders falling
  values as high because lower y = bottom in SVG, but `positive: true` means
  the line renders green.
- `suite-pass-rate`: percentage values (96.2–97.4). Very narrow range, so the
  sparkline will show a shallow line.

## Used by

`KpiStrip` renders a `KpiCard` for each entry:

```ts
{KPIS.map((kpi) => (
  <KpiCard key={kpi.id} kpi={kpi} />
))}
```

The backend holds a matching copy in `server/src/seed.ts` (`SEED_KPIS`) for
the Postgres store.
