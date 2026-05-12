"use client";

interface Props {
  active: string;
  setActive: (value: string) => void;
  counts?: Record<string, number>;
}

const filters = [
  "all",
  "bug",
  "security",
  "maintainability",
  "performance",
  "style",
];

const filterColors: Record<string, string> = {
  all: "data-[active=true]:border-zinc-500 data-[active=true]:bg-zinc-800 data-[active=true]:text-white",
  bug: "data-[active=true]:border-red-500/50 data-[active=true]:bg-red-500/10 data-[active=true]:text-red-400",
  security:
    "data-[active=true]:border-orange-500/50 data-[active=true]:bg-orange-500/10 data-[active=true]:text-orange-400",
  maintainability:
    "data-[active=true]:border-purple-500/50 data-[active=true]:bg-purple-500/10 data-[active=true]:text-purple-400",
  performance:
    "data-[active=true]:border-amber-500/50 data-[active=true]:bg-amber-500/10 data-[active=true]:text-amber-400",
  style:
    "data-[active=true]:border-blue-500/50 data-[active=true]:bg-blue-500/10 data-[active=true]:text-blue-400",
};

export function FindingsFilter({ active, setActive, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {filters.map((filter) => (
        <button
          key={filter}
          data-active={active === filter}
          onClick={() => setActive(filter)}
          className={`rounded-lg border border-zinc-800 bg-transparent px-3 py-1.5 font-mono text-xs font-medium capitalize text-zinc-500 transition-all hover:border-zinc-700 hover:text-zinc-300 ${filterColors[filter]}`}
        >
          {filter}
          {counts && counts[filter] !== undefined && (
            <span className="ml-1.5 opacity-60">{counts[filter]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
