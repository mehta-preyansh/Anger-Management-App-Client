import React, {useContext, useEffect, useRef} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';
import Feedback from '../screens/user/Feedback';
import {AuthContext} from '../context/authContext';
import Logbook from '../screens/user/Logbook';
import Dashboard from '../screens/user/Dashboard';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Icons} from '../components/Icons';
import {TabButton} from '../components/NavigationBtn';
import {View} from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { initialState } from '../context/initialState';

const ScreenMenu = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [state, setState] = useContext(AuthContext);
  const authenticatedUser = state.user.info.username;

  const tabArr = [
    {
      route: 'logbook',
      label: 'Logbook',
      component: Logbook,
      inactiveIcon: 'book-outline',
      activeIcon: 'book',
      iconType: Icons.Ionicons,
    },
    {
      route: 'dashboard',
      label: 'Dashboard',
      component: Dashboard,
      inactiveIcon: 'view-dashboard-outline',
      activeIcon: 'view-dashboard',
      iconType: Icons.MaterialCommunityIcons,
    },
    {
      route: 'feedback',
      label: 'Feedback',
      component: Feedback,
      inactiveIcon: 'page',
      activeIcon: 'page-edit',
      iconType: Icons.Foundation,
    },
  ];

  const logout = async () => {
    setState(initialState);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('events');
  };

  return (
    <>
      {authenticatedUser ? (
        <View style={{flex:1, backgroundColor: '#0b0909'}}>
          <View style={styles.headingWrapper}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              {`Hello, ${state.user.info.username}`}
            </Text>
            <TouchableOpacity onPress={logout} style={{marginRight: 10}}>
              <Icon name="power-off" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <Tab.Navigator screenOptions={tabScreenOptions} initialRouteName='dashboard'>
            {tabArr.map((item, index) => {
              return (
                <Tab.Screen
                  key={index}
                  name={item.route}
                  component={item.component}
                  options={{
                    tabBarShowLabel: false,
                    tabBarButton: props => <TabButton {...props} item={item} />,
                  }}
                />
              );
            })}
          </Tab.Navigator>
        </View>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="register"
            component={Register}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      )}
    </>
  );
};

export default ScreenMenu;

const tabScreenOptions = {
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
  headingWrapper: {
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
});
