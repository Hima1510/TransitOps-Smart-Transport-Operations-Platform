import React, { createContext, useContext, useState, useCallback } from 'react';
interface User { id: number; name: string; email: string; role: string; }
interface AuthContextType { user: User | null; token: string | null; login: (token: string, user: User) => void; logout: () => void; isAuthenticated: boolean; }
const AuthContext = createContext<AuthContextType>({ user: null, token: null, login: () => {}, logout: () => {}, isAuthenticated: false });
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => { const s = localStorage.getItem('transitops_user'); return s ? JSON.parse(s) : null; });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('transitops_token'));
  const login = useCallback((t: string, u: User) => { localStorage.setItem('transitops_token', t); localStorage.setItem('transitops_user', JSON.stringify(u)); setToken(t); setUser(u); }, []);
  const logout = useCallback(() => { localStorage.removeItem('transitops_token'); localStorage.removeItem('transitops_user'); setToken(null); setUser(null); }, []);
  return <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
