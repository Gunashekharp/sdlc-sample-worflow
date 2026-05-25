---
title: StatusDot
description: Reference for `src/components/StatusDot.tsx`
---

**File:** `src/components/StatusDot.tsx` · **Lines:** 28

<FILL: 2-4 sentence plain-language summary of what `components/StatusDot.tsx` is responsible for, what other files it integrates with, and what calls into it.>

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `../data/agents` | `AgentStatus` | type-only · internal |


## Symbols

This file exports 2 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| StatusDot | component | yes |
| STATUS_LABEL | const | no |

## StatusDot (default export)

**Kind:** `component`

```ts
export default function StatusDot({ status }: { status: AgentStatus }) { ... }
```

> Small colored status indicator. The running state pulses in Snabbit pink.

### Props

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| status | `AgentStatus` | yes | <FILL: what does status control?> |

### Line-by-line walkthrough

Each top-level statement of `StatusDot`, in execution order. The line numbers reference the source file as it appears today.

**Line 11 — `IfStatement`**

```ts
if (status === 'running') {
    return (
      <span className="relative flex h-2 w-2" title={STATUS_LABEL.running}>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
    )
  }
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 20 — `FirstStatement`**

```ts
const color = status === 'attention' ? 'bg-warn' : 'bg-text-faint'
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 21 — `ReturnStatement`**

```ts
return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${color}`}
      title={STATUS_LABEL[status]}
    />
  )
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

### Examples

<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>

### Used by

- `src/components/FeaturedAgent.tsx`
- `src/components/AgentCard.tsx`

## STATUS_LABEL

**Kind:** `const`

```ts
const STATUS_LABEL: Record<AgentStatus, string>
```

<FILL: 2-4 sentences explaining what STATUS_LABEL does and why it exists. Ground every claim in the signature and source.>

### Used by

- `src/components/FeaturedAgent.tsx`

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `src/components/StatusDot.tsx` (28 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (28 lines)</summary>

````tsx
import type { AgentStatus } from '../data/agents'

export const STATUS_LABEL: Record<AgentStatus, string> = {
  running: 'Running',
  idle: 'Idle',
  attention: 'Needs attention',
}

/** Small colored status indicator. The running state pulses in Snabbit pink. */
export default function StatusDot({ status }: { status: AgentStatus }) {
  if (status === 'running') {
    return (
      <span className="relative flex h-2 w-2" title={STATUS_LABEL.running}>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
    )
  }

  const color = status === 'attention' ? 'bg-warn' : 'bg-text-faint'
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${color}`}
      title={STATUS_LABEL[status]}
    />
  )
}

````

</details>
