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
import {AuthContext} from '../../context/authContext'; // Importing context for auth state
import AsyncStorage from '@react-native-async-storage/async-storage'; // For persistent storage
import Icon from 'react-native-vector-icons/Ionicons'; // Importing icons for heart, footsteps, etc.
import IconAlt from 'react-native-vector-icons/MaterialCommunityIcons'; // Additional icons for sleep

export default function Dashboard() {
  // State variables to manage loading, data, and user authentication
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [state, setState] = useContext(AuthContext); // Context to get authentication state
  const [HR, setHR] = useState(70); // Default heart rate
  const [randomSleepTime, setSleepTime] = useState({hours: 7, minutes: 40}); // Default sleep time
  const [randomSteps, setSteps] = useState(3578); // Default step count
  
  // Construct the authorization URL for Fitbit OAuth flow
  const authUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256&state=${ORIGIN_STATE}&redirect_uri=${REDIRECT_URI}`;
  
  // Retrieve the initial URL from the app's deep linking
  const initialUrl = Linking.getInitialURL();

  // Function to handle deep linking callback from Fitbit
  const handleDeepLink = (url = initialUrl) => {
    setLoading(true);
    
    // Extract the state and authorization code from the URL
    const incomingState = url
      .split('?')[1]
      .split('&')[1]
      .split('=')[1]
      .split('#')[0];
    
    // Validate the state to prevent CSRF attacks
    if (incomingState === ORIGIN_STATE) {
      const authorizationCode = url?.split('?')[1].split('&')[0].split('=')[1];
      
      // Construct the URL to exchange the authorization code for an access token
      const tokenUrl = `${TOKEN_ENDPOINT}?client_id=${CLIENT_ID}&code=${authorizationCode}&code_verifier=${CODE_VERIFIER}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`;
      
      // Fetch the access token
      fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(res =>
          res.json().then(async response => {
            const {user_id, access_token, refresh_token, expires_in} = response;
            
            // Send user ID to the backend for storing in the database
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
                // Store tokens securely in AsyncStorage
                await AsyncStorage.setItem(
                  'tokens',
                  JSON.stringify({
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresIn: expires_in,
                    user_id,
                  }),
                );
                
                // Update the auth context with the tokens and user info
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
      // Alert if the state doesn't match
      Alert.alert('Error', 'The request was not generated from this app');
      setLoading(false);
    }
  };

  // UseEffect hook to listen for deep linking events
  useEffect(() => {
    // Listen for incoming deep links
    const subscription = Linking.addEventListener('url', ({url}) => {
      handleDeepLink(url);
    }); 
    
    // Clean up the subscription when the component unmounts
    return () => subscription.remove();
  }, []);

  // Fetch heart rate data from the API periodically after user authentication
  useEffect(() => {
    if (state.user.isAuthenticated && state.tokens.accessToken) {
      setDataLoading(true);
      
      // Fetch heart rate data every 15 seconds
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
            // Set the heart rate data after fetching
            setHR(res['activities-heart'][0]['value']['restingHeartRate'])
            setDataLoading(false)
          })
          .catch(e => console.log(e));
      }, 15000);

      // Clean up the interval when the component unmounts or auth state changes
      return () => clearInterval(intervalId);
    }
  }, [state.user.isAuthenticated]);

  // Function to initiate the connection with Fitbit OAuth flow
  const connectToFitbit = async () => {
    // Open the Fitbit authorization URL in the default browser
    await Linking.openURL(authUrl);
  };

  // Function to send test notification
  const sendTestNotification = async () => {
    try {
      if (!state.deviceId || state.deviceId.length === 0) {
        Alert.alert('Error', 'Device token not found');
        return;
      }

      const response = await fetch(`${SERVER_URL}/notification/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceToken: state.deviceId[0],
          title: 'Test Notification',
          body: 'This is a test notification from your dashboard!',
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Test notification sent successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        {loading ? (
          <ActivityIndicator /> // Show a loading spinner while loading
        ) : state.user.isAuthenticated ? (
          <View style={styles.container}>
            {/* Display health data if authenticated */}
            <View style={styles.packet}>
              {dataLoading ? (
                <ActivityIndicator /> // Show loading spinner while fetching data
              ) : (
                <Text style={styles.textContent}>{`Heart rate - ${HR}`}</Text>
              )}
              <Icon name="heart" size={22} color={'#fff'} /> {/* Heart icon */}
            </View>
            <View style={styles.packet}>
              {dataLoading ? (
                <ActivityIndicator /> // Show loading spinner while fetching data
              ) : (
                <Text style={styles.textContent}>{`Steps - ${randomSteps}`}</Text>
              )}
              <Icon name="footsteps" size={22} color={'#fff'} /> {/* Steps icon */}
            </View>
            <View style={styles.packet}>
              {dataLoading ? (
                <ActivityIndicator /> // Show loading spinner while fetching data
              ) : (
                <Text style={styles.textContent}>{`Sleep time - ${randomSleepTime.hours}h ${randomSleepTime.minutes}mins`}</Text>
              )}
              <IconAlt name="sleep" size={22} color={'#fff'} /> {/* Sleep icon */}
            </View>
            {/* Add test notification button */}
            <TouchableOpacity onPress={sendTestNotification} style={styles.notificationButton}>
              <Text style={styles.notificationButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Show the connect button if user is not authenticated
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
    alignItems: 'center',
    gap: 10,
  },
  textContent: {
    fontSize: 18,
    color: '#fff',
    padding: 5,
  },
  notificationButton: {
    backgroundColor: '#4B20F3',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  notificationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
