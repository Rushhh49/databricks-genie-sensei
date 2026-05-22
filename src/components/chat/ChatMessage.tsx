"use client";

import { motion } from "framer-motion";
import Markdown from "react-markdown";

import { SQLBlock } from "./SQLBlock";
import { ThoughtProcess } from "./ThoughtProcess";

interface Props {
  message: any;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        className={`
          glass gradient-border
          max-w-[90%]
          rounded-3xl
          px-5
          py-4
          shadow-2xl
          transition-all
          duration-300
          ${
            isUser
              ? "bg-primary/10"
              : "bg-accent/5"
          }
        `}
      >
        <div className="prose prose-invert max-w-none">
          <Markdown>
            {message.content}
          </Markdown>
        </div>

        {message.sql && (
          <div className="mt-4">
            <SQLBlock sql={message.sql} />
          </div>
        )}

        {message.thoughts?.length > 0 && (
          <div className="mt-4">
            <ThoughtProcess
              thoughts={message.thoughts}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}