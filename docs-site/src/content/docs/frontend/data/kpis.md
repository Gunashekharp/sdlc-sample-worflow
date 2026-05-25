---
title: kpis
description: Reference for `src/data/kpis.ts`
---

**File:** `src/data/kpis.ts` · **Lines:** 56

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `data/kpis.ts` is responsible for, what other files it integrates with, and what calls into it.>
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
<FILL: 2-4 sentences explaining what Kpi does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:Kpi:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | <FILL: id> |
| label | `string` | <FILL: label> |
| value | `string` | <FILL: value> |
| delta | `string` | <FILL: delta> |
| positive | `boolean` | <FILL: positive> |
| hint | `string` | <FILL: hint> |
| trend | `number[]` | <FILL: trend> |

### Used by

- `src/components/KpiStrip.tsx`

## KPIS

**Kind:** `const`

```ts
const KPIS: Kpi[]
```

<!-- fill:sym:KPIS:summary -->
<FILL: 2-4 sentences explaining what KPIS does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:KPIS:summary -->

### Used by

- `src/components/KpiStrip.tsx`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
