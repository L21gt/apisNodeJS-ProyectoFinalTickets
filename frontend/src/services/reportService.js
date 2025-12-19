import api from "./api";

const reportService = {
  // CORRECCIÓN: Renombramos 'getStats' a 'getDashboardStats' para coincidir con el componente
  getDashboardStats: async () => {
    const response = await api.get("/reports/stats");
    return response.data;
  },

  getSales: async (page = 1, limit = 10, startDate = "", endDate = "") => {
    let url = `/reports/sales?page=${page}&limit=${limit}`;
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  getAttendees: async (eventId, page = 1, limit = 10) => {
    const response = await api.get(
      `/reports/attendees/${eventId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export default reportService;
