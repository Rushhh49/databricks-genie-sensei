"use client";

export function NetworkError() {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
      Network connection lost.
    </div>
  );
}