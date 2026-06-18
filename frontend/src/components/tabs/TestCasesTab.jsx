import { Filter, Download, Table2 } from 'lucide-react'
import EmptyState from '../shared/EmptyState'
import SkeletonBlock from '../shared/SkeletonBlock'
import TestCaseTable from '../shared/TestCaseTable'
import AIThinking from "../shared/AIThinking";

export default function TestCasesTab({ testCases, isLoading, onStatusChange, onJumpToIssue }) {


  if (!testCases || testCases.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<Table2 size={22} />}
          title="No test cases yet"
          description="Analyze a workflow above to generate execution-ready test cases."
        />
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] text-muted">Click a status pill to cycle pending → pass → fail.</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 rounded-md border border-hairline px-2.5 py-1.5 text-[12px] text-muted opacity-50"
          >
            <Filter size={13} /> Filter
          </button>
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 rounded-md border border-hairline px-2.5 py-1.5 text-[12px] text-muted opacity-50"
          >
            <Download size={13} /> Export
          </button>
        </div>
      </div>
      <TestCaseTable testCases={testCases} onStatusChange={onStatusChange} onJumpToIssue={onJumpToIssue} />
    </div>
  )
}
