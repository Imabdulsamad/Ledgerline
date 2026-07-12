import React, { useMemo } from "react";
import { Target } from "lucide-react";
import Card from "../ui/Card";
import { BUDGETS } from "../../constants/budgets";
import { CATEGORIES } from "../../constants/categories";
import { fmt } from "../../utils/format";

/** Actual spend (period-scoped) vs monthly limit, per category. */
export default function BudgetGoals({ transactions }) {
  const spentByCategory = useMemo(() => {
    const totals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
    return totals;
  }, [transactions]);

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Target size={16} style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Budget goals
        </h3>
      </div>
      <ul className="space-y-3.5">
        {Object.entries(BUDGETS).map(([category, limit]) => {
          const used = spentByCategory[category] || 0;
          const pct = Math.min(100, (used / limit) * 100);
          const over = used > limit;
          return (
            <li key={category}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-medium" style={{ color: "var(--text)" }}>
                  {category}
                  {over && (
                    <span className="ml-2 font-semibold" style={{ color: "var(--expense)" }}>
                      over by {fmt(used - limit)}
                    </span>
                  )}
                </span>
                <span className="num" style={{ color: "var(--muted)" }}>
                  {fmt(used)} / {fmt(limit)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: over ? "var(--expense)" : CATEGORIES[category]?.color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
