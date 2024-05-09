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
      const parsedTokens = JSON.parse(tokens)
      const parsedUser = JSON.parse(user);
      const parsedEvents = JSON.parse(events);
      setState({
        ...state,
        user: {
          ...state.user,
          id: parsedUser._id,
          isAuthenticated: parsedTokens.user_id? true: false,
          info: parsedUser
            ? {
                email: parsedUser.email,
                phone: parsedUser.phone,
                username: parsedUser.username,
              }
            : initialState.user.info,
          tokens: parsedTokens
        },
        events: parsedEvents ? parsedEvents : initialState.events,
      });
      console.log(state)
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
