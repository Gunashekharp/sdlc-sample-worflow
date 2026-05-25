---
title: data
description: Files under src/data/
---

**Folder:** `src/data/`

<!-- fill:folder:summary -->
`src/data/` holds the static seed datasets that populate the Agent Console: `agents.ts` (the agent catalogue plus the `Agent` type, `FEATURED_AGENT_ID`, and `AGENT_CATEGORIES`) and `kpis.ts` (the headline `KPIS` metrics). These modules export plain TypeScript constants and the interfaces describing their shape — a real deployment would fetch the same data from the backend instead. Keep purely presentational data and its types here; components, hooks, and data-derivation logic (filtering, sorting, fetching) belong in `components/` and `lib/`, not in this folder.
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
- `App.tsx` reads `AGENTS` and `FEATURED_AGENT_ID` from `agents.ts` to split out the featured agent and pass the remaining records to `AgentGrid`.
- `KpiStrip.tsx` maps over `KPIS` from `kpis.ts`, rendering each metric's text and feeding its `trend` array to a `Sparkline`.
- The modules here have no internal dependencies on each other; they are independent leaf data sources consumed by components in `components/` and helpers in `lib/`.
<!-- /fill:folder:flows -->
