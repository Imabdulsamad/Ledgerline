/** Exports the given rows as a CSV download. Quotes fields safely. */
export function exportTransactionsCsv(rows, filename = "transactions.csv") {
  const escape = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const header = ["Date", "Merchant", "Category", "Type", "Amount", "Notes"];
  const lines = rows.map((t) =>
    [t.date, t.merchant, t.category, t.type, t.amount, t.notes || ""].map(escape).join(",")
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
