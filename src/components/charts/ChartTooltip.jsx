import React from "react";
import { fmt } from "../../utils/format";

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-3 py-2 text-xs shadow-lg"
      style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text)" }}
    >
      <div className="font-semibold">{payload[0].name || label}</div>
      <div className="num">{fmt(payload[0].value)}</div>
    </div>
  );
}
