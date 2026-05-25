---
title: lib
description: Files under src/lib/
---

**Folder:** `src/lib/`

<!-- fill:folder:summary -->
<FILL: 2-4 sentences on what this folder is for, what kinds of modules belong here, and what does NOT belong here.>
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`api.ts`](../lib/api) | Typed client for the Snabbit Agent Console API. |
| [`filterAgents.ts`](../lib/filteragents) | <FILL: one-line purpose for filterAgents.ts> |
| [`sortAgents.ts`](../lib/sortagents) | <FILL: one-line purpose for sortAgents.ts> |
| [`useFetch.ts`](../lib/usefetch) | <FILL: one-line purpose for useFetch.ts> |
| [`usePersistentState.ts`](../lib/usepersistentstate) | <FILL: one-line purpose for usePersistentState.ts> |

## Dependencies

### Module dependency subgraph

```mermaid
%% Subgraph for frontend/lib
%% Auto-generated from source by scripts/docs/extract-diagrams.ts. Do not edit by hand — changes will be overwritten on the next docs-agent run.
flowchart LR
  data_agents_ts["external: data/agents.ts"]
  lib_filterAgents_ts["lib/filterAgents.ts"]
  lib_sortAgents_ts["lib/sortAgents.ts"]
  lib_filterAgents_ts --> data_agents_ts
  lib_sortAgents_ts --> data_agents_ts
```

## Key flows

<!-- fill:folder:flows -->
<FILL: 1-3 short descriptions of how modules in this folder cooperate at runtime.>
<!-- /fill:folder:flows -->
