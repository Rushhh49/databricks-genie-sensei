"use client";

import { useState } from "react";

import { pollUntilComplete } from "../services/polling.service";

export function usePolling() {
  const [polling, setPolling] =
    useState(false);

  const startPolling =
    async (
      conversationId: string,
      messageId: string
    ) => {
      setPolling(true);

      try {
        const response =
          await pollUntilComplete({
            conversationId,
            messageId,
          });

        return response;
      } finally {
        setPolling(false);
      }
    };

  return {
    polling,
    startPolling,
  };
}