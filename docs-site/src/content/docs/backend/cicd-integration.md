---
title: CI/CD integration
---

The CI/CD integration (`server/src/integrations/cicd.ts`) is a pluggable
adapter behind the `CicdProvider` interface. A deterministic **mock** provider
is the default; a **live GitHub Actions** provider is selected automatically
when credentials are present.

## The provider interface

```ts
interface CicdProvider {
  readonly name: string
  listPipelines(): Promise<Pipeline[]>
}
```

A `Pipeline` carries:

| Field | Type | Notes |
| ----------------- | ---------------------------------- | --------------------------------------- |
| `id` | `string` | Unique run identifier |
| `name` | `string` | Workflow / pipeline name |
| `provider` | `'github-actions' \| 'jenkins'` | Source system |
| `branch` | `string` | Git branch the run was triggered on |
| `status` | `'passing' \| 'failing' \| 'running'` | Current run status |
| `durationSeconds` | `number` | Elapsed or final run duration |
| `triggeredBy` | `string` | Actor who triggered the run |
| `updatedAt` | `string` | ISO 8601 timestamp of the last update |

## Selecting a provider

```ts
export function getCicdProvider(env: {
  githubToken: string
  githubRepo?: string
}): CicdProvider {
  if (env.githubToken && env.githubRepo) {
    return createGithubActionsProvider(env.githubToken, env.githubRepo)
  }
  return createMockCicdProvider()
}
```

The live provider is used only when **both** `GITHUB_TOKEN` and `GITHUB_REPO`
are set; otherwise the mock is returned. `index.ts` passes `config.githubToken`
and `config.githubRepo` at startup.

## Mock provider

`createMockCicdProvider()` (name: `'mock'`) returns a fixed list of eight
pipelines spanning both `github-actions` and `jenkins` providers, with a mix of
passing, failing, and running statuses. Their `updatedAt` timestamps are
computed relative to "now" via a `minutesAgo` helper so the data stays
plausibly recent on every call. No credentials are required.

### Mock pipeline data

| ID | Name | Provider | Branch | Status | Duration | Triggered by |
| ------- | ---------------------- | -------------- | -------------------- | ------- | -------- | ------------ |
| p-1041 | CI · build & test | github-actions | main | passing | 3m 4s | a.kapoor |
| p-1040 | E2E suite | github-actions | main | running | 5m 12s | ci-bot |
| p-1039 | Deploy · staging | github-actions | release/4.19 | passing | 1m 36s | deploy-bot |
| p-1038 | Lint & typecheck | github-actions | feat/agent-drawer | failing | 47s | guna |
| p-1037 | Docker image | jenkins | main | passing | 4m 28s | ci-bot |
| p-1036 | DB migration check | github-actions | feat/pg-store | passing | 38s | m.silva |
| p-1035 | Nightly regression | jenkins | main | failing | 15m 4s | scheduler |
| p-1034 | Release · production | github-actions | release/4.19 | running | 2m 20s | deploy-bot |

Of the 8 pipelines, 4 are passing, 2 are failing, and 2 are running. The
`summarizePipelines` function computes `passRate` over the 6 finished pipelines
(4 passing, 2 failing), yielding 67%.

## Live GitHub Actions provider

`createGithubActionsProvider(token, repo)` (name: `'github-actions'`) fetches
the 20 most recent workflow runs:

```
GET https://api.github.com/repos/<repo>/actions/runs?per_page=20
Authorization: Bearer <token>
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

A non-OK response throws `Error("GitHub Actions API responded <status>")`. Each
returned run is mapped to a `Pipeline` by `githubRunToPipeline`:

- **status** — `'running'` unless the run is `completed`; once completed,
  `'passing'` if `conclusion === 'success'`, otherwise `'failing'`.
- **durationSeconds** — `updated_at − run_started_at` in seconds (falls back to
  `updated_at` as the start time if `run_started_at` is missing, floored at 0).
- **branch** — `head_branch`, or `'unknown'`.
- **triggeredBy** — `actor.login`, or `'unknown'`.

The token needs `repo` and `actions:read` scope.

## Summary

`summarizePipelines(pipelines)` is a pure function that aggregates a list of
pipelines into a `PipelineSummary`:

```ts
interface PipelineSummary {
  total: number    // pipelines.length
  passing: number  // count where status === 'passing'
  failing: number  // count where status === 'failing'
  running: number  // count where status === 'running'
  passRate: number // round(passing / (passing + failing) * 100)
                   // 0 when no pipelines have finished
}
```

The pass rate is computed over **finished** pipelines only (passing + failing);
running pipelines do not count toward the denominator, and an empty list yields
`passRate: 0`. This summary is attached to the
[`GET /api/pipelines`](/sdlc-sample-worflow/backend/api/#get-apipipelines)
response.
