---
title: icons
description: Reference for `src/components/icons.tsx`
---

**File:** `src/components/icons.tsx` · **Lines:** 118

<!-- fill:file:summary -->
This file is a dependency-free, inline SVG icon set for the dashboard UI. Every icon is a 16×16 stroke-based glyph drawn with `currentColor`, sharing a private `Svg` wrapper that fixes the viewBox, stroke width, line caps, and `aria-hidden`, then spreads through any `SVGProps`. The 13 exported icons are consumed across the chrome and content components — `Sidebar.tsx`, `TopBar.tsx`, `PromptBar.tsx`, `FeaturedAgent.tsx`, `AgentGrid.tsx`, and `KpiStrip.tsx` — keeping the visual language consistent without pulling in an icon library.
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `react` | `SVGProps` | type-only · external |


## Symbols

This file exports 13 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| IconDashboard | function | no |
| IconSessions | function | no |
| IconAgents | function | no |
| IconRuns | function | no |
| IconIntegrations | function | no |
| IconSettings | function | no |
| IconSearch | function | no |
| IconPlus | function | no |
| IconArrowUp | function | no |
| IconSparkle | function | no |
| IconChevronDown | function | no |
| IconTrendUp | function | no |
| IconTrendDown | function | no |

## IconDashboard

**Kind:** `function`

```ts
const IconDashboard = (p: IconProps) => { ... }
```

<!-- fill:sym:IconDashboard:summary -->
Renders a dashboard glyph: four small rounded squares arranged in a 2×2 grid (`<rect>` elements with `rx="1"`), evoking a panel of cards. It exists to mark the Dashboard navigation entry in `Sidebar.tsx`.
<!-- /fill:sym:IconDashboard:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconDashboard:return -->
A 16×16 `<svg>` React element (the dashboard glyph). Never null — it always renders the four-rectangle grid.
<!-- /fill:sym:IconDashboard:return -->

### Examples

<!-- fill:sym:IconDashboard:example -->
```tsx
<IconDashboard className="text-text-faint" />
```
<!-- /fill:sym:IconDashboard:example -->

### Used by

- `src/components/Sidebar.tsx`

## IconSessions

**Kind:** `function`

```ts
const IconSessions = (p: IconProps) => { ... }
```

<!-- fill:sym:IconSessions:summary -->
Renders a speech/chat-bubble glyph (a single `<path>` outlining a rounded rectangle with a tail), representing conversational sessions. It labels the Sessions navigation entry in `Sidebar.tsx`.
<!-- /fill:sym:IconSessions:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconSessions:return -->
A 16×16 `<svg>` React element (the chat-bubble glyph). Never null — the single path always renders.
<!-- /fill:sym:IconSessions:return -->

### Examples

<!-- fill:sym:IconSessions:example -->
```tsx
<IconSessions className="text-text-faint" />
```
<!-- /fill:sym:IconSessions:example -->

### Used by

- `src/components/Sidebar.tsx`

## IconAgents

**Kind:** `function`

```ts
const IconAgents = (p: IconProps) => { ... }
```

<!-- fill:sym:IconAgents:summary -->
Renders a 3D cube/box glyph (an outer hexagonal `<path>` plus an inner path for the top edges and vertical seam), conveying a packaged agent or module. It marks the Agents navigation entry in `Sidebar.tsx`.
<!-- /fill:sym:IconAgents:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconAgents:return -->
A 16×16 `<svg>` React element (the cube glyph). Never null.
<!-- /fill:sym:IconAgents:return -->

### Examples

<!-- fill:sym:IconAgents:example -->
```tsx
<IconAgents className="text-text-faint" />
```
<!-- /fill:sym:IconAgents:example -->

### Used by

- `src/components/Sidebar.tsx`

## IconRuns

**Kind:** `function`

```ts
const IconRuns = (p: IconProps) => { ... }
```

<!-- fill:sym:IconRuns:summary -->
Renders a heartbeat/activity-pulse glyph (a single `<path>` baseline with a tall spike), suggesting live executions. It marks the Runs navigation entry in `Sidebar.tsx`.
<!-- /fill:sym:IconRuns:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconRuns:return -->
A 16×16 `<svg>` React element (the activity-pulse glyph). Never null.
<!-- /fill:sym:IconRuns:return -->

### Examples

<!-- fill:sym:IconRuns:example -->
```tsx
<IconRuns className="text-text-faint" />
```
<!-- /fill:sym:IconRuns:example -->

### Used by

- `src/components/Sidebar.tsx`

## IconIntegrations

**Kind:** `function`

```ts
const IconIntegrations = (p: IconProps) => { ... }
```

<!-- fill:sym:IconIntegrations:summary -->
Renders a power-plug glyph (a single `<path>` with two prongs on top, a body, and a cord stub below), a common metaphor for connected services. It marks the Integrations navigation entry in `Sidebar.tsx`.
<!-- /fill:sym:IconIntegrations:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconIntegrations:return -->
A 16×16 `<svg>` React element (the plug glyph). Never null.
<!-- /fill:sym:IconIntegrations:return -->

### Examples

<!-- fill:sym:IconIntegrations:example -->
```tsx
<IconIntegrations className="text-text-faint" />
```
<!-- /fill:sym:IconIntegrations:example -->

### Used by

- `src/components/Sidebar.tsx`

## IconSettings

**Kind:** `function`

```ts
const IconSettings = (p: IconProps) => { ... }
```

<!-- fill:sym:IconSettings:summary -->
Renders a sliders/controls glyph: two horizontal track lines (`<path>`) each crossed by a draggable knob (`<circle>`), the standard "settings" metaphor. It marks the Settings navigation entry in `Sidebar.tsx`.
<!-- /fill:sym:IconSettings:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconSettings:return -->
A 16×16 `<svg>` React element (the sliders glyph). Never null.
<!-- /fill:sym:IconSettings:return -->

### Examples

<!-- fill:sym:IconSettings:example -->
```tsx
<IconSettings className="text-text-faint" />
```
<!-- /fill:sym:IconSettings:example -->

### Used by

- `src/components/Sidebar.tsx`

## IconSearch

**Kind:** `function`

```ts
const IconSearch = (p: IconProps) => { ... }
```

<!-- fill:sym:IconSearch:summary -->
Renders a magnifying-glass glyph (a `<circle>` lens with a short diagonal `<path>` handle), the universal search affordance. It is used inside the search inputs of `TopBar.tsx` and `AgentGrid.tsx`.
<!-- /fill:sym:IconSearch:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconSearch:return -->
A 16×16 `<svg>` React element (the magnifying-glass glyph). Never null.
<!-- /fill:sym:IconSearch:return -->

### Examples

<!-- fill:sym:IconSearch:example -->
```tsx
<IconSearch className="absolute left-3 top-2.5 text-text-faint" />
```
<!-- /fill:sym:IconSearch:example -->

### Used by

- `src/components/TopBar.tsx`
- `src/components/AgentGrid.tsx`

## IconPlus

**Kind:** `function`

```ts
const IconPlus = (p: IconProps) => { ... }
```

<!-- fill:sym:IconPlus:summary -->
Renders a plus/add glyph (one `<path>` with a vertical and a horizontal stroke crossing at center), the standard "create new" affordance. It is used by `Sidebar.tsx`.
<!-- /fill:sym:IconPlus:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconPlus:return -->
A 16×16 `<svg>` React element (the plus glyph). Never null.
<!-- /fill:sym:IconPlus:return -->

### Examples

<!-- fill:sym:IconPlus:example -->
```tsx
<button><IconPlus /> New session</button>
```
<!-- /fill:sym:IconPlus:example -->

### Used by

- `src/components/Sidebar.tsx`

## IconArrowUp

**Kind:** `function`

```ts
const IconArrowUp = (p: IconProps) => { ... }
```

<!-- fill:sym:IconArrowUp:summary -->
Renders an upward arrow glyph (a `<path>` with a vertical shaft and a chevron head pointing up), used as a submit/send affordance. It appears in `FeaturedAgent.tsx` and `PromptBar.tsx`.
<!-- /fill:sym:IconArrowUp:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconArrowUp:return -->
A 16×16 `<svg>` React element (the up-arrow glyph). Never null.
<!-- /fill:sym:IconArrowUp:return -->

### Examples

<!-- fill:sym:IconArrowUp:example -->
```tsx
<button aria-label="Send"><IconArrowUp /></button>
```
<!-- /fill:sym:IconArrowUp:example -->

### Used by

- `src/components/FeaturedAgent.tsx`
- `src/components/PromptBar.tsx`

## IconSparkle

**Kind:** `function`

```ts
const IconSparkle = (p: IconProps) => { ... }
```

<!-- fill:sym:IconSparkle:summary -->
Renders a four-point sparkle/star glyph. Unlike the other stroke-based icons, its `<path>` is filled with `currentColor` and has `stroke="none"`, giving a solid AI/magic accent. It appears in `FeaturedAgent.tsx` and `PromptBar.tsx`.
<!-- /fill:sym:IconSparkle:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconSparkle:return -->
A 16×16 `<svg>` React element (the filled sparkle glyph). Never null.
<!-- /fill:sym:IconSparkle:return -->

### Examples

<!-- fill:sym:IconSparkle:example -->
```tsx
<IconSparkle className="text-accent" />
```
<!-- /fill:sym:IconSparkle:example -->

### Used by

- `src/components/FeaturedAgent.tsx`
- `src/components/PromptBar.tsx`

## IconChevronDown

**Kind:** `function`

```ts
const IconChevronDown = (p: IconProps) => { ... }
```

<!-- fill:sym:IconChevronDown:summary -->
Renders a downward chevron glyph (one `<path>` forming a "v"), the standard disclosure/dropdown indicator. It is used by `Sidebar.tsx`, `TopBar.tsx`, and `PromptBar.tsx`.
<!-- /fill:sym:IconChevronDown:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconChevronDown:return -->
A 16×16 `<svg>` React element (the chevron glyph). Never null.
<!-- /fill:sym:IconChevronDown:return -->

### Examples

<!-- fill:sym:IconChevronDown:example -->
```tsx
<IconChevronDown className="text-text-faint" />
```
<!-- /fill:sym:IconChevronDown:example -->

### Used by

- `src/components/Sidebar.tsx`
- `src/components/TopBar.tsx`
- `src/components/PromptBar.tsx`

## IconTrendUp

**Kind:** `function`

```ts
const IconTrendUp = (p: IconProps) => { ... }
```

<!-- fill:sym:IconTrendUp:summary -->
Renders an upward-trend glyph: a zig-zag line that ends climbing to the upper-right, plus a small arrowhead `<path>` at the top corner. It signals a positive metric delta in `KpiStrip.tsx`.
<!-- /fill:sym:IconTrendUp:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconTrendUp:return -->
A 16×16 `<svg>` React element (the up-trend glyph). Never null.
<!-- /fill:sym:IconTrendUp:return -->

### Examples

<!-- fill:sym:IconTrendUp:example -->
```tsx
<IconTrendUp className="text-ok" />
```
<!-- /fill:sym:IconTrendUp:example -->

### Used by

- `src/components/KpiStrip.tsx`

## IconTrendDown

**Kind:** `function`

```ts
const IconTrendDown = (p: IconProps) => { ... }
```

<!-- fill:sym:IconTrendDown:summary -->
Renders a downward-trend glyph: the mirror of `IconTrendUp`, with a zig-zag line dropping to the lower-right and an arrowhead `<path>` at the bottom corner. It signals a negative metric delta in `KpiStrip.tsx`.
<!-- /fill:sym:IconTrendDown:summary -->

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| p | `SVGProps<SVGSVGElement>` | — | yes | Standard SVG props (e.g. `className`, `width`, `style`, event handlers) spread onto the underlying `<svg>`, overriding the wrapper's defaults. |

**Returns:** `any`

<!-- fill:sym:IconTrendDown:return -->
A 16×16 `<svg>` React element (the down-trend glyph). Never null.
<!-- /fill:sym:IconTrendDown:return -->

### Examples

<!-- fill:sym:IconTrendDown:example -->
```tsx
<IconTrendDown className="text-err" />
```
<!-- /fill:sym:IconTrendDown:example -->

### Used by

- `src/components/KpiStrip.tsx`

## Diagrams

<!-- fill:file:diagrams -->

<!-- /fill:file:diagrams -->

## Source

Full file source for `src/components/icons.tsx` (118 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (118 lines)</summary>

````tsx
/*
 * Minimal inline icon set — 16px, stroke-based, currentColor.
 * Kept dependency-free and geometric to match the dense, Linear-grade UI.
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconDashboard = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
  </Svg>
)

export const IconSessions = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 4.5a1 1 0 011-1h9a1 1 0 011 1v5a1 1 0 01-1 1H6l-3 2.5V10.5H3.5a1 1 0 01-1-1z" />
  </Svg>
)

export const IconAgents = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 2 13.5 5v6L8 14 2.5 11V5z" />
    <path d="M2.5 5 8 8l5.5-3M8 8v6" />
  </Svg>
)

export const IconRuns = (p: IconProps) => (
  <Svg {...p}>
    <path d="M1.8 8h2.7l2-5 3 10 2-5h2.7" />
  </Svg>
)

export const IconIntegrations = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 2v3.5M10.5 2v3.5M3.5 5.5h9V9a4.5 4.5 0 01-9 0zM8 13.5V15" />
  </Svg>
)

export const IconSettings = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 5h6M12.5 5H14M2 11h1.5M8 11h6" />
    <circle cx="10" cy="5" r="2" />
    <circle cx="6" cy="11" r="2" />
  </Svg>
)

export const IconSearch = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </Svg>
)

export const IconPlus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 3v10M3 8h10" />
  </Svg>
)

export const IconArrowUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 13V3.5M3.8 7.7 8 3.5l4.2 4.2" />
  </Svg>
)

export const IconSparkle = (p: IconProps) => (
  <Svg {...p}>
    <path
      d="M8 2.2 9.3 6.7 13.8 8 9.3 9.3 8 13.8 6.7 9.3 2.2 8 6.7 6.7z"
      fill="currentColor"
      stroke="none"
    />
  </Svg>
)

export const IconChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6 8 10l4-4" />
  </Svg>
)

export const IconTrendUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 11 6.5 7l2.5 2.5L13.5 5" />
    <path d="M10 5h3.5v3.5" />
  </Svg>
)

export const IconTrendDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 5 6.5 9l2.5-2.5L13.5 11" />
    <path d="M10 11h3.5V7.5" />
  </Svg>
)

````

</details>
