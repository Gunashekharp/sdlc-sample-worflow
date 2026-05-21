import { useState } from 'react'
import { IconArrowUp, IconChevronDown, IconSparkle } from './icons'

export default function PromptBar() {
  const [value, setValue] = useState('')
  const canSend = value.trim().length > 0

  function submit() {
    if (!canSend) return
    // Backend wiring is tracked in BACKLOG.md; for now this clears the input.
    console.log('Prompt submitted:', value.trim())
    setValue('')
  }

  return (
    <div className="shrink-0 border-t border-border bg-bg px-4 py-3">
      <div className="rounded-lg border border-border bg-surface focus-within:border-border-strong">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          rows={2}
          placeholder="Ask an agent or describe a task…"
          aria-label="Prompt input"
          className="block w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-text-faint"
        />
        <div className="flex items-center gap-2 px-2.5 py-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-text-muted hover:border-border-strong hover:text-text"
          >
            <IconSparkle className="h-3.5 w-3.5 text-accent" />
            Opus 4.7
            <IconChevronDown className="h-3.5 w-3.5" />
          </button>
          <span className="hidden text-xs text-text-faint sm:inline">
            Enter to send · Shift+Enter for newline
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send prompt"
            className="ml-auto grid h-7 w-7 place-items-center rounded-md bg-accent text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
