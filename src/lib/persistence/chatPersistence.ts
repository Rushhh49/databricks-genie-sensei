export const chatPersistence = {
  save(data: any) {
    localStorage.setItem(
      "ai-copilot-chat",
      JSON.stringify(data)
    );
  },

  load() {
    const data = localStorage.getItem(
      "ai-copilot-chat"
    );

    if (!data) return null;

    return JSON.parse(data);
  },
};