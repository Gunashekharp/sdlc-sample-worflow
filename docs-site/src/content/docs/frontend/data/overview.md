---
title: data
description: Files under src/data/
---

**Folder:** `src/data/`

<!-- fill:folder:summary -->
`src/data/` holds the frontend's static seed data: the agent catalogue (`agents.ts`) and the dashboard KPIs (`kpis.ts`). Each module pairs a TypeScript interface and supporting literal-union types with the hard-coded array that fills the UI, standing in for what a real deployment would fetch from the backend. These files have no internal dependencies (see the note above) and contain no logic or rendering — components in `src/components/` and helpers in `src/lib/` consume the data and types defined here, not the other way around.
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
- **Catalogue bootstrap:** `App.tsx` imports `AGENTS` and `FEATURED_AGENT_ID` from `agents.ts`, separates the featured agent from the rest, and hands the remainder to `AgentGrid`.
- **Metric strip:** `KpiStrip.tsx` maps over `KPIS` from `kpis.ts`, rendering one card per metric and drawing each `trend` series as a sparkline.
<!-- /fill:folder:flows -->
