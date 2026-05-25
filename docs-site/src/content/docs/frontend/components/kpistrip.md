---
title: KpiStrip
description: Reference for `src/components/KpiStrip.tsx`
---

**File:** `src/components/KpiStrip.tsx` · **Lines:** 45

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `components/KpiStrip.tsx` is responsible for, what other files it integrates with, and what calls into it.>
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
<FILL: 2-4 sentences explaining what KpiStrip does and why it exists. Ground every claim in the signature and source.>
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
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:KpiStrip:walk:0 -->

### Examples

<!-- fill:sym:KpiStrip:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:KpiStrip:example -->

### Used by

- `src/App.tsx`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
