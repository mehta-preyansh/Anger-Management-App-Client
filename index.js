/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  //need to send notification/alarm to the user
  PushNotification.localNotification({
    channelId: 'angerApp',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  }); 
});

AppRegistry.registerComponent(appName, () => App);
