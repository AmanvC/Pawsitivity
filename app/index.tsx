import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthProvider";

export default function Index() {
  const { user } = useAuth();

  if (user === null) return <Redirect href="/(auth)/sign-in" />;

  return <Redirect href="/(root)/(tabs)" />;
}
