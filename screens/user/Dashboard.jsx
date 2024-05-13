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
import Icon from 'react-native-vector-icons/Ionicons';
import IconAlt from 'react-native-vector-icons/MaterialCommunityIcons'
import PushNotification from 'react-native-push-notification';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const [HR, setHR] = useState(70);
  const [randomSleepTime, setSleepTime] = useState({hours: 7, minutes: 40});
  const [randomSteps, setSteps] = useState(3578);
  const authUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256&state=${ORIGIN_STATE}&redirect_uri=${REDIRECT_URI}`;
  const initialUrl = Linking.getInitialURL();
  const handleDeepLink = (url = initialUrl) => {
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
            await AsyncStorage.setItem('tokens', JSON.stringify(response));
            setState({
              ...state,
              user: {
                ...state.user,
                tokens: {
                  accessToken: response.access_token,
                  refreshToken: response.refresh_token,
                  expiresIn: response.expires_in,
                  userId: response.user_id,
                },
                isAuthenticated: true,
              },
            });
            setLoading(false);
          }),
        )
        .catch(e => console.log(e));
    } else {
      Alert.alert('Error', 'The request was not generated from this app');
      setLoading(false);
    }
  };
  useEffect(() => {
    if (state.user.isAuthenticated) {
      //   fetch(`https://api.fitbit.com/1/user/${state.user.tokens.userId}/spo2/date/2023-12-26/.json`,{
      //   method: 'GET',
      //   headers: {
      //     'authorization': `Bearer ${state.user.tokens.access_token}`
      //   }
      // }).then(res => console.log(res)).catch(e =>console.log(e))
      setInterval(() => {
        const randomisezValue = Math.floor(Math.random() * (80 - 70 + 1)) + 70;
        setHR(randomisezValue);
      }, 10000);

      setInterval(() => {
        setSteps(prev => prev + Math.floor(Math.random() * (5 - 3 + 1)) + 3);
      }, 30000);
    }
    // Listen for deep links when the component mounts
    const subscription = Linking.addEventListener('url', ({url}) => {
      handleDeepLink(url);
    });
    // Clean up the subscription when the component unmounts
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if(HR>=78){
      PushNotification.localNotification({
        channelId: "angerApp",
        title: "Your heart rate is raising rapidly.", // Specify the title of the notification
        message: `HR is now ${HR}`, // Specify the message of the notification
      });
    }
  }, [HR]);

  const connectToFitbit = async () => {
    setLoading(true);
    await Linking.openURL(authUrl);
    setLoading(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        {loading ? (
          <ActivityIndicator />
        ) : state.user.isAuthenticated ? (
          <View style={styles.container}>
            <View style={styles.packet}>
              <Text
                style={styles.textContent}>{`Heart rate - ${HR}`}</Text>
                <Icon name='heart' size={22} color={"#fff"}/>
            </View>
            <View style={styles.packet}>
              <Text style={styles.textContent}>{`Steps - ${randomSteps}`}</Text>
              <Icon name='footsteps' size={22} color={"#fff"}/> 
            </View>
            <View style={styles.packet}>
              <Text
                style={
                  styles.textContent
                }>{`Sleep time - ${randomSleepTime.hours}h ${randomSleepTime.minutes}mins`}</Text>
                <IconAlt name='sleep' size={22} color={"#fff"}/> 
            </View>
          </View>
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
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingVertical: 50,
    gap: 50
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
    padding: 5
  },
});
