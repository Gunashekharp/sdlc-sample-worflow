---
title: kpis
description: Reference for `src/data/kpis.ts`
---

**File:** `src/data/kpis.ts` · **Lines:** 56

<!-- fill:file:summary -->
This module holds the static seed data for the headline metrics shown in the dashboard's KPI strip. It defines the `Kpi` interface and exports the `KPIS` array of four metric cards (agent runs, PRs reviewed, mean time to merge, and suite pass rate). `KpiStrip.tsx` is the sole consumer: it maps over `KPIS` to render each card, including its delta and a sparkline drawn from the `trend` series.
<!-- /fill:file:summary -->

## Symbols

This file exports 2 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| Kpi | interface | no |
| KPIS | const | no |

## Kpi

**Kind:** `interface`

```ts
export interface Kpi { ... }
```

<!-- fill:sym:Kpi:summary -->
`Kpi` is the interface describing a single headline metric: its identity (`id`), display text (`label`, `value`, `delta`, `hint`), whether the delta represents a good outcome (`positive`), and a `trend` series for the sparkline. The `positive` flag is decoupled from the delta's sign so that a falling metric — like mean time to merge — can still be marked as good. It is the element type of `KPIS` and is consumed only by `KpiStrip.tsx`.
<!-- /fill:sym:Kpi:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | Stable unique identifier for the metric (e.g. `'agent-runs'`); used as the React key. |
| label | `string` | Short metric name displayed on the card (e.g. `'Agent runs · 7d'`). |
| value | `string` | Pre-formatted headline figure shown large (e.g. `'1,284'`). |
| delta | `string` | Pre-formatted period-over-period change with sign (e.g. `'+18%'`). |
| positive | `boolean` | Whether the delta is a good outcome, independent of its sign; drives the up/down styling. |
| hint | `string` | Tooltip or caption explaining what the metric measures. |
| trend | `number[]` | Seven-point series (oldest first) rendered as a sparkline. |

### Used by

- `src/components/KpiStrip.tsx`

## KPIS

**Kind:** `const`

```ts
const KPIS: Kpi[]
```

<!-- fill:sym:KPIS:summary -->
`KPIS` is the seed array of four `Kpi` records that fills the dashboard's KPI strip: agent runs over 7 days, PRs reviewed, mean time to merge, and suite pass rate. Each entry carries pre-formatted display strings plus a seven-point `trend` series for its sparkline. `KpiStrip.tsx` is the only consumer, mapping over the array to render one card per metric.
<!-- /fill:sym:KPIS:summary -->

### Used by

- `src/components/KpiStrip.tsx`

## Diagrams

<!-- fill:file:diagrams -->

<!-- /fill:file:diagrams -->

## Source

Full file source for `src/data/kpis.ts` (56 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (56 lines)</summary>

````ts
/*
 * Headline metrics shown in the KPI strip.
 * `positive` indicates whether the delta is a good outcome, independent of
 * its sign — e.g. a falling time-to-merge is positive.
 * `trend` is a 7-point series (oldest first) rendered as a sparkline.
 */

export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}

export const KPIS: Kpi[] = [
  {
    id: 'agent-runs',
    label: 'Agent runs · 7d',
    value: '1,284',
    delta: '+18%',
    positive: true,
    hint: 'Total agent executions in the last 7 days.',
    trend: [980, 1010, 1060, 1040, 1120, 1180, 1284],
  },
  {
    id: 'prs-reviewed',
    label: 'PRs reviewed',
    value: '342',
    delta: '+9%',
    positive: true,
    hint: 'Pull requests reviewed by agents this week.',
    trend: [290, 300, 285, 310, 320, 330, 342],
  },
  {
    id: 'time-to-merge',
    label: 'Mean time to merge',
    value: '4h 12m',
    delta: '-22%',
    positive: true,
    hint: 'Average time from PR open to merge.',
    trend: [340, 330, 318, 300, 285, 270, 252],
  },
  {
    id: 'suite-pass-rate',
    label: 'Suite pass rate',
    value: '97.4%',
    delta: '+0.6%',
    positive: true,
    hint: 'Share of CI runs passing on the first attempt.',
    trend: [96.2, 96.5, 96.8, 96.6, 97.0, 97.1, 97.4],
  },
]

````

</details>
