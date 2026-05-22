"use client";

import { motion } from "framer-motion";

import { useChatStore } from "@/lib/store/chat.store";

interface Props {
  questions: string[];
}

export function SuggestedQuestions({
  questions,
}: Props) {
  const { sendMessage } =
    useChatStore();

  return (
    <div className="flex flex-wrap gap-3">
      {questions.map((question, index) => (
        <motion.button
          key={`${question}-${index}`}
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() =>
            sendMessage(question)
          }
          className="
            glass
            rounded-full
            border
            border-accent/10
            px-4
            py-2
            text-sm
            text-foreground/80
            transition-all
            hover:border-primary/40
            hover:text-foreground
          "
        >
          {question}
        </motion.button>
      ))}
    </div>
  );
}