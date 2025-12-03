import axios from "axios";

// Configuración base de Axios
const api = axios.create({
  baseURL: "http://localhost:3000/api", // La URL de tu Backend
});

// Interceptor: Antes de cada petición, inyectar el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
