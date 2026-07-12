import React from "react";
import { monthLabel } from "../../utils/format";

/** Period scoper — "All time" plus every month present in the data. */
export default function MonthSelect({ months, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Select period"
      className="rounded-xl border px-3 py-2.5 text-sm font-medium outline-none"
      style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
    >
      <option value="all">All time</option>
      {months.map((m) => (
        <option key={m} value={m}>{monthLabel(m)}</option>
      ))}
    </select>
  );
}
