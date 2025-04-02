import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthContextType {
  user: string | null;
  login: (token: string) => void;
  logout: () => void;
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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwtToken");
        if (token) {
          setUser(token);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };
    loadUser();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync("jwtToken", token);
    setUser(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwtToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
