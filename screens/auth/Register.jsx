import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SERVER_URL} from '@env';
import {PlaceholderLoader} from '../../components/PlaceholderLoader';
import PropTypes from 'prop-types';

// Validation utility functions
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validateForm = (formData) => {
  const {email, username, password, cpassword} = formData;
  const errors = {};

  if (!email || !validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!username) {
    errors.username = 'Username is required';
  }
  if (!password || !validatePassword(password)) {
    errors.password = 'Password must be at least 8 characters long';
  }
  if (password !== cpassword) {
    errors.cpassword = 'Passwords do not match';
  }

  return errors;
};

const Register = ({navigation}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    cpassword: '',
    email: '',
    mobile: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  }, [errors]);

  const handleRegister = useCallback(async () => {
    setLoading(true);
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert('Success', data.message);
        navigation.navigate('login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Error',
        error.message === 'Network request failed' 
          ? 'Please check your internet connection and try again.'
          : 'An error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [formData, navigation]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>KRODhFit</Text>
      </View>

      <View style={styles.loginForm}>
        <View style={styles.inputFields}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email *"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholderTextColor="#ffffff95"
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email input"
            accessibilityHint="Enter your email address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="Username *"
            value={formData.username}
            onChangeText={(value) => handleInputChange('username', value)}
            placeholderTextColor="#ffffff95"
            autoCapitalize="none"
            accessibilityLabel="Username input"
            accessibilityHint="Enter your username"
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            value={formData.mobile}
            onChangeText={(value) => handleInputChange('mobile', value)}
            placeholderTextColor="#ffffff95"
            keyboardType="phone-pad"
            accessibilityLabel="Mobile number input"
            accessibilityHint="Enter your mobile number (optional)"
          />

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Password *"
            secureTextEntry={true}
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholderTextColor="#ffffff95"
            accessibilityLabel="Password input"
            accessibilityHint="Enter your password"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            style={[styles.input, errors.cpassword && styles.inputError]}
            placeholder="Confirm Password *"
            secureTextEntry={true}
            value={formData.cpassword}
            onChangeText={(value) => handleInputChange('cpassword', value)}
            placeholderTextColor="#ffffff95"
            accessibilityLabel="Confirm password input"
            accessibilityHint="Confirm your password"
          />
          {errors.cpassword && <Text style={styles.errorText}>{errors.cpassword}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Register button"
            accessibilityHint="Tap to complete registration"
          >
            {loading ? (
              <PlaceholderLoader />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Old User?</Text>
            <TouchableOpacity
              onPress={() => navigation.replace('login')}
              accessibilityRole="button"
              accessibilityLabel="Login link"
              accessibilityHint="Tap to go to login screen"
            >
              <Text style={styles.loginLink}>Login here.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

Register.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
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
  headerText: {
    color: 'white',
    fontSize: 25,
    paddingLeft: 20,
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
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ff4444',
    alignSelf: 'flex-start',
    marginTop: -15,
    marginBottom: 5,
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
  registerButtonText: {
    fontSize: 24,
    color: '#fff',
    textTransform: 'uppercase',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  loginText: {
    color: '#d9d9d9',
  },
  loginLink: {
    color: '#8a445f',
  },
});

export default Register;
