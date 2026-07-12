import React from "react";
import { CalendarClock, Check } from "lucide-react";
import Card from "../ui/Card";
import { UPCOMING_BILLS } from "../../constants/seedData";
import { usePersistedState } from "../../hooks/usePersistedState";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { fmt } from "../../utils/format";

export default function UpcomingBills({ onPay }) {
  const [paidIds, setPaidIds] = usePersistedState(STORAGE_KEYS.paidBills, []);

  const pay = (bill) => {
    setPaidIds((ids) => [...ids, bill.id]);
    onPay(bill);
  };

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <CalendarClock size={16} style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Upcoming bills
        </h3>
      </div>
      <ul className="space-y-3">
        {UPCOMING_BILLS.map((b) => {
          const urgent = b.dueInDays <= 7;
          const paid = paidIds.includes(b.id);
          return (
            <li key={b.id} className="flex items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" style={{ color: "var(--text)" }}>{b.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{b.cadence}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="num text-sm font-semibold" style={{ color: "var(--text)" }}>{fmt(b.amount)}</p>
                <p
                  className="text-xs font-medium"
                  style={{ color: paid ? "var(--income)" : urgent ? "var(--expense)" : "var(--muted)" }}
                >
                  {paid ? "paid" : `due in ${b.dueInDays}d`}
                </p>
              </div>
              {paid ? (
                <span className="rounded-lg p-1.5" style={{ color: "var(--income)" }}>
                  <Check size={14} />
                </span>
              ) : (
                <button
                  onClick={() => pay(b)}
                  className="rounded-lg border px-2.5 py-1 text-xs font-semibold"
                  style={{ borderColor: "var(--border)", color: "var(--accent)", background: "var(--surface-2)" }}
                >
                  Pay
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
