---
title: AgentCard
---

`AgentCard` is a single-agent summary tile rendered inside `AgentGrid`. It is implemented as a `<button>` so that the entire card surface is keyboard-focusable and mouse-clickable without any extra wrapper element.

**File:** `src/components/AgentCard.tsx`

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `Agent` (type) | `../data/agents` | Full agent data shape |
| `StatusDot` | `./StatusDot` | Animated or static status indicator |

## Props interface

```ts
interface AgentCardProps {
  agent: Agent
  selected: boolean
  onSelect: (id: string) => void
}
```

### `agent: Agent`

The complete `Agent` data object. The `Agent` type is defined in `src/data/agents.ts`. Every field that `AgentCard` reads is documented below:

| Field | Type | How it is used |
|-------|------|----------------|
| `id` | `string` | Passed verbatim to `onSelect`; used as the React `key` in the parent grid |
| `name` | `string` | Displayed in the header row; clipped with `truncate` if it overflows |
| `status` | `AgentStatus` (`"running" \| "idle" \| "attention"`) | Forwarded to `StatusDot` |
| `category` | `string` | Rendered as a small badge on the far right of the header row |
| `description` | `string` | Free-text paragraph; clamped to two lines with `line-clamp-2` |
| `runsPerWeek` | `number` | Integer; formatted with `Number.toLocaleString()` for locale-aware thousands separators (e.g. `1,284`) |
| `successRate` | `number` | Integer 0–100; displayed as `{successRate}% ok` in the footer |
| `lastRun` | `string` | Human-readable relative time string, e.g. `"2h ago"`; displayed in the footer |

### `selected: boolean`

Controls the card's visual selection state.

- `true` — accent-coloured border (`border-accent`) plus a 1-pixel inset ring (`ring-1 ring-accent`), creating a double-highlight effect.
- `false` — neutral border (`border-border`) with hover upgrades (`hover:border-border-strong hover:bg-surface-2`).

### `onSelect: (id: string) => void`

Callback invoked inside the button's `onClick` handler as `onSelect(agent.id)`. The parent (`AgentGrid`) stores the selected ID in its own state and passes it back down as the `selected` prop.

`AgentCard` never toggles or deselects; it always calls `onSelect` with the same ID. Toggle logic is the responsibility of the parent.

## Component signature

```ts
export default function AgentCard({ agent, selected, onSelect }: AgentCardProps): JSX.Element
```

**Returns:** A `<button>` element.

**Side effects:** None. Calls `onSelect` on user interaction but does not manage its own selection state.

## Rendered structure

```
<button type="button" aria-pressed={selected}>
  ├── <div>                  Header row
  │     ├── <StatusDot status={agent.status} />
  │     ├── <span>           Agent name (truncate)
  │     └── <span>           Category badge (ml-auto, shrink-0)
  ├── <p>                    Description (line-clamp-2)
  └── <div>                  Footer stats row (mt-auto)
        ├── <span>           "{runsPerWeek.toLocaleString()} runs/wk"
        ├── <span>           "{successRate}% ok"
        └── <span>           "{lastRun}"  (ml-auto)
</button>
```

## Accessibility

| Attribute | Element | Value | Purpose |
|-----------|---------|-------|---------|
| `type="button"` | `<button>` | `"button"` | Prevents accidental form submission when the card is inside a `<form>` |
| `aria-pressed` | `<button>` | `selected` prop (`true`/`false`) | Communicates toggle state to screen readers; the button is announced as "pressed" or "not pressed" |

The `<button>` element with `aria-pressed` is the recommended ARIA pattern for toggle buttons. Screen readers such as VoiceOver and NVDA will announce the state change when the button is activated.

`StatusDot` contributes a `title` attribute on its inner `<span>`, which provides a mouse-hover tooltip and is readable by some assistive technologies, though `title` is not a reliable substitute for visible text.

`text-left` overrides the default center alignment that browsers apply to `<button>` elements, so the card content reads naturally left-to-right.

## State and effects

`AgentCard` is fully stateless. It receives all display data and selection state from its parent via props.

## Styling

### Root button

```
flex h-full flex-col gap-2 rounded-lg border bg-surface p-3.5 text-left transition-colors
```

| Class | Reason |
|-------|--------|
| `flex flex-col gap-2` | Vertical stack with 8px gaps between header, description, and footer |
| `h-full` | Stretches the card to fill its grid cell height so cards in a row are visually aligned |
| `rounded-lg` | Consistent 8px border radius matching the design system |
| `bg-surface` | Card background: `--color-surface` (slightly elevated above page background) |
| `p-3.5` | 14px inner padding on all sides |
| `text-left` | Overrides `<button>` default `text-align: center` |
| `transition-colors` | Animates border and background colour changes during hover and selection |

### Selection variant

```
selected === true:   border-accent ring-1 ring-accent
selected === false:  border-border hover:border-border-strong hover:bg-surface-2
```

### Header row

| Class | Purpose |
|-------|---------|
| `flex items-center gap-2` | Horizontal alignment with 8px gaps |
| `truncate` on name `<span>` | Clips long names with `…` at the container boundary |
| `ml-auto shrink-0` on badge `<span>` | Pushes the badge to the far right; `shrink-0` prevents compression |
| `rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted` | Chip/badge styling |

### Description

| Class | Purpose |
|-------|---------|
| `line-clamp-2` | Clamps to 2 lines with trailing ellipsis (requires Tailwind v3.3+ or `@tailwindcss/line-clamp`) |
| `text-xs text-text-muted` | Subdued secondary text colour |

### Footer row

| Class | Purpose |
|-------|---------|
| `mt-auto` | Pushes footer to the bottom of the flex column regardless of description length |
| `pt-1` | 4px top padding separates footer visually from description |
| `font-mono text-[11px] text-text-faint` | Monospaced numbers align cleanly; faint colour is tertiary hierarchy |
| `ml-auto` on last `<span>` | Right-aligns the last-run timestamp |

## Design tokens used

| Token | CSS variable | Used for |
|-------|-------------|----------|
| `bg-surface` | `--color-surface` | Card background |
| `border-border` | `--color-border` | Default card border |
| `border-accent` | `--color-accent` | Selected card border |
| `ring-accent` | `--color-accent` | Selected card ring |
| `hover:border-border-strong` | `--color-border-strong` | Hover border upgrade |
| `hover:bg-surface-2` | `--color-surface-2` | Hover background upgrade |
| `text-text-muted` | `--color-text-muted` | Category badge and description text |
| `text-text-faint` | `--color-text-faint` | Footer stats |

## Edge cases and assumptions

- **Long names:** `truncate` clips them, but the category badge has `shrink-0` so it is never squeezed — only the name is clipped.
- **`runsPerWeek = 0`:** `(0).toLocaleString()` returns `"0"`, so the footer reads `"0 runs/wk"`. Valid output.
- **`successRate` out of range:** No clamping is applied. If the data layer provides a value outside 0–100 it will be rendered verbatim. Data validation belongs to the data layer.
- **Re-clicking a selected card:** `onSelect` is always called with the same `id`. There is no deselect path in `AgentCard`; implementing toggle behaviour requires the parent to check whether the clicked ID is already selected.
- **`h-full` requires grid cell height:** The class only has visible effect when the parent grid cell has a defined height or uses `align-items: stretch` (the default for CSS Grid). If `AgentGrid` ever changes its layout to flexbox with `align-items: flex-start`, all cards will collapse to their content height and `h-full` will have no effect.
- **`onSelect` reference stability:** The component does not use `React.memo`. If it is ever memoised, the parent should wrap `onSelect` in `useCallback` to avoid unnecessary re-renders.
