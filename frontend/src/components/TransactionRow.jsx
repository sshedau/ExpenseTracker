import {
  Trash2
} from "lucide-react";
import {fmt, getCategoryMeta} from "../utils/format";

function TransactionRow({ tx, onDelete }) {
  const cat = getCategoryMeta(tx.category);
  const Icon = cat.icon;
  const isIncome = tx.amount > 0;

  return (
    <div className="flex items-center gap-3 py-3 px-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-150 group cursor-default">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: isIncome ? "#10b98122" : cat.color + "22" }}>
        <Icon size={15} style={{ color: isIncome ? "#10b981" : cat.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{tx.description}</div>
        <div className="text-xs text-slate-400 dark:text-slate-500">{tx.date} · {cat.label}</div>
      </div>
      <div className={`text-sm font-bold tabular-nums mr-1 ${isIncome ? "text-emerald-500" : "text-slate-800 dark:text-rose-500"}`}>
        {isIncome ? "+" : "−"}{fmt(tx.amount)}
      </div>
      <button
        onClick={() => onDelete(tx.id)}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all duration-150"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export default TransactionRow;