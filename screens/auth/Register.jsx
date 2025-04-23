import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SERVER_URL} from '@env';
import {PlaceholderLoader} from '../../components/PlaceholderLoader';

const Register = ({navigation}) => {
  // Local state for the form fields and loading state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Validation function to check if the inputs are correct
  const validation = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
    // Check for valid email format
    if (!regex.test(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address');
      setLoading(false);
      return false;
    }
    // Check if any field is empty
    if ([username, email, password, cpassword].some(field => !field)) {
      Alert.alert(
        'Required fields',
        'Please fill in all the compulsory details.',
      );
      setLoading(false);
      return false;
    }
    // Check if password and confirm password match
    if (password !== cpassword) {
      Alert.alert('Invalid password', 'Passwords do not match');
      setLoading(false);
      return false;
    }
    // Check if password is at least 8 characters
    if (password.length < 8) {
      Alert.alert(
        'Invalid password',
        'Password must be at least 8 characters long.',
      );
      setLoading(false);
      return false;
    }
    return true;
  };

  // Function to handle registration
  const handleRegister = () => {
    setLoading(true); // Set loading state to true while processing
    if (validation()) {
      // Proceed with registration if validation passes
      fetch(`${SERVER_URL}/register`, {
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
        .then(response => response.json()) // Parse the response as JSON
        .then(response => {
          if (response.status == 201) {
            // Successful registration
            setLoading(false); // Set loading to false
            Alert.alert(response.message); // Show success message
            navigation.navigate('login'); // Redirect to login screen
          } else {
            // Registration failed
            setLoading(false);
            Alert.alert(response.message); // Show error message
          }
        })
        .catch(error => {
          // Handle any errors during the fetch call
          setLoading(false);
          Alert.alert('Internal server error');
        });
    } else {
      // If validation fails, reset password fields and stop loading
      setPassword('');
      setCpassword('');
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{color: 'white', fontSize: 25, paddingLeft: 20}}>
          KRODhFit
        </Text>
      </View>

      {/* Registration Form */}
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

        {/* Register Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            {loading ? (
              <PlaceholderLoader /> // Show loading spinner while submitting
            ) : (
              <Text
                style={{
                  fontSize: 24,
                  color: '#fff',
                  textTransform: 'uppercase',
                }}>
                Register
              </Text>
            )}
          </TouchableOpacity>

          {/* Link to login page if the user already has an account */}
          <View style={{flexDirection: 'row', gap: 6}}>
            <Text style={{color: '#d9d9d9'}}>Old User?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('login'); // Navigate to login screen
              }}>
              <Text style={{color: '#8a445f'}}>Login here.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// Styles for the component
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
  registerButton: {
    height: 60,
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
