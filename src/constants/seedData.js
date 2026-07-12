import { createId } from "../utils/id";

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

const seed = (offsetDays, merchant, category, amount, type, notes = "") => ({
  id: createId(),
  date: daysAgo(offsetDays),
  merchant,
  category,
  amount,
  type,
  notes,
});

/**
 * Demo data spanning ~5 months so the trend chart and month
 * selector have something real to work with on first run.
 */
export const SEED_TRANSACTIONS = [
  // Current month
  seed(1,   "Cheezious",         "Food",          1450,   "expense", "Team lunch"),
  seed(2,   "Careem",            "Transport",     620,    "expense"),
  seed(3,   "Client — Fleet MS", "Freelance",     85000,  "income",  "Final 50% payment"),
  seed(4,   "K-Electric",        "Utilities",     8300,   "expense", "Monthly bill"),
  seed(5,   "Netflix",           "Entertainment", 1100,   "expense"),
  seed(6,   "Imtiaz Super",      "Shopping",      5240,   "expense", "Groceries"),
  seed(8,   "Landlord",          "Rent",          45000,  "expense", "Monthly rent"),
  seed(10,  "Salary",            "Salary",        120000, "income"),
  // Last month
  seed(35,  "Foodpanda",         "Food",          2980,   "expense"),
  seed(38,  "Landlord",          "Rent",          45000,  "expense", "Monthly rent"),
  seed(40,  "Salary",            "Salary",        120000, "income"),
  seed(42,  "PSO",               "Transport",     4000,   "expense", "Fuel"),
  seed(45,  "K-Electric",        "Utilities",     9100,   "expense"),
  seed(48,  "Daraz",             "Shopping",      3600,   "expense", "SSD upgrade"),
  // 2 months ago
  seed(66,  "Landlord",          "Rent",          45000,  "expense", "Monthly rent"),
  seed(68,  "Salary",            "Salary",        120000, "income"),
  seed(70,  "Cinepax",           "Entertainment", 1600,   "expense"),
  seed(72,  "Imtiaz Super",      "Shopping",      6100,   "expense", "Groceries"),
  seed(75,  "K-Electric",        "Utilities",     11400,  "expense", "Peak summer bill"),
  // 3 months ago
  seed(96,  "Landlord",          "Rent",          45000,  "expense", "Monthly rent"),
  seed(98,  "Salary",            "Salary",        120000, "income"),
  seed(100, "Foodpanda",         "Food",          4200,   "expense"),
  seed(104, "Careem",            "Transport",     2800,   "expense"),
  // 4 months ago
  seed(126, "Landlord",          "Rent",          45000,  "expense", "Monthly rent"),
  seed(128, "Salary",            "Salary",        120000, "income"),
  seed(131, "K-Electric",        "Utilities",     7600,   "expense"),
  seed(134, "Cheezious",         "Food",          2100,   "expense"),
];

export const UPCOMING_BILLS = [
  { id: "bill-rent",     name: "Rent",       amount: 45000, dueInDays: 5,  cadence: "Monthly", category: "Rent" },
  { id: "bill-ke",       name: "K-Electric", amount: 9000,  dueInDays: 9,  cadence: "Monthly", category: "Utilities" },
  { id: "bill-internet", name: "Internet",   amount: 3500,  dueInDays: 12, cadence: "Monthly", category: "Utilities" },
  { id: "bill-netflix",  name: "Netflix",    amount: 1100,  dueInDays: 18, cadence: "Monthly", category: "Entertainment" },
];
