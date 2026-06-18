# TestPilot AI — frontend

React + Vite + Tailwind CSS implementation of the design spec, fully wired up with mock data so it's demoable without the backend running.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. Paste a workflow (e.g. `Login → Dashboard → Messages`) and click **Analyze workflow** — everything downstream (Modules, Checklist, Test Cases, Issue Analysis, Tracker) runs off mock data shaped exactly like the real FastAPI responses.

## Connecting the real backend

All backend calls live in `src/api/TestPilotApi.js`. Each function currently awaits a short delay and returns mock data; the real `fetch` calls are written out as comments directly above the mock return, matching the request/response shape your FastAPI/LangGraph endpoints already use. Uncomment and point `VITE_API_BASE_URL` (in a `.env` file) at your backend, and nothing else in the app needs to change — every component already consumes data in that shape.

## Structure

```
src/
  api/            backend calls (currently mocked)
  data/           mock data
  components/
    layout/       HeaderBar, WorkflowInputPanel, TabBar, CommandPalette
    shared/       Pill, ConfidenceChip, StatusPill, Card, EmptyState,
                   SkeletonBlock, ToastStack, TestCaseTable, SegmentedControl
    tabs/         ModulesTab, ChecklistTab, TestCasesTab, IssueAnalysisTab, TrackerTab
  App.jsx         state + wiring
  index.css       design tokens (colors, fonts) as a Tailwind v4 @theme block
```

## Design notes

- **Confidence chips** (`src/components/shared/ConfidenceChip.jsx`) are the core visual convention: solid fill = the AI is confident, dashed outline = inferred/assumed. Used in Modules and Checklist.
- **Test Cases and Tracker** share one table component (`shared/TestCaseTable.jsx`) since they're the same data viewed two ways.
- **Command palette** (⌘K / Ctrl+K) jumps to any tab or re-opens the workflow editor.
- Full rationale for every layout, color, and interaction decision is in the design spec doc from the earlier conversation.
