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
  API_ENDPOINT,
  SERVER_URL,
} from '@env';
import {AuthContext} from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAlt from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [state, setState] = useContext(AuthContext);
  const [HR, setHR] = useState(70);
  const [randomSleepTime, setSleepTime] = useState({hours: 7, minutes: 40});
  const [randomSteps, setSteps] = useState(3578);
  const authUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256&state=${ORIGIN_STATE}&redirect_uri=${REDIRECT_URI}`;
  const initialUrl = Linking.getInitialURL();

  const handleDeepLink = (url = initialUrl) => {
    setLoading(true);
    const incomingState = url
      .split('?')[1]
      .split('&')[1]
      .split('=')[1]
      .split('#')[0];
    if (incomingState === ORIGIN_STATE) {
      const authorizationCode = url?.split('?')[1].split('&')[0].split('=')[1];
      const tokenUrl = `${TOKEN_ENDPOINT}?client_id=${CLIENT_ID}&code=${authorizationCode}&code_verifier=${CODE_VERIFIER}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`;
      fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(res =>
          res.json().then(async response => {
            const {user_id, access_token, refresh_token, expires_in} = response;
            fetch(`${SERVER_URL}/userId`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: state.user.info.username,
                userId: user_id,
              }),
            })
              .then(res => res.json())
              .then(async response => {
                await AsyncStorage.setItem(
                  'tokens',
                  JSON.stringify({
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresIn: expires_in,
                    user_id,
                  }),
                );
                setState({
                  ...state,
                  user: {
                    ...state.user,
                    isAuthenticated: true,
                  },
                  tokens: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresIn: expires_in,
                    user_id: user_id,
                  },
                });
                setLoading(false);
              })
              .catch(e => {
                Alert.alert(
                  'Error getting user ID',
                  'An error occurred while trying to connect to the server',
                );
                setLoading(false);
              });
          }),
        )
        .catch(e => console.log('Error'));
    } else {
      Alert.alert('Error', 'The request was not generated from this app');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listen for deep links when the component mounts
    const subscription = Linking.addEventListener('url', ({url}) => {
      handleDeepLink(url);
    });
    // Clean up the subscription when the component unmounts
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (state.user.isAuthenticated && state.tokens.accessToken) {
      setDataLoading(true);
      const intervalId = setInterval(() => {
        fetch(
          `${API_ENDPOINT}/1/user/${state.tokens.user_id}/activities/heart/date/today/1m.json`,
          {
            method: 'GET',
            headers: {
              authorization: `Bearer ${state.tokens.accessToken}`,
            },
          },
        )
          .then(response => response.json())
          .then(res =>{
            setHR(res['activities-heart'][0]['value']['restingHeartRate'])
            setDataLoading(false)
          }
          )
          .catch(e => console.log(e));
      }, 15000);

      return () => clearInterval(intervalId);
    }
  }, [state.user.isAuthenticated]);

  const connectToFitbit = async () => {
    await Linking.openURL(authUrl);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        {loading ? (
          <ActivityIndicator />
        ) : state.user.isAuthenticated ? (
          <View style={styles.container}>
            <View style={styles.packet}>
              {dataLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.textContent}>{`Heart rate - ${HR}`}</Text>
              )}

              <Icon name="heart" size={22} color={'#fff'} />
            </View>
            <View style={styles.packet}>
              {dataLoading ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={styles.textContent}>{`Steps - ${randomSteps}`}</Text>
              )}
              <Icon name="footsteps" size={22} color={'#fff'} />
            </View>
            <View style={styles.packet}>
              {dataLoading ? (
                <ActivityIndicator />
              ) : (
                <Text
                  style={
                    styles.textContent
                  }>{`Sleep time - ${randomSleepTime.hours}h ${randomSleepTime.minutes}mins`}</Text>
              )}
              <IconAlt name="sleep" size={22} color={'#fff'} />
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={connectToFitbit} style={{marginRight: 10}}>
            <View style={styles.submitBtn}>
              <Text style={{color: '#fff', fontSize: 20}}>{`Connect`}</Text>
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
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingVertical: 50,
    gap: 50,
  },
  packet: {
    backgroundColor: '#7b5085',
    padding: 40,
    marginBottom: 20,
    borderRadius: 15,
    // flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    // justifyContent: 'space-between'
  },
  textContent: {
    fontSize: 18,
    color: '#fff',
    padding: 5,
  },
});
