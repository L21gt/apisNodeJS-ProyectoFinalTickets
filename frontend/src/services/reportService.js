import api from "./api";

const reportService = {
  // Obtener estadísticas del dashboard
  getDashboardStats: async () => {
    const response = await api.get("/reports/stats");
    return response.data;
  },

  // Obtener reporte de ventas
  getSales: async (startDate, endDate) => {
    const response = await api.get(
      `/reports/sales?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Obtener asistentes
  getAttendees: async (eventId) => {
    const response = await api.get(`/reports/attendees/${eventId}`);
    return response.data;
  },
};

export default reportService;
