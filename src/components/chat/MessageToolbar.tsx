"use client";

import {
  Copy,
  RefreshCcw,
} from "lucide-react";

interface Props {
  content: string;
  onRetry?: () => void;
}

export function MessageToolbar({
  content,
  onRetry,
}: Props) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        onClick={() =>
          navigator.clipboard.writeText(
            content
          )
        }
        className="
          rounded-lg
          border
          border-accent/10
          bg-accent/5
          p-2
          transition-all
          hover:bg-accent/10
        "
      >
        <Copy size={15} />
      </button>

      {onRetry && (
        <button
          onClick={onRetry}
          className="
            rounded-lg
            border
            border-accent/10
            bg-accent/5
            p-2
            transition-all
            hover:bg-accent/10
          "
        >
          <RefreshCcw size={15} />
        </button>
      )}
    </div>
  );
}