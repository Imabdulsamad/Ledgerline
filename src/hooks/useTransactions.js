import { useCallback } from "react";
import { usePersistedState } from "./usePersistedState";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { SEED_TRANSACTIONS } from "../constants/seedData";
import { createId } from "../utils/id";
import { todayISO } from "../utils/format";

/**
 * The single data layer for transactions.
 * Swap usePersistedState for an API-backed hook later (React Query etc.)
 * and every component keeps working unchanged.
 */
export function useTransactions() {
  const [transactions, setTransactions] = usePersistedState(
    STORAGE_KEYS.transactions,
    SEED_TRANSACTIONS
  );

  /** Handles both add (no matching id) and edit (existing id). */
  const saveTransaction = useCallback((data) => {
    setTransactions((prev) => {
      const exists = data.id && prev.some((t) => t.id === data.id);
      return exists
        ? prev.map((t) => (t.id === data.id ? { ...t, ...data } : t))
        : [{ ...data, id: createId() }, ...prev];
    });
  }, [setTransactions]);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, [setTransactions]);

  /** Converts an upcoming bill into a real expense transaction. */
  const payBill = useCallback((bill) => {
    setTransactions((prev) => [
      {
        id: createId(),
        date: todayISO(),
        merchant: bill.name,
        category: bill.category,
        amount: bill.amount,
        type: "expense",
        notes: `${bill.cadence} bill — paid from dashboard`,
      },
      ...prev,
    ]);
  }, [setTransactions]);

  const resetToSeed = useCallback(() => {
    setTransactions(SEED_TRANSACTIONS);
  }, [setTransactions]);

  return { transactions, saveTransaction, deleteTransaction, payBill, resetToSeed };
}
