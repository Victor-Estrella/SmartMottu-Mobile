import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface LocalNotificationRequest {
  title?: string;
  body?: string;
  seconds?: number;
  data?: Record<string, unknown>;
}

interface NotificationContextValue {
  expoPushToken: string | null;
  permissionStatus: Notifications.PermissionStatus | null;
  registerForPushNotificationsAsync: () => Promise<string | null>;
  sendPushNotificationAsync: (message: PushMessage) => Promise<boolean>;
  scheduleLocalNotification: (options?: LocalNotificationRequest) => Promise<string | null>;
  lastNotification: Notifications.Notification | null;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldPlaySound: Platform.OS === 'ios',
    shouldShowAlert: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [expoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
  const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null);

  const ensureAndroidChannel = useCallback(async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
      });
    }
  }, []);

  const ensurePermissionsAsync = useCallback(async (): Promise<Notifications.PermissionStatus> => {
    try {
      const existingPermissions = await Notifications.getPermissionsAsync();
      let currentStatus = existingPermissions.status as Notifications.PermissionStatus;

      if (currentStatus !== 'granted') {
        const request = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        currentStatus = request.status as Notifications.PermissionStatus;
      }

      setPermissionStatus(currentStatus);
      return currentStatus;
    } catch (error) {
      console.error('Failed to verify notification permissions', error);
      return 'denied' as Notifications.PermissionStatus;
    }
  }, []);

  const registerForPushNotificationsAsync = useCallback(async (): Promise<string | null> => {
    const currentStatus = await ensurePermissionsAsync();
    if (currentStatus !== 'granted') {
      console.warn('Push notification permission not granted.');
      return null;
    }
    console.warn('Push token registration skipped (Firebase credentials not configured).');
    return null;
  }, [ensurePermissionsAsync]);

  const sendPushNotificationAsync = useCallback(
    async ({ title, body, data }: PushMessage): Promise<boolean> => {
      try {
        const token = expoPushToken ?? (await registerForPushNotificationsAsync());
        if (!token) {
          console.warn('Push token unavailable. Skipping push notification.');
          return false;
        }

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: token,
            sound: Platform.OS === 'ios' ? 'default' : undefined,
            title,
            body,
            data,
          }),
        });

        if (!response.ok) {
          console.warn('Expo push API request failed', await response.text());
          return false;
        }

        const payload = await response.json();
        if (payload?.data?.status !== 'ok') {
          console.warn('Expo push API returned error', payload);
          return false;
        }
        return true;
      } catch (error) {
        console.error('Failed to send push notification', error);
        return false;
      }
    },
    [expoPushToken, registerForPushNotificationsAsync],
  );

  const scheduleLocalNotification = useCallback(
    async (options?: LocalNotificationRequest): Promise<string | null> => {
      const defaults: Required<Pick<LocalNotificationRequest, 'title' | 'body' | 'seconds'>> = {
        title: 'Notificação de teste',
        body: 'A aplicação agendou uma notificação local.',
        seconds: 5,
      };

      const { title, body, seconds, data } = { ...defaults, ...options };

      const currentStatus = await ensurePermissionsAsync();
      if (currentStatus !== 'granted') {
        console.warn('Notification permission not granted for local scheduling.');
        return null;
      }

      await ensureAndroidChannel();

      try {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
            sound: Platform.OS === 'ios' ? 'default' : undefined,
          },
          trigger: Platform.OS === 'android'
            ? {
                channelId: 'default',
                date: new Date(Date.now() + Math.max(1, seconds ?? 5) * 1000),
              }
            : {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: Math.max(1, seconds ?? 5),
                repeats: false,
              },
        });
        return identifier;
      } catch (error) {
        console.error('Failed to schedule local notification', error);
        return null;
      }
    },
    [ensureAndroidChannel, ensurePermissionsAsync],
  );

  useEffect(() => {
    ensurePermissionsAsync();
  }, [ensurePermissionsAsync]);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      setLastNotification(notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.notification) {
        setLastNotification(response.notification);
      }
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const value = useMemo(
    () => ({
      expoPushToken,
      permissionStatus,
      registerForPushNotificationsAsync,
      sendPushNotificationAsync,
      scheduleLocalNotification,
      lastNotification,
    }),
    [
      expoPushToken,
      permissionStatus,
      registerForPushNotificationsAsync,
      sendPushNotificationAsync,
      scheduleLocalNotification,
      lastNotification,
    ],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
