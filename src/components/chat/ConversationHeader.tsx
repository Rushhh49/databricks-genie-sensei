"use client";

export function ConversationHeader() {
  return (
    <div className="sticky top-0 z-20 border-b border-accent/10 bg-background/80 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            AI Analytics Copilot
          </h1>

          <p className="text-sm text-foreground/40">
            Databricks Genie Connected
          </p>
        </div>
      </div>
    </div>
  );
}