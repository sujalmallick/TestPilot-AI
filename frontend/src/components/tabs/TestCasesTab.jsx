import { Download, Table2, Plus, Filter, X } from "lucide-react";
import { useState, useMemo } from "react";
import EmptyState from '../shared/EmptyState'
import TestCaseTable from '../shared/TestCaseTable'
import CreateTestCaseModal from '../workspace/CreateTestCaseModal'
import { exportTestCasesCSV } from "../../lib/exportCSV";


export default function TestCasesTab({
  testCases,
  projectId,
  project,
  isLoading,
  onStatusChange,
  onAssigneeChange,
  onJumpToIssue,
  showToast,
  onManualCreate,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterModule, setFilterModule] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);

  const filteredTestCases = useMemo(() => {
    let result = testCases || [];
    if (filterModule) result = result.filter(tc => tc.module === filterModule);
    if (filterCategory) result = result.filter(tc => tc.category === filterCategory);
    return result;
  }, [testCases, filterModule, filterCategory]);

  const total = testCases?.length || 0;
  const filteredTotal = filteredTestCases.length;

  if (!testCases || testCases.length === 0) {
    return (
      <div className="base-card p-5 md:p-6">
        <EmptyState
          icon={<Table2 size={22} />}
          title="No test cases yet"
          description="Analyze a workflow above to generate execution-ready test cases, or create one manually."
          action={
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus size={16} />
              Create Test Case
            </button>
          }
        />
        {showCreateModal && (
          <CreateTestCaseModal
            projectId={projectId}
            onClose={() => setShowCreateModal(false)}
            onSuccess={(newTc) => onManualCreate?.(newTc)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="base-card p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">Test Cases</h3>
          <p className="mt-1 text-xs text-muted">
            {total} generated cases. Click a status pill to cycle pending → pass → fail.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(filterModule || filterCategory) && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs text-muted flex items-center gap-1"><Filter size={12}/> Active Filters:</span>
              {filterModule && (
                <span className="flex items-center gap-1 bg-signal/10 text-signal text-[11px] px-2 py-0.5 rounded-full">
                  {filterModule}
                  <button onClick={() => setFilterModule(null)} className="hover:text-ink"><X size={10}/></button>
                </span>
              )}
              {filterCategory && (
                <span className="flex items-center gap-1 bg-purple-500/10 text-purple-600 text-[11px] px-2 py-0.5 rounded-full">
                  {filterCategory}
                  <button onClick={() => setFilterCategory(null)} className="hover:text-ink"><X size={10}/></button>
                </span>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus size={14} />
            Create
          </button>
          <button
            type="button"
            onClick={() => {
              exportTestCasesCSV(filteredTestCases, "BugMind_TestCases");
            }}
            className="btn-secondary"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateTestCaseModal
          projectId={projectId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newTc) => onManualCreate?.(newTc)}
        />
      )}

      <TestCaseTable
        testCases={filteredTestCases}
        projectId={projectId}
        project={project}
        onStatusChange={onStatusChange}
        onAssigneeChange={onAssigneeChange}
        onJumpToIssue={onJumpToIssue}
        onFilterModule={setFilterModule}
        onFilterCategory={setFilterCategory}
      />
    </div>
  )
}
