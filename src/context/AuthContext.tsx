import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, saveToken, saveUser, getUser, clearToken } from '../lib/api';

interface User {
  id: string; name: string; email: string;
  role: 'freelancer' | 'customer' | 'admin' | 'owner';
  avatar: string; rating: number; balance: number;
  status: 'online' | 'offline' | 'busy';
}

interface AuthContextType {
  user: User | null; isLoading: boolean; isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('neolance_token');
    if (token) {
      api.auth.me().then(u => { setUser(u); saveUser(u); }).catch(() => { clearToken(); setUser(null); });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try { const { token, user: u } = await api.auth.login({ email, password }); saveToken(token); saveUser(u); setUser(u); }
    finally { setIsLoading(false); }
  };

  const register = async (name: string, email: string, password: string, role = 'freelancer') => {
    setIsLoading(true);
    try { const { token, user: u } = await api.auth.register({ name, email, password, role }); saveToken(token); saveUser(u); setUser(u); }
    finally { setIsLoading(false); }
  };

  const logout = () => { api.auth.logout().catch(() => {}); clearToken(); setUser(null); };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => { if (!prev) return null; const updated = { ...prev, ...updates }; saveUser(updated); return updated; });
  };

  const refreshUser = async () => {
    try { const u = await api.auth.me(); setUser(u); saveUser(u); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
