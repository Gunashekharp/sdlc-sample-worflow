---
title: api
description: Reference for `src/lib/api.ts`
---

**File:** `src/lib/api.ts` · **Lines:** 44

<FILL: 2-4 sentence plain-language summary of what `lib/api.ts` is responsible for, what other files it integrates with, and what calls into it.>

## Symbols

This file exports 5 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| fetchPipelines | function | no |
| PipelineStatus | type | no |
| Pipeline | interface | no |
| PipelineSummary | interface | no |
| PipelinesResponse | interface | no |

## fetchPipelines

**Kind:** `function`

```ts
export async function fetchPipelines(
  signal?: AbortSignal,
): Promise<PipelinesResponse> { ... }
```

<FILL: 2-4 sentences explaining what fetchPipelines does and why it exists. Ground every claim in the signature and source.>

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| signal | `AbortSignal` | — | no | <FILL: purpose of signal> |

**Returns:** `Promise<PipelinesResponse>`

<FILL: describe the return value of fetchPipelines — what it represents, when it can be null/undefined, units.>

### Line-by-line walkthrough

Each top-level statement of `fetchPipelines`, in execution order. The line numbers reference the source file as it appears today.

**Line 38 — `FirstStatement`**

```ts
const res = await fetch(`${API_URL}/api/pipelines`, { signal })
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 39 — `IfStatement`**

```ts
if (!res.ok) {
    throw new Error(`API responded ${res.status}`)
  }
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 42 — `ReturnStatement`**

```ts
return res.json() as Promise<PipelinesResponse>
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

### Examples

<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>

### Used by

- `src/components/PipelinesPanel.tsx`

## PipelineStatus

**Kind:** `type`

```ts
export type PipelineStatus = 'passing' | 'failing' | 'running'
```

<FILL: 2-4 sentences explaining what PipelineStatus does and why it exists. Ground every claim in the signature and source.>

## Pipeline

**Kind:** `interface`

```ts
export interface Pipeline { ... }
```

<FILL: 2-4 sentences explaining what Pipeline does and why it exists. Ground every claim in the signature and source.>

### Shape

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | <FILL: id> |
| name | `string` | <FILL: name> |
| provider | `"github-actions" \| "jenkins"` | <FILL: provider> |
| branch | `string` | <FILL: branch> |
| status | `PipelineStatus` | <FILL: status> |
| durationSeconds | `number` | <FILL: durationSeconds> |
| triggeredBy | `string` | <FILL: triggeredBy> |
| updatedAt | `string` | <FILL: updatedAt> |

### Used by

- `src/components/PipelinesPanel.tsx`

## PipelineSummary

**Kind:** `interface`

```ts
export interface PipelineSummary { ... }
```

<FILL: 2-4 sentences explaining what PipelineSummary does and why it exists. Ground every claim in the signature and source.>

### Shape

| Name | Type | Description |
| --- | --- | --- |
| total | `number` | <FILL: total> |
| passing | `number` | <FILL: passing> |
| failing | `number` | <FILL: failing> |
| running | `number` | <FILL: running> |
| passRate | `number` | <FILL: passRate> |

## PipelinesResponse

**Kind:** `interface`

```ts
export interface PipelinesResponse { ... }
```

<FILL: 2-4 sentences explaining what PipelinesResponse does and why it exists. Ground every claim in the signature and source.>

### Shape

| Name | Type | Description |
| --- | --- | --- |
| provider | `string` | <FILL: provider> |
| summary | `PipelineSummary` | <FILL: summary> |
| pipelines | `Pipeline[]` | <FILL: pipelines> |

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `src/lib/api.ts` (44 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (44 lines)</summary>

````ts
/*
 * Typed client for the Snabbit Agent Console API.
 * The base URL can be overridden with the VITE_API_URL env var.
 */

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type PipelineStatus = 'passing' | 'failing' | 'running'

export interface Pipeline {
  id: string
  name: string
  provider: 'github-actions' | 'jenkins'
  branch: string
  status: PipelineStatus
  durationSeconds: number
  triggeredBy: string
  updatedAt: string
}

export interface PipelineSummary {
  total: number
  passing: number
  failing: number
  running: number
  passRate: number
}

export interface PipelinesResponse {
  provider: string
  summary: PipelineSummary
  pipelines: Pipeline[]
}

export async function fetchPipelines(
  signal?: AbortSignal,
): Promise<PipelinesResponse> {
  const res = await fetch(`${API_URL}/api/pipelines`, { signal })
  if (!res.ok) {
    throw new Error(`API responded ${res.status}`)
  }
  return res.json() as Promise<PipelinesResponse>
}

````

</details>
