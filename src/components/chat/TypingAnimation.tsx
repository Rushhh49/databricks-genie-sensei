"use client";

import { motion } from "framer-motion";

export function TypingAnimation() {
  return (
    <motion.div
      animate={{
        opacity: [0.4, 1, 0.4],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.2,
      }}
      className="text-sm text-foreground/40"
    >
      AI is thinking...
    </motion.div>
  );
}