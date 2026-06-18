import {
  CheckCircle2,
  XCircle,
  Clock3,
  Ban,
  ClipboardList,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import EmptyState from "../shared/EmptyState";
import TestCaseTable from "../shared/TestCaseTable";

function MetricCard({ icon, label, value, tone }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted">
        {icon}
        <span>{label}</span>
      </div>

      <p className={`text-3xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

export default function TrackerTab({
  testCases = [],
  onStatusChange,
  onJumpToIssue,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const hasTestCases = testCases.length > 0;

  const counts = useMemo(() => {
    const result = {
      total: testCases.length,
      passed: 0,
      failed: 0,
      blocked: 0,
      pending: 0,
    };

    testCases.forEach((tc) => {
      const status = (tc.status || "").toLowerCase().trim();

      if (status === "passed" || status === "pass") {
        result.passed++;
      } else if (status === "failed" || status === "fail") {
        result.failed++;
      } else if (status === "blocked") {
        result.blocked++;
      } else {
        result.pending++;
      }
    });

    return result;
  }, [testCases]);

  const executed =
    counts.passed +
    counts.failed +
    counts.blocked;

  const progress =
    counts.total === 0
      ? 0
      : Math.round((executed / counts.total) * 100);

  const filteredTestCases = useMemo(() => {
    let filtered = [...testCases];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      filtered = filtered.filter((tc) =>
        [
          tc.id,
          tc.description,
          tc.module,
          tc.category,
          tc.priority,
          tc.status,
        ]
          .filter(Boolean)
          .some((value) =>
            value.toString().toLowerCase().includes(query)
          )
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((tc) => {
        const status = (tc.status || "").toLowerCase().trim();

        switch (statusFilter) {
          case "passed":
            return status === "passed" || status === "pass";

          case "failed":
            return status === "failed" || status === "fail";

          case "blocked":
            return status === "blocked";

          case "pending":
            // Everything not executed
            return ![
              "passed",
              "pass",
              "failed",
              "fail",
              "blocked",
            ].includes(status);

          default:
            return true;
        }
      });
    }

    return filtered;
  }, [search, statusFilter, testCases]);

  return (
    <div className="p-6">
      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard
          icon={<ClipboardList size={18} />}
          label="Total Tests"
          value={counts.total}
          tone="text-ink"
        />

        <MetricCard
          icon={<CheckCircle2 size={18} />}
          label="Passed"
          value={counts.passed}
          tone="text-verified"
        />

        <MetricCard
          icon={<XCircle size={18} />}
          label="Failed"
          value={counts.failed}
          tone="text-flagged"
        />

        <MetricCard
          icon={<Ban size={18} />}
          label="Blocked"
          value={counts.blocked}
          tone="text-orange-500"
        />

        <MetricCard
          icon={<Clock3 size={18} />}
          label="Not Executed"
          value={counts.pending}
          tone="text-ochre"
        />
      </div>

      {/* Progress */}

      <div className="mt-8 rounded-xl border border-hairline bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">
            Execution Progress
          </h3>

          <span className="text-sm font-semibold text-signal">
            {progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-signal transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-3 text-sm text-muted">
          {executed} of {counts.total} test cases executed
        </p>
      </div>

      {/* Search */}

      {hasTestCases && (
        <>
          <div className="relative mt-8">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, description or module..."
              className="w-full rounded-xl border border-hairline bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:border-signal"
            />
          </div>

          {/* Status Chips */}

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["passed", "Passed"],
              ["failed", "Failed"],
              ["blocked", "Blocked"],
              ["pending", "Not Executed"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  statusFilter === value
                    ? "border-signal bg-signal text-white"
                    : "border-hairline bg-surface hover:border-signal hover:text-signal"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mb-3 mt-5 flex items-center justify-between">
            <p className="text-sm text-muted">
              Showing <b>{filteredTestCases.length}</b> of{" "}
              <b>{counts.total}</b> test cases
            </p>

            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="text-sm text-signal hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </>
      )}

      {/* Table */}

      {!hasTestCases ? (
        <div className="mt-8">
          <EmptyState
            title="Nothing to track yet"
            description="Execute some test cases to populate the tracker."
          />
        </div>
      ) : (
        <div className="mt-6">
          <TestCaseTable
            testCases={filteredTestCases}
            onStatusChange={onStatusChange}
            onJumpToIssue={onJumpToIssue}
          />
        </div>
      )}
    </div>
  );
}