/**
 * Receipt OCR service — currently a simulation.
 *
 * The rest of the app only knows this signature:
 *   parseReceipt(file: File) -> Promise<{ merchant, amount, category, notes }>
 *
 * To go real, swap the body for Tesseract.js (client-side) or a
 * vision API call (server-side) without touching any component.
 */
const MOCK_RECEIPTS = [
  { merchant: "Imtiaz Super", amount: 4380, category: "Shopping",  notes: "Receipt #8841 — groceries" },
  { merchant: "Cheezious",    amount: 1890, category: "Food",      notes: "Receipt #2210 — dine-in" },
  { merchant: "PSO Fuel",     amount: 5200, category: "Transport", notes: "Receipt #7702 — petrol" },
  { merchant: "K-Electric",   amount: 8650, category: "Utilities", notes: "Bill ref KE-3391" },
];

const SCAN_DURATION_MS = 1400;

export function parseReceipt(file) {
  // Deterministic pick so the demo feels like a parser, not a coin flip.
  const result = MOCK_RECEIPTS[file.name.length % MOCK_RECEIPTS.length];
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...result }), SCAN_DURATION_MS);
  });
}
