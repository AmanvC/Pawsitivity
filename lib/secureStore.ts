import * as SecureStore from 'expo-secure-store';

export const saveKey = async (TOKEN_KEY: string, token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getKey = async (TOKEN_KEY: string) => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeKey = async (TOKEN_KEY: string) => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};