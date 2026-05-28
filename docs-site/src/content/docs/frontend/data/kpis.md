---
title: kpis
description: Reference for `src/data/kpis.ts`
---

<!-- structure:fbcadda5a1d6 -->

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
| id | `string` | Stable kebab-case identifier used as the React list key (e.g. `'agent-runs'`). |
| label | `string` | Short caption shown above the value (e.g. `'Mean time to merge'`). |
| value | `string` | Pre-formatted headline string (e.g. `'4h 12m'`) — already includes units, so the component renders it verbatim. |
| delta | `string` | Pre-formatted change indicator (e.g. `'+18%'` or `'-22%'`); leading `-` flips the trend icon to `IconTrendDown`. |
| positive | `boolean` | Whether the change is a good outcome regardless of sign — drives both the delta colour and the `Sparkline` stroke. |
| hint | `string` | One-sentence description shown beneath the card. |
| trend | `number[]` | Seven-point series (oldest first) fed to `Sparkline` to draw the trend line. |

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
:::note
Static seed data — one interface and an array literal. No control flow worth diagramming.
:::
<!-- /fill:file:diagrams -->
