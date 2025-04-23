import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { initialState } from './initialState';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Load persisted auth/user data from AsyncStorage on app start
    const localStorageData = async () => {
      const user = await AsyncStorage.getItem('user');
      const events = await AsyncStorage.getItem('events');
      const tokens = await AsyncStorage.getItem('tokens');
      const deviceId = await AsyncStorage.getItem('deviceId');

      // Parse stored JSON data
      const parsedUser = JSON.parse(user);
      const parsedEvents = JSON.parse(events);
      const parsedTokens = JSON.parse(tokens);
      const parsedDeviceId = JSON.parse(deviceId);

      // Restore state if user exists, else fallback to initial state
      if (parsedUser) {
        setState({
          ...state,
          user: {
            ...state.user,
            id: parsedUser._id,
            isAuthenticated: parsedTokens?.user_id ? true : false,
            info: {
              email: parsedUser.email,
              phone: parsedUser.phone,
              username: parsedUser.username,
            },
          },
          tokens: parsedTokens || initialState.tokens,
          events: parsedEvents || initialState.events,
          deviceId: parsedDeviceId || initialState.deviceId,
        });
      } else {
        setState(initialState);
      }
    };

    localStorageData();
  }, []);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
