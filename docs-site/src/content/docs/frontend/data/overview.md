---
title: data
description: Files under src/data/
---

**Folder:** `src/data/`

<!-- fill:folder:summary -->
Static seed data and the TypeScript types that describe it. `agents.ts` exports the agent catalogue (`AGENTS`, `AGENT_CATEGORIES`, `FEATURED_AGENT_ID`) and the `Agent`/`AgentStatus`/`AgentCategory` types; `kpis.ts` exports the `KPIS` list and the `Kpi` type. Anything that needs a network call, derived state, or rendering belongs in `lib/` or `components/` — this folder is for plain values.
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
- **App startup.** `App.tsx` imports `AGENTS` and `FEATURED_AGENT_ID` from `agents.ts`, picks the featured agent, and passes the remainder to `AgentGrid`.
- **KPI rendering.** `KpiStrip` imports `KPIS` from `kpis.ts` and maps each entry to a `KpiCard`; the `positive` flag drives the sparkline colour and the sign of `delta` picks the trend arrow.
- **Backend mirror.** The Express API's `seed.ts` keeps the same shape (`Agent`, `Kpi`) so the in-memory store and Postgres-loaded data round-trip into the same frontend types.
<!-- /fill:folder:flows -->
