# Ledgerline — Expense Tracker

A professional-grade personal finance dashboard built with React, Vite, Tailwind CSS, and Recharts. Designed as a portfolio project demonstrating clean architecture, unidirectional state flow, and data-driven UI.

## Features

- **Period scoping** — a month selector in the header scopes every metric, chart, budget bar, and table row to the chosen month (or all time). All derived values recompute from a single scoped source.
- **Summary metrics** — balance, income, expenses, and savings rate (with a 20% health threshold) as distinct metric cards.
- **Data visualization** — category-distribution donut and a monthly spend trend derived from real transaction history (not hardcoded).
- **Transaction management** — add/edit modal with validation, drag-and-drop receipt upload with a simulated OCR autofill flow, sortable + searchable table with type filter chips, inline two-step delete.
- **Upcoming bills** — recurring expenses with urgency states; paying a bill creates a real categorized transaction that ripples through every widget.
- **Budget goals** — per-category monthly limits with progress bars and over-budget warnings.
- **CSV export** — exports exactly the rows currently visible (filters + sort applied), with proper field quoting.
- **Theming** — dark/light toggle via CSS variables, seeded from the OS preference, persisted across sessions.
- **Persistence** — all data survives reloads via a reusable `usePersistedState` hook (fails soft in private browsing).
- Fully responsive, reduced-motion respected, keyboard-accessible drop zone.

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
```

## Project structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Composition root: owns period scope + modal state
├── styles/
│   └── theme.css             # Tailwind directives + CSS variable theme tokens
├── constants/                # Static domain data — no logic
│   ├── categories.js         # Category names + colors (single source of truth)
│   ├── budgets.js            # Monthly limits per category
│   ├── seedData.js           # Demo transactions + bills
│   └── storageKeys.js        # Namespaced localStorage keys
├── utils/                    # Pure functions — no React, fully testable
│   ├── format.js             # Currency + date formatting
│   ├── csv.js                # CSV export with safe quoting
│   └── id.js                 # Collision-safe id generation
├── hooks/                    # Stateful logic — no UI
│   ├── usePersistedState.js  # localStorage-backed useState
│   ├── useTheme.js           # Theme + OS preference + <html> attribute
│   └── useTransactions.js    # THE data layer: save/delete/payBill
├── services/                 # External-world boundaries
│   └── ocr.js                # Receipt parsing (simulated; swap for Tesseract.js / vision API)
└── components/
    ├── ui/                   # Generic, reusable primitives
    │   ├── Card.jsx
    │   ├── MetricCard.jsx
    │   └── MonthSelect.jsx
    ├── charts/
    │   ├── SpendingCharts.jsx
    │   └── ChartTooltip.jsx
    ├── widgets/
    │   ├── UpcomingBills.jsx
    │   └── BudgetGoals.jsx
    └── transactions/
        ├── TransactionTable.jsx
        ├── TransactionModal.jsx
        └── ReceiptDropzone.jsx
```

### Why this structure scales

- **Components never touch storage or parsing directly.** They receive data and callbacks. When you add a backend, you rewrite `useTransactions` to call your API (or wrap it in React Query) and every component keeps working.
- **`services/` is the seam for the outside world.** The OCR module exposes one promise-based function; a real Tesseract.js or vision-API implementation slots in without touching the dropzone component.
- **`utils/` is pure and unit-testable** with zero React dependencies — the first place to point Vitest at.
- **`constants/` centralizes domain vocabulary.** Adding a category means editing one file; every chart, chip, and budget bar picks it up.

## Roadmap (natural next commits)

1. **TypeScript migration** — `Transaction`, `Bill`, and `Category` interfaces; the folder structure maps 1:1 to `.ts`/`.tsx`.
2. **API layer** — replace `usePersistedState` inside `useTransactions` with React Query + a REST/Supabase backend.
3. **Budget editor** — limits are currently constants; move them into persisted state with an edit UI.
4. **Real OCR** — Tesseract.js client-side, or a serverless function calling a vision API.
5. **Tests** — Vitest for `utils/`, React Testing Library for the modal validation flow.
6. **Bill cycle reset** — paid state currently persists indefinitely; reset it when a new billing month starts.
