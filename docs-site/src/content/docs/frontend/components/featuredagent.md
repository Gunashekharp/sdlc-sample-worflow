---
title: FeaturedAgent
description: Highlighted card for the featured agent.
---

**File:** `src/components/FeaturedAgent.tsx`

A prominent hero card that showcases the featured agent (PR Reviewer) at the
top of the main content area. Displays the agent's name, status pill, full
description, a stat table, and a "Run agent" button. Has an accent gradient
background overlay.

## Internal subcomponent: `Stat`

```ts
function Stat({ label, value }: { label: string; value: string })
```

A simple `<div>` containing a `<dt>` (label) and `<dd>` (value) for use in a
`<dl>` stat list. Not exported.

| Prop | Type | Purpose |
|------|------|---------|
| `label` | `string` | Metric label, e.g. `"Runs · 7d"` |
| `value` | `string` | Formatted metric value, e.g. `"342"` |

## Component

```ts
export default function FeaturedAgent({ agent }: { agent: Agent })
```

| Prop | Type | Purpose |
|------|------|---------|
| `agent` | `Agent` | The agent to feature. Typically `AGENTS.find(a => a.id === FEATURED_AGENT_ID)`. |

**Returns:** A `<section>` element.

**Side effects:** None.

## Layout structure

```
<section rounded-lg border bg-surface overflow-hidden>
  ├── Gradient overlay div  (pointer-events-none, absolute)
  └── <div relative flex row>
        ├── Left column (min-w-0 flex-1)
        │     ├── Eyebrow  "✦ Featured agent"  (text-accent)
        │     ├── Title  "{agent.name}" + status pill
        │     │         StatusDot + STATUS_LABEL text
        │     ├── Description  (max-w-xl text-sm text-text-muted)
        │     └── <dl stat grid>
        │           ├── Stat "Runs · 7d" / runsPerWeek
        │           ├── Stat "Success" / successRate%
        │           ├── Stat "Avg run" / avgDuration
        │           └── Stat "Last run" / lastRun
        └── Right column (shrink-0)
              └── "Run agent ↑" button  (bg-accent)
```

## Gradient overlay

```tsx
<div
  className="pointer-events-none absolute inset-0"
  style={{
    background:
      'linear-gradient(135deg, var(--color-accent-subtle), transparent 55%)',
  }}
/>
```

An absolutely-positioned, non-interactive `<div>` that spans the full card.
Uses an inline `style` (not a Tailwind class) because arbitrary gradient values
cannot be expressed as static Tailwind utilities. `pointer-events-none` ensures
the overlay does not intercept clicks on the buttons below it.

The gradient uses `--color-accent-subtle` (`#2a0a1c`), a very dark pink,
fading to transparent toward the bottom-right.

## Status pill

```tsx
<span className="flex items-center gap-1.5 rounded-full border border-border
                 bg-bg/60 px-2 py-0.5 text-xs font-normal text-text-muted">
  <StatusDot status={agent.status} />
  {STATUS_LABEL[agent.status]}
</span>
```

A pill-shaped badge adjacent to the agent name. `bg-bg/60` provides a
semi-transparent dark background over the gradient overlay. The dot and the
human-readable label from `STATUS_LABEL` are shown together.

## Stat list

```tsx
<dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
  <Stat label="Runs · 7d" value={agent.runsPerWeek.toLocaleString()} />
  <Stat label="Success"   value={`${agent.successRate}%`} />
  <Stat label="Avg run"   value={agent.avgDuration} />
  <Stat label="Last run"  value={agent.lastRun} />
</dl>
```

Four stats in a wrapping flex row. `flex-wrap` allows them to reflow on narrow
screens. Uses a semantic `<dl>` (description list) with individual `<dt>` /
`<dd>` pairs.

## Run button

```tsx
<button type="button"
  className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm
             font-semibold text-white hover:bg-accent-hover">
  Run agent
  <IconArrowUp className="h-4 w-4" />
</button>
```

Uses the accent color (`#f70f79`) directly as the button background. Not wired
to any backend action.

## Used by

`App.tsx`:

```ts
const featured = AGENTS.find((a) => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]
// ...
<FeaturedAgent agent={featured} />
```

The fallback `?? AGENTS[0]` ensures rendering continues even if the
`FEATURED_AGENT_ID` constant is changed to a non-existent ID.
