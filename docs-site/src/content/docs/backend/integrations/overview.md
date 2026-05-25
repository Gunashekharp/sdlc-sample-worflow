---
title: integrations
description: Files under server/src/integrations/
---

**Folder:** `server/src/integrations/`

<!-- fill:folder:summary -->
This folder holds adapters that connect the backend to external CI/CD systems. Today it contains [`cicd.ts`](../integrations/cicd), which defines the `CicdProvider` contract and ships both a credential-free mock and a live GitHub Actions provider. New modules that wrap a third-party service behind a small, swappable interface belong here; domain types, the in-memory/Postgres stores, and HTTP routing live elsewhere (`domain.ts`, `store.ts`/`postgresStore.ts`, `routes.ts`).
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
- At startup `index.ts` calls `getCicdProvider(config)` to pick the live GitHub Actions provider (when `GITHUB_TOKEN` and `GITHUB_REPO` are set) or the mock, then injects it into the app.
- When a pipelines request arrives, `routes.ts` calls `provider.listPipelines()` and passes the result to `summarizePipelines` to attach headline counts and a pass rate to the response.
<!-- /fill:folder:flows -->
