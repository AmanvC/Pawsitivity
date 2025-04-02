import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';

export const saveToken = async (TOKEN_KEY: string, token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async (TOKEN_KEY: string) => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async (TOKEN_KEY: string) => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const getOrCreateDeviceId = async () => {
  try {
    let deviceId = await SecureStore.getItemAsync("deviceId");
    
    if (!deviceId) {
      deviceId = uuid.v4();
      await saveToken("deviceId", deviceId);
    }
    return deviceId;
  } catch (err) {
    console.log("Error in generating uuid!");
    return "";
  }
}