interface Props {
  findings: number;
  files: number;
  lines: number;
}

export function ReviewMetrics({ findings, files, lines }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border p-5">
        <p className="text-sm text-zinc-500">Findings</p>

        <h3 className="mt-2 text-3xl font-bold">{findings}</h3>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-zinc-500">Files Reviewed</p>

        <h3 className="mt-2 text-3xl font-bold">{files}</h3>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-zinc-500">Lines Analyzed</p>

        <h3 className="mt-2 text-3xl font-bold">{lines}</h3>
      </div>
    </div>
  );
}
