import axios from "axios";

export interface StartConversationPayload {
  content: string;
}

export interface SendMessagePayload {
  conversation_id: string;
  message: string;
}

class GenieService {
  async startConversation(
    payload: StartConversationPayload
  ) {
    const response =
      await axios.post(
        "/api/genie/start",
        payload
      );

    return response.data;
  }

  async sendMessage(
    payload: SendMessagePayload
  ) {
    const response =
      await axios.post(
        "/api/genie/message",
        payload
      );

    return response.data;
  }

  async pollMessage(
  conversation_id: string,
  message_id: string
) {
  const response =
    await axios.get(
      `/api/genie/poll?conversation_id=${conversation_id}&message_id=${message_id}`
    );

  return response.data;
}
}

export const genieService =
  new GenieService();