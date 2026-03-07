import { useState, useEffect, useContext, createContext, useCallback } from "react";

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [override, setOverride] = useState(() => {
    try { return localStorage.getItem("theme-override") || null; }
    catch { return null; }
  });
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // Listen for OS-level theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolvedTheme = override || systemTheme;
  const isDark = resolvedTheme === "dark";

  const toggle = useCallback(() => {
    const next = isDark ? "light" : "dark";
    setOverride(next);
    try { localStorage.setItem("theme-override", next); } catch {}
  }, [isDark]);

  const resetToSystem = useCallback(() => {
    setOverride(null);
    try { localStorage.removeItem("theme-override"); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggle, resetToSystem, override, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = () => useContext(ThemeContext);
export { ThemeProvider, useTheme };