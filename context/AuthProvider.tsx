import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken, removeToken, saveToken } from "@/lib/secureStore";
import { jwtDecode } from "jwt-decode";

export interface IUser {
  data: {
    name: string;
    email: string;
  }
}

interface AuthContextType {
  user: IUser | null;
  login: (token: string) => void;
  logout: () => void;
  tokenLoaded: boolean;
  jwtToken: string | null;
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
  const [user, setUser] = useState<IUser | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken("jwtToken");
        if (token) {
          const decodedToken = jwtDecode<IUser>(token);
          setUser(decodedToken);
          setJwtToken(token);
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
    const decodedToken = jwtDecode<IUser>(token);
    setUser(decodedToken);
    setJwtToken(token);
  };

  const logout = async () => {
    await removeToken("jwtToken");
    setUser(null);
    setJwtToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, tokenLoaded, jwtToken }}>
      {children}
    </AuthContext.Provider>
  );
};
