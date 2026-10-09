import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getToken, setToken, clearToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if we have a token, try to fetch the current user
  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        setUser(me);
      } catch {
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      onboarding: data.onboarding,
    });
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    setToken(data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      onboarding: data.onboarding,
    });
    return data;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const me = await authApi.me();
      setUser(me);
      return me;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}