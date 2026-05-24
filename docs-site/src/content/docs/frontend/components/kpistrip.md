---
title: KpiStrip
---

`KpiStrip` is the four-column strip of key performance indicator cards rendered near the top of the dashboard. It is a pure rendering component: it reads from the static `KPIS` array and produces one `KpiCard` per entry. There are no props, no network calls, and no state.

**File:** `src/components/KpiStrip.tsx`

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `KPIS` | `../data/kpis` | Static array of all KPI records |
| `Kpi` (type) | `../data/kpis` | Shape of a single KPI record |
| `IconTrendDown`, `IconTrendUp` | `./icons` | Trend direction icons shown in `KpiCard` |
| `Sparkline` | `./Sparkline` | SVG trend-line rendered at the bottom of each card |

## `Kpi` type (from `src/data/kpis.ts`)

`KpiCard` consumes all fields of `Kpi`. The expected shape is:

| Field | Type | Purpose |
|-------|------|---------|
| `id` | `string` | React `key` for list rendering |
| `label` | `string` | Metric name, e.g. `"Agent runs · 7d"` |
| `value` | `string` | Pre-formatted current value, e.g. `"4,821"` |
| `delta` | `string` | Change indicator, e.g. `"+18%"` or `"-5%"` |
| `positive` | `boolean` | Whether the trend direction is semantically good (see delta logic below) |
| `trend` | `number[]` | 7-point history series passed to `Sparkline` |
| `hint` | `string` | Short explanatory footnote, e.g. `"vs previous 7 days"` |

## Internal subcomponent: `KpiCard`

```ts
function KpiCard({ kpi }: { kpi: Kpi }): JSX.Element
```

Not exported. Renders a single metric card.

### Delta direction logic

```ts
const isDown = kpi.delta.trim().startsWith('-')
const Trend = isDown ? IconTrendDown : IconTrendUp
const deltaColor = kpi.positive ? 'text-ok' : 'text-err'
```

The trend icon and the delta colour are derived independently:

- **`isDown`** — inspects the leading character of `kpi.delta` (after trimming whitespace) to decide which directional icon to show. This is purely visual.
- **`deltaColor`** — comes from `kpi.positive`, which is a semantic flag set in the data layer, independent of the sign character.

This separation handles inverse metrics: a falling value can be good (e.g. mean-time-to-merge decreasing) and a rising value can be bad (e.g. error rate increasing).

| `kpi.positive` | `kpi.delta` starts with `-`? | Icon | Colour class |
|----------------|------------------------------|------|-------------|
| `true` | No (`+18%`) | `IconTrendUp` | `text-ok` (green) |
| `true` | Yes (`-22%`) | `IconTrendDown` | `text-ok` (green) |
| `false` | Yes (`-5%`) | `IconTrendDown` | `text-err` (red) |
| `false` | No (`+3%`) | `IconTrendUp` | `text-err` (red) |

### `KpiCard` rendered structure

```
<div rounded-lg border border-border bg-surface p-3.5>
  ├── <p>       Label  (text-[11px] uppercase tracking-wide text-text-faint)
  ├── <div>     Value + delta row  (flex items-end justify-between)
  │     ├── <span>    Value  (text-2xl font-semibold tracking-tight)
  │     └── <span>    Delta row  (flex items-center gap-1)
  │                   ├── <Trend className="h-3.5 w-3.5" />
  │                   └── {kpi.delta}  (text-xs font-medium, text-ok or text-err)
  ├── <Sparkline points={kpi.trend} positive={kpi.positive} className="mt-2 h-7 w-full" />
  └── <p>       Hint  (mt-1 text-xs text-text-faint)
</div>
```

**Layout notes:**
- `items-end` on the value/delta row aligns the large value number and the smaller delta text at their bottom edges (baseline alignment across different font sizes).
- `tracking-tight` on the value reduces letter-spacing for large display numbers.
- `text-[11px] uppercase tracking-wide` on the label creates a "screamer" / all-caps badge-like appearance at a very small size.

### Sparkline integration

```tsx
<Sparkline
  points={kpi.trend}
  positive={kpi.positive}
  className="mt-2 h-7 w-full"
/>
```

`kpi.trend` is the raw `number[]` series. `kpi.positive` is passed through so that the sparkline stroke colour matches the delta colour — a good metric (green) has a green sparkline; a bad metric (red) has a red sparkline. The `className` overrides `Sparkline`'s default class with `h-7 w-full` so the chart spans the full card width.

## Component signature

```ts
export default function KpiStrip(): JSX.Element
```

**Parameters:** None.

**Returns:** A `<section>` element with `aria-label="Key metrics"`.

**Side effects:** None. Pure rendering from static data.

## Rendered structure

```
<section aria-label="Key metrics" grid 1/2/4 cols>
  └── {KPIS.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
```

## Accessibility

| Attribute | Element | Value | Purpose |
|-----------|---------|-------|---------|
| `aria-label="Key metrics"` | `<section>` | `"Key metrics"` | Creates a named landmark region; allows screen-reader navigation by region name |

The named `<section>` is asserted in tests as `screen.getByRole('region', { name: /key metrics/i })`. The trend icons use `aria-hidden="true"` (inherited from the `Svg` wrapper in `icons.tsx`) so they do not add noise to the accessibility tree.

## Grid layout

```tsx
<section
  aria-label="Key metrics"
  className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
>
```

| Breakpoint | Columns |
|-----------|---------|
| Default (mobile) | 1 (stacked) |
| `sm` (≥ 640px) | 2 |
| `lg` (≥ 1024px) | 4 (canonical strip layout) |

`gap-3` (12px) between all cells.

## Styling notes

### `KpiCard` design tokens

| Token / class | Element | Purpose |
|---------------|---------|---------|
| `bg-surface` | Card `<div>` | Slightly elevated card surface |
| `border-border` | Card `<div>` | Neutral card border |
| `rounded-lg` | Card `<div>` | 8px corner radius |
| `p-3.5` | Card `<div>` | 14px inner padding |
| `text-[11px] uppercase tracking-wide` | Label `<p>` | Compact all-caps metric label |
| `text-text-faint` | Label `<p>`, hint `<p>` | Tertiary text colour |
| `text-2xl font-semibold tracking-tight` | Value `<span>` | Large display number |
| `text-ok` | Delta `<span>` when `positive` | Green (`--color-ok`, `#3fb950`) |
| `text-err` | Delta `<span>` when `!positive` | Red (`--color-err`, `#f85149`) |

## Data source

`KPIS` is a static array defined in `src/data/kpis.ts`. There is no network request. The data represents a snapshot of metrics at application build time (or mock data during development).

## Edge cases and assumptions

- **`kpi.delta` whitespace:** `kip.delta.trim().startsWith('-')` correctly handles values like `" -5%"` with a leading space, but the data layer is expected to produce clean strings.
- **`kpi.delta` with no sign character:** A delta string like `"5%"` (no `+` or `-`) will be treated as positive (not starting with `'-'`), showing `IconTrendUp`. This may be misleading; the data layer should always include an explicit sign.
- **`kpi.trend.length < 2`:** `Sparkline` returns `null` for fewer than 2 points, leaving an empty space where the chart would be. `KPIS` data is expected to always provide at least 2 trend points.
- **`kpi.trend` all-equal values:** `Sparkline` handles this with a `range = max - min || 1` guard, producing a flat horizontal line. See `Sparkline` docs for details.
