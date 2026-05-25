---
title: integrations
description: Files under server/src/integrations/
---

**Folder:** `server/src/integrations/`

<!-- fill:folder:summary -->
This folder holds adapters that talk to external systems on behalf of the API. Today that is `cicd.ts`, which defines the `CicdProvider` interface and its two implementations — a deterministic mock and a live GitHub Actions client — plus the pure `summarizePipelines` aggregator. Modules that wrap a third-party service behind a small interface (so callers like `routes.ts` stay decoupled from the vendor) belong here. Data access to the app's own database (the Postgres store) and core domain types do not — those live in `db/` and `domain.ts`.
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
At startup `getCicdProvider` in `cicd.ts` picks the live `createGithubActionsProvider` when `GITHUB_TOKEN` and `GITHUB_REPO` are set, otherwise the credential-free `createMockCicdProvider`; the chosen provider is injected into the app as `deps.cicd`. When a request hits `GET /api/pipelines`, the route calls `deps.cicd.listPipelines()` and passes the result through `summarizePipelines` to attach pass/fail counts and a pass rate before responding.
<!-- /fill:folder:flows -->
