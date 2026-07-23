import { useEffect, useState } from "react";

/**
 * useState that survives reloads via localStorage.
 * Fails soft: private browsing / quota errors fall back to memory.
 */
export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage unavailable — state stays in memory for the session.
    }
  }, [key, state]);

  return [state, setState];
}
