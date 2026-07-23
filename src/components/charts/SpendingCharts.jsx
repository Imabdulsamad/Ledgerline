import React, { useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";
import Card from "../ui/Card";
import ChartTooltip from "./ChartTooltip";
import { CATEGORIES } from "../../constants/categories";
import { fmt, monthKey, monthLabel } from "../../utils/format";

/**
 * @param transactions     — the period-scoped set (drives the donut)
 * @param allTransactions  — the full history (drives the trend line)
 */
export default function SpendingCharts({ transactions, allTransactions }) {
  const byCategory = useMemo(() => {
    const totals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value, color: CATEGORIES[name].color }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const trend = useMemo(() => {
    const byMonth = {};
    allTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const key = monthKey(t.date);
        byMonth[key] = (byMonth[key] || 0) + t.amount;
      });
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, spent]) => ({ month: monthLabel(key), spent }));
  }, [allTransactions]);

  const total = byCategory.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Spending by category
        </h3>
        <p className="mb-3 text-xs" style={{ color: "var(--muted)" }}>{fmt(total)} total in period</p>
        {byCategory.length === 0 ? (
          <p className="py-10 text-center text-sm" style={{ color: "var(--muted)" }}>
            No expenses in this period yet.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" innerRadius={52} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                    {byCategory.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full space-y-2">
              {byCategory.map((c) => (
                <li key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                  <span style={{ color: "var(--text)" }}>{c.name}</span>
                  <span className="num ml-auto" style={{ color: "var(--muted)" }}>
                    {((c.value / total) * 100).toFixed(0)}% · {fmt(c.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Monthly spend trend
        </h3>
        <p className="mb-3 text-xs" style={{ color: "var(--muted)" }}>Derived from full history</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "var(--muted)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="spent" stroke="var(--accent)" strokeWidth={2} fill="url(#spendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
