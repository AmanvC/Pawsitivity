import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, tokenLoaded } = useAuth();
  console.log({tokenLoaded})

  if (!tokenLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? (
    <Redirect href="/(root)/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/sign-in" />
  );
}