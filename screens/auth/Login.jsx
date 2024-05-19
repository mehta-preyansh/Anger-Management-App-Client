import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {AuthContext} from '../../context/authContext';
import {SERVER_URL} from '@env';
import messaging from '@react-native-firebase/messaging';


const Login = ({navigation}) => {
  //Global state through context
  const [state, setState] = useContext(AuthContext);
  //Component's local state
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);

  const validation = () => {
    if (password.length < 8) {
      Alert.alert(
        'Password is too short',
        'Password must be at least 8 characters long.',
      );
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validation()) {
      fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          deviceId: state.deviceId
        }),
      })
        .then(response => {
          return response.json();
        })
        .then(async response => {
          if (response.status == 200) {
            // Handle successful login
            Alert.alert(response.message);
            await AsyncStorage.setItem('user', JSON.stringify(response.user));
            await AsyncStorage.setItem('events', JSON.stringify(response.user.events));
            await AsyncStorage.setItem('deviceId', JSON.stringify(response.user.deviceId));
            setLoading(false);
            setState({
              ...state,
              user: {
                ...state.user,
                info: {
                  ...state.user.info,
                  email: response.user.email,
                  username: response.user.username,
                  phone: response.user.phone,
                },
                id: response.user._id
              },
              events: response.user.events,
              deviceId: response.user.deviceId
            });
          } else {
            setLoading(false);
            // Handle failed login
            Alert.alert(response.message);
            setPassword('');
          }
        })
        .catch(error => {
          setLoading(false);
          console.log(error)
          Alert.alert('Internal server error');
        });
    }
  };

  const retrieveToken = async () => {
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      throw new Error(error);
    }
    // Now you have the device token, you can send it to your server for further use (e.g., for sending push notifications)
  };

  useEffect(() => {
    console.log(state);
    const fetchDeviceToken = async () => {
      retrieveToken().then(token =>{  
      setState({...state, deviceId: [token]});
      setDisabled(false);
    }).catch(err => Alert.alert('Error', 'Could not get device token'));
  }
    if(state.deviceId.length == 0) {

      fetchDeviceToken()
    }
  }, [state]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={{color: 'white', fontSize: 25, paddingLeft: 20}}>
          KRODhFit
        </Text>
      </View>
      <View style={styles.loginForm}>
        <View style={styles.inputFields}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#fff"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#fff"
          />
        </View>
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity style={styles.loginButton} disabled={disabled} onPress={handleLogin}>
              <Text
                style={{
                  fontSize: 24,
                  color: '#fff',
                  textTransform: 'uppercase',
                }}>
                {`${disabled? 'Loading...': 'Login'}`}
              </Text>
            </TouchableOpacity>
          )}
          <View style={{flexDirection: 'row', gap: 6}}>
            <Text style={{color: '#d9d9d9'}}>New User?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('register');
              }}>
              <Text style={{color: '#8a445f'}}>Register here.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* <StatusBar hidden /> */}
    </View>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
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
    borderRadius: 60,
    width: '100%',
    backgroundColor: '#4B20F3',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
  },
});
export default Login;
