import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './Navigation';
import PushNotification from 'react-native-push-notification';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

/**
 * Requests notification permissions from the user
 * @returns {Promise<boolean>} Whether permission was granted
 */

const requestUserPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const authStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      console.log('Notification permission status:', authStatus);
      return authStatus === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS permissions are handled automatically by react-native-push-notification
    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Creates a notification channel for Android devices
 * @returns {Promise<void>}
 */
const createNotificationChannel = async () => {
  return new Promise((resolve, reject) => {
    PushNotification.channelExists('angerApp', exists => {
      if (!exists) {
        PushNotification.createChannel(
          {
            channelId: 'angerApp',
            channelName: 'Updates Channel',
            channelDescription: 'A channel to categorise your notifications',
            playSound: true,
            soundName: 'custom_sound',
            importance: 4,
            vibrate: true,
            enableVibration: true,
            enableLights: true,
            enableSound: true,
            lockscreenVisibility: 1,
            bypassDnd: true,
            showBadge: true,
            audioAttributes: {
              usage: 'notification',
              contentType: 'sound',
              flags: 0,
            },
          },
          created => {
            if (created) {
              console.log('Notification channel created successfully');
              resolve();
            } else {
              reject(new Error('Failed to create notification channel'));
            }
          },
        );
      } else {
        console.log('Notification channel already exists');
        resolve();
      }
    });
  });
};

const App = () => {
  useEffect(() => {
    let unsubscribeMessaging;

    const setupNotifications = async () => {
      try {
        const hasPermission = await requestUserPermission();
        if (!hasPermission) {
          console.warn('Notification permission not granted');
          return;
        }

        if (Platform.OS === 'android') {
          await createNotificationChannel();
        }

        // Listen for messages when app is in foreground
        unsubscribeMessaging = messaging().onMessage(async remoteMessage => {
          PushNotification.localNotification({
            channelId: 'angerApp',
            title: remoteMessage.notification.title,
            message: remoteMessage.notification.body,
            soundName: 'custom_sound',
            vibrate: true,
            actions: ['Stop Sound'],
            invokeApp: false,
            id: Date.now().toString(),
          });
        });
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();

    // Cleanup function
    return () => {
      if (unsubscribeMessaging) {
        unsubscribeMessaging();
      }
    };
  }, []);

  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
