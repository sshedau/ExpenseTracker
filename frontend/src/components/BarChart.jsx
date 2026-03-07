import {fmt} from "../utils/format"

function BarChart({ data, isDark }) {
  const max = Math.max(...data.map((d) => d.spend));
  const current = data[data.length - 1];

  return (
    <div className="flex items-end justify-between gap-2 h-40 px-1">
      {data.map((d, i) => {
        const pct = (d.spend / max) * 100;
        const isLast = i === data.length - 1;
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
            <div
              className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 tabular-nums"
              style={{ color: isLast ? "#6366f1" : isDark ? "#94a3b8" : "#64748b" }}
            >
              {fmt(d.spend)}
            </div>
            <div className="w-full flex items-end" style={{ height: "96px" }}>
              <div
                className="w-full rounded-t-lg transition-all duration-500 cursor-default relative overflow-hidden"
                style={{
                  height: `${pct}%`,
                  background: isLast
                    ? "linear-gradient(180deg, #818cf8, #6366f1)"
                    : isDark ? "#1e293b" : "#f1f5f9",
                  border: isLast ? "none" : `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                }}
              >
                {isLast && (
                  <div className="absolute inset-0 opacity-30"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.3), transparent)" }}
                  />
                )}
              </div>
            </div>
            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: isLast ? "#6366f1" : isDark ? "#64748b" : "#94a3b8" }}
            >
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default BarChart;