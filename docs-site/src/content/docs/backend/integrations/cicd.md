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

## Source

Full file source for `server/src/integrations/cicd.ts` (162 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (162 lines)</summary>

````ts
/*
 * CI/CD integration adapter.
 *
 * `createMockCicdProvider` returns deterministic data and needs no
 * credentials — the default. `createGithubActionsProvider` makes real calls
 * to the GitHub Actions API and is selected automatically when both
 * GITHUB_TOKEN and GITHUB_REPO are set.
 */

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
  /** Pass rate over finished (passing + failing) pipelines, 0–100. */
  passRate: number
}

export interface CicdProvider {
  readonly name: string
  listPipelines(): Promise<Pipeline[]>
}

/** Aggregate pipeline statuses into a summary. Pure. */
export function summarizePipelines(pipelines: Pipeline[]): PipelineSummary {
  const passing = pipelines.filter((p) => p.status === 'passing').length
  const failing = pipelines.filter((p) => p.status === 'failing').length
  const running = pipelines.filter((p) => p.status === 'running').length
  const finished = passing + failing
  return {
    total: pipelines.length,
    passing,
    failing,
    running,
    passRate: finished === 0 ? 0 : Math.round((passing / finished) * 100),
  }
}

// --- Mock provider -------------------------------------------------------

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function buildMockPipelines(): Pipeline[] {
  return [
    { id: 'p-1041', name: 'CI · build & test', provider: 'github-actions', branch: 'main', status: 'passing', durationSeconds: 184, triggeredBy: 'a.kapoor', updatedAt: minutesAgo(6) },
    { id: 'p-1040', name: 'E2E suite', provider: 'github-actions', branch: 'main', status: 'running', durationSeconds: 312, triggeredBy: 'ci-bot', updatedAt: minutesAgo(2) },
    { id: 'p-1039', name: 'Deploy · staging', provider: 'github-actions', branch: 'release/4.19', status: 'passing', durationSeconds: 96, triggeredBy: 'deploy-bot', updatedAt: minutesAgo(24) },
    { id: 'p-1038', name: 'Lint & typecheck', provider: 'github-actions', branch: 'feat/agent-drawer', status: 'failing', durationSeconds: 47, triggeredBy: 'guna', updatedAt: minutesAgo(38) },
    { id: 'p-1037', name: 'Docker image', provider: 'jenkins', branch: 'main', status: 'passing', durationSeconds: 268, triggeredBy: 'ci-bot', updatedAt: minutesAgo(51) },
    { id: 'p-1036', name: 'DB migration check', provider: 'github-actions', branch: 'feat/pg-store', status: 'passing', durationSeconds: 38, triggeredBy: 'm.silva', updatedAt: minutesAgo(72) },
    { id: 'p-1035', name: 'Nightly regression', provider: 'jenkins', branch: 'main', status: 'failing', durationSeconds: 904, triggeredBy: 'scheduler', updatedAt: minutesAgo(143) },
    { id: 'p-1034', name: 'Release · production', provider: 'github-actions', branch: 'release/4.19', status: 'running', durationSeconds: 140, triggeredBy: 'deploy-bot', updatedAt: minutesAgo(4) },
  ]
}

export function createMockCicdProvider(): CicdProvider {
  return {
    name: 'mock',
    async listPipelines() {
      return buildMockPipelines()
    },
  }
}

// --- Live provider: GitHub Actions --------------------------------------

interface GithubRun {
  id: number
  name: string | null
  display_title: string
  head_branch: string | null
  status: string
  conclusion: string | null
  run_started_at: string | null
  updated_at: string
  actor?: { login: string }
}

interface GithubRunsResponse {
  workflow_runs: GithubRun[]
}

function githubRunToPipeline(run: GithubRun): Pipeline {
  const status: PipelineStatus =
    run.status !== 'completed'
      ? 'running'
      : run.conclusion === 'success'
        ? 'passing'
        : 'failing'

  const started = run.run_started_at
    ? Date.parse(run.run_started_at)
    : Date.parse(run.updated_at)
  const durationSeconds = Math.max(
    0,
    Math.round((Date.parse(run.updated_at) - started) / 1000),
  )

  return {
    id: String(run.id),
    name: run.name ?? run.display_title,
    provider: 'github-actions',
    branch: run.head_branch ?? 'unknown',
    status,
    durationSeconds,
    triggeredBy: run.actor?.login ?? 'unknown',
    updatedAt: run.updated_at,
  }
}

export function createGithubActionsProvider(
  token: string,
  repo: string,
): CicdProvider {
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
}

/** Pick the live provider when credentials are present, else the mock. */
export function getCicdProvider(env: {
  githubToken: string
  githubRepo?: string
}): CicdProvider {
  if (env.githubToken && env.githubRepo) {
    return createGithubActionsProvider(env.githubToken, env.githubRepo)
  }
  return createMockCicdProvider()
}

````

</details>
