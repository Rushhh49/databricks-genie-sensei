export interface GenieThought {
  thought_type: string;
  content: string;
}

export interface GenieAttachment {
  type: string;
}

export interface GenieMessage {
  id: string;

  role:
    | "user"
    | "assistant";

  content: string;

  sql?: string;

  thoughts?: GenieThought[];

  suggestedQuestions?: string[];

  raw?: any;
}