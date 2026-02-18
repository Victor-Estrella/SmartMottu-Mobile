import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface LocalNotificationRequest {
  title: string;
  body: string;
  seconds?: number;
  data?: Record<string, unknown>;
}

interface NotificationContextValue {
  expoPushToken: string | null;
  permissionStatus: Notifications.PermissionStatus | null;
  registerForPushNotificationsAsync: () => Promise<string | null>;
  sendPushNotificationAsync: (message: PushMessage) => Promise<boolean>;
  scheduleLocalNotification: (options: LocalNotificationRequest) => Promise<string | null>;
  registrationError: string | null;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const ensureAndroidChannel = useCallback(async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
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
    setRegistrationError(null);
    await ensureAndroidChannel();

    const currentStatus = await ensurePermissionsAsync();
    if (currentStatus !== 'granted') {
      console.warn('Push notification permission not granted.');
      return null;
    }
    if (!Device.isDevice) {
      console.warn('Push notifications require a physical device.');
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      (Constants as any)?.easConfig?.projectId ||
      undefined;

    if (!projectId) {
      console.warn('Expo projectId not found. Configure extra.eas.projectId to enable push tokens.');
    }

    try {
      const tokenResponse = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync();
      const token = tokenResponse.data ?? null;
      if (token) {
        console.log('Expo push token obtido:', token);
        setExpoPushToken(token);
        setRegistrationError(null);
        return token;
      }
      console.warn('Expo push token not returned.');
      setRegistrationError('TokenUnavailable');
      return null;
    } catch (error) {
      console.error('Failed to obtain Expo push token', error);
      const message = error instanceof Error ? error.message : String(error);
      setRegistrationError(message);
      return null;
    }
  }, [ensurePermissionsAsync]);

  const scheduleLocalNotification = useCallback(
    async ({ title, body, seconds = 5, data }: LocalNotificationRequest): Promise<string | null> => {
      const delaySeconds = Math.max(1, seconds);

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
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: delaySeconds,
            repeats: false,
            channelId: Platform.OS === 'android' ? 'default' : undefined,
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

  const sendPushNotificationAsync = useCallback(
    async ({ title, body, data }: PushMessage): Promise<boolean> => {
      try {
        const token = expoPushToken ?? (await registerForPushNotificationsAsync());
        if (!token) {
          console.info('Push token indisponível. Disparando notificação local.');
          await scheduleLocalNotification({
            title,
            body,
            seconds: 2,
            data: data ? { ...data, localFallback: true } : { localFallback: true },
          });
          return false;
        }

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: token,
            sound: 'default',
            title,
            body,
            data,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn('Expo push API request failed', errorText);
          await scheduleLocalNotification({
            title,
            body,
            seconds: 2,
            data: data ? { ...data, localFallback: true } : { localFallback: true },
          });
          return false;
        }

        const raw = await response.json();
        console.log('Expo push send response', raw);
        const payload = (raw as any)?.data ?? raw;
        const status = Array.isArray(payload) ? payload[0]?.status : payload?.status;
        if (status !== 'ok') {
          console.warn('Expo push API returned error', raw);
          await scheduleLocalNotification({
            title,
            body,
            seconds: 2,
            data: data ? { ...data, localFallback: true } : { localFallback: true },
          });
          return false;
        }
        const ticketId = Array.isArray(payload) ? payload[0]?.id : payload?.id;
        if (ticketId) {
          console.log('Expo push ticket id', ticketId);
        }
        return true;
      } catch (error) {
        console.error('Failed to send push notification', error);
        await scheduleLocalNotification({
          title,
          body,
          seconds: 2,
          data: data ? { ...data, localFallback: true } : { localFallback: true },
        });
        return false;
      }
    },
    [expoPushToken, registerForPushNotificationsAsync, scheduleLocalNotification],
  );

  useEffect(() => {
    ensurePermissionsAsync();
  }, [ensurePermissionsAsync]);

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📩 Notificação recebida em foreground:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('📱 Usuário clicou na notificação:', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (permissionStatus === 'granted' && !expoPushToken && Device.isDevice) {
      registerForPushNotificationsAsync().catch(error => {
        console.warn('Automatic push registration failed', error);
      });
    }
  }, [permissionStatus, expoPushToken, registerForPushNotificationsAsync]);

  const value = useMemo(
    () => ({
      expoPushToken,
      permissionStatus,
      registerForPushNotificationsAsync,
      sendPushNotificationAsync,
      scheduleLocalNotification,
      registrationError,
    }),
    [
      expoPushToken,
      permissionStatus,
      registerForPushNotificationsAsync,
      sendPushNotificationAsync,
      scheduleLocalNotification,
      registrationError,
    ],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
