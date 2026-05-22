"use client";

import { useState } from "react";

export function RawApiResponse({
  data,
}: {
  data: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-accent/10 bg-accent/5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-left text-sm text-foreground/70"
      >
        Raw API Response
      </button>

      {open && (
        <pre className="overflow-auto p-4 text-xs text-foreground/70">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}