import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthProvider";

export default function Index() {
  const { user, tokenLoaded } = useAuth();
  
  if (!tokenLoaded) return null;

  return user ? <Redirect href="/(root)/(tabs)" /> : <Redirect href="/(auth)/sign-in" />;
}