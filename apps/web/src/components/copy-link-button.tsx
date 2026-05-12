"use client";

import { useState } from "react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="group relative flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-xs font-medium text-zinc-400 transition-all hover:border-emerald-500/50 hover:text-emerald-400"
    >
      {copied ? (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            className="text-emerald-400"
          >
            <path
              d="M3 8l4 4 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform group-hover:scale-110"
          >
            <rect
              x="5"
              y="5"
              width="9"
              height="9"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Share Link
        </>
      )}
    </button>
  );
}
