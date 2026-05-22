"use client";

import { SQLBlock } from "@/components/chat/SQLBlock";
import { ThoughtProcess } from "@/components/chat/ThoughtProcess";

export function AttachmentRenderer({
  message,
}: any) {
  return (
    <div className="space-y-4">
      {message.content && (
        <div className="prose prose-invert max-w-none">
          {message.content}
        </div>
      )}

      {message.sql && (
        <SQLBlock sql={message.sql} />
      )}

      {message.thoughts?.length >
        0 && (
        <ThoughtProcess
          thoughts={message.thoughts}
        />
      )}
    </div>
  );
}