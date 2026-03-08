import { Wallet, Sun, Moon, Monitor, Settings } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { isDark, toggle, override } = useTheme();
  const isOverriding = override !== null;
  const ThemeIcon = isOverriding ? (isDark ? Moon : Sun) : Monitor;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 mb-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm backdrop-blur">      
      {/* Left — Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
          <Wallet size={17} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight leading-none text-slate-900 dark:text-white">
            Ledger<span className="text-indigo-500">.</span>
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            Personal Finance Dashboard
          </p>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
        >
          <ThemeIcon size={15} />
        </button>

        {/* Settings Button */}
        <button
          title="Settings"
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
        >
          <Settings size={15} />
        </button>

      </div>
    </header>
  );
}