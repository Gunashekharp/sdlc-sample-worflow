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

A `Pipeline` carries `id`, `name`, `provider` (`'github-actions' | 'jenkins'`),
`branch`, `status` (`'passing' | 'failing' | 'running'`), `durationSeconds`,
`triggeredBy` and `updatedAt`.

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
are set; otherwise the mock is returned. `index.ts` passes the configured
values in at startup.

## Mock provider

`createMockCicdProvider()` (name: `mock`) returns a fixed list of eight
pipelines spanning both `github-actions` and `jenkins` providers, with a mix of
passing / failing / running statuses. Their `updatedAt` timestamps are computed
relative to "now" via a `minutesAgo` helper, so the data stays plausibly recent
on every call. No credentials are required.

## Live GitHub Actions provider

`createGithubActionsProvider(token, repo)` (name: `github-actions`) fetches
recent workflow runs:

```
GET https://api.github.com/repos/<repo>/actions/runs?per_page=20
Authorization: Bearer <token>
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

A non-OK response throws `Error("GitHub Actions API responded <status>")`. Each
returned run is mapped to a `Pipeline` by `githubRunToPipeline`:

- **status** — `running` unless the run is `completed`; once completed,
  `passing` if `conclusion === 'success'`, otherwise `failing`.
- **durationSeconds** — `updated_at − run_started_at` in seconds (falls back to
  `updated_at` for the start, floored at 0).
- **branch** — `head_branch`, or `'unknown'`.
- **triggeredBy** — `actor.login`, or `'unknown'`.

The token needs `repo` + `actions:read` scope.

## Summary

`summarizePipelines(pipelines)` is a pure function that aggregates a list into
a `PipelineSummary`:

```ts
{
  total,    // pipelines.length
  passing,  // count of status === 'passing'
  failing,  // count of status === 'failing'
  running,  // count of status === 'running'
  passRate, // round(passing / (passing + failing) * 100), or 0 if none finished
}
```

The pass rate is computed over **finished** pipelines only (passing + failing);
running pipelines do not count toward the denominator, and an empty list yields
a `passRate` of 0. This summary is attached to the
[`GET /api/pipelines`](/sdlc-sample-worflow/backend/api/#get-apipipelines)
response.
