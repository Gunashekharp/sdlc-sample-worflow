---
title: Sidebar
description: Reference for `src/components/Sidebar.tsx`
---

<!-- structure:e2ed0126c373 -->

**File:** `src/components/Sidebar.tsx` · **Lines:** 117

<!-- fill:file:summary -->
`Sidebar.tsx` renders the console's fixed left navigation rail: a workspace switcher, a "New session" action, the primary nav links, a scrollable list of recent sessions, and a user footer. The nav items and recent sessions are defined as the module-level `NAV` and `RECENT_SESSIONS` constants, and each nav icon comes from `./icons` (typed via React's `ComponentType`/`SVGProps`). It takes no props and is mounted by `App.tsx`.
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `react` | `ComponentType`, `SVGProps` | type-only · external |
| `./icons` | `IconAgents`, `IconChevronDown`, `IconDashboard`, `IconIntegrations`, `IconPlus`, `IconRuns`, `IconSessions`, `IconSettings` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| Sidebar | component | yes |

## Sidebar (default export)

**Kind:** `component`

```ts
export default function Sidebar() { ... }
```

<!-- fill:sym:Sidebar:summary -->
`Sidebar` is a zero-prop, stateless component that draws the dashboard's navigation column. It iterates the static `NAV` array to render each link with its icon, highlighting the entry whose `active` flag is set (and marking it `aria-current="page"`), and iterates `RECENT_SESSIONS` to list recent work. It exists to give every page a consistent fixed-width rail for branding, primary navigation, and quick session access.
<!-- /fill:sym:Sidebar:summary -->

### Line-by-line walkthrough

Each top-level statement of `Sidebar`, in execution order. The line numbers reference the source file as it appears today.

**Line 37 — `ReturnStatement`**

```ts
return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-bg">
      <button
        type="button"
        className="flex h-14 items-center gap-2.5 border-b border-border px-3 text-left hover:bg-surface"
      >
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-sm font-bold text-white">
          S
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-tight">Snabbit</span>
          <span className="block text-xs leading-tight text-text-faint">Agent Console</span>
        </span>
        <IconChevronDown className="text-text-faint" />
      </button>

      <div className="p-3">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md border border-border-strong bg-surface-2 px-2.5 py-2 text-sm font-medium text-text-muted hover:border-accent hover:text-text"
        >
          <IconPlus className="text-accent" />
          New session
          <kbd className="ml-auto font-mono text-xs text-text-faint">⌘N</kbd>
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {NAV.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              type="button"
              aria-current={item.active ? 'page' : undefined}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm ${
                item.active
                  ? 'bg-surface-2 font-medium text-text'
                  : 'text-text-muted hover:bg-surface hover:text-text'
              }`}
            >
              <Icon className={item.active ? 'text-accent' : ''} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-1 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-text-faint">
          Recent sessions
        </p>
        <ul className="flex flex-col gap-0.5">
          {RECENT_SESSIONS.map((session) => (
            <li key={session}>
              <button
                type="button"
                className="block w-full truncate rounded px-2 py-1.5 text-left text-sm text-text-muted hover:bg-surface hover:text-text"
              >
                {session}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex h-14 items-center gap-2.5 border-t border-border px-3">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-3 text-xs font-semibold uppercase">
          g
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium leading-tight">guna</span>
          <span className="block truncate text-xs leading-tight text-text-faint">
            int-gunashekhar.p@snabbit.com
          </span>
        </span>
      </div>
    </aside>
  )
```

<!-- fill:sym:Sidebar:walk:0 -->
The single return builds the `<aside>` rail (fixed `w-60`, non-shrinking, right border). Top to bottom: a workspace-switcher button with the "S" badge, "Snabbit / Agent Console" labels, and `IconChevronDown`; a "New session" button with `IconPlus` and a `⌘N` `<kbd>`; a `<nav>` that maps over `NAV`, destructuring `const Icon = item.icon` per entry so the icon component can be rendered as `<Icon>`, applying active styling and `aria-current={item.active ? 'page' : undefined}` based on `item.active`; a scrollable "Recent sessions" section that maps `RECENT_SESSIONS` to truncated buttons keyed by the session string; and a footer with the user avatar, name, and email. There is no state or data fetching — it renders the two module constants directly.
<!-- /fill:sym:Sidebar:walk:0 -->

### Behavior

<!-- fill:sym:Sidebar:behavior -->
- The root `<aside className="flex w-60 shrink-0 flex-col border-r border-border bg-bg">` fixes the rail at 240px and prevents it from shrinking under flex pressure when the viewport narrows.
- The workspace switcher (top), Recent-sessions buttons, and footer have no `onClick` handlers — they are visual placeholders waiting for routing/state to be wired in.
- The "New session" button is styled with `border-border-strong` and a `⌘N` `<kbd>` hint; the keyboard shortcut itself is not implemented yet.
- The `<nav>` block iterates `NAV`, destructuring `const Icon = item.icon` so the icon component reference can be rendered as `<Icon>`. The active item (currently "Dashboard") gets `aria-current="page"`, the `bg-surface-2` active background, and the accent-coloured icon — all three signals are flipped together by the `item.active` flag.
- The recent-sessions list uses a fixed `RECENT_SESSIONS` string array. Each button has `truncate` so long session titles ellipsize rather than wrap, keeping rows uniform-height.
- The middle scroll region uses `min-h-0 flex-1 overflow-y-auto`, with `min-h-0` being the standard fix that lets a flex child actually shrink and scroll instead of being forced to its content height.
- The footer renders the hard-coded "guna" user — a stand-in until auth is hooked up.
<!-- /fill:sym:Sidebar:behavior -->

### Examples

<!-- fill:sym:Sidebar:example -->
```tsx
import Sidebar from './components/Sidebar'

// Fixed left rail in the app shell; takes no props.
<div className="flex h-screen">
  <Sidebar />
  <main>{/* page content */}</main>
</div>
```

This renders the six `NAV` links (with "Dashboard" highlighted as active) and the five `RECENT_SESSIONS` entries.
<!-- /fill:sym:Sidebar:example -->

### Used by

- `src/App.tsx`

## Diagrams

<!-- fill:file:diagrams -->
:::note
Static rail rendered from two module constants (`NAV` and `RECENT_SESSIONS`). The only conditional is the active-item styling — no control flow worth diagramming.
:::
<!-- /fill:file:diagrams -->
