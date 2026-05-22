"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { LoadingBubble } from "./LoadingBubble";

import { EmptyState } from "./EmptyState";
import { useChatStore } from "@/lib/store/chat.store";

export function ChatContainer() {
  const {
    messages,
    loading,
    suggestedQuestions,
  } = useChatStore();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (hasMessages) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading, hasMessages]);

  return (
    <div className="flex h-screen flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 h-full">
            {!hasMessages && !loading ? (
                <EmptyState />
            ) : (
                <AnimatePresence>
                    {messages.map((message) => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <ChatMessage message={message} />
                    </motion.div>
                    ))}
                </AnimatePresence>
            )}

            {loading && <LoadingBubble />}

            {!loading && hasMessages && suggestedQuestions?.length > 0 && (
                <SuggestedQuestions
                questions={suggestedQuestions}
                />
            )}

            <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 z-20 border-t border-accent/10 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-4xl px-6 py-5">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}