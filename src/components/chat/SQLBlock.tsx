"use client";

import { useState } from "react";

import {
  ChevronDown,
  Copy,
} from "lucide-react";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function SQLBlock({
  sql,
}: {
  sql: string;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="glass overflow-hidden rounded-2xl border border-accent/10">
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          flex
          w-full
          items-center
          justify-between
          px-4
          py-3
          text-sm
          font-medium
          text-foreground/80
        "
      >
        Generated SQL

        <ChevronDown
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      {open && (
        <div className="relative">
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                sql
              )
            }
            className="
              absolute
              right-3
              top-3
              z-10
              rounded-lg
              border
              border-accent/10
              bg-background/30
              p-2
            "
          >
            <Copy size={15} />
          </button>

          <SyntaxHighlighter
            language="sql"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              background: "transparent",
            }}
          >
            {sql}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}