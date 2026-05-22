"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ReasoningAccordion({
  title,
  children,
}: any) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="glass rounded-2xl border border-accent/10">
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span className="text-sm text-foreground/80">
          {title}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}