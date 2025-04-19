// hooks/useNotificationHandler.ts
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

export const useNotificationHandler = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Set how notifications behave when received in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // 2. When a notification is received in the foreground
    const foregroundSub = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      console.log("📬 Foreground notification received:", data);
      // You can show an in-app toast/snackbar or update UI here
    });

    // 3. When a user taps the notification (background or foreground)
    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log("🧭 Notification tapped (background/foreground):", data);

      // if (data?.requestId) {
      //   router.push(`/feeding-request/${data.requestId}`);
      // }
    });

    // 4. App was launched from killed state via a notification
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response && response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        const data = response.notification.request.content.data;
        console.log("🚀 App launched from killed state via notification:", data);

        // if (data?.requestId) {
        //   router.push(`/feeding-request/${data.requestId}`);
        // }
      } else {
        console.log("App launched from kill state without notification!!!")
      }
    };

    checkInitialNotification();

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, []);
};
