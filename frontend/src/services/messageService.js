import api from "./api";

const messageService = {
  // Enviar un mensaje (Público)
  sendMessage: async (data) => {
    const response = await api.post("/messages", data);
    return response.data;
  },

  // Obtener todos los mensajes (Solo Admin)
  getAllMessages: async () => {
    const response = await api.get("/messages");
    return response.data;
  },

  // Cambiar estado (read/new)
  updateStatus: async (id, status) => {
    const response = await api.put(`/messages/${id}/status`, { status });
    return response.data;
  },

  // Eliminar mensaje
  deleteMessage: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },
};

export default messageService;
