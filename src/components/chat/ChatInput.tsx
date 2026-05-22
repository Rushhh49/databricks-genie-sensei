"use client";

import { useState } from "react";

import { SendHorizonal } from "lucide-react";

import { motion } from "framer-motion";

import { useChatStore } from "@/lib/store/chat.store";

export function ChatInput() {
  const [input, setInput] =
    useState("");

  const {
    sendMessage,
    loading,
  } = useChatStore();

  const handleSend = async () => {
    if (!input.trim()) return;

    // STORE VALUE
    const message = input;

    // CLEAR IMMEDIATELY
    setInput("");

    try {
      await sendMessage(message);
    } catch (error) {
      console.error(error);

      // OPTIONAL RESTORE ON FAILURE
      setInput(message);
    }
  };

  return (
    <div className="glass flex items-center gap-3 rounded-2xl border border-accent/10 px-4 py-3">
      <textarea
        value={input}
        rows={1}
        placeholder="Ask anything about your data..."
        onChange={(e) =>
          setInput(e.target.value)
        }
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey
          ) {
            e.preventDefault();

            handleSend();
          }
        }}
        className="
          flex-1
          resize-none
          bg-transparent
          text-sm
          text-foreground
          placeholder:text-foreground/40
          outline-none
        "
      />

      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        disabled={loading}
        onClick={handleSend}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-primary
          shadow-lg
        "
      >
        <SendHorizonal size={18} />
      </motion.button>
    </div>
  );
}