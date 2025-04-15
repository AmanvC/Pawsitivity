import React, { createContext, useState, useEffect, useContext } from "react";
import { getKey, removeKey, saveKey } from "@/lib/secureStore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { ESecureStoreKeys } from "@/lib/types";

export interface IUser {
  data: {
    name: string;
    email: string;
    joinedCommunities: {_id: string, communityName: string}[]
  }
}

interface AuthContextType {
  user: IUser | null;
  login: (token: string) => void;
  logout: () => void;
  tokenLoaded: boolean;
  jwtToken: string | null;
  selectedCommunity: IUser['data']['joinedCommunities'][number] | null
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
  const [selectedCommunity, setSelectedCommunity] = useState<IUser['data']['joinedCommunities'][number] | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const selectedCommunity = await getKey(ESecureStoreKeys.SELECTED_COMMUNITY);
        if(selectedCommunity) setSelectedCommunity(JSON.parse(selectedCommunity));
        const token = await getKey(ESecureStoreKeys.JWT_TOKEN);
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
    await saveKey(ESecureStoreKeys.JWT_TOKEN, token);
    const decodedToken = jwtDecode<IUser>(token);
    await saveKey(ESecureStoreKeys.SELECTED_COMMUNITY, JSON.stringify(decodedToken.data.joinedCommunities[0]) || '');
    setUser(decodedToken);
    setJwtToken(token);
    router.push("/(root)/(tabs)/home");
  };

  const logout = async () => {
    await removeKey(ESecureStoreKeys.SELECTED_COMMUNITY);
    await removeKey(ESecureStoreKeys.JWT_TOKEN);
    router.push("/(auth)/sign-in");
    setUser(null);
    setJwtToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, tokenLoaded, jwtToken, selectedCommunity }}>
      {children}
    </AuthContext.Provider>
  );
};
