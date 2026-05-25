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
