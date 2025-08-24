import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
import { ActivityIndicator, Text, View } from "react-native";
import { useEffect } from "react";

export default function Index() {
  const { user, tokenLoaded, selectedCommunity } = useAuth();
  const router = useRouter();
  console.log({tokenLoaded})
  console.log({selectedCommunity})

  useEffect(() => {
    if (!tokenLoaded) return;
    if (!user) {
      router.replace("/(auth)/sign-in");
    } else {
      router.replace("/selectCommunity");
    }
  }, [tokenLoaded, user, selectedCommunity]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}