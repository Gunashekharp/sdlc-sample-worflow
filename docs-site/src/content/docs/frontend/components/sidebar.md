---
title: Sidebar
---

`Sidebar` is the 240px fixed left navigation column. It renders the workspace switcher, a New Session button, the primary navigation list, a scrollable recent-sessions list, and a user footer. It is a fully static component: no props, no state, no network calls.

**File:** `src/components/Sidebar.tsx`

## Dependencies

| Import | Source | Purpose |
|--------|--------|---------|
| `ComponentType`, `SVGProps` | `react` | Type for icon components stored in `NavItem` |
| `IconAgents`, `IconChevronDown`, `IconDashboard`, `IconIntegrations`, `IconPlus`, `IconRuns`, `IconSessions`, `IconSettings` | `./icons` | All icons used across the sidebar |

## Component signature

```ts
export default function Sidebar(): JSX.Element
```

**Parameters:** None.

**Returns:** An `<aside>` element.

**Side effects:** None.

## Internal data structures

### `NavItem` interface

```ts
interface NavItem {
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  active?: boolean
}
```

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `label` | `string` | Yes | Display text and React `key` |
| `icon` | `ComponentType<SVGProps<SVGSVGElement>>` | Yes | Icon component from `icons.tsx`; stored as a value so it can be rendered dynamically |
| `active` | `boolean` | No | Whether this item represents the current page; defaults to `undefined` (falsy) |

### `NAV` constant

```ts
const NAV: NavItem[] = [
  { label: 'Dashboard',    icon: IconDashboard,    active: true },
  { label: 'Sessions',     icon: IconSessions },
  { label: 'Agents',       icon: IconAgents },
  { label: 'Runs',         icon: IconRuns },
  { label: 'Integrations', icon: IconIntegrations },
  { label: 'Settings',     icon: IconSettings },
]
```

Six navigation items at module level (not inside the component function, so the array reference is stable across renders). `Dashboard` is the only active item at this time. All other items are visual stubs — their click handlers have no routing wiring.

### `RECENT_SESSIONS` constant

```ts
const RECENT_SESSIONS = [
  'Fix flaky checkout test',
  'Q2 dependency sweep',
  'Incident #482 root cause',
  'Release 4.19 changelog',
  'Migration lock review',
]
```

Five static recent-session label strings at module level. These are display-only mock data. Clicking a session button has no effect.

## Rendered structure

```
<aside w-60 flex flex-col border-r border-border bg-bg>
  ├── Workspace switcher button  (h-14 border-b)
  │     ├── "S" avatar  (h-7 w-7 rounded-md bg-accent text-white font-bold)
  │     ├── <span>  Text stack
  │     │     ├── "Snabbit"  (text-sm font-semibold)
  │     │     └── "Agent Console"  (text-xs text-text-faint)
  │     └── <IconChevronDown className="text-text-faint" />
  │
  ├── New session section  (p-3)
  │     └── <button>  "New session"  (border-border-strong bg-surface-2)
  │           ├── <IconPlus className="text-accent" />
  │           ├── "New session"
  │           └── <kbd>  "⌘N"  (ml-auto font-mono text-xs text-text-faint)
  │
  ├── <nav>  Primary nav  (flex flex-col gap-0.5 px-2)
  │     └── {NAV.map} <button aria-current={active ? 'page' : undefined}>
  │           ├── <Icon className={active ? 'text-accent' : ''} />
  │           └── {item.label}
  │
  ├── Recent sessions section  (mt-5 flex-1 min-h-0 overflow-y-auto px-3)
  │     ├── <p>  "RECENT SESSIONS"  (text-[11px] uppercase tracking-wide text-text-faint)
  │     └── <ul>
  │           └── {RECENT_SESSIONS.map} <li><button>{session}</button></li>
  │
  └── User footer  (h-14 border-t border-border)
        ├── "g" avatar  (h-7 w-7 rounded-full bg-surface-3 text-xs font-semibold uppercase)
        └── <span>  Text stack
              ├── "guna"  (text-sm font-medium)
              └── "int-gunashekhar.p@snabbit.com"  (text-xs text-text-faint truncate)
```

## Workspace switcher

```tsx
<button type="button"
  className="flex h-14 items-center gap-2.5 border-b border-border px-3 text-left hover:bg-surface">
  <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-sm font-bold text-white">
    S
  </span>
  <span className="min-w-0 flex-1">
    <span className="block text-sm font-semibold leading-tight">Snabbit</span>
    <span className="block text-xs leading-tight text-text-faint">Agent Console</span>
  </span>
  <IconChevronDown className="text-text-faint" />
</button>
```

- The "S" avatar uses `grid place-items-center` to centre the letter inside the square.
- `bg-accent` (Snabbit pink) on the avatar provides a brand-coloured workspace icon.
- `min-w-0 flex-1` on the text stack prevents the `<span>` from overflowing the flex row.
- `IconChevronDown` in `text-text-faint` signals that this button opens a workspace switcher dropdown (not yet implemented).

## New session button

```tsx
<div className="p-3">
  <button type="button"
    className="flex w-full items-center gap-2 rounded-md border border-border-strong
               bg-surface-2 px-2.5 py-2 text-sm font-medium text-text-muted
               hover:border-accent hover:text-text">
    <IconPlus className="text-accent" />
    New session
    <kbd className="ml-auto font-mono text-xs text-text-faint">⌘N</kbd>
  </button>
</div>
```

- `w-full` stretches the button across the full sidebar width minus padding.
- `border-border-strong` and `bg-surface-2` give the button slightly more visual weight than the surrounding surface.
- `hover:border-accent` upgrades the border to accent pink on hover, providing a prominent interactive affordance.
- The `<kbd>` element is semantically correct for keyboard shortcut hints. `ml-auto` right-aligns it.
- The button is a stub — no `onClick` or routing wired.

## Nav item rendering

```tsx
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
```

**Capitalization pattern:** `item.icon` is a `ComponentType`, which must be assigned to a capitalized variable (`const Icon = item.icon`) before use in JSX. If used directly as `<item.icon />`, React would treat it as a custom HTML element rather than a React component.

**Active item styles:** `bg-surface-2 font-medium text-text` with `text-accent` on the icon.

**Inactive item styles:** `text-text-muted` with hover upgrade to `bg-surface text-text`.

**Accessibility:** `aria-current="page"` on the active button communicates the current page to screen readers. `undefined` (not `false`) is used for inactive items — setting `aria-current={false}` would still announce "not current page" to some screen readers, which is noisy. `undefined` omits the attribute entirely.

## Recent sessions section

```tsx
<div className="mt-5 min-h-0 flex-1 overflow-y-auto px-3">
  <p className="px-1 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-text-faint">
    Recent sessions
  </p>
  <ul className="flex flex-col gap-0.5">
    {RECENT_SESSIONS.map((session) => (
      <li key={session}>
        <button type="button"
          className="block w-full truncate rounded px-2 py-1.5 text-left text-sm
                     text-text-muted hover:bg-surface hover:text-text">
          {session}
        </button>
      </li>
    ))}
  </ul>
</div>
```

**Scrollable flex child pattern:** `min-h-0 flex-1 overflow-y-auto` is a standard pattern for a scrollable flex child:
- `flex-1` allows the section to grow and fill the remaining vertical space in the `<aside>` flex column.
- `min-h-0` overrides flexbox's default `min-height: auto`, which would otherwise prevent the section from shrinking below its content height and block `overflow-y-auto` from activating.
- `overflow-y-auto` adds a scrollbar only when the session list is taller than the available space.

Session buttons use `truncate` to clip long session names. `block w-full` makes the entire row clickable. `text-left` overrides `<button>` centre alignment.

## User footer

```tsx
<div className="flex h-14 items-center gap-2.5 border-t border-border px-3">
  <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-3
                   text-xs font-semibold uppercase">
    g
  </span>
  <span className="min-w-0 flex-1">
    <span className="block text-sm font-medium leading-tight">guna</span>
    <span className="block truncate text-xs leading-tight text-text-faint">
      int-gunashekhar.p@snabbit.com
    </span>
  </span>
</div>
```

- `rounded-full` vs `rounded-md` on the workspace switcher avatar — the user avatar is circular (person), the workspace avatar is square (brand/app).
- `bg-surface-3` is a more elevated surface for the user avatar background.
- `uppercase` on the `"g"` initial is a CSS text-transform, not a hardcoded uppercase character. The displayed letter would auto-uppercase any lowercase initial.
- `truncate` on the email prevents long email addresses from overflowing.
- `min-w-0 flex-1` on the text stack prevents the stack from overflowing the fixed-width sidebar.
- The footer is a `<div>`, not a `<button>`. Clicking the footer has no effect (no user-settings dropdown wired).

## Accessibility

| Attribute | Element | Value | Purpose |
|-----------|---------|-------|---------|
| `aria-current` | Active nav `<button>` | `"page"` | Announces the current page to screen readers |
| `type="button"` | All `<button>`s | `"button"` | Prevents accidental form submission |

The `<aside>` element has an implicit `complementary` ARIA landmark role. Screen readers can navigate to it directly. It does not have an explicit `aria-label` — if multiple sidebars exist on a page, adding `aria-label="Main navigation"` would differentiate them.

## Styling notes

| Token / class | Element | Purpose |
|---------------|---------|---------|
| `w-60` | `<aside>` | Fixed 240px sidebar width |
| `bg-bg` | `<aside>` | Page background (not elevated) |
| `border-r border-border` | `<aside>` | Right-edge separator from main content |
| `bg-accent` | Workspace avatar | Brand pink avatar background |
| `bg-surface-2` | Active nav item, New session button | Elevated surface for active/prominent elements |
| `bg-surface-3` | User avatar | Further elevated surface for avatar badge |
| `text-accent` | Active nav icon, `IconPlus` | Accent colour for interactive emphasis |
| `text-text-faint` | Labels, `IconChevronDown`, `<kbd>` | Tertiary text for decorative / supplementary elements |
| `text-text-muted` | Inactive nav items, session buttons | Secondary text |
| `text-text` | Active nav label, hover states | Full-contrast primary text |

## Edge cases and assumptions

- **Static active state:** The `active` flag is hardcoded on the `Dashboard` item in `NAV`. There is no routing integration — navigating to other sections does not update the active state. Wiring to a router would require replacing the static `active` field with a comparison against the current route.
- **Static session list:** `RECENT_SESSIONS` is hardcoded. A real implementation would fetch sessions from the backend and manage this list dynamically.
- **Hardcoded user:** The user name and email in the footer are hardcoded strings. A real implementation would read from an auth context or user session.
- **No keyboard shortcut wiring:** The `⌘N` hint on the New Session button is decorative only. No global `keydown` listener is registered.
- **Sidebar is always visible:** There is no mobile drawer/overlay version of the sidebar. On narrow viewports the sidebar takes 240px of horizontal space, which may push main content off-screen. A responsive implementation would need a toggle mechanism.
