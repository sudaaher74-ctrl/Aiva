import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_USER: User = {
  id: 'admin',
  name: 'Super Admin',
  email: 'admin@aivaenterprises.com',
  role: 'Admin'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch {
      // fallback
    }
    return DEFAULT_ADMIN_USER;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token') || 'admin-session');

  useEffect(() => {
    // Ensure default admin is set in localStorage if empty
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'admin-session');
    }
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(DEFAULT_ADMIN_USER));
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    // Keep user logged in as default admin
    setUser(DEFAULT_ADMIN_USER);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: true,
      isLoading: false
    }}>
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
