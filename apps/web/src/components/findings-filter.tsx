"use client";

interface Props {
  active: string;
  setActive: (value: string) => void;
}

const filters = ["all", "bug", "security", "performance", "style"];

export function FindingsFilter({ active, setActive }: Props) {
  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActive(filter)}
          className={`rounded-lg border px-3 py-2 text-sm capitalize ${
            active === filter ? "bg-black text-white" : ""
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
