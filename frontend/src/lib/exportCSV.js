export function exportTestCasesCSV(
  testCases,
  fileName = "BugMind_TestCases"
) {
  if (!testCases || testCases.length === 0) {
    alert("No test cases available to export.");
    return;
  }

  const headers = [
    "ID",
    "Description",
    "Module",
    "Category",
    "Priority",
    "Status",
  ];

  const rows = testCases.map((tc) => [
    tc.id ?? "",
    tc.description ?? "",
    tc.module ?? "",
    tc.category ?? "",
    tc.priority ?? "",
    tc.status ?? "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `${fileName}_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}