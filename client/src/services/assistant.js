// client/src/services/assistant.js
import api from "./api";

export const assistantService = {
  ask: async (query) => {
    const response = await api.post("/assistant/chat", { query });
    return response.data;
  },
};
