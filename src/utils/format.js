/** Currency formatter — single place to swap locale/currency later. */
export const fmt = (amount) => "Rs " + Math.abs(amount).toLocaleString("en-PK");

export const todayISO = () => new Date().toISOString().slice(0, 10);

/** "2026-07-12" -> "2026-07" */
export const monthKey = (isoDate) => isoDate.slice(0, 7);

/** "2026-07" -> "Jul 26" */
export const monthLabel = (key) => {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en", { month: "short" }) + " " + year.slice(2);
};
