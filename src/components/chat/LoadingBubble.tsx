"use client";

export function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="glass flex items-center gap-2 rounded-3xl px-5 py-4">
        <div className="typing-dot h-2 w-2 rounded-full bg-foreground" />
        <div className="typing-dot h-2 w-2 rounded-full bg-foreground" />
        <div className="typing-dot h-2 w-2 rounded-full bg-foreground" />
      </div>
    </div>
  );
}