"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";

export default function ChatPage() {
  return (
    <main className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat */}
      <section className="relative flex flex-1 flex-col">
        <ChatContainer />
      </section>
    </main>
  );
}
