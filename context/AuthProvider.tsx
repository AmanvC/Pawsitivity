import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken, removeToken, saveToken } from "@/lib/secureStore";

interface AuthContextType {
  user: string | null;
  login: (token: string) => void;
  logout: () => void;
  tokenLoaded: boolean
}

// Create Context
export const AuthContext = createContext<AuthContextType | null>(null);

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken("jwtToken");
        if (token) {
          setUser(token);
        }
        setTokenLoaded(true);
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };
    loadUser();
  }, []);

  const login = async (token: string) => {
    await saveToken("jwtToken", token);
    setUser(token);
  };

  const logout = async () => {
    await removeToken("jwtToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, tokenLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};
