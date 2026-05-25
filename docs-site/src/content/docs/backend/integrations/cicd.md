---
title: cicd
description: Reference for `server/src/integrations/cicd.ts`
---

**File:** `server/src/integrations/cicd.ts` · **Lines:** 162

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `integrations/cicd.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Symbols

This file exports 8 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| summarizePipelines | function | no |
| createMockCicdProvider | function | no |
| createGithubActionsProvider | function | no |
| getCicdProvider | function | no |
| PipelineStatus | type | no |
| Pipeline | interface | no |
| PipelineSummary | interface | no |
| CicdProvider | interface | no |

## summarizePipelines

**Kind:** `function`

```ts
export function summarizePipelines(pipelines: Pipeline[]): PipelineSummary { ... }
```

> Aggregate pipeline statuses into a summary. Pure.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| pipelines | `Pipeline[]` | — | yes | <FILL: purpose of pipelines> |

**Returns:** `PipelineSummary`

<!-- fill:sym:summarizePipelines:return -->
<FILL: describe the return value of summarizePipelines — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:summarizePipelines:return -->

### Line-by-line walkthrough

Each top-level statement of `summarizePipelines`, in execution order. The line numbers reference the source file as it appears today.

**Line 39 — `FirstStatement`**

```ts
const passing = pipelines.filter((p) => p.status === 'passing').length
```

<!-- fill:sym:summarizePipelines:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:summarizePipelines:walk:0 -->

**Line 40 — `FirstStatement`**

```ts
const failing = pipelines.filter((p) => p.status === 'failing').length
```

<!-- fill:sym:summarizePipelines:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:summarizePipelines:walk:1 -->

**Line 41 — `FirstStatement`**

```ts
const running = pipelines.filter((p) => p.status === 'running').length
```

<!-- fill:sym:summarizePipelines:walk:2 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:summarizePipelines:walk:2 -->

**Line 42 — `FirstStatement`**

```ts
const finished = passing + failing
```

<!-- fill:sym:summarizePipelines:walk:3 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:summarizePipelines:walk:3 -->

**Line 43 — `ReturnStatement`**

```ts
return {
    total: pipelines.length,
    passing,
    failing,
    running,
    passRate: finished === 0 ? 0 : Math.round((passing / finished) * 100),
  }
```

<!-- fill:sym:summarizePipelines:walk:4 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:summarizePipelines:walk:4 -->

### Examples

<!-- fill:sym:summarizePipelines:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:summarizePipelines:example -->

### Used by

- `server/src/routes.ts`
- `server/src/__tests__/cicd.test.ts`

## createMockCicdProvider

**Kind:** `function`

```ts
export function createMockCicdProvider(): CicdProvider { ... }
```

<!-- fill:sym:createMockCicdProvider:summary -->
<FILL: 2-4 sentences explaining what createMockCicdProvider does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:createMockCicdProvider:summary -->

**Returns:** `CicdProvider`

<!-- fill:sym:createMockCicdProvider:return -->
<FILL: describe the return value of createMockCicdProvider — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:createMockCicdProvider:return -->

### Line-by-line walkthrough

Each top-level statement of `createMockCicdProvider`, in execution order. The line numbers reference the source file as it appears today.

**Line 72 — `ReturnStatement`**

```ts
return {
    name: 'mock',
    async listPipelines() {
      return buildMockPipelines()
    },
  }
```

<!-- fill:sym:createMockCicdProvider:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createMockCicdProvider:walk:0 -->

### Examples

<!-- fill:sym:createMockCicdProvider:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:createMockCicdProvider:example -->

### Used by

- `server/src/__tests__/api.test.ts`
- `server/src/__tests__/cicd.test.ts`

## createGithubActionsProvider

**Kind:** `function`

```ts
export function createGithubActionsProvider(
  token: string,
  repo: string,
): CicdProvider { ... }
```

<!-- fill:sym:createGithubActionsProvider:summary -->
<FILL: 2-4 sentences explaining what createGithubActionsProvider does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:createGithubActionsProvider:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| token | `string` | — | yes | <FILL: purpose of token> |
| repo | `string` | — | yes | <FILL: purpose of repo> |

**Returns:** `CicdProvider`

<!-- fill:sym:createGithubActionsProvider:return -->
<FILL: describe the return value of createGithubActionsProvider — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:createGithubActionsProvider:return -->

### Line-by-line walkthrough

Each top-level statement of `createGithubActionsProvider`, in execution order. The line numbers reference the source file as it appears today.

**Line 130 — `ReturnStatement`**

```ts
return {
    name: 'github-actions',
    async listPipelines() {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/actions/runs?per_page=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      )
      if (!res.ok) {
        throw new Error(`GitHub Actions API responded ${res.status}`)
      }
      const data = (await res.json()) as GithubRunsResponse
      return data.workflow_runs.map(githubRunToPipeline)
    },
  }
```

<!-- fill:sym:createGithubActionsProvider:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:createGithubActionsProvider:walk:0 -->

### Examples

<!-- fill:sym:createGithubActionsProvider:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:createGithubActionsProvider:example -->

## getCicdProvider

**Kind:** `function`

```ts
export function getCicdProvider(env: {
  githubToken: string
  githubRepo?: string
}): CicdProvider { ... }
```

> Pick the live provider when credentials are present, else the mock.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| env | `{ githubToken: string; githubRepo?: string; }` | — | yes | <FILL: purpose of env> |

**Returns:** `CicdProvider`

<!-- fill:sym:getCicdProvider:return -->
<FILL: describe the return value of getCicdProvider — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:getCicdProvider:return -->

### Line-by-line walkthrough

Each top-level statement of `getCicdProvider`, in execution order. The line numbers reference the source file as it appears today.

**Line 157 — `IfStatement`**

```ts
if (env.githubToken && env.githubRepo) {
    return createGithubActionsProvider(env.githubToken, env.githubRepo)
  }
```

<!-- fill:sym:getCicdProvider:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:getCicdProvider:walk:0 -->

**Line 160 — `ReturnStatement`**

```ts
return createMockCicdProvider()
```

<!-- fill:sym:getCicdProvider:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:getCicdProvider:walk:1 -->

### Examples

<!-- fill:sym:getCicdProvider:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:getCicdProvider:example -->

### Used by

- `server/src/index.ts`
- `server/src/__tests__/cicd.test.ts`

## PipelineStatus

**Kind:** `type`

```ts
export type PipelineStatus = 'passing' | 'failing' | 'running'
```

<!-- fill:sym:PipelineStatus:summary -->
<FILL: 2-4 sentences explaining what PipelineStatus does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:PipelineStatus:summary -->

### Used by

- `server/src/__tests__/cicd.test.ts`

## Pipeline

**Kind:** `interface`

```ts
export interface Pipeline { ... }
```

<!-- fill:sym:Pipeline:summary -->
<FILL: 2-4 sentences explaining what Pipeline does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:Pipeline:summary -->

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

- `server/src/__tests__/cicd.test.ts`

## PipelineSummary

**Kind:** `interface`

```ts
export interface PipelineSummary { ... }
```

<!-- fill:sym:PipelineSummary:summary -->
<FILL: 2-4 sentences explaining what PipelineSummary does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:PipelineSummary:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| total | `number` | <FILL: total> |
| passing | `number` | <FILL: passing> |
| failing | `number` | <FILL: failing> |
| running | `number` | <FILL: running> |
| passRate | `number` | Pass rate over finished (passing + failing) pipelines, 0–100. |

## CicdProvider

**Kind:** `interface`

```ts
export interface CicdProvider { ... }
```

<!-- fill:sym:CicdProvider:summary -->
<FILL: 2-4 sentences explaining what CicdProvider does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:CicdProvider:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| name | `string` | <FILL: name> |

### Used by

- `server/src/app.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
