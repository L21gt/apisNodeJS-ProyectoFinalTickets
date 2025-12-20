import api from "./api";

const eventService = {
  // Obtener todos los eventos con paginacion
  getAll: async (
    page = 1,
    limit = 9,
    type = "",
    category = "",
    search = ""
  ) => {
    // Construimos los parámetros de consulta (Query Params)
    const params = new URLSearchParams({
      page,
      limit,
    });

    if (type) params.append("type", type);
    if (category) params.append("category", category);
    if (search) params.append("search", search);

    const response = await api.get(`/events?${params.toString()}`);
    return response.data;
  },

  // Obtener un evento por ID
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data; // El backend devuelve { id: 1, title: ... }
  },

  // Crear un evento (IMPORTANTE: Maneja subida de archivos)
  create: async (formData) => {
    const response = await api.post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Vital para subir imágenes
      },
    });
    return response.data;
  },

  // Editar un evento
  update: async (id, formData) => {
    // PUT también necesita multipart/form-data porque puede llevar imagen
    const response = await api.put(`/events/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Eliminar evento
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

export default eventService;
