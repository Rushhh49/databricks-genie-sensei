"use client";

export function ThoughtTimeline({
  thoughts,
}: any) {
  return (
    <div className="space-y-4 border-l border-accent/10 pl-6">
      {thoughts.map((thought: any, index: number) => (
        <div key={index} className="relative">
          <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary" />

          <div className="rounded-2xl border border-accent/10 bg-accent/5 p-4">
            <div className="mb-2 text-xs uppercase text-primary">
              {thought.thought_type}
            </div>

            <div className="text-sm text-foreground/80">
              {thought.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}