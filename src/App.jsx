import React, { useMemo, useState } from "react";
import { Plus, Sun, Moon, Wallet, ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { useTheme } from "./hooks/useTheme";
import { useTransactions } from "./hooks/useTransactions";
<<<<<<< HEAD
import LogoMark from "./components/ui/LogoMark";
=======
>>>>>>> bbef9d6a66ea2bde6012beeadb974c6a094fceea
import MetricCard from "./components/ui/MetricCard";
import MonthSelect from "./components/ui/MonthSelect";
import SpendingCharts from "./components/charts/SpendingCharts";
import UpcomingBills from "./components/widgets/UpcomingBills";
import BudgetGoals from "./components/widgets/BudgetGoals";
import TransactionTable from "./components/transactions/TransactionTable";
import TransactionModal from "./components/transactions/TransactionModal";
import { fmt, monthKey } from "./utils/format";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { transactions, saveTransaction, deleteTransaction, payBill } = useTransactions();

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [modal, setModal] = useState(null); // null | { initial: Transaction | null }

  /** Every month present in the data, newest first — drives the period selector. */
  const monthOptions = useMemo(() => {
    const keys = new Set(transactions.map((t) => monthKey(t.date)));
    return [...keys].sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  /** The period-scoped view every metric, chart, and table row derives from. */
  const scopedTransactions = useMemo(
    () =>
      selectedMonth === "all"
        ? transactions
        : transactions.filter((t) => monthKey(t.date) === selectedMonth),
    [transactions, selectedMonth]
  );

  const metrics = useMemo(() => {
    const income = scopedTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = scopedTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    return { income, expenses, balance: income - expenses, savingsRate };
  }, [scopedTransactions]);

  const handleSave = (data) => {
    saveTransaction(data);
    setModal(null);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
<<<<<<< HEAD
            <LogoMark size={36} />
=======
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "var(--chip)", color: "var(--accent)" }}
            >
              <Wallet size={18} />
            </span>
>>>>>>> bbef9d6a66ea2bde6012beeadb974c6a094fceea
            <div>
              <h1 className="text-lg font-bold leading-tight" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
                Ledgerline
              </h1>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Personal expense tracker</p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <MonthSelect months={monthOptions} value={selectedMonth} onChange={setSelectedMonth} />
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-xl border p-2.5"
              style={{ borderColor: "var(--border)", color: "var(--muted)", background: "var(--surface)" }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setModal({ initial: null })}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              <Plus size={16} /> Add transaction
            </button>
          </div>
        </header>

        <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Balance" value={fmt(metrics.balance)} delta="income minus expenses" icon={Wallet} tone="flat" />
          <MetricCard label="Income" value={fmt(metrics.income)} delta="in selected period" icon={ArrowUpRight} tone="up" />
          <MetricCard label="Expenses" value={fmt(metrics.expenses)} delta="in selected period" icon={ArrowDownRight} tone="down" />
          <MetricCard
            label="Savings rate"
            value={`${metrics.savingsRate}%`}
            delta={metrics.savingsRate >= 20 ? "healthy — above 20%" : "below 20% target"}
            icon={PiggyBank}
            tone={metrics.savingsRate >= 20 ? "up" : "down"}
          />
        </section>

        <section className="mb-5 grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SpendingCharts transactions={scopedTransactions} allTransactions={transactions} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
            <UpcomingBills onPay={payBill} />
            <BudgetGoals transactions={scopedTransactions} />
          </div>
        </section>

        <TransactionTable
          transactions={scopedTransactions}
          onEdit={(t) => setModal({ initial: t })}
          onDelete={deleteTransaction}
        />
      </div>

      {modal && (
        <TransactionModal initial={modal.initial} onSave={handleSave} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
