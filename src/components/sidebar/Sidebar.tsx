"use client";

import { Plus } from "lucide-react";

import { ConversationHistory } from "./ConversationHistory";
import { ConfigPanel } from "./ConfigPanel";

import { useChatStore } from "@/lib/store/chat.store";

export function Sidebar() {
  const { newChat } =
    useChatStore();

  return (
    <aside
      className="
        glass
        hidden
        w-[320px]
        flex-col
        border-r
        border-accent/10
        lg:flex
      "
    >
      <div className="border-b border-accent/10 p-5">
        <button
          onClick={newChat}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-primary
            px-4
            py-3
            font-medium
          "
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      <ConversationHistory />

      <ConfigPanel />
    </aside>
  );
}