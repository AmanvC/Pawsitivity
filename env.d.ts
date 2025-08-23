import "expo-constants";

declare module "expo-constants" {
  interface ExpoConfig {
    extra?: {
      apiBaseUrl?: string;
    };
  }

  interface Constants {
    expoConfig?: ExpoConfig;
  }
}
