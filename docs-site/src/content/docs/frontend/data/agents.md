---
title: agents
description: Reference for `src/data/agents.ts`
---

**File:** `src/data/agents.ts` · **Lines:** 211

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `data/agents.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Symbols

This file exports 6 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| AgentStatus | type | no |
| AgentCategory | type | no |
| Agent | interface | no |
| AGENTS | const | no |
| FEATURED_AGENT_ID | const | no |
| AGENT_CATEGORIES | const | no |

## AgentStatus

**Kind:** `type`

```ts
export type AgentStatus = 'running' | 'idle' | 'attention'
```

<!-- fill:sym:AgentStatus:summary -->
<FILL: 2-4 sentences explaining what AgentStatus does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:AgentStatus:summary -->

### Used by

- `src/components/StatusDot.tsx`

## AgentCategory

**Kind:** `type`

```ts
export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'
```

<!-- fill:sym:AgentCategory:summary -->
<FILL: 2-4 sentences explaining what AgentCategory does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:AgentCategory:summary -->

## Agent

**Kind:** `interface`

```ts
export interface Agent { ... }
```

<!-- fill:sym:Agent:summary -->
<FILL: 2-4 sentences explaining what Agent does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:Agent:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | <FILL: id> |
| name | `string` | <FILL: name> |
| category | `AgentCategory` | <FILL: category> |
| description | `string` | <FILL: description> |
| status | `AgentStatus` | <FILL: status> |
| runsPerWeek | `number` | Approximate runs over the last 7 days. |
| successRate | `number` | Successful-run percentage, 0–100. |
| avgDuration | `string` | Human-readable average run duration. |
| lastRun | `string` | Human-readable time since the last run. |
| lastRunMinutes | `number` | Minutes since the last run — orderable companion to `lastRun`. |
| popular | `boolean` | Whether the agent appears under the "Popular" filter. |

### Used by

- `src/components/FeaturedAgent.tsx`
- `src/lib/filterAgents.ts`
- `src/lib/sortAgents.ts`
- `src/components/AgentCard.tsx`
- `src/components/AgentGrid.tsx`
- `src/lib/filterAgents.test.ts`
- `src/lib/sortAgents.test.ts`

## AGENTS

**Kind:** `const`

```ts
const AGENTS: Agent[]
```

<!-- fill:sym:AGENTS:summary -->
<FILL: 2-4 sentences explaining what AGENTS does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:AGENTS:summary -->

### Used by

- `src/App.tsx`
- `src/components/AgentGrid.test.tsx`
- `src/data/agents.test.ts`

## FEATURED_AGENT_ID

**Kind:** `const`

```ts
const FEATURED_AGENT_ID: "pr-reviewer"
```

> The agent surfaced in the featured slot at the top of the console.

### Used by

- `src/App.tsx`
- `src/data/agents.test.ts`

## AGENT_CATEGORIES

**Kind:** `const`

```ts
const AGENT_CATEGORIES: AgentCategory[]
```

<!-- fill:sym:AGENT_CATEGORIES:summary -->
<FILL: 2-4 sentences explaining what AGENT_CATEGORIES does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:AGENT_CATEGORIES:summary -->

### Used by

- `src/components/AgentGrid.tsx`
- `src/data/agents.test.ts`

## Tests

| Suite | Test | Asserts |
| --- | --- | --- |
| agent catalogue | has at least one agent | <FILL: assertion summary> |
| agent catalogue | gives every agent a unique id | <FILL: assertion summary> |
| agent catalogue | includes the featured agent | <FILL: assertion summary> |
| agent catalogue | only uses known categories | <FILL: assertion summary> |
| agent catalogue | keeps success rates between 0 and 100 | <FILL: assertion summary> |
| agent catalogue | gives every agent a non-empty name and description | <FILL: assertion summary> |

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
