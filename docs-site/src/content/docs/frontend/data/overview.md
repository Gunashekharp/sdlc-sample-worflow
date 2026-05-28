---
title: data
description: Files under src/data/
---

**Folder:** `src/data/`

<!-- fill:folder:summary -->
This folder holds the static seed data the dashboard renders before any backend call resolves — the agent catalogue in `agents.ts` and the headline KPI list in `kpis.ts` — along with the TypeScript types (`Agent`, `AgentStatus`, `AgentCategory`, `Kpi`) that the rest of the frontend imports. Modules here are pure data and types only: no React, no `fetch`, no `localStorage`. Anything that needs runtime data from the API belongs in `../lib/` (e.g. `api.ts`, `useFetch.ts`).
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`agents.ts`](../data/agents) | SDLC agent catalogue for the Snabbit Agent Console. |
| [`kpis.ts`](../data/kpis) | Headline metrics shown in the KPI strip. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
- **Catalogue bootstrapping:** `agents.ts` exports `AGENTS`, `FEATURED_AGENT_ID`, and `AGENT_CATEGORIES`; `App` picks the featured agent by id and hands the rest to `AgentGrid`, while `AgentGrid` uses `AGENT_CATEGORIES` to build its filter tabs.
- **KPI rendering:** `kpis.ts` exports the `KPIS` array; `KpiStrip` iterates it and forwards each `trend` series to `Sparkline`.
<!-- /fill:folder:flows -->
