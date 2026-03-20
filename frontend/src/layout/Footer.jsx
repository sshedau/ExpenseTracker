import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { isDark, override, systemTheme } = useTheme();
  const isOverriding = override !== null;

  return (
    <footer className="mt-10 flex items-center justify-between text-[10px] font-medium text-slate-300 dark:text-slate-600">
      <span>Expense Tracker · Personal Finance Dashboard</span>
      <span className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-indigo-500" : "bg-amber-400"}`} />
        {isOverriding
          ? `${isDark ? "Dark" : "Light"} (manual)`
          : `${isDark ? "Dark" : "Light"} (system: ${systemTheme})`}
      </span>
    </footer>
  );
}