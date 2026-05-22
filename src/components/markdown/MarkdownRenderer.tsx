"use client";

import Markdown from "react-markdown";

export function MarkdownRenderer({
  content,
}: {
  content: string;
}) {
  return (
    <div className="prose prose-invert max-w-none">
      <Markdown>{content}</Markdown>
    </div>
  );
}