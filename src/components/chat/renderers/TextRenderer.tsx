"use client";

export function TextRenderer({
  content,
}: {
  content: string;
}) {
  return (
    <div className="prose prose-invert max-w-none">
      {content}
    </div>
  );
}