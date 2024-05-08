import React, { useEffect } from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import Navigation from './Navigation';
import { Linking } from 'react-native';


function App() {
  useEffect(() => {
    const initialUrl = Linking.getInitialURL()
    console.log(initialUrl)
    const handleDeepLink = (url) => {
      console.log(url)
    };

    // Listen for deep links when the component mounts
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Clean up the subscription when the component unmounts
    return () => subscription.remove();
  }, );

  return (
    <NavigationContainer>
      <Navigation/>
    </NavigationContainer>
  );
}

export default App;
