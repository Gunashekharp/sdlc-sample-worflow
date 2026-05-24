---
title: kpis.ts — KPI data
---

**File:** `src/data/kpis.ts`

The frontend's static KPI (key performance indicator) catalogue. Four metrics populate the `KpiStrip` at the top of the dashboard.

## `Kpi` interface

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

### Field reference

| Field | Type | Purpose |
|---|---|---|
| `id` | `string` | Stable identifier used as the React `key` (e.g. `'agent-runs'`). |
| `label` | `string` | Metric name displayed above the value in `KpiCard` (e.g. `'Agent runs · 7d'`). |
| `value` | `string` | Pre-formatted current value (e.g. `'1,284'`, `'4h 12m'`, `'97.4%'`). Rendered as-is; no further formatting in the component. |
| `delta` | `string` | Pre-formatted period-over-period change including sign and unit (e.g. `'+18%'`, `'-22%'`). Rendered as-is. |
| `positive` | `boolean` | Whether the delta represents a **good** outcome, regardless of its arithmetic sign. Drives the delta badge color and the `Sparkline` line color. |
| `hint` | `string` | Explanatory sub-label shown below the sparkline in `KpiCard` (e.g. `'Total agent executions in the last 7 days.'`). |
| `trend` | `number[]` | 7-point time series, **oldest value first**. Passed to `Sparkline` to render a miniature trend line. |

### The `positive` flag semantics

`positive` is deliberately decoupled from the arithmetic sign of `delta`. This is because a metric going down can be a good outcome:

| KPI | Delta | `positive` | Interpretation |
|---|---|---|---|
| Agent runs · 7d | `+18%` | `true` | More runs = more automation activity — good |
| PRs reviewed | `+9%` | `true` | More PRs reviewed = agents are busier — good |
| Mean time to merge | `-22%` | `true` | Faster merges — good, even though delta is negative |
| Suite pass rate | `+0.6%` | `true` | Higher pass rate — good |

When `positive: true`, the `Sparkline` renders in `--color-ok` (green) and the delta badge text is green. When `positive: false` (no current examples, but supported), both render in `--color-err` (red).

## `KPIS` export

```ts
export const KPIS: Kpi[] = [ /* 4 KPIs */ ]
```

### KPI catalogue

| ID | Label | Value | Delta | Trend series (oldest → newest) |
|---|---|---|---|---|
| `agent-runs` | Agent runs · 7d | `1,284` | `+18%` | 980, 1010, 1060, 1040, 1120, 1180, 1284 |
| `prs-reviewed` | PRs reviewed | `342` | `+9%` | 290, 300, 285, 310, 320, 330, 342 |
| `time-to-merge` | Mean time to merge | `4h 12m` | `-22%` | 340, 330, 318, 300, 285, 270, 252 |
| `suite-pass-rate` | Suite pass rate | `97.4%` | `+0.6%` | 96.2, 96.5, 96.8, 96.6, 97.0, 97.1, 97.4 |

### Notes on trend data

- **`agent-runs`** — Raw execution counts. There is a minor dip on day 4 (1,040 vs 1,060 on day 3), then steady growth to the current 1,284.
- **`prs-reviewed`** — PR review counts. A dip on day 3 (285) suggests a lighter pull-request volume mid-week.
- **`time-to-merge`** — Values are in **minutes** (340 = 5h 40m; 252 = 4h 12m). The downward trend matches the `'-22%'` delta. Although the `Sparkline` plots these values with the most recent value at the right edge, `positive: true` causes the line to render in green regardless of direction.
- **`suite-pass-rate`** — Percentage values in the range 96.2–97.4. The narrow 1.2-percentage-point range means the `Sparkline` shows a relatively flat, shallow line. There is a minor dip on day 4 (96.6 vs 96.8 on day 3).

## The `trend` array

The `trend` array is a 7-point series of raw numeric values, always **oldest first**. The `Sparkline` component maps these values to SVG polyline coordinates, normalizing the min and max across the series to fit the fixed-size SVG viewport. The number of points is not enforced by the type, but all current entries have exactly 7 values (one per day of the week).

## Used by

`KpiStrip` maps over `KPIS` and renders one `KpiCard` per entry:

```ts
{KPIS.map((kpi) => (
  <KpiCard key={kpi.id} kpi={kpi} />
))}
```

## Backend mirror

`server/src/seed.ts` exports a `SEED_KPIS` array that mirrors this data for the Postgres store. There is no code generation or shared package — the two are kept in sync by hand.
