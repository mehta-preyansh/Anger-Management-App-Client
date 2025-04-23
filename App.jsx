import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './Navigation';
import PushNotification from 'react-native-push-notification';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Ask the user for notification permission (Android only)
const requestUserPermission = async () => {
  const authStatus = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (authStatus) {
    console.log('Authorization status:', authStatus);
  }
};

const App = () => {
  useEffect(() => {
    // Ensure notification channel exists (needed for Android 8+)
    PushNotification.channelExists('angerApp', exists => {
      if (!exists) {
        PushNotification.createChannel(
          {
            channelId: 'angerApp', // ID used when triggering notifications
            channelName: 'Updates Channel', // Visible name
            channelDescription: 'A channel to categorise your notifications',
            playSound: true,
            soundName: 'default',
            importance: 4, // Max importance for heads-up notifications
            vibrate: true,
          },
          created => console.log(`createChannel returned '${created}'`),
        );
      }
    });

    requestUserPermission();

    // Listen for messages when app is in foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        channelId: 'angerApp',
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });
    });

    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
