import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('divyam_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem('divyam_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('divyam_token', data.token);
    setUser(data);
    return data;
  };
  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('divyam_token', data.token);
    setUser(data);
    return data;
  };
  const logout = () => {
    localStorage.removeItem('divyam_token');
    setUser(null);
  };
  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/me', payload);
    localStorage.setItem('divyam_token', data.token);
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
