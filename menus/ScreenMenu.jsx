import React, { useContext, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

// Components
import { AuthContext } from '../context/authContext';
import { TabButton } from '../components/NavigationBtn';

// Screens
import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';

// Constants
import { initialState } from '../context/initialState';
import { SERVER_URL } from '@env';
import { TAB_CONFIG } from '../constants/navigation';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * ScreenMenu component handles the main navigation structure of the app.
 * It conditionally renders either the authentication stack or the main tab navigation
 * based on the user's authentication status.
 */
const ScreenMenu = () => {
  const { state, setState } = useContext(AuthContext);
  const { username } = state.user.info;

  /**
   * Handles user logout by clearing local storage and resetting app state
   */
  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/logout`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: state.user.info.username,
          deviceId: state.deviceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setState(initialState);
      await AsyncStorage.multiRemove(['user', 'deviceId', 'events']);
    } catch (error) {
      console.error('Logout error:', error);
      // TODO: Add proper error handling UI
    }
  }, [state.user.info.username, state.deviceId, setState]);

  if (!username) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          component={Register}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {username ? `Hello, ${username}` : 'Hello'}
        </Text>
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
          accessibilityLabel="Logout button"
        >
          <Icon name="power-off" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Tab.Navigator
        screenOptions={TAB_SCREEN_OPTIONS}
        initialRouteName="dashboard"
      >
        {TAB_CONFIG.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => <TabButton {...props} item={item} />,
            }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

ScreenMenu.propTypes = {
  navigation: PropTypes.object,
};

const TAB_SCREEN_OPTIONS = {
  headerShown: false,
  tabBarStyle: {
    height: 60,
    position: 'absolute',
    margin: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0909',
  },
  header: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#45015d',
  },
  greeting: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginRight: 10,
  },
});

export default ScreenMenu;
