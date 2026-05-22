---
title: Sidebar
description: The fixed left navigation column.
---

**File:** `src/components/Sidebar.tsx`

The 240px (`w-60`) fixed left navigation column. Renders the workspace
switcher, a New Session button, the primary navigation list, recent sessions,
and a user footer.

## Component

```ts
export default function Sidebar()
```

**Parameters:** None.

**Returns:** An `<aside>` element.

**Side effects:** None.

## Internal data

### `NavItem` interface

```ts
interface NavItem {
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  active?: boolean
}
```

| Field | Type | Purpose |
|-------|------|---------|
| `label` | `string` | Nav label text |
| `icon` | `ComponentType<SVGProps<SVGSVGElement>>` | Icon component from `icons.tsx` |
| `active` | `boolean?` | Whether this item is the current page |

### `NAV` (module-level constant)

```ts
const NAV: NavItem[] = [
  { label: 'Dashboard', icon: IconDashboard, active: true },
  { label: 'Sessions',  icon: IconSessions },
  { label: 'Agents',    icon: IconAgents },
  { label: 'Runs',      icon: IconRuns },
  { label: 'Integrations', icon: IconIntegrations },
  { label: 'Settings',  icon: IconSettings },
]
```

Six navigation items. Dashboard is the only active item — the rest are
unimplemented stubs. Navigation clicks are not wired to routing.

### `RECENT_SESSIONS` (module-level constant)

```ts
const RECENT_SESSIONS = [
  'Fix flaky checkout test',
  'Q2 dependency sweep',
  'Incident #482 root cause',
  'Release 4.19 changelog',
  'Migration lock review',
]
```

Five static recent-session labels. Clicking has no effect.

## Layout structure

```
<aside w-60>
  ├── Workspace switcher button  (h-14, border-b)
  │     ├── "S" avatar  (accent background)
  │     ├── "Snabbit" / "Agent Console" text stack
  │     └── IconChevronDown
  ├── New session button  (p-3 section)
  │     ├── IconPlus (accent)
  │     ├── "New session" text
  │     └── ⌘N kbd hint
  ├── Primary nav  (px-2, gap-0.5)
  │     └── 6× nav buttons (icons + labels)
  ├── Recent sessions (mt-5, overflow-y-auto)
  │     ├── "RECENT SESSIONS" label
  │     └── 5× session buttons
  └── User footer  (h-14, border-t)
        ├── "g" avatar (surface-3 background)
        └── "guna" / email text stack
```

## Implementation details

### Nav item rendering

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

The active item (`Dashboard`) receives `aria-current="page"` for accessibility,
`bg-surface-2` background, `font-medium` weight, and `text-accent` (pink) icon
color. Inactive items show `text-text-muted` and get hover styles.

Icon components are stored in `item.icon` as `ComponentType`, so they must be
assigned to a capitalized variable (`const Icon = item.icon`) before use in JSX,
otherwise React treats them as HTML elements.

### Recent sessions scroll

The recent sessions section has `min-h-0 flex-1 overflow-y-auto` — `min-h-0`
and `flex-1` allow the section to grow to fill available space in the flex
column while `overflow-y-auto` adds a scrollbar if the session list grows long.

## Used by

`App.tsx` — rendered as the leftmost element in the top-level flex row.
