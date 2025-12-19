import api from "./api"; // <--- Importamos la instancia configurada

const userService = {
  getAll: async (page = 1, limit = 10, role = "", status = "") => {
    let url = `/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    if (status) url += `&status=${status}`;

    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
