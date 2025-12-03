import api from "./api";

const ticketService = {
  // Comprar boletos
  purchase: async (purchaseData) => {
    // purchaseData debe ser { eventId, quantity, cardDetails }
    const response = await api.post("/tickets/purchase", purchaseData);
    return response.data;
  },

  // Obtener mis boletos (lo usaremos en el siguiente paso)
  getMyTickets: async () => {
    const response = await api.get("/tickets/my-tickets");
    return response.data;
  },
};

export default ticketService;
