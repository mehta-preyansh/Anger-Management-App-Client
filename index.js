import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

// Handle background messages from Firebase
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Show a local notification using the message content
  PushNotification.localNotification({
    channelId: 'angerApp', // Must match the created notification channel ID
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body, 
  }); 
});

// Register the root component of the app
AppRegistry.registerComponent(appName, () => App);
