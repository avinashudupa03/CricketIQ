import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/authApi';

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  role: string;
  phone?: string;
  location?: string;
  organization?: string;
  reportsGenerated?: number;
  playersTracked?: number;
  teamsFollowed?: number;
  matchesAnalyzed?: number;
  emailNotifications?: boolean;
  twoFactorEnabled?: boolean;
  apiAccess?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('cricketiq_token');
    const storedUser = localStorage.getItem('cricketiq_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('cricketiq_user');
      }
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('cricketiq_token', newToken);
    localStorage.setItem('cricketiq_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }

  async function signup(name: string, email: string, password: string) {
    const res = await authApi.signup({ name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('cricketiq_token', newToken);
    localStorage.setItem('cricketiq_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('cricketiq_token');
    localStorage.removeItem('cricketiq_user');
    setToken(null);
    setUser(null);
  }

  function updateUser(userData: User) {
    localStorage.setItem('cricketiq_user', JSON.stringify(userData));
    setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
