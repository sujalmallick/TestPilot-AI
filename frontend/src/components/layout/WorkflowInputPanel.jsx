import { Route, Pencil, Loader2 } from 'lucide-react'

export default function WorkflowInputPanel({
  workflow,
  observedSteps,
  onWorkflowChange,
  onObservedStepsChange,
  onAnalyze,
  isAnalyzing,
  isCollapsed,
  onExpand,
  error,
  hasResult,
}) {
  if (isCollapsed) {
    return (
      <div className="flex items-center justify-between gap-3 border-b border-hairline bg-paper px-5 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-[13px] text-muted">
          <Route size={16} className="shrink-0 text-muted" />
          <span className="truncate font-medium text-ink">{workflow}</span>
          <span className="hidden shrink-0 sm:inline">· analyzed just now</span>
        </div>
        <button
          type="button"
          onClick={onExpand}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-hairline px-2.5 py-1 text-[12px] text-muted transition-colors hover:text-ink"
        >
          <Pencil size={13} />
          Edit workflow
        </button>
      </div>
    )
  }

  return (
    <div className={`border-b border-hairline px-5 py-5 ${hasResult ? '' : 'py-10'}`}>
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {!hasResult && (
          <div className="mb-1 text-center">
            <h1 className="text-[20px] font-semibold text-ink">Describe the workflow to test</h1>
            <p className="mt-1 text-[13px] text-muted">
              Paste the app flow and, optionally, the steps you observed while testing it.
            </p>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink">Workflow</label>
          <textarea
            value={workflow}
            onChange={(event) => onWorkflowChange(event.target.value)}
            placeholder="Login → Dashboard → Messages"
            rows={2}
            className="w-full resize-none rounded-md border border-hairline bg-surface px-3 py-2 text-[14px] text-ink placeholder:text-muted focus:border-signal"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-ink">
            Observed steps <span className="text-muted">(optional)</span>
          </label>
          <textarea
            value={observedSteps}
            onChange={(event) => onObservedStepsChange(event.target.value)}
            placeholder={'1. Open App\n2. Tap Login\n3. Enter Email'}
            rows={4}
            className="w-full resize-none rounded-md border border-hairline bg-surface px-3 py-2 font-mono text-[13px] text-ink placeholder:text-muted focus:border-signal"
          />
        </div>

        {error && <p className="text-[13px] text-flagged">{error}</p>}

        <div className="flex items-center justify-end gap-2">
          {hasResult && (
            <button
              type="button"
              onClick={onExpand}
              className="rounded-md border border-hairline px-3 py-2 text-[13px] text-muted hover:text-ink"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 rounded-md bg-signal px-4 py-2 text-[13px] font-medium text-white transition-opacity disabled:opacity-60"
          >
            {isAnalyzing && <Loader2 size={14} className="animate-spin" />}
            {isAnalyzing ? 'Analyzing workflow…' : 'Analyze workflow'}
          </button>
        </div>
      </div>
    </div>
  )
}
