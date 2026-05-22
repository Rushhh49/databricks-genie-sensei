import { genieService } from "./genie.service";

export const delay = (
  ms: number
) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export async function pollUntilComplete({
  conversationId,
  messageId,
  maxRetries = 120,
}: {
  conversationId: string;
  messageId: string;
  maxRetries?: number;
}) {
  let retries = 0;

  while (retries < maxRetries) {
    const response =
      await genieService.pollMessage(
        conversationId,
        messageId
      );

    console.log(
      "Polling Response:",
      response
    );

    // SUCCESS
    if (
      response.status ===
      "COMPLETED"
    ) {
      return response;
    }

    // FAILURE
    if (
      response.status ===
        "FAILED" ||
      response.status ===
        "CANCELLED"
    ) {
      throw new Error(
        `Genie request failed with status ${response.status}`
      );
    }

    // STILL PROCESSING
    retries++;

    await delay(2000);
  }

  throw new Error(
    "Polling timeout exceeded"
  );
}