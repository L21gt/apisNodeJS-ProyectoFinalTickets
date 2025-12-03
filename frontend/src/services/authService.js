import api from "./api";

const authService = {
  // Función para registrarse
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Función para iniciar sesión
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token); // Guardar token en el navegador
    }
    return response.data;
  },

  // Función para cerrar sesión
  logout: () => {
    localStorage.removeItem("token"); // Borrar token
  },

  // Actualizar / editar perfil
  updateProfile: async (data) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
};

export default authService;
