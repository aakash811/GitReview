interface Props {
  metrics: {
    totalFindings: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const severityConfig = [
  {
    key: "critical" as const,
    label: "Critical",
    color: "bg-red-500",
    text: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/8",
  },
  {
    key: "high" as const,
    label: "High",
    color: "bg-orange-500",
    text: "text-orange-400",
    border: "border-orange-500/20",
    bg: "bg-orange-500/8",
  },
  {
    key: "medium" as const,
    label: "Medium",
    color: "bg-amber-500",
    text: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/8",
  },
  {
    key: "low" as const,
    label: "Low",
    color: "bg-blue-500",
    text: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/8",
  },
];

export function ReviewMetrics({ metrics }: Props) {
  const total = metrics.totalFindings || 1;

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-zinc-300">
            Severity Breakdown
          </h2>
          <p className="mt-0.5 text-xs text-zinc-600">
            {metrics.totalFindings} total findings across this pull request
          </p>
        </div>
        <div className="font-mono text-3xl font-bold text-white">
          {metrics.totalFindings}
          <span className="ml-1.5 text-sm font-normal text-zinc-500">
            findings
          </span>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="mb-5 flex h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        {severityConfig.map(({ key, color }) => {
          const pct = (metrics[key] / total) * 100;
          return pct > 0 ? (
            <div
              key={key}
              className={`${color} h-full transition-all`}
              style={{ width: `${pct}%` }}
            />
          ) : null;
        })}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {severityConfig.map(({ key, label, color, text, border, bg }) => (
          <div key={key} className={`rounded-xl border ${border} ${bg} p-4`}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
              <p
                className={`font-mono text-[10px] font-bold uppercase tracking-widest ${text}`}
              >
                {label}
              </p>
            </div>
            <p className="font-mono text-3xl font-bold text-white">
              {metrics[key]}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-zinc-600">
              {total > 0 ? Math.round((metrics[key] / total) * 100) : 0}% of
              total
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
