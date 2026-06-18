import { Boxes, ClipboardCheck, FileText, TriangleAlert, ArrowRight } from "lucide-react";

function SummaryCard({ icon, title, value }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-paper p-2">
          {icon}
        </div>

        <div>
          <p className="text-sm text-muted">
            {title}
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-ink">
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisSummary({
  analysis,
  testCases,
  onContinue,
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">

      <div className="mb-8">

        <h1 className="text-3xl font-semibold text-ink">
          Analysis Complete
        </h1>

        <p className="mt-2 text-muted">
          BugMind has successfully analyzed your workflow.
        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          icon={<Boxes size={20} />}
          title="Modules"
          value={analysis.confirmedModules.length}
        />

        <SummaryCard
          icon={<ClipboardCheck size={20} />}
          title="Checklist Items"
          value={analysis.checklist.length}
        />

        <SummaryCard
          icon={<FileText size={20} />}
          title="Test Cases"
          value={testCases.length}
        />

        <SummaryCard
          icon={<TriangleAlert size={20} />}
          title="High Risk Areas"
          value={analysis.highRiskAreas.length}
        />

      </div>

      <div className="mt-10 flex justify-end">

        <button
          onClick={onContinue}
          className="flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-white transition hover:opacity-90"
        >
          Open Workspace

          <ArrowRight size={18} />
        </button>

      </div>

    </div>
  );
}