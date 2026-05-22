"use client";

import { SuggestedQuestions } from "../../chat/SuggestedQuestions";

export function SuggestionRenderer({
  questions,
}: any) {
  return (
    <SuggestedQuestions questions={questions} />
  );
}