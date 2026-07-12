import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "./Card";

export default function MetricCard({ label, value, delta, icon: Icon, tone }) {
  const toneColor =
    tone === "up" ? "var(--income)" : tone === "down" ? "var(--expense)" : "var(--accent)";

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {label}
        </span>
        <span className="rounded-lg p-2" style={{ background: "var(--chip)", color: toneColor }}>
          <Icon size={16} />
        </span>
      </div>
      <div className="num text-2xl font-semibold" style={{ color: "var(--text)" }}>{value}</div>
      {delta && (
        <div className="flex items-center gap-1 text-xs font-medium" style={{ color: toneColor }}>
          {tone === "down" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
          {delta}
        </div>
      )}
    </Card>
  );
}
