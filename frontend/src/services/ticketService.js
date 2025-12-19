import api from "./api";

const ticketService = {
  // Comprar boletos
  purchase: async (purchaseData) => {
    // purchaseData = { eventId, quantity, cardDetails }
    const response = await api.post("/tickets/purchase", purchaseData);
    return response.data;
  },

  // Obtener mis boletos (lo usaremos en el siguiente paso)
  getMyTickets: async (type = "upcoming", page = 1) => {
    const response = await api.get(
      `/tickets/my-tickets?type=${type}&page=${page}&limit=5`
    );
    return response.data;
  },
};

export default ticketService;
