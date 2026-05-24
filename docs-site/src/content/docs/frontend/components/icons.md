---
title: Icon set (icons.tsx)
---

`icons.tsx` is a self-contained, dependency-free inline SVG icon set. It exports 13 named icon components, all built on a shared `Svg` wrapper. Icons are 16×16px, stroke-based (except `IconSparkle`), and inherit text colour via `stroke="currentColor"`. All icons are `aria-hidden` by default.

**File:** `src/components/icons.tsx`

## Design principles

- **No icon library dependency.** Every icon is a hand-authored inline SVG using only `<path>`, `<rect>`, `<circle>`, and `<polyline>` elements. This eliminates bundle-size overhead from external icon packages.
- **Consistent visual grammar.** All stroke icons share 1.5px stroke width, round caps, and round joins, matching the "dense, Linear-grade" aesthetic of the application.
- **Colour inheritance.** `stroke="currentColor"` means every icon inherits the CSS `color` of its parent element. Tailwind text-colour utilities (`text-accent`, `text-text-faint`, etc.) control icon colour with no extra props.
- **Size overrideable.** Default `width="16" height="16"` can be overridden by passing Tailwind size utilities as `className` (e.g. `className="h-4 w-4"`).

## `IconProps` type

```ts
type IconProps = SVGProps<SVGSVGElement>
```

`SVGProps<SVGSVGElement>` is React's full SVG attribute type for `<svg>` elements. It includes every standard SVG attribute plus React event handlers and the `className` / `style` props. All 13 icon components accept `IconProps`, so callers can pass any valid SVG or HTML attribute.

## `Svg` wrapper (internal, not exported)

```ts
function Svg({ children, ...props }: IconProps): JSX.Element {
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
```

`Svg` is the base element for every icon. It establishes the following defaults:

| Attribute | Default value | Meaning |
|-----------|--------------|---------|
| `width` | `"16"` | 16px rendered width (overrideable via CSS) |
| `height` | `"16"` | 16px rendered height (overrideable via CSS) |
| `viewBox` | `"0 0 16 16"` | Logical coordinate space; all path data is authored in 16×16 units |
| `fill` | `"none"` | No fill on the SVG root; individual shapes may set their own `fill` |
| `stroke` | `"currentColor"` | Inherits the CSS `color` property |
| `strokeWidth` | `"1.5"` | 1.5px visual stroke weight |
| `strokeLinecap` | `"round"` | Rounded ends on open path segments |
| `strokeLinejoin` | `"round"` | Rounded corners at path joins |
| `aria-hidden` | `"true"` | Excludes all icons from the accessibility tree by default |

**Override mechanism:** `{...props}` is spread after the defaults, so any attribute passed to an icon component overrides the default. Example: `<IconSearch stroke="red" />` produces `stroke="red"`.

:::tip
To change icon colour, use a Tailwind text-colour class: `<IconSearch className="text-accent" />`. React applies the `className` to the `<svg>`, and `stroke="currentColor"` picks up the CSS `color` value automatically.
:::

## Exported icons

All icons follow the pattern:

```ts
export const IconXxx = (p: IconProps) => <Svg {...p}>…SVG shapes…</Svg>
```

### `IconDashboard`

| Property | Value |
|----------|-------|
| Visual | Four small rounded rectangles arranged in a 2×2 grid |
| SVG shapes | Four `<rect>` elements; top-left, top-right, bottom-left, bottom-right quadrants |
| Used by | `Sidebar` — Dashboard nav item |

### `IconSessions`

| Property | Value |
|----------|-------|
| Visual | A speech bubble / chat message outline |
| SVG shapes | `<path>` describing a rounded rectangle with a triangular tail at the bottom-left |
| Used by | `Sidebar` — Sessions nav item |

### `IconAgents`

| Property | Value |
|----------|-------|
| Visual | A hexagon with internal line segments suggesting a network or agent graph |
| SVG shapes | `<path>` for the hexagon outline + internal cross-lines |
| Used by | `Sidebar` — Agents nav item |

### `IconRuns`

| Property | Value |
|----------|-------|
| Visual | An ECG / pulse waveform (flat — sharp spike — flat) |
| SVG shapes | `<polyline>` or `<path>` tracing the waveform |
| Used by | `Sidebar` — Runs nav item |

### `IconIntegrations`

| Property | Value |
|----------|-------|
| Visual | A plug or flask/connector shape |
| SVG shapes | `<path>` describing the plug body and prongs |
| Used by | `Sidebar` — Integrations nav item |

### `IconSettings`

| Property | Value |
|----------|-------|
| Visual | Two horizontal slider tracks with circular thumb handles |
| SVG shapes | Two `<line>` or `<path>` segments (tracks) + two `<circle>` elements (thumbs) |
| Used by | `Sidebar` — Settings nav item |

### `IconSearch`

| Property | Value |
|----------|-------|
| Visual | A magnifying glass — circle with a diagonal handle line extending from the lower-right |
| SVG shapes | `<circle>` (lens) + `<line>` (handle) |
| Used by | `TopBar` (search trigger), `AgentGrid` (search label) |

### `IconPlus`

| Property | Value |
|----------|-------|
| Visual | A `+` cross (two perpendicular line segments) |
| SVG shapes | Two `<line>` elements (horizontal + vertical) |
| Used by | `Sidebar` — New session button |

### `IconArrowUp`

| Property | Value |
|----------|-------|
| Visual | An upward-pointing arrow with an angled arrowhead |
| SVG shapes | `<path>` or `<line>` + `<polyline>` for the shaft and arrowhead |
| Used by | `FeaturedAgent` Run button, `PromptBar` send button |

### `IconSparkle`

| Property | Value |
|----------|-------|
| Visual | A solid four-point star (sparkle/asterisk shape) |
| SVG shapes | `<path>` with `fill="currentColor"` and `stroke="none"` directly on the path |
| Special | The **only icon that is not purely stroke-based**. `fill="currentColor"` is set on the `<path>` element, and `stroke="none"` overrides the `Svg` wrapper's `stroke="currentColor"`. The SVG root still has `fill="none"` from the `Svg` wrapper, but the inner path overrides it. |
| Used by | `PromptBar` — model picker decoration, `FeaturedAgent` — "Featured agent" eyebrow |

:::note
`IconSparkle` is unique in the icon set: it sets `fill="currentColor"` and `stroke="none"` directly on its inner `<path>` element. Passing `className="text-accent"` to `IconSparkle` colours the filled star pink, while passing it to any other icon colours its stroke.
:::

### `IconChevronDown`

| Property | Value |
|----------|-------|
| Visual | A `˅` chevron (two line segments meeting at a downward point) |
| SVG shapes | `<polyline>` or `<path>` |
| Used by | `Sidebar` — workspace switcher, `PromptBar` — model picker, `TopBar` — environment switcher |

### `IconTrendUp`

| Property | Value |
|----------|-------|
| Visual | A rising diagonal line with an arrowhead at the upper-right end |
| SVG shapes | `<path>` or `<line>` + arrowhead `<polyline>` |
| Used by | `KpiStrip` (via `KpiCard`) — shown when `isDown === false` (positive or upward delta) |

### `IconTrendDown`

| Property | Value |
|----------|-------|
| Visual | A falling diagonal line with an arrowhead at the lower-right end |
| SVG shapes | `<path>` or `<line>` + arrowhead `<polyline>` |
| Used by | `KpiStrip` (via `KpiCard`) — shown when `isDown === true` (negative or downward delta) |

## Usage patterns

### Basic usage (colour from parent)

```tsx
import { IconSearch } from './icons'

// Icon inherits text colour from the parent element's CSS color:
<button className="text-text-faint hover:text-text">
  <IconSearch />
  Search
</button>
```

### Explicit colour

```tsx
// Apply a specific colour via Tailwind text-colour utility:
<IconPlus className="text-accent" />
```

### Size override

```tsx
// Override the 16×16px default size with Tailwind utilities:
<IconArrowUp className="h-4 w-4" />  // 16px (same as default)
<IconSparkle className="h-3.5 w-3.5" />  // 14px (smaller)
```

Both `width`/`height` attributes and CSS `height`/`width` properties affect SVG size. The Tailwind `h-*`/`w-*` classes set CSS `height`/`width`, which override the SVG `width="16" height="16"` attributes in browsers.

### Combined colour and size

```tsx
<IconSparkle className="h-3.5 w-3.5 text-accent" />
```

## Icon overview table

| Export | Visual | Fill/stroke | Used by |
|--------|--------|------------|---------|
| `IconDashboard` | 2×2 grid of rectangles | Stroke | `Sidebar` |
| `IconSessions` | Chat bubble | Stroke | `Sidebar` |
| `IconAgents` | Hexagon + lines | Stroke | `Sidebar` |
| `IconRuns` | ECG waveform | Stroke | `Sidebar` |
| `IconIntegrations` | Plug/flask | Stroke | `Sidebar` |
| `IconSettings` | Two sliders | Stroke | `Sidebar` |
| `IconSearch` | Magnifying glass | Stroke | `TopBar`, `AgentGrid` |
| `IconPlus` | Plus cross | Stroke | `Sidebar` |
| `IconArrowUp` | Upward arrow | Stroke | `FeaturedAgent`, `PromptBar` |
| `IconSparkle` | Solid 4-point star | **Fill only** | `PromptBar`, `FeaturedAgent` |
| `IconChevronDown` | Down chevron | Stroke | `Sidebar`, `PromptBar`, `TopBar` |
| `IconTrendUp` | Rising line + arrow | Stroke | `KpiStrip` |
| `IconTrendDown` | Falling line + arrow | Stroke | `KpiStrip` |

## Accessibility

All icons have `aria-hidden="true"` by default (set in the `Svg` wrapper). This is the correct default because:

1. Icons are always used alongside text labels or `aria-label` attributes on their parent buttons.
2. Exposing icon SVG paths to screen readers would produce meaningless or no useful output.

To make a standalone icon accessible (e.g. an icon-only button that does not pass `aria-label` to the button), override with `aria-hidden={false}` and add `role="img"` and `aria-label`:

```tsx
// Example: accessible icon with no parent aria-label
<IconSearch aria-hidden={false} role="img" aria-label="Search" />
```

In practice, every component that uses an icon-only button already provides `aria-label` on the `<button>` element (`PromptBar`'s send button uses `aria-label="Send prompt"`), so overriding `aria-hidden` is not needed.

## Bundle size

Each icon is a small inline SVG with a single `<path>` or a handful of primitive elements. The total size of `icons.tsx` is in the kilobyte range. Because icons are tree-shaken individually as named exports, only the icons actually imported in the application are included in the final bundle.
