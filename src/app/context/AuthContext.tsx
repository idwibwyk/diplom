import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { api, hasToken, setToken } from '@/app/api/client';
import React from 'react';
export type UserRole = 'client' | 'groomer' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  birth_date?: string | null;
  city?: string | null;
  photo?: string | null;
}

const STORAGE_USER = 'mars_groom_user';

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; role?: UserRole; error?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeUser(u: { id: number; name: string; email: string; role: string; phone?: string; birth_date?: string | null; city?: string | null; photo?: string | null }): AuthUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as UserRole,
    phone: u.phone,
    birth_date: u.birth_date ?? null,
    city: u.city ?? null,
    photo: u.photo ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      if (!hasToken()) return null;
      const raw = localStorage.getItem(STORAGE_USER);
      if (raw) return JSON.parse(raw) as AuthUser;
    } catch {}
    return null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_USER);
  }, [user]);

  useEffect(() => {
    if (!hasToken() && user) {
      setUser(null);
    }
  }, [user]);

  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener('mars_auth_invalid', handler as EventListener);
    return () => window.removeEventListener('mars_auth_invalid', handler as EventListener);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await api.post<{ success: boolean; token?: string; user?: { id: number; name: string; email: string; role: string; phone?: string; birth_date?: string | null; city?: string | null; photo?: string | null }; error?: string; hint?: string }>('/auth/login', { email, password });
      if ('error' in res) return { ok: false, error: res.error, hint: 'hint' in res ? res.hint : undefined };
      const { token, user: u } = res.data as { success?: boolean; token?: string; user?: { id: number; name: string; email: string; role: string; phone?: string; birth_date?: string | null; city?: string | null; photo?: string | null } };
      if (!token || !u) return { ok: false, error: 'Нет данных в ответе' };
      setToken(token);
      const next = normalizeUser(u);
      setUser(next);
      return { ok: true, role: next.role as UserRole };
    } catch (e) {
      return { ok: false, error: 'Сервер недоступен. Проверьте подключение или запустите бэкенд (npm run server).' };
    }
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const res = await api.post<{ success: boolean; token?: string; user?: { id: number; name: string; email: string; role: string; phone?: string; birth_date?: string | null; city?: string | null; photo?: string | null }; error?: string; hint?: string }>('/auth/register', data);
      if ('error' in res) return { ok: false, error: res.error, hint: 'hint' in res ? res.hint : undefined };
      const { token, user: u } = res.data as { success?: boolean; token?: string; user?: { id: number; name: string; email: string; role: string; phone?: string; birth_date?: string | null; city?: string | null; photo?: string | null } };
      if (!token || !u) return { ok: false, error: 'Нет данных в ответе' };
      setToken(token);
      setUser(normalizeUser(u));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Сервер недоступен. Проверьте подключение или запустите бэкенд (npm run server).' };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
