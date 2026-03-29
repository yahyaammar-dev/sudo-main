import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { registerForPushNotificationsAsync } from 'lib/notifications';
import { useEffect, useState } from 'react';
import { Routes } from 'routers';
import { notificationStore } from 'store';

export function useNotifications() {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        notificationStore.setToken(token ?? '');
      })
      .catch((err) => {
        notificationStore.setToken(String(err));
      });

    const subscriptionReceived = Notifications.addNotificationReceivedListener((n) => {
      console.log('notification', n), setNotification(n);
    });

    const subscriptionResponse = Notifications.addNotificationResponseReceivedListener((r) => {
      const orderId = r.notification.request.content.data?.orderId;
      if (orderId) {
        router.push({ pathname: Routes.OrderDetails, params: { id: orderId as string } });
      }
    });

    return () => {
      subscriptionReceived.remove();
      subscriptionResponse.remove();
    };
  }, []);

  return { notification };
}
