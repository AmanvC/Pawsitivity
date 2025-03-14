import { Account, Avatars, Client, Databases, OAuthProvider, Query } from 'react-native-appwrite';
import * as Linking from "expo-linking";
import * as WebBrowser from 'expo-web-browser';

export const config = {
  platform: 'com.av.pawsitivity',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userDB: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
  communityDB: process.env.EXPO_PUBLIC_APPWRITE_COMMUNITY_COLLECTION_ID,
  dogDB: process.env.EXPO_PUBLIC_APPWRITE_DOG_COLLECTION_ID,
  requestDB: process.env.EXPO_PUBLIC_APPWRITE_REQUEST_COLLECTION_ID,
  reportDB: process.env.EXPO_PUBLIC_APPWRITE_REPORT_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform)

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login(): Promise<boolean> {
  try {
    const redirectUri = Linking.createURL('/');
    const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);
    console.log({response})
    if(!response) throw new Error('Failed to login');
    const browserResult = await WebBrowser.openAuthSessionAsync(response.toString(), redirectUri);
    console.log({browserResult})
    if(browserResult.type !== 'success') throw new Error('Invalid response!');

    const url = new URL(browserResult.url);
    console.log({url})
    const secret = url.searchParams.get('secret')?.toString();
    const userId = url.searchParams.get('userId')?.toString();

    if(!secret || !userId) throw new Error('No Secret or UserId found!');

    // const user = await databases.getDocument(config.databaseId!, config.userDB!, );

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
    if(userDetails.$id) {
      const userAvatar = avatar.getInitials(userDetails.name);
      return {
        ...userDetails,
        avatar: userAvatar.toString()
      }
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}