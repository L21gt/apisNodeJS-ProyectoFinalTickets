/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Definimos las funciones PRIMERO (para que useEffect las encuentre)
  
  // Función de Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función de Login
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const decoded = jwtDecode(data.token);
    setUser(decoded);
    setIsAuthenticated(true);
    return data;
  };

  // 2. Ejecutamos el efecto DESPUÉS
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Verificar si el token expiró
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setUser(decoded);
            setIsAuthenticated(true);
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};