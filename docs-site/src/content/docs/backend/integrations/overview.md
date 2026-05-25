---
title: integrations
description: Files under server/src/integrations/
---

**Folder:** `server/src/integrations/`

<!-- fill:folder:summary -->
This folder holds adapters that connect the backend to external, third-party systems. Today its only module is [`cicd.ts`](../integrations/cicd), which fronts CI/CD data behind a `CicdProvider` interface with both a credential-free mock and a live GitHub Actions implementation. New modules belong here when they wrap an outside service (another CI vendor, an issue tracker, a chat webhook) behind a small, swappable interface. Domain types, the HTTP layer, and persistence do not belong here — those live in `domain.ts`, `routes.ts`/`app.ts`, and `store.ts`/`postgresStore.ts` respectively.
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
At boot, `index.ts` calls `cicd.ts`'s `getCicdProvider` with the configured GitHub credentials and injects the chosen provider into `createApp`. When a request hits `GET /api/pipelines`, `routes.ts` calls `provider.listPipelines()` and passes the result through `summarizePipelines` to build the response. The folder has no internal dependencies — each adapter is self-contained and only consumed from the app/route layer.
<!-- /fill:folder:flows -->
