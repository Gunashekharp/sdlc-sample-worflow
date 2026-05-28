---
title: integrations
description: Files under server/src/integrations/
---

**Folder:** `server/src/integrations/`

<!-- fill:folder:summary -->
This folder holds adapters for third-party services the API talks to. Today that is `cicd.ts`, which exposes the `CicdProvider` interface and a mock vs. GitHub Actions implementation behind a `getCicdProvider()` selector. Add a new file here when wiring in another external service (e.g. Jira, Sentry); keep each provider behind a small interface so the route handlers can stay agnostic. Persistence belongs in `../store.ts`/`../postgresStore.ts`, not here.
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
- **Provider selection:** at boot `index.ts` calls `getCicdProvider({ githubToken, githubRepo })`; if both env vars are set it returns the live `createGithubActionsProvider`, otherwise the deterministic `createMockCicdProvider` (also used by tests).
- **Request path:** `routes.ts`'s `GET /api/pipelines` handler calls `deps.cicd.listPipelines()` and feeds the result through `summarizePipelines()` so the response carries both per-run rows and the aggregate pass-rate summary.
<!-- /fill:folder:flows -->
