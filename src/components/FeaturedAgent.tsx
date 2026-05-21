import type { Agent } from '../data/agents'
import { IconArrowUp, IconSparkle } from './icons'
import StatusDot, { STATUS_LABEL } from './StatusDot'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-text-faint">{label}</dt>
      <dd className="font-mono font-medium">{value}</dd>
    </div>
  )
}

export default function FeaturedAgent({ agent }: { agent: Agent }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-border bg-surface">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, var(--color-accent-subtle), transparent 55%)',
        }}
      />
      <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent">
            <IconSparkle className="h-3.5 w-3.5" />
            Featured agent
          </p>
          <h2 className="mt-1.5 flex flex-wrap items-center gap-2 text-lg font-semibold">
            {agent.name}
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-bg/60 px-2 py-0.5 text-xs font-normal text-text-muted">
              <StatusDot status={agent.status} />
              {STATUS_LABEL[agent.status]}
            </span>
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-text-muted">{agent.description}</p>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <Stat label="Runs · 7d" value={agent.runsPerWeek.toLocaleString()} />
            <Stat label="Success" value={`${agent.successRate}%`} />
            <Stat label="Avg run" value={agent.avgDuration} />
            <Stat label="Last run" value={agent.lastRun} />
          </dl>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Run agent
            <IconArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
