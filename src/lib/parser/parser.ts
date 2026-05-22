export interface Thought {
  thought_type: string;
  content: string;
}

export interface ParsedMessage {
  id: string;

  role: "assistant";

  content: string;

  sql?: string;

  thoughts?: Thought[];

  suggestedQuestions?: string[];

  raw?: any;
}

export const parseGenieMessage = (
  response: any
): ParsedMessage => {
  const attachments =
    response.attachments || [];

  let content = "";

  let sql = "";

  let thoughts: Thought[] = [];

  let suggestedQuestions: string[] =
    [];

  for (const attachment of attachments) {
    // TEXT
    if (
      attachment.text?.content
    ) {
      content =
        attachment.text.content;
    }

    // QUERY
    if (attachment.query) {
      sql =
        attachment.query.query ||
        "";

      thoughts =
        attachment.query
          .thoughts || [];
    }

    // SUGGESTED QUESTIONS
    if (
      attachment
        .suggested_questions
        ?.questions
    ) {
      suggestedQuestions =
        attachment
          .suggested_questions
          .questions;
    }
  }

  return {
    id:
      response.id ||
      crypto.randomUUID(),

    role: "assistant",

    content,

    sql,

    thoughts,

    suggestedQuestions,

    raw: response,
  };
};