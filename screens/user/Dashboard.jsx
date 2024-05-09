import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AUTH_ENDPOINT,
  TOKEN_ENDPOINT,
  CLIENT_ID,
  CODE_CHALLENGE,
  CODE_VERIFIER,
  ORIGIN_STATE,
  REDIRECT_URI,
} from '@env';
import {AuthContext} from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const authUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256&state=${ORIGIN_STATE}&redirect_uri=${REDIRECT_URI}`;
  const initialUrl = Linking.getInitialURL();
  const handleDeepLink = (url = initialUrl) => {
    const incomingState = url
    .split('?')[1]
    .split('&')[1]
    .split('=')[1]
    .split('#')[0];
    if (incomingState === ORIGIN_STATE) {
      const authorizationCode = url
      ?.split('?')[1]
      .split('&')[0]
      .split('=')[1];
      const tokenUrl = `${TOKEN_ENDPOINT}?client_id=${CLIENT_ID}&code=${authorizationCode}&code_verifier=${CODE_VERIFIER}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`;
      fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(res => res.json().then(async response => {
          await AsyncStorage.setItem('tokens', JSON.stringify(response))
          setState({
            ...state,
            user: {
              ...state.user,
              tokens: {
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
                expiresIn: response.expires_in,
                userId: response.user_id
              },
              isAuthenticated: true,
            },
          });
          setLoading(false)
        }))
        .catch(e => console.log(e));
    } else {
      Alert.alert('Error', 'The request was not generated from this app');
      setLoading(false)
    }
  };
  useEffect(() => {
    console.log(state.user.tokens.access_token)
    if(state.user.isAuthenticated){
      fetch(`https://api.fitbit.com/1/user/${state.user.tokens.user_id}/br/date/2023-12-26/.json`,{
      method: 'GET',
      headers: {
        'authorization': `Bearer ${state.user.tokens.access_token}`
      }
    }).then(res => console.log(res)).catch(e =>console.log(e))
    }
    // Listen for deep links when the component mounts
    const subscription = Linking.addEventListener('url', ({url}) => {
      handleDeepLink(url);
    });
    // Clean up the subscription when the component unmounts
    return () => subscription.remove();
  },[]);

  const connectToFitbit = async () => {
    setLoading(true)
    await Linking.openURL(authUrl);
    setLoading(false)
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        {loading ? (
          <ActivityIndicator />
        ) : state.user.isAuthenticated ? (
          <Text style={{color: '#fff', fontSize: 20}}>Connected</Text>
        ) : (
          <TouchableOpacity onPress={connectToFitbit} style={{marginRight: 10}}>
            <View style={styles.submitBtn}>
              <Text style={{color: '#fff', fontSize: 20}}>Connect</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    backgroundColor: '#0b0909',
  },
  submitBtn: {
    backgroundColor: '#4B20F3',
    padding: 10,
    borderRadius: 5,
  },
});
