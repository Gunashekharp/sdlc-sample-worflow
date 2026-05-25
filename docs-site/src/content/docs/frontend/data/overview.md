---
title: data
description: Files under src/data/
---

**Folder:** `src/data/`

<!-- fill:folder:summary -->
`src/data/` holds the frontend's static seed data and the TypeScript types that shape it: `agents.ts` (the agent catalogue plus the `Agent`, `AgentStatus`, and `AgentCategory` types) and `kpis.ts` (the headline metrics and the `Kpi` type). These modules are plain data with no runtime dependencies — the subgraph above shows no internal imports — so they are imported by components (`AgentGrid`, `KpiStrip`, `FeaturedAgent`) and by the `src/lib/` transforms. In a real deployment this data would come from the backend API instead; logic, hooks, and rendering belong in `src/lib/` and `src/components/`, not here.
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
- **Agent catalogue:** `App.tsx` reads `AGENTS` and `FEATURED_AGENT_ID` to split the featured agent from the rest, then `AgentGrid` runs the remainder through `filterAgents`/`sortAgents`; `AGENT_CATEGORIES` seeds the grid's category tabs.
- **Metrics:** `KpiStrip` maps over `KPIS`, rendering one card per record and feeding each `trend` array into a `Sparkline`.
<!-- /fill:folder:flows -->
