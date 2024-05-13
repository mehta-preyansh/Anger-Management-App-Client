import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './Navigation'
import PushNotification from 'react-native-push-notification';

PushNotification.createChannel(
  {
    channelId: "angerApp", // This value must be unique
    channelName: "My channel", // The name of the channel
    channelDescription: "A channel to categorise your notifications", // The description of the channel
    playSound: true, // Whether the notification should play a sound or not
    soundName: "default", // The sound to play
    importance: 4, // The importance of the notification
    vibrate: true, // Whether the notification should vibrate or not
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

const App = ()=> {
  

  return (
    <NavigationContainer>
      <Navigation/>
    </NavigationContainer>
  );
}

export default App;
