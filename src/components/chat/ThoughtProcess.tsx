"use client";

import Markdown from "react-markdown";

interface Props {
  thoughts: any[];
}

export function ThoughtProcess({
  thoughts,
}: Props) {
  return (
    <div className="space-y-4">
      {thoughts.map(
        (thought, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border
              border-accent/10
              bg-accent/5
              p-4
            "
          >
            <div className="mb-2 text-xs uppercase tracking-wider text-primary">
              {thought.thought_type}
            </div>

            <div className="prose prose-invert max-w-none text-sm">
              <Markdown>
                {thought.content}
              </Markdown>
            </div>
          </div>
        )
      )}
    </div>
  );
}