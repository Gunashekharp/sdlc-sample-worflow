---
title: KpiStrip
description: Responsive grid of headline metric cards.
---

**File:** `src/components/KpiStrip.tsx`

The four-column strip of key performance indicator cards near the top of the
dashboard. Renders one `KpiCard` for each entry in `src/data/kpis.ts`.

## Internal subcomponent: `KpiCard`

```ts
function KpiCard({ kpi }: { kpi: Kpi })
```

Not exported. Renders a single metric card with label, value, delta, sparkline,
and hint text.

### Delta logic

```ts
const isDown = kpi.delta.trim().startsWith('-')
const Trend = isDown ? IconTrendDown : IconTrendUp
const deltaColor = kpi.positive ? 'text-ok' : 'text-err'
```

`isDown` determines the trend icon by inspecting the `delta` string's sign
character. This is purely visual — the **color** (`deltaColor`) comes from
`kpi.positive`, which is independent of the sign.

This separation handles the case where a falling metric is good (e.g.
mean time to merge: `delta = '-22%'`, `positive = true` → green).

| `kpi.positive` | `kpi.delta` | Icon | Color |
|----------------|-------------|------|-------|
| `true` | `'+18%'` | `IconTrendUp` | `text-ok` (green) |
| `true` | `'-22%'` | `IconTrendDown` | `text-ok` (green) |
| `false` | `'-5%'` | `IconTrendDown` | `text-err` (red) |
| `false` | `'+3%'` | `IconTrendUp` | `text-err` (red) |

### KpiCard layout

```
<div rounded-lg border bg-surface p-3.5>
  ├── Label  text-[11px] uppercase tracking-wide text-text-faint
  ├── <div row justify-between>
  │     ├── Value  text-2xl font-semibold
  │     └── Delta  <TrendIcon /> + delta string  (text-ok or text-err)
  ├── <Sparkline points={kpi.trend} positive={kpi.positive} className="mt-2 h-7 w-full" />
  └── Hint  text-xs text-text-faint
```

The delta row uses `items-end` so the number and the trend text align at their
baselines even if the number's larger font makes it taller.

## Component

```ts
export default function KpiStrip()
```

**Parameters:** None.

**Returns:** A `<section>` with `aria-label="Key metrics"`.

**Side effects:** None.

## Grid layout

```tsx
<section
  aria-label="Key metrics"
  className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
>
  {KPIS.map((kpi) => (
    <KpiCard key={kpi.id} kpi={kpi} />
  ))}
</section>
```

Responsive grid: 1 column on mobile, 2 on `sm` (640px+), 4 on `lg` (1024px+).
`aria-label="Key metrics"` creates a landmark region that the App tests assert
against (`screen.getByRole('region', { name: /key metrics/i })`).

## Data source

All four KPIs come from the static `KPIS` array in `src/data/kpis.ts`. There
is no network call.

## Used by

`App.tsx` — rendered as the first panel inside the scrollable `<main>`.
