import { Account, Avatars, Client, OAuthProvider } from 'react-native-appwrite';
import * as Linking from "expo-linking";
import * as WebBrowser from 'expo-web-browser';

export const config = {
  platform: 'com.av.pawsitivity',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform)

export const avatar = new Avatars(client);
export const account = new Account(client);

export async function login(): Promise<boolean> {
  try {
    const redirectUri = Linking.createURL('/');
    const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);
    if(!response) throw new Error('Failed to login');
    const browserResult = await WebBrowser.openAuthSessionAsync(response.toString(), redirectUri);
    if(browserResult.type !== 'success') throw new Error('Invalid response!');

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get('secret')?.toString();
    const userId = url.searchParams.get('userId')?.toString();

    if(!secret || !userId) throw new Error('No Secret or UserId found!');

    const session = await account.createSession(userId, secret);
    if(!session) throw new Error('Failed to create a session!');

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const userDetails = await account.get();
    if(!userDetails.$id) {
      const userAvatar = avatar.getInitials(userDetails.name);
      return {
        ...userDetails,
        avatar: userAvatar.toString()
      }
    }
    return userDetails;
  } catch (error) {
    console.error(error);
    return null;
  }
}