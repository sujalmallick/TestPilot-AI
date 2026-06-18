import { useEffect, useState } from 'react'
import HeaderBar from './components/layout/HeaderBar'
import WorkflowInputPanel from './components/layout/WorkflowInputPanel'
import TabBar from './components/layout/TabBar'
import CommandPalette from './components/layout/CommandPalette'
import ToastStack from './components/shared/ToastStack'
import useToasts from './components/shared/useToasts'
import ModulesTab from './components/tabs/ModulesTab'
import ChecklistTab from './components/tabs/ChecklistTab'
import TestCasesTab from './components/tabs/TestCasesTab'
import IssueAnalysisTab from './components/tabs/IssueAnalysisTab'
import TrackerTab from './components/tabs/TrackerTab'
import { analyzeWorkflow, classifyIssue } from './api/TestPilotApi'
import AIThinking from "./components/shared/AIThinking";
import APIErrorCard from "./components/shared/APIErrorCard";
import AnalysisSummary from "./components/shared/AnalysisSummary";

const TABS = [
  { key: 'modules', label: 'Modules' },
  { key: 'checklist', label: 'Checklist' },
  { key: 'testcases', label: 'Test Cases' },
  { key: 'issues', label: 'Issue Analysis' },
  { key: 'tracker', label: 'Tracker' },
]

const EMPTY_ISSUE_FORM = { observation: '', expected: '', actual: '', mode: 'failed' }

export default function App() {
  const { toasts, showToast } = useToasts()

  // Workflow input + analysis
  const [workflow, setWorkflow] = useState('')
  const [observedSteps, setObservedSteps] = useState('')
  const [analysisStatus, setAnalysisStatus] = useState('idle') // idle | loading | success | error
  const [analysisError, setAnalysisError] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [testCases, setTestCases] = useState([])
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('modules')
  const [showSummary, setShowSummary] = useState(false)
  const [checkedItems, setCheckedItems] = useState({})

  // Issue analysis
  const [issueForm, setIssueForm] = useState(EMPTY_ISSUE_FORM)
  const [issueStatus, setIssueStatus] = useState('idle')
  const [issueError, setIssueError] = useState(null)
  const [issueResult, setIssueResult] = useState(null)

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  


  const isAnalyzing = analysisStatus === 'loading'
 const showWorkspace = analysisStatus === 'success'

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleAnalyze() {
    setAnalysisStatus('loading')
    setAnalysisError(null)
    try {
      const result = await analyzeWorkflow({
    workflow,
    observedSteps
})

if (result.success === false) {
    setApiError(result.error)
    setAnalysisStatus("error")
    return
}

setApiError(null)
      setAnalysis(result)
      setTestCases(result.testCases)
      setCheckedItems({})
      setAnalysisStatus('success')
      setPanelCollapsed(true)
      setShowSummary(true)
      setActiveTab('modules')
    } catch (error) {
      setAnalysisStatus('error')
      setAnalysisError(error.message)
    }
  }

  function handleStatusChange(id, status) {
    setTestCases((current) => current.map((tc) => (tc.id === id ? { ...tc, status } : tc)))
    showToast(`${id} marked ${status}`)
  }

  function handleToggleChecklistItem(id) {
    setCheckedItems((current) => ({ ...current, [id]: !current[id] }))
  }

  function handleJumpToIssue(testCase) {
    setIssueForm({ ...EMPTY_ISSUE_FORM, mode: 'failed', observation: testCase.description })
    setActiveTab('issues')
  }

  async function handleGenerateIssue() {
    setIssueStatus('loading')
    setIssueError(null)
    try {
      const result = await classifyIssue(issueForm)
      setIssueResult(result)
      setIssueStatus('success')
    } catch (error) {
      setIssueStatus('error')
      setIssueError(error.message)
    }
  }

  function handleCopyIssueResult() {
    if (!issueResult) return
    const lines =
      issueForm.mode === 'failed'
        ? [
            `**Bug type:** ${issueResult.bugType}`,
            `**Severity:** ${issueResult.severity}`,
            `**Priority:** ${issueResult.priority}`,
            `**Title:** ${issueResult.title}`,
          ]
        : [
            `**Observation type:** ${issueResult.observationType}`,
            `**Severity:** ${issueResult.severity}`,
            `**Next action:** ${issueResult.nextAction}`,
          ]
    navigator.clipboard.writeText(lines.join('\n')).then(() => showToast('Copied to clipboard'))
  }

  const tabsWithCounts = TABS.map((tab) =>
    tab.key === 'testcases' ? { ...tab, count: testCases.length } : tab,
  )

  const commands = [
    ...TABS.map((tab) => ({ label: `Go to ${tab.label}`, action: () => setActiveTab(tab.key) })),
    { label: 'Edit workflow', action: () => setPanelCollapsed(false) },
  ]

  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      <HeaderBar connected onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <WorkflowInputPanel
        workflow={workflow}
        observedSteps={observedSteps}
        onWorkflowChange={setWorkflow}
        onObservedStepsChange={setObservedSteps}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        isCollapsed={panelCollapsed && showWorkspace}
        onExpand={() => setPanelCollapsed(false)}
        error={analysisError}
        hasResult={showWorkspace}
      />

{analysisStatus === "error" && (
  <main className="flex-1">
    <APIErrorCard
      message={apiError}
      onRetry={handleAnalyze}
    />
  </main>
)}
      {analysisStatus === "loading" && (
  <main className="flex-1">
    <AIThinking title="Analyzing Workflow" />
  </main>
)}
{analysisStatus === "success" && (
  <>
    {showSummary ? (
      <AnalysisSummary
        analysis={analysis}
        testCases={testCases}
        onContinue={() => setShowSummary(false)}
      />
    ) : (
      <>
       <div className="border-b border-hairline bg-paper">
  <button
    type="button"
    onClick={() => setShowSummary(true)}
    className="px-5 py-3 text-sm font-medium text-signal transition hover:text-ink"
  >
    ← Analysis Summary
  </button>

  <TabBar
    tabs={tabsWithCounts}
    activeTab={activeTab}
    onChange={setActiveTab}
  />
</div>

        <main className="flex-1">

          {activeTab === "modules" && (
            <ModulesTab
              analysis={analysis}
              isLoading={false}
            />
          )}

          {activeTab === "checklist" && (
            <ChecklistTab
              checklist={analysis?.checklist ?? []}
              isLoading={false}
              checkedItems={checkedItems}
              onToggleItem={handleToggleChecklistItem}
            />
          )}

          {activeTab === "testcases" && (
            <TestCasesTab
              testCases={testCases}
              isLoading={false}
              onStatusChange={handleStatusChange}
              onJumpToIssue={handleJumpToIssue}
            />
          )}

          {activeTab === "issues" && (
            <IssueAnalysisTab
              form={issueForm}
              onFormChange={setIssueForm}
              onGenerate={handleGenerateIssue}
              isGenerating={issueStatus === "loading"}
              result={issueResult}
              error={issueError}
              onCopy={handleCopyIssueResult}
            />
          )}

          {activeTab === "tracker" && (
            <TrackerTab
              testCases={testCases}
              onStatusChange={handleStatusChange}
              onJumpToIssue={handleJumpToIssue}
            />
          )}

        </main>
      </>
    )}
  </>
)}

      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} commands={commands} />
      <ToastStack toasts={toasts} />
    </div>
  )
}
