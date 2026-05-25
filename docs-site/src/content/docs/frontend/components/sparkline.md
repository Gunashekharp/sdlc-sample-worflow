---
title: Sparkline
description: Reference for `src/components/Sparkline.tsx`
---

**File:** `src/components/Sparkline.tsx` · **Lines:** 47

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `components/Sparkline.tsx` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| Sparkline | component | yes |

## Sparkline (default export)

**Kind:** `component`

```ts
export default function Sparkline({ points, positive, className }: SparklineProps) { ... }
```

> A tiny, axis-free trend line for KPI cards.

### Props

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| points | `number[]` | yes | Series values, oldest first. Needs at least two points to render. |
| positive | `boolean` | yes | Drives the line color: ok (green) when true, err (red) when false. |
| className | `string` | no | <FILL: what does className control?> |

### Line-by-line walkthrough

Each top-level statement of `Sparkline`, in execution order. The line numbers reference the source file as it appears today.

**Line 11 — `IfStatement`**

```ts
if (points.length < 2) return null
```

<!-- fill:sym:Sparkline:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:0 -->

**Line 13 — `FirstStatement`**

```ts
const width = 100
```

<!-- fill:sym:Sparkline:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:1 -->

**Line 14 — `FirstStatement`**

```ts
const height = 28
```

<!-- fill:sym:Sparkline:walk:2 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:2 -->

**Line 15 — `FirstStatement`**

```ts
const pad = 3
```

<!-- fill:sym:Sparkline:walk:3 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:3 -->

**Line 16 — `FirstStatement`**

```ts
const min = Math.min(...points)
```

<!-- fill:sym:Sparkline:walk:4 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:4 -->

**Line 17 — `FirstStatement`**

```ts
const max = Math.max(...points)
```

<!-- fill:sym:Sparkline:walk:5 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:5 -->

**Line 18 — `FirstStatement`**

```ts
const range = max - min || 1
```

<!-- fill:sym:Sparkline:walk:6 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:6 -->

**Line 20 — `FirstStatement`**

```ts
const coords = points
    .map((value, i) => {
      const x = pad + (i / (points.length - 1)) * (width - pad * 2)
      const y = height - pad - ((value - min) / range) * (height - pad * 2)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
```

<!-- fill:sym:Sparkline:walk:7 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:7 -->

**Line 28 — `ReturnStatement`**

```ts
return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className ?? 'h-7 w-full'}
    >
      <polyline
        points={coords}
        fill="none"
        stroke={positive ? 'var(--color-ok)' : 'var(--color-err)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
```

<!-- fill:sym:Sparkline:walk:8 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:Sparkline:walk:8 -->

### Examples

<!-- fill:sym:Sparkline:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:Sparkline:example -->

### Used by

- `src/components/KpiStrip.tsx`
- `src/components/Sparkline.test.tsx`

## Tests

| Suite | Test | Asserts |
| --- | --- | --- |
| <Sparkline /> | renders a polyline with one coordinate per value | <FILL: assertion summary> |
| <Sparkline /> | renders nothing when given fewer than two points | <FILL: assertion summary> |
| <Sparkline /> | uses the error color when not positive | <FILL: assertion summary> |

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `src/components/Sparkline.tsx` (47 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (47 lines)</summary>

````tsx
interface SparklineProps {
  /** Series values, oldest first. Needs at least two points to render. */
  points: number[]
  /** Drives the line color: ok (green) when true, err (red) when false. */
  positive: boolean
  className?: string
}

/** A tiny, axis-free trend line for KPI cards. */
export default function Sparkline({ points, positive, className }: SparklineProps) {
  if (points.length < 2) return null

  const width = 100
  const height = 28
  const pad = 3
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const coords = points
    .map((value, i) => {
      const x = pad + (i / (points.length - 1)) * (width - pad * 2)
      const y = height - pad - ((value - min) / range) * (height - pad * 2)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className ?? 'h-7 w-full'}
    >
      <polyline
        points={coords}
        fill="none"
        stroke={positive ? 'var(--color-ok)' : 'var(--color-err)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

````

</details>
