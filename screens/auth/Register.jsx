import React, {useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

const Register = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  GoogleSignin.configure({
    webClientId:
      '544509776632-i7uufe6fnvdllpmhmm1r33g2i26gbbne.apps.googleusercontent.com',
  });
  
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    console.log('started');
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    console.log('step 1');
    // Get the users ID token
    try {
      const {idToken, user} = await GoogleSignin.signIn();
      console.log(user);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (e) {
      console.log(e);
      return null;
    }


  }

  const validation = ()=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address');
      setLoading(false);
      return false;
    }
    if ([username, email, password, cpassword].some(field => !field)) {
      Alert.alert(
        'Required fields',
        'Please fill in all the compulsory details.',
      );
      setLoading(false);
      return false;
    }
    if (password !== cpassword) {
      Alert.alert('Invalid password', 'Passwords do not match');
      setLoading(false);
      return false;
    }
    if (password.length < 8) {
      Alert.alert(
        'Invalid password',
        'Password must be at least 8 characters long.',
      );
      setLoading(false);
      return false;
    }
    return true
  }

  const handleRegister = () => {
    setLoading(true);
    if(validation()){
      fetch(`https://anger-management-app-server.onrender.com/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          mobile: mobile,
        }),
      })
      // console.log("hi")
      .then(response => {
        setLoading(false);
        return response.json()
      })
      .then(response=>{
        if (response.status==201) {
          //Registered successfully
          Alert.alert(response.message);
          navigation.navigate('login');
        } else {
          // Failed to register
          Alert.alert(response.message);
        }
      })
      .catch(error => {
        setLoading(false);
        Alert.alert("Internal server error")
        console.error('Error:', error);
      });
    }
    else{
      setPassword('')
      setCpassword('')
      setLoading(false)
    }
  };

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
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#ffffff95"
          />
          <TextInput
            style={styles.input}
            placeholder="Username *"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#ffffff95"
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor="#ffffff95"
          />
          <TextInput
            style={styles.input}
            placeholder="Password *"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#ffffff95"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            secureTextEntry={true}
            value={cpassword}
            onChangeText={setCpassword}
            placeholderTextColor="#ffffff95"
          />
        </View>
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleRegister}>
              <Text
                style={{
                  fontSize: 24,
                  color: '#fff',
                  textTransform: 'uppercase',
                }}>
                Register
              </Text>
            </TouchableOpacity>
          )}
          {/* <Text style={{color: '#d9d9d9'}}>Or continue with</Text> */}
          {/* <TouchableOpacity onPress={onGoogleButtonPress}>
            <Icon name="google" size={22} color="#fff" />
          </TouchableOpacity> */}
          <View style={{flexDirection: 'row', gap: 6}}>
            <Text style={{color: '#d9d9d9'}}>Old User?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('login');
              }}>
              <Text style={{color: '#8a445f'}}>Login here.</Text>
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
    marginTop: 50,
    marginBottom: 50,
    gap: 20,
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

export default Register;
