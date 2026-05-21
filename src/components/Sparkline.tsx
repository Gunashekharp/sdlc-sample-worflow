interface SparklineProps {
  /** Series values, oldest first. Needs at least two points to render. */
  points: number[]
  /** Drives the line color: ok (green) when true, err (red) when false. */
  positive: boolean
  className?: string
}

/** A tiny, axis-free trend line for KPI cards. */
export default function Sparkline({ points, positive, className }: SparklineProps) {
  if (points.length < 2) return null

  const width = 100
  const height = 28
  const pad = 3
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const coords = points
    .map((value, i) => {
      const x = pad + (i / (points.length - 1)) * (width - pad * 2)
      const y = height - pad - ((value - min) / range) * (height - pad * 2)
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className ?? 'h-7 w-full'}
    >
      <polyline
        points={coords}
        fill="none"
        stroke={positive ? 'var(--color-ok)' : 'var(--color-err)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
