import type { Agent } from '../data/agents'
import StatusDot from './StatusDot'

interface AgentCardProps {
  agent: Agent
  selected: boolean
  onSelect: (id: string) => void
}

export default function AgentCard({ agent, selected, onSelect }: AgentCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(agent.id)}
      aria-pressed={selected}
      className={`flex h-full flex-col gap-2 rounded-lg border bg-surface p-3.5 text-left transition-colors ${
        selected
          ? 'border-accent ring-1 ring-accent'
          : 'border-border hover:border-border-strong hover:bg-surface-2'
      }`}
    >
      <div className="flex items-center gap-2">
        <StatusDot status={agent.status} />
        <span className="truncate text-sm font-semibold">{agent.name}</span>
        <span className="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-[11px] text-text-muted">
          {agent.category}
        </span>
      </div>
      <p className="line-clamp-2 text-xs text-text-muted">{agent.description}</p>
      <div className="mt-auto flex items-center gap-3 pt-1 font-mono text-[11px] text-text-faint">
        <span>{agent.runsPerWeek.toLocaleString()} runs/wk</span>
        <span>{agent.successRate}% ok</span>
        <span className="ml-auto">{agent.lastRun}</span>
      </div>
    </button>
  )
}
