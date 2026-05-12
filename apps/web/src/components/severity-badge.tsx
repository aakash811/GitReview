interface Props {
  severity: string;
}

const styles: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/30 ring-red-500/10",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/30 ring-orange-500/10",
  medium:
    "bg-amber-500/10 text-amber-400 border-amber-500/30 ring-amber-500/10",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/30 ring-blue-500/10",
};

const dots: Record<string, string> = {
  critical: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-amber-400",
  low: "bg-blue-400",
};

export function SeverityBadge({ severity }: Props) {
  const key = severity.toLowerCase();
  const style = styles[key] ?? styles.low;
  const dot = dots[key] ?? dots.low;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ring-1 ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {severity}
    </span>
  );
}
