"use client";

export function CopyLinkButton() {
  async function copy() {
    await navigator.clipboard.writeText(window.location.href);

    alert("Link copied");
  }

  return (
    <button onClick={copy} className="rounded-lg border px-4 py-2">
      Copy Share Link
    </button>
  );
}
