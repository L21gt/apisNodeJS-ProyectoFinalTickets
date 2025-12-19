/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

// 1. Creamos el contexto
export const AuthContext = createContext();

// 2. Creamos el Provider
export const AuthProvider = ({ children }) => {
  // Inicialización directa (Lazy) para evitar useEffect innecesario
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const isAdmin = user?.role === 'admin';
  
  // Loading falso fijo para cumplir con la estructura sin causar errores
  const loading = false;

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Exportamos el Hook (Esta es la clave para que funcione Navbar)
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;