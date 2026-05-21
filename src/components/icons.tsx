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
