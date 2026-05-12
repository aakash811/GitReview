interface Props {
  level: string;
  large?: boolean;
}

const riskConfig: Record<
  string,
  { color: string; dot: string; label: string }
> = {
  critical: { color: "text-red-400", dot: "bg-red-400", label: "Critical" },
  high: { color: "text-orange-400", dot: "bg-orange-400", label: "High" },
  medium: { color: "text-amber-400", dot: "bg-amber-400", label: "Medium" },
  low: { color: "text-emerald-400", dot: "bg-emerald-400", label: "Low" },
};

export function RiskBadge({ level, large }: Props) {
  const config = riskConfig[level.toLowerCase()] ?? riskConfig.low;

  return (
    <div className={`flex items-center gap-2 ${large ? "" : ""}`}>
      <span className={`relative flex h-2 w-2`}>
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.dot} opacity-50`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`}
        />
      </span>
      <span
        className={`font-mono font-bold capitalize ${config.color} ${large ? "text-2xl" : "text-sm"}`}
      >
        {config.label}
      </span>
    </div>
  );
}
