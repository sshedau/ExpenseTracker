import { CATEGORIES } from "../data/data";
import {fmt} from "../utils/format"

function CategoryBreakdown({ transactions }) {
  const byCategory = CATEGORIES.map((cat) => {
    const total = transactions
      .filter((t) => t.category === cat.id && t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    return { ...cat, total };
  }).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  const grandTotal = byCategory.reduce((s, c) => s + c.total, 0);

  return (
    <div className="space-y-3">
      {byCategory.map((cat) => {
        const Icon = cat.icon;
        const pct = grandTotal > 0 ? (cat.total / grandTotal) * 100 : 0;
        return (
          <div key={cat.id} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
              style={{ backgroundColor: cat.color + "22" }}>
              <Icon size={14} style={{ color: cat.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{cat.label}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">{fmt(cat.total)}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryBreakdown;