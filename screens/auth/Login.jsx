import React, {useContext, useEffect, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {AuthContext} from '../../context/authContext';
import {SERVER_URL} from '@env';
import messaging from '@react-native-firebase/messaging';
import {PlaceholderLoader} from '../../components/PlaceholderLoader';

// Constants
const MIN_PASSWORD_LENGTH = 8;
const STORAGE_KEYS = {
  USER: 'user',
  EVENTS: 'events',
  DEVICE_ID: 'deviceId',
};

// Validation messages
const VALIDATION_MESSAGES = {
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
  LOGIN_ERROR: 'Login failed. Please try again.',
  SERVER_ERROR: 'Internal server error',
  DEVICE_TOKEN_ERROR: 'Could not get device token',
};

const Login = ({navigation}) => {
  const {state, setState} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);

  // Validate form inputs
  const validateForm = useCallback(() => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert('Password is too short', VALIDATION_MESSAGES.PASSWORD_TOO_SHORT);
      setLoading(false);
      return false;
    }
    if (!username.trim()) {
      Alert.alert('Invalid Username', 'Please enter a valid username');
      setLoading(false);
      return false;
    }
    return true;
  }, [password, username]);

  // Handle successful login
  const handleSuccessfulLogin = useCallback(async (response) => {
    try {
      // Store user data in AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user)),
        AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(response.user.events)),
        AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, JSON.stringify(response.user.deviceId)),
      ]);

      // Update global state
      setState(prevState => ({
        ...prevState,
        user: {
          ...prevState.user,
          info: {
            ...prevState.user.info,
            email: response.user.email,
            username: response.user.username,
            phone: response.user.phone,
          },
          id: response.user._id,
        },
        events: response.user.events,
        deviceId: response.user.deviceId,
      }));

      Alert.alert('Success', response.message);
    } catch (error) {
      console.error('Error storing user data:', error);
      Alert.alert('Error', 'Failed to store user data');
    }
  }, [setState]);

  // Handle login request
  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          deviceId: state.deviceId,
        }),
        timeout: 10000, // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 200) {
        await handleSuccessfulLogin(data);
      } else {
        Alert.alert('Error', data.message || VALIDATION_MESSAGES.LOGIN_ERROR);
        setPassword('');
      }
    } catch (error) {
      Alert.alert('Error', VALIDATION_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  }, [username, password, state.deviceId, validateForm, handleSuccessfulLogin]);

  // Get Firebase device token
  const retrieveToken = useCallback(async () => {
    try {
      return await messaging().getToken();
    } catch (error) {
      console.error('Error retrieving device token:', error);
      throw error;
    }
  }, []);

  // Initialize device token
  useEffect(() => {
    const initializeDeviceToken = async () => {
      if (state.deviceId.length === 0) {
        setDisabled(true);
        try {
          const token = await retrieveToken();
          setState(prevState => ({...prevState, deviceId: [token]}));
        } catch (error) {
          Alert.alert('Error', VALIDATION_MESSAGES.DEVICE_TOKEN_ERROR);
        } finally {
          setDisabled(false);
        }
      }
    };

    initializeDeviceToken();
  }, [state.deviceId.length, retrieveToken, setState]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerText}>KRODhFit</Text>
      </View>

      <View style={styles.loginForm}>
        <View style={styles.inputFields}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#fff"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#fff"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.loginButton, (disabled || loading) && styles.disabledButton]}
            disabled={disabled || loading}
            onPress={handleLogin}>
            {loading ? (
              <PlaceholderLoader />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New User?</Text>
            <TouchableOpacity onPress={() => navigation.replace('register')}>
              <Text style={styles.registerLink}>Register here.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#0b0909',
  },
  header: {
    height: '10%',
    justifyContent: 'center',
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#45015d',
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    paddingLeft: 20,
  },
  loginForm: {
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  inputFields: {
    width: '100%',
    marginTop: 85,
    marginBottom: 135,
    gap: 30,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#292929',
    color: '#fff',
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  buttonContainer: {
    marginBottom: 50,
    width: '50%',
    aspectRatio: 1 / 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginButton: {
    height: 60,
    borderRadius: 60,
    width: '100%',
    backgroundColor: '#4B20F3',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 24,
    color: '#fff',
    textTransform: 'uppercase',
  },
  registerContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  registerText: {
    color: '#d9d9d9',
  },
  registerLink: {
    color: '#8a445f',
  },
});

export default Login;
