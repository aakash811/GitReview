"use client";

import { useState } from "react";

import { FindingsFilter } from "./findings-filter";

interface Props {
  findings: any[];
}

export function ReviewFindings({ findings }: Props) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? findings
      : findings.filter((finding) => finding.type === filter);

  return (
    <div className="space-y-6">
      <FindingsFilter active={filter} setActive={setFilter} />

      <div className="space-y-4">
        {filtered.map((finding, index) => (
          <div key={index} className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{finding.title}</h3>

              <span className="text-sm capitalize text-zinc-500">
                {finding.severity}
              </span>
            </div>

            <p className="mt-2 text-sm text-zinc-600">{finding.description}</p>

            <div className="mt-4 text-sm">
              <p>
                <span className="font-medium">File:</span> {finding.filePath}
              </p>

              <p>
                <span className="font-medium">Line:</span> {finding.lineStart}
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-zinc-100 p-3 text-sm">
              <span className="font-medium">Suggestion:</span>{" "}
              {finding.suggestion}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
