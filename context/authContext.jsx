import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {initialState} from './initialState';
const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const localStorageData = async () => {
      const user = await AsyncStorage.getItem('user');
      const events = await AsyncStorage.getItem('events');
      const tokens = await AsyncStorage.getItem('tokens');
      const deviceId = await AsyncStorage.getItem('deviceId');
      const parsedTokens = JSON.parse(tokens)
      const parsedUser = JSON.parse(user);
      const parsedEvents = JSON.parse(events);
      const parsedDeviceId = JSON.parse(deviceId);
      if(parsedUser){
        setState({
          ...state,
          user: {
            ...state.user,
            id: parsedUser._id,
            isAuthenticated: parsedTokens? (parsedTokens.user_id? true: false) : null,
            info: {
              email: parsedUser.email,
              phone: parsedUser.phone,
              username: parsedUser.username,
            },
          },
          tokens: parsedTokens ? parsedTokens : initialState.tokens,
          events: parsedEvents ? parsedEvents : initialState.events,
          deviceId: parsedDeviceId ? parsedDeviceId : initialState.deviceId,
        })
      }
      else {
        setState(initialState);
      }
    };
    localStorageData();
  }, []);

  return (
    <>
      <AuthContext.Provider value={[state, setState]}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export {AuthContext, AuthProvider};
