"use client";

import { create } from "zustand";

import { genieService } from "../services/genie.service";

import { pollUntilComplete } from "../services/polling.service";

import { parseGenieMessage } from "../parser/parser";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sql?: string;
  thoughts?: any[];
}

interface Conversation {
  id: string;
  title: string;
}

interface ChatState {
  messages: Message[];

  conversations: Conversation[];

  activeConversationId:
    | string
    | null;

  suggestedQuestions:
    string[];

  loading: boolean;

  sendMessage: (
    message: string
  ) => Promise<void>;

  newChat: () => void;

  setActiveConversation: (
    id: string
  ) => void;
}

export const useChatStore =
  create<ChatState>(
    (set, get) => ({
      messages: [],

      conversations: [],

      activeConversationId:
        null,

      suggestedQuestions: [],

      loading: false,

      setActiveConversation:
        (id) => {
          set({
            activeConversationId:
              id,
          });
        },

      newChat: () => {
        set({
          messages: [],
          activeConversationId:
            null,
          suggestedQuestions:
            [],
        });
      },

      sendMessage: async (
        message
      ) => {
        const state = get();

        const userMessage = {
          id:
            crypto.randomUUID(),

          role: "user" as const,

          content: message,
        };

        set({
          messages: [
            ...state.messages,
            userMessage,
          ],

          loading: true,
        });

        try {
          let conversationId =
            state.activeConversationId;

          let response;

          // START NEW CONVERSATION
          if (!conversationId) {
            response =
              await genieService.startConversation(
                {
                  content:
                    message,
                }
              );

            console.log(
              "Start Conversation Response:",
              response
            );

            conversationId =
              response.conversation_id;

            set({
              activeConversationId:
                conversationId,

              conversations: [
                ...state.conversations,

                {
                  id:
                    conversationId,

                  title:
                    message,
                },
              ],
            });
          }

          // EXISTING CONVERSATION
          else {
            response =
              await genieService.sendMessage(
                {
                  conversation_id:
                    conversationId,

                  message,
                }
              );

            console.log(
              "Send Message Response:",
              response
            );
          }

          // POLL UNTIL COMPLETE
          const finalResponse =
            await pollUntilComplete({
  conversationId,

  messageId:
    response.message_id,
});

          console.log(
            "Final Genie Response:",
            finalResponse
          );

          // PARSE MESSAGE
          const parsed =
            parseGenieMessage(
              finalResponse
            );

          // APPEND ASSISTANT MESSAGE
          set((current) => ({
            messages: [
              ...current.messages,
              parsed,
            ],

            suggestedQuestions:
              parsed.suggestedQuestions ||
              [],

            loading: false,
          }));
        } catch (error) {
          console.error(
            "Chat Store Error:",
            error
          );

          set({
            loading: false,
          });
        }
      },
    })
  );