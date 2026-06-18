import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken, getToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadMe() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await api('/auth/me');
        if (active) setUser(data.user);
      } catch {
        setToken(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMe();
    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setToken(data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
