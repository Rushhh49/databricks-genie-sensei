"use client";

export function ApiError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
      {message}
    </div>
  );
}