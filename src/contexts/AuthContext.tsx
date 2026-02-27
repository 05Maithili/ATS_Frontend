import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { api, User } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.getCurrentUser().then((result) => {
        if (result.data) {
          setUser({
            name: result.data.full_name || result.data.username,
            email: result.data.email
          });
        } else {
          // Token invalid, clear it
          api.logout();
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await api.login(email, password);
    if (result.data) {
      setUser({
        name: result.data.user.full_name || result.data.user.username,
        email: result.data.user.email
      });
      // Store user info
      localStorage.setItem("user", JSON.stringify({
        name: result.data.user.full_name || result.data.user.username,
        email: result.data.user.email
      }));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Extract username from email or use the name
    const username = email.split("@")[0];
    const result = await api.register(email, username, password, name);
    if (result.data) {
      // Auto-login after registration
      return await login(email, password);
    }
    return false;
  };

  const logout = () => {
    api.logout();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
