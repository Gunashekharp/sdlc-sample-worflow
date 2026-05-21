import { KPIS } from '../data/kpis'
import type { Kpi } from '../data/kpis'
import { IconTrendDown, IconTrendUp } from './icons'
import Sparkline from './Sparkline'

function KpiCard({ kpi }: { kpi: Kpi }) {
  const isDown = kpi.delta.trim().startsWith('-')
  const Trend = isDown ? IconTrendDown : IconTrendUp
  const deltaColor = kpi.positive ? 'text-ok' : 'text-err'

  return (
    <div className="rounded-lg border border-border bg-surface p-3.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-text-faint">
        {kpi.label}
      </p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <span className="text-2xl font-semibold tracking-tight">{kpi.value}</span>
        <span className={`flex items-center gap-1 text-xs font-medium ${deltaColor}`}>
          <Trend className="h-3.5 w-3.5" />
          {kpi.delta}
        </span>
      </div>
      <Sparkline
        points={kpi.trend}
        positive={kpi.positive}
        className="mt-2 h-7 w-full"
      />
      <p className="mt-1 text-xs text-text-faint">{kpi.hint}</p>
    </div>
  )
}

export default function KpiStrip() {
  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </section>
  )
}
