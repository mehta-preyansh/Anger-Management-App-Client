import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AUTH_ENDPOINT, CLIENT_ID, CODE_CHALLENGE, ORIGIN_STATE, REDIRECT_URI} from '@env' 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const authUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=${CODE_CHALLENGE}&code_challenge_method=S256&state=${ORIGIN_STATE}&redirect_uri=${REDIRECT_URI}`;

  useEffect(()=>{
    setLoading(true)
    const getTokens = async ()=> {
      const accessToken = await AsyncStorage.getItem('accessToken')
      const refreshToken = await AsyncStorage.getItem('refreshToken')
      console.log(accessToken, refreshToken)
    }
    getTokens()
  },[])
  const connectToFitbit = async () => {
    await Linking.openURL(authUrl);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.wrapper}>
        {loading ? (
          <ActivityIndicator />
        ) : isConnected ? (
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
