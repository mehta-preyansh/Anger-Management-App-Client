import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

// Handle background messages from Firebase
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  
  try {
    // Show a local notification using the message content
    PushNotification.localNotification({
      channelId: 'angerApp',
      title: remoteMessage.notification?.title || 'New Message',
      message: remoteMessage.notification?.body || 'You have a new message',
      soundName: 'custom_sound',
      vibrate: true,
      // Add actions for sound control
      actions: ['Stop Sound'],
      invokeApp: false,
      // Add a unique ID for this notification
      id: Date.now().toString(),
    });
    
    // Return a promise to indicate the message was handled
    return Promise.resolve();
  } catch (error) {
    console.error('Error handling background message:', error);
    return Promise.reject(error);
  }
});

// Handle notification actions
PushNotification.configure({
  onAction: function(notification) {
    if (notification.action === 'Stop Sound') {
      // Stop the sound by clearing the notification
      PushNotification.cancelLocalNotification(notification.id);
      // You can also add additional sound stopping logic here
    }
  },
});

// Register the root component of the app
AppRegistry.registerComponent(appName, () => App);

