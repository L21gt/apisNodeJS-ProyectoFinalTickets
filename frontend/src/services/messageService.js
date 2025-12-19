import api from "./api"; // <--- Importamos la instancia configurada

const messageService = {
  sendMessage: async (data) => {
    const response = await api.post("/messages", data);
    return response.data;
  },

  getAllMessages: async (page = 1, limit = 10) => {
    const response = await api.get(`/messages?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/messages/${id}`, { status });
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },
};

export default messageService;
