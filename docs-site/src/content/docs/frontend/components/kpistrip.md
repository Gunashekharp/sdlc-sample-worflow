---
title: KpiStrip
description: Reference for `src/components/KpiStrip.tsx`
---

**File:** `src/components/KpiStrip.tsx` · **Lines:** 45

<!-- fill:file:summary -->
`KpiStrip.tsx` renders the dashboard's row of key-metric cards. It reads the static `KPIS` array (and `Kpi` type) from `../data/kpis`, draws each metric's trend with the `Sparkline` component, and picks a trend arrow (`IconTrendUp`/`IconTrendDown`) from `./icons`. The exported `KpiStrip` is mounted by `App.tsx`; the per-card rendering is handled by the local `KpiCard` helper.
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `../data/kpis` | `KPIS` | internal |
| `../data/kpis` | `Kpi` | type-only · internal |
| `./icons` | `IconTrendDown`, `IconTrendUp` | internal |
| `./Sparkline` | `default as Sparkline` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| KpiStrip | component | yes |

## KpiStrip (default export)

**Kind:** `component`

```ts
export default function KpiStrip() { ... }
```

<!-- fill:sym:KpiStrip:summary -->
`KpiStrip` is a zero-prop component that lays out every entry in the `KPIS` dataset as a responsive grid of cards (1 / 2 / 4 columns across breakpoints). Each card is delegated to the local `KpiCard`, which shows the label, value, a delta colored by `kpi.positive`, a trend arrow chosen from the delta's sign, a `Sparkline` of `kpi.trend`, and a hint. It exists to give the dashboard an at-a-glance metrics summary above the rest of the content.
<!-- /fill:sym:KpiStrip:summary -->

### Line-by-line walkthrough

Each top-level statement of `KpiStrip`, in execution order. The line numbers reference the source file as it appears today.

**Line 34 — `ReturnStatement`**

```ts
return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </section>
  )
```

<!-- fill:sym:KpiStrip:walk:0 -->
The single return renders a `<section aria-label="Key metrics">` whose grid classes step from one column to two (`sm:`) to four (`lg:`). It maps over the imported `KPIS` array, rendering one `<KpiCard key={kpi.id} kpi={kpi} />` per metric. There is no local state — the data is static — so iterating the module-level constant is sufficient, and the `aria-label` names the region for assistive tech.
<!-- /fill:sym:KpiStrip:walk:0 -->

### Examples

<!-- fill:sym:KpiStrip:example -->
```tsx
import KpiStrip from './components/KpiStrip'

// Takes no props — it reads the KPIS dataset itself.
<KpiStrip />
```

This renders one card per entry in `KPIS`, each with its value, signed delta, trend sparkline, and hint.
<!-- /fill:sym:KpiStrip:example -->

### Used by

- `src/App.tsx`

## Diagrams

<!-- fill:file:diagrams -->

<!-- /fill:file:diagrams -->

## Source

Full file source for `src/components/KpiStrip.tsx` (45 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (45 lines)</summary>

````tsx
import { KPIS } from '../data/kpis'
import type { Kpi } from '../data/kpis'
import { IconTrendDown, IconTrendUp } from './icons'
import Sparkline from './Sparkline'

function KpiCard({ kpi }: { kpi: Kpi }) {
  const isDown = kpi.delta.trim().startsWith('-')
  const Trend = isDown ? IconTrendDown : IconTrendUp
  const deltaColor = kpi.positive ? 'text-ok' : 'text-err'

  return (
    <div className="rounded-lg border border-border bg-surface p-3.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-text-faint">
        {kpi.label}
      </p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight">{kpi.value}</span>
        <span className={`flex items-center gap-1 text-xs font-medium ${deltaColor}`}>
          <Trend className="h-3.5 w-3.5" />
          {kpi.delta}
        </span>
      </div>
      <Sparkline
        points={kpi.trend}
        positive={kpi.positive}
        className="mt-2 h-7 w-full"
      />
      <p className="mt-1 text-xs text-text-faint">{kpi.hint}</p>
    </div>
  )
}

export default function KpiStrip() {
  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </section>
  )
}

````

</details>
