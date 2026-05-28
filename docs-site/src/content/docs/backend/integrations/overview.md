---
title: integrations
description: Files under server/src/integrations/
---

**Folder:** `server/src/integrations/`

<!-- fill:folder:summary -->
Adapters that bridge external services to the API's internal interfaces. Today it contains a single file, `cicd.ts`, which exposes a `CicdProvider` interface and two implementations — `createMockCicdProvider` (deterministic, no credentials) and `createGithubActionsProvider` (live GitHub Actions API). New integrations (PagerDuty, Datadog, etc.) belong here when they need to be swapped for tests or by configuration; pure domain logic and storage do not.
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`cicd.ts`](../integrations/cicd) | CI/CD integration adapter. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
- **Provider selection.** `index.ts` calls `getCicdProvider({ githubToken, githubRepo })`, which returns the GitHub Actions provider when both env vars are set and the mock provider otherwise. The selected implementation is passed through `AppDeps.cicd`.
- **Pipelines request.** When the frontend hits `GET /api/pipelines`, `routes.ts` awaits `deps.cicd.listPipelines()` and pipes the result through `summarizePipelines` before responding. The mock returns a hard-coded list; the GitHub provider calls `https://api.github.com/repos/{repo}/actions/runs` and maps each `workflow_run` through `githubRunToPipeline`.
<!-- /fill:folder:flows -->
