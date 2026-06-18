import { Hourglass, CheckCircle2, XCircle, Filter, Download } from 'lucide-react'
import EmptyState from '../shared/EmptyState'
import TestCaseTable from '../shared/TestCaseTable'

function MetricCard({ icon, label, value, tone }) {
  return (
    <div className="rounded-md bg-paper p-4">
      <div className="mb-1 flex items-center gap-1.5 text-[13px] text-muted">
        {icon}
        {label}
      </div>
      <p className={`text-[24px] font-medium ${tone}`}>{value}</p>
    </div>
  )
}

export default function TrackerTab({ testCases, onStatusChange, onJumpToIssue }) {
  const hasTestCases = Boolean(testCases && testCases.length)
  const counts = (testCases || []).reduce(
    (acc, testCase) => {
      acc[testCase.status] = (acc[testCase.status] || 0) + 1
      return acc
    },
    { pending: 0, pass: 0, fail: 0 },
  )

  return (
    <div className="p-5">
      <div className="mb-4 grid grid-cols-3 gap-3">
        <MetricCard icon={<Hourglass size={14} />} label="Pending" value={counts.pending} tone="text-ochre" />
        <MetricCard icon={<CheckCircle2 size={14} />} label="Passed" value={counts.pass} tone="text-verified" />
        <MetricCard icon={<XCircle size={14} />} label="Failed" value={counts.fail} tone="text-flagged" />
      </div>

      {!hasTestCases ? (
        <EmptyState
          title="Nothing to track yet"
          description="Mark test cases as Pass or Fail on the Test Cases tab to populate this tracker."
        />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-end gap-2">
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
          <TestCaseTable testCases={testCases} onStatusChange={onStatusChange} onJumpToIssue={onJumpToIssue} />
        </>
      )}
    </div>
  )
}
