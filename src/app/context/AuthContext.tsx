import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'client' | 'groomer' | 'admin';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

const MOCK_GROOMER = { email: 'groomer@groom.ru', password: '123456' };
const MOCK_ADMIN = { email: 'admin@groom.ru', password: '123456' };

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: boolean; role: UserRole };
  register: (data: { name: string; email: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback((email: string, password: string) => {
    if (email === MOCK_GROOMER.email && password === MOCK_GROOMER.password) {
      setUser({ name: 'Грумер', email, role: 'groomer' });
      return { ok: true, role: 'groomer' as UserRole };
    }
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      setUser({ name: 'Админ', email, role: 'admin' });
      return { ok: true, role: 'admin' as UserRole };
    }
    setUser({ name: 'Мария', email, role: 'client' });
    return { ok: true, role: 'client' as UserRole };
  }, []);

  const register = useCallback((data: { name: string; email: string }) => {
    setUser({ name: data.name, email: data.email, role: 'client' });
  }, []);

  const logout = useCallback(() => setUser(null), []);

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
