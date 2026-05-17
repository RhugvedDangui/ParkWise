import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthUser {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string, role: 'user' | 'admin') => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, role: 'user' | 'admin') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem('parkwise_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('parkwise_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role: 'user' | 'admin') => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Login failed' };
      setUser(data.user);
      localStorage.setItem('parkwise_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  const register = async (username: string, password: string, role: 'user' | 'admin') => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Registration failed' };
      setUser(data.user);
      localStorage.setItem('parkwise_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to server' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('parkwise_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
