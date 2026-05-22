---
title: TopBar
description: The header bar at the top of the main content column.
---

**File:** `src/components/TopBar.tsx`

The 56px (`h-14`) header bar rendered above the main scrollable area. Shows a
breadcrumb, a global search button, and an environment switcher. All interactive
elements are currently visual-only stubs.

## Component

```ts
export default function TopBar()
```

**Parameters:** None — pure layout component with no props.

**Returns:** A `<header>` element.

**Side effects:** None.

## Layout structure

```
<header h-14>
  ├── Breadcrumb  "Agent Console / Overview"
  ├── Search button  (⌘K)  [ml-auto, w-72]
  └── Environment switcher  "● Production  ˅"
```

### Breadcrumb

```tsx
<div className="flex items-center gap-2 text-sm">
  <span className="font-semibold">Agent Console</span>
  <span className="text-text-faint">/</span>
  <span className="text-text-muted">Overview</span>
</div>
```

Static text showing the current section path. The active page ("Overview") is
rendered in `text-text-muted` (secondary color) to distinguish it from the
app name.

### Search button

```tsx
<button
  type="button"
  className="ml-auto flex w-72 items-center gap-2 rounded-md border border-border
             bg-surface px-2.5 py-1.5 text-sm text-text-faint hover:border-border-strong"
>
  <IconSearch />
  <span className="flex-1 text-left">Search agents, runs, sessions…</span>
  <kbd className="font-mono text-xs">⌘K</kbd>
</button>
```

A button styled as a search input. The `ml-auto` pushes it to the right of the
breadcrumb. Not wired to any search functionality.

### Environment switcher

```tsx
<button
  type="button"
  className="flex items-center gap-2 rounded-md border border-border bg-surface
             px-2.5 py-1.5 text-sm hover:border-border-strong"
>
  <span className="h-1.5 w-1.5 rounded-full bg-ok" />
  Production
  <IconChevronDown className="text-text-faint" />
</button>
```

A button showing a green status dot (`bg-ok`, `#3fb950`) and the label
"Production". Not wired to environment switching.

## Styling

The bar sits on `bg-bg` (`#0a0a0b`) with a `border-b border-border` bottom
divider. `shrink-0` prevents it from being compressed when the content area
below overflows.

## Used by

`App.tsx` — rendered as the first element inside the right-hand flex column,
above the scrollable `<main>` region.
