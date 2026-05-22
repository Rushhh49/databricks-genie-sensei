"use client";

import { TextRenderer } from "./TextRenderer";
import { SQLRenderer } from "./SQLRenderer";
import { ThoughtRenderer } from "./ThoughtRenderer";

export function AttachmentRouter({
  message,
}: any) {
  return (
    <div className="space-y-4">
      <TextRenderer content={message.content} />

      {message.sql && (
        <SQLRenderer sql={message.sql} />
      )}

      {message.thoughts && (
        <ThoughtRenderer thoughts={message.thoughts} />
      )}
    </div>
  );
}