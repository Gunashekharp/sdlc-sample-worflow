---
title: TopBar
description: Reference for `src/components/TopBar.tsx`
---

<!-- structure:379cd71837e0 -->

**File:** `src/components/TopBar.tsx` · **Lines:** 32

<!-- fill:file:summary -->
`TopBar.tsx` renders the dashboard's header bar: a breadcrumb ("Agent Console / Overview"), a global search trigger with a `⌘K` shortcut hint, and an environment switcher showing the current environment ("Production"). It uses `IconSearch` and `IconChevronDown` from `./icons`, takes no props, and is mounted by `App.tsx` alongside the `Sidebar`.
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `./icons` | `IconChevronDown`, `IconSearch` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| TopBar | component | yes |

## TopBar (default export)

**Kind:** `component`

```ts
export default function TopBar() { ... }
```

<!-- fill:sym:TopBar:summary -->
`TopBar` is a zero-prop, stateless presentational component that draws the fixed-height header `<header>`. It shows the page breadcrumb, a search button styled as an input with `IconSearch` and a `⌘K` `<kbd>` hint, and an environment selector with a green status dot, the "Production" label, and `IconChevronDown`. The buttons are visual placeholders (no handlers wired) and the component exists to give every page a consistent top chrome.
<!-- /fill:sym:TopBar:summary -->

### Line-by-line walkthrough

Each top-level statement of `TopBar`, in execution order. The line numbers reference the source file as it appears today.

**Line 4 — `ReturnStatement`**

```ts
return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-bg px-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">Agent Console</span>
        <span className="text-text-faint">/</span>
        <span className="text-text-muted">Overview</span>
      </div>

      <button
        type="button"
        className="ml-auto flex w-72 items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text-faint hover:border-border-strong"
      >
        <IconSearch />
        <span className="flex-1 text-left">Search agents, runs, sessions…</span>
        <kbd className="font-mono text-xs">⌘K</kbd>
      </button>

      <button
        type="button"
        className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm hover:border-border-strong"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ok" />
        Production
        <IconChevronDown className="text-text-faint" />
      </button>
    </header>
  )
```

<!-- fill:sym:TopBar:walk:0 -->
The single return renders a flex `<header>` of fixed height (`h-14`) with a bottom border. The leading `<div>` is the breadcrumb ("Agent Console" / "Overview"). An `ml-auto` search `<button>` pushes itself and the following items to the right; it contains `IconSearch`, the "Search agents, runs, sessions…" placeholder text, and a `⌘K` `<kbd>` to advertise the shortcut. The final environment `<button>` shows a green `bg-ok` dot, the "Production" label, and `IconChevronDown` to signal it is a dropdown. The markup is static with no state or handlers.
<!-- /fill:sym:TopBar:walk:0 -->

### Behavior

<!-- fill:sym:TopBar:behavior -->
- The root `<header>` is a 56px-tall (`h-14`) flex row with a bottom border. `shrink-0` keeps it the same height when the column's `<main>` grows.
- The breadcrumb is plain spans: a semibold "Agent Console", a faint `/`, and a muted "Overview". There is no router yet — the second crumb is hard-coded.
- The search trigger is an `ml-auto` `<button>`, which both right-aligns it and pushes the env switcher further right. It is styled to look like a search input but does nothing on click; the `⌘K` `<kbd>` is just a hint that the global palette is planned.
- The environment switcher uses a small `bg-ok` dot (the same colour as the `passing` status) followed by "Production" and a chevron — visually indicating it is a dropdown, but again with no handler.
- No `aria-label` or `role` is added; the elements are native `<button>`/`<kbd>`/`<header>` and screen readers already announce them correctly. The chevron and search icons are decorative (`aria-hidden="true"` is set inside the icon `Svg` wrapper).
- The component is intentionally trivial because the planned interactions (real search, env switching) belong in features that don't exist yet.
<!-- /fill:sym:TopBar:behavior -->

### Examples

<!-- fill:sym:TopBar:example -->
```tsx
import TopBar from './components/TopBar'

// Header of the main content column; takes no props.
<div className="flex flex-col flex-1">
  <TopBar />
  <main>{/* page content */}</main>
</div>
```

This renders the "Agent Console / Overview" breadcrumb, the `⌘K` search button, and the "Production" environment switcher.
<!-- /fill:sym:TopBar:example -->

### Used by

- `src/App.tsx`

## Diagrams

<!-- fill:file:diagrams -->
:::note
Three static elements — breadcrumb, search button, env switcher — with no state, no handlers, no branches. Nothing worth diagramming.
:::
<!-- /fill:file:diagrams -->
