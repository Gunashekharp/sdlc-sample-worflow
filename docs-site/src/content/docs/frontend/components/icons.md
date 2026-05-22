---
title: icons
description: Dependency-free inline SVG icon set.
---

**File:** `src/components/icons.tsx`

A set of 13 minimal, stroke-based SVG icons. All icons are 16×16px, use
`stroke="currentColor"` so they inherit text color, and are `aria-hidden` so
they do not pollute the accessibility tree.

## Internal helpers

### `IconProps`

```ts
type IconProps = SVGProps<SVGSVGElement>
```

Re-export of React's `SVGProps<SVGSVGElement>`, allowing callers to pass any
valid SVG attribute (including `className`, `style`, event handlers) to an icon.

### `Svg` (internal wrapper, not exported)

```ts
function Svg({ children, ...props }: IconProps)
```

The shared `<svg>` wrapper applied to every icon. Sets the common defaults:

| Attribute | Value | Effect |
|-----------|-------|--------|
| `width` | `"16"` | 16px default width |
| `height` | `"16"` | 16px default height |
| `viewBox` | `"0 0 16 16"` | Coordinate space |
| `fill` | `"none"` | No fill — stroke only |
| `stroke` | `"currentColor"` | Inherits text color |
| `strokeWidth` | `"1.5"` | 1.5px strokes |
| `strokeLinecap` | `"round"` | Rounded line ends |
| `strokeLinejoin` | `"round"` | Rounded joins |
| `aria-hidden` | `"true"` | Hidden from screen readers |

Callers can override any of these by passing props to the icon component;
`{...props}` is spread after the defaults, so overrides take effect.

`IconSparkle` is the one exception — it sets `fill="currentColor"` and
`stroke="none"` directly on its `<path>` to produce a solid filled star shape.

## Exported icons

All icons are named exports of the form `const IconXxx = (p: IconProps) => <Svg {...p}>...</Svg>`.

| Export | Visual description | Used by |
|--------|-------------------|---------|
| `IconDashboard` | Four small rounded squares (2×2 grid) | `Sidebar` nav |
| `IconSessions` | Speech bubble / chat message | `Sidebar` nav |
| `IconAgents` | Hexagon with internal cross-lines | `Sidebar` nav |
| `IconRuns` | ECG / pulse waveform | `Sidebar` nav |
| `IconIntegrations` | Plug / connector shape | `Sidebar` nav |
| `IconSettings` | Two horizontal sliders with circles | `Sidebar` nav |
| `IconSearch` | Magnifying glass | `TopBar`, `AgentGrid` |
| `IconPlus` | `+` cross | `Sidebar` New session button |
| `IconArrowUp` | Upward arrow with angled head | `FeaturedAgent` Run button, `PromptBar` send button |
| `IconSparkle` | Solid four-point star | `PromptBar` model picker, `FeaturedAgent` eyebrow |
| `IconChevronDown` | `˅` chevron | `Sidebar` workspace switcher, `PromptBar` model picker, `TopBar` environment switcher |
| `IconTrendUp` | Rising line + arrowhead | `KpiStrip` (positive delta) |
| `IconTrendDown` | Falling line + arrowhead | `KpiStrip` (negative delta) |

## Usage pattern

```tsx
import { IconSearch } from './icons'

// Inherits text color from parent:
<IconSearch className="text-text-faint" />

// Override size:
<IconArrowUp className="h-4 w-4" />
```

Because all icons spread `props` onto the `<svg>`, standard Tailwind size
utilities (`h-3.5 w-3.5`, `h-4 w-4`) and color utilities (`text-accent`,
`text-text-faint`) work directly.

## Design notes

The icon set is **dependency-free** — no icon library is imported. This
eliminates a common source of bundle-size bloat. Each icon is a small inline
SVG using only `<path>`, `<rect>`, `<circle>`, or `<polyline>` elements.

The consistent 1.5px stroke width, round caps and joins keep all icons visually
coherent even at small sizes, matching the "dense, Linear-grade" aesthetic.
