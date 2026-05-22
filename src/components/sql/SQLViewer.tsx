"use client";

import { SQLBlock } from "../chat/SQLBlock";

export function SQLViewer({
  sql,
}: {
  sql: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30">
      <SQLBlock sql={sql} />
    </div>
  );
}