"use client";

import { useChatStore } from "@/lib/store/chat.store";

export function ConversationHistory() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
  } = useChatStore();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() =>
              setActiveConversation(
                conversation.id
              )
            }
            className={`
              w-full
              rounded-2xl
              border
              p-3
              text-left
              transition-all
              ${
                activeConversationId ===
                conversation.id
                  ? "border-primary/40 bg-primary/10"
                  : "border-accent/10 bg-accent/5"
              }
            `}
          >
            <div className="truncate text-sm">
              {conversation.title}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}