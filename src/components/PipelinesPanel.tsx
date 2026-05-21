import { fetchPipelines } from '../lib/api'
import type { Pipeline } from '../lib/api'
import { useFetch } from '../lib/useFetch'

const STATUS_STYLES: Record<Pipeline['status'], { dot: string; label: string }> = {
  passing: { dot: 'bg-ok', label: 'Passing' },
  failing: { dot: 'bg-err', label: 'Failing' },
  running: { dot: 'bg-accent', label: 'Running' },
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`
}

function PanelMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3.5 py-10 text-center text-sm text-text-faint">{children}</p>
  )
}

function PipelineRow({ pipeline }: { pipeline: Pipeline }) {
  const style = STATUS_STYLES[pipeline.status]
  return (
    <li className="flex items-center gap-3 px-3.5 py-2.5">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`}
        title={style.label}
      />
      <span className="truncate text-sm font-medium">{pipeline.name}</span>
      <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-text-muted">
        {pipeline.branch}
      </span>
      <span className="ml-auto shrink-0 font-mono text-[11px] text-text-faint">
        {formatDuration(pipeline.durationSeconds)}
      </span>
      <span className="hidden shrink-0 text-xs text-text-faint sm:inline">
        {pipeline.triggeredBy}
      </span>
    </li>
  )
}

/** Live CI/CD pipeline panel — data comes from the backend API. */
export default function PipelinesPanel() {
  const { data, loading, error, reload } = useFetch(fetchPipelines)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <h2 className="text-sm font-semibold">CI/CD pipelines</h2>
        {data && (
          <span className="text-xs text-text-faint">
            {data.summary.passRate}% pass rate · {data.summary.running} running ·{' '}
            {data.provider}
          </span>
        )}
        <button
          type="button"
          onClick={reload}
          className="ml-auto rounded-md border border-border px-2 py-1 text-xs text-text-muted hover:border-border-strong hover:text-text"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-lg border border-border bg-surface">
        {loading && <PanelMessage>Loading pipelines…</PanelMessage>}

        {error && !loading && (
          <PanelMessage>
            Could not reach the API ({error}). Is the server running on port
            3001?
          </PanelMessage>
        )}

        {data && !loading && !error && data.pipelines.length === 0 && (
          <PanelMessage>No recent pipeline runs.</PanelMessage>
        )}

        {data && !loading && !error && data.pipelines.length > 0 && (
          <ul className="divide-y divide-border">
            {data.pipelines.map((pipeline) => (
              <PipelineRow key={pipeline.id} pipeline={pipeline} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
