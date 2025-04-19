import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  let token: string | null = null;

  try {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Permission not granted for push notifications.');
        return null;
      }

      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'fa7e0a8f-7521-454e-b82f-c6b0e979979a',
      })).data;

      console.log('Expo Push Token:', token);
    } else {
      console.warn('Must use physical device for push notifications');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (err) {
    console.log('[Push Error]', err);
    return null;
  }
}
