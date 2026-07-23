import React, { useState } from "react";
import { X } from "lucide-react";
import ReceiptDropzone from "./ReceiptDropzone";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../constants/categories";
import { todayISO } from "../../utils/format";

const EMPTY_FORM = {
  merchant: "",
  amount: "",
  category: "Food",
  date: todayISO(),
  type: "expense",
  notes: "",
};

/** Add/edit form. Edit mode is inferred from `initial.id`. */
export default function TransactionModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initial?.id);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.merchant.trim()) nextErrors.merchant = "Enter a merchant or payee.";
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) nextErrors.amount = "Enter an amount greater than 0.";
    if (!form.date) nextErrors.date = "Pick a date.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
  };

  const categoryOptions = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const inputStyle = {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="fade-in max-h-[92vh] w-full overflow-y-auto rounded-t-2xl p-6 sm:max-w-lg sm:rounded-2xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
            {isEdit ? "Edit transaction" : "Add transaction"}
          </h3>
          <button onClick={onClose} className="rounded-lg p-1.5" style={{ color: "var(--muted)" }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {!isEdit && (
          <ReceiptDropzone
            onParsed={(parsed) => setForm((f) => ({ ...f, type: "expense", ...parsed }))}
          />
        )}

        <div className="mb-4 grid grid-cols-2 gap-2">
          {["expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => setForm((f) => ({ ...f, type: t, category: t === "income" ? "Salary" : "Food" }))}
              className="rounded-xl py-2 text-sm font-semibold capitalize transition-colors"
              style={form.type === t
                ? { background: "var(--chip)", color: "var(--accent)", border: "1px solid var(--accent)" }
                : { background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--muted)" }}>Merchant / payee</label>
            <input
              value={form.merchant}
              onChange={(e) => set("merchant", e.target.value)}
              placeholder="e.g. Imtiaz Super"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
            {errors.merchant && <p className="mt-1 text-xs" style={{ color: "var(--expense)" }}>{errors.merchant}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--muted)" }}>Amount (Rs)</label>
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
                className="num w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
              {errors.amount && <p className="mt-1 text-xs" style={{ color: "var(--expense)" }}>{errors.amount}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--muted)" }}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
              {errors.date && <p className="mt-1 text-xs" style={{ color: "var(--expense)" }}>{errors.date}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--muted)" }}>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            >
              {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold" style={{ color: "var(--muted)" }}>Notes (optional)</label>
            <input
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Anything worth remembering"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent)" }}
          >
            {isEdit ? "Save changes" : "Add transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
