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
| id | `string` | Stable unique identifier for the metric; used as the React list key. |
| label | `string` | Short caption shown above the value (e.g. "Agent runs · 7d"). |
| value | `string` | Pre-formatted headline figure (e.g. "1,284" or "4h 12m"). |
| delta | `string` | Pre-formatted change versus the prior period (e.g. "+18%"); a leading `-` selects the down-trend icon. |
| positive | `boolean` | Whether the change is a good outcome, independent of the delta's sign; drives the green/red color. |
| hint | `string` | Longer explanatory caption shown beneath the card. |
| trend | `number[]` | Seven-point series, oldest first, rendered as the sparkline. |

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
