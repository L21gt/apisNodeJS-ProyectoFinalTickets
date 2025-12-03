import api from "./api";

const categoryService = {
  // Obtener todas las categorías
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  // Crear categoría
  create: async (data) => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  // Editar categoría
  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  // Eliminar categoría (Opcional, pero útil)
  // Nota: Asegúrate de tener este endpoint en backend si quieres usarlo,
  // si no lo creamos, podemos omitir este botón por ahora.
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
