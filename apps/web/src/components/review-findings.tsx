"use client";

import { useMemo, useState } from "react";
import { FindingsFilter } from "./findings-filter";
import { CodeSnippet } from "./code-snippet";
import { SeverityBadge } from "./severity-badge";

interface Props {
  findings: any[];
}

const typeIcons: Record<string, string> = {
  bug: "🐛",
  security: "🔒",
  performance: "⚡",
  style: "✦",
};

export function ReviewFindings({ findings }: Props) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: findings.length };
    for (const f of findings) {
      c[f.type] = (c[f.type] ?? 0) + 1;
    }
    return c;
  }, [findings]);

  const filtered = useMemo(() => {
    if (filter === "all") return findings;
    return findings.filter((f) => f.type === filter);
  }, [filter, findings]);

  const toggleExpanded = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!findings.length) {
    return (
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-14 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-2xl">
          ✓
        </div>
        <h3 className="font-mono text-lg font-semibold text-white">
          No Findings Detected
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          The AI reviewer found no major issues in this pull request.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-zinc-300">
            Findings
          </h2>
          <p className="mt-0.5 text-xs text-zinc-600">
            {filtered.length} of {findings.length} shown
          </p>
        </div>
        <FindingsFilter active={filter} setActive={setFilter} counts={counts} />
      </div>

      {/* Finding cards */}
      <div className="space-y-3">
        {filtered.map((finding, index) => {
          const isOpen = expanded[index] ?? true;

          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm transition-all"
            >
              {/* Header — clickable to collapse */}
              <button
                onClick={() => toggleExpanded(index)}
                className="flex w-full items-start gap-4 p-5 text-left"
              >
                {/* Type icon */}
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-sm">
                  {typeIcons[finding.type] ?? "•"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-mono text-sm font-semibold text-white">
                      {finding.title}
                    </h3>
                    <SeverityBadge severity={finding.severity} />
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                    <span className="font-mono">
                      {finding.filePath}:{finding.lineStart}
                    </span>
                    <span className="rounded border border-zinc-800 px-1.5 py-0.5 font-mono capitalize">
                      {finding.type}
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`mt-1 shrink-0 text-zinc-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {isOpen && (
                <>
                  {/* Description */}
                  <div className="border-t border-zinc-800/60 px-5 py-4">
                    <p className="text-[13px] leading-relaxed text-zinc-400">
                      {finding.description}
                    </p>
                  </div>

                  {/* Code snippet */}
                  {finding.codeSnippet && (
                    <div className="border-t border-zinc-800/60">
                      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-zinc-800/60">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                          Source
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500">
                          {finding.filePath}
                        </span>
                      </div>
                      <CodeSnippet
                        code={finding.codeSnippet}
                        lineStart={finding.lineStart}
                        highlightedLine={finding.lineStart}
                      />
                    </div>
                  )}

                  {/* Suggestion */}
                  <div className="border-t border-zinc-800/60 bg-emerald-500/5 px-5 py-4">
                    <div className="mb-2 flex items-center gap-2">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-emerald-400"
                      >
                        <path
                          d="M8 2l1.5 4.5H14l-3.75 2.75 1.5 4.75L8 11.5l-3.75 2.5 1.5-4.75L2 6.5h4.5L8 2z"
                          fill="currentColor"
                        />
                      </svg>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                        AI Suggestion
                      </p>
                    </div>
                    <p className="text-[13px] leading-relaxed text-zinc-400">
                      {finding.suggestion}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
