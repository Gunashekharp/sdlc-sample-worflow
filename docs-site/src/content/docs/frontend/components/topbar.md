---
title: TopBar
---

`TopBar` is the 56px (`h-14`) header bar rendered at the top of the main content column. It displays a static breadcrumb trail, a search-trigger button (styled as a search input), and an environment switcher button. All three elements are visual-only stubs — none are wired to routing, search, or environment-switching logic.

**File:** `src/components/TopBar.tsx`

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `IconChevronDown` | `./icons` | Down chevron on the environment switcher |
| `IconSearch` | `./icons` | Magnifying-glass icon in the search button |

## Component signature

```ts
export default function TopBar(): JSX.Element
```

**Parameters:** None — pure layout component with no props.

**Returns:** A `<header>` element.

**Side effects:** None.

## Rendered structure

```
<header h-14 border-b border-border bg-bg px-4>
  ├── <div>    Breadcrumb  (flex items-center gap-2 text-sm)
  │     ├── <span>  "Agent Console"  (font-semibold)
  │     ├── <span>  "/"  (text-text-faint)
  │     └── <span>  "Overview"  (text-text-muted)
  ├── <button> Search trigger  (ml-auto w-72, styled as input)
  │     ├── <IconSearch />
  │     ├── <span>  "Search agents, runs, sessions…"  (flex-1 text-left)
  │     └── <kbd>  "⌘K"  (font-mono text-xs)
  └── <button> Environment switcher
        ├── <span>  Green status dot  (h-1.5 w-1.5 rounded-full bg-ok)
        ├── "Production"
        └── <IconChevronDown className="text-text-faint" />
```

## Breadcrumb

```tsx
<div className="flex items-center gap-2 text-sm">
  <span className="font-semibold">Agent Console</span>
  <span className="text-text-faint">/</span>
  <span className="text-text-muted">Overview</span>
</div>
```

A three-part static breadcrumb showing the current page hierarchy. The separator `/` is `text-text-faint` (tertiary colour) to visually de-emphasise it. The active page "Overview" is `text-text-muted` (secondary colour), subordinate to the app name `"Agent Console"` which is `font-semibold` (full weight).

:::note
This breadcrumb is not a `<nav>` or `<ol>` element and does not use `aria-label="Breadcrumb"`. A production accessibility implementation would use `<nav aria-label="Breadcrumb"><ol>…</ol></nav>` with `aria-current="page"` on the last item.
:::

## Search trigger button

```tsx
<button
  type="button"
  className="ml-auto flex w-72 items-center gap-2 rounded-md border border-border
             bg-surface px-2.5 py-1.5 text-sm text-text-faint
             hover:border-border-strong"
>
  <IconSearch />
  <span className="flex-1 text-left">Search agents, runs, sessions…</span>
  <kbd className="font-mono text-xs">⌘K</kbd>
</button>
```

A `<button>` styled to resemble a search input field. Design intent: clicking opens a command-palette/search modal (⌘K pattern), rather than providing an inline input.

| Class / attribute | Purpose |
|-------------------|---------|
| `ml-auto` | Pushes the search button to the far right, after the breadcrumb |
| `w-72` | Fixed 288px width |
| `flex items-center gap-2` | Horizontally aligns icon, label text, and kbd hint |
| `rounded-md border border-border bg-surface` | Input-like appearance |
| `hover:border-border-strong` | Visible hover affordance |
| `flex-1 text-left` | Label span stretches to fill available space; `text-left` prevents `<button>` center-alignment from affecting the text |
| `<kbd>` | Semantic element for keyboard shortcut; `font-mono text-xs` for monospaced display |

The `<IconSearch />` icon inherits `text-text-faint` from the button's text colour. No explicit `className` is passed to the icon.

:::note
The search button has no `aria-label`. Its accessible name is computed from its text content: the `<span>` text `"Search agents, runs, sessions…"` and the `<kbd>` text `"⌘K"`. This is acceptable but could be improved with `aria-label="Open search (⌘K)"` to provide a cleaner screen-reader announcement.
:::

## Environment switcher button

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

A button showing the current environment name (`"Production"`) with:
- A **green status dot** (`h-1.5 w-1.5`, 6×6px, `bg-ok`) indicating the environment is healthy/active. Note: this dot is slightly smaller than `StatusDot`'s 8×8px dots (`h-2 w-2`).
- A **down chevron** (`IconChevronDown`) signaling that clicking opens a dropdown to switch environments.

The button is a visual stub — no `onClick` and no dropdown are implemented.

:::note
The environment switcher has no `aria-label`. Its accessible name is `"Production"` (the visible text). If a dropdown were implemented, `aria-haspopup="listbox"` and `aria-expanded` would be required.
:::

## Outer `<header>` element

```tsx
<header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-bg px-4">
```

| Class | Purpose |
|-------|---------|
| `flex items-center` | Horizontal alignment of all three items |
| `h-14` | Fixed 56px height |
| `shrink-0` | Prevents the bar from being compressed when the parent flex column has insufficient height |
| `border-b border-border` | Bottom separator line between the top bar and the content area below |
| `bg-bg` | Page background colour (`--color-bg`) |
| `px-4` | 16px horizontal padding |
| `gap-4` | 16px gap between breadcrumb, search, and environment buttons |

`<header>` has an implicit ARIA landmark role of `banner`. This allows screen-reader users to navigate to the header directly.

## Styling notes

| Token / class | Element | Purpose |
|---------------|---------|---------|
| `bg-bg` | `<header>` | Page background |
| `border-border` | `<header>`, buttons | Neutral border colour |
| `bg-surface` | Search and env buttons | Slightly elevated surface |
| `hover:border-border-strong` | Search and env buttons | Border upgrade on hover |
| `text-text-faint` | `/` separator, `<kbd>`, `IconChevronDown` | Tertiary colour for decorative elements |
| `text-text-muted` | "Overview" span | Secondary text colour |
| `font-semibold` | "Agent Console" span | Bold app name |
| `bg-ok` | Env status dot | Green (`#3fb950`) indicates healthy environment |
| `font-mono` | `<kbd>` | Monospaced keyboard shortcut |

## Accessibility summary

| Element | Role | Accessible name |
|---------|------|-----------------|
| `<header>` | `banner` landmark | Implicit from element type |
| Search `<button>` | `button` | `"Search agents, runs, sessions… ⌘K"` (text content) |
| Env `<button>` | `button` | `"Production"` (text content) |

## Edge cases and assumptions

- **All content is static:** Breadcrumb, environment name, and all labels are hardcoded strings. No props or context is consumed.
- **No routing integration:** Clicking the breadcrumb items has no effect. A router integration would need to wrap the spans in `<a>` or `<Link>` elements with appropriate `href` values.
- **No search integration:** The search button's `onClick` is absent. A command-palette library (e.g. `cmdk`) would need to be wired to open on click and on the ⌘K global keydown listener.
- **`shrink-0` is essential:** If `shrink-0` were removed, the top bar could collapse in height when the main content area's flex layout overflows, breaking the fixed-height design.
- **`gap-4` between breadcrumb and search:** `ml-auto` on the search button pushes it to the right, but there will still be a `gap-4` (16px) between the environment button and the search button. Items after the `ml-auto` element share the same gap.
