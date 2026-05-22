"use client";

import { ThoughtProcess } from "../../chat/ThoughtProcess";

export function ThoughtRenderer({
  thoughts,
}: any) {
  return (
    <ThoughtProcess thoughts={thoughts} />
  );
}