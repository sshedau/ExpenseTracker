import {
  ArrowUpRight, ArrowDownRight
} from "lucide-react";

function MetricCard({ label, value, sub, positive, icon: Icon, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: accent + "22" }}
        >
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>
      <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1.5">{value}</div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-500" : "text-rose-500"}`}>
        {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {sub}
      </div>
      {/* Decorative accent bar */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}66, transparent)` }} />
    </div>
  );
}

export default MetricCard;