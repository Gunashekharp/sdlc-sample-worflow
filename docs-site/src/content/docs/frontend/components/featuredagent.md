---
title: FeaturedAgent
---

`FeaturedAgent` is a prominent hero card displayed at the top of the main content area. It showcases the single "featured" agent with its full name, live status, description, a stat grid, and a "Run agent" call-to-action button. A diagonal accent gradient overlays the card background for visual emphasis.

**File:** `src/components/FeaturedAgent.tsx`

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `Agent` (type) | `../data/agents` | Full agent data shape |
| `IconArrowUp`, `IconSparkle` | `./icons` | Run-button arrow; featured eyebrow star |
| `StatusDot` | `./StatusDot` | Animated/static status dot inside the status pill |
| `STATUS_LABEL` | `./StatusDot` | Human-readable label map (`running → "Running"`, etc.) |

## Internal subcomponent: `Stat`

```ts
function Stat({ label, value }: { label: string; value: string }): JSX.Element
```

Not exported. Renders a single label/value pair inside the `<dl>` stat list.

| Prop | Type | Purpose |
|------|------|---------|
| `label` | `string` | Metric name, e.g. `"Runs · 7d"`, `"Success"`, `"Avg run"`, `"Last run"` |
| `value` | `string` | Pre-formatted metric value, e.g. `"1,284"`, `"96%"`, `"3m 12s"` |

**Rendered structure:**

```tsx
<div>
  <dt className="text-xs text-text-faint">{label}</dt>
  <dd className="font-mono font-medium">{value}</dd>
</div>
```

`<dt>` (description term) carries the metric label at a subdued size and colour. `<dd>` (description detail) renders the value in a monospaced, medium-weight font. This semantic HTML pairs naturally with the parent `<dl>`.

## Component signature

```ts
export default function FeaturedAgent({ agent }: { agent: Agent }): JSX.Element
```

| Prop | Type | Purpose |
|------|------|---------|
| `agent` | `Agent` | The agent to feature. Passed by `App.tsx` as `AGENTS.find(a => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]`. |

**Returns:** A `<section>` element.

**Side effects:** None. The "Run agent" button is not wired to any backend action.

## Agent fields consumed

| Field | Type | Where used |
|-------|------|------------|
| `name` | `string` | `<h2>` heading |
| `status` | `AgentStatus` | `StatusDot` + `STATUS_LABEL` lookup in the status pill |
| `description` | `string` | `<p>` below the heading |
| `runsPerWeek` | `number` | `Stat` — formatted with `toLocaleString()` |
| `successRate` | `number` | `Stat` — rendered as `${successRate}%` |
| `avgDuration` | `string` | `Stat` — pre-formatted string (e.g. `"3m 12s"`) |
| `lastRun` | `string` | `Stat` — pre-formatted relative time (e.g. `"1h ago"`) |

## Rendered structure

```
<section relative overflow-hidden rounded-lg border border-border bg-surface>
  ├── <div>  Gradient overlay (pointer-events-none, absolute, inset-0)
  └── <div>  Content (relative, flex row on sm+)
        ├── Left column (min-w-0 flex-1)
        │     ├── <p>  "✦ Featured agent" eyebrow  (text-accent uppercase)
        │     ├── <h2>  "{agent.name}" + status pill
        │     │     └── <span>  Status pill
        │     │           ├── <StatusDot status={agent.status} />
        │     │           └── {STATUS_LABEL[agent.status]}
        │     ├── <p>  {agent.description}  (max-w-xl text-sm text-text-muted)
        │     └── <dl>  Stats grid (flex-wrap gap-x-6 gap-y-1)
        │           ├── <Stat label="Runs · 7d" value={runsPerWeek.toLocaleString()} />
        │           ├── <Stat label="Success"   value={`${successRate}%`} />
        │           ├── <Stat label="Avg run"   value={agent.avgDuration} />
        │           └── <Stat label="Last run"  value={agent.lastRun} />
        └── Right column (shrink-0)
              └── <button>  "Run agent ↑"
```

## Gradient overlay

```tsx
<div
  className="pointer-events-none absolute inset-0"
  style={{
    background: 'linear-gradient(135deg, var(--color-accent-subtle), transparent 55%)',
  }}
/>
```

An absolutely positioned, full-bleed overlay that sits behind the content (both share the same `relative` parent; the overlay comes first in DOM order so it is painted beneath). Key details:

- **Inline `style`** — Arbitrary gradient values cannot be expressed as static Tailwind utilities without extending the config, so a CSS `style` prop is used.
- **`var(--color-accent-subtle)`** — A very dark desaturated pink (e.g. `#2a0a1c`) that provides a subtle colour tint without obscuring the content.
- **`transparent 55%`** — The gradient fades to fully transparent by 55% of the diagonal, so the right/bottom portion of the card has no tint at all.
- **`pointer-events-none`** — The overlay must not intercept mouse or touch events. Without this, clicks on the left side of the card (where the gradient is most opaque) would be blocked.
- **`absolute inset-0`** — Stretches to all four edges of the `relative` `<section>`.

## Status pill

```tsx
<span className="flex items-center gap-1.5 rounded-full border border-border
                 bg-bg/60 px-2 py-0.5 text-xs font-normal text-text-muted">
  <StatusDot status={agent.status} />
  {STATUS_LABEL[agent.status]}
</span>
```

A pill-shaped badge rendered inline in the `<h2>` heading. The dot and the text label from `STATUS_LABEL` appear side by side. `bg-bg/60` applies the page background colour at 60% opacity, creating a semi-transparent dark backdrop that keeps the pill readable even when the gradient overlay is visible behind it.

`STATUS_LABEL` is imported from `StatusDot.tsx` and contains:

| Key | Value |
|-----|-------|
| `running` | `"Running"` |
| `idle` | `"Idle"` |
| `attention` | `"Needs attention"` |

## Eyebrow label

```tsx
<p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent">
  <IconSparkle className="h-3.5 w-3.5" />
  Featured agent
</p>
```

A small label above the agent name using `text-accent` (Snabbit pink) with `uppercase tracking-wide` for a badge-like appearance. `IconSparkle` is a filled four-point star rendered without a stroke.

## Stat list

```tsx
<dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
  <Stat label="Runs · 7d" value={agent.runsPerWeek.toLocaleString()} />
  <Stat label="Success"   value={`${agent.successRate}%`} />
  <Stat label="Avg run"   value={agent.avgDuration} />
  <Stat label="Last run"  value={agent.lastRun} />
</dl>
```

Four `Stat` items in a wrapping flex row. `flex-wrap` allows reflow on narrow viewports. The `<dl>` / `<dt>` / `<dd>` semantic structure communicates to screen readers that each item is a key-value pair.

## Run button

```tsx
<button
  type="button"
  className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm
             font-semibold text-white hover:bg-accent-hover"
>
  Run agent
  <IconArrowUp className="h-4 w-4" />
</button>
```

Uses the accent colour (`--color-accent`) as the button background with a `hover:bg-accent-hover` upgrade. `text-white` is hardcoded (not a design token) because the accent pink provides sufficient contrast against white regardless of theme.

:::caution
The "Run agent" button is currently a visual stub. It has no `onClick` handler and does not trigger any backend action. Backend wiring is a future implementation task.
:::

## Layout responsiveness

| Breakpoint | Layout |
|-----------|--------|
| Default (mobile) | Content column is a single vertical flex column |
| `sm` (≥ 640px) | Content becomes `flex-row` with `items-center`; the Run button aligns vertically with the stat list |

## Styling notes

| Token / class | Where applied | Purpose |
|---------------|--------------|---------|
| `bg-surface` | `<section>` | Card background |
| `border-border` | `<section>` | Card border |
| `overflow-hidden` | `<section>` | Clips the gradient overlay to the card's rounded corners |
| `rounded-lg` | `<section>` | Consistent 8px radius |
| `text-accent` | Eyebrow `<p>` | Snabbit pink for the "Featured agent" label |
| `bg-accent` | Run `<button>` | Solid accent background |
| `hover:bg-accent-hover` | Run `<button>` | Darker accent on hover |
| `bg-bg/60` | Status pill | Semi-transparent dark background |
| `font-mono font-medium` | `<dd>` in `Stat` | Monospaced metric values |
| `text-text-faint` | `<dt>` in `Stat` | Subdued label colour |
| `text-text-muted` | Description `<p>` | Secondary text colour |

## Accessibility

No explicit ARIA roles are added beyond the implicit `<section>` region landmark. The `<h2>` provides the heading level. The `<dl>` / `<dt>` / `<dd>` structure is semantically correct for key-value pairs. `StatusDot` adds `title` on its `<span>`.

:::note
The `<section>` element does not have an `aria-label` or `aria-labelledby` attribute. Screen readers may not expose it as a named landmark. Adding `aria-labelledby` pointing to the `<h2>` id would improve landmark navigation.
:::

## Edge cases and assumptions

- **`agent` is always defined:** `App.tsx` provides a `?? AGENTS[0]` fallback so `FeaturedAgent` never receives `undefined`.
- **`avgDuration` is a string:** Unlike `runsPerWeek` (formatted inline with `toLocaleString()`), `avgDuration` is expected to arrive pre-formatted from the data layer. No formatting is applied in the component.
- **`successRate` formatting:** `${agent.successRate}%` does not call `toLocaleString()`. Fractional success rates (e.g. `96.4`) will display with a decimal point.
- **Gradient not IE11-compatible:** `linear-gradient` with CSS custom properties requires a modern browser. This is acceptable given the project's Vite/modern-browser target.
