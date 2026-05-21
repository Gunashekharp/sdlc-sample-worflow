import type { AgentStatus } from '../data/agents'

export const STATUS_LABEL: Record<AgentStatus, string> = {
  running: 'Running',
  idle: 'Idle',
  attention: 'Needs attention',
}

/** Small colored status indicator. The running state pulses in Snabbit pink. */
export default function StatusDot({ status }: { status: AgentStatus }) {
  if (status === 'running') {
    return (
      <span className="relative flex h-2 w-2" title={STATUS_LABEL.running}>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
    )
  }

  const color = status === 'attention' ? 'bg-warn' : 'bg-text-faint'
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${color}`}
      title={STATUS_LABEL[status]}
    />
  )
}
