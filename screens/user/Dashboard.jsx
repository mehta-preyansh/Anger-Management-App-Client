import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {API_ENDPOINT, CLIENT_ID} from '@env' 

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const authUrl = `${API_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=E39mrhq-0cLr1BR-uaPjriyDqMVaVyi9K09VWXQ62BM&code_challenge_method=S256&state=3m6y2p3b2r0t2v5g0j6x0u073359202c&redirect_uri=http%3A%2F%2Flocalhost%3A8081`;

  const clientId = '23S2L6';
  const originState = '3m6y2p3b2r0t2v5g0j6x0u073359202c';
  const code_verifier =
    '1e012t691l1d3j5k731s1j3y3y1u2p57562v4x3y3z26310d2k6n41184z6i5x6j012g285d3n1r1k052f3y6a6o0n576w1x2r261f2u0d5w135p3g282j3a6a13043f';
  const code_challenge = 'E39mrhq-0cLr1BR-uaPjriyDqMVaVyi9K09VWXQ62BM';

  const connectToFitbit = async () => {
    console.log(authUrl)
    await Linking.openURL(authUrl);

    // const openCustomTab = () => {
    //   CustomTabs.openURL('https://example.com', {
    //     toolbarColor: '#4f2788', // Customize toolbar color
    //     showPageTitle: true, // Show web page title in the toolbar
    //     enableUrlBarHiding: true, // Enable URL bar hiding when the user scrolls down
    //   });
    // };
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
