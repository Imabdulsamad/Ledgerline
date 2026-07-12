import { useEffect } from "react";
import { usePersistedState } from "./usePersistedState";
import { STORAGE_KEYS } from "../constants/storageKeys";

const systemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

/** Theme state persisted across sessions, seeded from the OS preference. */
export function useTheme() {
  const [theme, setTheme] = usePersistedState(
    STORAGE_KEYS.theme,
    systemPrefersDark() ? "dark" : "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
