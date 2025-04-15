import "./globals.css";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthProvider";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/lib/toastConfig";

export default function AppLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded]);

  if (!appReady) return null;

  return (
    <AuthProvider>
      <Slot />
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}
