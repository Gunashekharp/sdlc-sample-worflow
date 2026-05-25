---
title: integrations
description: Files under server/src/integrations/
---

**Folder:** `server/src/integrations/`

<!-- fill:folder:summary -->
`server/src/integrations/` holds adapters to external systems behind a stable internal interface. Its single file, `cicd.ts`, defines the `CicdProvider` contract and two implementations — a credential-free mock and a live GitHub Actions client — plus `getCicdProvider`, which picks between them based on configuration. New third-party integrations (other CI providers, alerting, issue trackers) belong here, each exposing a narrow interface so the routes stay decoupled from the vendor. Persistence and request routing do not belong here — those live in `db/`/`postgresStore.ts` and `routes.ts` respectively.
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
- **Provider selection:** At startup `index.ts` calls `getCicdProvider({ githubToken, githubRepo })`; when both credentials are present it returns the live GitHub Actions provider, otherwise the deterministic mock — so the rest of the app talks to one `CicdProvider` interface regardless of environment.
- **Pipeline request:** The `/api/pipelines` route calls `provider.listPipelines()` and passes the result through `summarizePipelines` to attach aggregate counts before responding.
<!-- /fill:folder:flows -->
