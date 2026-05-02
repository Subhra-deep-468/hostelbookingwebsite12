import React, { useState, createContext, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Restore session from the server so role matches the JWT (avoids stale localStorage vs API 403)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setInitializing(false);
      return;
    }

    setToken(storedToken);

    const bootstrap = async () => {
      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, initializing, setLoading, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
