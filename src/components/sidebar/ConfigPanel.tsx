"use client";

export function ConfigPanel() {
  return (
    <div className="border-t border-accent/10 p-4">
      <div className="mb-3 text-xs uppercase tracking-wider text-foreground/40">
        Configuration
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-foreground/50">
            Databricks PAT
          </label>

          <input
            type="password"
            placeholder="••••••••••"
            className="
              w-full
              rounded-xl
              border
              border-accent/10
              bg-accent/5
              px-3
              py-2
              text-sm
              outline-none
            "
          />
        </div>
      </div>
    </div>
  );
}