"use client";

import { Copy } from "lucide-react";

export function SQLToolbar({
  sql,
}: {
  sql: string;
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-b border-white/10 p-3">
      <button
        onClick={() =>
          navigator.clipboard.writeText(sql)
        }
        className="rounded-lg border border-white/10 bg-white/5 p-2"
      >
        <Copy size={14} />
      </button>
    </div>
  );
}