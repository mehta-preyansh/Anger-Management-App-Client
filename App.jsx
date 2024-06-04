import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './Navigation'
import PushNotification from 'react-native-push-notification';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Request permission for receiving push notifications (optional)
const requestUserPermission = async () => {
  const authStatus = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );
  if (authStatus) {
    console.log('Authorization status:', authStatus);
  }
};


const App = ()=> {
  useEffect(()=>{
    PushNotification.channelExists('angerApp', exists => {
      if (!exists) {
        PushNotification.createChannel(
          {
            channelId: 'angerApp',
            channelName: 'Updates Channel',
            channelDescription: 'A channel to categorise your notifications',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          },
          created => console.log(`createChannel returned '${created}'`),
        );
      }
    });
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Need to send notification/alarm to the user
      PushNotification.localNotification({
        channelId: 'angerApp',
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });
    });
    return unsubscribe;
  },[])

  return (
    <NavigationContainer>
      <Navigation/>
    </NavigationContainer>
  );
}
export default App;
