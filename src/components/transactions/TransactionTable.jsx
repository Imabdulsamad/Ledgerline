import React, { useMemo, useState } from "react";
import { Search, Pencil, Trash2, ChevronUp, ChevronDown, Download } from "lucide-react";
import Card from "../ui/Card";
import { CATEGORIES } from "../../constants/categories";
import { fmt } from "../../utils/format";
import { exportTransactionsCsv } from "../../utils/csv";

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | expense | income
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [confirmId, setConfirmId] = useState(null);

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = transactions.filter(
      (t) =>
        (typeFilter === "all" || t.type === typeFilter) &&
        (!q ||
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.notes || "").toLowerCase().includes(q))
    );
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === "amount") return (a.amount - b.amount) * dir;
      if (sortKey === "merchant") return a.merchant.localeCompare(b.merchant) * dir;
      if (sortKey === "category") return a.category.localeCompare(b.category) * dir;
      return a.date.localeCompare(b.date) * dir;
    });
  }, [transactions, query, typeFilter, sortKey, sortDir]);

  const SortHeader = ({ label, k, className = "" }) => (
    <th className={`px-4 py-3 text-left ${className}`}>
      <button
        onClick={() => toggleSort(k)}
        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider"
        style={{ color: sortKey === k ? "var(--accent)" : "var(--muted)" }}
      >
        {label}
        {sortKey === k && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </button>
    </th>
  );

  return (
    <Card className="p-0">
      <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Transactions
        </h3>
        <div className="flex items-center gap-1.5">
          {["all", "expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
              style={typeFilter === t
                ? { background: "var(--chip)", color: "var(--accent)", border: "1px solid var(--accent)" }
                : { background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => exportTransactionsCsv(rows)}
          className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold sm:ml-auto"
          style={{ borderColor: "var(--border)", color: "var(--text)", background: "var(--surface-2)" }}
        >
          <Download size={13} /> Export CSV
        </button>
        <div className="relative sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchant, category, notes"
            className="w-full rounded-xl py-2 pl-9 pr-3 text-sm outline-none"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <SortHeader label="Date" k="date" />
              <SortHeader label="Merchant" k="merchant" />
              <SortHeader label="Category" k="category" />
              <SortHeader label="Amount" k="amount" className="text-right" />
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="group" style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="num whitespace-nowrap px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>{t.date}</td>
                <td className="px-4 py-3">
                  <p className="font-medium" style={{ color: "var(--text)" }}>{t.merchant}</p>
                  {t.notes && <p className="text-xs" style={{ color: "var(--muted)" }}>{t.notes}</p>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ background: "var(--surface-2)", color: "var(--text)" }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: CATEGORIES[t.category]?.color }} />
                    {t.category}
                  </span>
                </td>
                <td
                  className="num whitespace-nowrap px-4 py-3 text-right font-semibold"
                  style={{ color: t.type === "income" ? "var(--income)" : "var(--text)" }}
                >
                  {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  {confirmId === t.id ? (
                    <span className="inline-flex items-center gap-2 text-xs">
                      <span style={{ color: "var(--muted)" }}>Delete?</span>
                      <button
                        onClick={() => { onDelete(t.id); setConfirmId(null); }}
                        className="font-semibold"
                        style={{ color: "var(--expense)" }}
                      >
                        Yes
                      </button>
                      <button onClick={() => setConfirmId(null)} style={{ color: "var(--muted)" }}>No</button>
                    </span>
                  ) : (
                    <span className="inline-flex gap-1">
                      <button
                        onClick={() => onEdit(t)}
                        aria-label={`Edit ${t.merchant}`}
                        className="rounded-lg p-1.5"
                        style={{ color: "var(--muted)" }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmId(t.id)}
                        aria-label={`Delete ${t.merchant}`}
                        className="rounded-lg p-1.5"
                        style={{ color: "var(--expense)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm" style={{ color: "var(--muted)" }}>
                  No transactions match. Try a different search or add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
