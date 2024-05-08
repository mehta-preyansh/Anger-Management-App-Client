import React, { useContext, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/authContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = ({ navigation }) => {
  //Global state through context
  const [state, setState] = useContext(AuthContext)
  //Component's local state
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  GoogleSignin.configure({
    webClientId:
      "544509776632-i7uufe6fnvdllpmhmm1r33g2i26gbbne.apps.googleusercontent.com",
  });
  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      // Get the users ID token
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    }
    catch (e) {
      console.log(e)
    }

  }

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
    setLoading(true);
    if (validation()) {
      fetch(`https://anger-management-app-server.onrender.com/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
        .then(response => {
          return response.json();
        })
        .then(async response => {
          if (response.status == 200) {
            // Handle successful login
            Alert.alert(response.message)
            await AsyncStorage.setItem('user', JSON.stringify(response.user))
            setLoading(false);
            setState({ ...state, user: { ...state.user , info: response.user} })
          } else {
            setLoading(false);
            // Handle failed login
            Alert.alert(response.message);
            setPassword('');
          }
        })
        .catch(error => {
          setLoading(false);
          Alert.alert('Internal server error');
        });
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={{ color: 'white', fontSize: 25, paddingLeft: 20 }}>
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text
                style={{
                  fontSize: 24,
                  color: '#fff',
                  textTransform: 'uppercase',
                }}>
                Login
              </Text>
            </TouchableOpacity>
          )}
          {/* <Text style={{ color: '#d9d9d9' }}>Or continue with</Text>
          <TouchableOpacity onPress={onGoogleButtonPress}>
            <Icon name="google" size={22} color="#fff" />
          </TouchableOpacity> */}
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Text style={{ color: '#d9d9d9' }}>New User?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('register');
              }}>
              <Text style={{ color: '#8a445f' }}>Register here.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar hidden />
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
