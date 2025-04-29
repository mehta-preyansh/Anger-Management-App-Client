import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { initialState } from './initialState';

/**
 * @typedef {Object} AuthState
 * @property {Object} user - User information
 * @property {Object} tokens - Authentication tokens
 * @property {Array} events - User events
 * @property {string} deviceId - Device identifier
 */

/**
 * @type {React.Context<[AuthState, React.Dispatch<React.SetStateAction<AuthState>>]>}
 */
const AuthContext = createContext();

/**
 * AuthProvider component that manages authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider component
 */
const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads persisted data from AsyncStorage
   * @returns {Promise<void>}
   */
  const loadPersistedData = useCallback(async () => {
    try {
      const [user, events, tokens, deviceId] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('events'),
        AsyncStorage.getItem('tokens'),
        AsyncStorage.getItem('deviceId'),
      ]);

      // Parse stored JSON data
      const parsedUser = user ? JSON.parse(user) : null;
      const parsedEvents = events ? JSON.parse(events) : null;
      const parsedTokens = tokens ? JSON.parse(tokens) : null;
      const parsedDeviceId = deviceId ? JSON.parse(deviceId) : null;

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
    } catch (err) {
      setError(err);
      console.error('Error loading persisted data:', err);
      // Fallback to initial state on error
      setState(initialState);
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  // Provide loading and error states through context
  const value = {
    state,
    setState,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
