---
title: integrations
description: Files under server/src/integrations/
---

**Folder:** `server/src/integrations/`

<!-- fill:folder:summary -->
`server/src/integrations/` holds adapters to external systems behind small provider interfaces, keeping third-party details out of the routes. Its one module, `cicd.ts`, defines the `CicdProvider` interface and two implementations — a deterministic mock and a live GitHub Actions client — plus the `getCicdProvider` selector and the pure `summarizePipelines` helper. Add a file here when wiring in another outside data source (e.g. another CI system or an alerting tool) behind a similar interface. Database access (`postgresStore.ts`) and HTTP routing (`routes.ts`) do NOT belong here.
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
- **Provider selection:** at startup `getCicdProvider` inspects the GitHub credentials from config and returns the live `createGithubActionsProvider` when both token and repo are set, otherwise `createMockCicdProvider`.
- **Pipeline request:** the `/api/pipelines` route calls the chosen provider's `listPipelines()`, then passes the result through `summarizePipelines` to attach aggregate counts and a pass rate before responding.
<!-- /fill:folder:flows -->
