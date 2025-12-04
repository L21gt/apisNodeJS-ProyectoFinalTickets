import api from "./api";

const userService = {
  // Obtener todos los usuarios (con paginación opcional)
  getAll: async (page = 1, limit = 10, role = "", status = "") => {
    // Construimos la query string dinámicamente
    let url = `/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    if (status) url += `&status=${status}`;

    const response = await api.get(url);
    return response.data;
  },

  // Actualizar usuario (Rol o Estado)
  update: async (id, userData) => {
    // userData debe ser { role: 'admin', status: 'blocked' } etc.
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
};

export default userService;
