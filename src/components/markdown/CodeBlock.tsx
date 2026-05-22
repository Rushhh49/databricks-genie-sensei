"use client";

export function CodeBlock({
  code,
}: {
  code: string;
}) {
  return (
    <pre className="overflow-auto rounded-xl bg-black/40 p-4 text-sm text-white">
      <code>{code}</code>
    </pre>
  );
}